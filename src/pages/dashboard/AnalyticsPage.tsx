import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Download,
  Gauge,
  GitBranch,
  Layers,
  ShieldAlert,
  Target,
  Users,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DateRange = "today" | "week" | "month" | "half" | "year";

type Metric = {
  label: string;
  value: string;
  change: string;
  up: boolean;
  icon: typeof Activity;
};

const dateLabels: Record<DateRange, string> = {
  today: "Today",
  week: "Last 7 Days",
  month: "Last 30 Days",
  half: "Last 6 Months",
  year: "Last Year",
};

const rangeFactors: Record<DateRange, number> = {
  today: 0.35,
  week: 1,
  month: 4.2,
  half: 9.5,
  year: 18,
};

const metricsByRange: Record<DateRange, Metric[]> = {
  today: [
    { label: "Tasks Completed", value: "12", change: "+4", up: true, icon: CheckCircle2 },
    { label: "Delivery Pace", value: "84%", change: "+6%", up: true, icon: Gauge },
    { label: "Blocked Tasks", value: "3", change: "-1", up: true, icon: AlertTriangle },
    { label: "Active Contributors", value: "7", change: "+2", up: true, icon: Users },
    { label: "Reviews Merged", value: "5", change: "+1", up: true, icon: GitBranch },
    { label: "Automation Wins", value: "11", change: "+3", up: true, icon: Zap },
    { label: "Sprint Health", value: "91%", change: "+4%", up: true, icon: Target },
    { label: "Risk Flags", value: "2", change: "+1", up: false, icon: ShieldAlert },
  ],
  week: [
    { label: "Tasks Completed", value: "34", change: "+7", up: true, icon: CheckCircle2 },
    { label: "Delivery Pace", value: "87%", change: "+3%", up: true, icon: Gauge },
    { label: "Blocked Tasks", value: "5", change: "-2", up: true, icon: AlertTriangle },
    { label: "Active Contributors", value: "9", change: "+1", up: true, icon: Users },
    { label: "Reviews Merged", value: "16", change: "+4", up: true, icon: GitBranch },
    { label: "Automation Wins", value: "28", change: "+6", up: true, icon: Zap },
    { label: "Sprint Health", value: "89%", change: "+2%", up: true, icon: Target },
    { label: "Risk Flags", value: "4", change: "+1", up: false, icon: ShieldAlert },
  ],
  month: [
    { label: "Tasks Completed", value: "131", change: "+22", up: true, icon: CheckCircle2 },
    { label: "Delivery Pace", value: "84%", change: "+5%", up: true, icon: Gauge },
    { label: "Blocked Tasks", value: "12", change: "-4", up: true, icon: AlertTriangle },
    { label: "Active Contributors", value: "13", change: "+3", up: true, icon: Users },
    { label: "Reviews Merged", value: "54", change: "+11", up: true, icon: GitBranch },
    { label: "Automation Wins", value: "97", change: "+18", up: true, icon: Zap },
    { label: "Sprint Health", value: "86%", change: "+4%", up: true, icon: Target },
    { label: "Risk Flags", value: "7", change: "-2", up: true, icon: ShieldAlert },
  ],
  half: [
    { label: "Tasks Completed", value: "742", change: "+120", up: true, icon: CheckCircle2 },
    { label: "Delivery Pace", value: "82%", change: "+7%", up: true, icon: Gauge },
    { label: "Blocked Tasks", value: "26", change: "-8", up: true, icon: AlertTriangle },
    { label: "Active Contributors", value: "18", change: "+4", up: true, icon: Users },
    { label: "Reviews Merged", value: "284", change: "+41", up: true, icon: GitBranch },
    { label: "Automation Wins", value: "488", change: "+72", up: true, icon: Zap },
    { label: "Sprint Health", value: "81%", change: "+6%", up: true, icon: Target },
    { label: "Risk Flags", value: "18", change: "-3", up: true, icon: ShieldAlert },
  ],
  year: [
    { label: "Tasks Completed", value: "1,456", change: "+380", up: true, icon: CheckCircle2 },
    { label: "Delivery Pace", value: "79%", change: "+11%", up: true, icon: Gauge },
    { label: "Blocked Tasks", value: "42", change: "-15", up: true, icon: AlertTriangle },
    { label: "Active Contributors", value: "24", change: "+7", up: true, icon: Users },
    { label: "Reviews Merged", value: "604", change: "+105", up: true, icon: GitBranch },
    { label: "Automation Wins", value: "1,041", change: "+186", up: true, icon: Zap },
    { label: "Sprint Health", value: "78%", change: "+9%", up: true, icon: Target },
    { label: "Risk Flags", value: "31", change: "-6", up: true, icon: ShieldAlert },
  ],
};

const periodLabels: Record<DateRange, string[]> = {
  today: ["8AM", "10AM", "12PM", "2PM", "4PM", "6PM"],
  week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  month: ["W1", "W2", "W3", "W4", "W5"],
  half: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  year: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
};

const squadLabels = ["Core", "Growth", "Mobile", "Platform", "QA"];
const workTypeBase = [
  { name: "Features", value: 42 },
  { name: "Bugs", value: 21 },
  { name: "Tech Debt", value: 18 },
  { name: "Ops", value: 19 },
];
const riskBase = [
  { name: "Low", value: 52 },
  { name: "Medium", value: 31 },
  { name: "High", value: 17 },
];

const projectHealth = [
  { name: "Website Redesign", health: "On Track", progress: 72, owner: "Design" },
  { name: "Mobile App v2", health: "At Risk", progress: 45, owner: "Mobile" },
  { name: "API Integration", health: "On Track", progress: 89, owner: "Platform" },
  { name: "Customer Portal", health: "Needs Focus", progress: 58, owner: "Growth" },
  { name: "Data Pipeline", health: "On Track", progress: 64, owner: "Core" },
];

const teamPerformance = [
  { name: "Alex Kim", throughput: 24, review: 11, quality: 96 },
  { name: "Maria Johnson", throughput: 21, review: 13, quality: 92 },
  { name: "Sam Rivera", throughput: 18, review: 10, quality: 94 },
  { name: "Pat Lee", throughput: 16, review: 9, quality: 86 },
  { name: "Jordan Chen", throughput: 22, review: 12, quality: 91 },
];

const piePalette = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--secondary-foreground))",
  "hsl(var(--muted-foreground))",
];

function scaleValue(value: number, factor: number, variance: number) {
  return Math.max(1, Math.round(value * factor + variance));
}

function ChartTooltipCard({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number | string; color?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="glass rounded-xl border border-border px-3 py-2 text-xs shadow-lg">
      {label && <p className="mb-1 font-medium text-foreground">{label}</p>}
      <div className="space-y-1.5">
        {payload.map((item) => (
          <div key={`${item.name}-${item.value}`} className="flex items-center justify-between gap-3">
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

export default function AnalyticsPage() {
  const [range, setRange] = useState<DateRange>("week");

  const metrics = useMemo(() => metricsByRange[range], [range]);
  const factor = rangeFactors[range];

  const throughputData = useMemo(
    () =>
      periodLabels[range].map((label, index) => ({
        label,
        created: scaleValue(12 + index * 2, factor, index % 2 === 0 ? 3 : -2),
        completed: scaleValue(10 + index * 2, factor, index % 3 === 0 ? 2 : -1),
      })),
    [range, factor],
  );

  const cycleData = useMemo(
    () =>
      periodLabels[range].map((label, index) => ({
        label,
        cycle: Number((5.6 - Math.min(index * 0.25, 1.4) + factor * 0.05).toFixed(1)),
        review: Number((2.8 - Math.min(index * 0.12, 0.8) + factor * 0.03).toFixed(1)),
      })),
    [range, factor],
  );

  const sprintData = useMemo(
    () =>
      periodLabels[range].map((label, index) => {
        const planned = scaleValue(18 + index * 3, factor, 0);
        const completed = Math.max(1, planned - (index % 3 === 0 ? 3 : 1));
        const carried = Math.max(1, planned - completed);
        return { label, planned, completed, carried };
      }),
    [range, factor],
  );

  const squadLoad = useMemo(
    () =>
      squadLabels.map((label, index) => ({
        squad: label,
        delivery: scaleValue(14 + index * 3, factor, 0),
        focus: scaleValue(11 + index * 2, factor, index % 2 === 0 ? 2 : -1),
      })),
    [factor],
  );

  const burnupData = useMemo(
    () =>
      periodLabels[range].map((label, index) => ({
        label,
        scope: scaleValue(18 + index * 2, factor, 0),
        delivered: scaleValue(10 + index * 2, factor, index > 1 ? 3 : 0),
      })),
    [range, factor],
  );

  const workTypeData = useMemo(
    () => workTypeBase.map((item, index) => ({ ...item, value: item.value + Math.round(factor * index) })),
    [factor],
  );

  const riskData = useMemo(
    () => riskBase.map((item, index) => ({ ...item, value: Math.max(8, item.value - Math.round(factor * index)) })),
    [factor],
  );

  const handleExport = useCallback(() => {
    const csvRows = [
      ["Section", "Label", "Value"],
      ...metrics.map((metric) => ["metric", metric.label, metric.value]),
      ...throughputData.map((item) => ["throughput_completed", item.label, String(item.completed)]),
      ...throughputData.map((item) => ["throughput_created", item.label, String(item.created)]),
      ...sprintData.map((item) => ["sprint_completed", item.label, String(item.completed)]),
      ...squadLoad.map((item) => ["squad_delivery", item.squad, String(item.delivery)]),
    ];

    const csv = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analytics-${range}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [metrics, throughputData, sprintData, squadLoad, range]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">Deep reporting for delivery, quality, workload, and risk.</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Select value={range} onValueChange={(value) => setRange(value as DateRange)}>
            <SelectTrigger className="glass h-10 w-full rounded-xl border-0 sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(dateLabels) as [DateRange, string][]).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleExport} className="gradient-bg gradient-shadow h-10 rounded-xl border-0 text-primary-foreground">
            <Download className="mr-2 h-4 w-4" /> Export data
          </Button>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="glass rounded-2xl p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="gradient-bg flex h-10 w-10 items-center justify-center rounded-xl">
                <metric.icon className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${metric.up ? "text-primary" : "text-destructive"}`}>
                {metric.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {metric.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">{metric.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 grid gap-6 xl:grid-cols-2">
        <div className="glass rounded-3xl p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-foreground">Delivery throughput</h2>
              <p className="text-xs text-muted-foreground">Created versus completed work over {dateLabels[range].toLowerCase()}.</p>
            </div>
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={throughputData}>
                <defs>
                  <linearGradient id="analyticsCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.04} />
                  </linearGradient>
                  <linearGradient id="analyticsCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} width={28} />
                <Tooltip content={<ChartTooltipCard />} />
                <Legend />
                <Area type="monotone" dataKey="created" name="Created" stroke="hsl(var(--accent))" fill="url(#analyticsCreated)" strokeWidth={2} />
                <Area type="monotone" dataKey="completed" name="Completed" stroke="hsl(var(--primary))" fill="url(#analyticsCompleted)" strokeWidth={2.4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-foreground">Cycle and review time</h2>
              <p className="text-xs text-muted-foreground">Trend in handoff speed and approvals.</p>
            </div>
            <Activity className="h-5 w-5 text-accent" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cycleData}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} width={28} />
                <Tooltip content={<ChartTooltipCard />} />
                <Legend />
                <Line type="monotone" dataKey="cycle" name="Cycle (days)" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3, fill: "hsl(var(--primary))" }} />
                <Line type="monotone" dataKey="review" name="Review (days)" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ r: 3, fill: "hsl(var(--accent))" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-6 xl:grid-cols-3">
        <div className="glass rounded-3xl p-6 xl:col-span-2">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-foreground">Sprint commitment</h2>
              <p className="text-xs text-muted-foreground">Planned, completed, and carried work by period.</p>
            </div>
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sprintData}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} width={28} />
                <Tooltip content={<ChartTooltipCard />} />
                <Legend />
                <Bar dataKey="planned" name="Planned" fill="hsl(var(--secondary-foreground))" radius={[8, 8, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                <Bar dataKey="carried" name="Carried" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-foreground">Work type mix</h2>
              <p className="text-xs text-muted-foreground">What is consuming delivery bandwidth.</p>
            </div>
            <Target className="h-5 w-5 text-accent" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={workTypeData} dataKey="value" nameKey="name" innerRadius={54} outerRadius={86} paddingAngle={4}>
                  {workTypeData.map((entry, index) => (
                    <Cell key={entry.name} fill={piePalette[index % piePalette.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipCard />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-6 xl:grid-cols-3">
        <div className="glass rounded-3xl p-6 xl:col-span-2">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-foreground">Burn-up progress</h2>
              <p className="text-xs text-muted-foreground">Scope growth compared to delivered value.</p>
            </div>
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={burnupData}>
                <defs>
                  <linearGradient id="burnupScope" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--secondary-foreground))" stopOpacity={0.24} />
                    <stop offset="95%" stopColor="hsl(var(--secondary-foreground))" stopOpacity={0.04} />
                  </linearGradient>
                  <linearGradient id="burnupDelivered" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} width={28} />
                <Tooltip content={<ChartTooltipCard />} />
                <Legend />
                <Area type="monotone" dataKey="scope" name="Scope" stroke="hsl(var(--secondary-foreground))" fill="url(#burnupScope)" strokeWidth={2} />
                <Area type="monotone" dataKey="delivered" name="Delivered" stroke="hsl(var(--primary))" fill="url(#burnupDelivered)" strokeWidth={2.4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-foreground">Risk distribution</h2>
              <p className="text-xs text-muted-foreground">Live program risk by severity.</p>
            </div>
            <ShieldAlert className="h-5 w-5 text-destructive" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={84} paddingAngle={4}>
                  {riskData.map((entry, index) => (
                    <Cell key={entry.name} fill={piePalette[index % piePalette.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipCard />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-6 xl:grid-cols-2">
        <div className="glass rounded-3xl p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-foreground">Squad workload</h2>
              <p className="text-xs text-muted-foreground">Delivery output and focus hours by squad.</p>
            </div>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={squadLoad}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="squad" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} width={28} />
                <Tooltip content={<ChartTooltipCard />} />
                <Legend />
                <Bar dataKey="delivery" name="Delivery" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                <Bar dataKey="focus" name="Focus" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-foreground">Project health</h2>
              <p className="text-xs text-muted-foreground">Status snapshot across current initiatives.</p>
            </div>
            <Gauge className="h-5 w-5 text-accent" />
          </div>
          <div className="space-y-4">
            {projectHealth.map((project) => (
              <div key={project.name} className="rounded-2xl border border-border/70 bg-background/30 p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{project.name}</p>
                    <p className="text-xs text-muted-foreground">Owner: {project.owner}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${project.health === "On Track" ? "bg-primary/10 text-primary" : project.health === "At Risk" ? "bg-destructive/10 text-destructive" : "bg-accent/10 text-accent"}`}>
                    {project.health}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${project.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass overflow-hidden rounded-3xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="font-semibold text-foreground">Team performance snapshot</h2>
            <p className="text-xs text-muted-foreground">Top contributors across throughput, review, and quality.</p>
          </div>
          <span className="text-xs text-muted-foreground">{dateLabels[range]}</span>
        </div>
        <div className="divide-y divide-border">
          {teamPerformance.map((member, index) => (
            <div key={member.name} className="grid gap-3 px-6 py-4 md:grid-cols-[40px_1.6fr_1fr_1fr_1fr] md:items-center">
              <span className="text-xs text-muted-foreground">#{index + 1}</span>
              <p className="text-sm font-medium text-foreground">{member.name}</p>
              <p className="text-sm text-muted-foreground">Throughput <span className="font-semibold text-foreground">{member.throughput}</span></p>
              <p className="text-sm text-muted-foreground">Reviews <span className="font-semibold text-foreground">{member.review}</span></p>
              <p className="text-sm text-muted-foreground">Quality <span className="font-semibold text-foreground">{member.quality}%</span></p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
