# Language Center Management

Dự án quản lý trung tâm ngoại ngữ theo định hướng ASP.NET Core MVC, C# và SQL Server.

## Tài liệu

- `Architechtured.md`: kiến trúc dự kiến ban đầu.
- `database/001_CreateDatabase.sql`: schema SQL Server do người dùng cung cấp, dành cho database mới.
- `docs/DATA_MODEL.md`: quan hệ, ánh xạ entity và giới hạn nghiệp vụ của schema.
- `docs/BACKEND_DESIGN.md`: thiết kế backend MVC, controllers/services, xác thực, ánh xạ EF Core và transaction đăng ký/chuyển lớp.
- `docs/PRODUCT_DESIGN.md`: phạm vi MVP, màn hình, luồng nghiệp vụ, quy tắc dữ liệu và kế hoạch triển khai.
- `Views/Shared/`: Razor layout, sidebar và navbar dùng chung.
- `Views/Home/Index.cshtml`: trang MVC chứa frontend demo.
- `wwwroot/index.html`: bản HTML độc lập; tài nguyên nằm trong `wwwroot/css/` và `wwwroot/js/`.

## Cấu trúc project

Thư mục hiện tại là gốc `LanguageCenterManagement`, theo `Architechtured.md`:

```text
Controllers/             HomeController và vị trí cho controller nghiệp vụ
Models/ViewModels/       Vị trí entity và ViewModel
Data/Migrations/         Vị trí DbContext, seed và migrations
Services/                Vị trí service nghiệp vụ
Views/
  Home/                  Index.cshtml
  HocSinh/ GiaoVien/ KhoaHoc/ LopHoc/
  DangKyLop/ ThongKe/ TaiKhoan/
  Shared/                _Layout, _Sidebar, _Navbar, Error
wwwroot/
  css/                   site.css, form.css
  js/                    site.js
  assets/
    images/              Ảnh dùng trong giao diện
    videos/              Video dùng trong giao diện
  images/
  lib/bootstrap/
Properties/              launchSettings.json
database/                Script SQL gốc
docs/                    Tài liệu thiết kế
Program.cs
appsettings.json
LanguageCenterManagement.csproj
```

Các thư mục nghiệp vụ chưa có mã dùng `.gitkeep` để giữ bố cục. CSS và JS hiện dùng chung; sẽ tách các tệp module khi triển khai từng nghiệp vụ. Bootstrap chưa được cài vì frontend hiện không phụ thuộc thư viện đó.

## Chạy MVC

Cần .NET SDK 10. Tại thư mục project chạy:

```powershell
dotnet build
dotnet run
```

Mở `http://localhost:5080`. Khung MVC hiện phục vụ frontend demo; chưa kết nối SQL Server hoặc cung cấp nghiệp vụ backend.

## Xem bản mẫu

Mở `wwwroot/index.html`. Đăng nhập bằng `admin.demo` hoặc `staff.demo`, mật khẩu minh họa `demo123`. Có các màn hình tổng quan, học viên, giáo viên, khóa học, lớp học, đăng ký lớp, thống kê và tài khoản. Có thể thử thêm/sửa/xem chi tiết hồ sơ, tìm danh sách, lọc trạng thái học viên, xem danh sách lớp, đăng ký/hủy/chuyển lớp. Quản trị viên có nút xóa; bản ghi có quan hệ được giữ lại. Dữ liệu mẫu có một lớp đủ sĩ số để minh họa kiểm tra chỗ trống.

Bản mẫu chỉ chạy phía trình duyệt và dùng dữ liệu trong bộ nhớ; tải lại sẽ đặt lại dữ liệu và phiên. Đăng nhập/vai trò chỉ mô phỏng giao diện, chưa có xác thực hoặc phân quyền bảo vệ ở server, SQL Server hay kiểm tra trùng lịch. Các kiểm tra form chỉ minh họa luồng; cần được triển khai và xác thực lại ở server. Chưa có đổi mật khẩu thực. Không dùng tài khoản thực trên bản mẫu.

Thời lượng khóa học hiển thị theo giờ để thống nhất thiết kế backend. Thống kê theo khóa đếm học viên duy nhất; đăng ký lại sau hủy/chuyển kích hoạt bản ghi cũ theo khóa kép SQL. Giao diện hỗ trợ màn hình nhỏ, focus bàn phím và dialog xác nhận.
