import { useMemo } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Clock, Bug, TrendingDown } from "lucide-react";
import type { Workspace } from "@/types/workspace";

export default function ReportsTab({ workspace }: { workspace: Workspace }) {
  const stats = useMemo(() => {
    const tasks = workspace.tasks;
    const columns = [...new Set(tasks.map((t) => t.status))];
    const closed = columns[columns.length - 1];
    const open = tasks.filter((t) => t.status === columns[0]).length;
    const investigating = tasks.filter((t) => t.status !== columns[0] && t.status !== closed).length;
    const closedCount = tasks.filter((t) => t.status === closed).length;
    const critical = tasks.filter((t) => t.priority === "Critical").length;
    const high = tasks.filter((t) => t.priority === "High").length;
    const resolution = tasks.length > 0 ? Math.round((closedCount / tasks.length) * 100) : 0;

    const byTag: Record<string, number> = {};
    tasks.forEach((t) => t.tags.forEach((tag) => { byTag[tag] = (byTag[tag] || 0) + 1; }));

    return { open, investigating, closedCount, critical, high, resolution, total: tasks.length, byTag };
  }, [workspace]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Open", value: stats.open, icon: Bug, color: "text-destructive" },
          { label: "Investigating", value: stats.investigating, icon: Clock, color: "text-accent" },
          { label: "Resolved", value: stats.closedCount, icon: CheckCircle2, color: "text-green-500" },
          { label: "Resolution Rate", value: `${stats.resolution}%`, icon: TrendingDown, color: "text-primary" },
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

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive" /> Severity Breakdown
          </h3>
          <div className="space-y-3">
            {[
              { label: "Critical", count: stats.critical, color: "bg-destructive" },
              { label: "High", count: stats.high, color: "bg-orange-500" },
              { label: "Medium", count: workspace.tasks.filter((t) => t.priority === "Medium").length, color: "bg-primary" },
              { label: "Low", count: workspace.tasks.filter((t) => t.priority === "Low").length, color: "bg-muted-foreground" },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                  <span className="text-xs font-medium text-foreground">{s.count}</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${s.color}`} style={{ width: `${stats.total > 0 ? (s.count / stats.total) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-4">By Category</h3>
          {Object.keys(stats.byTag).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(stats.byTag).sort((a, b) => b[1] - a[1]).map(([tag, count]) => (
                <div key={tag} className="flex items-center justify-between">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">{tag}</span>
                  <span className="text-sm font-bold text-foreground">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No categories tagged yet.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
