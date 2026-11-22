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
| Liên kết ngoài | `src/data/contact.ts`, test footer | Facebook và GitHub đúng URL chủ dự án cung cấp; mở cùng tab; không có `target="_blank"` nên không cần `noopener` |
| Zalo | `Footer.astro`, `public/site.js`, test sao chép | Chưa gắn deep link khi chưa xác minh; số hiển thị dạng văn bản; nút sao chép dùng Clipboard API, có fallback `execCommand`, có thông báo qua `role="status"`; số vẫn đọc được khi tắt JS hoặc cả hai cách sao chép thất bại |
| Số điện thoại | `tel:+84354314095` | Đúng số đã cung cấp; không suy ra email hoặc thông tin khác |
| Bí mật và dữ liệu | `git status`, `.gitignore`, `.env.example` | Không commit `.env`, token hay dữ liệu riêng; `.env*` bị bỏ qua, chỉ mẫu placeholder được thêm |
| Dependency | `package.json`, lockfile, `npm audit` | Phiên bản ghim chính xác; lockfile được commit; audit 0 lỗ hổng tại thời điểm kiểm tra; Dependabot cấu hình npm và GitHub Actions hằng tuần |
| Mã nguy hiểm | Rà soát `src/`, `public/` | Không `eval`, `innerHTML`, `document.write`, script động, iframe hay xử lý dữ liệu người dùng |
| Build production | `astro.config.mjs`, test production | Bản preview có `noindex`; bản production bắt buộc `SITE_URL` đúng origin, bỏ `noindex`, robots cho phép index và sitemap dùng domain đã duyệt |
| CI | `.github/workflows/ci.yml` | Quyền `contents: read`; checkout không giữ credentials; action ghim theo SHA; không có token hosting; upload artifact giới hạn 7 ngày |
| Quyền repo | GitHub API công khai; API bảo vệ nhánh trả 401 | Chưa xác nhận branch protection, secret scanning, push protection và Dependabot alerts; cần quản trị viên kiểm tra |

## Rủi ro còn lại và điều kiện

1. **Chưa kiểm tra trên host thật.** Header mới được xác nhận trên Wrangler Pages cục bộ. Khi có preview/production, chạy lại `curl -I` trên `/`, `/en/`, một asset và một đường dẫn 404; đối chiếu đúng `public/_headers`.
2. **Bảo vệ nhánh và chuỗi cung ứng chưa xác nhận.** Cần bật quy tắc cho `main` (review + check CI), secret scanning, push protection và Dependabot alerts theo quyền sẵn có. Không merge khi CI đỏ.
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
