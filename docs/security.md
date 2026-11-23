# Rà soát bảo mật website THADO GROUP

## Current audit và DevOps ngày 23/11/2026

Remote [CI 45116596985](https://github.com/thach09/thadogroup_corpweb/actions/runs/45116596985) Success cho source `9ff8e09d0c2f65978fdf77f833c26730359b5550`. PR #10 có mergeable_state blocked khi required check chưa có kết quả, đồng thời PR giữ Draft. Đã xác minh cấu hình bằng GET active rules. Chưa thử thao tác merge một PR lỗi để tránh thực hiện merge ngoài phạm vi được phép.

Đã đọc lại trạng thái quản trị repo. Secret scanning và push protection enabled. Metadata báo dependabot_security_updates disabled, endpoint vulnerability-alerts trả 404. Endpoint automated-security-fixes trả 200, chưa thống nhất với metadata nên chưa kết luận security updates đã hoạt động. Chỉ cập nhật required check theo quyền đã cấp, giữ các thiết lập khác để chủ repo kiểm tra trong Settings.

Đã chuyển an toàn từ nhánh đã merge sang fix/final-security-and-hosting-readiness từ origin/main 558dfe2. Không bỏ thay đổi local. npm ci chạy lại thành công sau khi tạm dừng Astro preview đang khóa native compiler trên Windows. Check 0 lỗi/cảnh báo, build với Ganbarou URL tường minh thành công. Playwright 69 pass, 16 skip theo cấu hình, 0 fail. Audit dependency 0 lỗ hổng được registry báo cáo.

Ruleset 27847039 đã đọc và cập nhật chỉ danh sách required checks, từ rỗng sang Build and browser tests / integration_id 15368. GET sau cập nhật xác nhận Active, default branch, 0 bypass và các rule khác không đổi. Workflow có pull_request trigger. Chưa thực hiện thử merge một PR CI đỏ, không suy diễn thao tác đó đã PASS. Sẽ đọc trạng thái PR và CI của đúng SHA sau push.

Source không có HTML động, eval, endpoint nhận dữ liệu hoặc script bên thứ ba. URL sản phẩm từ chối HTTP/credentials qua build regression. Gmail là mailto do chủ dự án cung cấp. Cấu hình CSP self-only không unsafe-inline/eval, header Pages và kiểm thử CSP trên Chromium/WebKit được giữ. Host tự quản cần deploy/nginx.conf để thực thi header. Template HTTP staging chủ động chưa bật HSTS/TLS.

SSH server chỉ đọc đã xác nhận Docker, Forgejo, nhiều ứng dụng, Caddy Docker, cloudflared, Tailscale Serve và dung lượng. Routing public, firewall/NAT, TLS cho THADO và backup/restore chưa xác minh. Chưa truy cập Settings Forgejo để kiểm thu hồi token cũ, ghi OWNER TO VERIFY. Không dùng hoặc xuất token Forgejo.

Quét secret mẫu và artifact được chạy lại trước commit, kết quả ghi trong PR. Secret pattern scan có giới hạn, không xác minh toàn bộ lịch sử Git. Không có production deployment hoặc staging thật trong đợt này. Chi tiết tại [self-hosting](self-hosting.md).

## Historical audit trước khi đồng bộ main và Ruleset

## Rà soát ngày 23/11/2026

Đã đọc source của checkout đang phục vụ cổng 4321 tại `D:/GitHub/thadogroup_corpweb/thadogroup_corpweb`, nhánh `fix/footer-zalo-icon-and-socials-row`, nền commit `1b53116`. Các kết quả dưới đây áp dụng cho thay đổi Gmail và chuyển động cuộn trong working tree. Đây là tự rà soát của agent thực hiện thay đổi.

| Hạng mục | Bằng chứng mới | Kết quả |
| --- | --- | --- |
| Dependency | `npm audit --json` | 0 lỗ hổng được registry báo cáo |
| XSS và liên kết | Đọc toàn bộ component, script, dữ liệu và cấu hình build | Nội dung được Astro escape. Không có HTML động, eval, form, backend hoặc endpoint nhận dữ liệu. URL sản phẩm chỉ nhận HTTPS, từ chối credentials, được test bằng build thực |
| Gmail | Footer VI/EN và kiểm thử native link | Hiển thị `thietthachdo@gmail.com`, dùng `mailto:`. Địa chỉ do chủ dự án cung cấp để công khai |
| Bí mật và artifact | Quét mẫu private key, GitHub token, AWS access key, API key trên tệp text đang được Git theo dõi. Kiểm tra cây dist | 0 mẫu khớp. Build không chứa .env, .git hoặc source map. Đây là phép quét mẫu, chưa kiểm toán toàn bộ lịch sử Git |
| Header thực thi | Wrangler Pages 4.166.0 trên 127.0.0.1:8788 | CSP, X-Frame-Options, nosniff, HSTS, Referrer-Policy, Permissions-Policy đều có trên /, /en/, /site.js và 404. /.env, /.git/config, /_headers trả 404 |
| CSP trong trình duyệt | Playwright tests/security-headers.spec.ts trên Chromium và WebKit | Tài nguyên cục bộ tải được, 0 sự kiện vi phạm CSP. Chính sách không cho unsafe-inline hoặc unsafe-eval |
| CI | Đọc workflow và Dependabot | Quyền contents: read, checkout không giữ credential, action ghim SHA, cài từ lockfile, check/build/browser tests. Chưa chạy workflow remote cho working tree này |
| Preview và production | Test build riêng | Preview noindex. Production yêu cầu đúng origin. Test từ chối origin khác. Guard APPROVED_RELEASE_SHA nằm trong lệnh build hướng dẫn tại release.md, cần cấu hình lệnh đó trên Pages |

Đã sửa lỗi khả năng truy cập trong hiệu ứng cũ. Class js trước đây làm khối mất opacity ngay cả khi trình duyệt thiếu IntersectionObserver. Nay nội dung hiện mặc định, hiệu ứng dịch 14 px và fade chạy một lần khi vào vùng nhìn. Focus bàn phím bỏ hiệu ứng ngay. Thay đổi prefers-reduced-motion lúc trang đang mở dừng chuyển động, gồm hover ở product và social links.

Kết quả check/build thành công. Playwright có 69 pass, 16 skip theo phạm vi trình duyệt, 0 fail trên năm cấu hình. Các lượt axe không ghi nhận vi phạm. Thêm kiểm tra focus, thiếu IntersectionObserver và đổi reduced motion trong tests/scroll-motion.spec.ts.

Chưa phát hiện lỗ hổng bảo mật mức cao hoặc nghiêm trọng trong phạm vi source và mô phỏng local đã kiểm tra. Quyền quản trị GitHub, Cloudflare, TLS, DNS và header trên host thật chưa được xác minh lại trong đợt này. Thông tin về trạng thái Settings bên dưới là lịch sử ngày 22/11. Nội dung preview có noindex vẫn cần Cloudflare Access nếu có yêu cầu giới hạn người xem.

Header được kiểm tra theo cách Cloudflare áp dụng tệp _headers lên tài nguyên static. CSP được đối chiếu với các hướng dẫn về hạn chế script và chống nhúng. [Cloudflare Headers](https://developers.cloudflare.com/pages/configuration/headers/), [OWASP CSP](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)

## Lịch sử rà soát ngày 22/11/2026

**Ngày 22/11/2026.** Phạm vi: mã nguồn, cấu hình build, header tĩnh, dependency, liên kết và quyền CI trên nhánh `fix/final-pre-release-stabilization`, kế thừa commit HEAD `e8fc0b2636d43ddf1f7aa281c1b3e325e6d6d881` trên `main`. Đây là rà soát kỹ thuật của cùng agent phối hợp, không phải review độc lập. Chưa có quyền quản trị GitHub/Cloudflare để trực tiếp bật cấu hình bảo vệ repo và host.

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
| CI | `.github/workflows/ci.yml`; GitHub Actions run 45038511590 | Quyền `contents: read`; checkout không giữ credentials; action ghim theo SHA; không có token hosting; workflow xanh trên `main` sau merge PR #6 |
| Quyền repo | GitHub API với quyền quản trị, 22/11/2026 | `main` chưa được bảo vệ (404); Dependabot alerts tắt (404), automated security fixes tắt; secret scanning và push protection đã bật; non-provider patterns và validity checks tắt; Actions cho phép mọi action và không bắt buộc ghim SHA |

## Rủi ro còn lại và điều kiện

1. **Chưa kiểm tra trên host thật.** Header mới được xác nhận trên Wrangler Pages cục bộ. Khi có preview/production, chạy lại `curl -I` trên `/`, `/en/`, một asset và một đường dẫn 404; đối chiếu đúng `public/_headers`.
2. **Bảo vệ nhánh và Dependabot alerts chưa bật.** `main` hiện không có quy tắc bảo vệ; Dependabot alerts và automated security fixes đang tắt. Secret scanning và push protection đã bật. Cần chủ dự án quyết định bật quy tắc cho `main` (lưu ý repo một người: yêu cầu review cần reviewer khác hoặc quy tắc phù hợp) và bật Dependabot alerts/security updates. Không merge khi CI đỏ.
3. **Phát hành có kiểm soát.** Cloudflare Pages phải tắt tự động deploy production; build production chỉ chạy khi `APPROVED_RELEASE_SHA` khớp SHA đã duyệt. Không đặt token Cloudflare trong repo.
4. **Domain và DNS.** Việc chuyển nameserver, bản ghi MX/SPF/DKIM/DMARC và CAA cần kiểm kê, đối chiếu và duyệt riêng trước khi trỏ lưu lượng. Giữ HTTPS và HSTS; kiểm tra chứng chỉ sau khi gắn domain.
5. **CSP là chính sách chặt.** Nếu sau này thêm style inline, script inline, analytics hoặc font bên ngoài, phải cập nhật CSP có chủ đích và chạy lại test; không thêm `unsafe-inline` để xử lý nhanh.
6. **Zalo.** Đã có liên kết trực tiếp `https://zalo.me/0354314095` trên website bên cạnh nút sao chép dự phòng. Đích trên desktop đã được chủ tài khoản xác nhận (*Owner confirmed*). Giữ số đọc được và thông báo kết quả cho screen reader. Khi có điều kiện thử nghiệm trên điện thoại thật có cài Zalo, chủ dự án kiểm nghiệm thêm thao tác mở app (*Pending manual test*).
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
