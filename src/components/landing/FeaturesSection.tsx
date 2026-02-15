import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Clock,
  BarChart3,
  GitBranch,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Kanban & Sprints",
    desc: "Visualize workflows with drag-and-drop boards and agile sprint planning with burndown charts.",
  },
  {
    icon: Users,
    title: "Real-Time Collaboration",
    desc: "Live presence, threaded comments with @mentions, and instant activity feeds for your team.",
  },
  {
    icon: Clock,
    title: "Time & Resources",
    desc: "Built-in time tracking, resource planning, budget monitoring, and calendar integration.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    desc: "Custom dashboards, velocity tracking, sprint retrospectives, and exportable reports.",
  },
  {
    icon: GitBranch,
    title: "Developer Integrations",
    desc: "Connect GitHub, GitLab, Slack, Zapier, and 5,000+ apps with webhooks and REST API.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    desc: "RBAC, SSO, 2FA, audit logs, and complete multi-tenant data isolation out of the box.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-32 overflow-hidden">
      {/* Subtle gradient bg */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full gradient-bg opacity-5 blur-3xl" />
      </div>

      <div className="container max-w-6xl relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-accent">Features</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-4">
            Everything you need to{" "}
            <span className="gradient-text">ship faster</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A complete toolkit for modern project management — from task tracking to enterprise security.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className="glass rounded-2xl p-6 group hover:gradient-shadow transition-shadow duration-500"
            >
              <div className="gradient-bg rounded-xl w-10 h-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
