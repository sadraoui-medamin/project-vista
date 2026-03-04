import { motion } from "framer-motion";
import { Users, Search, UserPlus, ExternalLink, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const members = [
  { name: "Alex Kim", email: "alex@company.com", role: "Admin", status: "Active", joined: "Jan 15, 2026" },
  { name: "Maria Johnson", email: "maria@company.com", role: "Member", status: "Active", joined: "Feb 3, 2026" },
  { name: "Sam Rivera", email: "sam@company.com", role: "Member", status: "Active", joined: "Feb 10, 2026" },
  { name: "Pat Lee", email: "pat@company.com", role: "Viewer", status: "Invited", joined: "Mar 1, 2026" },
  { name: "Jordan Chen", email: "jordan@company.com", role: "Member", status: "Active", joined: "Jan 20, 2026" },
];

export default function UserManagementPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            User Management <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage users, groups, and access requests</p>
        </div>
        <Button className="gradient-bg gradient-shadow text-primary-foreground border-0 rounded-xl gap-2">
          <UserPlus className="h-4 w-4" /> Invite User
        </Button>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." className="glass border-0 rounded-xl h-9 pl-9 text-sm" />
          </div>
          <select className="glass border-0 rounded-xl h-9 px-3 text-sm text-foreground bg-transparent">
            <option>All Roles</option>
            <option>Admin</option>
            <option>Member</option>
            <option>Viewer</option>
          </select>
        </div>
        <div className="divide-y divide-border">
          {members.map((m) => (
            <div key={m.email} className="flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="gradient-bg rounded-full w-9 h-9 flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {m.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs px-2 py-0.5 rounded-full ${m.role === "Admin" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>{m.role}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${m.status === "Active" ? "bg-green-500/20 text-green-500" : "bg-orange-500/20 text-orange-500"}`}>{m.status}</span>
                <span className="text-xs text-muted-foreground hidden sm:inline">{m.joined}</span>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
