# Kế Hoạch Refactor `admin/dashboard`

## Mục tiêu

Tài liệu này tổng hợp lại toàn bộ phần phân tích và kế hoạch refactor cho khu vực `admin/dashboard`, theo hướng:

- Chia nhỏ tối đa.
- An toàn, dễ review, dễ rollback.
- Ưu tiên refactor nền móng trước, thay đổi logic sau.
- Giảm lặp giữa `admin/dashboard` và các role khác nhưng không gộp vội khi contract hoặc hành vi chưa ổn định.

## Giả định

- Repo hiện chưa có test runner đủ mạnh ngoài `eslint` và smoke test thủ công.
- Các màn hình `import-requests`, `returns`, `return-to-warehouse` và phần lớn flow `warehouse` chưa có API contract đủ rõ.
- Không bắt buộc mọi feature đều phải có Zustand store nếu state chỉ là local UI state.

---

## 1. Tổng quan vấn đề kiến trúc

- `app/admin/dashboard` hiện có 77 file `ts`/`tsx`.
- Có 29 file import service trực tiếp từ UI.
- Chỉ có 1 khu vực đang đi gần đúng theo pattern feature + query là `formats`, nhưng vẫn còn trộn query với store mirror.
- Tầng `services` chưa thuần API contract.
  - Ví dụ `services/book.service.ts` không chỉ gọi API sách mà còn gọi thêm category/supplier để enrich dữ liệu cho UI.
- Nhiều service đang nuốt lỗi rồi trả fallback như `[]`, `null`, `false`.
  - Điều này làm mất error state thật và cản trở migration sang TanStack Query.
- Nhiều component lớn đang trộn quá nhiều trách nhiệm:
  - UI
  - fetch/mutate
  - mapping DTO
  - modal/form state
- Boundary giữa feature chưa rõ.
  - Ví dụ `purchase-order` import `PromotionTabs` từ feature `promotions`.
- Dashboard shell đang lặp khá mạnh giữa `admin`, `seller`, `warehouse`.
- `features/format` là một pattern gần đúng nhưng chưa đủ chuẩn:
  - naming chưa thống nhất
  - selector đang ở dạng số ít
  - store đang mirror dữ liệu query thay vì chỉ giữ UI state

### Các điểm minh họa đáng chú ý

- `services/book.service.ts`
  - vừa fetch dữ liệu sách
  - vừa enrich category/supplier cho UI
- `services/order.service.ts`
  - catch lỗi rồi trả fallback
- `services/user.service.ts`
  - định nghĩa type ngay trong service
- `services/purchase-order.service.ts`
  - type request đặt trong service
- `app/admin/dashboard/purchase-order/_components/PurchaseOrdersTable.tsx`
  - trộn query, mutate, modal state, mapping
- `app/admin/dashboard/books/_components/AddBookModal.tsx`
  - gọi service trực tiếp, upload ảnh, build payload ngay trong component
- `app/admin/dashboard/books/_components/EditBookModal.tsx`
  - load nhiều nguồn dữ liệu, mapping detail/variant, cập nhật ngay trong modal
- `app/admin/dashboard/promotions/_components/AdminPromotionsPage.tsx`
  - fetch, map DTO, filter, count, mutate action trong cùng một file
- `app/admin/dashboard/customers/_components/CustomersPage.tsx`
  - đang map từ `users` sang `customers` với metric placeholder

---

## 2. Phân tích các điểm lặp code

| Khu vực | Đang lặp gì | Lặp ở đâu | Tác hại hiện tại | Ưu tiên |
|---|---|---|---|---|
| Dashboard shell | Layout, header, sidebar renderer | `admin`, `seller`, `warehouse` | Sửa layout hoặc hành vi menu phải sửa 3 nơi | Cao |
| Page orchestration | Fetch, loading, filter, search, callback wiring | `accounts`, `categories`, `suppliers`, `books`, `orders`, `promotions`, `batch`, `import`, `purchase-order` | Mỗi màn hình tự quản lifecycle khác nhau, khó chuẩn hóa | Cao |
| CRUD modal | Form state, submit, reset, toast, loading | `AccountHeader`, `AccountTable`, `CategoryHeader`, `CategoryTable`, `SupplierHeader`, `SupplierTable`, `FormatHeader`, `FormatTable`, `AddBookModal`, `EditBookModal`, `CreatePromotionModal`, `CreatePurchaseOrderModal`, `AddBatchDialog` | Validation và error handling lệch nhau, khó tái sử dụng | Cao |
| Tabs và status filter | Tab strip, count, status mapping | `orders`, `promotions`, `purchase-order` | Import chéo feature, naming status dễ lệch | Trung bình - Cao |
| Table/detail dialog | `selectedItem`, modal open state, status badge, detail rendering | `orders`, `promotions`, `import`, `import-requests`, `returns`, `return-to-warehouse` | UI drift, khó share an toàn | Trung bình |
| Type và view-model | DTO, UI model, form model, row model | `books`, `promotions`, `customers`, `accounts`, `import-requests`, `returns` | Contract không rõ, mapping rải rác, request/response không tách | Nghiêm trọng |
| Option loading | Query category/supplier/format/books/variants dùng lặp lại | `books`, `batch`, `purchase-order` | Cùng một dữ liệu gọi nhiều nơi, không tận dụng cache | Cao |
| Role copy | Cùng chức năng nhưng copy theo role | `books`, `categories`, `orders`, `promotions`, `import-requests`, `returns`, `purchase-order` | Dễ diverge logic, rất khó review khi thay đổi | Nghiêm trọng |
| Formatting helpers | `formatCurrency`, `formatDate`, status badge map | Nhiều bảng khác nhau | Cùng status có thể hiển thị khác nhau | Trung bình |
| Exact duplicate nhỏ | Header/component wrapper giống nhau | `ReturnsHeader`, `ImportRequestsHeader`, route wrapper `purchase-order/page.tsx` | Không nghiêm trọng ngay nhưng tạo nhiễu | Thấp - Trung bình |

### Nhóm lặp đáng lưu ý nhất

- `books`
  - lặp cả UI, option loading, form model, direct service call
- `purchase-order`
  - lặp state, tabs, action, import flow, modal handling
- `promotions`
  - lặp status flow, tab count, detail modal, action wiring
- `dashboard shell`
  - là nhóm tách shared sớm được nhưng phải giữ data config riêng theo role

---

## 3. Đánh giá mức độ nghiêm trọng

### Nghiêm trọng

- `purchase-order`
- `books`
- type/view-model đang để lẫn trong UI và service
- role-copy giữa `admin` và role khác nhưng một bên live API, một bên mock/static

### Cao

- `orders`
- `promotions`
- `accounts`
- `suppliers`
- `categories`
- page orchestration bị lặp
- option-loading bị lặp
- cross-feature import

### Trung bình

- `formats` đang dùng query nửa vời
- `customers` đang map từ `users` với dữ liệu placeholder
- helper `formatCurrency`, `formatDate`, status badge map bị lặp
- duplicate component nhỏ

### Thấp

- route wrapper mỏng
- `overview`
- `coming-soon`
- page chỉ render một component con

---

## 4. Đề xuất cấu trúc thư mục mục tiêu

Nguyên tắc:

- `services/` là thư mục dùng chung, nằm ngoài feature.
- `types/` là thư mục dùng chung, nằm ngoài feature.
- `hooks`, `selectors`, `store` nằm trong từng feature.
- Mỗi feature map theo chức năng, không map theo role.
- Role-specific UI chỉ là adapter/presentation layer, không phải nơi chứa domain logic chính.

### Cấu trúc đề xuất

```txt
app/
  admin/dashboard/<route>/page.tsx
  seller/dashboard/<route>/page.tsx
  warehouse/dashboard/<route>/page.tsx

features/
  dashboard-shell/
    ui/
      RoleDashboardLayout.tsx
      RoleSidebar.tsx
    lib/
      sidebar-config.ts

  account-management/
    hooks/
    selectors/
    store/
    lib/
      mappers.ts
      query-keys.ts
    ui/
      admin/

  customer-management/
    hooks/
    selectors/
    store/
    lib/
      mappers.ts
      query-keys.ts
    ui/
      admin/

  category-management/
    hooks/
    selectors/
    store/
    lib/
    ui/
      admin/
      seller/
      shared/

  format-management/
    hooks/
    selectors/
    store/
    lib/
    ui/
      admin/

  supplier-management/
    hooks/
    selectors/
    store/
    lib/
    ui/
      admin/

  book-management/
    hooks/
    selectors/
    store/
    lib/
      mappers.ts
      query-keys.ts
      view-models.ts
    ui/
      admin/
      seller/
      shared/

  order-management/
    hooks/
    selectors/
    store/
    lib/
    ui/
      admin/
      seller/
      shared/

  promotion-management/
    hooks/
    selectors/
    store/
    lib/
      mappers.ts
    ui/
      admin/
      seller/
      shared/

  purchase-order-management/
    hooks/
    selectors/
    store/
    lib/
    ui/
      admin/
      warehouse/
      shared/

  batch-management/
    hooks/
    selectors/
    store/
    lib/
    ui/
      admin/

  import-receipt-management/
    hooks/
    selectors/
    store/
    lib/
    ui/
      admin/
      warehouse/
      shared/

  import-request-management/
    hooks/
    selectors/
    store/
    lib/
    ui/
      admin/
      seller/
      warehouse/
      shared/

  return-management/
    hooks/
    selectors/
    store/
    lib/
    ui/
      admin/
      seller/
      shared/

  warehouse-return-management/
    hooks/
    selectors/
    store/
    lib/
    ui/
      admin/
      seller/
      warehouse/
      shared/

services/
  *.service.ts

types/
  request/
    user.request.ts
    order.request.ts
    promotion.request.ts
    supplier.request.ts
    category.request.ts
    format.request.ts
    purchase-order.request.ts
    batch.request.ts
    import-stock.request.ts
    book-variant.request.ts
    book.request.ts
  response/
    user.response.ts
    order.response.ts
    promotion.response.ts
    supplier.response.ts
    category.response.ts
    format.response.ts
    purchase-order.response.ts
    batch.response.ts
    import-stock.response.ts
    book-variant.response.ts
    book.response.ts
```

### Ghi chú

- `page.tsx` chỉ nên là route adapter mỏng.
- Shared UI nên tách dần, ưu tiên component thuần presentational.
- Không mirror query data vào Zustand nếu state đó chỉ dùng để render server state.

---

## 5. Danh sách khu vực cần chuyển sang `useQuery` / `useMutation`

### Nên dùng `useQuery`

- Danh sách `accounts`
- Danh sách `customers`
- Danh sách `categories`
- Danh sách `formats`
- Danh sách `suppliers`
- Danh sách `books` có phân trang và tìm kiếm
- Danh sách `orders`
- `order detail`
- Danh sách `promotions`
- `promotion detail`
- Danh sách `purchase-orders`
- `purchase-order detail`
- Danh sách `batches`
- Danh sách `import-receipts`
- `books by supplier`
- `book variants by book`
- `book form options`
- `purchase-order form options`

### Nên dùng `useMutation`

- `create/update/delete category`
- `create/update/delete format`
- `create/update supplier`
- `create/update account`
- `create/update/delete book`
- `update order status`
- `create/approve/reject/pause/resume promotion`
- `create/approve/reject/cancel/pay purchase-order`
- `create import-stock from purchase-order`
- `receive import-stock`
- `create batch`

### Nên giữ là util/service thuần

- `uploadService.uploadImage`
- `services/helpers/response.ts`
- `utils/http.ts`
- formatter thuần như `formatCurrency`, `formatDate`
- mapper thuần không side effect

### Nên tạo custom hooks để tái sử dụng

- `useBookFormOptions`
- `useBookManagementFilters`
- `usePromotionFilters`
- `useOrderFilters`
- `useAccountFilters`
- `useSupplierFilters`
- `usePurchaseOrderFormData`
- `usePurchaseOrderStatusActions`
- `useImportReceiptActions`

### Chưa nên query hóa ngay

- `import-requests`
- `returns`
- `return-to-warehouse`
- `warehouse purchase-order`
- `warehouse import`

Lý do:

- Chưa thấy API/service contract đủ rõ.
- Một số flow đang mock/static.
- Nếu query hóa ngay sẽ tạo shared abstraction sai, khó rollback.

---

## 6. Chiến lược tách types `request` / `response`

### Các type đang để sai chỗ

Hiện đang nằm trong `services` nhưng nên đưa ra `types/request` hoặc `types/response`:

- `User`
- `Address`
- `UserRole`
- `CreateUserRequest`
- `UpdateUserRequest`
- `Order`
- `OrderDetail`
- `OrderStatus`
- `Promotion`
- `PromotionStatus`
- `CreatePromotionData`
- `CreateSupplierRequest`
- `UpdateSupplierRequest`
- `CreateCategoryRequest`
- `UpdateCategoryRequest`
- `CreateFormatRequest`
- `UpdateFormatRequest`
- `CreatePurchaseOrderRequest`
- `Batch`
- `CreateBatchRequest`
- `ImportStock`
- `ImportStockItem`
- `BatchResult`
- `ReceiveImportStockResponse`
- `BookVariant`

### Các type đang bị lặp

- `Book`
- `Promotion`
- `Customer`
- `Account`
- `ImportRequest`
- `ReturnRequest`
- `BooksTableRow`
- `OrderItem`
- `FormData`

### Các type nên gom lại

#### `types/response`

- `user`
- `order`
- `promotion`
- `supplier`
- `category`
- `format`
- `purchase-order`
- `batch`
- `import-stock`
- `book-variant`
- `book`

#### `types/request`

- `user`
- `order-status`
- `promotion`
- `supplier`
- `category`
- `format`
- `purchase-order`
- `batch`
- `import-stock`
- `book-variant`
- `book`

### Các type phụ thuộc UI quá nhiều

Không nên đặt vào `types/request` hoặc `types/response`:

- `BookCreateModel`
- `BookEditModel`
- `BooksTableRow`
- `Account`
- `Customer`
- `PromotionTableRow`
- `OrderTabCounts`
- `BatchFormData`

Nên đặt tại:

- `features/<feature>/lib/view-models.ts`
- hoặc `features/<feature>/lib/models.ts`

### Vấn đề wrapper response

Các wrapper đang chưa thống nhất giữa:

- `base.response.ts`
- `category.response.ts`
- `supplier.response.ts`
- `purchase-order.response.ts`

Đề xuất:

- `response/<entity>.response.ts` chỉ chứa payload DTO.
- Envelope chung nên tách riêng và dùng lại thống nhất.

---

## 7. Phân tích lặp giữa `admin/dashboard` và role khác

### Thực sự là cùng chức năng

- `books`
- `categories`
- `orders`
- `promotions`
- `import-requests`
- `purchase-orders`
- dashboard shell

Đây là các feature nên map theo chức năng, không map theo role.

### Chỉ giống giao diện nhưng logic khác

- `books`
- `orders`
- `promotions`
- `purchase-orders`

Lý do:

- `admin` đang dùng live API ở nhiều chỗ.
- `seller` và `warehouse` còn dùng mock/static ở nhiều màn hình.

### Nên shared component sớm

- dashboard layout shell
- sidebar renderer
- `MultiSelectCombobox`
- `ImportRequestsHeader`
- `ReturnsHeader`
- tab strip dùng config
- empty state
- loading state
- format helpers

### Nên shared feature logic sau khi an toàn

- `categories` trước
- `books` sau đó
- `orders/promotions` chỉ shared filter/status config khi seller bỏ mock
- `import-requests` chỉ shared khi contract API rõ

### Chưa nên gộp ngay

- `returns`
- `return-to-warehouse`
- `warehouse purchase-order`
- `warehouse import`
- `customers` metrics

Lý do:

- contract dữ liệu chưa rõ
- dữ liệu đang mock hoặc giả lập
- nếu gộp sớm sẽ dễ sai logic hơn là giảm lặp

### Duplicate chính xác hoặc gần chính xác

- `ReturnsHeader` giữa admin và seller gần như giống hệt
- `ImportRequestsHeader` giữa admin và warehouse gần như giống hệt
- `purchase-order/page.tsx` giữa admin và warehouse gần như giống hệt
- 3 file layout `dashboard` giữa admin/seller/warehouse có cấu trúc giống nhau

---

## 8. Kế hoạch refactor chi tiết từng bước

Nguyên tắc của toàn bộ plan:

- Mỗi bước phải đủ nhỏ để review độc lập.
- Có thể dừng ở bất kỳ bước nào mà codebase vẫn chạy được.
- Mỗi bước chỉ nên động tới 1 nhóm concern rõ ràng.
- Mọi migration lớn đều cần có giai đoạn compat tạm thời.

---

## Phase 1. Chuẩn bị nền tảng

### Bước 1. Tạo regression checklist

- Mục tiêu: Có danh sách smoke test trước khi đụng tới kiến trúc.
- File/thư mục bị ảnh hưởng: `docs/refactor/admin-dashboard-regression.md`
- Thay đổi cụ thể: Liệt kê route, thao tác CRUD, flow modal, tab, filter, detail, import, approve/reject theo role.
- Vì sao bước này an toàn: Chỉ thêm tài liệu, không đổi runtime.
- Rủi ro có thể xảy ra: Bỏ sót use case.
- Cách kiểm tra sau khi sửa: So checklist với sidebar và route hiện có.
- Commit message gợi ý: `docs(refactor): add dashboard regression checklist`

### Bước 2. Tạo inventory route-service-type

- Mục tiêu: Biết mỗi màn hình đang phụ thuộc service và type nào.
- File/thư mục bị ảnh hưởng: `docs/refactor/admin-dashboard-inventory.md`
- Thay đổi cụ thể: Map route -> component -> service -> type -> mock/live.
- Vì sao bước này an toàn: Docs-only.
- Rủi ro có thể xảy ra: Bỏ sót file con trong `_components`.
- Cách kiểm tra sau khi sửa: So với danh sách file trong `app/admin/dashboard`.
- Commit message gợi ý: `docs(refactor): add admin dashboard inventory`

### Bước 3. Tạo direct-service-call matrix

- Mục tiêu: Chốt thứ tự query hóa.
- File/thư mục bị ảnh hưởng: `docs/refactor/direct-service-calls.md`
- Thay đổi cụ thể: Liệt kê các file UI đang import service trực tiếp và phân loại read/write.
- Vì sao bước này an toàn: Không chạm code chạy.
- Rủi ro có thể xảy ra: Bỏ sót service được import gián tiếp.
- Cách kiểm tra sau khi sửa: Rà bằng `rg` toàn repo.
- Commit message gợi ý: `docs(refactor): audit direct service calls`

### Bước 4. Tạo duplicate matrix cross-role

- Mục tiêu: Chia nhóm shared sớm và shared muộn.
- File/thư mục bị ảnh hưởng: `docs/refactor/dashboard-duplicate-matrix.md`
- Thay đổi cụ thể: So sánh admin/seller/warehouse theo feature.
- Vì sao bước này an toàn: Chỉ thêm tài liệu.
- Rủi ro có thể xảy ra: Đánh giá giống nhau quá sớm trong khi logic khác.
- Cách kiểm tra sau khi sửa: Đối chiếu diff thực tế từng role.
- Commit message gợi ý: `docs(refactor): add cross-role duplicate matrix`

### Bước 5. Tạo contract-gap list

- Mục tiêu: Đóng băng các khu vực chưa đủ thông tin để refactor sâu.
- File/thư mục bị ảnh hưởng: `docs/refactor/contract-gaps.md`
- Thay đổi cụ thể: Ghi rõ `import-requests`, `returns`, `return-to-warehouse`, `warehouse purchase-order/import`, `customers metrics`.
- Vì sao bước này an toàn: Không đụng runtime.
- Rủi ro có thể xảy ra: Đưa nhầm khu vực đang live API vào danh sách defer.
- Cách kiểm tra sau khi sửa: Đối chiếu với `services` và `app/api`.
- Commit message gợi ý: `docs(refactor): document contract gaps`

### Bước 6. Chốt naming convention

- Mục tiêu: Tránh tạo feature mới với naming không thống nhất.
- File/thư mục bị ảnh hưởng: `docs/refactor/dashboard-architecture-adr.md`
- Thay đổi cụ thể: Chốt `*-management`, `hooks`, `selectors`, `store`, `types/request`, `types/response`, `query-keys`.
- Vì sao bước này an toàn: Tài liệu hóa trước khi sửa code.
- Rủi ro có thể xảy ra: Naming quá dài hoặc khó nhớ.
- Cách kiểm tra sau khi sửa: Review nhanh với team.
- Commit message gợi ý: `docs(refactor): add dashboard architecture adr`

### Bước 7. Tạo skeleton feature batch 1

- Mục tiêu: Có khung feature cho nhóm cơ bản.
- File/thư mục bị ảnh hưởng: `features/account-management`, `features/customer-management`, `features/category-management`, `features/format-management`, `features/supplier-management`
- Thay đổi cụ thể: Tạo `hooks`, `selectors`, `store`, `lib`, `ui`, `index.ts`.
- Vì sao bước này an toàn: Chưa wire vào route hoặc import cũ.
- Rủi ro có thể xảy ra: Folder naming sai ngay từ đầu.
- Cách kiểm tra sau khi sửa: Lint path alias và barrel export.
- Commit message gợi ý: `chore(features): scaffold management features batch 1`

### Bước 8. Tạo skeleton feature batch 2

- Mục tiêu: Có khung feature cho nhóm domain còn lại.
- File/thư mục bị ảnh hưởng: `features/book-management`, `features/order-management`, `features/promotion-management`, `features/purchase-order-management`, `features/batch-management`, `features/import-receipt-management`, `features/import-request-management`, `features/return-management`, `features/warehouse-return-management`
- Thay đổi cụ thể: Tạo cấu trúc rỗng + barrel export.
- Vì sao bước này an toàn: Additive only.
- Rủi ro có thể xảy ra: Naming hoặc grouping chưa chuẩn.
- Cách kiểm tra sau khi sửa: Lint import path.
- Commit message gợi ý: `chore(features): scaffold management features batch 2`

### Bước 9. Tạo barrel cho `types/request` và `types/response`

- Mục tiêu: Chuẩn bị migration import dần theo từng bước.
- File/thư mục bị ảnh hưởng: `types/request/index.ts`, `types/response/index.ts`
- Thay đổi cụ thể: Export file hiện có và thêm placeholder cho file mới.
- Vì sao bước này an toàn: Không đổi runtime.
- Rủi ro có thể xảy ra: Import vòng.
- Cách kiểm tra sau khi sửa: `npm run lint`
- Commit message gợi ý: `chore(types): add request response barrels`

### Bước 10. Tạo migration tracker

- Mục tiêu: Quản lý old path -> new path -> trạng thái migration.
- File/thư mục bị ảnh hưởng: `docs/refactor/migration-tracker.md`
- Thay đổi cụ thể: Bảng theo feature, file, trạng thái, commit.
- Vì sao bước này an toàn: Docs-only.
- Rủi ro có thể xảy ra: Tracker không được cập nhật đều.
- Cách kiểm tra sau khi sửa: Dùng tracker sau mỗi commit.
- Commit message gợi ý: `docs(refactor): add migration tracker`

---

## Phase 2. Chuẩn hóa type và service

### Bước 11. Tách `user.request.ts`

- Mục tiêu: Đưa `CreateUserRequest` và `UpdateUserRequest` ra khỏi `user.service.ts`.
- File/thư mục bị ảnh hưởng: `types/request/user.request.ts`
- Thay đổi cụ thể: Copy type hiện tại sang file mới.
- Vì sao bước này an toàn: Additive only.
- Rủi ro có thể xảy ra: Trùng tên type.
- Cách kiểm tra sau khi sửa: Lint type import.
- Commit message gợi ý: `refactor(types): extract user request types`

### Bước 12. Tách `user.response.ts`

- Mục tiêu: Đưa `User`, `Address`, `UserRole` về root `types/response`.
- File/thư mục bị ảnh hưởng: `types/response/user.response.ts`
- Thay đổi cụ thể: Tạo DTO thuần, không kèm UI field.
- Vì sao bước này an toàn: Additive only.
- Rủi ro có thể xảy ra: Thiếu field nested.
- Cách kiểm tra sau khi sửa: So với shape đang dùng trong service.
- Commit message gợi ý: `refactor(types): extract user response types`

### Bước 13. Cập nhật `user.service.ts` theo type mới

- Mục tiêu: Service dùng root types nhưng vẫn giữ compat.
- File/thư mục bị ảnh hưởng: `services/user.service.ts`
- Thay đổi cụ thể: Import type từ `types/*`, thêm strict methods nếu cần, giữ legacy alias tạm thời.
- Vì sao bước này an toàn: API cũ chưa đổi.
- Rủi ro có thể xảy ra: Nhầm generic của envelope response.
- Cách kiểm tra sau khi sửa: Smoke test `accounts` và `customers`.
- Commit message gợi ý: `refactor(user-service): consume root types with compat`

### Bước 14. Tách `order.request.ts`

- Mục tiêu: Đưa payload update order status về `types/request`.
- File/thư mục bị ảnh hưởng: `types/request/order.request.ts`
- Thay đổi cụ thể: Tạo `UpdateOrderStatusRequest`.
- Vì sao bước này an toàn: Additive only.
- Rủi ro có thể xảy ra: Sai tên payload so với backend.
- Cách kiểm tra sau khi sửa: So với API route update status.
- Commit message gợi ý: `refactor(types): extract order request types`

### Bước 15. Tách `order.response.ts`

- Mục tiêu: Đưa `Order`, `OrderDetail`, `OrderStatus` về `types/response`.
- File/thư mục bị ảnh hưởng: `types/response/order.response.ts`
- Thay đổi cụ thể: Tạo DTO thuần.
- Vì sao bước này an toàn: Additive only.
- Rủi ro có thể xảy ra: Enum status chưa đủ.
- Cách kiểm tra sau khi sửa: So với `order.service.ts`.
- Commit message gợi ý: `refactor(types): extract order response types`

### Bước 16. Cập nhật `order.service.ts`

- Mục tiêu: Service dùng root types và có strict methods.
- File/thư mục bị ảnh hưởng: `services/order.service.ts`
- Thay đổi cụ thể: Giữ safe methods cũ, thêm `getAllOrdersStrict`, `getOrderByIdStrict`, `updateOrderStatusStrict`.
- Vì sao bước này an toàn: Chưa buộc consumer cũ đổi ngay.
- Rủi ro có thể xảy ra: Mixed usage giữa strict và safe method.
- Cách kiểm tra sau khi sửa: Smoke test màn `orders`.
- Commit message gợi ý: `refactor(order-service): add strict typed methods`

### Bước 17. Tách `promotion.request.ts`

- Mục tiêu: Đưa `CreatePromotionData` và payload action ra khỏi service.
- File/thư mục bị ảnh hưởng: `types/request/promotion.request.ts`
- Thay đổi cụ thể: Tạo request cho create/update/action.
- Vì sao bước này an toàn: Additive only.
- Rủi ro có thể xảy ra: Action payload dư field.
- Cách kiểm tra sau khi sửa: So với API routes `promotions`.
- Commit message gợi ý: `refactor(types): extract promotion request types`

### Bước 18. Tách `promotion.response.ts`

- Mục tiêu: Đưa `Promotion` và `PromotionStatus` về `types/response`.
- File/thư mục bị ảnh hưởng: `types/response/promotion.response.ts`
- Thay đổi cụ thể: DTO thuần không chứa format UI.
- Vì sao bước này an toàn: Additive only.
- Rủi ro có thể xảy ra: Thiếu enum status.
- Cách kiểm tra sau khi sửa: So với `promotion.service.ts`.
- Commit message gợi ý: `refactor(types): extract promotion response types`

### Bước 19. Cập nhật `promotion.service.ts`

- Mục tiêu: Service dùng type mới và cung cấp strict methods.
- File/thư mục bị ảnh hưởng: `services/promotion.service.ts`
- Thay đổi cụ thể: Giữ safe method cũ nếu cần, thêm strict detail và action methods.
- Vì sao bước này an toàn: Không đổi call site cũ ngay lập tức.
- Rủi ro có thể xảy ra: Lệch enum như `DELETED`, `PAUSED`.
- Cách kiểm tra sau khi sửa: Smoke test `promotions`.
- Commit message gợi ý: `refactor(promotion-service): add strict typed methods`

### Bước 20. Tách `supplier.request.ts`

- Mục tiêu: Đưa create/update supplier request ra root.
- File/thư mục bị ảnh hưởng: `types/request/supplier.request.ts`
- Thay đổi cụ thể: Tách request DTO.
- Vì sao bước này an toàn: Additive only.
- Rủi ro có thể xảy ra: Optional field không khớp backend.
- Cách kiểm tra sau khi sửa: So với `supplier.service.ts`.
- Commit message gợi ý: `refactor(types): extract supplier request types`

### Bước 21. Chuẩn hóa `supplier.response.ts`

- Mục tiêu: Giữ `Supplier` là payload DTO thuần.
- File/thư mục bị ảnh hưởng: `types/response/supplier.response.ts`
- Thay đổi cụ thể: Giảm coupling với wrapper lồng nhau.
- Vì sao bước này an toàn: Có thể làm additive trước khi đổi import rộng.
- Rủi ro có thể xảy ra: Consumer cũ phụ thuộc wrapper shape.
- Cách kiểm tra sau khi sửa: Lint `suppliers` và `books`.
- Commit message gợi ý: `refactor(types): normalize supplier response types`

### Bước 22. Cập nhật `supplier.service.ts`

- Mục tiêu: Dùng root types + strict methods.
- File/thư mục bị ảnh hưởng: `services/supplier.service.ts`
- Thay đổi cụ thể: Thêm strict list/detail/create/update, giữ method cũ cho compat.
- Vì sao bước này an toàn: Consumer cũ chưa bắt buộc đổi.
- Rủi ro có thể xảy ra: `delete` trả `boolean` gây lệch contract.
- Cách kiểm tra sau khi sửa: Smoke test `suppliers` và option loading của `books`.
- Commit message gợi ý: `refactor(supplier-service): add strict typed methods`

### Bước 23. Tách `category.request.ts`

- Mục tiêu: Đưa create/update category request ra root.
- File/thư mục bị ảnh hưởng: `types/request/category.request.ts`
- Thay đổi cụ thể: Tách DTO request.
- Vì sao bước này an toàn: Additive only.
- Rủi ro có thể xảy ra: `code` optional không đồng nhất.
- Cách kiểm tra sau khi sửa: So với route/service.
- Commit message gợi ý: `refactor(types): extract category request types`

### Bước 24. Chuẩn hóa `category.response.ts`

- Mục tiêu: Giữ `Category` là payload DTO thuần, tách khỏi wrapper coupling.
- File/thư mục bị ảnh hưởng: `types/response/category.response.ts`
- Thay đổi cụ thể: Tổ chức lại type để dễ reuse.
- Vì sao bước này an toàn: Có thể làm tương thích ngược trước.
- Rủi ro có thể xảy ra: Import cũ bị lệch.
- Cách kiểm tra sau khi sửa: Lint `categories` và `books`.
- Commit message gợi ý: `refactor(types): normalize category response types`

### Bước 25. Cập nhật `category.service.ts`

- Mục tiêu: Dùng root types + strict methods.
- File/thư mục bị ảnh hưởng: `services/category.service.ts`
- Thay đổi cụ thể: Thêm strict list/detail/create/update/delete.
- Vì sao bước này an toàn: Safe method cũ vẫn giữ.
- Rủi ro có thể xảy ra: Sai xử lý delete void/error.
- Cách kiểm tra sau khi sửa: Smoke test `categories`.
- Commit message gợi ý: `refactor(category-service): add strict typed methods`

### Bước 26. Tách `format.request.ts`

- Mục tiêu: Đưa create/update format ra root.
- File/thư mục bị ảnh hưởng: `types/request/format.request.ts`
- Thay đổi cụ thể: Tách DTO request.
- Vì sao bước này an toàn: Additive only.
- Rủi ro có thể xảy ra: Naming field lệch với API.
- Cách kiểm tra sau khi sửa: So với route `variants`.
- Commit message gợi ý: `refactor(types): extract format request types`

### Bước 27. Chuẩn hóa `format.response.ts`

- Mục tiêu: Thống nhất payload format response.
- File/thư mục bị ảnh hưởng: `types/response/format.response.ts`
- Thay đổi cụ thể: Làm rõ list/detail payload.
- Vì sao bước này an toàn: Additive only.
- Rủi ro có thể xảy ra: Trùng type cũ trong `features/format`.
- Cách kiểm tra sau khi sửa: Lint `formats` và `books`.
- Commit message gợi ý: `refactor(types): normalize format response types`

### Bước 28. Cập nhật `format.service.ts`

- Mục tiêu: Dùng root types + strict methods.
- File/thư mục bị ảnh hưởng: `services/format.service.ts`
- Thay đổi cụ thể: Giữ API cũ, thêm strict list/create/update/delete.
- Vì sao bước này an toàn: Không đổi route.
- Rủi ro có thể xảy ra: `features/format` cũ phụ thuộc type cũ.
- Cách kiểm tra sau khi sửa: Smoke test `formats`.
- Commit message gợi ý: `refactor(format-service): add strict typed methods`

### Bước 29. Tách `purchase-order.request.ts`

- Mục tiêu: Đưa `CreatePurchaseOrderRequest` ra root request types.
- File/thư mục bị ảnh hưởng: `types/request/purchase-order.request.ts`
- Thay đổi cụ thể: Tách request và item payload.
- Vì sao bước này an toàn: Additive only.
- Rủi ro có thể xảy ra: `variantId` optional sai.
- Cách kiểm tra sau khi sửa: So với create modal hiện tại.
- Commit message gợi ý: `refactor(types): extract purchase order request types`

### Bước 30. Chuẩn hóa `purchase-order.response.ts`

- Mục tiêu: Giữ `PurchaseOrder` và `PurchaseOrderItem` là payload chuẩn.
- File/thư mục bị ảnh hưởng: `types/response/purchase-order.response.ts`
- Thay đổi cụ thể: Làm rõ status, item fields, meta nếu có.
- Vì sao bước này an toàn: Có thể thêm compat alias tạm.
- Rủi ro có thể xảy ra: Thiếu state imported/paid/canceled.
- Cách kiểm tra sau khi sửa: Smoke test bảng `purchase-order`.
- Commit message gợi ý: `refactor(types): normalize purchase order response types`

### Bước 31. Cập nhật `purchase-order.service.ts`

- Mục tiêu: Dùng root types và strict methods.
- File/thư mục bị ảnh hưởng: `services/purchase-order.service.ts`
- Thay đổi cụ thể: Bỏ type request khỏi service, thêm strict list/detail/action/create/pay.
- Vì sao bước này an toàn: Giữ compat method names.
- Rủi ro có thể xảy ra: Action response envelope không đều.
- Cách kiểm tra sau khi sửa: Smoke test `purchase-order`.
- Commit message gợi ý: `refactor(purchase-order-service): add strict typed methods`

### Bước 32. Tách `batch.request.ts` và `batch.response.ts`

- Mục tiêu: Đưa `Batch` và `CreateBatchRequest` ra root types.
- File/thư mục bị ảnh hưởng: `types/request/batch.request.ts`, `types/response/batch.response.ts`
- Thay đổi cụ thể: Tách DTO request/response thuần.
- Vì sao bước này an toàn: Additive only.
- Rủi ro có thể xảy ra: Nested field `variant` bị thiếu.
- Cách kiểm tra sau khi sửa: So với batch dialog và batch table.
- Commit message gợi ý: `refactor(types): extract batch request response types`

### Bước 33. Cập nhật `batch.service.ts`

- Mục tiêu: Service dùng type mới và strict methods.
- File/thư mục bị ảnh hưởng: `services/batch.service.ts`
- Thay đổi cụ thể: Thêm strict list/detail/create.
- Vì sao bước này an toàn: Compat method giữ nguyên.
- Rủi ro có thể xảy ra: Sai path hoặc response map.
- Cách kiểm tra sau khi sửa: Smoke test `batch`.
- Commit message gợi ý: `refactor(batch-service): add strict typed methods`

### Bước 34. Tách `import-stock.request.ts` và `import-stock.response.ts`

- Mục tiêu: Đưa contract import receipt về root types.
- File/thư mục bị ảnh hưởng: `types/request/import-stock.request.ts`, `types/response/import-stock.response.ts`
- Thay đổi cụ thể: Tách `CreateImportStockFromPORequest`, `ImportStock`, `ImportStockItem`, `BatchResult`, `ReceiveImportStockResponse`.
- Vì sao bước này an toàn: Additive only.
- Rủi ro có thể xảy ra: Shape `details` và `items` chưa đồng nhất.
- Cách kiểm tra sau khi sửa: So với `import-stock.service.ts`.
- Commit message gợi ý: `refactor(types): extract import stock request response types`

### Bước 35. Cập nhật `import-stock.service.ts`

- Mục tiêu: Dùng type mới + strict methods.
- File/thư mục bị ảnh hưởng: `services/import-stock.service.ts`
- Thay đổi cụ thể: Giữ map `details -> items` tạm thời, thêm strict list/create/receive.
- Vì sao bước này an toàn: Safe compat còn tồn tại.
- Rủi ro có thể xảy ra: Consumer cũ phụ thuộc shape cũ.
- Cách kiểm tra sau khi sửa: Smoke test import/import-receipt.
- Commit message gợi ý: `refactor(import-stock-service): add strict typed methods`

### Bước 36. Tách `book-variant.request.ts` và `book-variant.response.ts`

- Mục tiêu: Đưa contract variant về root types.
- File/thư mục bị ảnh hưởng: `types/request/book-variant.request.ts`, `types/response/book-variant.response.ts`
- Thay đổi cụ thể: Tách update request và response DTO.
- Vì sao bước này an toàn: Additive only.
- Rủi ro có thể xảy ra: Nhầm `variantId` với `id`.
- Cách kiểm tra sau khi sửa: So với `EditBookModal` và `AddBatchDialog`.
- Commit message gợi ý: `refactor(types): extract book variant request response types`

### Bước 37. Cập nhật `bookVariant.service.ts`

- Mục tiêu: Dùng root types và strict methods.
- File/thư mục bị ảnh hưởng: `services/bookVariant.service.ts`
- Thay đổi cụ thể: Thêm strict detail/list/update.
- Vì sao bước này an toàn: Compat method vẫn giữ.
- Rủi ro có thể xảy ra: Consumer cũ dùng safe empty array.
- Cách kiểm tra sau khi sửa: Smoke test batch và edit book.
- Commit message gợi ý: `refactor(book-variant-service): add strict typed methods`

### Bước 38. Rà lại `book.request.ts` và `book.response.ts` cho management flow

- Mục tiêu: Đảm bảo contract `book` đủ field cho admin management.
- File/thư mục bị ảnh hưởng: `types/request/book.request.ts`, `types/response/book.response.ts`
- Thay đổi cụ thể: Bổ sung alias hoặc field cần thiết nhưng chưa động vào view-model UI.
- Vì sao bước này an toàn: File đã tồn tại nên diff nhỏ.
- Rủi ro có thể xảy ra: Ảnh hưởng phần storefront nếu import chung.
- Cách kiểm tra sau khi sửa: Lint `books`, `cart`, `book detail`.
- Commit message gợi ý: `refactor(types): align book contracts for management flow`

---

## Phase 3. Tách hooks / selectors / store vào feature

### Bước 39. Tạo internals cho `account-management`

- Mục tiêu: Gom query keys, mapper, UI state vào feature.
- File/thư mục bị ảnh hưởng: `features/account-management/*`
- Thay đổi cụ thể: Tạo `query-keys.ts`, `mappers.ts`, store filter state.
- Vì sao bước này an toàn: Chưa wire route.
- Rủi ro có thể xảy ra: Naming drift.
- Cách kiểm tra sau khi sửa: Lint barrel export.
- Commit message gợi ý: `chore(account-management): add feature internals`

### Bước 40. Tạo internals cho `customer-management`

- Mục tiêu: Tách customer view model khỏi page.
- File/thư mục bị ảnh hưởng: `features/customer-management/*`
- Thay đổi cụ thể: Thêm mapper `User -> CustomerRow`.
- Vì sao bước này an toàn: Chưa đổi page.
- Rủi ro có thể xảy ra: Placeholder metric bị vô tình xem như contract thật.
- Cách kiểm tra sau khi sửa: Lint.
- Commit message gợi ý: `chore(customer-management): add feature internals`

### Bước 41. Tạo internals cho `category-management`

- Mục tiêu: Chuẩn bị hook/store/selectors riêng cho category.
- File/thư mục bị ảnh hưởng: `features/category-management/*`
- Thay đổi cụ thể: Tạo query keys, selectors cho filter/search, helpers.
- Vì sao bước này an toàn: Additive only.
- Rủi ro có thể xảy ra: Thêm abstraction sớm nhưng chưa dùng.
- Cách kiểm tra sau khi sửa: Lint.
- Commit message gợi ý: `chore(category-management): add feature internals`

### Bước 42. Tạo internals cho `format-management`

- Mục tiêu: Chuẩn hóa pattern cho `formats`.
- File/thư mục bị ảnh hưởng: `features/format-management/*`
- Thay đổi cụ thể: Tạo query keys, selectors, store, hooks skeleton.
- Vì sao bước này an toàn: Chưa đổi import hiện có.
- Rủi ro có thể xảy ra: Trùng khái niệm với `features/format` cũ.
- Cách kiểm tra sau khi sửa: Lint.
- Commit message gợi ý: `chore(format-management): add feature internals`

### Bước 43. Tạo internals cho `supplier-management`

- Mục tiêu: Gom filter, form defaults, mapper vào feature.
- File/thư mục bị ảnh hưởng: `features/supplier-management/*`
- Thay đổi cụ thể: Tạo `query-keys.ts`, `mappers.ts`, `form-defaults.ts`.
- Vì sao bước này an toàn: Additive only.
- Rủi ro có thể xảy ra: Duplicate với code UI hiện tại.
- Cách kiểm tra sau khi sửa: Lint.
- Commit message gợi ý: `chore(supplier-management): add feature internals`

### Bước 44. Tạo internals cho `book-management`

- Mục tiêu: Tách `BookCreateModel`, `BookEditModel`, `BooksTableRow` khỏi UI.
- File/thư mục bị ảnh hưởng: `features/book-management/*`
- Thay đổi cụ thể: Tạo `view-models.ts`, `mappers.ts`, `query-keys.ts`.
- Vì sao bước này an toàn: Chưa đổi behavior.
- Rủi ro có thể xảy ra: Thiếu field trong row model.
- Cách kiểm tra sau khi sửa: Lint.
- Commit message gợi ý: `chore(book-management): add feature internals`

### Bước 45. Tạo internals cho `order-management`

- Mục tiêu: Gom tabs, status config, filters vào feature.
- File/thư mục bị ảnh hưởng: `features/order-management/*`
- Thay đổi cụ thể: Tạo `query-keys.ts`, `status-map.ts`, selectors/store.
- Vì sao bước này an toàn: Additive only.
- Rủi ro có thể xảy ra: Status map khác backend.
- Cách kiểm tra sau khi sửa: Lint.
- Commit message gợi ý: `chore(order-management): add feature internals`

### Bước 46. Tạo internals cho `promotion-management`

- Mục tiêu: Gom DTO mapper và tabs/filter state vào feature.
- File/thư mục bị ảnh hưởng: `features/promotion-management/*`
- Thay đổi cụ thể: Tạo `mappers.ts`, `query-keys.ts`, selectors/store.
- Vì sao bước này an toàn: Additive only.
- Rủi ro có thể xảy ra: Lệch status `APPROVED` và `ACTIVE`.
- Cách kiểm tra sau khi sửa: Lint.
- Commit message gợi ý: `chore(promotion-management): add feature internals`

### Bước 47. Tạo internals cho `purchase-order-management`

- Mục tiêu: Gom tabs, action types, form state vào feature.
- File/thư mục bị ảnh hưởng: `features/purchase-order-management/*`
- Thay đổi cụ thể: Tạo query keys, status config, form models.
- Vì sao bước này an toàn: Additive only.
- Rủi ro có thể xảy ra: Feature này quá lớn, dễ gom quá mức.
- Cách kiểm tra sau khi sửa: Lint.
- Commit message gợi ý: `chore(purchase-order-management): add feature internals`

### Bước 48. Tạo internals cho `batch-management` và `import-receipt-management`

- Mục tiêu: Tách option-query và action-query khỏi UI.
- File/thư mục bị ảnh hưởng: `features/batch-management/*`, `features/import-receipt-management/*`
- Thay đổi cụ thể: Tạo query keys, selectors, form defaults.
- Vì sao bước này an toàn: Additive only.
- Rủi ro có thể xảy ra: Hai feature dùng chung `import-stock` dễ bị trộn.
- Cách kiểm tra sau khi sửa: Lint.
- Commit message gợi ý: `chore(batch-import): add feature internals`

### Bước 49. Chuẩn hóa `features/format` cũ

- Mục tiêu: Đổi `selector` thành `selectors` và giữ compat export tạm.
- File/thư mục bị ảnh hưởng: `features/format/*`
- Thay đổi cụ thể: Rename nội bộ/barrel mà chưa đổi import toàn repo ngay.
- Vì sao bước này an toàn: Diff hẹp.
- Rủi ro có thể xảy ra: Broken import.
- Cách kiểm tra sau khi sửa: Lint và smoke test `formats`.
- Commit message gợi ý: `refactor(format-feature): normalize selectors naming`

---

## Phase 4. Chuyển đổi service call sang query/mutation

### Bước 50. Query hóa danh sách thể loại

- Mục tiêu: Bỏ fetch trực tiếp trong page.
- File/thư mục bị ảnh hưởng: `features/category-management/hooks`, `AdminCategoriesPage`
- Thay đổi cụ thể: Thêm `useCategoriesQuery`.
- Vì sao bước này an toàn: Chỉ đổi nguồn data của page.
- Rủi ro có thể xảy ra: Loading/error UI thay đổi nhẹ.
- Cách kiểm tra sau khi sửa: Mở page `categories`, reload, filter.
- Commit message gợi ý: `refactor(category-management): add categories query`

### Bước 51. Mutation hóa create/update/delete thể loại

- Mục tiêu: Rút service call khỏi header/table.
- File/thư mục bị ảnh hưởng: `features/category-management/hooks`, `CategoryHeader`, `CategoryTable`
- Thay đổi cụ thể: Thêm `useCreateCategoryMutation`, `useUpdateCategoryMutation`, `useDeleteCategoryMutation`.
- Vì sao bước này an toàn: Chỉ động tới một feature nhỏ.
- Rủi ro có thể xảy ra: Invalidate chưa đúng hoặc toast thay đổi timing.
- Cách kiểm tra sau khi sửa: Tạo, sửa, xóa category.
- Commit message gợi ý: `refactor(category-management): move category mutations to hooks`

### Bước 52. Hoàn tất query hóa format

- Mục tiêu: Chốt pattern query/mutation cho feature `format`.
- File/thư mục bị ảnh hưởng: `features/format-management`, `FormatHeader`, `FormatTable`, `AdminFormatsPage`
- Thay đổi cụ thể: Thêm mutation create/update/delete và giảm dần việc mirror query data vào store.
- Vì sao bước này an toàn: Feature nhỏ, phạm vi hẹp.
- Rủi ro có thể xảy ra: Query và store cùng giữ một source of truth.
- Cách kiểm tra sau khi sửa: Tạo, sửa, xóa format.
- Commit message gợi ý: `refactor(format-management): complete query mutation flow`

### Bước 53. Query hóa danh sách nhà cung cấp

- Mục tiêu: Bỏ fetch trong `AdminSuppliersPage`.
- File/thư mục bị ảnh hưởng: `features/supplier-management/hooks`, `AdminSuppliersPage`
- Thay đổi cụ thể: Tạo `useSuppliersQuery` và filter hook.
- Vì sao bước này an toàn: Table UI không đổi nhiều.
- Rủi ro có thể xảy ra: Search/filter đang xử lý local bị lệch.
- Cách kiểm tra sau khi sửa: Mở page `suppliers`, search, lọc.
- Commit message gợi ý: `refactor(supplier-management): add suppliers query`

### Bước 54. Mutation hóa create/update nhà cung cấp

- Mục tiêu: Rút service call khỏi `SupplierHeader` và `SupplierTable`.
- File/thư mục bị ảnh hưởng: `features/supplier-management/hooks`, `SupplierHeader`, `SupplierTable`
- Thay đổi cụ thể: Thêm mutation cho create/update và invalidate list.
- Vì sao bước này an toàn: Action tách nhỏ, dễ review.
- Rủi ro có thể xảy ra: Reset form sau submit không đồng nhất.
- Cách kiểm tra sau khi sửa: Tạo mới và chỉnh sửa supplier.
- Commit message gợi ý: `refactor(supplier-management): move supplier mutations to hooks`

### Bước 55. Query hóa danh sách tài khoản

- Mục tiêu: Bỏ fetch/refreshKey thủ công.
- File/thư mục bị ảnh hưởng: `features/account-management/hooks`, `AdminAccountsPage`
- Thay đổi cụ thể: Dùng `useAccountsQuery` + mapper hook.
- Vì sao bước này an toàn: Giữ nguyên table props hiện tại.
- Rủi ro có thể xảy ra: Search local state hoạt động khác.
- Cách kiểm tra sau khi sửa: Mở `accounts`, search, reload.
- Commit message gợi ý: `refactor(account-management): add accounts query`

### Bước 56. Mutation hóa create/update tài khoản

- Mục tiêu: Rút service call khỏi `AccountHeader` và `AccountTable`.
- File/thư mục bị ảnh hưởng: `features/account-management/hooks`, `AccountHeader`, `AccountTable`
- Thay đổi cụ thể: Thêm mutation create/update và invalidate user list.
- Vì sao bước này an toàn: Action đơn giản.
- Rủi ro có thể xảy ra: Payload split name bị sai.
- Cách kiểm tra sau khi sửa: Tạo và sửa account.
- Commit message gợi ý: `refactor(account-management): move account mutations to hooks`

### Bước 57. Query hóa danh sách khách hàng

- Mục tiêu: Bỏ fetch thủ công và chuyển mapper vào feature.
- File/thư mục bị ảnh hưởng: `features/customer-management/hooks`, `CustomersPage`
- Thay đổi cụ thể: Tạo `useCustomersQuery` với `select` hoặc mapper riêng.
- Vì sao bước này an toàn: UI chỉ đổi nguồn data.
- Rủi ro có thể xảy ra: Filter role `USER` chưa chắc là contract thật.
- Cách kiểm tra sau khi sửa: Mở `customers`, search, reload.
- Commit message gợi ý: `refactor(customer-management): add customers query`

### Bước 58. Tách placeholder customer metrics khỏi page

- Mục tiêu: Làm rõ `totalOrders`, `totalSpent`, `joinDate` hiện là logic tạm.
- File/thư mục bị ảnh hưởng: `features/customer-management/lib/mappers.ts`, `CustomersPage`
- Thay đổi cụ thể: Chuyển mapping giả lập vào feature lib và đánh dấu TODO contract.
- Vì sao bước này an toàn: Không đổi hành vi.
- Rủi ro có thể xảy ra: Vô tình lan truyền metric giả sang nơi khác.
- Cách kiểm tra sau khi sửa: `customers` render giống hệt trước đó.
- Commit message gợi ý: `refactor(customer-management): isolate temporary customer mapping`

### Bước 59. Query hóa danh sách đơn hàng

- Mục tiêu: Bỏ fetch trong `AdminOrdersPage`.
- File/thư mục bị ảnh hưởng: `features/order-management/hooks`, `AdminOrdersPage`
- Thay đổi cụ thể: Tạo `useOrdersQuery`, selectors cho tabs/filter.
- Vì sao bước này an toàn: Table không đổi lớn.
- Rủi ro có thể xảy ra: Empty/error state đổi hành vi.
- Cách kiểm tra sau khi sửa: Mở `orders`, đổi tab, search.
- Commit message gợi ý: `refactor(order-management): add orders query`

### Bước 60. Query hóa order detail và mutation hóa status

- Mục tiêu: Rút service call khỏi `OrderTable` và `OrderDetailModal`.
- File/thư mục bị ảnh hưởng: `features/order-management/hooks`, `OrderTable`, `OrderDetailModal`
- Thay đổi cụ thể: Tạo `useOrderDetailQuery`, `useUpdateOrderStatusMutation`.
- Vì sao bước này an toàn: Chỉ đổi data flow bên trong feature.
- Rủi ro có thể xảy ra: Modal bị stale data sau mutation.
- Cách kiểm tra sau khi sửa: Mở detail, cập nhật trạng thái, kiểm tra refresh.
- Commit message gợi ý: `refactor(order-management): move order detail and status actions to hooks`

### Bước 61. Query hóa danh sách khuyến mãi

- Mục tiêu: Bỏ fetch và mapping trong `AdminPromotionsPage`.
- File/thư mục bị ảnh hưởng: `features/promotion-management/hooks`, `features/promotion-management/lib/mappers.ts`, `AdminPromotionsPage`
- Thay đổi cụ thể: Tạo `usePromotionsQuery` và mapper riêng.
- Vì sao bước này an toàn: Props của table có thể giữ nguyên.
- Rủi ro có thể xảy ra: Tab count lệch do status mapping.
- Cách kiểm tra sau khi sửa: Mở `promotions`, search, tab count.
- Commit message gợi ý: `refactor(promotion-management): add promotions query`

### Bước 62. Query hóa promotion detail và mutation hóa action

- Mục tiêu: Rút service call khỏi `PromotionDetailModal`, `CreatePromotionModal`, page action handlers.
- File/thư mục bị ảnh hưởng: `features/promotion-management/hooks`, `PromotionDetailModal`, `CreatePromotionModal`, `AdminPromotionsPage`
- Thay đổi cụ thể: Tạo mutation create/approve/reject/pause/resume.
- Vì sao bước này an toàn: Action được tách thành các hook nhỏ.
- Rủi ro có thể xảy ra: Invalidate thiếu list/detail liên quan.
- Cách kiểm tra sau khi sửa: Xem chi tiết, tạo mới, duyệt, từ chối, tạm dừng.
- Commit message gợi ý: `refactor(promotion-management): move promotion actions to hooks`

### Bước 63. Query hóa danh sách sách có phân trang/tìm kiếm

- Mục tiêu: Bỏ fetch thủ công trong `AdminBooksPage`.
- File/thư mục bị ảnh hưởng: `features/book-management/hooks`, `AdminBooksPage`
- Thay đổi cụ thể: Tạo query key có params `page`, `pageSize`, `search`.
- Vì sao bước này an toàn: Route không đổi.
- Rủi ro có thể xảy ra: Query key sai gây cache bẩn.
- Cách kiểm tra sau khi sửa: Đổi trang, đổi page size, search.
- Commit message gợi ý: `refactor(book-management): add paginated books query`

### Bước 64. Tách book view-model khỏi table/modal

- Mục tiêu: Dọn type UI khỏi component.
- File/thư mục bị ảnh hưởng: `features/book-management/lib/view-models.ts`, `features/book-management/lib/mappers.ts`, `BooksTable`, `EditBookModal`
- Thay đổi cụ thể: UI dùng row model và form model ở feature lib.
- Vì sao bước này an toàn: Chưa đổi API service.
- Rủi ro có thể xảy ra: Thiếu field trong mapper.
- Cách kiểm tra sau khi sửa: Bảng sách render đúng và modal edit mở được.
- Commit message gợi ý: `refactor(book-management): extract book view models`

### Bước 65. Mutation hóa xóa sách

- Mục tiêu: Rút `bookService.deleteBook` khỏi table.
- File/thư mục bị ảnh hưởng: `features/book-management/hooks`, `BooksTable`
- Thay đổi cụ thể: Tạo `useDeleteBookMutation` + invalidate.
- Vì sao bước này an toàn: Action đơn lẻ, rollback dễ.
- Rủi ro có thể xảy ra: Tổng số bản ghi không cập nhật.
- Cách kiểm tra sau khi sửa: Xóa sách ở nhiều trang khác nhau.
- Commit message gợi ý: `refactor(book-management): move delete book to mutation`

### Bước 66. Query hóa options cho form sách

- Mục tiêu: Bỏ `categoryService`, `supplierService`, `formatService` trực tiếp trong modal.
- File/thư mục bị ảnh hưởng: `features/book-management/hooks`, `AddBookModal`, `EditBookModal`
- Thay đổi cụ thể: Tạo `useBookFormOptionsQuery`.
- Vì sao bước này an toàn: Chưa đụng submit flow.
- Rủi ro có thể xảy ra: Query chạy sai thời điểm khi mở modal.
- Cách kiểm tra sau khi sửa: Mở add/edit modal và kiểm tra options.
- Commit message gợi ý: `refactor(book-management): add book form options query`

### Bước 67. Mutation hóa tạo sách

- Mục tiêu: Gói upload ảnh + create vào flow chuẩn.
- File/thư mục bị ảnh hưởng: `features/book-management/hooks`, `AddBookModal`
- Thay đổi cụ thể: Tạo `useCreateBookMutation`, giữ `uploadService` là util thuần.
- Vì sao bước này an toàn: Chỉ chạm create flow.
- Rủi ro có thể xảy ra: Upload fail handling thay đổi.
- Cách kiểm tra sau khi sửa: Tạo sách với ảnh và không có ảnh.
- Commit message gợi ý: `refactor(book-management): move create book flow to mutation`

### Bước 68. Query hóa chi tiết sách và mutation hóa cập nhật

- Mục tiêu: Rút `bookService.getBookById`, `getVariantsByBookId`, `updateBook` khỏi `EditBookModal`.
- File/thư mục bị ảnh hưởng: `features/book-management/hooks`, `EditBookModal`
- Thay đổi cụ thể: Tạo `useBookDetailQuery`, `useBookVariantsQuery`, `useUpdateBookMutation`.
- Vì sao bước này an toàn: Modal edit được cô lập.
- Rủi ro có thể xảy ra: Race condition khi đóng/mở modal nhanh.
- Cách kiểm tra sau khi sửa: Mở edit, thay đổi field, lưu và reload.
- Commit message gợi ý: `refactor(book-management): move edit book flow to hooks`

### Bước 69. Query hóa danh sách batch

- Mục tiêu: Bỏ fetch trong `BatchPage`.
- File/thư mục bị ảnh hưởng: `features/batch-management/hooks`, `BatchPage`
- Thay đổi cụ thể: Tạo `useBatchesQuery`.
- Vì sao bước này an toàn: UI đơn giản.
- Rủi ro có thể xảy ra: Loading shell khác trước.
- Cách kiểm tra sau khi sửa: Mở `batch`.
- Commit message gợi ý: `refactor(batch-management): add batches query`

### Bước 70. Query hóa option và mutation hóa tạo batch

- Mục tiêu: Rút `book/supplier/variantService` và create khỏi `AddBatchDialog`.
- File/thư mục bị ảnh hưởng: `features/batch-management/hooks`, `AddBatchDialog`
- Thay đổi cụ thể: Tạo `useBatchFormOptions`, `useCreateBatchMutation`.
- Vì sao bước này an toàn: Feature tách biệt.
- Rủi ro có thể xảy ra: Variant không reload đúng theo book.
- Cách kiểm tra sau khi sửa: Mở dialog, chọn sách, tạo batch.
- Commit message gợi ý: `refactor(batch-management): move batch form flow to hooks`

### Bước 71. Query hóa danh sách purchase-order

- Mục tiêu: Bỏ fetch trong `PurchaseOrdersPage`.
- File/thư mục bị ảnh hưởng: `features/purchase-order-management/hooks`, `PurchaseOrdersPage`
- Thay đổi cụ thể: Tạo `usePurchaseOrdersQuery`.
- Vì sao bước này an toàn: Table props có thể giữ nguyên.
- Rủi ro có thể xảy ra: Tab count lệch.
- Cách kiểm tra sau khi sửa: Mở `purchase-order`, đổi tab, search.
- Commit message gợi ý: `refactor(purchase-order-management): add purchase orders query`

### Bước 72. Query hóa option cho create purchase-order

- Mục tiêu: Bỏ `supplierService` và `bookService` trực tiếp trong modal.
- File/thư mục bị ảnh hưởng: `features/purchase-order-management/hooks`, `CreatePurchaseOrderModal`
- Thay đổi cụ thể: Tạo `useActiveSuppliersQuery`, `useBooksBySupplierQuery`.
- Vì sao bước này an toàn: Chưa đụng create submit logic nhiều.
- Rủi ro có thể xảy ra: Reset items sai khi đổi supplier.
- Cách kiểm tra sau khi sửa: Mở modal, đổi supplier, kiểm tra danh sách sách.
- Commit message gợi ý: `refactor(purchase-order-management): add form option queries`

### Bước 73. Mutation hóa tạo purchase-order

- Mục tiêu: Rút create khỏi modal.
- File/thư mục bị ảnh hưởng: `features/purchase-order-management/hooks`, `CreatePurchaseOrderModal`
- Thay đổi cụ thể: Tạo `useCreatePurchaseOrderMutation`.
- Vì sao bước này an toàn: Chỉ đổi submit flow.
- Rủi ro có thể xảy ra: Payload item list sai shape.
- Cách kiểm tra sau khi sửa: Tạo mới purchase order.
- Commit message gợi ý: `refactor(purchase-order-management): move create purchase order to mutation`

### Bước 74. Query hóa PO detail và sync import-stock map

- Mục tiêu: Bỏ fetch detail và import-stock map thủ công trong table.
- File/thư mục bị ảnh hưởng: `features/purchase-order-management/hooks`, `PurchaseOrdersTable`
- Thay đổi cụ thể: Tạo `usePurchaseOrderDetailQuery`, `useImportStockMapQuery`.
- Vì sao bước này an toàn: Chỉ đổi data source.
- Rủi ro có thể xảy ra: Modal import bị stale.
- Cách kiểm tra sau khi sửa: Mở detail và import dialog.
- Commit message gợi ý: `refactor(purchase-order-management): add po detail and import map queries`

### Bước 75. Mutation hóa approve/reject/cancel/pay/create-import cho PO

- Mục tiêu: Rút toàn bộ action khỏi `PurchaseOrdersTable`.
- File/thư mục bị ảnh hưởng: `features/purchase-order-management/hooks`, `PurchaseOrdersTable`
- Thay đổi cụ thể: Tạo các action mutation và invalidate tập trung.
- Vì sao bước này an toàn: Giữ UI cũ, chỉ đổi event handler.
- Rủi ro có thể xảy ra: Nhiều mutation trong một file dễ invalidate thiếu.
- Cách kiểm tra sau khi sửa: Duyệt, từ chối, hủy, thanh toán, tạo phiếu nhập.
- Commit message gợi ý: `refactor(purchase-order-management): move po actions to hooks`

### Bước 76. Query hóa danh sách import-receipts

- Mục tiêu: Bỏ fetch trong `ImportReceiptsPage`.
- File/thư mục bị ảnh hưởng: `features/import-receipt-management/hooks`, `ImportReceiptsPage`
- Thay đổi cụ thể: Tạo `useImportReceiptsQuery`.
- Vì sao bước này an toàn: Chỉ đổi nguồn data.
- Rủi ro có thể xảy ra: Loading shell thay đổi.
- Cách kiểm tra sau khi sửa: Mở page import receipts.
- Commit message gợi ý: `refactor(import-receipt-management): add import receipts query`

### Bước 77. Mutation hóa receive import-stock

- Mục tiêu: Rút `importStockService.receive` khỏi table.
- File/thư mục bị ảnh hưởng: `features/import-receipt-management/hooks`, `ImportReceiptsTable`
- Thay đổi cụ thể: Tạo `useReceiveImportStockMutation`.
- Vì sao bước này an toàn: Action đơn lẻ, dễ rollback.
- Rủi ro có thể xảy ra: Modal result stale hoặc invalidate thiếu detail.
- Cách kiểm tra sau khi sửa: Thực hiện nhập kho một phiếu và reload.
- Commit message gợi ý: `refactor(import-receipt-management): move receive import stock to mutation`

---

## Phase 5. Giảm lặp UI và logic

### Bước 78. Cắt import chéo `purchase-order -> promotions`

- Mục tiêu: Bỏ phụ thuộc sai boundary giữa feature.
- File/thư mục bị ảnh hưởng: `PurchaseOrdersPage`, `features/purchase-order-management/ui/*`
- Thay đổi cụ thể: Localize tab component hoặc tạo shared tab component trong đúng feature.
- Vì sao bước này an toàn: Không đổi business logic.
- Rủi ro có thể xảy ra: Label/count hiển thị lệch.
- Cách kiểm tra sau khi sửa: Mở `purchase-order` và kiểm tra tabs.
- Commit message gợi ý: `refactor(purchase-order-management): remove cross-feature tabs import`

### Bước 79. Extract shared `StatusTabs`

- Mục tiêu: Gom `PromotionTabs` và tabs của purchase-order về một presentational component chung.
- File/thư mục bị ảnh hưởng: `features/*/ui/shared/StatusTabs.tsx`, `promotion`, `purchase-order`
- Thay đổi cụ thể: Component nhận config tabs và counts.
- Vì sao bước này an toàn: Chỉ shared phần presentational.
- Rủi ro có thể xảy ra: Generic quá sớm.
- Cách kiểm tra sau khi sửa: Mở `promotions` và `purchase-order`.
- Commit message gợi ý: `refactor(shared-ui): extract status tabs`

### Bước 80. Extract shared `MultiSelectCombobox`

- Mục tiêu: Bỏ duplicate giữa admin và seller books.
- File/thư mục bị ảnh hưởng: `features/book-management/ui/shared`, các modal books theo role
- Thay đổi cụ thể: Move component chung và cập nhật import.
- Vì sao bước này an toàn: Hành vi gần như giống hệt.
- Rủi ro có thể xảy ra: DOM structure hoặc keyboard interaction thay đổi nhẹ.
- Cách kiểm tra sau khi sửa: Mở add/edit book ở admin và seller.
- Commit message gợi ý: `refactor(book-management): share multi select combobox`

### Bước 81. Extract `RoleDashboardLayout`

- Mục tiêu: Bỏ lặp layout shell 3 role.
- File/thư mục bị ảnh hưởng: `features/dashboard-shell/ui/RoleDashboardLayout.tsx`, 3 layout files theo role
- Thay đổi cụ thể: Layout cũ chỉ truyền `username`, `sidebar`, `children`.
- Vì sao bước này an toàn: Route path và layout tree giữ nguyên.
- Rủi ro có thể xảy ra: Hydration hoặc sidebar provider.
- Cách kiểm tra sau khi sửa: Mở dashboard của admin, seller, warehouse.
- Commit message gợi ý: `refactor(dashboard-shell): extract shared role layout`

### Bước 82. Extract shared sidebar renderer

- Mục tiêu: Bỏ lặp logic render menu/submenu.
- File/thư mục bị ảnh hưởng: `features/dashboard-shell/ui/RoleSidebar.tsx`, sidebar của 3 role
- Thay đổi cụ thể: Sidebar theo role chỉ còn data/config.
- Vì sao bước này an toàn: Data menu hiện tại giữ nguyên.
- Rủi ro có thể xảy ra: Active item hoặc expanded submenu khác hành vi cũ.
- Cách kiểm tra sau khi sửa: Click menu và submenu trên cả 3 role.
- Commit message gợi ý: `refactor(dashboard-shell): extract shared sidebar renderer`

### Bước 83. Chuẩn hóa typed sidebar config

- Mục tiêu: Thay object ad-hoc bằng type cấu hình chung.
- File/thư mục bị ảnh hưởng: `types/layouts/sidebar.type.ts`, data sidebar của các role
- Thay đổi cụ thể: Tạo type sidebar item/submenu và áp vào 3 role.
- Vì sao bước này an toàn: Chỉ tăng chặt chẽ type.
- Rủi ro có thể xảy ra: Type không cover hết trường hợp submenu.
- Cách kiểm tra sau khi sửa: `npm run lint`
- Commit message gợi ý: `refactor(dashboard-shell): normalize sidebar configs`

### Bước 84. Extract exact duplicate `ImportRequestsHeader`

- Mục tiêu: Gom duplicate admin/warehouse.
- File/thư mục bị ảnh hưởng: `features/import-request-management/ui/shared/ImportRequestsHeader.tsx`, import path tại admin/warehouse
- Thay đổi cụ thể: Move component chung, giữ props cũ.
- Vì sao bước này an toàn: File gần như identical.
- Rủi ro có thể xảy ra: Title/default prop khác nhẹ.
- Cách kiểm tra sau khi sửa: Mở import-requests ở admin và warehouse.
- Commit message gợi ý: `refactor(import-request-management): share import requests header`

### Bước 85. Extract exact duplicate `ReturnsHeader`

- Mục tiêu: Gom duplicate admin/seller.
- File/thư mục bị ảnh hưởng: `features/return-management/ui/shared/ReturnsHeader.tsx`, import path tại admin/seller
- Thay đổi cụ thể: Move component chung, giữ props hiện tại.
- Vì sao bước này an toàn: File gần như identical.
- Rủi ro có thể xảy ra: Placeholder hoặc filter defaults lệch.
- Cách kiểm tra sau khi sửa: Mở `returns` ở admin và seller.
- Commit message gợi ý: `refactor(return-management): share returns header`

### Bước 86. Extract low-risk shared helpers

- Mục tiêu: Gom helper thuần và UI nhỏ bị lặp.
- File/thư mục bị ảnh hưởng: `features/*/lib`, `components/ui`
- Thay đổi cụ thể: Tách `formatCurrency`, `formatDate`, loading/empty states, status badge helpers.
- Vì sao bước này an toàn: Pure function và presentational component.
- Rủi ro có thể xảy ra: Locale format thay đổi ngoài ý muốn.
- Cách kiểm tra sau khi sửa: Spot check books, orders, import, promotions.
- Commit message gợi ý: `refactor(shared-ui): extract low risk helpers`

---

## Phase 6. Tối ưu shared giữa các role

### Bước 87. So khớp `categories` admin/seller và chỉ shared phần presentational

- Mục tiêu: Share nơi thật sự an toàn, không gộp logic live/mock.
- File/thư mục bị ảnh hưởng: `features/category-management/ui/shared`
- Thay đổi cụ thể: Tách table row, modal shell hoặc form section nếu identical.
- Vì sao bước này an toàn: Container theo role vẫn tách riêng.
- Rủi ro có thể xảy ra: Lỡ kéo theo logic data vào shared layer.
- Cách kiểm tra sau khi sửa: Mở categories ở admin và seller.
- Commit message gợi ý: `refactor(category-management): share safe presentational parts`

### Bước 88. So khớp `books` admin/seller và chỉ shared phần presentational

- Mục tiêu: Tận dụng UI chung nhưng giữ data logic riêng.
- File/thư mục bị ảnh hưởng: `features/book-management/ui/shared`
- Thay đổi cụ thể: Shared field section, image picker, combobox, modal body nếu đủ giống.
- Vì sao bước này an toàn: Role container vẫn tự fetch/mutate.
- Rủi ro có thể xảy ra: Form props giữa 2 role khác nhiều hơn dự kiến.
- Cách kiểm tra sau khi sửa: Mở add/edit book ở admin và seller.
- Commit message gợi ý: `refactor(book-management): share safe presentational parts`

### Bước 89. So khớp `orders/promotions` admin/seller và shared phần badge/tab/cell

- Mục tiêu: Chỉ share những phần render thuần.
- File/thư mục bị ảnh hưởng: `features/order-management/ui/shared`, `features/promotion-management/ui/shared`
- Thay đổi cụ thể: Shared status badge, tab strip, cell renderers.
- Vì sao bước này an toàn: Action handler và data source vẫn theo role.
- Rủi ro có thể xảy ra: Status enum giữa mock và live không đồng nhất.
- Cách kiểm tra sau khi sửa: Mở orders/promotions ở cả admin và seller.
- Commit message gợi ý: `refactor(order-promotion): share safe presentation`

### Bước 90. So khớp `import-requests` admin/warehouse

- Mục tiêu: Shared table shell nếu contract đủ ổn.
- File/thư mục bị ảnh hưởng: `features/import-request-management/ui/shared`
- Thay đổi cụ thể: Tách common columns, detail dialog, giữ action config riêng theo role.
- Vì sao bước này an toàn: Chỉ shared render layer.
- Rủi ro có thể xảy ra: Action lifecycle giữa admin và warehouse khác nhau.
- Cách kiểm tra sau khi sửa: Mở import-requests ở cả admin và warehouse.
- Commit message gợi ý: `refactor(import-request-management): share safe table shell`

### Bước 91. So khớp `purchase-order` admin/warehouse

- Mục tiêu: Shared row/status/table shell nhưng không gộp data logic.
- File/thư mục bị ảnh hưởng: `features/purchase-order-management/ui/shared`
- Thay đổi cụ thể: Shared columns/status badges nếu shape đủ tương đồng.
- Vì sao bước này an toàn: Warehouse vẫn có thể giữ mock riêng.
- Rủi ro có thể xảy ra: Mock shape khác DTO thật.
- Cách kiểm tra sau khi sửa: Mở purchase-order ở admin và warehouse.
- Commit message gợi ý: `refactor(purchase-order-management): share safe presentation`

### Bước 92. Chốt defer list cho feature chưa nên refactor sâu

- Mục tiêu: Tránh gộp vội các feature contract còn mơ hồ.
- File/thư mục bị ảnh hưởng: `docs/refactor/contract-gaps.md`, `docs/refactor/migration-tracker.md`
- Thay đổi cụ thể: Đánh dấu `import-requests`, `returns`, `return-to-warehouse`, `warehouse import`, `warehouse purchase-order`, `customers metrics`, `bookService enrichment` là deferred.
- Vì sao bước này an toàn: Docs-only.
- Rủi ro có thể xảy ra: Deferred quá nhiều làm plan chậm.
- Cách kiểm tra sau khi sửa: Review lại tracker và trạng thái live/mock.
- Commit message gợi ý: `docs(refactor): freeze deferred feature list`

### Bước 93. Gỡ compat export tạm trong services

- Mục tiêu: Dọn nợ kỹ thuật sau khi migration import hoàn tất.
- File/thư mục bị ảnh hưởng: `services/*.service.ts`
- Thay đổi cụ thể: Bỏ re-export hoặc legacy type alias cũ.
- Vì sao bước này an toàn: Chỉ thực hiện sau khi grep sạch old path.
- Rủi ro có thể xảy ra: Còn import cũ bị sót.
- Cách kiểm tra sau khi sửa: `rg` old import path và chạy `npm run lint`
- Commit message gợi ý: `refactor(types): remove temporary legacy reexports`

### Bước 94. Kiểm tra cuối phase

- Mục tiêu: Tạo một checkpoint ổn định, rollback-friendly.
- File/thư mục bị ảnh hưởng: Toàn bộ repo liên quan
- Thay đổi cụ thể: Chạy lint, smoke test theo checklist, cập nhật tracker và ADR.
- Vì sao bước này an toàn: Không thêm logic mới.
- Rủi ro có thể xảy ra: Bỏ sót smoke case.
- Cách kiểm tra sau khi sửa: `npm run lint` + manual regression checklist.
- Commit message gợi ý: `chore(refactor): finalize dashboard migration checkpoint`

---

## Khu vực chưa nên refactor ngay

- `import-requests`
- `returns`
- `return-to-warehouse`
- `warehouse purchase-order`
- `warehouse import`
- `customers metrics`
- `bookService` enrichment chéo sang category/supplier

### Lý do

- Contract dữ liệu chưa rõ hoặc đang mock/static.
- Gộp sớm sẽ tạo shared abstraction sai và làm tăng rủi ro bug.
- Một số khu vực chỉ nên đụng tới sau khi nền tảng types/services/query đã ổn định.

---

## Kết luận

Refactor `admin/dashboard` không nên đi theo hướng đại phẫu một lần. Trình tự an toàn nhất là:

1. Chuẩn bị nền tảng tài liệu, naming, skeleton feature.
2. Tách type và chuẩn hóa service trước.
3. Chuyển data flow sang `useQuery` và `useMutation` theo từng feature nhỏ.
4. Chỉ shared UI hoặc logic khi đã xác nhận đủ tương đồng.
5. Những khu vực contract chưa rõ phải được đánh dấu defer rõ ràng thay vì cố gộp sớm.

Nếu cần, tài liệu này có thể tách tiếp thành:

- checklist triển khai theo tuần
- bộ issue Jira/Linear
- hoặc danh sách commit chi tiết theo từng feature

