import { motion } from "framer-motion";
import { Github, Star, GitFork, GitPullRequest, Heart, ArrowLeft, ArrowRight, Code2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const stats = [
  { icon: Star, label: "GitHub Stars", value: "12.4K" },
  { icon: GitFork, label: "Forks", value: "2.1K" },
  { icon: GitPullRequest, label: "Contributors", value: "340+" },
  { icon: Heart, label: "Sponsors", value: "89" },
];

const repos = [
  { name: "projectflow/core", desc: "Main application — React, TypeScript, Node.js", stars: "12.4K", language: "TypeScript" },
  { name: "projectflow/api", desc: "REST API server with comprehensive documentation", stars: "3.2K", language: "Rust" },
  { name: "projectflow/cli", desc: "Command-line tool for automation and CI/CD", stars: "1.8K", language: "Go" },
  { name: "projectflow/mobile", desc: "React Native mobile app for iOS and Android", stars: "2.5K", language: "TypeScript" },
  { name: "projectflow/docs", desc: "Documentation site built with Astro", stars: "890", language: "MDX" },
  { name: "projectflow/helm-chart", desc: "Kubernetes Helm chart for self-hosted deployments", stars: "640", language: "YAML" },
];

const languageColors: Record<string, string> = {
  TypeScript: "bg-primary",
  Rust: "bg-destructive",
  Go: "bg-accent",
  MDX: "bg-primary",
  YAML: "bg-accent",
};

export default function OpenSource() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full gradient-bg opacity-5 blur-3xl" />
      </div>

      <div className="container max-w-5xl relative z-10 px-4 py-20">
        <Button variant="ghost" className="mb-8 text-muted-foreground" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-sm font-medium text-accent">Open Source</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6">
            Built in the <span className="gradient-text">open</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-16">
            ProjectFlow is proudly open-source. We believe in transparency, community-driven development, and giving back to the ecosystem that makes us possible.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="glass-strong rounded-3xl p-8 gradient-shadow mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="gradient-bg rounded-xl w-10 h-10 flex items-center justify-center mx-auto mb-3">
                  <s.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <p className="text-2xl font-bold gradient-text">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Repos */}
        <h2 className="text-2xl font-bold text-foreground mb-6">Repositories</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-16">
          {repos.map((repo, i) => (
            <motion.div
              key={repo.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5 hover:gradient-shadow transition-shadow duration-300 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm text-foreground group-hover:gradient-text transition-all">{repo.name}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3" /> {repo.stars}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{repo.desc}</p>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${languageColors[repo.language]}`} />
                <span className="text-xs text-muted-foreground">{repo.language}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contribute CTA */}
        <div className="glass-strong rounded-3xl p-10 text-center gradient-shadow">
          <div className="gradient-bg rounded-xl w-14 h-14 flex items-center justify-center mx-auto mb-4">
            <Github className="h-7 w-7 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Start Contributing</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Whether it's fixing a typo or building a feature, every contribution matters. Check out our contribution guide to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="gradient-bg gradient-shadow text-primary-foreground border-0 rounded-xl px-8">
              <Github className="h-4 w-4 mr-2" /> View on GitHub
            </Button>
            <Button variant="outline" className="glass border-0 rounded-xl px-8">
              Read Contribution Guide <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
