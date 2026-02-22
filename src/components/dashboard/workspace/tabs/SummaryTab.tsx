import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, CheckCircle2, Clock, AlertCircle, TrendingUp, Users, ListTodo, Download,
  RefreshCw, FileText, Bug, Layers, MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { Workspace } from "@/types/workspace";

interface Props {
  workspace: Workspace;
}

const DONUT_COLORS = ["hsl(142,70%,45%)", "hsl(230,80%,62%)", "hsl(45,90%,55%)", "hsl(190,90%,50%)", "hsl(0,84%,60%)"];

export default function SummaryTab({ workspace }: Props) {
  const stats = useMemo(() => {
    const tasks = workspace.tasks;
    const columns = [...new Set(tasks.map((t) => t.status))];
    const done = columns[columns.length - 1];
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === done).length;
    const inProgress = tasks.filter((t) => t.status !== done && t.status !== columns[0]).length;
    const critical = tasks.filter((t) => t.priority === "Critical").length;
    const high = tasks.filter((t) => t.priority === "High").length;

    const byStatus = columns.map((col) => ({
      label: col,
      count: tasks.filter((t) => t.status === col).length,
    }));

    const byPriority = (["Critical", "High", "Medium", "Low"] as const).map((p) => ({
      label: p,
      count: tasks.filter((t) => t.priority === p).length,
    }));

    const byAssignee = workspace.members.map((m) => ({
      name: m.name,
      avatar: m.avatar,
      count: tasks.filter((t) => t.assignee === m.avatar).length,
      done: tasks.filter((t) => t.assignee === m.avatar && t.status === done).length,
    }));

    // Recent activity (mock)
    const recentActivity = tasks.slice(0, 5).map((t, i) => ({
      user: workspace.members[i % workspace.members.length],
      action: i % 3 === 0 ? "created" : i % 3 === 1 ? "updated" : "completed",
      task: t,
      time: `${i + 1} day${i > 0 ? "s" : ""} ago`,
    }));

    // Types of work
    const allTags = tasks.flatMap((t) => t.tags);
    const tagCounts: Record<string, number> = {};
    allTags.forEach((tag) => { tagCounts[tag] = (tagCounts[tag] || 0) + 1; });
    const typesOfWork = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count, pct: total > 0 ? Math.round((count / total) * 100) : 0 }));

    // Updated / created counts (mock since we don't track updates)
    const updated = Math.max(1, Math.floor(total * 0.6));
    const created = Math.max(1, Math.floor(total * 0.3));
    const dueSoon = tasks.filter((t) => t.status !== done).length > 0 ? Math.floor(Math.random() * 3) : 0;

    return { total, completed, inProgress, critical, high, byStatus, byPriority, byAssignee, columns, done, recentActivity, typesOfWork, updated, created, dueSoon };
  }, [workspace]);

  const progress = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const donutData = stats.byStatus.map((s) => ({ name: s.label, value: s.count }));

  const priorityChartData = stats.byPriority.map((p) => ({ name: p.label, count: p.count }));

  const priorityBarColor: Record<string, string> = {
    Critical: "hsl(0,84%,60%)",
    High: "hsl(30,90%,55%)",
    Medium: "hsl(230,80%,62%)",
    Low: "hsl(220,10%,55%)",
  };

  const typeIcons: Record<string, typeof ListTodo> = {
    Default: ListTodo,
    Backend: Layers,
    Frontend: FileText,
    Design: FileText,
    QA: Bug,
    Docs: MessageSquare,
    DevOps: RefreshCw,
  };

  const statusActionBadge: Record<string, string> = {
    created: "bg-green-500/20 text-green-500",
    updated: "bg-primary/20 text-primary",
    completed: "bg-accent/20 text-accent",
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* KPI Cards row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "completed", sublabel: "in the last 7 days", value: stats.completed, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
          { label: "updated", sublabel: "in the last 7 days", value: stats.updated, icon: RefreshCw, color: "text-primary", bg: "bg-primary/10" },
          { label: "created", sublabel: "in the last 7 days", value: stats.created, icon: ListTodo, color: "text-accent", bg: "bg-accent/10" },
          { label: "due soon", sublabel: "in the next 7 days", value: stats.dueSoon, icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
        ].map((kpi) => (
          <div key={kpi.label} className={`glass rounded-xl p-4 border-l-4 ${kpi.bg.replace("/10", "/30")}`}>
            <div className="flex items-center gap-2 mb-1">
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              <span className="text-2xl font-bold text-foreground">{kpi.value}</span>
            </div>
            <p className="text-xs font-medium text-foreground">{kpi.label}</p>
            <p className="text-[10px] text-muted-foreground">{kpi.sublabel}</p>
          </div>
        ))}
      </div>

      {/* Row: Status overview (donut) + Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Status overview with donut chart */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-foreground">Status overview</h3>
            <button className="text-xs text-primary hover:underline">View all work items</button>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Get a snapshot of the status of your work items.</p>

          <div className="flex items-center gap-6">
            <div className="relative w-40 h-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {donutData.map((_, i) => (
                      <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-foreground">{stats.total}</span>
                <span className="text-[10px] text-muted-foreground">Total work items</span>
              </div>
            </div>

            <div className="space-y-2 flex-1">
              {stats.byStatus.map((s, i) => (
                <div key={s.label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                  <span className="text-xs text-muted-foreground flex-1">{s.label}: {s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-foreground">Recent activity</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Stay up to date with what's happening across the space.</p>

          <div className="space-y-3">
            {stats.recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="gradient-bg rounded-full w-6 h-6 flex items-center justify-center text-[9px] font-bold text-primary-foreground shrink-0 mt-0.5">
                  {activity.user.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-foreground">
                    <span className="font-medium">{activity.user.name}</span>{" "}
                    {activity.action}{" "}
                    <span className="text-primary font-medium truncate">
                      {activity.task.title}
                    </span>
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${statusActionBadge[activity.action]}`}>
                      {activity.task.status}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row: Priority breakdown (bar chart) + Types of work */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Priority breakdown bar chart */}
        <div className="glass rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-1">Priority breakdown</h3>
          <p className="text-xs text-muted-foreground mb-4">Get a holistic view of how work is being prioritized.</p>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityChartData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {priorityChartData.map((entry) => (
                    <Cell key={entry.name} fill={priorityBarColor[entry.name] || "hsl(var(--muted))"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-3 mt-2">
            {stats.byPriority.map((p) => (
              <div key={p.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: priorityBarColor[p.label] }} />
                <span className="text-[10px] text-muted-foreground">{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Types of work */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-foreground">Types of work</h3>
            <button className="text-xs text-primary hover:underline">View all items</button>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Get a breakdown of work items by their types.</p>

          <div className="space-y-3">
            <div className="grid grid-cols-[auto_1fr_auto] gap-x-4 gap-y-2 items-center">
              <span className="text-[10px] font-medium text-muted-foreground uppercase">Type</span>
              <span className="text-[10px] font-medium text-muted-foreground uppercase text-right">Distribution</span>
              <span />
              {stats.typesOfWork.map((tw) => {
                const Icon = typeIcons[tw.tag] || ListTodo;
                return (
                  <>
                    <div key={tw.tag + "-label"} className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs text-foreground font-medium">{tw.tag}</span>
                    </div>
                    <div key={tw.tag + "-bar"} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-8">{tw.pct}%</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${tw.pct}%` }}
                        />
                      </div>
                    </div>
                    <span key={tw.tag + "-count"} className="text-xs text-muted-foreground">{tw.count}</span>
                  </>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Team workload */}
      <div className="glass rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" /> Team workload
        </h3>
        <p className="text-xs text-muted-foreground mb-4">Monitor the capacity of your team. Reassign work items to get the right balance.</p>

        {stats.byAssignee.length > 0 ? (
          <div className="space-y-3">
            <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 items-center">
              <span className="text-[10px] font-medium text-muted-foreground uppercase">Assignee</span>
              <span className="text-[10px] font-medium text-muted-foreground uppercase">Work distribution</span>
              {stats.byAssignee.filter((a) => a.count > 0).map((a) => {
                const pct = stats.total > 0 ? Math.round((a.count / stats.total) * 100) : 0;
                return (
                  <>
                    <div key={a.avatar + "-name"} className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[9px] font-bold text-foreground shrink-0">
                        {a.avatar}
                      </div>
                      <span className="text-xs font-medium text-foreground truncate">{a.name}</span>
                    </div>
                    <div key={a.avatar + "-bar"} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-8">{pct}%</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full bg-gradient-to-r ${workspace.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6 }}
                        />
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No team members assigned yet.</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button variant="outline" className="rounded-xl text-xs">
          <Download className="h-3.5 w-3.5 mr-2" /> Export Summary (PDF)
        </Button>
      </div>
    </motion.div>
  );
}
