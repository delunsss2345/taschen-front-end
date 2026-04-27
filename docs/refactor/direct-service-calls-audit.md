# Audit: Toàn Bộ Dự Án — UI Gọi Service Trực Tiếp

Scan toàn bộ project tìm `from '@/services/` trong UI layer (ngoài `services/` folder).

---

## Kết quả tổng quan

| Khu vực | Số file gọi service trực tiếp |
|---|---|
| `app/admin/dashboard/` | **29 files** |
| `app/seller/dashboard/` | **2 files** |
| `app/warehouse/` | 0 ✅ |
| `app/(store)/` (storefront) | 0 ✅ |
| `app/(auth)/` | 0 ✅ |
| `app/api/` | 2 files (chỉ import type `ApiResponseEnvelope` — hợp lệ) |
| `features/` | 0 ✅ |
| `components/` | 0 ✅ |
| `hooks/` | 0 ✅ |
| **Tổng cần refactor** | **31 files** |

> [!NOTE]
> Chỉ có **admin dashboard** và **seller dashboard books** là đang gọi service trực tiếp từ UI. Toàn bộ phần còn lại (store, auth, warehouse, components, features) đều sạch.

---

## Chi tiết: Admin Dashboard (29 files)

### 📚 Books — 3 files, 6 services

> [!CAUTION]
> Nghiêm trọng nhất — mỗi modal gọi 5-6 service khác nhau.

| File | Services | Read/Write |
|---|---|---|
| [AddBookModal.tsx](file:///e:/bookstore-ecommerce-frontend/app/admin/dashboard/books/_components/AddBookModal.tsx) | `bookService`, `categoryService`, `supplierService`, `uploadService`, `formatService` | R+W |
| [EditBookModal.tsx](file:///e:/bookstore-ecommerce-frontend/app/admin/dashboard/books/_components/EditBookModal.tsx) | `bookService`, `categoryService`, `supplierService`, `formatService`, `bookVariantService` | R+W |
| [BooksTable.tsx](file:///e:/bookstore-ecommerce-frontend/app/admin/dashboard/books/_components/BooksTable.tsx) | `bookService` | W |

---

### 🛒 Purchase Order — 3 files, 3 services

> [!WARNING]
> `PurchaseOrdersTable.tsx` gọi service 11 lần — 7 action khác nhau.

| File | Services | Read/Write |
|---|---|---|
| [PurchaseOrdersTable.tsx](file:///e:/bookstore-ecommerce-frontend/app/admin/dashboard/purchase-order/_components/PurchaseOrdersTable.tsx) | `purchaseOrderService`, `importStockService` | R+W |
| [PurchaseOrdersPage.tsx](file:///e:/bookstore-ecommerce-frontend/app/admin/dashboard/purchase-order/_components/PurchaseOrdersPage.tsx) | `purchaseOrderService` | R |
| [CreatePurchaseOrderModal.tsx](file:///e:/bookstore-ecommerce-frontend/app/admin/dashboard/purchase-order/_components/CreatePurchaseOrderModal.tsx) | `purchaseOrderService`, `supplierService`, `bookService` | R+W |

---

### 🏷️ Promotions — 3 files, 1 service

| File | Services | Read/Write |
|---|---|---|
| [AdminPromotionsPage.tsx](file:///e:/bookstore-ecommerce-frontend/app/admin/dashboard/promotions/_components/AdminPromotionsPage.tsx) | `promotionService` | R+W (approve, reject, pause, resume) |
| [CreatePromotionModal.tsx](file:///e:/bookstore-ecommerce-frontend/app/admin/dashboard/promotions/_components/CreatePromotionModal.tsx) | `promotionService` | W |
| [PromotionDetailModal.tsx](file:///e:/bookstore-ecommerce-frontend/app/admin/dashboard/promotions/_components/PromotionDetailModal.tsx) | `promotionService` | R |

---

### 📦 Orders — 3 files, 1 service

| File | Services | Read/Write |
|---|---|---|
| [AdminOrdersPage.tsx](file:///e:/bookstore-ecommerce-frontend/app/admin/dashboard/orders/_components/AdminOrdersPage.tsx) | `orderService` | R |
| [OrderTable.tsx](file:///e:/bookstore-ecommerce-frontend/app/admin/dashboard/orders/_components/OrderTable.tsx) | `orderService` | W |
| [OrderDetailModal.tsx](file:///e:/bookstore-ecommerce-frontend/app/admin/dashboard/orders/_components/OrderDetailModal.tsx) | `orderService` | R |

---

### 📁 Categories — 3 files, 1 service

| File | Services | Read/Write |
|---|---|---|
| [AdminCategoriesPage.tsx](file:///e:/bookstore-ecommerce-frontend/app/admin/dashboard/categories/_components/AdminCategoriesPage.tsx) | `categoryService` | R |
| [CategoryTable.tsx](file:///e:/bookstore-ecommerce-frontend/app/admin/dashboard/categories/_components/CategoryTable.tsx) | `categoryService` | W |
| [CategoryHeader.tsx](file:///e:/bookstore-ecommerce-frontend/app/admin/dashboard/categories/_components/CategoryHeader.tsx) | `categoryService` | W |

---

### 🚚 Suppliers — 3 files, 1 service

| File | Services | Read/Write |
|---|---|---|
| [AdminSuppliersPage.tsx](file:///e:/bookstore-ecommerce-frontend/app/admin/dashboard/suppliers/_components/AdminSuppliersPage.tsx) | `supplierService` | R |
| [SupplierTable.tsx](file:///e:/bookstore-ecommerce-frontend/app/admin/dashboard/suppliers/_components/SupplierTable.tsx) | `supplierService` | W |
| [SupplierHeader.tsx](file:///e:/bookstore-ecommerce-frontend/app/admin/dashboard/suppliers/_components/SupplierHeader.tsx) | `supplierService` | W |

---

### 👤 Accounts — 3 files, 1 service

| File | Services | Read/Write |
|---|---|---|
| [AdminAccountsPage.tsx](file:///e:/bookstore-ecommerce-frontend/app/admin/dashboard/accounts/_components/AdminAccountsPage.tsx) | `userService` | R |
| [AccountTable.tsx](file:///e:/bookstore-ecommerce-frontend/app/admin/dashboard/accounts/_components/AccountTable.tsx) | `userService` | W |
| [AccountHeader.tsx](file:///e:/bookstore-ecommerce-frontend/app/admin/dashboard/accounts/_components/AccountHeader.tsx) | `userService` | W |

---

### 📥 Import Receipts — 2 files, 1 service

| File | Services | Read/Write |
|---|---|---|
| [ImportReceiptsPage.tsx](file:///e:/bookstore-ecommerce-frontend/app/admin/dashboard/import/_components/ImportReceiptsPage.tsx) | `importStockService` | R |
| [ImportReceiptsTable.tsx](file:///e:/bookstore-ecommerce-frontend/app/admin/dashboard/import/_components/ImportReceiptsTable.tsx) | `importStockService` | W |

---

### 👥 Customers — 1 file, 1 service

| File | Services | Read/Write |
|---|---|---|
| [CustomersPage.tsx](file:///e:/bookstore-ecommerce-frontend/app/admin/dashboard/customers/_components/CustomersPage.tsx) | `userService` | R |

---

### 📦 Batch — 3 files, 4 services

| File | Services | Read/Write |
|---|---|---|
| [BatchPage.tsx](file:///e:/bookstore-ecommerce-frontend/app/admin/dashboard/batch/_components/BatchPage.tsx) | `batchService` | R |
| [BatchTable.tsx](file:///e:/bookstore-ecommerce-frontend/app/admin/dashboard/batch/_components/BatchTable.tsx) | `batchService` (type only) | — |
| [AddBatchDialog.tsx](file:///e:/bookstore-ecommerce-frontend/app/admin/dashboard/batch/_components/AddBatchDialog.tsx) | `batchService`, `bookService`, `bookVariantService`, `supplierService` | R+W |

---

## Chi tiết: Seller Dashboard (2 files)

| File | Services | Read/Write |
|---|---|---|
| [AddBookModal.tsx](file:///e:/bookstore-ecommerce-frontend/app/seller/dashboard/books/_components/AddBookModal.tsx) | `formatService` | R |
| [EditBookModal.tsx](file:///e:/bookstore-ecommerce-frontend/app/seller/dashboard/books/_components/EditBookModal.tsx) | `formatService` | R |

---

## Features Đã Có Hooks

| Feature | Đường dẫn | Trạng thái |
|---|---|---|
| `format` | [features/format/](file:///e:/bookstore-ecommerce-frontend/features/format) | Hooks + selectors + store ✅ |
| `book` | [features/book/](file:///e:/bookstore-ecommerce-frontend/features/book) | Hooks + selectors + store (chưa wire vào UI) |
| `book-variant` | [features/book-variant/](file:///e:/bookstore-ecommerce-frontend/features/book-variant) | Hooks |

> [!IMPORTANT]
> `features/` hiện **KHÔNG** import `@/services/` — các hooks đang gọi API routes trực tiếp. Đây là pattern đúng: `UI → features/hooks → API routes`.

---

## Tổng hợp: Services bị gọi trực tiếp từ UI

| Service | Số files | Khu vực dùng |
|---|---|---|
| `supplierService` | 5 | suppliers, books, purchase-order, batch |
| `bookService` | 5 | books, purchase-order, batch |
| `userService` | 4 | accounts, customers |
| `categoryService` | 4 | categories, books |
| `formatService` | 4 | books (admin + seller) |
| `promotionService` | 3 | promotions |
| `purchaseOrderService` | 3 | purchase-order |
| `orderService` | 3 | orders |
| `importStockService` | 3 | import, purchase-order |
| `batchService` | 3 | batch |
| `bookVariantService` | 2 | books, batch |
| `uploadService` | 1 | books |
