# Trạng thái dự án THADO GROUP v1

**Cập nhật 22/11/2026.** Trạng thái tính đến cây làm việc trên nhánh `feat/corporate-website-v1`, trước khi phát hành. Commit mã nguồn và QA là `5cb592895fcc256963b2dfa30fd531256612dba9`; commit tài liệu sau đó chỉ cập nhật báo cáo. Trạng thái push/PR được ghi trong [`docs/handover.md`](handover.md).

## Tóm tắt

Website landing page song ngữ đã hoàn thiện ở mức sẵn sàng cho preview: Astro static, TypeScript, hai ngôn ngữ, footer, 404, animation nhẹ, test tự động và tài liệu vận hành. Chưa triển khai production và chưa gắn domain.

Phát hành production đang chờ các quyết định của chủ dự án: URL Ganbarou/Jiayou, xác minh Zalo, quyền Cloudflare Pages/GitHub admin, duyệt nội dung M0 và SHA phát hành, cùng kế hoạch DNS/TLS.

## Mốc

| Mốc | Trạng thái | Phụ trách | Bằng chứng |
| --- | --- | --- | --- |
| M0 · Chốt sitemap, wireframe, nội dung | Hoàn tất bản trình; chủ dự án chưa ghi nhận duyệt nội dung cuối | PM, CEO Agent | [`docs/M0.md`](M0.md) |
| M1 · Dựng nền Astro, layout, màu, CI, preview noindex | Hoàn tất cục bộ | Senior Dev, DevOps | `package.json`, `astro.config.mjs`, `.github/workflows/ci.yml`, `docs/release.md` |
| M2 · Giao diện hai ngôn ngữ, sản phẩm, footer, animation | Hoàn tất cục bộ | Senior Dev | `src/`, `public/`, ảnh trong `docs/qa/` |
| M3 · QA, axe, Lighthouse, header, bảo mật | Hoàn tất phần cục bộ; CI xanh trên draft PR; review độc lập và host thật còn chờ | Tester, Security | [`docs/qa.md`](qa.md), [`docs/security.md`](security.md), [PR #1](https://github.com/thach09/thadogroup_corpweb/pull/1) |
| M3 · Phát hành production, DNS, TLS | Chưa thực hiện | DevOps, chủ dự án | [`docs/release.md`](release.md) |

## Backlog và việc đang chờ

| Việc | Phụ trách | Trạng thái hiện tại | Ảnh hưởng |
| --- | --- | --- | --- |
| URL HTTPS Ganbarou | Chủ dự án cung cấp; PM theo dõi | Thiếu; hiển thị “Sắp ra mắt” | CTA chưa mở được website sản phẩm |
| URL HTTPS Jiayou | Chủ dự án cung cấp; PM theo dõi | Thiếu; hiển thị “Sắp ra mắt” | CTA chưa mở được website sản phẩm |
| Xác minh deep link Zalo trên thiết bị thật | Chủ dự án hoặc Tester có thiết bị | Chưa xác minh; giữ số và nút sao chép | Chưa dùng liên kết mở Zalo |
| Quyền Cloudflare Pages | DevOps, quản trị viên | Chưa đăng nhập; chưa có preview URL công khai | Chưa có link preview trên hạ tầng thật |
| Quyền GitHub admin, branch protection, Dependabot alerts, push protection | DevOps, quản trị viên | API bảo vệ nhánh trả 401; chưa xác nhận | Chưa chứng minh được kiểm soát merge và secret scanning |
| Duyệt M0 và nội dung cuối | Chủ dự án | Bản trình đã có, chưa có biên bản duyệt | Chưa chốt nội dung phát hành |
| Duyệt SHA và thời điểm phát hành | Chủ dự án, CEO Agent | Chưa có SHA được duyệt | Cloudflare production build sẽ từ chối nếu thiếu `APPROVED_RELEASE_SHA` |
| DNS, TLS, email cho `thadocorp.com` | Chủ dự án, DevOps | Chưa kiểm kê zone thực tế | Chưa thể chuyển lưu lượng |
| Chuyển sang `thadogroup.com` | Chủ dự án | Kế hoạch sau, chưa duyệt | Cần redirect 301 và cập nhật canonical/hreflang/sitemap |
| Thử trên điện thoại thật | Tester | Chưa thực hiện | Bằng chứng mobile mới ở mức mô phỏng |
| Review độc lập Tester/Security | Tester, Security | Chưa có; cùng agent tự kiểm tra | Cần review trước khi phát hành chính thức |

## Phương án phát hành

1. **Phát hành đầy đủ:** chủ dự án cung cấp và xác nhận hai URL HTTPS, xác minh Zalo, cấp quyền Cloudflare/GitHub, duyệt M0 và SHA. QA chạy lại trên SHA đó, sau đó bật domain.
2. **Phát hành thu gọn:** giữ cả hai sản phẩm ở trạng thái “Sắp ra mắt”, không có CTA ngoài. Phương án này vẫn đúng phạm vi v1 nhưng cần chủ dự án chấp thuận rõ ràng.
3. **Hoãn:** giữ bản preview để duyệt tiếp, không trỏ domain.

Đề xuất của agent: hoàn tất preview và bàn giao; chưa phát hành production cho đến khi có quyết định về hai URL sản phẩm và quyền triển khai. Không có lỗi kỹ thuật chặn preview.

## Vai trò và mức độ độc lập

Môi trường hiện tại chỉ có một agent. Các vai trò được thực hiện tuần tự: PM soạn M0/backlog, Senior Dev triển khai, Tester chạy Playwright/axe/Lighthouse, Security rà mã và header, DevOps viết quy trình CI/Pages/DNS. Không có Tester hoặc Security độc lập. Trước phát hành chính thức, cần một lượt review độc lập trên đúng SHA và kiểm tra trên thiết bị thật.
