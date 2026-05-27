const medicalRecordModel = require('../models/medical-record.model');

const medicalRecordService = {
  async createMedicalRecord(data) {
    const { MaBenhNhan, MaBacSi, ChanDoan, NgayLap, DonThuoc = null, KetQuaXetNghiem = [] } = data;

    const patient = await medicalRecordModel.getPatientById(MaBenhNhan);
    if (patient.length === 0) throw new Error('Bệnh nhân không tồn tại');

    const doctor = await medicalRecordModel.getDoctorById(MaBacSi);
    if (doctor.length === 0) throw new Error('Bác sĩ không tồn tại');

    const created = await medicalRecordModel.createMedicalRecord({ MaBenhNhan, MaBacSi, ChanDoan, NgayLap });
    const MaBenhAn = created.insertId;

    if (DonThuoc && DonThuoc.NoiDung) {
      await medicalRecordModel.createPrescription({
        MaBenhAn,
        NoiDung: DonThuoc.NoiDung,
        NgayKe: DonThuoc.NgayKe
      });
    }

    for (const item of KetQuaXetNghiem) {
      await medicalRecordModel.createTestResult({
        MaBenhAn,
        TenXetNghiem: item.TenXetNghiem,
        KetQua: item.KetQua,
        NgayXetNghiem: item.NgayXetNghiem
      });
    }

    return { message: 'Tạo bệnh án thành công', MaBenhAn };
  },

  async getMedicalRecordById(MaBenhAn) {
    const record = await medicalRecordModel.getMedicalRecordById(MaBenhAn);
    if (record.length === 0) throw new Error('Bệnh án không tồn tại');

    const DonThuoc = await medicalRecordModel.getPrescriptionsByRecord(MaBenhAn);
    const KetQuaXetNghiem = await medicalRecordModel.getTestResultsByRecord(MaBenhAn);

    return { ...record[0], DonThuoc, KetQuaXetNghiem };
  },

  async getMedicalRecordsByPatient(MaBenhNhan) {
    const patient = await medicalRecordModel.getPatientById(MaBenhNhan);
    if (patient.length === 0) throw new Error('Bệnh nhân không tồn tại');

    return await medicalRecordModel.getMedicalRecordsByPatient(MaBenhNhan);
  },

  async getMedicalRecordsByDoctor(MaBacSi) {
    const doctor = await medicalRecordModel.getDoctorById(MaBacSi);
    if (doctor.length === 0) throw new Error('Bác sĩ không tồn tại');

    return await medicalRecordModel.getMedicalRecordsByDoctor(MaBacSi);
  },

  async updateMedicalRecord(MaBenhAn, data) {
    const record = await medicalRecordModel.getMedicalRecordById(MaBenhAn);
    if (record.length === 0) throw new Error('Bệnh án không tồn tại');

    await medicalRecordModel.updateMedicalRecord(MaBenhAn, data);
    return { message: 'Cập nhật bệnh án thành công' };
  },

  async deleteMedicalRecord(MaBenhAn) {
    const record = await medicalRecordModel.getMedicalRecordById(MaBenhAn);
    if (record.length === 0) throw new Error('Bệnh án không tồn tại');

    await medicalRecordModel.deleteMedicalRecord(MaBenhAn);
    return { message: 'Xóa bệnh án thành công' };
  },

  async addPrescription(MaBenhAn, data) {
    const record = await medicalRecordModel.getMedicalRecordById(MaBenhAn);
    if (record.length === 0) throw new Error('Bệnh án không tồn tại');

    const created = await medicalRecordModel.createPrescription({
      MaBenhAn,
      NoiDung: data.NoiDung,
      NgayKe: data.NgayKe
    });

    return { message: 'Thêm đơn thuốc thành công', MaDonThuoc: created.insertId };
  },

  async updatePrescription(MaDonThuoc, data) {
    await medicalRecordModel.updatePrescription(MaDonThuoc, data);
    return { message: 'Cập nhật đơn thuốc thành công' };
  },

  async deletePrescription(MaDonThuoc) {
    await medicalRecordModel.deletePrescription(MaDonThuoc);
    return { message: 'Xóa đơn thuốc thành công' };
  },

  async addTestResult(MaBenhAn, data) {
    const record = await medicalRecordModel.getMedicalRecordById(MaBenhAn);
    if (record.length === 0) throw new Error('Bệnh án không tồn tại');

    const created = await medicalRecordModel.createTestResult({
      MaBenhAn,
      TenXetNghiem: data.TenXetNghiem,
      KetQua: data.KetQua,
      NgayXetNghiem: data.NgayXetNghiem
    });

    return { message: 'Thêm kết quả xét nghiệm thành công', MaKetQua: created.insertId };
  },

  async updateTestResult(MaKetQua, data) {
    await medicalRecordModel.updateTestResult(MaKetQua, data);
    return { message: 'Cập nhật kết quả xét nghiệm thành công' };
  },

  async deleteTestResult(MaKetQua) {
    await medicalRecordModel.deleteTestResult(MaKetQua);
    return { message: 'Xóa kết quả xét nghiệm thành công' };
  }
};

module.exports = medicalRecordService;