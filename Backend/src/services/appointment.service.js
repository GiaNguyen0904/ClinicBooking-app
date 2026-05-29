const appointmentModel = require('../models/appointment.model');

const VALID_STATUSES = ['Chờ xác nhận', 'Đã xác nhận', 'Đang thực hiện', 'Hoàn thành', 'Đã hủy'];
const MAX_ACTIVE_APPOINTMENTS = 3;

const appointmentService = {
  async getAvailableSlots(MaBacSi, Ngay) {
    return await appointmentModel.getAvailableSlots(MaBacSi, Ngay);
  },

 async createAppointment(data) {
  const {
    MaBenhNhan,
    MaBacSi,
    MaKhungGio,
    NgayHen,
    DichVu = [],
  } = data;

  // CHECK BỆNH NHÂN
  const patient =
    await appointmentModel.getPatientById(
      MaBenhNhan
    );

  if (patient.length === 0) {
    throw new Error(
      'Bệnh nhân không tồn tại'
    );
  }

  // CHECK BÁC SĨ
  const doctor =
    await appointmentModel.getDoctorById(
      MaBacSi
    );

  if (doctor.length === 0) {
    throw new Error(
      'Bác sĩ không tồn tại'
    );
  }

  // GIỚI HẠN LỊCH ĐANG HOẠT ĐỘNG
  const activeCount =
    await appointmentModel.countActiveAppointments(
      MaBenhNhan
    );

  if (
    activeCount[0].total >=
    MAX_ACTIVE_APPOINTMENTS
  ) {
    throw new Error(
      'Mỗi bệnh nhân chỉ được có tối đa 3 lịch hẹn đang hoạt động'
    );
  }

  // LẤY THÔNG TIN KHUNG GIỜ
  const slot =
    await appointmentModel.getSlotWithBookedCount(
      MaKhungGio
    );

  if (slot.length === 0) {
    throw new Error(
      'Khung giờ không tồn tại'
    );
  }

  // CHECK KHUNG GIỜ THUỘC BÁC SĨ
  if (
    slot[0].MaBacSi !==
    Number(MaBacSi)
  ) {
    throw new Error(
      'Khung giờ không thuộc bác sĩ này'
    );
  }

  // CHECK SLOT ĐÃ ĐẦY
  if (
    slot[0].SoLuongDaDat >=
    slot[0].SoLuongToiDa
  ) {
    throw new Error(
      'Khung giờ này đã đầy'
    );
  }

  // VALIDATE KHÔNG CHO ĐẶT LỊCH QUÁ KHỨ
  const ngay =
    slot[0].Ngay
      .toISOString()
      .slice(0, 10);

  const gio =
    slot[0].GioBatDau.toString();

  const appointmentTime =
    new Date(`${ngay}T${gio}`);

  const now = new Date();

  if (appointmentTime <= now) {
    throw new Error(
      'Không thể đặt lịch trong quá khứ'
    );
  }

  // VALIDATE DỊCH VỤ
  if (DichVu.length > 0) {
    const serviceIds =
      DichVu.map(
        (item) => item.MaDichVu
      );

    const services =
      await appointmentModel.getServicesByIds(
        serviceIds
      );

    if (
      services.length !==
      serviceIds.length
    ) {
      throw new Error(
        'Có dịch vụ không tồn tại'
      );
    }
  }

  // TẠO LỊCH HẸN
  const created =
    await appointmentModel.createAppointment({
      MaBenhNhan,
      MaBacSi,
      MaKhungGio,
      NgayHen,
    });

  const MaLichHen =
    created.insertId;

  // THÊM DỊCH VỤ
  for (const item of DichVu) {
    await appointmentModel.addAppointmentService(
      MaLichHen,
      item.MaDichVu,
      item.SoLuong
    );
  }

  return {
    message: 'Đặt lịch thành công',
    MaLichHen,
  };
},

  async getAllAppointments(filter = {}) {
    return await appointmentModel.getAllAppointments(filter);
  },

  async getAppointmentById(MaLichHen) {
    const appointment = await appointmentModel.getAppointmentById(MaLichHen);
    if (appointment.length === 0) throw new Error('Lịch hẹn không tồn tại');

    const services = await appointmentModel.getAppointmentServices(MaLichHen);
    const TongTien = services.reduce((sum, item) => sum + Number(item.ThanhTien), 0);

    return { ...appointment[0], DichVu: services, TongTien };
  },

  async getAppointmentsByPatient(MaBenhNhan) {
    return await appointmentModel.getAppointmentsByPatient(MaBenhNhan);
  },

  async updateAppointmentStatus(MaLichHen, TrangThai) {
    if (!VALID_STATUSES.includes(TrangThai)) throw new Error('Trạng thái lịch hẹn không hợp lệ');

    const appointment = await appointmentModel.getAppointmentStatusById(MaLichHen);
    if (appointment.length === 0) throw new Error('Lịch hẹn không tồn tại');

    await appointmentModel.updateAppointmentStatus(MaLichHen, TrangThai);
    return { message: 'Cập nhật trạng thái lịch hẹn thành công' };
  },

  async cancelAppointment(MaLichHen) {
    const appointment = await appointmentModel.getAppointmentForCancel(MaLichHen);

    if (appointment.length === 0) throw new Error('Lịch hẹn không tồn tại');
    if (appointment[0].TrangThai === 'Đã hủy') throw new Error('Lịch hẹn đã bị hủy trước đó');
    if (appointment[0].TrangThai === 'Hoàn thành') throw new Error('Không thể hủy lịch hẹn đã hoàn thành');

    const ngay = appointment[0].Ngay.toISOString().slice(0, 10);
    const appointmentTime = new Date(`${ngay}T${appointment[0].GioBatDau}`);
    const diffHours = (appointmentTime - new Date()) / (1000 * 60 * 60);

    if (diffHours < 3) throw new Error('Chỉ được hủy lịch trước giờ khám ít nhất 3 tiếng');

    await appointmentModel.cancelAppointment(MaLichHen);
    return { message: 'Hủy lịch hẹn thành công' };
  }
};

module.exports = appointmentService;