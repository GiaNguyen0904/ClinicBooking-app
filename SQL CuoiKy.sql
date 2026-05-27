drop database if exists PhongKham;
CREATE DATABASE PhongKham;
USE PhongKham;

-- =========================
-- 1. TÀI KHOẢN
-- =========================
CREATE TABLE TaiKhoan (
    MaTaiKhoan INT AUTO_INCREMENT PRIMARY KEY,
    TenDangNhap VARCHAR(50) UNIQUE NOT NULL,
    MatKhau VARCHAR(255) NOT NULL,
    VaiTro ENUM('ADMIN', 'Bác sĩ', 'Khách hàng') NOT NULL
);

-- =========================
-- 2. PHÒNG KHÁM
-- =========================
CREATE TABLE PhongKham (
    MaPhongKham INT AUTO_INCREMENT PRIMARY KEY,
    TenPhongKham VARCHAR(100) NOT NULL,
    DiaChi TEXT,
    SoDienThoai VARCHAR(15),
    Email VARCHAR(100)
);

-- =========================
-- 3. BÁC SĨ
-- =========================
CREATE TABLE BacSi (
    MaBacSi INT AUTO_INCREMENT PRIMARY KEY,
    HoTen VARCHAR(100) NOT NULL,
    SoDienThoai VARCHAR(15),
    Email VARCHAR(100),
    ChuyenKhoa VARCHAR(100),

    MaPhongKham INT,
    MaTaiKhoan INT UNIQUE,

    FOREIGN KEY (MaPhongKham)
    REFERENCES PhongKham(MaPhongKham)
    ON DELETE SET NULL,

    FOREIGN KEY (MaTaiKhoan)
    REFERENCES TaiKhoan(MaTaiKhoan)
    ON DELETE CASCADE
);

-- =========================
-- 4. KHÁCH HÀNG / BỆNH NHÂN
-- =========================
CREATE TABLE BenhNhan (
    MaBenhNhan INT AUTO_INCREMENT PRIMARY KEY,
    HoTen VARCHAR(100) NOT NULL,
    NgaySinh DATE NOT NULL,
    GioiTinh ENUM('NAM', 'NU') NOT NULL,
    SoDienThoai VARCHAR(15) NOT NULL,
    DiaChi TEXT NOT NULL,
    MaTaiKhoan INT UNIQUE,

    FOREIGN KEY (MaTaiKhoan)
    REFERENCES TaiKhoan(MaTaiKhoan)
    ON DELETE CASCADE
);

-- =========================
-- 5. DỊCH VỤ
-- =========================
CREATE TABLE DichVu (
    MaDichVu INT AUTO_INCREMENT PRIMARY KEY,
    TenDichVu VARCHAR(100) NOT NULL,
    Gia DECIMAL(10,2) NOT NULL,
    MoTa TEXT,

    MaBacSi INT,

    FOREIGN KEY (MaBacSi)
    REFERENCES BacSi(MaBacSi)
    ON DELETE SET NULL
);

-- =========================
-- 6. KHUNG GIỜ LÀM VIỆC
-- =========================
CREATE TABLE KhungGio (
    MaKhungGio INT AUTO_INCREMENT PRIMARY KEY,
    MaBacSi INT NOT NULL,
    Ngay DATE NOT NULL,
    GioBatDau TIME NOT NULL,
    GioKetThuc TIME NOT NULL,
    SoLuongToiDa INT NOT NULL DEFAULT 3,

    FOREIGN KEY (MaBacSi)
    REFERENCES BacSi(MaBacSi)
    ON DELETE CASCADE
);

-- =========================
-- 7. LỊCH HẸN
-- =========================
CREATE TABLE LichHen (
    MaLichHen INT AUTO_INCREMENT PRIMARY KEY,
    MaBenhNhan INT NOT NULL,
    MaBacSi INT NOT NULL,
    MaKhungGio INT,
    NgayHen DATE NOT NULL,

    TrangThai ENUM(
        'Chờ xác nhận',
        'Đã xác nhận',
        'Đang thực hiện',
		'Hoàn thành',
        'Đã hủy'
    ) DEFAULT 'Chờ xác nhận',

    FOREIGN KEY (MaBenhNhan)
    REFERENCES BenhNhan(MaBenhNhan),

    FOREIGN KEY (MaBacSi)
    REFERENCES BacSi(MaBacSi),

    FOREIGN KEY (MaKhungGio)
    REFERENCES KhungGio(MaKhungGio)
);

-- =========================
-- 8. CHI TIẾT DỊCH VỤ
-- =========================
CREATE TABLE ChiTietDichVu (
    MaLichHen INT,
    MaDichVu INT,
    SoLuong INT DEFAULT 1,

    PRIMARY KEY (MaLichHen, MaDichVu),

    FOREIGN KEY (MaLichHen)
    REFERENCES LichHen(MaLichHen)
    ON DELETE CASCADE,

    FOREIGN KEY (MaDichVu)
    REFERENCES DichVu(MaDichVu)
);

-- =========================
-- 9. BỆNH ÁN
-- =========================
CREATE TABLE BenhAn (
    MaBenhAn INT AUTO_INCREMENT PRIMARY KEY,
    MaBenhNhan INT NOT NULL,
    MaBacSi INT NOT NULL,

    ChanDoan TEXT,
    NgayLap DATE,

    FOREIGN KEY (MaBenhNhan)
    REFERENCES BenhNhan(MaBenhNhan),

    FOREIGN KEY (MaBacSi)
    REFERENCES BacSi(MaBacSi)
);

-- =========================
-- 10. ĐƠN THUỐC
-- =========================
CREATE TABLE DonThuoc (
    MaDonThuoc INT AUTO_INCREMENT PRIMARY KEY,
    MaBenhAn INT NOT NULL,

    NoiDung TEXT,
    NgayKe DATE,

    FOREIGN KEY (MaBenhAn)
    REFERENCES BenhAn(MaBenhAn)
    ON DELETE CASCADE
);

-- =========================
-- 11. KẾT QUẢ XÉT NGHIỆM
-- =========================
CREATE TABLE KetQuaXetNghiem (
    MaKetQua INT AUTO_INCREMENT PRIMARY KEY,
    MaBenhAn INT NOT NULL,

    TenXetNghiem VARCHAR(100),
    KetQua TEXT,
    NgayXetNghiem DATE,

    FOREIGN KEY (MaBenhAn)
    REFERENCES BenhAn(MaBenhAn)
    ON DELETE CASCADE
);


-- =========================
-- 1. TÀI KHOẢN
-- =========================
INSERT INTO TaiKhoan (TenDangNhap, MatKhau, VaiTro) VALUES
('admin01@phongkham', 'adminpass', 'ADMIN'),
('bs01@bacsi', 'matkhau1', 'Bác sĩ'),
('bs02@bacsi', 'matkhau2', 'Bác sĩ'),
('bs03@bacsi', 'matkhau3', 'Bác sĩ'),
('bn01@bennhan', 'matkhau4', 'Khách hàng'),
('bn02@bennhan', 'matkhau5', 'Khách hàng'),
('bn03@bennhan', 'matkhau6', 'Khách hàng');

select * from TaiKhoan;
 
-- =========================
-- 2. PHÒNG KHÁM
-- =========================
INSERT INTO PhongKham (TenPhongKham, DiaChi, SoDienThoai, Email) VALUES
('Phòng khám Đa khoa Sài Gòn', '123 Nguyễn Trãi, Quận 5, TP.HCM', '0909123456', 'contact@phongkhamsaigon.vn');

-- =========================
-- 3. BÁC SĨ
-- =========================
-- Giả sử MaPhongKham = 1, và MaTaiKhoan lần lượt từ 2 đến 4 cho bs01, bs02, bs03
INSERT INTO BacSi (HoTen, SoDienThoai, Email, ChuyenKhoa, MaPhongKham, MaTaiKhoan) VALUES
('Nguyễn Văn A', '0912345678', 'nguyenvana@phongkhamsaigon.vn', 'Nội tổng quát', 1, 2),
('Trần Thị B', '0923456789', 'tranthib@phongkhamsaigon.vn', 'Nhi khoa', 1, 3),
('Lê Văn C', '0934567890', 'levanc@phongkhamsaigon.vn', 'Ngoại khoa', 1, 4);
select * from BacSi;
-- =========================
-- 4. BỆNH NHÂN
-- =========================
-- Giả sử MaTaiKhoan lần lượt từ 5 đến 7 cho bn01, bn02, bn03
INSERT INTO BenhNhan (HoTen, NgaySinh, GioiTinh, SoDienThoai, DiaChi, MaTaiKhoan) VALUES
('Phạm Minh D', '1990-05-12', 'NAM', '0945678901', '456 Lý Thường Kiệt, Quận 10, TP.HCM', 5),
('Ngô Thị E', '1985-08-20', 'NU', '0956789012', '789 Cách Mạng Tháng 8, Quận 3, TP.HCM', 6),
('Hoàng Văn F', '2000-11-02', 'NAM', '0967890123', '321 Nguyễn Văn Cừ, Quận 1, TP.HCM', 7);

select * from BenhNhan;

-- Dữ liệu khung giờ làm việc cho bác sĩ
INSERT INTO KhungGio (MaBacSi, Ngay, GioBatDau, GioKetThuc, SoLuongToiDa) VALUES
(1, '2026-05-28', '08:00:00', '09:00:00', 3),
(1, '2026-05-28', '09:00:00', '10:00:00', 3),
(2, '2026-05-28', '08:00:00', '09:00:00', 3),
(2, '2026-05-28', '09:00:00', '10:00:00', 3),
(3, '2026-05-29', '14:00:00', '15:00:00', 3),
(3, '2026-05-29', '15:00:00', '16:00:00', 3);

INSERT INTO DichVu (TenDichVu, Gia, MoTa, MaBacSi) VALUES
('Khám tổng quát', 200000, 'Khám sức khỏe tổng quát', 1),
('Xét nghiệm máu', 150000, 'Xét nghiệm máu cơ bản', 2),
('Chụp X-quang', 300000, 'Chụp X-quang vùng ngực', 3),
('Siêu âm bụng', 250000, 'Siêu âm ổ bụng', 2);

-- Thêm dữ liệu vào bảng LichHen
INSERT INTO LichHen (MaBenhNhan, MaBacSi, MaKhungGio, NgayHen, TrangThai) VALUES
(1, 1, 1, '2026-05-28', 'Chờ xác nhận'),
(2, 1, 2, '2026-05-28', 'Đã xác nhận'),
(3, 2, 3, '2026-05-28', 'Hoàn thành'),
(1, 2, 4, '2026-05-28', 'Đang thực hiện'),
(2, 3, 5, '2026-05-29', 'Đã hủy'),
(3, 3, 6, '2026-05-29', 'Đã xác nhận');

INSERT INTO ChiTietDichVu (MaLichHen, MaDichVu, SoLuong) VALUES
(1, 1, 1), -- Lịch hẹn 1: 	Khám tổng quát 
(1, 2, 2), -- 				Xét nghiệm máu, 2 mẫu
(2, 1, 1), -- Lịch hẹn 2:	Khám tổng quát
(2, 3, 1), -- 				Chụp X-quang
(3, 2, 1), -- Lịch hẹn 3: 	Xét nghiệm máu
(3, 4, 1), -- 				Siêu âm bụng
(4, 1, 1), -- Lịch hẹn 4: 	Khám tổng quát
(4, 3, 1), -- 				Chụp X-quang
(4, 4, 1); -- 				Siêu âm bụng

SELECT * FROM BacSi;
SELECT * FROM KhungGio;
SELECT * FROM DichVu;
SELECT * FROM LichHen;
SELECT * FROM ChiTietDichVu;

-- Phúc test
select * from LichHen where MaBenhNhan = 2;
select * from LichHen order by MaLichHen desc;
select MaLichHen, TrangThai from LichHen where MaLichHen = 9;