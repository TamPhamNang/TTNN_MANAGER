# Tài nguyên ảnh và video

- `images/`: ảnh dùng trong giao diện (PNG, JPG, WebP, SVG).
- `videos/`: video dùng trong giao diện (MP4, WebM).

Trong Razor Views, dùng đường dẫn `~/assets/images/ten-anh.webp` hoặc `~/assets/videos/ten-video.mp4`. Trong bản HTML độc lập `wwwroot/index.html`, dùng `assets/images/ten-anh.webp` hoặc `assets/videos/ten-video.mp4`.

Các tệp trong `wwwroot` được phục vụ công khai. Tài liệu hoặc nội dung riêng tư cần được lưu ngoài thư mục này.
