-- Schema ban đầu do người dùng cung cấp.
-- Chạy một lần trên SQL Server bằng SSMS hoặc sqlcmd (hỗ trợ GO).
CREATE DATABASE QLTrungTamNgoaiNgu;
GO

USE QLTrungTamNgoaiNgu;
GO

CREATE TABLE dbo.HocSinh (
    MaHS INT IDENTITY(1,1) PRIMARY KEY,
    HoTen NVARCHAR(100) NOT NULL,
    NgaySinh DATE,
    GioiTinh NVARCHAR(10),
    SDT VARCHAR(15),
    Email VARCHAR(100),
    DiaChi NVARCHAR(255),
    NgayDangKy DATE DEFAULT GETDATE(),
    TrangThai NVARCHAR(50)
);

CREATE TABLE dbo.GiaoVien (
    MaGV INT IDENTITY(1,1) PRIMARY KEY,
    HoTen NVARCHAR(100) NOT NULL,
    NgaySinh DATE,
    GioiTinh NVARCHAR(10),
    SDT VARCHAR(15),
    Email VARCHAR(100),
    ChuyenMon NVARCHAR(100),
    TrinhDo NVARCHAR(100),
    TrangThai NVARCHAR(50)
);

CREATE TABLE dbo.KhoaHoc (
    MaKH INT IDENTITY(1,1) PRIMARY KEY,
    TenKH NVARCHAR(100) NOT NULL,
    MoTa NVARCHAR(500),
    HocPhi DECIMAL(18,2),
    ThoiLuong INT,
    TrinhDo NVARCHAR(50)
);

CREATE TABLE dbo.LopHoc (
    MaLop INT IDENTITY(1,1) PRIMARY KEY,
    TenLop NVARCHAR(100) NOT NULL,
    MaKH INT NOT NULL,
    MaGV INT,
    NgayBatDau DATE,
    NgayKetThuc DATE,
    LichHoc NVARCHAR(100),
    PhongHoc NVARCHAR(50),
    SiSoToiDa INT,
    TrangThai NVARCHAR(50),
    FOREIGN KEY (MaKH) REFERENCES dbo.KhoaHoc(MaKH),
    FOREIGN KEY (MaGV) REFERENCES dbo.GiaoVien(MaGV)
);

CREATE TABLE dbo.HocSinh_LopHoc (
    MaHS INT NOT NULL,
    MaLop INT NOT NULL,
    NgayDangKy DATE DEFAULT GETDATE(),
    TrangThai NVARCHAR(50),
    PRIMARY KEY (MaHS, MaLop),
    FOREIGN KEY (MaHS) REFERENCES dbo.HocSinh(MaHS),
    FOREIGN KEY (MaLop) REFERENCES dbo.LopHoc(MaLop)
);

CREATE TABLE dbo.TaiKhoan (
    MaTK INT IDENTITY(1,1) PRIMARY KEY,
    TenDangNhap VARCHAR(50) UNIQUE NOT NULL,
    -- Chỉ lưu chuỗi hash mật khẩu do thư viện xác thực tạo.
    MatKhau VARCHAR(255) NOT NULL,
    VaiTro VARCHAR(20) NOT NULL,
    MaHS INT NULL,
    MaGV INT NULL,
    TrangThai BIT DEFAULT 1,
    FOREIGN KEY (MaHS) REFERENCES dbo.HocSinh(MaHS),
    FOREIGN KEY (MaGV) REFERENCES dbo.GiaoVien(MaGV)
);
GO
