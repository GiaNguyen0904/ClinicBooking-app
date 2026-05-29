const app = require("./app");
const con = require("./config/db");

// =========================
// Helper
// =========================
const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone);
const hasWhitespace = (value) => /\s/.test(value);

// =========================
// API ĐĂNG NHẬP
// =========================
app.post("/login", (req, res) => {
    const { TenDangNhap, MatKhau } = req.body;

    if (!TenDangNhap || !MatKhau) {s
        return res.status(400).json({
            error: "TenDangNhap và MatKhau không được để trống"
        });
    }

    con.query(
        "SELECT MaTaiKhoan, VaiTro FROM TaiKhoan WHERE TenDangNhap = ? AND MatKhau = ?",
        [TenDangNhap, MatKhau],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: "Lỗi server",
                    detail: err
                });
            }

            if (result.length === 0) {
                return res.status(401).json({
                    error: "Tên đăng nhập hoặc mật khẩu không đúng"
                });
            }

            res.json({
                MaTaiKhoan: result[0].MaTaiKhoan,
                VaiTro: result[0].VaiTro
            });
        }
    );
});

// =========================
// API TẠO TÀI KHOẢN BÁC SĨ
// =========================
app.post("/register-bacsi", (req, res) => {
    let {
        TenDangNhap,
        MatKhau,
        HoTen,
        SoDienThoai,
        Email,
        ChuyenKhoa,
        MaPhongKham
    } = req.body;

    if (!TenDangNhap || !MatKhau || !HoTen) {
        return res.status(400).json({
            error: "TenDangNhap, MatKhau, HoTen không được để trống"
        });
    }

    if (!TenDangNhap.endsWith("@bacsi")) {
        return res.status(400).json({
            error: "TenDangNhap phải có hậu tố @bacsi"
        });
    }

    if (hasWhitespace(TenDangNhap)) {
        return res.status(400).json({
            error: "TenDangNhap không được chứa khoảng trắng"
        });
    }

    if (SoDienThoai) {
        if (!isValidPhone(SoDienThoai)) {
            return res.status(400).json({
                error: "Số điện thoại phải gồm đúng 10 chữ số, không chứa chữ hoặc khoảng trắng"
            });
        }
    } else {
        SoDienThoai = null;
    }

    if (Email) {
        Email = Email.toLowerCase().trim();

        if (hasWhitespace(Email)) {
            return res.status(400).json({
                error: "Email không được chứa khoảng trắng"
            });
        }
    } else {
        Email = null;
    }

    con.query(
        "SELECT MaTaiKhoan FROM TaiKhoan WHERE TenDangNhap = ?",
        [TenDangNhap],
        (errCheck, rows) => {
            if (errCheck) {
                return res.status(500).json({
                    error: "Lỗi khi kiểm tra tên đăng nhập",
                    detail: errCheck
                });
            }

            if (rows.length > 0) {
                return res.status(400).json({
                    error: "Tên đăng nhập đã tồn tại, vui lòng chọn tên khác"
                });
            }

            if (MaPhongKham) {
                con.query(
                    "SELECT MaPhongKham FROM PhongKham WHERE MaPhongKham = ?",
                    [MaPhongKham],
                    (errPK, rowsPK) => {
                        if (errPK) {
                            return res.status(500).json({
                                error: "Lỗi khi kiểm tra phòng khám",
                                detail: errPK
                            });
                        }

                        if (rowsPK.length === 0) {
                            return res.status(400).json({
                                error: "Phòng khám không tồn tại"
                            });
                        }

                        createTaiKhoanVaBacSi();
                    }
                );
            } else {
                MaPhongKham = null;
                createTaiKhoanVaBacSi();
            }

            function createTaiKhoanVaBacSi() {
                con.query(
                    "INSERT INTO TaiKhoan (TenDangNhap, MatKhau, VaiTro) VALUES (?, ?, 'Bác sĩ')",
                    [TenDangNhap, MatKhau],
                    (err, result) => {
                        if (err) {
                            return res.status(500).json({
                                error: "Lỗi khi tạo tài khoản",
                                detail: err
                            });
                        }

                        const maTaiKhoan = result.insertId;

                        con.query(
                            `INSERT INTO BacSi 
                            (HoTen, SoDienThoai, Email, ChuyenKhoa, MaPhongKham, MaTaiKhoan) 
                            VALUES (?, ?, ?, ?, ?, ?)`,
                            [
                                HoTen,
                                SoDienThoai,
                                Email,
                                ChuyenKhoa || null,
                                MaPhongKham,
                                maTaiKhoan
                            ],
                            (err2, result2) => {
                                if (err2) {
                                    return res.status(500).json({
                                        error: "Lỗi khi tạo bác sĩ",
                                        detail: err2
                                    });
                                }

                                res.json({
                                    message: "Tạo bác sĩ thành công",
                                    MaTaiKhoan: maTaiKhoan,
                                    MaBacSi: result2.insertId
                                });
                            }
                        );
                    }
                );
            }
        }
    );
});

// =========================
// API SỬA TÀI KHOẢN BÁC SĨ
// =========================
app.put("/bacsi/:id", (req, res) => {
    const maTaiKhoan = req.params.id;

    let {
        TenDangNhap,
        MatKhau,
        VaiTro,
        HoTen,
        SoDienThoai,
        Email,
        ChuyenKhoa,
        MaPhongKham
    } = req.body;

    if (!TenDangNhap || !MatKhau || !VaiTro) {
        return res.status(400).json({
            error: "TenDangNhap, MatKhau, VaiTro không được để trống"
        });
    }

    if (!TenDangNhap.endsWith("@bacsi")) {
        return res.status(400).json({
            error: "TenDangNhap phải có hậu tố @bacsi"
        });
    }

    if (hasWhitespace(TenDangNhap)) {
        return res.status(400).json({
            error: "TenDangNhap không được chứa khoảng trắng"
        });
    }

    if (SoDienThoai) {
        if (!isValidPhone(SoDienThoai)) {
            return res.status(400).json({
                error: "Số điện thoại phải gồm đúng 10 chữ số, không chứa chữ hoặc khoảng trắng"
            });
        }
    } else {
        SoDienThoai = null;
    }

    if (Email) {
        Email = Email.toLowerCase().trim();

        if (hasWhitespace(Email)) {
            return res.status(400).json({
                error: "Email không được chứa khoảng trắng"
            });
        }
    } else {
        Email = null;
    }

    con.query(
        "SELECT MaTaiKhoan FROM TaiKhoan WHERE TenDangNhap = ? AND MaTaiKhoan <> ?",
        [TenDangNhap, maTaiKhoan],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: "Lỗi kiểm tra tên đăng nhập",
                    detail: err
                });
            }

            if (result.length > 0) {
                return res.status(400).json({
                    error: "Tên đăng nhập đã tồn tại"
                });
            }

            if (MaPhongKham) {
                con.query(
                    "SELECT MaPhongKham FROM PhongKham WHERE MaPhongKham = ?",
                    [MaPhongKham],
                    (errPK, rowsPK) => {
                        if (errPK) {
                            return res.status(500).json({
                                error: "Lỗi kiểm tra phòng khám",
                                detail: errPK
                            });
                        }

                        if (rowsPK.length === 0) {
                            return res.status(400).json({
                                error: "Phòng khám không tồn tại"
                            });
                        }

                        updateTaiKhoanVaBacSi();
                    }
                );
            } else {
                MaPhongKham = null;
                updateTaiKhoanVaBacSi();
            }

            function updateTaiKhoanVaBacSi() {
                con.query(
                    "UPDATE TaiKhoan SET TenDangNhap = ?, MatKhau = ?, VaiTro = ? WHERE MaTaiKhoan = ?",
                    [TenDangNhap, MatKhau, VaiTro, maTaiKhoan],
                    (err2, result2) => {
                        if (err2) {
                            return res.status(500).json({
                                error: "Lỗi cập nhật tài khoản",
                                detail: err2
                            });
                        }

                        if (result2.affectedRows === 0) {
                            return res.status(404).json({
                                error: "Không tìm thấy tài khoản"
                            });
                        }

                        con.query(
                            `UPDATE BacSi 
                            SET HoTen = ?, SoDienThoai = ?, Email = ?, ChuyenKhoa = ?, MaPhongKham = ? 
                            WHERE MaTaiKhoan = ?`,
                            [
                                HoTen || null,
                                SoDienThoai,
                                Email,
                                ChuyenKhoa || null,
                                MaPhongKham,
                                maTaiKhoan
                            ],
                            (err3) => {
                                if (err3) {
                                    return res.status(500).json({
                                        error: "Lỗi cập nhật bác sĩ",
                                        detail: err3
                                    });
                                }

                                res.json({
                                    message: "Cập nhật bác sĩ thành công",
                                    MaTaiKhoan: maTaiKhoan
                                });
                            }
                        );
                    }
                );
            }
        }
    );
});

// =========================
// API XÓA TÀI KHOẢN BÁC SĨ
// =========================
app.delete("/bacsi/:id", (req, res) => {
    const maTaiKhoan = req.params.id;

    con.query(
        "DELETE FROM TaiKhoan WHERE MaTaiKhoan = ? AND VaiTro = 'Bác sĩ'",
        [maTaiKhoan],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: "Lỗi khi xóa tài khoản",
                    detail: err
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "Không tìm thấy bác sĩ với MaTaiKhoan này"
                });
            }

            res.json({
                message: "Xóa tài khoản thành công",
                MaTaiKhoan: maTaiKhoan
            });
        }
    );
});

// =========================
// API LẤY DANH SÁCH BÁC SĨ KÈM TÀI KHOẢN
// Không trả MatKhau
// =========================
app.get("/api/bacsi-taikhoan", (req, res) => {
    const sql = `
        SELECT 
            tk.MaTaiKhoan,
            tk.TenDangNhap,
            tk.VaiTro,

            bs.MaBacSi,
            bs.HoTen,
            bs.SoDienThoai,
            bs.Email,
            bs.ChuyenKhoa,
            bs.MaPhongKham
        FROM BacSi bs
        JOIN TaiKhoan tk ON bs.MaTaiKhoan = tk.MaTaiKhoan
    `;

    con.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: "Lỗi khi lấy danh sách bác sĩ kèm tài khoản",
                detail: err
            });
        }

        res.json(results);
    });
});

// =========================
// API ĐĂNG KÝ BỆNH NHÂN
// DB gốc dùng GioiTinh: NAM / NU
// =========================
app.post("/TaoTaiKhoanKH", (req, res) => {
    let {
        TenDangNhap,
        MatKhau,
        HoTen,
        NgaySinh,
        GioiTinh,
        SoDienThoai,
        DiaChi
    } = req.body;

    if (!TenDangNhap || !MatKhau || !HoTen || !NgaySinh || !GioiTinh || !SoDienThoai || !DiaChi) {
        return res.status(400).json({
            error: "Phải nhập đủ TenDangNhap, MatKhau, HoTen, NgaySinh, GioiTinh, SoDienThoai, DiaChi"
        });
    }

    if (hasWhitespace(TenDangNhap)) {
        return res.status(400).json({
            error: "TenDangNhap không được chứa khoảng trắng"
        });
    }

    if (!TenDangNhap.endsWith("@khachhang")) {
        return res.status(400).json({
            error: "TenDangNhap phải có hậu tố @khachhang"
        });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(NgaySinh)) {
        return res.status(400).json({
            error: "Ngày sinh phải theo định dạng YYYY-MM-DD"
        });
    }

    if (!(GioiTinh === "NAM" || GioiTinh === "NU")) {
        return res.status(400).json({
            error: "Giới tính chỉ được nhập NAM hoặc NU"
        });
    }

    if (!isValidPhone(SoDienThoai)) {
        return res.status(400).json({
            error: "Số điện thoại phải gồm đúng 10 chữ số, không chứa chữ hoặc khoảng trắng"
        });
    }

    con.query(
        "SELECT MaTaiKhoan FROM TaiKhoan WHERE TenDangNhap = ?",
        [TenDangNhap],
        (errCheck, rows) => {
            if (errCheck) {
                return res.status(500).json({
                    error: "Lỗi khi kiểm tra tên đăng nhập",
                    detail: errCheck
                });
            }

            if (rows.length > 0) {
                return res.status(400).json({
                    error: "Tên đăng nhập đã tồn tại, vui lòng chọn tên khác"
                });
            }

            con.query(
                "INSERT INTO TaiKhoan (TenDangNhap, MatKhau, VaiTro) VALUES (?, ?, 'Khách hàng')",
                [TenDangNhap, MatKhau],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            error: "Lỗi khi tạo tài khoản",
                            detail: err
                        });
                    }

                    const maTaiKhoan = result.insertId;

                    con.query(
                        `INSERT INTO BenhNhan 
                        (HoTen, NgaySinh, GioiTinh, SoDienThoai, DiaChi, MaTaiKhoan) 
                        VALUES (?, ?, ?, ?, ?, ?)`,
                        [
                            HoTen,
                            NgaySinh,
                            GioiTinh,
                            SoDienThoai,
                            DiaChi,
                            maTaiKhoan
                        ],
                        (err2, result2) => {
                            if (err2) {
                                return res.status(500).json({
                                    error: "Lỗi khi tạo bệnh nhân",
                                    detail: err2
                                });
                            }

                            res.json({
                                message: "Tạo bệnh nhân thành công",
                                MaTaiKhoan: maTaiKhoan,
                                MaBenhNhan: result2.insertId
                            });
                        }
                    );
                }
            );
        }
    );
});

// =========================
// API LẤY DANH SÁCH TÀI KHOẢN
// Không trả MatKhau
// =========================
app.get("/taikhoan", (req, res) => {
    con.query(
        "SELECT MaTaiKhoan, TenDangNhap, VaiTro FROM TaiKhoan",
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: "Lỗi khi lấy danh sách tài khoản",
                    detail: err
                });
            }

            res.json(result);
        }
    );
});

// =========================
// API LẤY DANH SÁCH LỊCH HẸN CHI TIẾT
// Giữ từ file 1 vì file 2 đang comment route này
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
            return res.status(500).json({
                error: "Lỗi khi lấy danh sách lịch hẹn",
                detail: err
            });
        }

        res.json(result);
    });
});

// =========================
// API THỐNG KÊ SỐ LỊCH HẸN CỦA BỆNH NHÂN
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
            return res.status(500).json({
                error: "Lỗi khi thống kê lịch hẹn theo bệnh nhân",
                detail: err
            });
        }

        res.json(result);
    });
});

// =========================
// API THỐNG KÊ DỊCH VỤ ĐƯỢC SỬ DỤNG NHIỀU NHẤT
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
            return res.status(500).json({
                error: "Lỗi khi thống kê dịch vụ",
                detail: err
            });
        }

        res.json(result);
    });
});

// =========================
// API THỐNG KÊ LỊCH HẸN THEO BÁC SĨ
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
            return res.status(500).json({
                error: "Lỗi khi thống kê lịch hẹn theo bác sĩ",
                detail: err
            });
        }

        res.json(result);
    });
});

// =========================
// API THỐNG KÊ KHUNG GIỜ ĐƯỢC ĐẶT NHIỀU NHẤT
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
            return res.status(500).json({
                error: "Lỗi khi thống kê khung giờ",
                detail: err
            });
        }

        res.json(result);
    });
});

// lấy list services
app.get("/api/services", (req, res) => {
  const sql = `
    SELECT dv.MaDichVu, dv.TenDichVu, dv.Gia, dv.MoTa, dv.MaBacSi, bs.HoTen AS TenBacSi
    FROM DichVu dv
    LEFT JOIN BacSi bs ON dv.MaBacSi = bs.MaBacSi
    ORDER BY dv.TenDichVu ASC
  `;

  con.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi khi lấy danh sách dịch vụ" });
    res.json(result);
  });
});

// =========================
// SERVER
// =========================
const PORT = process.env.PORT || 5555;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});