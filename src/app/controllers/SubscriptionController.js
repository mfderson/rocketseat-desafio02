import Meetup from '../models/Meetup';

class SubscriptionController {
  async store(req, res) {
    console.log('entrou no SubscriptionController.store');
    const meetup = await Meetup.findByPk(req.params.meetupId);

    if (meetup.user_id === req.userId) {
      return res
        .status(400)
        .json({ error: "Can't subscribe to you own meetups" });
    }

    return res.json();
  }
}

export default new SubscriptionController();
