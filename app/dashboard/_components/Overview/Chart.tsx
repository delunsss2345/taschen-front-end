'use client'

type Item = { name: string; total: number }

const data: Item[] = [
  { name: 'Jan', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Feb', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Mar', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Apr', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'May', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Jun', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Jul', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Aug', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Sep', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Oct', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Nov', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Dec', total: Math.floor(Math.random() * 5000) + 1000 },
]

export default function OverviewChart() {
  const maxTotal = Math.max(...data.map((item) => item.total), 1)

  return (
    <div className="h-[350px] w-full rounded-md border border-border/50 bg-muted/10 p-4">
      <div className="grid h-full grid-cols-[auto,1fr] gap-4">
        <div className="flex flex-col justify-between text-xs text-muted-foreground">
          <span>${maxTotal.toLocaleString()}</span>
          <span>${Math.round(maxTotal * 0.75).toLocaleString()}</span>
          <span>${Math.round(maxTotal * 0.5).toLocaleString()}</span>
          <span>${Math.round(maxTotal * 0.25).toLocaleString()}</span>
          <span>$0</span>
        </div>
        <div className="flex h-full items-end gap-2">
          {data.map((item) => {
            const heightPercent = Math.max(
              6,
              Math.round((item.total / maxTotal) * 100)
            )

            return (
              <div key={item.name} className="flex h-full flex-1 flex-col justify-end">
                <div
                  className="w-full rounded-t-md bg-primary/80 transition-[height] duration-500 ease-out"
                  style={{ height: `${heightPercent}%` }}
                  title={`${item.name}: $${item.total.toLocaleString()}`}
                />
                <span className="mt-2 text-center text-[10px] text-muted-foreground">
                  {item.name}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
