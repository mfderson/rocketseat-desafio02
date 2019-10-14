export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  scure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  default: {
    from: 'Equipe Meetup <noreplay@meetup.com>',
  },
};
