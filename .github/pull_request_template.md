## 1. Thay đổi

- **Mục tiêu:** <!-- Nêu tóm tắt mục tiêu của PR (sửa lỗi, cập nhật nội dung, cấu hình...) -->
- **Chi tiết thay đổi:**
  - <!-- Liệt kê các tệp và chức năng đã thay đổi -->

## 2. Bằng chứng kiểm tra

| Hạng mục | Kết quả / Bằng chứng | Ghi chú |
| --- | --- | --- |
| Commit SHA đã kiểm tra | <!-- Điền full SHA --> | Nhánh: <!-- Tên nhánh --> |
| Astro check (`npm run check`) | <!-- 0 errors --> | 17 tệp |
| Build tĩnh (`npm run build`) | <!-- Success --> | dist/ |
| Playwright E2E (`npm run test:e2e`) | <!-- Số lượng pass / skip / fail --> | 5 viewports (1440, 1024, 844, 800, 640/320px) |
| Kiểm tra Accessibility (axe-core) | <!-- 0 violations --> | WCAG 2.2 AA |
| Kiểm tra bảo mật (`npm audit`) | <!-- 0 vulnerabilities --> | npm lockfile |
| Header bảo mật & CSP | <!-- CSP, HSTS, nosniff, DENY --> | public/_headers |
| Trạng thái URL sản phẩm | <!-- Ganbarou: https://heyganba.site/ | Jiayou: Sắp ra mắt --> | Kiểm thử cả 2 trạng thái |

## 3. Quyết định đang chờ chủ dự án

1. **URL sản phẩm:** Ganbarou (`https://heyganba.site/`), Jiayou (*Coming soon*).
2. **Quy tắc bảo vệ nhánh `main`:** Cần bật trong Settings → Rulesets.
3. **Cloudflare Pages:** Cần thiết lập biến môi trường và cấp quyền.
4. **Domain & DNS:** Phê duyệt thời điểm chuyển đổi DNS cho `thadocorp.com`.

## 4. Phương án quay lui (Rollback)

- Nếu gặp sự cố trước khi merge: Đóng PR, giữ nguyên `main`.
- Nếu gặp sự cố trên preview: Revert commit trên nhánh preview.
- Nếu gặp sự cố trên production: Cloudflare Pages → Deployments → chọn bản production tốt gần nhất → **Rollback to this deployment**. Khôi phục bản ghi DNS cũ theo zone đã sao lưu.
