import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Workspace, TaskItem } from "@/types/workspace";
import { DEFAULT_COLUMNS } from "@/types/workspace";

interface Props {
  workspace: Workspace;
  onUpdate: (workspace: Workspace) => void;
}

const priorityColors: Record<string, string> = {
  Critical: "border-l-destructive",
  High: "border-l-orange-500",
  Medium: "border-l-primary",
  Low: "border-l-muted-foreground/40",
};

const priorityDot: Record<string, string> = {
  Critical: "bg-destructive",
  High: "bg-orange-500",
  Medium: "bg-primary",
  Low: "bg-muted-foreground/40",
};

export default function BoardTab({ workspace, onUpdate }: Props) {
  const columns = DEFAULT_COLUMNS[workspace.template];
  const [addOpen, setAddOpen] = useState(false);
  const [addCol, setAddCol] = useState(columns[0]);
  const [form, setForm] = useState({ title: "", description: "", priority: "Medium" as TaskItem["priority"], assignee: "", dueDate: "" });
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const handleAdd = () => {
    if (!form.title.trim()) return;
    const task: TaskItem = {
      id: `task-${Date.now()}`,
      title: form.title,
      description: form.description,
      status: addCol,
      priority: form.priority,
      assignee: form.assignee,
      dueDate: form.dueDate,
      tags: [],
      createdAt: new Date().toISOString(),
    };
    onUpdate({ ...workspace, tasks: [...workspace.tasks, task] });
    setForm({ title: "", description: "", priority: "Medium", assignee: "", dueDate: "" });
    setAddOpen(false);
  };

  const moveTask = (taskId: string, newStatus: string) => {
    onUpdate({
      ...workspace,
      tasks: workspace.tasks.map((t) => t.id === taskId ? { ...t, status: newStatus } : t),
    });
  };

  const handleDragStart = (taskId: string) => setDraggedTask(taskId);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (col: string) => {
    if (draggedTask) {
      moveTask(draggedTask, col);
      setDraggedTask(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-muted-foreground">{workspace.tasks.length} tasks across {columns.length} columns</p>
        <Button size="sm" onClick={() => setAddOpen(true)} className="gradient-bg text-primary-foreground border-0 rounded-xl text-xs">
          <Plus className="h-3.5 w-3.5 mr-1" /> Add Task
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colTasks = workspace.tasks.filter((t) => t.status === col);
          return (
            <div
              key={col}
              className="min-w-[260px] flex-1"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(col)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{col}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{colTasks.length}</span>
                </div>
                <button onClick={() => { setAddCol(col); setAddOpen(true); }} className="text-muted-foreground hover:text-foreground">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                <AnimatePresence>
                  {colTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      draggable
                      onDragStart={() => handleDragStart(task.id)}
                      className={`glass rounded-xl p-3 border-l-4 ${priorityColors[task.priority]} cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                          {task.description && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{task.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1">
                              <div className={`h-2 w-2 rounded-full ${priorityDot[task.priority]}`} />
                              <span className="text-[10px] text-muted-foreground">{task.priority}</span>
                            </div>
                            {task.assignee && (
                              <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[9px] font-bold text-foreground">
                                {task.assignee}
                              </div>
                            )}
                            {task.dueDate && (
                              <span className="text-[10px] text-muted-foreground ml-auto">{task.dueDate}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="glass border-border rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input className="glass border-0 rounded-xl" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Task title" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea className="glass border-0 rounded-xl resize-none" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={addCol} onValueChange={setAddCol}>
                  <SelectTrigger className="glass border-0 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {columns.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as TaskItem["priority"] })}>
                  <SelectTrigger className="glass border-0 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Low", "Medium", "High", "Critical"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Assignee</Label>
                <Select value={form.assignee} onValueChange={(v) => setForm({ ...form, assignee: v })}>
                  <SelectTrigger className="glass border-0 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {workspace.members.map((m) => <SelectItem key={m.id} value={m.avatar}>{m.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input className="glass border-0 rounded-xl" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} placeholder="e.g. Mar 10" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAddOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.title.trim()} className="gradient-bg text-primary-foreground border-0 rounded-xl">
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
