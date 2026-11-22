# Trạng thái dự án THADO GROUP v1

**Cập nhật 22/11/2026.** Trạng thái tính đến nhánh `fix/final-pre-release-stabilization`, sau khi PR #1 (`cb95c5a`) và PR #6 (`e8fc0b2`) đã merge thành công vào `main`. HEAD của `main` hiện tại là `e8fc0b2636d43ddf1f7aa281c1b3e325e6d6d881`. PR #5 (Dependabot TypeScript 7.x) đã đóng, không merge.

## Tóm tắt

- **Mã nguồn và nhánh chính:** Cả PR #1 và PR #6 đã merge vào `main`. CI GitHub Actions run [45038511590](https://github.com/thach09/thadogroup_corpweb/actions/runs/45038511590) trên `main` đạt kết quả xanh tuyệt đối. Nhánh `fix/final-pre-release-stabilization` thực hiện đợt rà soát ổn định cuối cùng (Final Stabilization & Pre-release Verification).
- **Nội dung và liên kết:** Chủ dự án đã xác nhận tính chính xác của baseline M0, xác nhận đích Zalo trên desktop và cung cấp URL HTTPS chính thức cho Ganbarou (`https://heyganba.site/`). Jiayou tiếp tục duy trì trạng thái "Sắp ra mắt" / "Coming soon".
- **Kiểm thử tự động:** Toàn bộ 75 bài test Playwright trên 5 viewport (Desktop 1440px, Tablet 768px, Mobile 390px, Mobile 360px, Narrow 320px) đạt 59 pass, 16 skip có chủ đích, 0 fail; axe-core 0 vi phạm; `npm audit` 0 lỗ hổng.
- **Phát hành:** Chưa triển khai production và chưa gắn domain `thadocorp.com`. Đang chờ chủ dự án phê duyệt commit release, cấp quyền Cloudflare Pages và hoàn tất kế hoạch DNS/TLS.

## Mốc dự án

| Mốc | Trạng thái | Phụ trách | Bằng chứng |
| --- | --- | --- | --- |
| M0 · Chốt sitemap, wireframe, nội dung | Đã hoàn tất & Chủ dự án đã duyệt nội dung | PM, CEO Agent, Chủ dự án | [`docs/M0.md`](M0.md) |
| M1 · Dựng nền Astro, layout, màu, CI, preview noindex | Đã hoàn tất & Đã merge vào `main` | Senior Dev, DevOps | PR #1, `main` (`cb95c5a`) |
| M2 · Giao diện hai ngôn ngữ, sản phẩm, footer, animation | Đã hoàn tất & Đã merge vào `main` | Senior Dev | `src/`, `public/`, ảnh trong `docs/qa/` |
| M3 · Hậu kiểm Post-M0, Zalo link, Ganbarou URL, QA 320px | Đã hoàn tất cục bộ trên nhánh sửa lỗi | Senior Dev, Tester, Security | `tests/`, [`docs/qa.md`](qa.md), [`docs/security.md`](security.md) |
| M3 · Phát hành production, Cloudflare Pages, DNS/TLS | Chưa thực hiện; chờ phê duyệt | DevOps, Chủ dự án | [`docs/release.md`](release.md) |

## Bảng theo dõi tồn đọng và việc đang chờ

| Hạng mục | Phụ trách | Trạng thái thực tế | Đánh giá / Ảnh hưởng |
| --- | --- | --- | --- |
| **ISSUE-01: Liên kết Zalo** | Senior Dev, Tester | **Đã sửa:** Thẻ `<a>` native `https://zalo.me/0354314095`, accessible name VI/EN, touch target 44x44px, giữ nút copy fallback | Đích desktop *Owner confirmed*; mở app điện thoại thật *Pending* |
| **ISSUE-02: Dependabot TS 7.x** | Senior Dev, DevOps | **Đã sửa:** Bổ sung `ignore: typescript semver-major` trong `.github/dependabot.yml` | Ngăn xung đột peer dependency với `@astrojs/check`; giữ TS 5.9.3 ổn định |
| **ISSUE-03: Đồng bộ tài liệu** | PM, CEO Agent | **Đã sửa:** Cập nhật toàn bộ tài liệu phản ánh PR #1 đã merge `main`, URL Ganbarou và Zalo | Phân định rõ Historical Baseline, Current Status và Pending Decisions |
| **ISSUE-04: Chuẩn hóa QA & 320px** | Tester Agent | **Đã sửa:** Bổ sung test viewport 320px (`chromium-narrow`), chuẩn hóa nhãn kết quả | Không phóng đại; phân biệt rõ *Verified*, *Owner confirmed*, *Locally tested*, *Pending* |
| **ISSUE-05: Bảo mật repo & CI** | Security Agent | **Đã rà soát:** CI pin SHA, permissions `contents: read`; đề xuất ruleset cho `main` | Cần chủ dự án bật branch protection trên GitHub Settings |
| **ISSUE-06: Cloudflare release safety** | DevOps Agent | **Đã rà soát:** Guard `APPROVED_RELEASE_SHA` và `SITE_URL` chặn vô tình deploy production | Chưa đăng nhập Cloudflare; chưa gắn domain `thadocorp.com` |
| **ISSUE-07: URL sản phẩm** | PM, Chủ dự án | **Ganbarou:** Đã có URL `https://heyganba.site/` (*Owner provided*).<br>**Jiayou:** Tiếp tục giữ "Sắp ra mắt" (*Coming soon*) | Đã kiểm thử tự động cả 2 trạng thái thành công |
| **Cải tiến P2: OpenGraph & Copy UX** | Senior Dev | **Đã bổ sung:** Thẻ `og:title`, `og:description`, `og:url`, `og:type`, `twitter:card`; hiệu ứng nút copy đổi màu 2s | Nâng cao trải nghiệm chia sẻ mạng xã hội và phản hồi thao tác |

## Phương án phát hành đề xuất

1. **Phương án A (Khuyến nghị): Phát hành với Ganbarou có link, Jiayou "Sắp ra mắt"**  
   Triển khai với biến `GANBAROU_URL=https://heyganba.site/`, Jiayou hiển thị "Sắp ra mắt". Khách có thể click ngay vào Ganbarou để trải nghiệm học tiếng Nhật, trong khi Jiayou giữ đúng tiến độ thực tế.
2. **Phương án B: Phát hành thu gọn (Cả hai sản phẩm "Sắp ra mắt")**  
   Nếu chủ dự án muốn đồng bộ công bố hai sản phẩm cùng lúc, có thể để trống biến `GANBAROU_URL`.
3. **Hoãn phát hành:**  
   Giữ bản preview để nghiệm thu tiếp, chưa trỏ DNS `thadocorp.com`.

## Vai trò và mức độ độc lập

Toàn bộ các bước trên được thực hiện tuần tự bởi một Agent kỹ thuật điều phối (Technical Lead / Multi-role Coordinator). Chưa có reviewer hoặc chuyên viên kiểm thử độc lập bên ngoài. Trước khi chính thức bấm nút chuyển domain production, khuyến nghị chủ dự án hoặc một tester độc lập kiểm tra thực tế một lượt trên thiết bị di động thật.
