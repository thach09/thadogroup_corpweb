# Nghiệm thu website THADO GROUP

**Ngày 22/11/2026.** Báo cáo ghi kết quả trên nhánh `feat/corporate-website-v1`, commit mã nguồn và QA `5cb592895fcc256963b2dfa30fd531256612dba9`. Commit tài liệu sau đó chỉ cập nhật báo cáo, không đổi mã nguồn. SHA cũng được ghi trong [`docs/handover.md`](handover.md) và PR. Chưa có review độc lập: cùng một agent thực hiện phát triển, kiểm thử và rà soát bảo mật.

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

| Môi trường | Kích thước CSS | Các hành trình chính |
| --- | --- | --- |
| Chromium desktop | 1440 × 960 | VI/EN, menu, sản phẩm, liên hệ, focus, 404, axe |
| Chromium mobile | 360 × 800 | Bố cục hẹp, thao tác chạm, menu bàn phím và Escape, VI/EN, axe |
| WebKit tablet | 768 × 1024 | Bố cục trung gian, điều hướng, sản phẩm, footer VI/EN, axe |
| WebKit mobile | 390 × 844 | Menu, chuyển ngôn ngữ, sản phẩm, liên hệ, JavaScript tắt, axe |

Playwright chạy trên `dist/`. Bộ test đối chiếu canonical, hreflang, đích liên hệ, CTA và trạng thái sản phẩm. Bản build tạm dùng URL `.test` để kiểm tra link sản phẩm ở cả hai ngôn ngữ, từ chối URL HTTP hoặc URL có thông tin đăng nhập. Một bản production tạm kiểm tra `robots.txt`, sitemap và việc bỏ `noindex`. Test header đọc `dist/_headers`, áp dụng CSP như Pages và theo dõi `securitypolicyviolation`.

## Kết quả tự động

| Lệnh hoặc bộ kiểm tra | Kết quả |
| --- | --- |
| `npm run check` | 0 lỗi, 0 cảnh báo, 0 gợi ý trên 17 tệp |
| `npm run build` | 3 trang, `robots.txt`, `sitemap.xml`; exit 0 |
| GitHub Actions | **Website CI** trên draft PR #1, run 45034705226: success (npm ci, check, build, Playwright) |
| `npx playwright test` | 60 test: 47 pass, 13 skip có chủ đích, 0 fail |
| axe (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`) | 0 vi phạm trên 4 cấu hình, cả VI và EN |
| `npm audit` | 0 lỗ hổng (info/low/moderate/high/critical = 0) |
| Build với URL sản phẩm HTTPS | Link native, cùng tab, đúng URL ở cả hai ngôn ngữ |
| Build với URL HTTP hoặc URL có credentials | Build thất bại, exit 1 |
| Production build với `SITE_URL` sai | Build thất bại, exit 1 |
| CSP và header | Đủ directive, không có `unsafe-inline`/`unsafe-eval`, không có vi phạm |

Các test bị skip là chủ đích theo viewport: menu thu gọn không tồn tại ở desktop/tablet, test mạng chậm chỉ chạy trên Chromium mobile, test build tĩnh chỉ chạy một lần trên Chromium desktop.

## Lighthouse mobile

Đo trên bản production tại `http://127.0.0.1:8792/`, form factor mobile, throttling mô phỏng (Lighthouse mặc định):

| Hạng mục | Điểm |
| --- | --- |
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| FCP / LCP / TBT / CLS / Speed Index | 0,8 s / 0,8 s / 0 ms / 0,047 / 0,8 s |

Bản preview đạt Performance 100, Accessibility 100, Best Practices 100 và SEO 69. Điểm SEO thấp hơn là do `noindex` có chủ đích; bản production không có `noindex` và đạt 100. Đây là số đo cục bộ với throttling mô phỏng, không phải dữ liệu thực địa.

## Kiểm tra thủ công và bán tự động

| Hạng mục | Cách kiểm tra | Kết quả |
| --- | --- | --- |
| Menu mobile bằng bàn phím | `Enter`, `Tab`, `Escape`, chọn mục | Mở/đóng đúng `aria-expanded`, Escape trả focus về nút, chọn mục đóng menu |
| Thứ tự đọc và CTA | Hero → sản phẩm ở 360 px và desktop | CTA chính tới `#products`; nội dung sản phẩm vào viewport |
| Chuyển ngôn ngữ | Link VI/EN trên header | Đúng `/` và `/en/`, giữ nguyên anchor khi quay lại |
| Focus | Tab qua link, nút, icon | Outline 3 px `#176eb1`, viền trắng 2 px; không phụ thuộc hover |
| Reduced motion | `prefers-reduced-motion: reduce` | Không animation, không stagger, `scroll-behavior: auto` |
| JavaScript tắt | Context Playwright tắt JS | H1, CTA, sản phẩm, số điện thoại và số Zalo vẫn đọc được |
| Tương phản | Tính theo màu thực tế | Navy/white 15,38:1; đỏ/white 5,78:1; muted/white 6,18:1; chữ sản phẩm 9,53:1; focus trên trắng 5,38:1; trắng/navy 15,38:1 |
| 404 | Đường dẫn không tồn tại | HTTP 404, nhận diện THADO, link về trang chủ hoạt động |
| Header trên host tĩnh | `curl -I` qua `wrangler pages dev` | CSP, HSTS, nosniff, DENY, Referrer-Policy, Permissions-Policy có mặt trên `/` và asset |
| Trình duyệt thực trên điện thoại | Thiết bị thật | **Chưa thực hiện**; mới kiểm tra Chromium/WebKit mô phỏng |

## Ảnh giao diện

Ảnh chụp toàn trang từ bản build preview, chụp bằng Chromium tại 1440 × 960 và 360 × 800:

- [VI desktop](qa/vi-chromium-desktop.png)
- [VI mobile](qa/vi-chromium-mobile.png)
- [EN desktop](qa/en-chromium-desktop.png)
- [EN mobile](qa/en-chromium-mobile.png)

## Điều kiện còn chờ

- Chưa có URL HTTPS cho Ganbarou và Jiayou. Cả hai đang hiển thị “Sắp ra mắt” / “Coming soon”. Chủ dự án quyết định cung cấp URL hoặc chấp thuận phát hành thu gọn.
- Chưa xác minh deep link Zalo trên thiết bị thật. Footer giữ số và nút sao chép; không gắn liên kết Zalo đoán.
- Chưa có quyền Cloudflare Pages và GitHub admin trong môi trường này. Chưa tạo preview URL công khai, chưa bật bảo vệ `main`, chưa xác nhận push protection/secret scanning.
- Chưa kiểm tra header và TLS trên `thadocorp.com` vì chưa triển khai domain.
- Chưa có review độc lập của Tester/Security và chưa thử trên thiết bị di động thật.
- CI mới chạy cục bộ; GitHub Actions sẽ chạy khi nhánh được đẩy và mở PR.

## Chạy lại

```sh
npm ci
npx playwright install --with-deps chromium webkit
npm run check
npm run build
npm run test:e2e
```

Trên PowerShell, đặt `$env:QA_SCREENSHOT_DIR = 'docs/qa'` trước lệnh test để lưu lại ảnh VI/EN của Chromium desktop và mobile. Trên Windows, dùng `npx playwright install chromium webkit` để cài trình duyệt.

