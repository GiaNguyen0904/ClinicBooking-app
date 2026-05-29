const serviceModel = require("../models/service.model");

const serviceService = {
  async getAll(filter = {}) {
    const [rows] = await serviceModel.getAll(filter);
    return rows;
  },

  async getById(MaDichVu) {
    const [rows] = await serviceModel.getById(MaDichVu);
    if (rows.length === 0) throw new Error("Dịch vụ không tồn tại.");
    return rows[0];
  },

  async create(data) {
    const { TenDichVu, Gia } = data;
    if (!TenDichVu || !Gia) throw new Error("Tên dịch vụ và giá là bắt buộc.");
    const [result] = await serviceModel.create(data);
    return { message: "Thêm dịch vụ thành công.", MaDichVu: result.insertId };
  },

  async update(MaDichVu, data) {
    const [existing] = await serviceModel.getById(MaDichVu);
    if (existing.length === 0) throw new Error("Dịch vụ không tồn tại.");
    await serviceModel.update(MaDichVu, data);
    return { message: "Cập nhật dịch vụ thành công." };
  },

  async delete(MaDichVu) {
    const [existing] = await serviceModel.getById(MaDichVu);
    if (existing.length === 0) throw new Error("Dịch vụ không tồn tại.");
    await serviceModel.delete(MaDichVu);
    return { message: "Xóa dịch vụ thành công." };
  },
};

module.exports = serviceService;
