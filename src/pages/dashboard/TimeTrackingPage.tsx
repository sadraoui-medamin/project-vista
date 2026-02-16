import { motion } from "framer-motion";
import { Play, Pause, Clock, Calendar, TrendingUp, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const timeEntries = [
  { task: "Landing page redesign", project: "Website Redesign", time: "2h 45m", date: "Today", active: false },
  { task: "API endpoint refactor", project: "API Integration", time: "1h 30m", date: "Today", active: false },
  { task: "User flow wireframes", project: "Mobile App v2", time: "3h 15m", date: "Yesterday", active: false },
  { task: "Database schema design", project: "Data Pipeline", time: "4h 00m", date: "Yesterday", active: false },
  { task: "Component library docs", project: "Design System", time: "1h 45m", date: "Feb 14", active: false },
  { task: "Sprint retrospective", project: "Website Redesign", time: "0h 45m", date: "Feb 14", active: false },
];

const weeklyStats = [
  { day: "Mon", hours: 7.5 },
  { day: "Tue", hours: 8.2 },
  { day: "Wed", hours: 6.8 },
  { day: "Thu", hours: 9.1 },
  { day: "Fri", hours: 5.5 },
];

export default function TimeTrackingPage() {
  const [timerRunning, setTimerRunning] = useState(false);
  const maxHours = Math.max(...weeklyStats.map(s => s.hours));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Time Tracking</h1>
        <p className="text-sm text-muted-foreground mt-1">Track and manage your working hours</p>
      </div>

      {/* Timer */}
      <div className="glass-strong rounded-3xl p-8 gradient-shadow mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm text-muted-foreground mb-1">Current Session</p>
            <p className="text-5xl font-bold gradient-text font-mono">{timerRunning ? "01:23:45" : "00:00:00"}</p>
            <p className="text-sm text-muted-foreground mt-2">{timerRunning ? "Working on: Landing page redesign" : "No active timer"}</p>
          </div>
          <Button
            size="lg"
            className={`rounded-2xl h-16 w-16 ${timerRunning ? "bg-destructive hover:bg-destructive/90" : "gradient-bg gradient-shadow"} text-primary-foreground border-0`}
            onClick={() => setTimerRunning(!timerRunning)}
          >
            {timerRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Today", value: "4h 15m", icon: Clock, change: "2 sessions" },
          { label: "This Week", value: "37.1h", icon: Calendar, change: "On track" },
          { label: "This Month", value: "142h", icon: TrendingUp, change: "+12% vs last" },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="gradient-bg rounded-xl w-9 h-9 flex items-center justify-center">
                <stat.icon className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold gradient-text">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Weekly chart */}
      <div className="glass rounded-2xl p-6 mb-8">
        <h2 className="font-semibold text-foreground mb-4">Weekly Overview</h2>
        <div className="flex items-end gap-4 h-40">
          {weeklyStats.map((s) => (
            <div key={s.day} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full rounded-xl bg-gradient-to-t from-primary to-accent transition-all duration-500"
                style={{ height: `${(s.hours / maxHours) * 100}%` }} />
              <span className="text-xs text-muted-foreground">{s.day}</span>
              <span className="text-xs font-medium text-foreground">{s.hours}h</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent entries */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Recent Time Entries</h2>
        </div>
        <div className="divide-y divide-border">
          {timeEntries.map((entry, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors">
              <div className="gradient-bg rounded-lg w-8 h-8 flex items-center justify-center shrink-0">
                <Timer className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{entry.task}</p>
                <p className="text-xs text-muted-foreground">{entry.project}</p>
              </div>
              <span className="text-sm font-mono font-medium gradient-text shrink-0">{entry.time}</span>
              <span className="text-xs text-muted-foreground shrink-0 hidden sm:inline">{entry.date}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
