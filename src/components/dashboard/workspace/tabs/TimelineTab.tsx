import { motion } from "framer-motion";
import type { Workspace } from "@/types/workspace";
import { DEFAULT_COLUMNS } from "@/types/workspace";

const priorityDot: Record<string, string> = {
  Critical: "bg-destructive",
  High: "bg-orange-500",
  Medium: "bg-primary",
  Low: "bg-muted-foreground/40",
};

export default function TimelineTab({ workspace }: { workspace: Workspace }) {
  const columns = DEFAULT_COLUMNS[workspace.template];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <p className="text-xs text-muted-foreground mb-4">Visual timeline of task flow by status</p>
      <div className="space-y-6">
        {columns.map((col, ci) => {
          const tasks = workspace.tasks.filter((t) => t.status === col);
          return (
            <div key={col} className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className={`h-3 w-3 rounded-full bg-gradient-to-r ${workspace.color}`} />
                <h3 className="text-sm font-semibold text-foreground">{col}</h3>
                <span className="text-xs text-muted-foreground">({tasks.length})</span>
              </div>
              {ci < columns.length - 1 && (
                <div className="absolute left-[5px] top-6 bottom-[-20px] w-0.5 bg-border" />
              )}
              <div className="ml-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {tasks.map((t) => (
                  <div key={t.id} className="glass rounded-lg p-2.5 text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full shrink-0 ${priorityDot[t.priority]}`} />
                      <span className="font-medium text-foreground truncate">{t.title}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1.5 text-muted-foreground">
                      {t.assignee && <span>{t.assignee}</span>}
                      {t.dueDate && <span>{t.dueDate}</span>}
                    </div>
                  </div>
                ))}
                {tasks.length === 0 && <p className="text-xs text-muted-foreground italic">No tasks</p>}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
