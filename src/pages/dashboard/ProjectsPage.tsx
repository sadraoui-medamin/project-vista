import { motion } from "framer-motion";
import { Plus, MoreHorizontal, Users, Calendar, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const projects = [
  { name: "Website Redesign", progress: 72, tasks: 24, members: 5, due: "Mar 15", color: "from-primary to-accent", status: "Active" },
  { name: "Mobile App v2", progress: 45, tasks: 38, members: 8, due: "Apr 1", color: "from-accent to-primary", status: "Active" },
  { name: "API Integration", progress: 89, tasks: 12, members: 3, due: "Feb 28", color: "from-primary to-primary", status: "Active" },
  { name: "Design System", progress: 100, tasks: 16, members: 4, due: "Feb 10", color: "from-accent to-accent", status: "Completed" },
  { name: "Customer Portal", progress: 15, tasks: 42, members: 6, due: "May 20", color: "from-primary to-accent", status: "Planning" },
  { name: "Data Pipeline", progress: 60, tasks: 20, members: 3, due: "Mar 30", color: "from-accent to-primary", status: "Active" },
];

const statusColors: Record<string, string> = {
  Active: "bg-accent/20 text-accent",
  Completed: "bg-green-500/20 text-green-500",
  Planning: "bg-primary/20 text-primary",
};

export default function ProjectsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and track all your team projects</p>
        </div>
        <Button className="gradient-bg gradient-shadow text-primary-foreground border-0 rounded-xl">
          <Plus className="h-4 w-4 mr-2" /> New Project
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search projects..." className="glass border-0 rounded-xl pl-9 h-10" />
        </div>
        <Button variant="outline" className="glass border-0 rounded-xl">
          <Filter className="h-4 w-4 mr-2" /> Filter
        </Button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.name} className="glass rounded-2xl p-6 hover:gradient-shadow transition-shadow duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground group-hover:gradient-text transition-all">{project.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${statusColors[project.status]}`}>
                  {project.status}
                </span>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-3">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${project.color} transition-all duration-500`}
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mb-4">{project.progress}% complete · {project.tasks} tasks</p>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                <span>{project.members} members</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>Due {project.due}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
