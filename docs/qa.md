# Nghiệm thu website THADO GROUP

## Current verification cho nhánh bàn giao

Ngày 23/11/2026, nền main 558dfe2, nhánh fix/final-security-and-hosting-readiness. Chạy lại npm ci, npm run check, npm run build, npm run test:e2e và npm audit. Build set GANBAROU_URL=https://heyganba.site/ và JIAYOU_URL trống. Check 0 lỗi/cảnh báo, Playwright 69 pass / 16 skip / 0 fail trong 30 giây, audit 0 lỗ hổng.

Năm cấu hình Chromium desktop 1440, mobile 360, narrow 320 và WebKit tablet 768, mobile 390 đều chạy. Kiểm thử có axe, mailto/contact, keyboard, reduced motion, thiếu IntersectionObserver, JavaScript-off, URL validation và build production/noindex. Zalo điện thoại là Owner confirmed theo yêu cầu của chủ dự án, không phải kết quả giả lập.

Compose staging qua kiểm tra config local. Chưa có Docker daemon local để chạy Nginx container, chưa triển khai lên server read-only. Nginx runtime, HTTPS, cache, rollback và toàn bộ acceptance trên staging thật là PENDING. Remote CI được theo dõi trên đúng SHA trong Draft PR.

## Historical QA và bằng chứng giao diện trước đó

## Kiểm tra cập nhật ngày 23/11/2026

Thay đổi trên nền commit `1b53116` tại checkout lồng đang phục vụ cổng 4321. Đã bổ sung Gmail, sửa hiệu ứng cuộn và reduced motion.

- `npm run check` có 0 lỗi và cảnh báo. Build thành công.
- `npm run test:e2e` có 69 pass, 16 skip theo phạm vi cấu hình, 0 fail, tổng 85 ca trong 33,1 giây.
- Chromium desktop/mobile/320 px và WebKit tablet/mobile đã kiểm tra Gmail mailto, điều hướng, footer và axe. Các lượt axe ghi nhận 0 vi phạm.
- Tests mới kiểm tra focus bỏ animation ngay, thiếu IntersectionObserver vẫn đọc được nội dung và thay đổi reduced motion khi trang đang mở.
- Kiểm thử có sẵn bao phủ tắt JavaScript, kết nối chậm, URL sản phẩm và build production/preview.
- Đã xem ảnh Contact tiếng Anh trên desktop và tiếng Việt ở 320 px, Gmail vừa chiều rộng. [Ảnh desktop](qa/contact-desktop.png), [ảnh mobile](qa/contact-mobile.png)
- Bản preview cuối được build với `GANBAROU_URL=https://heyganba.site/` theo URL đã ghi nhận ở .env.example. Jiayou giữ trạng thái sắp ra mắt.
- Header được kiểm tra thêm trên Wrangler Pages. Xem kết quả và giới hạn tại [báo cáo bảo mật](security.md).

Thiết bị điện thoại thật và host production chưa được kiểm tra trong lần cập nhật này. Các phần dưới giữ lịch sử nghiệm thu trước đó.

**Ngày 22/11/2026.** Báo cáo ghi kết quả trên nhánh `fix/final-pre-release-stabilization`, kế thừa sau khi PR #1 (`feat/corporate-website-v1`) và PR #6 (`fix/post-m0-audit-and-validation`) đã merge thành công vào `main` tại SHA `e8fc0b2636d43ddf1f7aa281c1b3e325e6d6d881`. CI trên `main` (run 45038511590) đã kiểm tra thành công. Chưa có review độc lập: cùng một agent kỹ thuật thực hiện tuần tự việc phát triển, kiểm thử và rà soát bảo mật.

## Môi trường đo

| Thành phần | Phiên bản |
| --- | --- |
| Node.js | 24.21.0 |
| npm | 11.19.0 |
| Astro | 7.4.13 |
| Playwright | 1.65.1 |
| axe-core (`@axe-core/playwright`) | 4.14.0 |
| Chromium (Playwright) | 159.0.8154.6 |
| WebKit (Playwright) | 27.2 |
| Lighthouse | 13.6.0 |
| Hệ điều hành | Windows 11, 10.0.26300 |

Bản preview được build bằng `npm run build` vào `dist/` (không đặt `SITE_ENV`, có `noindex`). Bản production được build bằng `SITE_ENV=production` và `SITE_URL=https://thadocorp.com` vào thư mục tạm. Cả hai được phục vụ cục bộ bằng `wrangler pages dev` 4.166.0 để áp dụng `public/_headers` như Cloudflare Pages.

## Ma trận kiểm thử

| Môi trường | Kích thước CSS | Các hành trình chính | Trạng thái |
| --- | --- | --- | :---: |
| Chromium desktop | 1440 × 960 | VI/EN, menu, sản phẩm, liên hệ, focus, 404, axe, CSP | Locally tested |
| Chromium mobile | 360 × 800 | Bố cục hẹp, chạm, menu bàn phím và Escape, VI/EN, axe | Locally tested |
| Chromium narrow | 320 × 640 | Màn hình cực hẹp 320 px, kiểm tra không tràn ngang, axe | Locally tested |
| WebKit tablet | 768 × 1024 | Bố cục trung gian, điều hướng, sản phẩm, footer VI/EN, axe | Locally tested |
| WebKit mobile | 390 × 844 | Menu, chuyển ngôn ngữ, sản phẩm, liên hệ, JS tắt, axe | Locally tested |

Playwright chạy trên `dist/`. Bộ test đối chiếu canonical, hreflang, đích liên hệ, CTA và trạng thái sản phẩm. Bản build tạm dùng URL `.test` và URL thực tế Ganbarou `https://heyganba.site/` để kiểm tra link sản phẩm ở cả hai ngôn ngữ, từ chối URL HTTP hoặc URL có thông tin đăng nhập. Một bản production tạm kiểm tra `robots.txt`, sitemap và việc bỏ `noindex`. Test header đọc `dist/_headers`, áp dụng CSP như Pages và theo dõi `securitypolicyviolation`.

## Kết quả tự động

| Lệnh hoặc bộ kiểm tra | Kết quả | Ghi chú / Trạng thái |
| --- | --- | --- |
| `npm run check` | 0 lỗi, 0 cảnh báo, 0 gợi ý trên 17 tệp | Verified |
| `npm run build` | 3 trang, `robots.txt`, `sitemap.xml`; exit 0 | Verified |
| `npx playwright test` | 75 test: 59 pass, 16 skip có chủ đích, 0 fail | Verified |
| axe (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`) | 0 vi phạm trên 5 cấu hình viewport, cả VI và EN | Locally tested |
| `npm audit` | 0 lỗ hổng (info/low/moderate/high/critical = 0) | Verified |
| Build với URL Ganbarou `https://heyganba.site/` | Link native, cùng tab, nhãn rõ ràng; Jiayou hiển thị "Sắp ra mắt" | Verified |
| Build với URL HTTP hoặc URL có credentials | Build thất bại, exit 1 | Verified |
| Production build với `SITE_URL` sai | Build thất bại, exit 1 | Verified |
| CSP và header | Đủ directive, không có `unsafe-inline`/`unsafe-eval`, không có vi phạm | Locally tested |

Các test bị skip là chủ đích theo viewport: menu thu gọn không tồn tại ở desktop/tablet, test mạng chậm chỉ chạy trên Chromium mobile, test build tĩnh chỉ chạy một lần trên Chromium desktop.

## Lighthouse mobile

Đo trên bản production tại `http://127.0.0.1:8792/`, form factor mobile, throttling mô phỏng (Lighthouse mặc định):

| Hạng mục | Điểm | Ghi chú |
| --- | --- | --- |
| Performance | 100 | Số đo cục bộ mô phỏng (Locally tested) |
| Accessibility | 100 | Số đo cục bộ mô phỏng (Locally tested) |
| Best Practices | 100 | Số đo cục bộ mô phỏng (Locally tested) |
| SEO | 100 | Số đo cục bộ mô phỏng (Locally tested) |
| FCP / LCP / TBT / CLS / Speed Index | 0,8 s / 0,8 s / 0 ms / 0,047 / 0,8 s | Số đo cục bộ; không thay thế dữ liệu thực địa RUM |

Bản preview đạt Performance 100, Accessibility 100, Best Practices 100 và SEO 69. Điểm SEO thấp hơn là do `noindex` có chủ đích; bản production không có `noindex` và đạt 100.

## Kiểm tra chức năng và trải nghiệm

| Hạng mục | Cách kiểm tra | Kết quả | Trạng thái |
| --- | --- | --- | :---: |
| Menu mobile bằng bàn phím | `Enter`, `Tab`, `Escape`, chọn mục | Mở/đóng đúng `aria-expanded`, Escape trả focus về nút, chọn mục đóng menu | Locally tested |
| Thứ tự đọc và CTA | Hero → sản phẩm ở 320 px, 360 px và desktop | CTA chính tới `#products`; nội dung sản phẩm vào viewport | Locally tested |
| Chuyển ngôn ngữ | Link VI/EN trên header | Đúng `/` và `/en/`, cập nhật thẻ lang và canonical | Locally tested |
| Focus | Tab qua link, nút, icon | Outline 3 px `#176eb1`, viền trắng 2 px; không phụ thuộc hover | Locally tested |
| Reduced motion | `prefers-reduced-motion: reduce` | Không animation, không stagger, `scroll-behavior: auto` | Locally tested |
| JavaScript tắt | Context Playwright tắt JS | H1, CTA, sản phẩm, số điện thoại, Zalo link vẫn đọc và click được | Locally tested |
| Không tràn ngang (320px) | Check viewport Playwright tại 320 × 640 | `scrollWidth <= clientWidth`, không cuộn ngang ở 320px | Locally tested |
| Tương phản | Tính theo màu thực tế | Navy/white 15,38:1; đỏ/white 5,78:1; muted/white 6,18:1; chữ sản phẩm 9,53:1 | Locally tested |
| Liên kết Zalo desktop | Mở trực tiếp `https://zalo.me/0354314095` trên trình duyệt | Mở đúng trang Zalo hồ sơ "Thiet Thach", có nhắn tin & QR | **Owner confirmed** |
| Liên kết Zalo trong code | Thẻ `<a>` native, accessible name "Liên hệ qua Zalo" / "Contact via Zalo" | Nhấn mở trang Zalo, không chạm nút copy, vùng bấm 44x44px | Locally tested |
| Sao chép số Zalo | Nút copy, Clipboard API + execCommand | Phản hồi thông báo trực quan & `role="status"` cho screen reader | Locally tested |
| Mở app Zalo trên điện thoại thật | Thiết bị thật có cài app Zalo | Chưa kiểm nghiệm thực tế trên mobile | **Pending** |
| URL Ganbarou | `https://heyganba.site/` | Chủ dự án cung cấp; test build ra link native cùng tab | **Owner provided** |
| 404 | Đường dẫn không tồn tại | HTTP 404, nhận diện THADO, link về trang chủ hoạt động | Locally tested |
| Header trên host tĩnh | `curl -I` qua `wrangler pages dev` | CSP, HSTS, nosniff, DENY, Referrer-Policy, Permissions-Policy đầy đủ | Locally tested |
| Review độc lập | Đơn vị / Chuyên viên bên ngoài | Cùng một agent kỹ thuật tự kiểm tra tuần tự | **Chưa có** |

## Ảnh giao diện

Ảnh chụp toàn trang từ bản build preview, chụp bằng Chromium tại 1440 × 960 và 360 × 800:

- [VI desktop](qa/vi-chromium-desktop.png)
- [VI mobile](qa/vi-chromium-mobile.png)
- [EN desktop](qa/en-chromium-desktop.png)
- [EN mobile](qa/en-chromium-mobile.png)

## Điều kiện còn chờ trước khi phát hành Production

- **URL Jiayou:** Ganbarou đã có URL chính thức `https://heyganba.site/` (*Owner provided*); Jiayou chưa có URL chính thức, tiếp tục duy trì trạng thái "Sắp ra mắt" (*Coming soon*).
- **Kiểm thử Zalo trên điện thoại thật:** Liên kết `https://zalo.me/0354314095` dạng thẻ `<a>` native đã được chủ tài khoản xác nhận đích trên desktop (*Owner confirmed*). Hành vi mở ứng dụng Zalo trên điện thoại Android/iOS thật cần chủ dự án kiểm nghiệm thủ công (*Pending manual test*).
- **Quyền Cloudflare Pages:** Môi trường chưa đăng nhập tài khoản Cloudflare; cần chủ dự án cấp quyền hoặc thiết lập biến môi trường `GANBAROU_URL` và `APPROVED_RELEASE_SHA` theo hướng dẫn.
- **Quy tắc bảo vệ `main`:** Cần chủ dự án kích hoạt branch ruleset cho `main` trên GitHub Settings để yêu cầu CI check `Build and browser tests` trước khi merge.
- **Tên miền và TLS trên `thadocorp.com`:** Chưa triển khai domain và chưa trỏ DNS vì chờ phê duyệt mốc phát hành M3.
- **Đánh giá độc lập:** Chưa có chuyên viên bên ngoài đánh giá độc lập; mọi bài test hiện tại được thực thi tự động qua bộ kiểm thử chuẩn của dự án.

## Chạy lại

```sh
npm ci
npx playwright install --with-deps chromium webkit
npm run check
npm run build
npm run test:e2e
```

Trên PowerShell, đặt `$env:QA_SCREENSHOT_DIR = 'docs/qa'` trước lệnh test để lưu lại ảnh VI/EN của Chromium desktop và mobile. Trên Windows, dùng `npx playwright install chromium webkit` để cài trình duyệt.

