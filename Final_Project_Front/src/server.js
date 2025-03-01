const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const schedule = require("node-schedule");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

schedule.scheduleJob("0 8 * * *", async () => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: "user@example.com", 
      subject: "Daily Reading Reminder 📖",
      text: "Don't forget to read your book today! 📚",
    };
    await transporter.sendMail(mailOptions);
    console.log("Reminder sent successfully!");
  } catch (error) {
    console.error("Error sending reminder:", error);
  }
});

app.post("/send-reminder", async (req, res) => {
  const { email } = req.body;
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Reading Reminder 📖",
      text: "Time to read your book today! 📚",
    });
    res.status(200).json({ message: "Reminder sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send reminder" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
