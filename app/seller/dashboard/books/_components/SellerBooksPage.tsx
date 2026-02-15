import { BooksHeader } from './BooksHeader'
import { BooksTable } from './BooksTable'

const mockBooks = [
  {
    id: 1,
    image:
      'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327881099i/3735293.jpg',
    title: 'Thư vào Nam',
    author: 'Lê Duẩn',
    price: 150000,
    quantity: 44,
    category: 'Quân sự',
  },
  {
    id: 2,
    image: 'https://sachhoc.com/wp-content/uploads/2019/06/do-re-mon.jpg',
    title: 'Đô rê mon',
    author: 'Tao',
    price: 700000,
    quantity: 0,
    category: 'Truyện tranh, Tiểu thuyết',
  },
  {
    id: 3,
    image:
      'https://salt.tikicdn.com/media/catalog/product/i/m/img320.u5472.d20170626.t162430.847967.jpg',
    title: 'Kính nhu hoa',
    author: 'Taoo',
    price: 36000,
    quantity: 12,
    category: 'Tiểu thuyết, Văn học',
  },
  {
    id: 4,
    image:
      'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1451442515i/3144900.jpg',
    title: 'Nhà Giả Kim (Tái bản 2025)',
    author: 'Paulo Coelho',
    price: 85000,
    quantity: 33,
    category: 'Tiểu thuyết, Văn học',
  },
]

export function SellerBooksPage() {
  return (
    <div className="space-y-4">
      <BooksHeader />
      <BooksTable books={mockBooks} />
    </div>
  )
}
