const appointmentModel = require("../models/appointment.model");
const { sendAppointmentConfirmed, sendAppointmentCancelled } = require("../utils/email.utils");
const env = require("../config/enviroment");

const VALID_STATUSES = ["Chờ xác nhận", "Đã xác nhận", "Đang thực hiện", "Hoàn thành", "Đã hủy"];
const MAX_ACTIVE_APPOINTMENTS = env.MAX_ACTIVE_APPOINTMENTS;
const CANCEL_HOURS_BEFORE = env.CANCEL_HOURS_BEFORE;

const appointmentService = {
  async getAvailableSlots(MaBacSi, Ngay) {
    return await appointmentModel.getAvailableSlots(MaBacSi, Ngay);
  },

  async createAppointment(data) {
    const { MaBenhNhan, MaBacSi, MaKhungGio, NgayHen, DichVu = [] } = data;

    const patient = await appointmentModel.getPatientById(MaBenhNhan);
    if (patient.length === 0) throw new Error("Bệnh nhân không tồn tại");

    const doctor = await appointmentModel.getDoctorById(MaBacSi);
    if (doctor.length === 0) throw new Error("Bác sĩ không tồn tại");

    const activeCount = await appointmentModel.countActiveAppointments(MaBenhNhan);
    if (activeCount[0].total >= MAX_ACTIVE_APPOINTMENTS)
      throw new Error(`Mỗi bệnh nhân chỉ được có tối đa ${MAX_ACTIVE_APPOINTMENTS} lịch hẹn đang hoạt động`);

    const slot = await appointmentModel.getSlotWithBookedCount(MaKhungGio);
    if (slot.length === 0) throw new Error("Khung giờ không tồn tại");
    if (slot[0].MaBacSi !== Number(MaBacSi)) throw new Error("Khung giờ không thuộc bác sĩ này");
    if (slot[0].SoLuongDaDat >= slot[0].SoLuongToiDa) throw new Error("Khung giờ này đã đầy");

    if (DichVu.length > 0) {
      const serviceIds = DichVu.map((item) => item.MaDichVu);
      const services = await appointmentModel.getServicesByIds(serviceIds);
      if (services.length !== serviceIds.length) throw new Error("Có dịch vụ không tồn tại");
    }

    const created = await appointmentModel.createAppointment({ MaBenhNhan, MaBacSi, MaKhungGio, NgayHen });
    const MaLichHen = created.insertId;

    for (const item of DichVu) {
      await appointmentModel.addAppointmentService(MaLichHen, item.MaDichVu, item.SoLuong);
    }

    return { message: "Đặt lịch thành công", MaLichHen };
  },

  async getAllAppointments(filter = {}) {
    return await appointmentModel.getAllAppointments(filter);
  },

  async getAppointmentById(MaLichHen) {
    const appointment = await appointmentModel.getAppointmentById(MaLichHen);
    if (appointment.length === 0) throw new Error("Lịch hẹn không tồn tại");

    const services = await appointmentModel.getAppointmentServices(MaLichHen);
    const TongTien = services.reduce((sum, item) => sum + Number(item.ThanhTien), 0);

    return { ...appointment[0], DichVu: services, TongTien };
  },

  async getAppointmentsByPatient(MaBenhNhan) {
    return await appointmentModel.getAppointmentsByPatient(MaBenhNhan);
  },

  async updateAppointmentStatus(MaLichHen, TrangThai) {
    if (!VALID_STATUSES.includes(TrangThai)) throw new Error("Trạng thái lịch hẹn không hợp lệ");

    const appointment = await appointmentModel.getAppointmentById(MaLichHen);
    if (appointment.length === 0) throw new Error("Lịch hẹn không tồn tại");

    const appt = appointment[0];
    await appointmentModel.updateAppointmentStatus(MaLichHen, TrangThai);

    // Gửi email thông báo
    const email = appt.TenDangNhap || appt.SDTBenhNhan; // fallback
    if (TrangThai === "Đã xác nhận") {
      try {
        const [accRows] = await appointmentModel.getPatientEmail(appt.MaBenhNhan);
        if (accRows.length > 0 && accRows[0].TenDangNhap) {
          await sendAppointmentConfirmed({
            email: accRows[0].TenDangNhap,
            hoTen: appt.TenBenhNhan,
            ngayHen: appt.NgayHen,
            gioBatDau: appt.GioBatDau,
            tenBacSi: appt.TenBacSi,
          });
        }
      } catch (e) {
        console.warn("Không gửi được email xác nhận:", e.message);
      }
    }

    // Khi hoàn thành, reset slot (không cần làm gì vì slot chỉ tính lịch active)
    return { message: "Cập nhật trạng thái lịch hẹn thành công" };
  },

  async cancelAppointment(MaLichHen, requesterId, role) {
    const appointment = await appointmentModel.getAppointmentForCancel(MaLichHen);
    if (appointment.length === 0) throw new Error("Lịch hẹn không tồn tại");

    const appt = appointment[0];

    if (appt.TrangThai === "Đã hủy") throw new Error("Lịch hẹn đã bị hủy trước đó");
    if (appt.TrangThai === "Hoàn thành") throw new Error("Không thể hủy lịch hẹn đã hoàn thành");
    if (appt.TrangThai === "Đang thực hiện") throw new Error("Không thể hủy lịch hẹn đang thực hiện");

    // Kiểm tra quyền: bệnh nhân chỉ hủy lịch của mình
    if (role === "Khách hàng" && appt.MaBenhNhan !== requesterId) {
      throw new Error("Bạn không có quyền hủy lịch hẹn này");
    }

    // Kiểm tra thời gian (áp dụng cho bệnh nhân, admin có thể bỏ qua nếu cần)
    if (appt.Ngay && appt.GioBatDau) {
      const ngay = appt.Ngay instanceof Date ? appt.Ngay.toISOString().slice(0, 10) : appt.Ngay;
      const appointmentTime = new Date(`${ngay}T${appt.GioBatDau}`);
      const diffHours = (appointmentTime - new Date()) / (1000 * 60 * 60);
      if (diffHours < CANCEL_HOURS_BEFORE) {
        throw new Error(`Chỉ được hủy lịch trước giờ khám ít nhất ${CANCEL_HOURS_BEFORE} tiếng`);
      }
    }

    await appointmentModel.cancelAppointment(MaLichHen);

    // Gửi email thông báo hủy
    try {
      const [accRows] = await appointmentModel.getPatientEmail(appt.MaBenhNhan);
      if (accRows.length > 0 && accRows[0].TenDangNhap) {
        const [apptDetail] = await appointmentModel.getAppointmentById(MaLichHen);
        await sendAppointmentCancelled({
          email: accRows[0].TenDangNhap,
          hoTen: accRows[0].HoTen,
          ngayHen: appt.Ngay,
          gioBatDau: appt.GioBatDau,
          tenBacSi: apptDetail?.[0]?.TenBacSi || "",
        });
      }
    } catch (e) {
      console.warn("Không gửi được email hủy:", e.message);
    }

    return { message: "Hủy lịch hẹn thành công" };
  },

  async rescheduleAppointment(MaLichHen, { MaKhungGioMoi, NgayHenMoi }, requesterId, role) {
    const appointment = await appointmentModel.getAppointmentForCancel(MaLichHen);
    if (appointment.length === 0) throw new Error("Lịch hẹn không tồn tại");

    const appt = appointment[0];

    if (!["Chờ xác nhận", "Đã xác nhận"].includes(appt.TrangThai)) {
      throw new Error("Chỉ có thể đổi lịch khi ở trạng thái Chờ xác nhận hoặc Đã xác nhận");
    }

    if (role === "Khách hàng" && appt.MaBenhNhan !== requesterId) {
      throw new Error("Bạn không có quyền đổi lịch hẹn này");
    }

    // Kiểm tra 3 tiếng trước
    if (appt.Ngay && appt.GioBatDau) {
      const ngay = appt.Ngay instanceof Date ? appt.Ngay.toISOString().slice(0, 10) : appt.Ngay;
      const appointmentTime = new Date(`${ngay}T${appt.GioBatDau}`);
      const diffHours = (appointmentTime - new Date()) / (1000 * 60 * 60);
      if (diffHours < CANCEL_HOURS_BEFORE) {
        throw new Error(`Chỉ được đổi lịch trước giờ khám ít nhất ${CANCEL_HOURS_BEFORE} tiếng`);
      }
    }

    // Kiểm tra slot mới
    const slot = await appointmentModel.getSlotWithBookedCount(MaKhungGioMoi);
    if (slot.length === 0) throw new Error("Khung giờ mới không tồn tại");
    if (slot[0].SoLuongDaDat >= slot[0].SoLuongToiDa) throw new Error("Khung giờ mới đã đầy");

    await appointmentModel.rescheduleAppointment(MaLichHen, MaKhungGioMoi, NgayHenMoi);
    return { message: "Đổi lịch hẹn thành công" };
  },
};

module.exports = appointmentService;
