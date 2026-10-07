# Thiết kế sản phẩm — Language Center

Bản đầu, ngày 07/10/2026. Căn cứ: `Architechtured.md`. Dự án hiện chưa có mã nguồn; các quyết định dưới đây là đề xuất ban đầu.

## Mục tiêu và người dùng

Ứng dụng nội bộ giúp nhân viên trung tâm tiếp nhận học viên, quản lý lớp và xếp lớp trong cùng một nơi. Tên hiển thị tạm thời: Language Center. Giao diện dùng “Học viên”; tên model `HocSinh` giữ theo kiến trúc.

Giả định MVP phục vụ một trung tâm, một cơ sở. Quản trị viên quản lý tài khoản và toàn bộ dữ liệu; nhân viên quản lý hồ sơ, khóa học, lớp và đăng ký. Cổng học viên, cổng giáo viên, thanh toán, điểm danh và điểm thi nằm ngoài MVP.

## Phạm vi và màn hình

| Màn hình | Nội dung chính | Hành động chính |
| --- | --- | --- |
| Đăng nhập | Tên đăng nhập, mật khẩu, lỗi xác thực | Đăng nhập |
| Tổng quan | Tổng học viên, giáo viên, lớp, khóa học; lớp đang tuyển | Đăng ký lớp, mở lớp |
| Học viên | Tìm theo mã/tên/điện thoại, lọc trạng thái; danh sách và hồ sơ | Thêm, sửa, ngừng hoạt động |
| Giáo viên | Chuyên môn, trình độ, lớp phụ trách | Thêm, sửa, phân công |
| Khóa học | Trình độ, học phí niêm yết, thời lượng | Thêm, sửa, xem lớp |
| Lớp học | Khóa học, giáo viên, lịch, phòng, sĩ số, trạng thái | Tạo lớp, xem danh sách |
| Đăng ký lớp | Học viên, lớp còn chỗ, ngày đăng ký | Đăng ký, hủy, chuyển lớp |
| Thống kê | Học viên theo lớp/khóa học; lớp theo giáo viên | Lọc và xem kết quả |

## Luồng nghiệp vụ

1. Tiếp nhận: tìm học viên trước → mở hồ sơ sẵn có hoặc thêm hồ sơ → chọn đăng ký lớp.
2. Xếp lớp: chọn học viên → chọn lớp → kiểm tra trạng thái, chỗ trống và trùng đăng ký → xác nhận → cập nhật danh sách và sĩ số.
3. Tạo lớp: chọn khóa học → nhập ngày, lịch và phòng → phân công giáo viên → đặt sĩ số → lưu.
4. Chuyển lớp: mở đăng ký hiện tại → chọn lớp đích → kiểm tra điều kiện → xác nhận → chuyển trong một transaction; lỗi thì giữ nguyên lớp cũ.

## Quy tắc và dữ liệu cần bổ sung

- Tên bắt buộc; ngày sinh không ở tương lai; email kiểm tra định dạng khi có nhập. Cần ít nhất một thông tin liên hệ. Trùng điện thoại/email đưa ra cảnh báo đối chiếu, không mặc định từ chối vì có thể dùng liên hệ phụ huynh.
- Sĩ số tối đa là số nguyên dương; ngày kết thúc không trước ngày bắt đầu; học phí không âm, lưu kiểu decimal và hiển thị VND.
- Chỉ đăng ký vào lớp đang tuyển; không đăng ký trùng cặp học viên–lớp đang hiệu lực. Sĩ số tính từ đăng ký hiệu lực, không nhập tay.
- Kiểm tra chỗ trống và tạo đăng ký trong transaction có kiểm soát đồng thời để tránh vượt sĩ số.
- Không xóa cứng hồ sơ đã có quan hệ. Dùng trạng thái ngừng hoạt động; khóa học có lớp và lớp có đăng ký phải giữ lịch sử.
- Chuẩn hóa lịch thành `LichHoc` gồm thứ trong tuần, giờ bắt đầu/kết thúc và phòng. Kiểm tra giao nhau về ngày và giờ khi phân công phòng/giáo viên. Chuỗi mô tả lịch trong kiến trúc chỉ phù hợp hiển thị.
- Bổ sung trạng thái lớp: nháp, đang tuyển, đang học, hoàn thành, hủy. Đăng ký: hiệu lực, hủy, đã chuyển. Lưu thời điểm thay đổi và người thực hiện.
- Theo schema người dùng cung cấp, `HocSinhLopHoc` ánh xạ bảng `HocSinh_LopHoc` với khóa kép `(MaHS, MaLop)`. Đăng ký lại kích hoạt dòng hiện có; lưu lịch sử từng lần đăng ký cần mở rộng sau.
- Theo schema người dùng cung cấp, giữ bảng `TaiKhoan`, dùng thư viện hash mật khẩu và xác thực cookie, kiểm tra quyền ở server và chống CSRF cho thao tác ghi. Nếu chọn ASP.NET Core Identity đầy đủ thì phải bổ sung schema tương ứng.

Schema hiện tại và các giới hạn được mô tả trong `docs/DATA_MODEL.md`; SQL gốc tại `database/001_CreateDatabase.sql`. Lịch có cấu trúc và nhật ký nêu trên là đề xuất mở rộng, chưa có trong schema gốc.

## Hệ thống giao diện

Nền xám xanh nhạt, sidebar trắng, xanh lá đậm làm màu chính. Thẻ trắng có viền nhẹ; số liệu lớn, bảng dễ quét. Font hệ thống hỗ trợ tiếng Việt; cỡ chữ nội dung 14–16px. Khoảng cách theo bước 4/8px, bo góc 12–18px.

Sidebar giữ thứ tự Tổng quan → Học viên → Giáo viên → Khóa học → Lớp học → Đăng ký lớp → Thống kê. Mỗi trang có tiêu đề, mô tả ngắn và một hành động chính. Trạng thái luôn có chữ kèm màu. Mobile đưa navigation lên đầu trang; bảng cuộn ngang.

Form đặt nhãn bên trên, lỗi ngay dưới trường, giữ dữ liệu khi lỗi. Danh sách trống có hướng dẫn tạo mới; tìm kiếm không có kết quả có cách xóa lọc. Nút và trường có trạng thái focus rõ; dialog hỗ trợ Escape và trả focus về nút mở. Server lỗi cần thông báo và cho thử lại.

## Bản mẫu và tiêu chí hoàn thành

Mở `wwwroot/index.html` để xem tổng quan, học viên, giáo viên, khóa học, lớp học, đăng ký lớp và thống kê. Có thể thêm/sửa hồ sơ; tìm và lọc học viên; xem danh sách lớp; đăng ký, hủy và chuyển lớp. Dữ liệu mẫu chỉ tồn tại trong bộ nhớ, tải lại trang sẽ đặt lại. Bản mẫu không có đăng nhập, phân quyền, kết nối SQL Server, giao dịch thực hoặc kiểm tra trùng lịch; validation ở trình duyệt chỉ minh họa trải nghiệm và không thay thế validation phía server.

MVP triển khai thật hoàn thành khi đăng nhập/phân quyền hoạt động; CRUD có validation ở server; đăng ký/chuyển lớp giữ đúng sĩ số và lịch sử; dashboard lấy dữ liệu thật; các trạng thái trống/lỗi có giao diện; sử dụng được bằng bàn phím và trên mobile.

## Kế hoạch triển khai

1. Chuyển layout bản mẫu sang `_Layout.cshtml`, tạo models, xác thực trên bảng TaiKhoan và DbContext khớp schema SQL Server đã cung cấp; thống nhất cách quản lý migration trước khi tạo database thật.
2. Làm học viên, giáo viên, khóa học và lớp theo từng luồng hoàn chỉnh từ form tới database.
3. Làm đăng ký/chuyển lớp với transaction và kiểm tra đồng thời; kiểm thử lớp đầy, đăng ký trùng và rollback.
4. Nối dashboard/thống kê, rà soát phân quyền, responsive và trải nghiệm lỗi.

Trước khi triển khai nghiệp vụ mở rộng cần chốt: một hay nhiều cơ sở; có học viên nhỏ tuổi cần hồ sơ phụ huynh hay không; lịch cố định hay lịch từng buổi; quyền của nhân viên đối với tài khoản.
qa
