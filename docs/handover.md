# Bàn giao THADO GROUP Corporate Website v1

## Current handover ngày 23/11/2026

Main đã fetch tại `558dfe2d2259a5863d6e44b977251b62dd9c1ae3`. PR #7–#9 đã merge. Nhánh bàn giao là `fix/final-security-and-hosting-readiness`. SHA và kết quả remote CI sẽ gắn vào Draft PR. Chủ dự án giữ quyền duyệt release, staging, DNS và production.

Gmail và scroll motion đã được kiểm lại, npm ci/check/build thành công, Playwright 69 pass, 16 skip có chủ đích, 0 fail. Npm audit 0. Ganbarou build từ biến môi trường rõ ràng `https://heyganba.site/`, Jiayou để trống.

Ruleset Active và required check Build and browser tests đã được cấu hình, nguồn GitHub Actions app 15368. Các bảo vệ còn lại giữ nguyên. SSH khảo sát thành công ở chế độ read-only. Chuẩn bị Nginx/Compose static riêng để chủ server duyệt, chưa tạo staging, đổi mạng hoặc restart dịch vụ. Zalo điện thoại là Owner confirmed. Thu hồi token Forgejo cũ là OWNER TO VERIFY.

Xem [trạng thái](status.md), [QA](qa.md), [Security](security.md), [phương án self-host và staging](self-hosting.md), [phát hành](release.md).

## Historical handover ngày 22/11/2026

Các số liệu SHA, PR, quyền repo và thao tác copy Zalo dưới đây là lịch sử, xem Current handover để vận hành bản mới.

**Ngày 22/11/2026.** Tài liệu này là điểm vào cho người nhận bàn giao: trạng thái commit, cách xem preview, vị trí cập nhật nội dung, bằng chứng kiểm tra, điều kiện còn chờ và cách quay lui.

## Trạng thái bàn giao

| Mục | Giá trị |
| --- | --- |
| Nhánh hoàn thiện cuối | `fix/final-pre-release-stabilization` |
| Nhánh chính | `main` |
| Commit HEAD hiện tại trên `main` | `e8fc0b2636d43ddf1f7aa281c1b3e325e6d6d881` |
| Các PR đã merge vào `main` | [#1](https://github.com/thach09/thadogroup_corpweb/pull/1) (nền tảng v1), [#6](https://github.com/thach09/thadogroup_corpweb/pull/6) (hậu M0) |
| PR đã đóng (không merge) | [#5](https://github.com/thach09/thadogroup_corpweb/pull/5) (xung đột TS 7.x) |
| CI gần nhất trên `main` | Run [45038511590](https://github.com/thach09/thadogroup_corpweb/actions/runs/45038511590) — Success |
| Baseline lịch sử | `3e110374c39dd00201194b7986d97fc9ed39679c` (`main` ban đầu, chỉ có `README.md`) |
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

## Phạm vi đã hoàn thiện và bàn giao

- Landing page tiếng Việt `/` và tiếng Anh `/en/`, cùng dữ liệu có kiểu.
- Các khối Hero, Lĩnh vực, Giới thiệu, Sản phẩm THADO EDU, Footer/Liên hệ.
- **Ganbarou:** Đã có URL chính thức `https://heyganba.site/` (*Owner provided*); tự động render link native cùng tab khi có cấu hình, hoặc fallback "Sắp ra mắt" khi để trống.
- **Jiayou:** Trạng thái "Sắp ra mắt" / "Coming soon".
- **Footer:** Thach Do, `0354314095`, `tel:+84354314095`, Facebook, GitHub, liên kết native Zalo `https://zalo.me/0354314095` (*Owner confirmed* trên desktop) và nút sao chép dự phòng.
- **Trang 404** theo nhận diện, menu mobile dùng bàn phím/Escape, bộ chuyển VI–EN.
- **Metadata:** Đầy đủ Open Graph (`og:title`, `og:description`, `og:url`, `og:type`) và `twitter:card`.
- **Responsive:** Đã kiểm thử tự động trên cả 5 viewport (1440px, 1024px, 844px, 800px, 320px). Không tràn ngang ở 320 px.
- **Animation:** Vào một lần, reduced motion, nội dung hiển thị khi tắt JavaScript.
- `robots.txt`, sitemap, canonical, hreflang, noindex cho preview, build production có kiểm soát origin.
- `public/_headers` với CSP và các header phòng thủ.
- CI GitHub Actions, Dependabot (đã chặn xung đột TypeScript major), tài liệu QA/bảo mật/phát hành.

## Vị trí cập nhật

| Nội dung | Tệp |
| --- | --- |
| Tiêu đề, mô tả, menu, toàn bộ bản dịch | `src/data/content.ts` |
| Tên sản phẩm, trạng thái, URL | `src/data/products.ts` + biến môi trường |
| Người sáng lập, điện thoại, Facebook, GitHub, Zalo | `src/data/contact.ts` |
| Cấu trúc header, hero, sản phẩm, footer, 404 | `src/components/`, `src/pages/` |
| Màu, kiểu chữ, breakpoint, animation, focus | `src/styles/global.css` |
| Menu mobile, sao chép Zalo, IntersectionObserver | `public/site.js` |
| Header bảo mật | `public/_headers` |
| Domain, noindex, sitemap | `astro.config.mjs`, `src/pages/robots.txt.ts`, `src/pages/sitemap.xml.ts` |
| Quản lý cập nhật dependencies | `.github/dependabot.yml` |

### Cập nhật URL sản phẩm

Sao chép `.env.example` thành `.env.local` (không commit), điền URL HTTPS đã được chủ dự án xác nhận rồi build lại:

```ini
GANBAROU_URL=https://heyganba.site/
# JIAYOU_URL=https://...
```

Để trống một biến thì sản phẩm tương ứng hiển thị “Sắp ra mắt” / “Coming soon”. Build sẽ dừng nếu URL không phải HTTPS hoặc chứa thông tin đăng nhập. Trên Cloudflare Pages, đặt cùng biến trong môi trường build. Hai ngôn ngữ dùng chung dữ liệu URL.

### Cập nhật Zalo

Liên kết Zalo đã trỏ trực tiếp tới `https://zalo.me/0354314095` dạng thẻ `<a>` native với accessible name "Liên hệ qua Zalo" / "Contact via Zalo" và vùng bấm đạt tối thiểu 44 × 44 px. Nút sao chép bên cạnh dùng Clipboard API (fallback `execCommand`) thông báo qua `role="status"` và đổi màu phớt đỏ trong 2 giây để tạo visual feedback.

## Bằng chứng kiểm tra

- [QA chi tiết](qa.md): môi trường, 75 test Playwright (59 pass, 16 skip có chủ đích, 0 fail), axe 0 vi phạm trên 5 viewport, Lighthouse, tương phản, ảnh.
- [Bảo mật](security.md): CSP, header, dependency, quyền CI, rủi ro còn lại.
- [Trạng thái milestone](status.md): M0–M3, backlog và phương án phát hành.
- [Phát hành, DNS, TLS, quay lui](release.md).

Tóm tắt lần chạy cuối: `npm run check` sạch (0 errors); `npm run build` thành công; Playwright 59 pass, 16 skip có chủ đích, 0 fail; axe 0 vi phạm; `npm audit` 0 lỗ hổng; Lighthouse mobile production 100 Performance / 100 Accessibility / 100 Best Practices / 100 SEO.

## Điều kiện còn chờ trước production

1. Quyết định phát hành của chủ dự án: Phát hành Phương án A (Ganbarou mở link `https://heyganba.site/`, Jiayou "Sắp ra mắt") hay Phương án B (cả 2 "Sắp ra mắt").
2. Kiểm nghiệm việc mở ứng dụng Zalo trên điện thoại thật có cài app Zalo.
3. Cấp quyền Cloudflare Pages; bật quy tắc bảo vệ `main` và Dependabot alerts/security updates trên GitHub Settings.
4. Duyệt SHA phát hành; đặt `APPROVED_RELEASE_SHA` đúng SHA trên Cloudflare Pages.
5. Kiểm kê DNS, bảo toàn email, kiểm tra TLS và duyệt thời điểm chuyển lưu lượng cho `thadocorp.com`.
6. Chạy lại QA trên đúng SHA phát hành, kiểm tra thiết bị thật và header trên host thật.
7. Review độc lập của Tester và Security trước khi công bố chính thức.

## Quay lui

Chưa có production nên không có traffic để khôi phục. Nếu đã triển khai: dùng Cloudflare Pages → Deployments → chọn bản production tốt gần nhất → **Rollback to this deployment**; nếu là lần đầu, gỡ custom domain và bản ghi web mới sau khi đối chiếu zone. Giữ nguyên bản ghi email. Quy trình chi tiết ở [release.md](release.md#khôi-phục).
