# CẤU TRÚC PROJECT WEBSITE QUẢN LÝ TRUNG TÂM NGOẠI NGỮ

## 1. Công nghệ đề xuất

- Front-end:
  - HTML
  - CSS
  - JavaScript
  - Bootstrap

- Back-end:
  - ASP.NET Core MVC
  - C#

- Database:
  - SQL Server

- IDE:
  - Visual Studio

---

## 2. Cấu trúc tổng thể project

```text
LanguageCenterManagement/
│
├── Controllers/
│   ├── HomeController.cs
│   ├── HocSinhController.cs
│   ├── GiaoVienController.cs
│   ├── KhoaHocController.cs
│   ├── LopHocController.cs
│   ├── DangKyLopController.cs
│   ├── ThongKeController.cs
│   └── TaiKhoanController.cs
│
├── Models/
│   ├── HocSinh.cs
│   ├── GiaoVien.cs
│   ├── KhoaHoc.cs
│   ├── LopHoc.cs
│   ├── HocSinhLopHoc.cs
│   ├── TaiKhoan.cs
│   └── ViewModels/
│       ├── DashboardViewModel.cs
│       ├── LopHocChiTietViewModel.cs
│       └── DangKyLopViewModel.cs
│
├── Data/
│   ├── AppDbContext.cs
│   ├── SeedData.cs
│   └── Migrations/
│
├── Services/
│   ├── HocSinhService.cs
│   ├── GiaoVienService.cs
│   ├── KhoaHocService.cs
│   ├── LopHocService.cs
│   └── ThongKeService.cs
│
├── Views/
│   ├── Home/
│   │   └── Index.cshtml
│   │
│   ├── HocSinh/
│   │   ├── Index.cshtml
│   │   ├── Create.cshtml
│   │   ├── Edit.cshtml
│   │   ├── Details.cshtml
│   │   └── Delete.cshtml
│   │
│   ├── GiaoVien/
│   │   ├── Index.cshtml
│   │   ├── Create.cshtml
│   │   ├── Edit.cshtml
│   │   ├── Details.cshtml
│   │   └── Delete.cshtml
│   │
│   ├── KhoaHoc/
│   │   ├── Index.cshtml
│   │   ├── Create.cshtml
│   │   ├── Edit.cshtml
│   │   ├── Details.cshtml
│   │   └── Delete.cshtml
│   │
│   ├── LopHoc/
│   │   ├── Index.cshtml
│   │   ├── Create.cshtml
│   │   ├── Edit.cshtml
│   │   ├── Details.cshtml
│   │   ├── Delete.cshtml
│   │   └── DanhSachHocSinh.cshtml
│   │
│   ├── DangKyLop/
│   │   ├── Index.cshtml
│   │   ├── Create.cshtml
│   │   └── ChuyenLop.cshtml
│   │
│   ├── ThongKe/
│   │   └── Index.cshtml
│   │
│   ├── TaiKhoan/
│   │   ├── Login.cshtml
│   │   └── Profile.cshtml
│   │
│   └── Shared/
│       ├── _Layout.cshtml
│       ├── _Navbar.cshtml
│       ├── _Sidebar.cshtml
│       ├── _ValidationScriptsPartial.cshtml
│       └── Error.cshtml
│
├── wwwroot/
│   ├── css/
│   │   ├── site.css
│   │   ├── dashboard.css
│   │   └── form.css
│   │
│   ├── js/
│   │   ├── site.js
│   │   ├── hocSinh.js
│   │   ├── lopHoc.js
│   │   └── thongKe.js
│   │
│   ├── images/
│   │   ├── logo.png
│   │   └── avatar-default.png
│   │
│   └── lib/
│       └── bootstrap/
│
├── Properties/
│   └── launchSettings.json
│
├── appsettings.json
├── Program.cs
├── LanguageCenterManagement.csproj
└── README.md
```

---

# 3. Chức năng từng thư mục

## 3.1. Controllers

Controller nhận request từ người dùng, xử lý yêu cầu và trả về View.

```text
Controllers/
```

### HomeController.cs

Trang tổng quan hệ thống.

Chức năng:

- Dashboard.
- Hiển thị số lượng học sinh.
- Hiển thị số lượng giáo viên.
- Hiển thị số lượng lớp.
- Hiển thị số lượng khóa học.

---

### HocSinhController.cs

Quản lý học sinh.

```text
HocSinhController
│
├── Index()
├── Create()
├── Edit()
├── Details()
├── Delete()
└── Search()
```

Chức năng:

- Danh sách học sinh.
- Thêm học sinh.
- Sửa học sinh.
- Xóa học sinh.
- Xem chi tiết.
- Tìm kiếm.

---

### GiaoVienController.cs

```text
GiaoVienController
│
├── Index()
├── Create()
├── Edit()
├── Details()
├── Delete()
└── Search()
```

Quản lý toàn bộ thông tin giáo viên.

---

### KhoaHocController.cs

```text
KhoaHocController
│
├── Index()
├── Create()
├── Edit()
├── Details()
└── Delete()
```

Quản lý:

- IELTS.
- TOEIC.
- Giao tiếp.
- Tiếng Trung.
- Các khóa học khác.

---

### LopHocController.cs

```text
LopHocController
│
├── Index()
├── Create()
├── Edit()
├── Details()
├── Delete()
├── DanhSachHocSinh()
└── PhanCongGiaoVien()
```

---

### DangKyLopController.cs

Xử lý quan hệ giữa học sinh và lớp học.

```text
DangKyLopController
│
├── Index()
├── Create()
├── Delete()
└── ChuyenLop()
```

---

### ThongKeController.cs

Thống kê:

```text
ThongKeController
│
├── Index()
├── HocSinhTheoLop()
├── HocSinhTheoKhoaHoc()
└── LopTheoGiaoVien()
```

---

# 4. Models

Models đại diện cho các bảng trong cơ sở dữ liệu.

```text
Models/
```

---

## 4.1. HocSinh.cs

```text
HocSinh
│
├── MaHS
├── HoTen
├── NgaySinh
├── GioiTinh
├── SDT
├── Email
├── DiaChi
├── NgayDangKy
└── TrangThai
```

---

## 4.2. GiaoVien.cs

```text
GiaoVien
│
├── MaGV
├── HoTen
├── NgaySinh
├── GioiTinh
├── SDT
├── Email
├── ChuyenMon
├── TrinhDo
└── TrangThai
```

---

## 4.3. KhoaHoc.cs

```text
KhoaHoc
│
├── MaKH
├── TenKH
├── MoTa
├── HocPhi
├── ThoiLuong
└── TrinhDo
```

---

## 4.4. LopHoc.cs

```text
LopHoc
│
├── MaLop
├── TenLop
├── MaKH
├── MaGV
├── NgayBatDau
├── NgayKetThuc
├── LichHoc
├── PhongHoc
├── SiSoToiDa
└── TrangThai
```

---

## 4.5. HocSinhLopHoc.cs

Bảng trung gian giữa học sinh và lớp học.

```text
HocSinhLopHoc
│
├── MaHS
├── MaLop
├── NgayDangKy
└── TrangThai
```

---

# 5. ViewModels

ViewModel dùng để gom dữ liệu từ nhiều Model phục vụ một trang giao diện.

```text
Models/
└── ViewModels/
```

Ví dụ:

## DashboardViewModel.cs

```text
DashboardViewModel
│
├── TongHocSinh
├── TongGiaoVien
├── TongLopHoc
└── TongKhoaHoc
```

---

## LopHocChiTietViewModel.cs

```text
LopHocChiTietViewModel
│
├── LopHoc
├── GiaoVien
├── KhoaHoc
└── DanhSachHocSinh
```

---

# 6. Data

```text
Data/
```

Dùng để kết nối và thao tác với SQL Server.

---

## AppDbContext.cs

Quản lý các bảng:

```text
AppDbContext
│
├── HocSinhs
├── GiaoViens
├── KhoaHocs
├── LopHocs
├── HocSinhLopHocs
└── TaiKhoans
```

---

## SeedData.cs

Dùng để tạo dữ liệu mẫu ban đầu.

Ví dụ:

```text
Khoa học:
- IELTS 5.0
- IELTS 6.5
- TOEIC 500
- TOEIC 700
- Tiếng Anh giao tiếp
```

---

# 7. Services

```text
Services/
```

Service chứa phần xử lý nghiệp vụ.

Controller không nên chứa quá nhiều logic.

Ví dụ:

```text
HocSinhController
        |
        v
HocSinhService
        |
        v
AppDbContext
        |
        v
SQL Server
```

---

## HocSinhService.cs

```text
GetAll()
GetById()
Create()
Update()
Delete()
Search()
```

---

## LopHocService.cs

```text
GetAll()
GetById()
Create()
Update()
Delete()
ThemHocSinh()
XoaHocSinh()
ChuyenLop()
PhanCongGiaoVien()
```

---

# 8. Views

Views là phần giao diện người dùng.

```text
Views/
```

Mỗi Controller thường có một thư mục View tương ứng.

Ví dụ:

```text
HocSinhController
       |
       v
Views/HocSinh/
```

---

# 9. Giao diện hệ thống

## 9.1. Dashboard

```text
+--------------------------------------------------+
|                   HEADER                         |
+-------------+------------------------------------+
|             |                                    |
|   SIDEBAR   |            DASHBOARD               |
|             |                                    |
| Học sinh    |   [Học sinh]    [Giáo viên]       |
| Giáo viên   |                                    |
| Khóa học    |   [Lớp học]     [Khóa học]        |
| Lớp học     |                                    |
| Thống kê    |                                    |
|             |                                    |
+-------------+------------------------------------+
```

---

## 9.2. Sidebar

```text
Dashboard

Quản lý học sinh

Quản lý giáo viên

Quản lý khóa học

Quản lý lớp học

Đăng ký lớp

Thống kê

Đăng xuất
```

---

# 10. Luồng xử lý MVC

Ví dụ người dùng mở danh sách học sinh:

```text
Người dùng
    |
    v
/hocsinh
    |
    v
HocSinhController
    |
    v
HocSinhService
    |
    v
AppDbContext
    |
    v
SQL Server
    |
    v
HocSinhController
    |
    v
Views/HocSinh/Index.cshtml
    |
    v
Trình duyệt
```

---

# 11. Cấu trúc database

```text
HOCSINH
    |
    |
    v
HOCSINH_LOPHOC
    ^
    |
    |
LOPHOC
 |   |
 |   |
 v   v
KHOAHOC     GIAOVIEN
```

Quan hệ:

```text
KHOAHOC
1
|
N
LOPHOC
N
|
1
GIAOVIEN
```

và:

```text
HOCSINH
1
|
N
HOCSINH_LOPHOC
N
|
1
LOPHOC
```

---

# 12. Thứ tự nên code project

Không nên code tất cả cùng lúc.

Nên làm theo thứ tự:

```text
1. Tạo Database
        ↓
2. Tạo Models
        ↓
3. Tạo AppDbContext
        ↓
4. Kết nối SQL Server
        ↓
5. Làm CRUD Học sinh
        ↓
6. Làm CRUD Giáo viên
        ↓
7. Làm CRUD Khóa học
        ↓
8. Làm CRUD Lớp học
        ↓
9. Làm chức năng xếp lớp
        ↓
10. Phân công giáo viên
        ↓
11. Làm Dashboard
        ↓
12. Làm tìm kiếm
        ↓
13. Làm thống kê
        ↓
14. Hoàn thiện giao diện
```

---

# 13. Phiên bản tối thiểu cần hoàn thành

```text
LOGIN
  |
  v
DASHBOARD
  |
  ├── Học sinh
  │     ├── Danh sách
  │     ├── Thêm
  │     ├── Sửa
  │     └── Xóa
  │
  ├── Giáo viên
  │     ├── Danh sách
  │     ├── Thêm
  │     ├── Sửa
  │     └── Xóa
  │
  ├── Khóa học
  │     ├── Danh sách
  │     ├── Thêm
  │     ├── Sửa
  │     └── Xóa
  │
  ├── Lớp học
  │     ├── Danh sách
  │     ├── Thêm
  │     ├── Sửa
  │     └── Xóa
  │
  └── Xếp lớp
        ├── Thêm học sinh
        ├── Xóa học sinh
        └── Chuyển lớp
```

---

# 14. Cấu trúc project rút gọn

Nếu chỉ làm project môn học và muốn code gọn hơn:

```text
LanguageCenterManagement/
│
├── Controllers/
│   ├── HomeController.cs
│   ├── HocSinhController.cs
│   ├── GiaoVienController.cs
│   ├── KhoaHocController.cs
│   └── LopHocController.cs
│
├── Models/
│   ├── HocSinh.cs
│   ├── GiaoVien.cs
│   ├── KhoaHoc.cs
│   ├── LopHoc.cs
│   └── HocSinhLopHoc.cs
│
├── Data/
│   └── AppDbContext.cs
│
├── Views/
│   ├── Home/
│   ├── HocSinh/
│   ├── GiaoVien/
│   ├── KhoaHoc/
│   ├── LopHoc/
│   └── Shared/
│
├── wwwroot/
│   ├── css/
│   ├── js/
│   └── images/
│
├── appsettings.json
├── Program.cs
└── LanguageCenterManagement.csproj
```

Đây là cấu trúc nên dùng ở giai đoạn đầu.

Khi project lớn hơn mới tách thêm:

```text
Services/
Repositories/
ViewModels/
DTOs/
Helpers/
```
