# Frontend quản lý trung tâm

Mã frontend nằm trong `wwwroot/`, chạy trực tiếp qua `index.html` không cần thư viện/CDN. `css/site.css` chứa layout nền; `css/form.css` chứa form, bảng quản lý, trang đăng nhập, profile và responsive; `js/site.js` chứa render và tương tác dữ liệu mẫu.

## Các màn hình đã triển khai

| Màn hình | Hành vi |
| --- | --- |
| Đăng nhập | Form tên/mật khẩu, lỗi sai tài khoản, demo Admin/Staff |
| Tổng quan | Chỉ số, lớp đang tuyển và liên kết đăng ký |
| Học viên | Thêm/sửa/chi tiết, tìm không dấu, lọc trạng thái, ngừng/kích hoạt |
| Giáo viên | Thêm/sửa/chi tiết, ngày sinh/giới tính, tìm kiếm, ngừng/kích hoạt |
| Khóa học | Thêm/sửa/chi tiết, học phí VND, thời lượng giờ, tìm kiếm |
| Lớp học | Tạo/sửa/chi tiết, phân công giáo viên trong form, lịch/phòng, danh sách học viên |
| Đăng ký | Tạo, hủy có xác nhận, chuyển lớp, kích hoạt lại cùng cặp học viên–lớp |
| Thống kê | Theo lớp, học viên duy nhất theo khóa, lớp theo giáo viên và sức chứa |
| Tài khoản | Hồ sơ vai trò và đăng xuất có xác nhận |

Admin có xóa bản ghi không có quan hệ. Staff không có nút xóa. Đây chỉ là hành vi giao diện demo; backend phải kiểm tra quyền độc lập.

## Chuẩn giao diện

Nhãn/form tiếng Việt, lỗi giữ nội dung đã nhập, dialog đóng bằng Escape, focus trả về nút mở khi còn tồn tại. Có skip link, focus-visible, aria-live thông báo, trạng thái bằng chữ. Mobile navigation dạng lưới; form một cột; bảng cuộn ngang. Không tải dữ liệu mạng nên không có trạng thái loading/server-error giả.

## Kết nối MVC sau này

Khung MVC đã tách thành Views/Shared/_Layout.cshtml, _Sidebar.cshtml và _Navbar.cshtml; Home/Index render vùng nội dung. Bản HTML độc lập nằm tại wwwroot/index.html. Mỗi hàm render tương ứng controller/view trong BACKEND_DESIGN.md. Chuyển dialog form thành form Razor hoặc partial view; input dùng asp-for, lỗi dùng asp-validation-for và validation summary. Tất cả thao tác ghi dùng POST antiforgery, giữ allowlist trường gửi, thành công dùng redirect.

Mã hiển thị HV/GV/KH/LOP hiện là chuỗi demo; database dùng khóa int. Nhãn trạng thái tiếng Việt cần ánh xạ sang mã backend (Active/Inactive, Draft/Open/InProgress/Completed/Cancelled và Active/Cancelled/Transferred) thay vì lưu trực tiếp nhãn. ID DK chỉ phục vụ giao diện demo; request đăng ký dùng MaHS/MaLop đúng khóa kép SQL.

Form đăng nhập demo phải được thay bằng TaiKhoan/Login khi ghép backend; bỏ kiểm tra tài khoản ở JavaScript. Bổ sung đổi mật khẩu thực qua TaiKhoan/DoiMatKhau sau khi có service xác thực. Dữ liệu hiện không lưu localStorage và đặt lại khi reload.

## Kiểm chứng

Đã kiểm tra cú pháp JavaScript, render tám trang với DOM giả lập ở mức smoke check, và chạy các quy tắc thuần: ngừng học viên còn đăng ký, ngừng giáo viên đang phụ trách lớp, thiếu lịch/phòng của lớp tuyển, tên trắng, đăng ký lại không tăng số bản ghi, lớp hết hạn không nhận đăng ký và lớp hợp lệ. DOM giả lập không thay thế kiểm thử browser.

Chưa kiểm tra trực quan/tương tác bằng trình duyệt do công cụ browser không có kết nối trong phiên này. Khi kiểm tra thủ công, đi qua login sai/đúng; thử tạo/sửa form lỗi; đăng ký/hủy/đăng ký lại/chuyển; thử xóa hồ sơ có quan hệ; đối chiếu báo cáo; thử Staff; kiểm tra bàn phím, Escape và viewport 390px/1440px.
