import Meetup from '../models/Meetup';

class SubscriptionController {
  async store(req, res) {
    const meetup = await Meetup.findByPk(req.params.meetupId);

    if (meetup.user_id === req.userId) {
      return res
        .status(400)
        .json({ error: "Can't subscribe to you own meetups" });
    }

    if (meetup.past) {
      return res.status(400).json({ error: "Can't subscribe to past meetups" });
    }

    return res.json();
  }
}

export default new SubscriptionController();
