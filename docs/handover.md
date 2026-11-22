# Bàn giao THADO GROUP Corporate Website v1

**Ngày 22/11/2026.** Tài liệu này là điểm vào cho người nhận bàn giao: trạng thái commit, cách xem preview, vị trí cập nhật nội dung, bằng chứng kiểm tra, điều kiện còn chờ và cách quay lui.

## Trạng thái bàn giao

| Mục | Giá trị |
| --- | --- |
| Nhánh | `feat/corporate-website-v1` |
| Commit xuất phát | `3e110374c39dd00201194b7986d97fc9ed39679c` (`main`, chỉ có `README.md`) |
| Commit bàn giao | Xem `git log -1 --format=%H` sau khi commit; SHA cũng được ghi trong PR |
| Remote | `origin` = https://github.com/thach09/thadogroup_corpweb |
| Preview công khai | **Chưa có** — môi trường chưa đăng nhập Cloudflare Pages |
| Domain production | **Chưa gắn** — `thadocorp.com` là domain dự kiến |
| Trạng thái production | **Chưa triển khai**; không có DNS hoặc traffic nào bị thay đổi |

## Xem bản preview trên máy

```sh
npm ci
npm run check
npm run build
npm run preview
```

Mở địa chỉ Astro in ra (mặc định `http://localhost:4321/`). Bản này có `noindex`, `robots.txt` chặn crawler. Ảnh desktop/mobile đã chụp sẵn trong [`docs/qa/`](qa/) và được nhúng trong [báo cáo QA](qa.md).

Muốn xem với header như Cloudflare Pages, dùng Wrangler:

```sh
npx wrangler pages dev dist --ip 127.0.0.1 --port 8791
```

## Phạm vi đã bàn giao

- Landing page tiếng Việt `/` và tiếng Anh `/en/`, cùng dữ liệu có kiểu.
- Các khối Hero, Lĩnh vực, Giới thiệu, Sản phẩm THADO EDU, Footer/Liên hệ.
- Ganbarou và Jiayou có trạng thái “Sắp ra mắt” hoặc CTA HTTPS tùy cấu hình.
- Footer: Thach Do, `0354314095`, `tel:+84354314095`, Facebook, GitHub, Zalo dạng số và nút sao chép.
- Trang 404 theo nhận diện, menu mobile dùng bàn phím/Escape, bộ chuyển VI–EN.
- Animation vào một lần, reduced motion, nội dung hiển thị khi tắt JavaScript.
- `robots.txt`, sitemap, canonical, hreflang, noindex cho preview, build production có kiểm soát origin.
- `public/_headers` với CSP và các header phòng thủ.
- CI GitHub Actions, Dependabot, mẫu PR, tài liệu QA/bảo mật/phát hành.

## Vị trí cập nhật

| Nội dung | Tệp |
| --- | --- |
| Tiêu đề, mô tả, menu, toàn bộ bản dịch | `src/data/content.ts` |
| Tên sản phẩm, trạng thái, URL | `src/data/products.ts` + biến môi trường |
| Người sáng lập, điện thoại, Facebook, GitHub | `src/data/contact.ts` |
| Cấu trúc header, hero, sản phẩm, footer, 404 | `src/components/`, `src/pages/` |
| Màu, kiểu chữ, breakpoint, animation, focus | `src/styles/global.css` |
| Menu mobile, sao chép Zalo, IntersectionObserver | `public/site.js` |
| Header bảo mật | `public/_headers` |
| Domain, noindex, sitemap | `astro.config.mjs`, `src/pages/robots.txt.ts`, `src/pages/sitemap.xml.ts` |

### Cập nhật URL sản phẩm

Sao chép `.env.example` thành `.env.local` (không commit), điền URL HTTPS đã được chủ dự án xác nhận rồi build lại:

```ini
GANBAROU_URL=https://...
JIAYOU_URL=https://...
```

Để trống một biến thì sản phẩm tương ứng hiển thị “Sắp ra mắt” / “Coming soon”. Build sẽ dừng nếu URL không phải HTTPS hoặc chứa thông tin đăng nhập. Trên Cloudflare Pages, đặt cùng biến trong môi trường build. Hai ngôn ngữ dùng chung dữ liệu URL.

### Cập nhật Zalo

Hiện chưa gắn deep link. Chỉ thay hành vi trong `src/components/Footer.astro` và `public/site.js` sau khi xác minh đích mở đúng tài khoản trên thiết bị thật. Giữ số đọc được khi JavaScript tắt và giữ thông báo qua `role="status"`.

## Bằng chứng kiểm tra

- [QA chi tiết](qa.md): môi trường, 60 test Playwright, axe, Lighthouse, tương phản, ảnh.
- [Bảo mật](security.md): CSP, header, dependency, quyền CI, rủi ro còn lại.
- [Trạng thái milestone](status.md): M0–M3, backlog và phương án phát hành.
- [Phát hành, DNS, TLS, quay lui](release.md).

Tóm tắt lần chạy cuối: `npm run check` sạch; `npm run build` thành công; Playwright 47 pass, 13 skip có chủ đích, 0 fail; axe 0 vi phạm; `npm audit` 0 lỗ hổng; Lighthouse mobile production 100 Performance / 100 Accessibility / 100 Best Practices / 100 SEO.

## Điều kiện còn chờ trước production

1. Chủ dự án cung cấp hoặc xác nhận URL Ganbarou và Jiayou, hoặc chấp thuận phát hành thu gọn với trạng thái tĩnh.
2. Xác minh Zalo trên thiết bị thật (hoặc giữ nguyên nút sao chép).
3. Cấp quyền Cloudflare Pages và GitHub admin; tạo preview, bật bảo vệ `main`, kiểm tra Dependabot/secret scanning/push protection.
4. Duyệt M0/nội dung cuối và SHA phát hành; đặt `APPROVED_RELEASE_SHA` đúng SHA.
5. Kiểm kê DNS, bảo toàn email, kiểm tra TLS và duyệt thời điểm chuyển lưu lượng cho `thadocorp.com`.
6. Chạy lại QA trên đúng SHA phát hành, kiểm tra thiết bị thật và header trên host thật.
7. Review độc lập của Tester và Security trước khi công bố chính thức.

## Quay lui

Chưa có production nên không có traffic để khôi phục. Nếu đã triển khai: dùng Cloudflare Pages → Deployments → chọn bản production tốt gần nhất → **Rollback to this deployment**; nếu là lần đầu, gỡ custom domain và bản ghi web mới sau khi đối chiếu zone. Giữ nguyên bản ghi email. Quy trình chi tiết ở [release.md](release.md#khôi-phục).
