import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Clock, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Workspace, TaskItem } from "@/types/workspace";
import { DEFAULT_COLUMNS } from "@/types/workspace";

export default function BacklogTab({ workspace, onUpdate }: { workspace: Workspace; onUpdate: (w: Workspace) => void }) {
  const columns = DEFAULT_COLUMNS[workspace.template];
  const backlogCol = columns[0]; // first column = backlog
  const backlogTasks = workspace.tasks.filter((t) => t.status === backlogCol);

  const priorityColor: Record<string, string> = {
    Critical: "bg-destructive/20 text-destructive",
    High: "bg-orange-500/20 text-orange-500",
    Medium: "bg-primary/20 text-primary",
    Low: "bg-muted text-muted-foreground",
  };

  const moveToSprint = (taskId: string) => {
    onUpdate({
      ...workspace,
      tasks: workspace.tasks.map((t) => t.id === taskId ? { ...t, status: columns[1] } : t),
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">Product Backlog</h3>
          <p className="text-xs text-muted-foreground">{backlogTasks.length} items in backlog</p>
        </div>
      </div>

      <div className="space-y-2">
        {backlogTasks.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-xl p-4 flex items-center gap-4"
          >
            <span className="text-xs text-muted-foreground w-6 text-center font-mono">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
              {task.description && <p className="text-xs text-muted-foreground mt-0.5 truncate">{task.description}</p>}
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityColor[task.priority]}`}>{task.priority}</span>
                {task.tags.map((tag) => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{tag}</span>
                ))}
              </div>
            </div>
            {task.assignee && (
              <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-foreground shrink-0">
                {task.assignee}
              </div>
            )}
            <Button size="sm" variant="outline" onClick={() => moveToSprint(task.id)} className="rounded-lg text-xs shrink-0">
              → Sprint
            </Button>
          </motion.div>
        ))}
      </div>

      {backlogTasks.length === 0 && (
        <div className="text-center py-12">
          <ListTodo className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">Backlog is empty — all items moved to sprint!</p>
        </div>
      )}
    </motion.div>
  );
}
