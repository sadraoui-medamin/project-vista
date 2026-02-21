import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { Workspace, TaskItem } from "@/types/workspace";

const priorityOrder: Record<string, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
const priorityColor: Record<string, string> = {
  Critical: "bg-destructive/20 text-destructive",
  High: "bg-orange-500/20 text-orange-500",
  Medium: "bg-primary/20 text-primary",
  Low: "bg-muted text-muted-foreground",
};

export default function ListTab({ workspace }: { workspace: Workspace }) {
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"priority" | "status" | "title">("priority");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = workspace.tasks
    .filter((t) => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
      const matchPriority = priorityFilter === "all" || t.priority === priorityFilter;
      return matchSearch && matchPriority;
    })
    .sort((a, b) => {
      if (sortBy === "priority") return priorityOrder[a.priority] - priorityOrder[b.priority];
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return a.status.localeCompare(b.status);
    });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tasks..." className="glass border-0 rounded-xl pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"><X className="h-3 w-3" /></button>}
        </div>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="glass border-0 rounded-xl w-full sm:w-36 h-9"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {["Critical", "High", "Medium", "Low"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="glass border-0 rounded-xl w-full sm:w-36 h-9">
            <ArrowUpDown className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-xs text-muted-foreground mb-3">{filtered.length} task{filtered.length !== 1 ? "s" : ""}</p>

      <div className="space-y-2">
        <AnimatePresence>
          {filtered.map((task) => {
            const expanded = expandedId === task.id;
            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onClick={() => setExpandedId(expanded ? null : task.id)}
                className="glass rounded-xl p-3 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityColor[task.priority]}`}>
                    {task.priority}
                  </span>
                  <span className="text-sm font-medium text-foreground flex-1 truncate">{task.title}</span>
                  <span className="text-xs text-muted-foreground shrink-0">{task.status}</span>
                  {task.assignee && (
                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-foreground shrink-0">
                      {task.assignee}
                    </div>
                  )}
                  {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
                <AnimatePresence>
                  {expanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="mt-3 pt-3 border-t border-border grid sm:grid-cols-3 gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Due Date</p>
                          <p className="text-sm font-medium text-foreground">{task.dueDate || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Tags</p>
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {task.tags.length > 0 ? task.tags.map((tag) => (
                              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{tag}</span>
                            )) : <span className="text-xs text-muted-foreground">—</span>}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Description</p>
                          <p className="text-sm text-foreground">{task.description || "—"}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12"><p className="text-muted-foreground text-sm">No tasks found.</p></div>
      )}
    </motion.div>
  );
}
