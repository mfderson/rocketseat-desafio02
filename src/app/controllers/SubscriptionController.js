import { Op } from 'sequelize';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Meetup from '../models/Meetup';
import User from '../models/User';
import Subscription from '../models/Subscription';
import Mail from '../../lib/Mail';

class SubscriptionController {
  async index(req, res) {
    const subscriptions = await Subscription.findAll({
      where: { user_id: req.userId },
      include: {
        model: Meetup,
        where: {
          date: {
            [Op.gt]: new Date(),
          },
        },
      },
      required: true,
      order: [[Meetup, 'date']],
    });

    return res.json(subscriptions);
  }

  async store(req, res) {
    const user = await User.findByPk(req.userId);
    const meetup = await Meetup.findByPk(req.params.meetupId, {
      include: [
        {
          model: User,
          as: 'user',
        },
      ],
    });

    if (meetup.user_id === req.userId) {
      return res
        .status(400)
        .json({ error: "Can't subscribe to you own meetups" });
    }

    if (meetup.past) {
      return res.status(400).json({ error: "Can't subscribe to past meetups" });
    }

    const checkDate = await Subscription.findOne({
      where: {
        user_id: user.id,
      },
      include: [
        {
          model: Meetup,
          required: true, // apenas usuarios que tem um meetup aparecerao
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    if (checkDate) {
      return res
        .status(400)
        .json({ error: "Can't subscribe to two meetups at the same time" });
    }

    const subscription = await Subscription.create({
      user_id: user.id,
      meetup_id: meetup.id,
    });

    await Mail.sendMail({
      to: `${meetup.user.name} <${meetup.user.email}>`,
      subject: 'Nova inscrição no meetup',
      template: 'subscription',
      context: {
        speaker: meetup.user.name,
        registered: user.name,
        meetup: meetup.title,
        date: format(meetup.date, "dd 'de' MMMM 'de' yyyy", { locale: pt }),
      },
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
