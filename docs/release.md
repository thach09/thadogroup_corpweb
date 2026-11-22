# Phát hành THADO GROUP

## Trạng thái repo

Ngày 22/11/2026, PR triển khai ban đầu #1 (`feat/corporate-website-v1`) và PR #6 (`fix/post-m0-audit-and-validation`) đã được merge thành công vào `main` tại SHA `e8fc0b2636d43ddf1f7aa281c1b3e325e6d6d881`. Nhánh `fix/final-pre-release-stabilization` thực hiện đợt rà soát ổn định cuối cùng trước khi bàn giao cho chủ dự án nghiệm thu.

**Kiểm tra ngày 22/11/2026:** build preview và production đều đạt; Playwright 75 test (59 pass, 16 skip có chủ đích, 0 fail), axe 0 vi phạm trên 5 viewport (kể cả 320 px), Lighthouse mobile production 100/100/100/100, header đúng trên Wrangler Pages cục bộ. Môi trường này chưa đăng nhập Cloudflare (`wrangler whoami` báo chưa xác thực), nên **chưa có preview URL công khai và chưa triển khai production**. Thiết lập bảo vệ `main` và Dependabot alerts vẫn đang tắt; cần chủ dự án quyết định trong GitHub Settings. Xem [QA](qa.md) và [bảo mật](security.md).

Đề xuất quy tắc bảo vệ `main` (Settings → Rules → Rulesets):
- Bắt buộc kiểm tra trạng thái **Build and browser tests** thành công trước khi merge.
- Yêu cầu Pull Request trước khi nhập vào `main`.
- Chặn force push (`Block force pushes`) và cấm xóa nhánh `main` (`Block deletions`).
- Với repo một người quản trị, không bắt buộc số lượng approval cứng để chủ repo vẫn có thể merge PR sau khi CI xanh.

## Cấu hình biến môi trường sản phẩm

Khi phát hành production, cấu hình biến trong Cloudflare Pages:
```ini
NODE_VERSION=24.21.0
SKIP_DEPENDENCY_INSTALL=1
SITE_ENV=production
SITE_URL=https://thadocorp.com
APPROVED_RELEASE_SHA=<SHA đầy đủ được duyệt>
GANBAROU_URL=https://heyganba.site/
# JIAYOU_URL=<để trống nếu chưa có>
```

1. Trong Workers & Pages, tạo dự án Pages kết nối Git và cấp GitHub App quyền trên riêng repo này. Chọn production branch `main`, root là thư mục gốc, output là `dist`. Đặt `NODE_VERSION=24.21.0` cho cả hai môi trường. Đặt `SKIP_DEPENDENCY_INSTALL=1` để lệnh build bên dưới tự cài từ lockfile.
2. Ngay trong màn hình thiết lập ban đầu, dùng lệnh build dưới đây. Cloudflare cung cấp `CF_PAGES_BRANCH` và `CF_PAGES_COMMIT_SHA`. Chừa trống `APPROVED_RELEASE_SHA` tới khi chủ dự án duyệt SHA cụ thể. Kiểm tra biến Production và Preview riêng. Bước này bảo vệ cả lần build đầu tiên do Git integration khởi tạo.

```sh
if [ "$CF_PAGES_BRANCH" = "main" ] && { [ -z "$APPROVED_RELEASE_SHA" ] || [ "$CF_PAGES_COMMIT_SHA" != "$APPROVED_RELEASE_SHA" ]; }; then echo "Production requires the approved commit SHA" >&2; exit 1; fi
npm ci && npm run build
```

3. Trong Settings → Builds & deployments, tắt **Enable automatic production branch deployments**. Bật preview cho nhánh triển khai được chọn. Với Preview, để `SITE_ENV` trống. Nếu có nội dung duyệt riêng, bật **Enable access policy** cho preview. Dùng URL hash do Pages trả về trong PR. Kiểm tra `noindex` trong HTML và header Pages trên URL đó. [Cấu hình nhánh](https://developers.cloudflare.com/pages/configuration/branch-build-controls/) · [Quyền truy cập preview](https://developers.cloudflare.com/pages/configuration/preview-deployments/)
4. Sau phê duyệt M3, bảo đảm SHA trên `main` chính là SHA đã kiểm tra. Đặt riêng cho Production `APPROVED_RELEASE_SHA=<SHA đầy đủ>`, `SITE_ENV=production` và `SITE_URL=https://thadocorp.com`. Chạy lại build Production của đúng SHA. Đối chiếu SHA trong deployment detail trước khi trỏ domain. Nếu dùng cách merge tạo SHA mới, chạy lại QA và ghi phê duyệt cho SHA mới đó trước khi build.

## DNS và TLS

Chủ dự án xác nhận quyền sở hữu `thadocorp.com` và thời điểm chuyển lưu lượng. Ghi lại nhà đăng ký, DNS host, nameserver và trạng thái DNSSEC. Xuất zone cũ sang nơi lưu nội bộ. Đối chiếu trước và sau bằng bảng sau cho từng bản ghi, kể cả bản ghi ở subdomain. Đối với email, kiểm đủ MX, SPF, DKIM, DMARC, bản ghi xác minh và các hostname mà MX trỏ đến.

| Tên | Loại | Giá trị cũ / mới | TTL cũ / mới | Proxy | Kết quả đối chiếu |
| --- | --- | --- | --- | --- | --- |
| Điền từ zone thực tế | | | | | |

Với apex dùng Cloudflare Pages, zone phải dùng nameserver Cloudflare cùng tài khoản với Pages. Nếu cần đổi nameserver, duyệt riêng kế hoạch và xử lý DS/DNSSEC cùng registrar để tránh lỗi phân giải. Chuyển DNS authority trong khi vẫn giữ đích web cũ nếu có. Kiểm tra DNS và email sau đổi authority rồi mới đổi đích web. Liên kết apex qua Pages → Custom domains, kiểm tra bản ghi CAA và chứng chỉ. Xác nhận trạng thái Active và kiểm tra HTTPS từ bên ngoài trước khi thông báo công bố. [Hướng dẫn custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)

## Nghiệm thu sau deploy

- Ghi deployment ID, URL, SHA, thời điểm, người duyệt và giá trị bản ghi web trước khi thay đổi.
- Dùng `curl -sSI https://thadocorp.com/`, kiểm tra thêm `/en/`, một asset cùng origin và một đường dẫn chưa tồn tại. Đối chiếu CSP, chống nhúng, nosniff, HSTS, Referrer-Policy, Permissions-Policy với `public/_headers`. Kiểm tra HTTP chuyển sang HTTPS, chứng chỉ khớp domain và trang chưa tồn tại trả 404. Thực hiện tương tự trên URL preview khi có. [Cloudflare Pages headers](https://developers.cloudflare.com/pages/configuration/headers/)
- Mở cả hai ngôn ngữ, menu bằng bàn phím và điện thoại thật, CTA, liên kết liên hệ và hành vi sao chép Zalo. Xác nhận `robots.txt`, sitemap, canonical, hreflang dùng domain đã duyệt. Đối chiếu trạng thái index của trang chủ production và preview. Ghi kết quả, thiết bị và lỗi quan sát vào PR.
- Đối chiếu từng URL thật của Ganbarou và Jiayou. Khi còn thiếu, ghi đúng sản phẩm và quyết định của chủ dự án về dời lịch hoặc công bố với trạng thái tĩnh.

## Khôi phục

Nếu có bản production tốt trước đó, vào Deployments → chọn bản production thành công đã ghi lại → **Rollback to this deployment**. Đối chiếu SHA, thử lại trang, hai ngôn ngữ, liên kết, DNS và TLS. Giữ tự động triển khai production tắt trong lúc xử lý. [Rollback trên Pages](https://developers.cloudflare.com/pages/configuration/rollbacks/)

Nếu đây là lần phát hành đầu tiên, khôi phục đích web cũ theo bảng DNS. Nếu trước đây chưa có website, gỡ liên kết custom domain khỏi Pages và chỉ xóa bản ghi web vừa tạo sau khi đối chiếu zone. Khi cần thu hồi cả địa chỉ công khai `pages.dev`, áp dụng Cloudflare Access cho hostname gốc hoặc chặn hostname đó ở Cloudflare rồi xác nhận từ một phiên ngoài tài khoản. Giữ nguyên DNS email; kiểm tra lại từ resolver độc lập sau TTL và ghi kết quả.

Khi chủ dự án duyệt chuyển sang `thadogroup.com`, xác minh quyền sở hữu và TLS, rồi cập nhật site origin, canonical, hreflang, robots và sitemap. Thiết lập 301 từ domain cũ sang domain mới, giữ path và query. Kiểm tra riêng `/`, `/en/` và các URL cũ trước khi kết thúc chuyển đổi.
