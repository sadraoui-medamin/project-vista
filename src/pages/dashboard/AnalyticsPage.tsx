import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, Target } from "lucide-react";

const metrics = [
  { label: "Velocity", value: "42 pts", change: "+8%", up: true, icon: Activity },
  { label: "Completion Rate", value: "87%", change: "+3%", up: true, icon: Target },
  { label: "Avg. Cycle Time", value: "3.2 days", change: "-12%", up: true, icon: BarChart3 },
  { label: "Bug Rate", value: "4.1%", change: "+0.5%", up: false, icon: PieChart },
];

const sprintData = [
  { sprint: "Sprint 14", planned: 38, completed: 35, carried: 3 },
  { sprint: "Sprint 15", planned: 42, completed: 40, carried: 2 },
  { sprint: "Sprint 16", planned: 36, completed: 34, carried: 2 },
  { sprint: "Sprint 17", planned: 45, completed: 42, carried: 3 },
  { sprint: "Sprint 18", planned: 40, completed: 32, carried: 8 },
];

const teamPerformance = [
  { name: "Alex Kim", tasks: 24, hours: 38, efficiency: 94 },
  { name: "Maria Johnson", tasks: 21, hours: 40, efficiency: 88 },
  { name: "Sam Rivera", tasks: 18, hours: 35, efficiency: 92 },
  { name: "Pat Lee", tasks: 16, hours: 42, efficiency: 78 },
  { name: "Jordan Chen", tasks: 22, hours: 37, efficiency: 91 },
];

export default function AnalyticsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Track performance metrics and team productivity</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => (
          <div key={m.label} className="glass rounded-2xl p-5 hover:gradient-shadow transition-shadow duration-300">
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
          </div>
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
        </div>

        {/* Burndown mock */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-foreground mb-6">Current Sprint Burndown</h2>
          <div className="relative h-52">
            {/* Ideal line */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <line x1="0" y1="0" x2="100" y2="100" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.4" />
              <polyline
                fill="none"
                stroke="url(#burnGradient)"
                strokeWidth="1.5"
                points="0,0 15,8 30,22 45,35 55,50 65,55 75,68 85,72 100,78"
              />
              <defs>
                <linearGradient id="burnGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(var(--gradient-start))" />
                  <stop offset="100%" stopColor="hsl(var(--gradient-end))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground">
              <span>Day 1</span><span>Day 5</span><span>Day 10</span>
            </div>
            <div className="absolute top-0 left-0 bottom-6 flex flex-col justify-between text-xs text-muted-foreground">
              <span>40 pts</span><span>20 pts</span><span>0 pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Team performance */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Team Performance</h2>
        </div>
        <div className="divide-y divide-border">
          {teamPerformance.map((t) => (
            <div key={t.name} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors">
              <div className="gradient-bg rounded-full w-9 h-9 flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                {t.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.tasks} tasks · {t.hours}h logged</p>
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
