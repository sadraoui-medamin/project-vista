import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, BarChart3, PieChart, Activity, Target,
  Users, Clock, CheckCircle2, AlertTriangle, Zap, FileText, Bug,
  ArrowRight, Layers, GitBranch, MessageSquare, Star,
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type DateRange = "today" | "week" | "month" | "half" | "year";

const dateLabels: Record<DateRange, string> = {
  today: "Today",
  week: "Last 7 Days",
  month: "Last 30 Days",
  half: "Last 6 Months",
  year: "Last Year",
};

// Stats vary by date range for realism
const metricsByRange: Record<DateRange, { label: string; value: string; change: string; up: boolean; icon: any }[]> = {
  today: [
    { label: "Tasks Completed", value: "12", change: "+4", up: true, icon: CheckCircle2 },
    { label: "Active Sprint Pts", value: "8 pts", change: "+2", up: true, icon: Activity },
    { label: "Bugs Reported", value: "2", change: "+1", up: false, icon: Bug },
    { label: "Team Online", value: "7/9", change: "+1", up: true, icon: Users },
    { label: "Avg Response Time", value: "14 min", change: "-3 min", up: true, icon: Clock },
    { label: "Commits", value: "23", change: "+8", up: true, icon: GitBranch },
    { label: "PRs Merged", value: "5", change: "+2", up: true, icon: Layers },
    { label: "Comments", value: "34", change: "+12", up: true, icon: MessageSquare },
  ],
  week: [
    { label: "Velocity", value: "42 pts", change: "+8%", up: true, icon: Activity },
    { label: "Completion Rate", value: "87%", change: "+3%", up: true, icon: Target },
    { label: "Avg. Cycle Time", value: "3.2 days", change: "-12%", up: true, icon: BarChart3 },
    { label: "Bug Rate", value: "4.1%", change: "+0.5%", up: false, icon: Bug },
    { label: "Tasks Created", value: "38", change: "+5", up: true, icon: FileText },
    { label: "Tasks Completed", value: "34", change: "+7", up: true, icon: CheckCircle2 },
    { label: "Team Efficiency", value: "91%", change: "+2%", up: true, icon: Zap },
    { label: "Blockers", value: "3", change: "-2", up: true, icon: AlertTriangle },
  ],
  month: [
    { label: "Velocity", value: "168 pts", change: "+12%", up: true, icon: Activity },
    { label: "Completion Rate", value: "84%", change: "+5%", up: true, icon: Target },
    { label: "Avg. Cycle Time", value: "4.1 days", change: "-8%", up: true, icon: BarChart3 },
    { label: "Bug Rate", value: "3.8%", change: "-0.7%", up: true, icon: Bug },
    { label: "Tasks Created", value: "156", change: "+18", up: true, icon: FileText },
    { label: "Tasks Completed", value: "131", change: "+22", up: true, icon: CheckCircle2 },
    { label: "Team Utilization", value: "88%", change: "+4%", up: true, icon: Users },
    { label: "Story Points", value: "210", change: "+32", up: true, icon: Star },
  ],
  half: [
    { label: "Total Velocity", value: "924 pts", change: "+18%", up: true, icon: Activity },
    { label: "Avg Completion", value: "82%", change: "+7%", up: true, icon: Target },
    { label: "Avg. Cycle Time", value: "4.8 days", change: "-15%", up: true, icon: BarChart3 },
    { label: "Bug Rate", value: "4.5%", change: "-1.2%", up: true, icon: Bug },
    { label: "Projects Delivered", value: "8", change: "+3", up: true, icon: Layers },
    { label: "Tasks Completed", value: "742", change: "+120", up: true, icon: CheckCircle2 },
    { label: "Team Growth", value: "+4", change: "new hires", up: true, icon: Users },
    { label: "Client Satisfaction", value: "4.7/5", change: "+0.3", up: true, icon: Star },
  ],
  year: [
    { label: "Total Velocity", value: "1,848 pts", change: "+24%", up: true, icon: Activity },
    { label: "Avg Completion", value: "79%", change: "+11%", up: true, icon: Target },
    { label: "Avg. Cycle Time", value: "5.2 days", change: "-22%", up: true, icon: BarChart3 },
    { label: "Bug Rate", value: "5.1%", change: "-2.4%", up: true, icon: Bug },
    { label: "Projects Delivered", value: "14", change: "+6", up: true, icon: Layers },
    { label: "Tasks Completed", value: "1,456", change: "+380", up: true, icon: CheckCircle2 },
    { label: "Revenue Impact", value: "$2.4M", change: "+34%", up: true, icon: Zap },
    { label: "Client NPS", value: "72", change: "+12", up: true, icon: Star },
  ],
};

const sprintDataByRange: Record<DateRange, { sprint: string; planned: number; completed: number; carried: number }[]> = {
  today: [
    { sprint: "Sprint 18 (Today)", planned: 8, completed: 5, carried: 0 },
  ],
  week: [
    { sprint: "Sprint 18", planned: 40, completed: 32, carried: 8 },
  ],
  month: [
    { sprint: "Sprint 15", planned: 42, completed: 40, carried: 2 },
    { sprint: "Sprint 16", planned: 36, completed: 34, carried: 2 },
    { sprint: "Sprint 17", planned: 45, completed: 42, carried: 3 },
    { sprint: "Sprint 18", planned: 40, completed: 32, carried: 8 },
  ],
  half: [
    { sprint: "Sprint 10", planned: 35, completed: 30, carried: 5 },
    { sprint: "Sprint 11", planned: 38, completed: 36, carried: 2 },
    { sprint: "Sprint 12", planned: 40, completed: 38, carried: 2 },
    { sprint: "Sprint 13", planned: 42, completed: 39, carried: 3 },
    { sprint: "Sprint 14", planned: 38, completed: 35, carried: 3 },
    { sprint: "Sprint 15", planned: 42, completed: 40, carried: 2 },
    { sprint: "Sprint 16", planned: 36, completed: 34, carried: 2 },
    { sprint: "Sprint 17", planned: 45, completed: 42, carried: 3 },
    { sprint: "Sprint 18", planned: 40, completed: 32, carried: 8 },
  ],
  year: [
    { sprint: "Q1 Avg", planned: 38, completed: 32, carried: 6 },
    { sprint: "Q2 Avg", planned: 40, completed: 35, carried: 5 },
    { sprint: "Q3 Avg", planned: 42, completed: 38, carried: 4 },
    { sprint: "Q4 Avg", planned: 44, completed: 40, carried: 4 },
  ],
};

const teamPerformance = [
  { name: "Alex Kim", tasks: 24, hours: 38, efficiency: 94, streak: 12 },
  { name: "Maria Johnson", tasks: 21, hours: 40, efficiency: 88, streak: 8 },
  { name: "Sam Rivera", tasks: 18, hours: 35, efficiency: 92, streak: 15 },
  { name: "Pat Lee", tasks: 16, hours: 42, efficiency: 78, streak: 4 },
  { name: "Jordan Chen", tasks: 22, hours: 37, efficiency: 91, streak: 10 },
];

const projectHealth = [
  { name: "Website Redesign", health: "On Track", progress: 72, risk: "Low" },
  { name: "Mobile App v2", health: "At Risk", progress: 45, risk: "High" },
  { name: "API Integration", health: "On Track", progress: 89, risk: "Low" },
  { name: "Customer Portal", health: "Behind", progress: 15, risk: "Medium" },
  { name: "Data Pipeline", health: "On Track", progress: 60, risk: "Low" },
];

const healthColors: Record<string, string> = {
  "On Track": "text-green-500",
  "At Risk": "text-orange-500",
  Behind: "text-destructive",
};

const riskBg: Record<string, string> = {
  Low: "bg-green-500/20 text-green-500",
  Medium: "bg-orange-500/20 text-orange-500",
  High: "bg-destructive/20 text-destructive",
};

export default function AnalyticsPage() {
  const [range, setRange] = useState<DateRange>("week");

  const metrics = useMemo(() => metricsByRange[range], [range]);
  const sprintData = useMemo(() => sprintDataByRange[range], [range]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Track performance metrics and team productivity</p>
        </div>
        <Select value={range} onValueChange={(v) => setRange(v as DateRange)}>
          <SelectTrigger className="glass border-0 rounded-xl w-full sm:w-48 h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(dateLabels) as [DateRange, string][]).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-5 hover:gradient-shadow transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="gradient-bg rounded-xl w-9 h-9 flex items-center justify-center">
                <m.icon className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className={`text-xs font-medium flex items-center gap-1 ${m.up ? "text-green-500" : "text-destructive"}`}>
                {m.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {m.change}
              </span>
            </div>
            <p className="text-2xl font-bold gradient-text">{m.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Sprint velocity */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-foreground mb-6">Sprint Velocity</h2>
          <div className="space-y-4">
            {sprintData.map((s) => (
              <div key={s.sprint}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">{s.sprint}</span>
                  <span className="text-foreground font-medium">{s.completed}/{s.planned}</span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden flex">
                  <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    style={{ width: `${(s.completed / s.planned) * 100}%` }} />
                  <div className="h-full bg-destructive/40 rounded-r-full"
                    style={{ width: `${(s.carried / s.planned) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-accent inline-block" /> Completed</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-destructive/40 inline-block" /> Carried Over</span>
          </div>
        </div>

        {/* Project Health */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-foreground mb-6">Project Health</h2>
          <div className="space-y-4">
            {projectHealth.map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground truncate">{p.name}</span>
                    <span className={`text-xs font-medium ${healthColors[p.health]}`}>{p.health}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${riskBg[p.risk]}`}>{p.risk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Distribution Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Tasks by Status", items: [{ name: "To Do", pct: 25 }, { name: "In Progress", pct: 35 }, { name: "In Review", pct: 15 }, { name: "Done", pct: 25 }] },
          { label: "Tasks by Priority", items: [{ name: "Critical", pct: 10 }, { name: "High", pct: 30 }, { name: "Medium", pct: 40 }, { name: "Low", pct: 20 }] },
          { label: "Time Allocation", items: [{ name: "Development", pct: 45 }, { name: "Design", pct: 20 }, { name: "Testing", pct: 20 }, { name: "Meetings", pct: 15 }] },
          { label: "Bug Severity", items: [{ name: "Critical", pct: 5 }, { name: "Major", pct: 20 }, { name: "Minor", pct: 45 }, { name: "Trivial", pct: 30 }] },
        ].map((group) => (
          <div key={group.label} className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">{group.label}</h3>
            <div className="space-y-3">
              {group.items.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="text-foreground font-medium">{item.pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Team performance */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Team Performance</h2>
          <span className="text-xs text-muted-foreground">{dateLabels[range]}</span>
        </div>
        <div className="divide-y divide-border">
          {teamPerformance.map((t, i) => (
            <div key={t.name} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors">
              <span className="text-xs text-muted-foreground w-5 shrink-0">#{i + 1}</span>
              <div className="gradient-bg rounded-full w-9 h-9 flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                {t.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.tasks} tasks · {t.hours}h logged · {t.streak} day streak 🔥</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-20 h-2 bg-muted rounded-full overflow-hidden hidden sm:block">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${t.efficiency}%` }} />
                </div>
                <span className="text-sm font-medium gradient-text">{t.efficiency}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
