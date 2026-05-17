import type { CSSProperties, ReactNode } from 'react'
import {
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  Download,
  Gauge,
  Layers3,
  PieChart,
  ReceiptText,
  ShoppingBag,
  Sparkles,
  TicketPercent,
  TrendingUp,
  Truck,
  UsersRound,
  Warehouse,
} from 'lucide-react'
import { KineticStyles, adminKineticVars } from '../_components/KineticStyles'

const reportKpis = [
  {
    label: 'Doanh thu thuần',
    value: '8.72 tỷ',
    detail: '+24.8% so với kỳ trước',
    icon: ReceiptText,
    tone: 'bg-[var(--dash-green-soft)] text-[var(--dash-green)]',
  },
  {
    label: 'Biên lợi nhuận',
    value: '31.4%',
    detail: 'Sách kỹ năng đang dẫn biên',
    icon: Gauge,
    tone: 'bg-[var(--dash-gold-soft)] text-[var(--dash-gold)]',
  },
  {
    label: 'Đơn hoàn tất',
    value: '14,280',
    detail: '96.4% giao thành công',
    icon: ShoppingBag,
    tone: 'bg-[var(--dash-blue-soft)] text-[var(--dash-blue)]',
  },
  {
    label: 'Mã giảm giá',
    value: '2,914',
    detail: 'CTR chiến dịch: 8.9%',
    icon: TicketPercent,
    tone: 'bg-[var(--dash-coral-soft)] text-[var(--dash-coral)]',
  },
]

const monthlyRevenue = [
  { month: 'T1', value: 42, revenue: '4.2 tỷ' },
  { month: 'T2', value: 48, revenue: '4.8 tỷ' },
  { month: 'T3', value: 61, revenue: '6.1 tỷ' },
  { month: 'T4', value: 58, revenue: '5.8 tỷ' },
  { month: 'T5', value: 72, revenue: '7.2 tỷ' },
  { month: 'T6', value: 81, revenue: '8.1 tỷ' },
  { month: 'T7', value: 76, revenue: '7.6 tỷ' },
  { month: 'T8', value: 88, revenue: '8.8 tỷ' },
  { month: 'T9', value: 94, revenue: '9.4 tỷ' },
  { month: 'T10', value: 86, revenue: '8.6 tỷ' },
  { month: 'T11', value: 91, revenue: '9.1 tỷ' },
  { month: 'T12', value: 98, revenue: '9.8 tỷ' },
]

const categoryMix = [
  { label: 'Kỹ năng', value: 32, color: 'bg-[var(--dash-green)]' },
  { label: 'Thiếu nhi', value: 24, color: 'bg-[var(--dash-coral)]' },
  { label: 'Văn học', value: 21, color: 'bg-[var(--dash-blue)]' },
  { label: 'Kinh tế', value: 15, color: 'bg-[var(--dash-gold)]' },
  { label: 'Khác', value: 8, color: 'bg-[var(--dash-plum)]' },
]

const channelReports = [
  { label: 'Website', value: '5.12 tỷ', share: 58, icon: BarChart3 },
  { label: 'Mobile web', value: '2.04 tỷ', share: 23, icon: UsersRound },
  { label: 'Affiliate', value: '1.01 tỷ', share: 12, icon: ArrowUpRight },
  { label: 'B2B/Gift', value: '0.55 tỷ', share: 7, icon: Layers3 },
]

const operations = [
  { label: 'Đơn chờ xác nhận', value: 74, icon: ShoppingBag },
  { label: 'Đang đóng gói', value: 126, icon: Warehouse },
  { label: 'Đang giao', value: 312, icon: Truck },
  { label: 'Sách bán chạy', value: 38, icon: BookOpen },
]

const heatmap = [
  [2, 3, 4, 5, 4, 6, 7],
  [3, 5, 6, 4, 7, 8, 9],
  [4, 6, 5, 7, 8, 9, 8],
  [5, 7, 8, 9, 7, 6, 5],
]

const cohorts = [
  { segment: 'Khách mới', orders: '4,820', retention: '34%', revenue: '1.92 tỷ' },
  { segment: 'Khách quay lại', orders: '6,184', retention: '58%', revenue: '3.74 tỷ' },
  { segment: 'VIP Reader', orders: '2,031', retention: '72%', revenue: '2.16 tỷ' },
  { segment: 'Doanh nghiệp', orders: '388', retention: '41%', revenue: '0.90 tỷ' },
]

const reportTicker = [
  'GMV tháng này vượt mục tiêu 18%',
  'Sách kỹ năng giữ biên 36%',
  'Chi phí mã giảm giá giảm 4.2%',
  'Tỉ lệ giao thành công 96.4%',
  'Khách quay lại chiếm 58% doanh thu',
]

export default function ReportsPage() {
  return (
    <main
      style={adminKineticVars}
      className="kinetic-ambient -m-6 min-h-[calc(100vh-7rem)] overflow-hidden bg-[var(--dash-canvas)] text-[var(--dash-ink)] [font-family:var(--dash-sans)]"
    >
      <KineticStyles />

      <section className="px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 border border-[var(--dash-line)] bg-white/60 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[var(--dash-muted)]">
              <Sparkles className="kinetic-pulse h-3.5 w-3.5 rounded-full text-[var(--dash-coral)]" />
              Reports cockpit
            </div>
            <h1 className="kinetic-gradient-text [font-family:var(--dash-display)] text-4xl font-semibold leading-none tracking-normal sm:text-5xl">
              Báo cáo bán sách
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--dash-muted)] sm:text-base">
              Mock báo cáo tổng hợp cho doanh thu, danh mục, kênh bán và vận hành kho trong một giao diện giàu chuyển động.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 border border-[var(--dash-line)] bg-white/70 px-4 text-sm font-bold text-[var(--dash-ink)] transition hover:bg-white"
            >
              <CalendarDays className="h-4 w-4 text-[var(--dash-blue)]" />
              Tháng 05/2026
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 bg-[var(--dash-ink)] px-4 text-sm font-semibold text-white transition hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-coral)] focus-visible:ring-offset-2"
            >
              <Download className="h-4 w-4" />
              Tải báo cáo
            </button>
          </div>
        </div>
      </section>

      <section className="px-4 pb-5 sm:px-6 lg:px-8">
        <div className="overflow-hidden border-y border-[var(--dash-ink)] bg-[var(--dash-ink)] py-2 text-white">
          <div className="kinetic-marquee gap-8 whitespace-nowrap text-xs font-black uppercase tracking-[0.18em]">
            {[...reportTicker, ...reportTicker].map((item, index) => (
              <span key={`${item}-${index}`} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--dash-gold)]" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 px-4 pb-5 sm:px-6 xl:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <div className="kinetic-hero kinetic-shine kinetic-scan relative overflow-hidden border border-[var(--dash-ink)] bg-[var(--dash-ink)] p-5 text-white shadow-[12px_12px_0_rgba(23,19,15,0.12)] sm:p-6">
          <div className="absolute right-8 top-8 h-40 w-40 rounded-full border border-white/10">
            <div className="kinetic-orbit absolute inset-3 rounded-full border border-dashed border-white/20" />
            <div className="absolute inset-10 rounded-full bg-[rgba(217,95,67,0.25)] blur-xl" />
          </div>
          <div className="relative max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[var(--dash-ink)]">
              <TrendingUp className="h-3.5 w-3.5 text-[var(--dash-green)]" />
              Executive snapshot
            </div>
            <p className="text-sm text-white/65">GMV sau chiết khấu</p>
            <div className="mt-2 [font-family:var(--dash-display)] text-5xl font-semibold leading-none sm:text-7xl">
              8.72 tỷ
            </div>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/70">
              Doanh thu tăng nhờ nhóm sách kỹ năng, thiếu nhi và combo quà tặng. Website vẫn là kênh kéo doanh thu chính.
            </p>
          </div>
        </div>

        <div className="kinetic-panel border border-[var(--dash-line)] bg-white p-5 shadow-[8px_8px_0_rgba(31,107,76,0.12)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--dash-muted)]">Tốc độ tăng trưởng</p>
              <h2 className="mt-2 [font-family:var(--dash-display)] text-3xl font-semibold">Bứt tốc 24.8%</h2>
            </div>
            <PieChart className="h-9 w-9 text-[var(--dash-coral)]" />
          </div>
          <div className="mt-6 space-y-4">
            {categoryMix.slice(0, 4).map((item, index) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-bold">{item.label}</span>
                  <span className="text-[var(--dash-muted)]">{item.value}%</span>
                </div>
                <div className="h-2 bg-[var(--dash-canvas)]">
                  <div
                    className={`kinetic-width h-full ${item.color}`}
                    style={{ width: `${item.value * 2}%`, '--delay': `${index * 90}ms` } as CSSProperties}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-3 px-4 pb-5 sm:grid-cols-2 sm:px-6 xl:grid-cols-4 lg:px-8">
        {reportKpis.map((item, index) => {
          const Icon = item.icon

          return (
            <article
              key={item.label}
              className="kinetic-item border border-[var(--dash-line)] bg-white p-4 shadow-[4px_4px_0_rgba(23,19,15,0.06)]"
              style={{ '--delay': `${160 + index * 90}ms` } as CSSProperties}
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`flex h-10 w-10 items-center justify-center ${item.tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-[var(--dash-muted)]" />
              </div>
              <p className="mt-5 text-sm font-semibold text-[var(--dash-muted)]">{item.label}</p>
              <div className="mt-2 text-3xl font-black tracking-normal">{item.value}</div>
              <p className="mt-2 text-sm text-[var(--dash-muted)]">{item.detail}</p>
            </article>
          )
        })}
      </section>

      <section className="grid gap-4 px-4 pb-8 sm:px-6 xl:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="grid gap-4">
          <ReportPanel eyebrow="Revenue" title="Doanh thu 12 tháng">
            <div className="mt-5 h-80 border border-[var(--dash-line)] bg-[var(--dash-paper)] p-4">
              <div className="flex h-full items-end gap-2 sm:gap-3">
                {monthlyRevenue.map((item, index) => (
                  <div key={item.month} className="flex h-full flex-1 flex-col justify-end gap-3">
                    <div className="relative flex flex-1 items-end border-b border-[var(--dash-line)]">
                      <div
                        className="kinetic-bar w-full bg-[linear-gradient(180deg,var(--dash-coral),var(--dash-gold),var(--dash-green))]"
                        style={{ height: `${item.value}%`, '--delay': `${index * 60}ms` } as CSSProperties}
                      >
                        <span className="sr-only">
                          {item.month}: {item.revenue}
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-black text-[var(--dash-ink)]">{item.month}</div>
                      <div className="mt-1 text-[10px] text-[var(--dash-muted)]">{item.revenue}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ReportPanel>

          <div className="grid gap-4 lg:grid-cols-2">
            <ReportPanel eyebrow="Heatmap" title="Giờ vàng mua sách">
              <div className="mt-5 grid gap-2">
                {heatmap.map((row, rowIndex) => (
                  <div key={`row-${rowIndex}`} className="grid grid-cols-7 gap-2">
                    {row.map((value, columnIndex) => (
                      <div
                        key={`${rowIndex}-${columnIndex}`}
                        className="kinetic-item h-10 border border-[var(--dash-line)]"
                        style={{
                          '--delay': `${(rowIndex * 7 + columnIndex) * 22}ms`,
                          backgroundColor: `rgba(217, 95, 67, ${0.12 + value / 12})`,
                        } as CSSProperties}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-[var(--dash-muted)]">
                <span>Sáng</span>
                <span>Trưa</span>
                <span>Tối</span>
              </div>
            </ReportPanel>

            <ReportPanel eyebrow="Operations" title="Nhịp vận hành">
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {operations.map((item) => {
                  const Icon = item.icon

                  return (
                    <div key={item.label} className="kinetic-item border border-[var(--dash-line)] bg-white p-4">
                      <Icon className="h-5 w-5 text-[var(--dash-blue)]" />
                      <div className="mt-4 text-3xl font-black">{item.value}</div>
                      <p className="mt-1 text-sm text-[var(--dash-muted)]">{item.label}</p>
                    </div>
                  )
                })}
              </div>
            </ReportPanel>
          </div>
        </div>

        <div className="grid gap-4">
          <ReportPanel eyebrow="Category mix" title="Cơ cấu danh mục">
            <div className="mt-5 grid gap-5 sm:grid-cols-[12rem_1fr] xl:grid-cols-1 2xl:grid-cols-[12rem_1fr]">
              <div
                className="kinetic-orbit mx-auto h-48 w-48 rounded-full border border-[var(--dash-line)]"
                style={{
                  background: 'conic-gradient(var(--dash-green) 0 32%, var(--dash-coral) 32% 56%, var(--dash-blue) 56% 77%, var(--dash-gold) 77% 92%, var(--dash-plum) 92% 100%)',
                }}
              >
                <div className="m-10 h-28 w-28 rounded-full border border-[var(--dash-line)] bg-white" />
              </div>
              <div className="space-y-3">
                {categoryMix.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 border border-[var(--dash-line)] bg-white p-3">
                    <div className="flex items-center gap-3">
                      <span className={`h-3 w-3 ${item.color}`} />
                      <span className="text-sm font-bold">{item.label}</span>
                    </div>
                    <span className="text-sm font-black">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </ReportPanel>

          <ReportPanel eyebrow="Channels" title="Kênh bán hiệu quả">
            <div className="mt-5 space-y-4">
              {channelReports.map((item, index) => {
                const Icon = item.icon

                return (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-[var(--dash-coral)]" />
                        <span className="text-sm font-black">{item.label}</span>
                      </div>
                      <span className="text-sm font-black">{item.value}</span>
                    </div>
                    <div className="h-2 bg-[var(--dash-canvas)]">
                      <div
                        className="kinetic-width h-full bg-[var(--dash-green)]"
                        style={{ width: `${item.share}%`, '--delay': `${index * 80}ms` } as CSSProperties}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </ReportPanel>

          <ReportPanel eyebrow="Cohort" title="Tệp khách hàng">
            <div className="mt-5 overflow-hidden border border-[var(--dash-line)]">
              {cohorts.map((row) => (
                <div key={row.segment} className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-[var(--dash-line)] bg-white p-3 last:border-b-0">
                  <div>
                    <p className="text-sm font-black">{row.segment}</p>
                    <p className="mt-1 text-xs text-[var(--dash-muted)]">{row.orders} đơn</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black">{row.retention}</p>
                    <p className="mt-1 text-xs text-[var(--dash-muted)]">Retention</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black">{row.revenue}</p>
                    <p className="mt-1 text-xs text-[var(--dash-muted)]">Doanh thu</p>
                  </div>
                </div>
              ))}
            </div>
          </ReportPanel>
        </div>
      </section>
    </main>
  )
}

function ReportPanel({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: ReactNode
}) {
  return (
    <section className="kinetic-panel border border-[var(--dash-line)] bg-white p-5 shadow-[6px_6px_0_rgba(23,19,15,0.05)]">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--dash-muted)]">{eyebrow}</p>
      <h2 className="mt-2 [font-family:var(--dash-display)] text-2xl font-semibold leading-tight text-[var(--dash-ink)]">
        {title}
      </h2>
      {children}
    </section>
  )
}
