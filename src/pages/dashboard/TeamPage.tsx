import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Mail, MoreHorizontal, Shield, Search, Users, UserCheck, UserX,
  ChevronDown, ChevronUp, Trash2, Edit2, Crown, Eye, EyeOff, X,
  TrendingUp, Clock, CheckCircle2, AlertCircle, Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type Role = "Admin" | "Manager" | "Developer" | "Designer" | "QA Lead" | "DevOps" | "Viewer";
type Status = "Online" | "Away" | "Offline";

interface Permission {
  key: string;
  label: string;
  description: string;
}

const allPermissions: Permission[] = [
  { key: "projects.create", label: "Create Projects", description: "Can create new projects" },
  { key: "projects.delete", label: "Delete Projects", description: "Can remove projects permanently" },
  { key: "projects.edit", label: "Edit Projects", description: "Can modify project details" },
  { key: "tasks.assign", label: "Assign Tasks", description: "Can assign tasks to team members" },
  { key: "tasks.manage", label: "Manage Tasks", description: "Can create, edit, and delete tasks" },
  { key: "team.invite", label: "Invite Members", description: "Can invite new team members" },
  { key: "team.remove", label: "Remove Members", description: "Can remove team members" },
  { key: "team.roles", label: "Manage Roles", description: "Can change member roles" },
  { key: "analytics.view", label: "View Analytics", description: "Can access analytics dashboard" },
  { key: "settings.billing", label: "Billing Access", description: "Can manage billing and plans" },
  { key: "settings.general", label: "General Settings", description: "Can modify workspace settings" },
  { key: "time.track", label: "Time Tracking", description: "Can log and view time entries" },
];

const roleDefaults: Record<Role, string[]> = {
  Admin: allPermissions.map((p) => p.key),
  Manager: ["projects.create", "projects.edit", "tasks.assign", "tasks.manage", "team.invite", "analytics.view", "time.track", "settings.general"],
  Developer: ["projects.edit", "tasks.manage", "time.track", "analytics.view"],
  Designer: ["projects.edit", "tasks.manage", "time.track"],
  "QA Lead": ["projects.edit", "tasks.manage", "tasks.assign", "analytics.view", "time.track"],
  DevOps: ["projects.edit", "projects.create", "tasks.manage", "settings.general", "time.track", "analytics.view"],
  Viewer: ["analytics.view"],
};

interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  tasks: number;
  completed: number;
  hoursWeek: number;
  avatar: string;
  permissions: string[];
  joinedAt: string;
  lastActive: string;
}

const initialMembers: Member[] = [
  { id: "1", name: "Alex Kim", email: "alex@projectflow.io", role: "Admin", status: "Online", tasks: 24, completed: 156, hoursWeek: 38, avatar: "AK", permissions: roleDefaults.Admin, joinedAt: "Jan 2024", lastActive: "Just now" },
  { id: "2", name: "Maria Johnson", email: "maria@projectflow.io", role: "Manager", status: "Online", tasks: 21, completed: 132, hoursWeek: 35, avatar: "MJ", permissions: roleDefaults.Manager, joinedAt: "Feb 2024", lastActive: "5 min ago" },
  { id: "3", name: "Sam Rivera", email: "sam@projectflow.io", role: "Developer", status: "Away", tasks: 18, completed: 98, hoursWeek: 32, avatar: "SR", permissions: roleDefaults.Developer, joinedAt: "Mar 2024", lastActive: "1h ago" },
  { id: "4", name: "Pat Lee", email: "pat@projectflow.io", role: "Developer", status: "Offline", tasks: 16, completed: 87, hoursWeek: 28, avatar: "PL", permissions: roleDefaults.Developer, joinedAt: "Mar 2024", lastActive: "3h ago" },
  { id: "5", name: "Jordan Chen", email: "jordan@projectflow.io", role: "Designer", status: "Online", tasks: 22, completed: 110, hoursWeek: 36, avatar: "JC", permissions: roleDefaults.Designer, joinedAt: "Apr 2024", lastActive: "10 min ago" },
  { id: "6", name: "Taylor Swift", email: "taylor@projectflow.io", role: "QA Lead", status: "Online", tasks: 15, completed: 74, hoursWeek: 30, avatar: "TS", permissions: roleDefaults["QA Lead"], joinedAt: "May 2024", lastActive: "Just now" },
  { id: "7", name: "Casey Morgan", email: "casey@projectflow.io", role: "Developer", status: "Away", tasks: 19, completed: 92, hoursWeek: 34, avatar: "CM", permissions: roleDefaults.Developer, joinedAt: "Jun 2024", lastActive: "30 min ago" },
  { id: "8", name: "Riley Park", email: "riley@projectflow.io", role: "DevOps", status: "Online", tasks: 12, completed: 65, hoursWeek: 40, avatar: "RP", permissions: roleDefaults.DevOps, joinedAt: "Jul 2024", lastActive: "2 min ago" },
];

const statusColors: Record<Status, string> = {
  Online: "bg-green-500",
  Away: "bg-accent",
  Offline: "bg-muted-foreground",
};

const roleColors: Record<string, string> = {
  Admin: "bg-destructive/20 text-destructive",
  Manager: "bg-primary/20 text-primary",
  Developer: "bg-accent/20 text-accent",
  Designer: "bg-primary/20 text-primary",
  "QA Lead": "bg-accent/20 text-accent",
  DevOps: "bg-primary/20 text-primary",
  Viewer: "bg-muted text-muted-foreground",
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

type ViewMode = "grid" | "list";

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editMember, setEditMember] = useState<string | null>(null);

  // Invite form
  const [invName, setInvName] = useState("");
  const [invEmail, setInvEmail] = useState("");
  const [invRole, setInvRole] = useState<Role>("Developer");

  // Edit form
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<Role>("Developer");

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch = m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.role.toLowerCase().includes(q);
    const matchRole = roleFilter === "all" || m.role === roleFilter;
    const matchStatus = statusFilter === "all" || m.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const handleInvite = () => {
    if (!invName.trim() || !invEmail.trim()) return;
    const initials = invName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
    const newMember: Member = {
      id: Date.now().toString(),
      name: invName.trim(),
      email: invEmail.trim(),
      role: invRole,
      status: "Offline",
      tasks: 0,
      completed: 0,
      hoursWeek: 0,
      avatar: initials,
      permissions: [...roleDefaults[invRole]],
      joinedAt: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      lastActive: "Never",
    };
    setMembers((prev) => [...prev, newMember]);
    setInvName("");
    setInvEmail("");
    setInvRole("Developer");
    setInviteOpen(false);
  };

  const handleDelete = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setDeleteConfirm(null);
    setExpandedId(null);
  };

  const handleEditOpen = (m: Member) => {
    setEditMember(m.id);
    setEditName(m.name);
    setEditRole(m.role);
  };

  const handleEditSave = () => {
    if (!editMember) return;
    setMembers((prev) =>
      prev.map((m) =>
        m.id === editMember
          ? { ...m, name: editName, role: editRole, avatar: editName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) }
          : m
      )
    );
    setEditMember(null);
  };

  const togglePermission = (memberId: string, permKey: string) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== memberId) return m;
        const has = m.permissions.includes(permKey);
        return { ...m, permissions: has ? m.permissions.filter((p) => p !== permKey) : [...m.permissions, permKey] };
      })
    );
  };

  const changeRole = (memberId: string, role: Role) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role, permissions: [...roleDefaults[role]] } : m))
    );
  };

  const onlineCount = members.filter((m) => m.status === "Online").length;
  const awayCount = members.filter((m) => m.status === "Away").length;
  const totalTasks = members.reduce((s, m) => s + m.tasks, 0);
  const totalCompleted = members.reduce((s, m) => s + m.completed, 0);
  const totalHours = members.reduce((s, m) => s + m.hoursWeek, 0);
  const avgEfficiency = members.length ? Math.round((totalCompleted / (totalCompleted + totalTasks)) * 100) : 0;
  const uniqueRoles = [...new Set(members.map((m) => m.role))];

  const permMember = members.find((m) => m.id === permissionsOpen);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage members, roles, and access controls</p>
        </div>
        <Button onClick={() => setInviteOpen(true)} className="gradient-bg gradient-shadow text-primary-foreground border-0 rounded-xl">
          <Plus className="h-4 w-4 mr-2" /> Invite Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        {[
          { icon: Users, label: "Total Members", value: members.length, sub: `${uniqueRoles.length} roles` },
          { icon: UserCheck, label: "Online", value: onlineCount, sub: `${awayCount} away` },
          { icon: Activity, label: "Active Tasks", value: totalTasks, sub: "across team" },
          { icon: CheckCircle2, label: "Completed", value: totalCompleted, sub: "all time" },
          { icon: Clock, label: "Hours/Week", value: totalHours, sub: `avg ${members.length ? Math.round(totalHours / members.length) : 0}h` },
          { icon: TrendingUp, label: "Efficiency", value: `${avgEfficiency}%`, sub: "completion rate" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-xl font-bold gradient-text">{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Role Distribution */}
      <div className="glass rounded-2xl p-4 mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Role Distribution</h3>
        <div className="flex flex-wrap gap-2">
          {uniqueRoles.map((role) => {
            const count = members.filter((m) => m.role === role).length;
            const pct = Math.round((count / members.length) * 100);
            return (
              <div key={role} className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${roleColors[role]}`}>{role}</span>
                <span className="text-xs text-muted-foreground">{count} ({pct}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or role..." className="glass border-0 rounded-xl pl-9 h-10" />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="glass border-0 rounded-xl w-[140px] h-10"><SelectValue placeholder="Role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {(["Admin", "Manager", "Developer", "Designer", "QA Lead", "DevOps", "Viewer"] as Role[]).map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="glass border-0 rounded-xl w-[140px] h-10"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Online">Online</SelectItem>
            <SelectItem value="Away">Away</SelectItem>
            <SelectItem value="Offline">Offline</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-1 glass rounded-xl p-1">
          <button onClick={() => setViewMode("grid")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${viewMode === "grid" ? "gradient-bg text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>Grid</button>
          <button onClick={() => setViewMode("list")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${viewMode === "list" ? "gradient-bg text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>List</button>
        </div>
      </div>

      {/* Members */}
      <motion.div variants={container} initial="hidden" animate="show" className={viewMode === "grid" ? "grid md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-3"}>
        <AnimatePresence mode="popLayout">
          {filtered.map((m) => {
            const isExpanded = expandedId === m.id;
            return (
              <motion.div
                key={m.id}
                variants={item}
                layout
                exit={{ opacity: 0, scale: 0.95 }}
                className={`glass rounded-2xl overflow-hidden hover:gradient-shadow transition-shadow duration-300 group ${viewMode === "list" ? "flex flex-col" : ""}`}
              >
                {/* Main card */}
                <div className={`p-5 ${viewMode === "list" ? "flex items-center gap-4" : ""}`}>
                  {/* Avatar */}
                  <div className={`relative ${viewMode === "list" ? "shrink-0" : "flex items-start justify-between mb-4"}`}>
                    <div className="relative">
                      <div className="gradient-bg rounded-full w-12 h-12 flex items-center justify-center text-sm font-bold text-primary-foreground">{m.avatar}</div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card ${statusColors[m.status]}`} />
                    </div>
                    {viewMode === "grid" && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEditOpen(m)} className="text-muted-foreground hover:text-foreground p-1"><Edit2 className="h-3.5 w-3.5" /></button>
                        <button onClick={() => setPermissionsOpen(m.id)} className="text-muted-foreground hover:text-foreground p-1"><Shield className="h-3.5 w-3.5" /></button>
                        <button onClick={() => setExpandedId(isExpanded ? null : m.id)} className="text-muted-foreground hover:text-foreground p-1">
                          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className={viewMode === "list" ? "flex-1 min-w-0 flex items-center gap-6" : ""}>
                    <div className={viewMode === "list" ? "min-w-[160px]" : ""}>
                      <h3 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                        {m.name}
                        {m.role === "Admin" && <Crown className="h-3 w-3 text-accent" />}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{m.email}</span>
                      </div>
                    </div>

                    {viewMode === "list" && (
                      <>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${roleColors[m.role]}`}>{m.role}</span>
                        <span className="text-xs text-muted-foreground shrink-0">{m.tasks} active</span>
                        <span className="text-xs text-muted-foreground shrink-0">{m.completed} done</span>
                        <span className="text-xs text-muted-foreground shrink-0">{m.hoursWeek}h/wk</span>
                        <span className="text-xs text-muted-foreground shrink-0">{m.permissions.length} perms</span>
                      </>
                    )}
                  </div>

                  {viewMode === "grid" && (
                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[m.role]}`}>{m.role}</span>
                      <span className="text-xs text-muted-foreground">{m.tasks} tasks</span>
                    </div>
                  )}

                  {viewMode === "list" && (
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => handleEditOpen(m)} className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted/50"><Edit2 className="h-3.5 w-3.5" /></button>
                      <button onClick={() => setPermissionsOpen(m.id)} className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted/50"><Shield className="h-3.5 w-3.5" /></button>
                      <button onClick={() => setExpandedId(isExpanded ? null : m.id)} className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted/50">
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </button>
                      {m.role !== "Admin" && (
                        <button onClick={() => setDeleteConfirm(m.id)} className="text-muted-foreground hover:text-destructive p-1.5 rounded-lg hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></button>
                      )}
                    </div>
                  )}
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                      <div className="px-5 pb-5 pt-0 border-t border-border/50">
                        <div className="grid grid-cols-2 gap-3 mt-4 mb-4">
                          <div className="bg-muted/30 rounded-xl p-3">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Active Tasks</p>
                            <p className="text-lg font-bold text-foreground">{m.tasks}</p>
                          </div>
                          <div className="bg-muted/30 rounded-xl p-3">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Completed</p>
                            <p className="text-lg font-bold text-foreground">{m.completed}</p>
                          </div>
                          <div className="bg-muted/30 rounded-xl p-3">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Hours/Week</p>
                            <p className="text-lg font-bold text-foreground">{m.hoursWeek}h</p>
                          </div>
                          <div className="bg-muted/30 rounded-xl p-3">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Permissions</p>
                            <p className="text-lg font-bold text-foreground">{m.permissions.length}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                          <span>Joined {m.joinedAt}</span>
                          <span>Last active: {m.lastActive}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {m.permissions.slice(0, 6).map((p) => (
                            <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{allPermissions.find((ap) => ap.key === p)?.label || p}</span>
                          ))}
                          {m.permissions.length > 6 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">+{m.permissions.length - 6} more</span>}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setPermissionsOpen(m.id)} className="rounded-xl text-xs flex-1">
                            <Shield className="h-3 w-3 mr-1" /> Manage Access
                          </Button>
                          {m.role !== "Admin" && (
                            <Button size="sm" variant="outline" onClick={() => setDeleteConfirm(m.id)} className="rounded-xl text-xs text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30">
                              <Trash2 className="h-3 w-3 mr-1" /> Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="glass rounded-2xl p-12 text-center">
          <UserX className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No members match your filters</p>
        </div>
      )}

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="glass border-border rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Invite Team Member</DialogTitle>
            <DialogDescription>Send an invitation to join your workspace</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Full Name</label>
              <Input value={invName} onChange={(e) => setInvName(e.target.value)} placeholder="John Doe" className="glass border-0 rounded-xl" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Email</label>
              <Input value={invEmail} onChange={(e) => setInvEmail(e.target.value)} placeholder="john@company.com" type="email" className="glass border-0 rounded-xl" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Role</label>
              <Select value={invRole} onValueChange={(v) => setInvRole(v as Role)}>
                <SelectTrigger className="glass border-0 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["Admin", "Manager", "Developer", "Designer", "QA Lead", "DevOps", "Viewer"] as Role[]).map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="bg-muted/30 rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1">Default permissions for <span className="font-medium text-foreground">{invRole}</span>:</p>
              <div className="flex flex-wrap gap-1">
                {roleDefaults[invRole].map((p) => (
                  <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{allPermissions.find((ap) => ap.key === p)?.label || p}</span>
                ))}
              </div>
            </div>
            <Button onClick={handleInvite} disabled={!invName.trim() || !invEmail.trim()} className="gradient-bg gradient-shadow text-primary-foreground border-0 rounded-xl w-full">
              <Mail className="h-4 w-4 mr-2" /> Send Invitation
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editMember} onOpenChange={(o) => !o && setEditMember(null)}>
        <DialogContent className="glass border-border rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Member</DialogTitle>
            <DialogDescription>Update member details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Name</label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="glass border-0 rounded-xl" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Role</label>
              <Select value={editRole} onValueChange={(v) => setEditRole(v as Role)}>
                <SelectTrigger className="glass border-0 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["Admin", "Manager", "Developer", "Designer", "QA Lead", "DevOps", "Viewer"] as Role[]).map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleEditSave} className="gradient-bg gradient-shadow text-primary-foreground border-0 rounded-xl w-full">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Permissions Dialog */}
      <Dialog open={!!permissionsOpen} onOpenChange={(o) => !o && setPermissionsOpen(null)}>
        <DialogContent className="glass border-border rounded-2xl max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <Shield className="h-5 w-5" /> Access Control — {permMember?.name}
            </DialogTitle>
            <DialogDescription>Toggle individual permissions for this team member</DialogDescription>
          </DialogHeader>
          {permMember && (
            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Quick set role preset:</p>
                </div>
                <Select value={permMember.role} onValueChange={(v) => changeRole(permMember.id, v as Role)}>
                  <SelectTrigger className="glass border-0 rounded-xl w-[140px] h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["Admin", "Manager", "Developer", "Designer", "QA Lead", "DevOps", "Viewer"] as Role[]).map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {allPermissions.map((perm) => {
                const has = permMember.permissions.includes(perm.key);
                return (
                  <div key={perm.key} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-muted/30 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-foreground">{perm.label}</p>
                      <p className="text-xs text-muted-foreground">{perm.description}</p>
                    </div>
                    <Switch checked={has} onCheckedChange={() => togglePermission(permMember.id, perm.key)} />
                  </div>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={(o) => !o && setDeleteConfirm(null)}>
        <DialogContent className="glass border-border rounded-2xl max-w-sm">
          <DialogHeader className="text-center items-center">
            <div className="bg-destructive/20 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-2">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle className="text-foreground">Remove Member?</DialogTitle>
            <DialogDescription>This member will lose access to the workspace immediately. This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1 rounded-xl">Cancel</Button>
            <Button onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="flex-1 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground">Remove</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
