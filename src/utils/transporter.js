const nodemailer = require('nodemailer');
const { CONFIG } = require('../config/config');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: CONFIG.MAIL_EMAIL,
        pass: CONFIG.MAIL_PASSWORD,
    },
});

const sendMail = async (to, subject, html) => {
    const mailOptions = {
        from: CONFIG.MAIL_EMAIL,
        to,
        subject,
        html,
    };
    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        return false;
    }
} 

module.exports = { transporter, sendMail };