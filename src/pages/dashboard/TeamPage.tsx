import { motion } from "framer-motion";
import { Plus, Mail, MoreHorizontal, Shield, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const members = [
  { name: "Alex Kim", email: "alex@projectflow.io", role: "Admin", status: "Online", tasks: 24, avatar: "AK" },
  { name: "Maria Johnson", email: "maria@projectflow.io", role: "Manager", status: "Online", tasks: 21, avatar: "MJ" },
  { name: "Sam Rivera", email: "sam@projectflow.io", role: "Developer", status: "Away", tasks: 18, avatar: "SR" },
  { name: "Pat Lee", email: "pat@projectflow.io", role: "Developer", status: "Offline", tasks: 16, avatar: "PL" },
  { name: "Jordan Chen", email: "jordan@projectflow.io", role: "Designer", status: "Online", tasks: 22, avatar: "JC" },
  { name: "Taylor Swift", email: "taylor@projectflow.io", role: "QA Lead", status: "Online", tasks: 15, avatar: "TS" },
  { name: "Casey Morgan", email: "casey@projectflow.io", role: "Developer", status: "Away", tasks: 19, avatar: "CM" },
  { name: "Riley Park", email: "riley@projectflow.io", role: "DevOps", status: "Online", tasks: 12, avatar: "RP" },
];

const statusColors: Record<string, string> = {
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
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function TeamPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your team members and roles</p>
        </div>
        <Button className="gradient-bg gradient-shadow text-primary-foreground border-0 rounded-xl">
          <Plus className="h-4 w-4 mr-2" /> Invite Member
        </Button>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search members..." className="glass border-0 rounded-xl pl-9 h-10" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="glass rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold gradient-text">{members.length}</p>
          <p className="text-xs text-muted-foreground">Total Members</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold gradient-text">{members.filter(m => m.status === "Online").length}</p>
          <p className="text-xs text-muted-foreground">Online Now</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold gradient-text">4</p>
          <p className="text-xs text-muted-foreground">Departments</p>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid md:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {members.map((m) => (
          <motion.div key={m.email} variants={item} className="glass rounded-2xl p-5 hover:gradient-shadow transition-shadow duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="relative">
                <div className="gradient-bg rounded-full w-12 h-12 flex items-center justify-center text-sm font-bold text-primary-foreground">
                  {m.avatar}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card ${statusColors[m.status]}`} />
              </div>
              <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            <h3 className="font-semibold text-foreground text-sm">{m.name}</h3>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 mb-3">
              <Mail className="h-3 w-3" />
              <span className="truncate">{m.email}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[m.role]}`}>
                {m.role}
              </span>
              <span className="text-xs text-muted-foreground">{m.tasks} tasks</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
