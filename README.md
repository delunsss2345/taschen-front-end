# Bookstore E-commerce Frontend

## Mục tiêu
Dự án Next.js cho giao diện cửa hàng sách và khu vực admin/dashboard. Tài liệu này giúp bạn hiểu nhanh cấu trúc code, cách vào khu vực admin để làm UI, và cách viết API bằng Next.js (App Router).

## Chạy dự án
1. Cài dependencies:

```bash
npm install
```

2. Tạo file môi trường `.env.local` (nếu chưa có):

```bash
# API backend
BACKEND_API_URL=
NEXT_PUBLIC_BASE_API=

# NextAuth (Google)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
NEXTAUTH_DEBUG=
```

3. Chạy dev:

```bash
npm run dev
```

Mở `http://localhost:3000`.

## Cấu trúc thư mục nhanh
- `app/`: App Router của Next.js (route, layout, page, API).
- `app/(main)/`: nhóm route cho giao diện chính (user-facing).
- `app/dashboard/`: khu vực dashboard/admin (route mặc định là `/dashboard`).
- `app/api/`: route API theo App Router (`route.ts`).
- `layouts/`: layout và khối UI lớn (Admin, Auth, Default...).
- `components/`: UI components dùng chung và UI primitives.
- `features/`: module theo nghiệp vụ (UI + logic + state liên quan).
- `services/`: tầng gọi API hoặc integration bên ngoài (nếu có).
- `store/`: Redux store, slices, middleware.
- `validation/`: schema validation (Zod).
- `lib/`: helper cho API, response, utils.

## Admin/Dashboard: vào đâu để code UI
**Điểm vào chính**
- Route dashboard: `app/dashboard/page.tsx` → render `Dashboard` từ `layouts/AdminLayout`.
- Layout admin: `app/dashboard/layout.tsx`.
- Sidebar data: `layouts/data/sidebar-data.ts`.
- Component admin: `layouts/AdminLayout/`.

**Cách thêm 1 trang dashboard mới**
1. Tạo page mới, ví dụ: `app/dashboard/orders/page.tsx`.
2. Thêm link vào sidebar: sửa `layouts/data/sidebar-data.ts`, thêm item với `url: "/dashboard/orders"`.
3. Nếu cần component con, đặt vào `app/dashboard/_components/` hoặc `layouts/AdminLayout/`.

Lưu ý: các `url` trong sidebar hiện đang là `/`, `/tasks`, ... Nếu bạn muốn chúng nằm trong admin, hãy đổi thành `/dashboard/...`.

**Gợi ý cấu trúc component khi làm dashboard**
- Page chỉ nên compose layout + section chính (ít logic).
- Chia nhỏ theo feature: `app/dashboard/<feature>/_components/` cho widget cụ thể của trang đó.
- Component dùng lại (table, cards, filters, charts) đặt ở `components/` hoặc `layouts/AdminLayout/` nếu dùng riêng cho admin.
- Data/state: đặt trong `features/<feature>/` hoặc `store/` (nếu dùng Redux), không nhét hết vào page.

## Cách code API với Next.js (App Router)
Tất cả API nằm trong `app/api/**/route.ts`. Mỗi file export các hàm HTTP method (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).

**Validation**
- Dùng Zod schemas trong `validation/`.
- Ví dụ hiện có: `app/api/auth/login/route.ts` sử dụng `LoginSchema`.

**Response chuẩn**
- Dùng `ResponseApi` trong `lib/api/responseHandler.ts` để thống nhất format trả về.

**Gọi backend trong Next API**
- Dùng `api` từ `lib/api/fetchHandler.ts` (wrapper HTTP đã viết sẵn, base URL lấy từ `BACKEND_API_URL`).

**Gọi API của Next từ client**
- Dùng `axios` để gọi API nội bộ của Next (VD: gọi `/api/...` từ UI). Kiểu dữ liệu và response có thể tham khảo trong `types/` và `lib/api/responseHandler.ts`.

## Gợi ý nhanh để bắt đầu
- Xem `app/dashboard/page.tsx` và `layouts/AdminLayout/` để hiểu cấu trúc dashboard.
- Xem `app/api/books/route.ts` để hiểu cách làm API proxy.
- Xem `layouts/data/sidebar-data.ts` để update menu admin.
