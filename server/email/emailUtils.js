const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendEmail = async (data) => {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465, // For SSL
        secure: true,
        auth: {
        //   user: "cumulus545@gmail.com",
        //   pass: "capr cvjb vrxf ygbt",
        user: "support@cumulus.rip",
        pass: "ijxk fenl onyf txcb",
        },
      });
      const mailOptions = {
        from: '"Cumulus-rip" <support@cumulus.rip>',
        to: data.to,           // recipient's email
        subject: data.subject, // subject line
        html: data.body,       // HTML body
      };
      const info = await transporter.sendMail(mailOptions);
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      return { success: true, previewURL: nodemailer.getTestMessageUrl(info) };
    } catch (error) {
      console.error("Error sending email:", error);
      return { success: false, error };
    }
  };
  
const sendQuestionEmail = async (query, userEmail) => {
    try {
        if (!query) {
            throw new Error('Query cannot be empty');
        }
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465, // For SSL
            secure: true,
            auth: {
                user: "support@cumulus.rip", // Your email
                pass: "ijxk fenl onyf txcb",
            },
        });
        const mailOptions = {
            from: `"${userEmail}" <${userEmail}>`, // Use logged-in user's email
            to: "support@cumulus.rip", // Replace with your email
            subject: `New Query from ${userEmail}`,
            text: `You have received a new query:\n\n${query}`,
        };
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
router.post('/sendhelpqueries', async (req, res) => {
    const { query, email } = req.body; // Extract query and email from request body
    if (!query || !email) {
        return res.status(400).json({ message: 'Query and email are required' });
    }
    try {
        // Send the query via email
        await sendQuestionEmail(query, email);
        res.status(200).json({ message: 'Query submitted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error submitting query. Please try again later.' });
    }
});
router.post('/sendqueries', async (req, res) => {
    const formData = req.body;

    try {
        await sendEmail(formData);
        res.status(200).json({ message: 'Query submitted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting query. Please try again later.' });
    }
});

module.exports = { 
    router, 
    generateOTP, 
    sendEmail 
  };