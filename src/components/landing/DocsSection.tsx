import { motion } from "framer-motion";
import {
  BookOpen,
  Code2,
  Terminal,
  FileText,
  Puzzle,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const docs = [
  {
    icon: BookOpen,
    title: "Getting Started",
    desc: "Quick setup guide to get your first project running in under 5 minutes.",
    tag: "Beginner",
  },
  {
    icon: Code2,
    title: "API Reference",
    desc: "Complete REST API documentation with examples for every endpoint.",
    tag: "Developer",
  },
  {
    icon: Terminal,
    title: "CLI Tools",
    desc: "Command-line utilities for automation, deployment, and CI/CD pipelines.",
    tag: "DevOps",
  },
  {
    icon: Puzzle,
    title: "Integrations Guide",
    desc: "Step-by-step instructions for connecting GitHub, Slack, Zapier, and more.",
    tag: "Guide",
  },
  {
    icon: FileText,
    title: "Changelog",
    desc: "Stay up to date with the latest features, fixes, and improvements.",
    tag: "Updates",
  },
  {
    icon: GraduationCap,
    title: "Tutorials",
    desc: "Video walkthroughs and tutorials for advanced workflows and features.",
    tag: "Learning",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function DocsSection() {
  return (
    <section id="docs" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] rounded-full gradient-bg opacity-5 blur-3xl" />
      </div>

      <div className="container max-w-6xl relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-accent">Documentation</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-4">
            Build with <span className="gradient-text">confidence</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Comprehensive docs, guides, and API references to help you get the most out of ProjectFlow.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {docs.map((d) => (
            <motion.div
              key={d.title}
              variants={item}
              className="glass rounded-2xl p-6 group hover:gradient-shadow transition-shadow duration-500 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="gradient-bg rounded-xl w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <d.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xs font-medium text-accent bg-accent/10 px-2.5 py-1 rounded-full">
                  {d.tag}
                </span>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">{d.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{d.desc}</p>
              <div className="flex items-center gap-1 text-sm text-primary font-medium group-hover:gap-2 transition-all">
                Read More <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            className="glass rounded-xl text-base px-8 h-12 border-0"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Browse All Documentation
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
