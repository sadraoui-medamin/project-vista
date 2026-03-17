import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const throughputData = [
  { label: "Mon", completed: 12, created: 16 },
  { label: "Tue", completed: 18, created: 21 },
  { label: "Wed", completed: 15, created: 19 },
  { label: "Thu", completed: 22, created: 20 },
  { label: "Fri", completed: 19, created: 17 },
  { label: "Sat", completed: 10, created: 8 },
  { label: "Sun", completed: 8, created: 6 },
];

const workloadData = [
  { squad: "Design", capacity: 68, focus: 82 },
  { squad: "Product", capacity: 54, focus: 74 },
  { squad: "Engineering", capacity: 91, focus: 88 },
  { squad: "QA", capacity: 62, focus: 79 },
];

const statusData = [
  { name: "Done", value: 38, color: "hsl(var(--primary))" },
  { name: "In Progress", value: 27, color: "hsl(var(--accent))" },
  { name: "Review", value: 19, color: "hsl(var(--secondary-foreground))" },
  { name: "Backlog", value: 16, color: "hsl(var(--muted-foreground))" },
];

function ChartTooltipCard({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color?: string }>; label?: string }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="glass rounded-xl border border-border px-3 py-2 text-xs shadow-lg">
      {label && <p className="mb-1 font-medium text-foreground">{label}</p>}
      <div className="space-y-1.5">
        {payload.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}
            </span>
            <span className="font-semibold text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardStatsCharts() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr] mb-8">
      <div className="glass rounded-3xl p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-foreground">Weekly throughput</h2>
            <p className="text-xs text-muted-foreground">Created vs completed tasks across the week</p>
          </div>
          <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">+14% this week</div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={throughputData}>
              <defs>
                <linearGradient id="throughputCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.04} />
                </linearGradient>
                <linearGradient id="throughputCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} width={28} />
              <Tooltip content={<ChartTooltipCard />} />
              <Area type="monotone" dataKey="created" stroke="hsl(var(--accent))" fill="url(#throughputCreated)" strokeWidth={2} />
              <Area type="monotone" dataKey="completed" stroke="hsl(var(--primary))" fill="url(#throughputCompleted)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="glass rounded-3xl p-6">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-foreground">Team workload</h2>
            <p className="text-xs text-muted-foreground">Capacity and focus score by squad</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData} barGap={8}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="squad" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} width={28} />
                <Tooltip content={<ChartTooltipCard />} />
                <Bar dataKey="capacity" radius={[8, 8, 0, 0]} fill="hsl(var(--primary))" />
                <Bar dataKey="focus" radius={[8, 8, 0, 0]} fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-foreground">Task status mix</h2>
              <p className="text-xs text-muted-foreground">Distribution of live work across the board</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-foreground">124</p>
              <p className="text-[11px] text-muted-foreground">open items</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-44 w-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={42} outerRadius={68} paddingAngle={3}>
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltipCard />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {statusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-semibold text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
