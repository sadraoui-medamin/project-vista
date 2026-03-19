import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, UserPlus, ExternalLink, MoreHorizontal, Trash2, Shield, Eye, EyeOff, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, type UserRole } from "@/contexts/AuthContext";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const roleDescriptions: Record<UserRole, string> = {
  master: "Full access to everything",
  manager: "Dashboard, projects, chat, team, time tracking, analytics",
  member: "Dashboard, limited projects, chat, time tracking",
  viewer: "Dashboard, view-only projects, read-only chat",
};

const roleBadgeStyles: Record<UserRole, string> = {
  master: "bg-primary/20 text-primary",
  manager: "bg-accent/20 text-accent",
  member: "bg-muted text-muted-foreground",
  viewer: "bg-orange-500/20 text-orange-500",
};

export default function UserManagementPage() {
  const { user, teamMembers, createTeamMember, deleteTeamMember, updateTeamMemberRole } = useAuth();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "member" as UserRole });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const isMaster = user?.role === "master";

  const allMembers = [
    // Master (current user)
    ...(user ? [{ id: "master", name: user.name, email: user.email, role: "master" as UserRole, status: "Active", joined: "Owner" }] : []),
    // Team members
    ...teamMembers.map((m) => ({
      id: m.id, name: m.name, email: m.email, role: m.role, status: "Active", joined: m.createdAt,
    })),
  ];

  const filtered = allMembers.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || m.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleCreate = () => {
    if (!form.name || !form.email || !form.password) return;
    createTeamMember({ name: form.name, email: form.email, password: form.password, role: form.role });
    setForm({ name: "", email: "", password: "", role: "member" });
    setInviteOpen(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            User Management <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage users, roles, and access permissions</p>
        </div>
        {isMaster && (
          <Button onClick={() => setInviteOpen(true)} className="gradient-bg gradient-shadow text-primary-foreground border-0 rounded-xl gap-2">
            <UserPlus className="h-4 w-4" /> Create Team Account
          </Button>
        )}
      </div>

      {/* Role legend */}
      <div className="glass rounded-2xl p-4 mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Shield className="h-4 w-4" /> Role Permissions</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(["master", "manager", "member", "viewer"] as UserRole[]).map((role) => (
            <div key={role} className="flex items-start gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize shrink-0 mt-0.5 ${roleBadgeStyles[role]}`}>{role}</span>
              <p className="text-xs text-muted-foreground">{roleDescriptions[role]}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="glass border-0 rounded-xl h-9 pl-9 text-sm" />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="glass border-0 rounded-xl h-9 px-3 text-sm text-foreground bg-transparent">
            <option value="all">All Roles</option>
            <option value="master">Master</option>
            <option value="manager">Manager</option>
            <option value="member">Member</option>
            <option value="viewer">Viewer</option>
          </select>
          <span className="text-xs text-muted-foreground">{filtered.length} user{filtered.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="divide-y divide-border">
          {filtered.map((m) => (
            <div key={m.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="gradient-bg rounded-full w-9 h-9 flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {m.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {isMaster && m.role !== "master" ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className={`text-xs px-2 py-0.5 rounded-full capitalize cursor-pointer flex items-center gap-1 ${roleBadgeStyles[m.role]}`}>
                        {m.role} <ChevronDown className="h-3 w-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="glass border-border rounded-xl">
                      {(["manager", "member", "viewer"] as UserRole[]).map((r) => (
                        <DropdownMenuItem key={r} onClick={() => updateTeamMemberRole(m.id, r)} className="capitalize cursor-pointer text-sm">
                          {r}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${roleBadgeStyles[m.role]}`}>{m.role}</span>
                )}
                <span className="text-xs text-muted-foreground hidden sm:inline">{m.joined}</span>
                {isMaster && m.role !== "master" && (
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive" onClick={() => setDeleteConfirm(m.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center text-muted-foreground text-sm">No users found</div>
          )}
        </div>
      </div>

      {/* Create Team Account Modal */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="glass-strong border-border rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Create Team Account</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Create an account for a team member. They can log in from the landing page using these credentials.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-sm text-foreground">Full Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Smith" className="glass border-0 rounded-xl h-10" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-foreground">Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@company.com" className="glass border-0 rounded-xl h-10" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-foreground">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="glass border-0 rounded-xl h-10 pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-foreground">Role</Label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })} className="glass border-0 rounded-xl h-10 px-3 text-sm text-foreground bg-transparent w-full">
                <option value="manager">Manager</option>
                <option value="member">Member</option>
                <option value="viewer">Viewer</option>
              </select>
              <p className="text-xs text-muted-foreground">{roleDescriptions[form.role]}</p>
            </div>
            <Button onClick={handleCreate} disabled={!form.name || !form.email || !form.password} className="w-full gradient-bg gradient-shadow text-primary-foreground border-0 rounded-xl h-10">
              Create Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent className="glass-strong border-border rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">Remove Team Member</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              This will permanently remove this user's account. They will no longer be able to log in.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1 glass border-0 rounded-xl">Cancel</Button>
            <Button variant="destructive" onClick={() => { if (deleteConfirm) deleteTeamMember(deleteConfirm); setDeleteConfirm(null); }} className="flex-1 rounded-xl">
              Remove
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
