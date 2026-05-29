const nodemailer = require("nodemailer");
const env = require("../config/enviroment");

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  secure: false,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

const sendMail = async ({ to, subject, html }) => {
  if (!env.EMAIL_USER) {
    console.log("[Email mock]", { to, subject });
    return;
  }
  await transporter.sendMail({ from: env.EMAIL_FROM, to, subject, html });
};

const sendAppointmentConfirmed = async ({ email, hoTen, ngayHen, gioBatDau, tenBacSi }) => {
  await sendMail({
    to: email,
    subject: "Lịch hẹn của bạn đã được xác nhận",
    html: `
      <h2>Xin chào ${hoTen},</h2>
      <p>Lịch hẹn của bạn đã được <strong>xác nhận</strong>.</p>
      <ul>
        <li>Bác sĩ: ${tenBacSi}</li>
        <li>Ngày khám: ${ngayHen}</li>
        <li>Giờ khám: ${gioBatDau}</li>
      </ul>
      <p>Vui lòng đến đúng giờ. Trân trọng!</p>
    `,
  });
};

const sendAppointmentCancelled = async ({ email, hoTen, ngayHen, gioBatDau, tenBacSi, lyDo }) => {
  await sendMail({
    to: email,
    subject: "Thông báo hủy lịch hẹn",
    html: `
      <h2>Xin chào ${hoTen},</h2>
      <p>Lịch hẹn của bạn đã bị <strong>hủy</strong>.</p>
      <ul>
        <li>Bác sĩ: ${tenBacSi}</li>
        <li>Ngày khám: ${ngayHen}</li>
        <li>Giờ khám: ${gioBatDau}</li>
        ${lyDo ? `<li>Lý do: ${lyDo}</li>` : ""}
      </ul>
      <p>Nếu cần hỗ trợ, vui lòng liên hệ phòng khám. Trân trọng!</p>
    `,
  });
};

const sendOTPEmail = async ({ email, otp, hoTen }) => {
  await sendMail({
    to: email,
    subject: "Mã xác thực tài khoản - PhongKham",
    html: `
      <h2>Xin chào ${hoTen || "bạn"},</h2>
      <p>Mã xác thực của bạn là:</p>
      <h1 style="letter-spacing:6px; color:#2563eb;">${otp}</h1>
      <p>Mã có hiệu lực trong <strong>10 phút</strong>. Không chia sẻ mã này cho bất kỳ ai.</p>
    `,
  });
};

module.exports = { sendMail, sendAppointmentConfirmed, sendAppointmentCancelled, sendOTPEmail };
