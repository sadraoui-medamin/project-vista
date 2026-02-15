import { motion } from "framer-motion";
import { Github, Slack, Globe, Zap, Mail } from "lucide-react";

const integrations = [
  { icon: Github, name: "GitHub", desc: "Link commits & PRs" },
  { icon: Slack, name: "Slack", desc: "Manage from chat" },
  { icon: Globe, name: "Webhooks", desc: "Custom integrations" },
  { icon: Zap, name: "Zapier", desc: "5,000+ apps" },
  { icon: Mail, name: "Email", desc: "Tasks via email" },
];

export function IntegrationsSection() {
  return (
    <section id="integrations" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full gradient-bg opacity-5 blur-3xl" />
      </div>

      <div className="container max-w-5xl relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-accent">Integrations</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-4">
            Connects to your{" "}
            <span className="gradient-text">favorite tools</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Seamlessly integrate with the tools your team already uses every day.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6">
          {integrations.map((int, i) => (
            <motion.div
              key={int.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-6 w-40 text-center hover:gradient-shadow transition-shadow duration-500 float-animation"
              style={{ animationDelay: `${i * 0.5}s` }}
            >
              <div className="gradient-bg rounded-xl w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <int.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <p className="font-semibold text-sm text-foreground">{int.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{int.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
