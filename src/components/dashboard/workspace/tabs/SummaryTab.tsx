import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3, CheckCircle2, Clock, AlertCircle, TrendingUp, Users, ListTodo, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Workspace } from "@/types/workspace";

interface Props {
  workspace: Workspace;
}

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

    return { total, completed, inProgress, critical, high, byStatus, byPriority, byAssignee, columns, done };
  }, [workspace]);

  const progress = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const priorityColor: Record<string, string> = {
    Critical: "bg-destructive/20 text-destructive",
    High: "bg-orange-500/20 text-orange-500",
    Medium: "bg-primary/20 text-primary",
    Low: "bg-muted text-muted-foreground",
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Tasks", value: stats.total, icon: ListTodo, color: "text-primary" },
          { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "text-green-500" },
          { label: "In Progress", value: stats.inProgress, icon: Clock, color: "text-accent" },
          { label: "Critical", value: stats.critical, icon: AlertCircle, color: "text-destructive" },
        ].map((kpi) => (
          <div key={kpi.label} className="glass rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              <span className="text-2xl font-bold text-foreground">{kpi.value}</span>
            </div>
            <p className="text-xs text-muted-foreground">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-foreground">Overall Progress</h3>
            <p className="text-xs text-muted-foreground">{stats.completed} of {stats.total} tasks completed</p>
          </div>
          <span className="text-2xl font-bold gradient-text">{progress}%</span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${workspace.color}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="glass rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" /> Task Distribution
          </h3>
          <div className="space-y-3">
            {stats.byStatus.map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                  <span className="text-xs font-medium text-foreground">{s.count}</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${workspace.color} transition-all`}
                    style={{ width: `${stats.total > 0 ? (s.count / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="glass rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-accent" /> By Priority
          </h3>
          <div className="space-y-2">
            {stats.byPriority.map((p) => (
              <div key={p.label} className="flex items-center justify-between">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${priorityColor[p.label]}`}>{p.label}</span>
                <span className="text-sm font-bold text-foreground">{p.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team workload */}
      <div className="glass rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" /> Team Workload
        </h3>
        {stats.byAssignee.length > 0 ? (
          <div className="space-y-3">
            {stats.byAssignee.filter((a) => a.count > 0).map((a) => (
              <div key={a.avatar} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground shrink-0">
                  {a.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground truncate">{a.name}</span>
                    <span className="text-xs text-muted-foreground">{a.done}/{a.count}</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${workspace.color}`}
                      style={{ width: `${a.count > 0 ? (a.done / a.count) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
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
