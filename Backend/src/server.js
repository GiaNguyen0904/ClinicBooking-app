const app = require("./app");
const con = require("./config/db");



// =========================
// API ĐĂNG NHẬP
// =========================
app.post("/login", (req, res) => {
    const { TenDangNhap, MatKhau } = req.body;

    // Kiểm tra tài khoản trong DB
    con.query(
        "SELECT MaTaiKhoan, VaiTro FROM TaiKhoan WHERE TenDangNhap = ? AND MatKhau = ?",
        [TenDangNhap, MatKhau],
        (err, result) => {
            if (err) {
                res.status(500).json({ error: "Lỗi server", detail: err });
            } else {
                if (result.length > 0) {
                    // Đăng nhập thành công
                    res.json({ 
                        MaTaiKhoan: result[0].MaTaiKhoan,
                        VaiTro: result[0].VaiTro
                    });
                } else {
                    // Sai tên đăng nhập hoặc mật khẩu
                    res.json({ error: "Tên đăng nhập hoặc mật khẩu không đúng", TenDangNhap });
                }
            }
        }
    );
});
//Test backend
// {
//     "TenDangNhap": "admin01@phongkham",
//     "MatKhau": "adminpass"
// }

// =========================
// API TẠO TÀI KHOẢN BÁC SĨ
// =========================
app.post("/register-bacsi", (req, res) => {
    const { TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, ChuyenKhoa, MaPhongKham } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!TenDangNhap || !MatKhau || !HoTen) {
        return res.status(400).json({ error: "TenDangNhap, MatKhau, HoTen không được để trống" });
    }

    // Ràng buộc TenDangNhap phải có @bacsi
    if (!TenDangNhap.endsWith("@bacsi")) {
        return res.status(400).json({ error: "TenDangNhap phải có hậu tố @bacsi" });
    }

    // 1. Tạo tài khoản với vai trò mặc định là 'Bác sĩ'
    con.query(
        "INSERT INTO TaiKhoan (TenDangNhap, MatKhau, VaiTro) VALUES (?, ?, 'Bác sĩ')",
        [TenDangNhap, MatKhau],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Lỗi khi tạo tài khoản", detail: err });
            }

            const maTaiKhoan = result.insertId;

            // 2. Tạo bản ghi bác sĩ liên kết với tài khoản vừa tạo
            con.query(
                "INSERT INTO BacSi (HoTen, SoDienThoai, Email, ChuyenKhoa, MaPhongKham, MaTaiKhoan) VALUES (?, ?, ?, ?, ?, ?)",
                [HoTen, SoDienThoai || null, Email || null, ChuyenKhoa || null, MaPhongKham || null, maTaiKhoan],
                (err2, result2) => {
                    if (err2) {
                        return res.status(500).json({ error: "Lỗi khi tạo bác sĩ", detail: err2 });
                    }
                    res.json({ message: "Tạo bác sĩ thành công", MaTaiKhoan: maTaiKhoan, MaBacSi: result2.insertId });
                }
            );
        }
    );
});

//Test backend
// {
//   "TenDangNhap": "bs01@bacsi",
//   "MatKhau": "matkhau1",
//   "HoTen": "Nguyễn Văn A",
//   "SoDienThoai": "0912345678",
//   "Email": "nguyenvana@phongkham.vn",
//   "ChuyenKhoa": "Nội tổng quát",
//   "MaPhongKham": 1
// }


// =========================
// API SỬA TÀI KHOẢN BÁC SĨ
// =========================
app.put("/bacsi/:id", (req, res) => {
    const maTaiKhoan = req.params.id;
    const { TenDangNhap, MatKhau, VaiTro, HoTen, SoDienThoai, Email, ChuyenKhoa, MaPhongKham } = req.body;

    if (!TenDangNhap || !MatKhau || !VaiTro) {
        return res.status(400).json({ error: "TenDangNhap, MatKhau, VaiTro không được để trống" });
    }

    // 1. Kiểm tra trùng tên đăng nhập
    con.query(
        "SELECT MaTaiKhoan FROM TaiKhoan WHERE TenDangNhap = ? AND MaTaiKhoan <> ?",
        [TenDangNhap, maTaiKhoan],
        (err, result) => {
            if (err) return res.status(500).json({ error: "Lỗi kiểm tra tên đăng nhập", detail: err });
            if (result.length > 0) return res.status(400).json({ error: "Tên đăng nhập đã tồn tại" });

            // 2. Cập nhật bảng TaiKhoan
            con.query(
                "UPDATE TaiKhoan SET TenDangNhap = ?, MatKhau = ?, VaiTro = ? WHERE MaTaiKhoan = ?",
                [TenDangNhap, MatKhau, VaiTro, maTaiKhoan],
                (err2, result2) => {
                    if (err2) return res.status(500).json({ error: "Lỗi cập nhật tài khoản", detail: err2 });
                    if (result2.affectedRows === 0) return res.status(404).json({ error: "Không tìm thấy tài khoản" });

                    // 3. Cập nhật bảng BacSi (nếu có thông tin bác sĩ)
                    con.query(
                        "UPDATE BacSi SET HoTen = ?, SoDienThoai = ?, Email = ?, ChuyenKhoa = ?, MaPhongKham = ? WHERE MaTaiKhoan = ?",
                        [HoTen || null, SoDienThoai || null, Email || null, ChuyenKhoa || null, MaPhongKham || null, maTaiKhoan],
                        (err3, result3) => {
                            if (err3) return res.status(500).json({ error: "Lỗi cập nhật bác sĩ", detail: err3 });
                            res.json({ message: "Cập nhật bác sĩ thành công", MaTaiKhoan: maTaiKhoan });
                        }
                    );
                }
            );
        }
    );
});

// =========================
// API XÓA TÀI KHOẢN Bác sĩ
// =========================
app.delete("/bacsi/:id", (req, res) => {
    const maTaiKhoan = req.params.id;

    // Thực hiện xóa tài khoản
    con.query(
        "DELETE FROM TaiKhoan WHERE MaTaiKhoan = ? and VaiTro = 'Bác sĩ'",
        [maTaiKhoan],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Lỗi khi xóa tài khoản", detail: err });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Không tìm thấy bác sĩ với MaTaiKhoan này" });
            }

            res.json({ message: "Xóa tài khoản thành công", MaTaiKhoan: maTaiKhoan });
        }
    );
});



// =========================
// API ĐĂNG KÝ BỆNH NHÂN
// =========================
app.post("/TaoTaiKhoanKH", (req, res) => {
    const { TenDangNhap, MatKhau, HoTen, NgaySinh, GioiTinh, SoDienThoai, DiaChi } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!TenDangNhap || !MatKhau || !HoTen || !NgaySinh || !GioiTinh || !SoDienThoai || !DiaChi) {
        return res.status(400).json({ error: "Phải nhập đủ TenDangNhap, MatKhau, HoTen, NgaySinh, GioiTinh, SoDienThoai, DiaChi" });
    }

    // Ràng buộc TenDangNhap phải có @khachhang
    if (!TenDangNhap.endsWith("@khachhang")) {
        return res.status(400).json({ error: "TenDangNhap phải có hậu tố @khachhang" });
    }

    // 1. Tạo tài khoản với vai trò mặc định là 'Khách hàng'
    con.query(
        "INSERT INTO TaiKhoan (TenDangNhap, MatKhau, VaiTro) VALUES (?, ?, 'Khách hàng')",
        [TenDangNhap, MatKhau],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Lỗi khi tạo tài khoản", detail: err });
            }

            const maTaiKhoan = result.insertId;

            // 2. Tạo bản ghi bệnh nhân liên kết với tài khoản vừa tạo
            con.query(
                "INSERT INTO BenhNhan (HoTen, NgaySinh, GioiTinh, SoDienThoai, DiaChi, MaTaiKhoan) VALUES (?, ?, ?, ?, ?, ?)",
                [HoTen, NgaySinh, GioiTinh, SoDienThoai, DiaChi, maTaiKhoan],
                (err2, result2) => {
                    if (err2) {
                        return res.status(500).json({ error: "Lỗi khi tạo bệnh nhân", detail: err2 });
                    }
                    res.json({ message: "Tạo bệnh nhân thành công", MaTaiKhoan: maTaiKhoan, MaBenhNhan: result2.insertId });
                }
            );
        }
    );
});

// {
//   "TenDangNhap": "bn06@khachhang",
//   "MatKhau": "matkhau1",
//   "HoTen": "Nguyễn Văn B",
//   "NgaySinh": "1990-05-20",
//   "GioiTinh": "NAM",
//   "SoDienThoai": "0912345678",
//   "DiaChi": "123 Lý Thường Kiệt, HCM"
// }

// =========================
// API LẤY DANH SÁCH TÀI KHOẢN
// =========================
app.get("/taikhoan", (req, res) => {
    con.query("SELECT * FROM TaiKhoan", (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Lỗi khi lấy danh sách tài khoản", detail: err });
        }
        res.json(result);
    });
});

// =========================
// API LẤY DANH SÁCH LỊCH HẸN CHI TIẾT
// =========================
app.get("/lichhen", (req, res) => {
    const sql = `
        SELECT 
            lh.MaLichHen,
            lh.NgayHen,
            lh.TrangThai,
            
            bn.MaBenhNhan,
            bn.HoTen AS TenBenhNhan,
            bn.NgaySinh,
            bn.GioiTinh,
            bn.SoDienThoai AS SDTBenhNhan,
            bn.DiaChi,

            bs.MaBacSi,
            bs.HoTen AS TenBacSi,
            bs.SoDienThoai AS SDTBacSi,
            bs.Email,
            bs.ChuyenKhoa,

            kg.MaKhungGio,
            kg.Ngay AS NgayLamViec,
            kg.GioBatDau,
            kg.GioKetThuc
        FROM LichHen lh
        JOIN BenhNhan bn ON lh.MaBenhNhan = bn.MaBenhNhan
        JOIN BacSi bs ON lh.MaBacSi = bs.MaBacSi
        LEFT JOIN KhungGio kg ON lh.MaKhungGio = kg.MaKhungGio
        ORDER BY lh.NgayHen DESC;
    `;

    con.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Lỗi khi lấy danh sách lịch hẹn", detail: err });
        }
        res.json(result);
    });
});
// =========================
// API THỐNG KÊ SỐ LỊCH HẸN CỦA BỆNH NHÂN GIẢM THEO MaBenhNhan
// =========================
app.get("/ThongKeSoLichHenCuaBenNhanGiamTheoMaBenhNhan", (req, res) => {
    const sql = `
        SELECT 
            bn.MaBenhNhan,
            bn.HoTen AS TenBenhNhan,
            COUNT(lh.MaLichHen) AS SoLanDat
        FROM LichHen lh
        JOIN BenhNhan bn ON lh.MaBenhNhan = bn.MaBenhNhan
        GROUP BY bn.MaBenhNhan, bn.HoTen
        ORDER BY SoLanDat DESC;
    `;

    con.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Lỗi khi thống kê lịch hẹn theo bệnh nhân", detail: err });
        }
        res.json(result);
    });
});


// =========================
// API THỐNG KÊ DỊCH VỤ ĐƯỢC SỬ DỤNG NHIỀU NHẤT GIẢM theo TenDichVu
// =========================
app.get("/ThongKeDichVuDuocSuDungNhieuNhatGiamMDV", (req, res) => {
    const sql = `
        SELECT 
            dv.TenDichVu,
            dv.Gia,
            SUM(ctdv.SoLuong) AS TongSoLuong
        FROM ChiTietDichVu ctdv
        JOIN DichVu dv ON ctdv.MaDichVu = dv.MaDichVu
        GROUP BY dv.MaDichVu, dv.TenDichVu, dv.Gia
        ORDER BY TongSoLuong DESC;
    `;

    con.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Lỗi khi thống kê dịch vụ", detail: err });
        }
        res.json(result);
    });
});

// =========================
// API THỐNG KÊ LỊCH HẸN GIẢM THEO BÁC SĨ
// =========================
app.get("/ThongKeLichHenGiamTheoBacSi", (req, res) => {
    const sql = `
        SELECT 
            bs.MaBacSi,
            bs.HoTen,
            COUNT(lh.MaLichHen) AS SoLuongLichHen
        FROM LichHen lh
        JOIN BacSi bs ON lh.MaBacSi = bs.MaBacSi
        GROUP BY bs.MaBacSi, bs.HoTen
        ORDER BY SoLuongLichHen DESC;
    `;

    con.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Lỗi khi thống kê lịch hẹn theo bác sĩ", detail: err });
        }
        res.json(result);
    });
});


// =========================
// API THỐNG KÊ KHUNG GIỜ ĐƯỢC ĐẶT NHIỀU NHẤT GIẢM THEO KHUNG GIỜ
// =========================
app.get("/KhungGioDuocDatNhieuNhatGiamTheoKhungGio", (req, res) => {
    const sql = `
        SELECT 
            kg.MaKhungGio,
            kg.GioBatDau,
            kg.GioKetThuc,
            COUNT(lh.MaLichHen) AS SoLuongDat
        FROM KhungGio kg
        LEFT JOIN LichHen lh ON kg.MaKhungGio = lh.MaKhungGio
        GROUP BY kg.MaKhungGio, kg.GioBatDau, kg.GioKetThuc
        ORDER BY SoLuongDat DESC;
    `;

    con.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Lỗi khi thống kê khung giờ", detail: err });
        }
        res.json(result);
    });
});


//server
app.listen(5555, () => {
    console.log('Server running at http://localhost:5555');
});
