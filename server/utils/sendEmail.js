const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Hostinger SMTP Ayarları
  // Bu ayarları .env dosyasından çekeceğiz
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: process.env.SMTP_PORT || 465,
    secure: true, // 465 için true, 587 için false
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || 'EmekShop Security'} <${process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.html, // HTML formatında mail göndermek için
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
