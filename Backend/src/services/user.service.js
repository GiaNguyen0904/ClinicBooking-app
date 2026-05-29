const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const { generateToken } = require("../utils/jwt.utils");
const { sendOTPEmail } = require("../utils/email.utils");

// In-memory OTP store { email -> { otp, expires, pendingData } }
const otpStore = new Map();

const generateOTP = () => String(Math.floor(100000 + Math.random() * 900000));

const userService = {
  // ===================== REGISTER =====================
  async initiateRegister(data) {
    const { TenDangNhap, MatKhau, HoTen, NgaySinh, GioiTinh, SoDienThoai, DiaChi } = data;

    // Validate required fields
    if (!TenDangNhap || !MatKhau || !HoTen || !NgaySinh || !GioiTinh || !SoDienThoai || !DiaChi) {
      throw new Error("Vui lòng điền đầy đủ thông tin.");
    }

    // Check duplicate
    const [existing] = await userModel.findByUsername(TenDangNhap);
    if (existing.length > 0) throw new Error("Tên đăng nhập đã tồn tại.");

    const hashedPassword = await bcrypt.hash(MatKhau, 10);
    const otp = generateOTP();
    const expires = Date.now() + 10 * 60 * 1000; // 10 phút

    otpStore.set(TenDangNhap, {
      otp,
      expires,
      pendingData: { TenDangNhap, MatKhau: hashedPassword, HoTen, NgaySinh, GioiTinh, SoDienThoai, DiaChi },
    });

    await sendOTPEmail({ email: TenDangNhap, otp, hoTen: HoTen });

    return { message: "Mã OTP đã được gửi về email. Vui lòng xác thực để hoàn tất đăng ký." };
  },

  async verifyRegisterOTP({ TenDangNhap, OTP }) {
    const record = otpStore.get(TenDangNhap);
    if (!record) throw new Error("Không tìm thấy yêu cầu đăng ký. Vui lòng thử lại.");
    if (Date.now() > record.expires) {
      otpStore.delete(TenDangNhap);
      throw new Error("Mã OTP đã hết hạn. Vui lòng đăng ký lại.");
    }
    if (record.otp !== String(OTP)) throw new Error("Mã OTP không đúng.");

    const { TenDangNhap: email, MatKhau, HoTen, NgaySinh, GioiTinh, SoDienThoai, DiaChi } = record.pendingData;

    const [accResult] = await userModel.createAccount({ TenDangNhap: email, MatKhau, VaiTro: "Khách hàng" });
    const MaTaiKhoan = accResult.insertId;

    await userModel.createBenhNhan({ HoTen, NgaySinh, GioiTinh, SoDienThoai, DiaChi, MaTaiKhoan });

    otpStore.delete(TenDangNhap);

    return { message: "Đăng ký thành công! Vui lòng đăng nhập." };
  },

  // ===================== LOGIN =====================
  async login({ TenDangNhap, MatKhau }) {
    if (!TenDangNhap || !MatKhau) throw new Error("Vui lòng nhập tên đăng nhập và mật khẩu.");

    const [rows] = await userModel.findByUsername(TenDangNhap);
    if (rows.length === 0) throw new Error("Tên đăng nhập hoặc mật khẩu không đúng.");

    const account = rows[0];
    const isMatch = await bcrypt.compare(MatKhau, account.MatKhau);
    if (!isMatch) throw new Error("Tên đăng nhập hoặc mật khẩu không đúng.");

    let profile = null;
    if (account.VaiTro === "Khách hàng") {
      const [profileRows] = await userModel.findBenhNhanByTaiKhoan(account.MaTaiKhoan);
      profile = profileRows[0] || null;
    } else if (account.VaiTro === "Bác sĩ") {
      const [profileRows] = await userModel.findBacSiByTaiKhoan(account.MaTaiKhoan);
      profile = profileRows[0] || null;
    }

    const tokenPayload = {
      MaTaiKhoan: account.MaTaiKhoan,
      TenDangNhap: account.TenDangNhap,
      VaiTro: account.VaiTro,
      MaHoSo: profile?.MaBenhNhan || profile?.MaBacSi || null,
    };

    const token = generateToken(tokenPayload);

    return {
      message: "Đăng nhập thành công.",
      token,
      user: {
        MaTaiKhoan: account.MaTaiKhoan,
        TenDangNhap: account.TenDangNhap,
        VaiTro: account.VaiTro,
        profile,
      },
    };
  },

  // ===================== PROFILE =====================
  async getProfile(MaTaiKhoan, VaiTro) {
    if (VaiTro === "Khách hàng") {
      const [rows] = await userModel.findBenhNhanByTaiKhoan(MaTaiKhoan);
      if (rows.length === 0) throw new Error("Không tìm thấy thông tin bệnh nhân.");
      return rows[0];
    } else if (VaiTro === "Bác sĩ") {
      const [rows] = await userModel.findBacSiByTaiKhoan(MaTaiKhoan);
      if (rows.length === 0) throw new Error("Không tìm thấy thông tin bác sĩ.");
      return rows[0];
    }
    return { MaTaiKhoan, VaiTro };
  },

  async updateProfile(MaTaiKhoan, VaiTro, data) {
    if (VaiTro !== "Khách hàng") throw new Error("Chỉ bệnh nhân mới có thể cập nhật hồ sơ này.");
    const [rows] = await userModel.findBenhNhanByTaiKhoan(MaTaiKhoan);
    if (rows.length === 0) throw new Error("Không tìm thấy bệnh nhân.");
    const bn = rows[0];
    await userModel.updateBenhNhan(bn.MaBenhNhan, data);
    return { message: "Cập nhật thông tin thành công." };
  },

  // ===================== DOCTORS =====================
  async getAllDoctors() {
    const [rows] = await userModel.getAllBacSi();
    return rows;
  },

  async getDoctorById(MaBacSi) {
    const [rows] = await userModel.getBacSiById(MaBacSi);
    if (rows.length === 0) throw new Error("Bác sĩ không tồn tại.");
    return rows[0];
  },
};

module.exports = userService;
