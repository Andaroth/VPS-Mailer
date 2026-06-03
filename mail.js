require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const port = process.env.PORT;
const host = process.env.HOST;
const https = false;

// Enable CORS for all routes
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : [`http://${host}:${port}`];

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test endpoint
app.get("/api/v1/status", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true
  requireTLS: true,
  tls: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: false,
  },
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify(function (error, _) {
  if (error) {
    console.error("SMTP Error:", error);
  } else {
    console.log("SMTP OK");
  }
});

app.post("/api/v1/sendMail", (req, res) => {
  try {
    const { message, mailto, subject } = req.body;

    if (!message || !mailto || !subject) {
      return res
        .status(400)
        .json({ error: "Missing required fields: message, mailto, subject" });
    }

    const mailParams = {
      from: process.env.SMTP_USER,
      to: mailto || "_@_._",
      subject: subject || "Subject",
      text: message || "",
    };

    transporter.sendMail(mailParams, (error, info) => {
      if (error) {
        console.error("Email error:", error);
        return res
          .status(500)
          .json({ error: "Failed", details: error.message });
      }
      console.log("Email sent successfully:", info.response);
      res.status(200).json({ message: "Success", response: info.response });
    });
  } catch (error) {
    console.error("Server error:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

app.listen(port, host, () => {
  console.log(
    `Serveur listening to ${https ? "https" : "http"}://${host}:${port}`,
  );
});
