require("dotenv").config();

const env = {
  PORT: process.env.PORT || 3000,
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: process.env.DB_PORT || 3306,
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "123456",
  DB_NAME: process.env.DB_NAME || "PhongKham",
  JWT_SECRET: process.env.JWT_SECRET || "phongkham_secret_key",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  EMAIL_HOST: process.env.EMAIL_HOST || "smtp.gmail.com",
  EMAIL_PORT: process.env.EMAIL_PORT || 587,
  EMAIL_USER: process.env.EMAIL_USER || "",
  EMAIL_PASS: process.env.EMAIL_PASS || "",
  EMAIL_FROM: process.env.EMAIL_FROM || "PhongKham <no-reply@phongkham.vn>",
  MAX_ACTIVE_APPOINTMENTS: parseInt(process.env.MAX_ACTIVE_APPOINTMENTS) || 3,
  CANCEL_HOURS_BEFORE: parseInt(process.env.CANCEL_HOURS_BEFORE) || 3,
};

module.exports = env;
