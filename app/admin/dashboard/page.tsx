import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { KineticStyles, adminKineticVars } from './_components/KineticStyles'
import {
  ArrowDownRight,
  ArrowUpRight,
  BookMarked,
  BookOpen,
  CalendarDays,
  Download,
  Layers3,
  PackageCheck,
  ReceiptText,
  Search,
  ShoppingBag,
  Sparkles,
  TicketPercent,
  TriangleAlert,
  Truck,
  UsersRound,
} from 'lucide-react'

const metrics = [
  {
    label: 'Doanh thu hôm nay',
    value: '128.4tr',
    detail: '+18.2% so với hôm qua',
    icon: ReceiptText,
    tone: 'green',
    trend: 'up',
  },
  {
    label: 'Đơn hàng mới',
    value: '342',
    detail: '56 đơn chờ xác nhận',
    icon: ShoppingBag,
    tone: 'blue',
    trend: 'up',
  },
  {
    label: 'Sách đã bán',
    value: '1,284',
    detail: 'Top: Atomic Habits',
    icon: BookOpen,
    tone: 'gold',
    trend: 'up',
  },
  {
    label: 'Hoàn đổi',
    value: '12',
    detail: '-7.1% trong tuần',
    icon: TriangleAlert,
    tone: 'coral',
    trend: 'down',
  },
]

const salesByDay = [
  { day: 'T2', value: 52, orders: 196 },
  { day: 'T3', value: 68, orders: 240 },
  { day: 'T4', value: 47, orders: 172 },
  { day: 'T5', value: 81, orders: 302 },
  { day: 'T6', value: 76, orders: 288 },
  { day: 'T7', value: 94, orders: 356 },
  { day: 'CN', value: 71, orders: 264 },
]

const topBooks = [
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    sold: '428 bản',
    revenue: '38.2tr',
    color: 'bg-[var(--dash-green)]',
  },
  {
    title: 'Cây Cam Ngọt Của Tôi',
    author: 'Jose Mauro de Vasconcelos',
    sold: '316 bản',
    revenue: '24.8tr',
    color: 'bg-[var(--dash-coral)]',
  },
  {
    title: 'Nhà Giả Kim',
    author: 'Paulo Coelho',
    sold: '294 bản',
    revenue: '20.6tr',
    color: 'bg-[var(--dash-gold)]',
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    sold: '188 bản',
    revenue: '18.1tr',
    color: 'bg-[var(--dash-blue)]',
  },
]

const stockAlerts = [
  { name: 'Văn học Việt Nam', count: 18, status: 'Cần nhập thêm', level: 78 },
  { name: 'Thiếu nhi', count: 11, status: 'Sắp hết hàng', level: 62 },
  { name: 'Kinh tế', count: 7, status: 'Đang chờ NCC', level: 44 },
]

const orderFlow = [
  { label: 'Đã thanh toán', value: 186, icon: PackageCheck },
  { label: 'Đang đóng gói', value: 74, icon: Layers3 },
  { label: 'Đang giao', value: 58, icon: Truck },
  { label: 'Áp mã giảm giá', value: 129, icon: TicketPercent },
]

const activities = [
  {
    time: '09:20',
    title: 'Duyệt 24 đơn COD',
    note: 'Khu vực Hà Nội và TP.HCM tăng mạnh sau chiến dịch flash sale.',
  },
  {
    time: '10:45',
    title: 'Nhập kho 680 bản mới',
    note: '3 lô từ Alpha Books đã được đối soát và chuyển vào kệ A12.',
  },
  {
    time: '13:10',
    title: 'Banner tuần lễ sách hè',
    note: 'CTR dự kiến cao hơn 11% nhờ nhóm sách thiếu nhi và kỹ năng.',
  },
]

const readerSegments = [
  { label: 'Khách quay lại', value: 46, color: 'bg-[var(--dash-green)]' },
  { label: 'Khách mới', value: 34, color: 'bg-[var(--dash-blue)]' },
  { label: 'Thành viên VIP', value: 20, color: 'bg-[var(--dash-coral)]' },
]

const heroBooks = [
  { color: 'bg-[var(--dash-coral)]', height: 'h-24', tilt: '-6deg', delay: '0ms' },
  { color: 'bg-[var(--dash-gold)]', height: 'h-32', tilt: '4deg', delay: '180ms' },
  { color: 'bg-[var(--dash-green)]', height: 'h-28', tilt: '-3deg', delay: '320ms' },
  { color: 'bg-[var(--dash-blue)]', height: 'h-36', tilt: '6deg', delay: '460ms' },
  { color: 'bg-[var(--dash-plum)]', height: 'h-24', tilt: '-5deg', delay: '620ms' },
]

const tickerItems = [
  'Flash sale 20:00: +42 đơn trong 15 phút',
  'Thiếu nhi: tăng 28%',
  'Kệ A12 vừa nhập 680 bản',
  'Atomic Habits giữ top 1',
  'Tỉ lệ giao thành công 96.4%',
]

const toneMap = {
  green: {
    icon: 'bg-[var(--dash-green-soft)] text-[var(--dash-green)]',
    edge: 'border-l-[color:var(--dash-green)]',
  },
  blue: {
    icon: 'bg-[var(--dash-blue-soft)] text-[var(--dash-blue)]',
    edge: 'border-l-[color:var(--dash-blue)]',
  },
  gold: {
    icon: 'bg-[var(--dash-gold-soft)] text-[var(--dash-gold)]',
    edge: 'border-l-[color:var(--dash-gold)]',
  },
  coral: {
    icon: 'bg-[var(--dash-coral-soft)] text-[var(--dash-coral)]',
    edge: 'border-l-[color:var(--dash-coral)]',
  },
}

type Tone = keyof typeof toneMap

export default function Page() {
  return (
    <main
      style={adminKineticVars}
      className="kinetic-ambient -m-6 min-h-[calc(100vh-7rem)] overflow-hidden bg-[var(--dash-canvas)] text-[var(--dash-ink)] [font-family:var(--dash-sans)]"
    >
      <KineticStyles />
      <div className="relative isolate">
        <div className="absolute inset-x-0 top-0 -z-10 h-72 border-b border-[var(--dash-line)] bg-[linear-gradient(135deg,var(--dash-paper)_0%,var(--dash-paper-strong)_58%,#e6efe5_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,rgba(23,19,15,0.09)_1px,transparent_0)] bg-[length:22px_22px] opacity-35" />

        <section className="px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 border border-[var(--dash-line)] bg-white/60 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--dash-muted)]">
                <BookMarked className="kinetic-pulse h-3.5 w-3.5 rounded-full text-[var(--dash-green)]" />
                Bookstore command room
              </div>
              <h1 className="kinetic-gradient-text [font-family:var(--dash-display)] text-4xl font-semibold leading-none tracking-normal sm:text-5xl">
                Dashboard nhà sách
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--dash-muted)] sm:text-base">
                Theo dõi doanh thu, đơn hàng, tồn kho và nhịp bán chạy trong ngày trên một mặt điều hành gọn, rõ và đẹp.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex h-10 items-center gap-2 border border-[var(--dash-line)] bg-white/70 px-3 text-sm text-[var(--dash-muted)]">
                <Search className="h-4 w-4" />
                <span>Tìm sách, đơn hàng, ISBN...</span>
              </div>
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 bg-[var(--dash-ink)] px-4 text-sm font-semibold text-white transition hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-coral)] focus-visible:ring-offset-2"
              >
                <Download className="h-4 w-4" />
                Xuất báo cáo
              </button>
            </div>
          </div>
        </section>

        <section className="px-4 pb-5 sm:px-6 lg:px-8">
          <div className="overflow-hidden border-y border-[var(--dash-ink)] bg-[var(--dash-ink)] py-2 text-white">
            <div className="kinetic-marquee gap-8 whitespace-nowrap text-xs font-black uppercase tracking-[0.18em]">
              {[...tickerItems, ...tickerItems].map((item, index) => (
                <span key={`${item}-${index}`} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--dash-coral)]" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 px-4 pb-5 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="kinetic-hero kinetic-shine kinetic-scan relative overflow-hidden border border-[var(--dash-ink)] bg-[var(--dash-ink)] p-5 text-white shadow-[12px_12px_0_rgba(23,19,15,0.12)] sm:p-6">
            <div className="kinetic-orbit absolute right-5 top-5 hidden h-28 w-28 border border-white/15 sm:block" />
            <div className="pointer-events-none absolute bottom-0 right-8 hidden items-end gap-2 opacity-80 xl:flex">
              {heroBooks.map((book) => (
                <div
                  key={`${book.color}-${book.delay}`}
                  className={`kinetic-book w-8 border border-white/20 ${book.height} ${book.color}`}
                  style={{ '--tilt': book.tilt, '--delay': book.delay } as CSSProperties}
                >
                  <div className="mx-auto mt-3 h-12 w-px bg-white/45" />
                </div>
              ))}
            </div>
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--dash-ink)]">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--dash-coral)]" />
                  Bản tin vận hành
                </div>
                <p className="text-sm text-white/65">Tổng doanh thu tháng 05</p>
                <div className="mt-2 [font-family:var(--dash-display)] text-5xl font-semibold leading-none sm:text-7xl">
                  2.84 tỷ
                </div>
                <p className="mt-4 max-w-xl text-sm leading-6 text-white/70">
                  Sách kỹ năng và thiếu nhi đang kéo tăng trưởng. Ưu tiên nhập thêm 3 nhóm kệ đang dưới ngưỡng an toàn.
                </p>
              </div>
              <div className="grid min-w-56 grid-cols-2 gap-3 text-sm sm:grid-cols-3 lg:grid-cols-1">
                <HeroChip label="Tỉ lệ chốt" value="68%" />
                <HeroChip label="AOV" value="374k" />
                <HeroChip label="Đơn giờ cao điểm" value="42" />
              </div>
            </div>
          </div>

          <div className="kinetic-panel border border-[var(--dash-line)] bg-white p-5 shadow-[8px_8px_0_rgba(184,128,33,0.14)]" style={{ '--delay': '120ms' } as CSSProperties}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--dash-muted)]">
                  Mục tiêu tháng
                </p>
                <h2 className="mt-2 [font-family:var(--dash-display)] text-3xl font-semibold">
                  82% hoàn thành
                </h2>
              </div>
              <CalendarDays className="h-9 w-9 text-[var(--dash-coral)]" />
            </div>
            <div className="mt-6 h-3 overflow-hidden bg-[var(--dash-canvas)]">
              <div className="kinetic-width h-full w-[82%] bg-[linear-gradient(90deg,var(--dash-green),var(--dash-gold),var(--dash-coral))]" />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {readerSegments.map((segment) => (
                <div key={segment.label} className="kinetic-item border border-[var(--dash-line)] p-3">
                  <div className={`mb-3 h-1.5 w-full ${segment.color}`} />
                  <div className="text-2xl font-black">{segment.value}%</div>
                  <p className="mt-1 text-xs leading-4 text-[var(--dash-muted)]">{segment.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-3 px-4 pb-5 sm:grid-cols-2 sm:px-6 xl:grid-cols-4 lg:px-8">
          {metrics.map((metric, index) => (
            <MetricCard key={metric.label} metric={metric} index={index} />
          ))}
        </section>

        <section className="grid gap-4 px-4 pb-8 sm:px-6 xl:grid-cols-[1.25fr_0.75fr] lg:px-8">
          <div className="grid gap-4">
            <Panel
              eyebrow="Doanh thu tuần"
              title="Nhịp bán theo ngày"
              action={
                <Link
                  href="/admin/dashboard/orders"
                  className="inline-flex items-center gap-1 text-sm font-bold text-[var(--dash-green)]"
                >
                  Xem đơn
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              }
            >
              <div className="mt-5 h-72 border border-[var(--dash-line)] bg-[var(--dash-paper)] p-4">
                <div className="flex h-full items-end gap-2 sm:gap-4">
                  {salesByDay.map((item, index) => (
                    <div key={item.day} className="flex h-full flex-1 flex-col justify-end gap-3">
                      <div className="relative flex flex-1 items-end border-b border-[var(--dash-line)]">
                        <div
                          className="kinetic-bar w-full bg-[var(--dash-green)] transition-[height] duration-500"
                          style={{ height: `${item.value}%`, '--delay': `${140 + index * 80}ms` } as CSSProperties}
                        >
                          <span className="sr-only">
                            {item.day}: {item.orders} đơn hàng
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-black text-[var(--dash-ink)]">{item.day}</div>
                        <div className="mt-1 text-[11px] text-[var(--dash-muted)]">{item.orders}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>

            <div className="grid gap-4 lg:grid-cols-2">
              <Panel eyebrow="Đơn hàng" title="Luồng xử lý hôm nay">
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {orderFlow.map((item) => {
                    const Icon = item.icon

                    return (
                      <div key={item.label} className="kinetic-item border border-[var(--dash-line)] bg-white p-4">
                        <Icon className="h-5 w-5 text-[var(--dash-coral)]" />
                        <div className="mt-4 text-3xl font-black">{item.value}</div>
                        <p className="mt-1 text-sm text-[var(--dash-muted)]">{item.label}</p>
                      </div>
                    )
                  })}
                </div>
              </Panel>

              <Panel eyebrow="Khách hàng" title="Tệp độc giả nổi bật">
                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between border border-[var(--dash-line)] bg-[var(--dash-paper)] p-4">
                    <div>
                      <p className="text-sm font-bold">Hội viên tháng này</p>
                      <p className="mt-1 text-sm text-[var(--dash-muted)]">1,928 người đang hoạt động</p>
                    </div>
                    <UsersRound className="h-8 w-8 text-[var(--dash-blue)]" />
                  </div>
                  {readerSegments.map((segment) => (
                    <div key={segment.label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-[var(--dash-muted)]">{segment.label}</span>
                        <span className="font-black">{segment.value}%</span>
                      </div>
                      <div className="h-2 bg-[var(--dash-canvas)]">
                        <div className={`kinetic-width h-full ${segment.color}`} style={{ width: `${segment.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          </div>

          <div className="grid gap-4">
            <Panel eyebrow="Best sellers" title="Top sách bán chạy">
              <div className="mt-5 space-y-3">
                {topBooks.map((book, index) => (
                  <div key={book.title} className="kinetic-item grid grid-cols-[auto_1fr_auto] gap-3 border border-[var(--dash-line)] bg-white p-3">
                    <div className={`h-full w-1.5 ${book.color}`} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[var(--dash-muted)]">0{index + 1}</span>
                        <h3 className="truncate text-sm font-black">{book.title}</h3>
                      </div>
                      <p className="mt-1 truncate text-xs text-[var(--dash-muted)]">{book.author}</p>
                      <p className="mt-3 text-xs font-bold text-[var(--dash-green)]">{book.sold}</p>
                    </div>
                    <div className="text-right text-sm font-black">{book.revenue}</div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel eyebrow="Tồn kho" title="Cảnh báo kệ sách">
              <div className="mt-5 space-y-4">
                {stockAlerts.map((item) => (
                  <div key={item.name}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-black">{item.name}</p>
                        <p className="mt-1 text-xs text-[var(--dash-muted)]">{item.status}</p>
                      </div>
                      <span className="bg-[var(--dash-coral-soft)] px-2 py-1 text-xs font-black text-[var(--dash-coral)]">
                        {item.count} SKU
                      </span>
                    </div>
                    <div className="mt-3 h-2 bg-[var(--dash-canvas)]">
                      <div className="kinetic-width h-full bg-[var(--dash-coral)]" style={{ width: `${item.level}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel eyebrow="Timeline" title="Hoạt động mới">
              <div className="mt-5 space-y-4">
                {activities.map((activity) => (
                  <div key={activity.time} className="grid grid-cols-[3.5rem_1fr] gap-3">
                    <div className="border-r border-[var(--dash-line)] pr-3 text-xs font-black text-[var(--dash-coral)]">
                      {activity.time}
                    </div>
                    <div>
                      <p className="text-sm font-black">{activity.title}</p>
                      <p className="mt-1 text-sm leading-5 text-[var(--dash-muted)]">{activity.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </section>
      </div>
    </main>
  )
}

function HeroChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="kinetic-item border border-white/15 bg-white/[0.08] p-3">
      <p className="text-xs text-white/55">{label}</p>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </div>
  )
}

function MetricCard({
  metric,
  index,
}: {
  metric: (typeof metrics)[number]
  index: number
}) {
  const Icon = metric.icon
  const TrendIcon = metric.trend === 'up' ? ArrowUpRight : ArrowDownRight
  const tone = toneMap[metric.tone as Tone]

  return (
    <article
      className={`kinetic-item border border-l-4 border-[var(--dash-line)] bg-white p-4 shadow-[4px_4px_0_rgba(23,19,15,0.06)] ${tone.edge}`}
      style={{ '--delay': `${220 + index * 90}ms` } as CSSProperties}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-10 w-10 items-center justify-center ${tone.icon}`}>
          <Icon className="h-5 w-5" />
        </div>
        <TrendIcon className="h-5 w-5 text-[var(--dash-muted)]" />
      </div>
      <p className="mt-5 text-sm font-semibold text-[var(--dash-muted)]">{metric.label}</p>
      <div className="mt-2 text-3xl font-black tracking-normal">{metric.value}</div>
      <p className="mt-2 text-sm text-[var(--dash-muted)]">{metric.detail}</p>
    </article>
  )
}

function Panel({
  eyebrow,
  title,
  action,
  children,
}: {
  eyebrow: string
  title: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="kinetic-panel border border-[var(--dash-line)] bg-white p-5 shadow-[6px_6px_0_rgba(23,19,15,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--dash-muted)]">{eyebrow}</p>
          <h2 className="mt-2 [font-family:var(--dash-display)] text-2xl font-semibold leading-tight text-[var(--dash-ink)]">
            {title}
          </h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
