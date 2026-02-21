import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, X, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TEMPLATES, type Workspace, generateSampleTasks, SHARED_MEMBERS } from "@/types/workspace";
import CreateWorkspaceModal from "@/components/dashboard/workspace/CreateWorkspaceModal";
import WorkspaceView from "@/components/dashboard/workspace/WorkspaceView";

const initialWorkspaces: Workspace[] = [
  {
    id: "1", name: "Q1 Sprint Board", description: "Main development sprint for Q1 2026", template: "scrum",
    members: SHARED_MEMBERS.slice(0, 5), tasks: generateSampleTasks("scrum"),
    createdAt: "Jan 10, 2026", color: "from-accent to-primary",
  },
  {
    id: "2", name: "Product Roadmap", description: "High-level project tracking for all teams", template: "kanban",
    members: SHARED_MEMBERS.slice(0, 6), tasks: generateSampleTasks("kanban"),
    createdAt: "Dec 5, 2025", color: "from-primary to-accent",
  },
  {
    id: "3", name: "Bug Triage", description: "Track and resolve all reported bugs", template: "bug-tracking",
    members: SHARED_MEMBERS.slice(2, 7), tasks: generateSampleTasks("bug-tracking"),
    createdAt: "Feb 1, 2026", color: "from-destructive to-primary",
  },
];

export default function ProjectsPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);

  const filtered = workspaces.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.template.toLowerCase().includes(search.toLowerCase())
  );

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);

  const handleCreate = (workspace: Workspace) => {
    setWorkspaces([workspace, ...workspaces]);
  };

  const handleUpdate = (updated: Workspace) => {
    setWorkspaces(workspaces.map((w) => w.id === updated.id ? updated : w));
  };

  // If a workspace is open, show its view
  if (activeWorkspace) {
    return (
      <WorkspaceView
        workspace={activeWorkspace}
        onBack={() => setActiveWorkspaceId(null)}
        onUpdate={handleUpdate}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Workspaces</h1>
          <p className="text-sm text-muted-foreground mt-1">Create and manage your team workspaces</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gradient-bg gradient-shadow text-primary-foreground border-0 rounded-xl">
          <Plus className="h-4 w-4 mr-2" /> New Workspace
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search workspaces..."
          className="glass border-0 rounded-xl pl-9 h-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground mb-4">{filtered.length} workspace{filtered.length !== 1 ? "s" : ""}</p>

      {/* Workspace grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((ws) => {
            const tpl = TEMPLATES.find((t) => t.key === ws.template);
            const columns = [...new Set(ws.tasks.map((t) => t.status))];
            const done = columns[columns.length - 1];
            const progress = ws.tasks.length > 0 ? Math.round((ws.tasks.filter((t) => t.status === done).length / ws.tasks.length) * 100) : 0;

            return (
              <motion.div
                key={ws.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => setActiveWorkspaceId(ws.id)}
                className="glass rounded-2xl p-6 hover:gradient-shadow transition-shadow duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{tpl?.icon}</span>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:gradient-text transition-all">{ws.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{tpl?.name}</span>
                    </div>
                  </div>
                </div>

                {ws.description && (
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{ws.description}</p>
                )}

                <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${ws.color} transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mb-4">{progress}% · {ws.tasks.length} tasks</p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    <span>{ws.members.length} members</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{ws.createdAt}</span>
                  </div>
                </div>

                {/* Tab previews */}
                <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-border">
                  {tpl?.tabs.map((tab) => (
                    <span key={tab.key} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{tab.label}</span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No workspaces found.</p>
        </div>
      )}

      <CreateWorkspaceModal open={createOpen} onOpenChange={setCreateOpen} onCreate={handleCreate} />
    </motion.div>
  );
}
