# THADO GROUP

Website giới thiệu THADO GROUP bằng Astro static và TypeScript. Trang tiếng Việt ở `/`, tiếng Anh ở `/en/`. Bản build gồm HTML, CSS, JavaScript và phông chữ tự lưu trữ trong `dist/`.

## Chạy trên máy

Dùng Node.js 24.21.0 và npm 11.19.0. Từ thư mục gốc của checkout, chạy:

```sh
npm ci
npm run dev
```

Mở địa chỉ Astro in ra trong terminal. Để kiểm tra bản build tĩnh:

```sh
npm run check
npm run build
npm run preview
```

Chạy bộ kiểm thử sau khi build:

```sh
npx playwright install chromium webkit
npm run test:e2e
```

Trên Linux CI, thêm `--with-deps` vào lệnh cài trình duyệt. Xem [báo cáo QA và ảnh giao diện](docs/qa.md).

Bản mặc định là preview: có `noindex`, `robots.txt` chặn crawler và phù hợp để duyệt nội dung. Bản production chỉ được build khi origin khớp domain đã duyệt:

```powershell
$env:SITE_ENV='production'; $env:SITE_URL='https://thadocorp.com'; npm run build
```

Trong Bash, dùng `SITE_ENV=production SITE_URL=https://thadocorp.com npm run build`. Build production bỏ `noindex`, cho phép index và tạo sitemap. Nếu `SITE_URL` khác origin, build dừng.

## Cập nhật trang

| Nội dung | Vị trí |
| --- | --- |
| Tiêu đề, mô tả, menu và bản dịch | `src/data/content.ts` |
| Tên sản phẩm, trạng thái và kiểm tra URL | `src/data/products.ts` |
| Số điện thoại, thông tin người sáng lập và mạng xã hội | `src/data/contact.ts` |
| Cấu trúc trang và từng khối | `src/components/` |
| Màu, kiểu chữ, breakpoint và chuyển động | `src/styles/global.css` |
| Menu mobile, sao chép số và hiệu ứng cuộn | `public/site.js` |

Điền URL HTTPS đã xác nhận vào `GANBAROU_URL` hoặc `JIAYOU_URL` trong môi trường build hoặc tệp `.env.local` (xem mẫu `.env.example`) rồi build lại. Mỗi biến chỉ tác động đến một sản phẩm ở cả hai ngôn ngữ. Để trống biến sẽ hiển thị “Sắp ra mắt” / “Coming soon”. Website từ chối URL dùng giao thức khác HTTPS hoặc chứa thông tin đăng nhập. Khi có URL, CTA là link native cùng tab và mang tên sản phẩm.

Footer giữ số Zalo ở dạng văn bản và cung cấp nút sao chép khi có JavaScript. Nút dùng Clipboard API, tự chuyển sang `execCommand` khi API không khả dụng và thông báo kết quả qua `role="status"`. Nếu cả hai cách thất bại, số vẫn đọc được để sao chép thủ công. Deep link Zalo chỉ được thêm sau khi xác minh trên thiết bị thật. Các icon Facebook, GitHub dùng Bootstrap Icons (MIT), phông Manrope dùng SIL Open Font License. Bản quyền được phân phối cùng tài nguyên tại `public/icons/`.

## Duyệt và phát hành

Bản mặc định dùng `noindex` và chặn crawler trong robots.txt. Production cần cấu hình riêng theo [hướng dẫn phát hành, DNS và quay lui](docs/release.md). Sitemap và URL chuẩn hiện dùng domain dự kiến `thadocorp.com`. Bản preview trên máy phục vụ kiểm tra giao diện, Cloudflare Pages áp dụng header từ `public/_headers` khi triển khai.

## Tài liệu bàn giao

- [Phương án M0, sitemap, wireframe và nội dung](docs/M0.md)
- [Trạng thái milestone, việc đang chờ và phương án phát hành](docs/status.md)
- [Nghiệm thu QA, axe, Lighthouse và ảnh desktop/mobile](docs/qa.md)
- [Rà soát bảo mật và điều kiện host](docs/security.md)
- [Phát hành, DNS, TLS và quay lui](docs/release.md)
- [Commit bàn giao, preview và hướng dẫn cập nhật](docs/handover.md)

