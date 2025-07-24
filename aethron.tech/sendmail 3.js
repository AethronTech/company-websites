// sendmail.js
// Express handler for sending contact form emails via one.com SMTP
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post('/api/sendmail', async (req, res) => {
  const { name, email, message, language, 'g-recaptcha-response': recaptchaToken } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  // Verify reCAPTCHA
  if (!recaptchaToken) {
    return res.status(400).json({ error: 'reCAPTCHA validation failed.' });
  }
  try {
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
    const verifyRes = await axios.post(verifyUrl, null, {
      params: {
        secret: process.env.RECAPTCHA_SECRET,
        response: recaptchaToken,
      },
    });
    if (!verifyRes.data.success) {
      return res.status(400).json({ error: 'reCAPTCHA verification failed.' });
    }
    await transporter.sendMail({
      from: `Aethron Contact <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECEIVER,
      subject: `Contact Form (${language || 'EN'}) from ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

const PORT = process.env.PORT || 3001;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Sendmail API running on port ${PORT}`));
}

module.exports = app;
