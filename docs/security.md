# Rà soát bảo mật website THADO GROUP

**Ngày 22/11/2026.** Phạm vi: mã nguồn, cấu hình build, header tĩnh, dependency, liên kết và quyền CI trên nhánh `feat/corporate-website-v1`, commit mã nguồn `5cb592895fcc256963b2dfa30fd531256612dba9`. Đây là rà soát của cùng agent phát triển, không phải review độc lập. Chưa có quyền quản trị GitHub/Cloudflare để xác nhận cấu hình bảo vệ repo và host.

## Kết luận

Không phát hiện lỗi chặn phát hành ở phần mã nguồn và cấu hình tĩnh. Website không có backend, biểu mẫu, cookie, tài khoản, thanh toán hoặc lưu dữ liệu người dùng. Các điều kiện còn chờ thuộc về quyền host/domain và bước xác nhận trên môi trường thật, được liệt kê ở cuối.

## Kiểm tra đã thực hiện

| Hạng mục | Bằng chứng | Kết quả |
| --- | --- | --- |
| CSP | `public/_headers`; test Playwright áp dụng header và bắt `securitypolicyviolation` | `default-src 'none'`, script/style/img/font/connect chỉ `'self'`, `base-uri 'none'`, `frame-ancestors 'none'`, `form-action 'none'`; không có `unsafe-inline`/`unsafe-eval`; 0 vi phạm trên `/` và `/en/` |
| Header phòng thủ | `curl -I` qua `wrangler pages dev` 4.166.0 | Có `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy` trên trang và asset |
| Tài nguyên bên thứ ba | Kiểm tra mã và network của test | Không có script, font, ảnh hay analytics từ domain khác; Manrope và icon được lưu cục bộ |
| Liên kết ngoài | `src/data/contact.ts`, test footer | Facebook, GitHub và Zalo đúng URL đã xác nhận; mở cùng tab; không có `target="_blank"` nên không cần `noopener` |
| Zalo | `Footer.astro`, `public/site.js`, test liên kết và sao chép | Liên kết `https://zalo.me/0354314095` dạng thẻ `<a>` native; đích desktop *Owner confirmed*; số hiển thị văn bản; nút sao chép có Clipboard API và fallback `execCommand`, thông báo `role="status"` |
| Số điện thoại | `tel:+84354314095` | Đúng số đã cung cấp; không suy ra email hoặc thông tin khác |
| Bí mật và dữ liệu | `git status`, `.gitignore`, `.env.example` | Không commit `.env`, token hay dữ liệu riêng; `.env*` bị bỏ qua, chỉ mẫu placeholder được thêm |
| Dependency | `package.json`, lockfile, `npm audit`, dependabot.yml | Phiên bản ghim chính xác; audit 0 lỗ hổng; Dependabot cấu hình npm & Actions hằng tuần, ignore major version của `typescript` để ngăn xung đột peer dependency với `@astrojs/check` |
| Mã nguy hiểm | Rà soát `src/`, `public/` | Không `eval`, `innerHTML`, `document.write`, script động, iframe hay xử lý dữ liệu người dùng |
| Build production | `astro.config.mjs`, test production | Bản preview có `noindex`; bản production bắt buộc `SITE_URL` đúng origin, bỏ `noindex`, robots cho phép index và sitemap dùng domain đã duyệt |
| CI | `.github/workflows/ci.yml`; GitHub Actions run 45034705226 | Quyền `contents: read`; checkout không giữ credentials; action ghim theo SHA; không có token hosting; workflow xanh trên draft PR #1 |
| Quyền repo | GitHub API với quyền quản trị, 22/11/2026 | `main` chưa được bảo vệ (404); Dependabot alerts tắt (404), automated security fixes tắt; secret scanning và push protection đã bật; non-provider patterns và validity checks tắt; Actions cho phép mọi action và không bắt buộc ghim SHA |

## Rủi ro còn lại và điều kiện

1. **Chưa kiểm tra trên host thật.** Header mới được xác nhận trên Wrangler Pages cục bộ. Khi có preview/production, chạy lại `curl -I` trên `/`, `/en/`, một asset và một đường dẫn 404; đối chiếu đúng `public/_headers`.
2. **Bảo vệ nhánh và Dependabot alerts chưa bật.** `main` hiện không có quy tắc bảo vệ; Dependabot alerts và automated security fixes đang tắt. Secret scanning và push protection đã bật. Cần chủ dự án quyết định bật quy tắc cho `main` (lưu ý repo một người: yêu cầu review cần reviewer khác hoặc quy tắc phù hợp) và bật Dependabot alerts/security updates. Không merge khi CI đỏ.
3. **Phát hành có kiểm soát.** Cloudflare Pages phải tắt tự động deploy production; build production chỉ chạy khi `APPROVED_RELEASE_SHA` khớp SHA đã duyệt. Không đặt token Cloudflare trong repo.
4. **Domain và DNS.** Việc chuyển nameserver, bản ghi MX/SPF/DKIM/DMARC và CAA cần kiểm kê, đối chiếu và duyệt riêng trước khi trỏ lưu lượng. Giữ HTTPS và HSTS; kiểm tra chứng chỉ sau khi gắn domain.
5. **CSP là chính sách chặt.** Nếu sau này thêm style inline, script inline, analytics hoặc font bên ngoài, phải cập nhật CSP có chủ đích và chạy lại test; không thêm `unsafe-inline` để xử lý nhanh.
6. **Zalo.** Chỉ thay nút sao chép bằng deep link sau khi xác minh đích mở đúng tài khoản trên thiết bị thật. Giữ số đọc được và thông báo kết quả cho screen reader.
7. **URL sản phẩm.** Chỉ điền URL HTTPS đã được chủ dự án xác nhận. Cấu hình hiện từ chối HTTP và URL có credentials; link rỗng hiển thị trạng thái tĩnh, không tạo link giả.

## Phân mức

| Mức | Số lượng | Ghi chú |
| --- | --- | --- |
| Chặn phát hành | 0 | Trong phạm vi mã nguồn và cấu hình tĩnh |
| Cao | 0 | — |
| Trung bình | 0 | — |
| Thấp / cần xác nhận | 2 | Header trên host thật; cấu hình bảo vệ repo và quyền triển khai |

## Lệnh kiểm tra lại

```sh
npm audit
npm run check
npm run build
npx playwright test tests/security-headers.spec.ts
curl -sSI https://<host>/ | findstr /i "content-security-policy strict-transport x-frame-options x-content-type referrer-policy permissions-policy"
```

Trên Linux/macOS, thay `findstr` bằng `grep -i` hoặc xem toàn bộ header.
