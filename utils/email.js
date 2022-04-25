const nodemailer = require('nodemailer');

const cb = (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log('Message sent: %s', info.messageId);
};

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.name = user.name;
    this.url = url;
    this.from = `Netflix <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // Send the actual email
  async sendPasswordReset() {
    const text = `hi ${this.name}! 
      Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${this.url}.
      If you didn't forget your password, please ignore this email!`;
    const subject = 'Your password reset token (valid for only 10 minutes)';
    // 2) Define email options
    console.log(this);
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions, cb);
  }

  // Send the actual email
  async sendWelcome() {
    const text = `hi ${this.name}! 
      Welcome to Netflix, we're glad to have you
      If you need any help, please don't hesitate to contact me!`;
    const subject = 'Welcome to the Netflix!';
    // 2) Define email options
    console.log(this);
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text
    };
    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions, cb);
  }
};
