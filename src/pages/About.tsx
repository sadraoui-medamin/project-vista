import { motion } from "framer-motion";
import { Zap, Target, Heart, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const values = [
  { icon: Target, title: "Mission-Driven", desc: "We believe every team deserves world-class project management tools, regardless of budget or size." },
  { icon: Heart, title: "Open Source First", desc: "Transparency is in our DNA. Our codebase is open, our roadmap is public, and our community drives our direction." },
  { icon: Users, title: "Community Powered", desc: "Built by developers, for developers. We listen to our community and ship what matters most." },
  { icon: Zap, title: "Performance Obsessed", desc: "Every millisecond counts. We optimize relentlessly so your tools never slow you down." },
];

const team = [
  { name: "Sarah Chen", role: "CEO & Co-Founder", avatar: "SC" },
  { name: "Marcus Webb", role: "CTO & Co-Founder", avatar: "MW" },
  { name: "Leila Patel", role: "VP of Product", avatar: "LP" },
  { name: "James O'Brien", role: "Head of Design", avatar: "JO" },
  { name: "Nina Kowalski", role: "Lead Engineer", avatar: "NK" },
  { name: "David Kim", role: "Head of Growth", avatar: "DK" },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full gradient-bg opacity-5 blur-3xl" />
      </div>

      <div className="container max-w-5xl relative z-10 px-4 py-20">
        <Button variant="ghost" className="mb-8 text-muted-foreground" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-sm font-medium text-accent">About Us</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6">
            Building the future of <span className="gradient-text">team collaboration</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-16">
            ProjectFlow was founded in 2023 with a simple mission: make project management accessible, powerful, and delightful for every team. Today, we serve 10,000+ teams across 80 countries.
          </p>
        </motion.div>

        {/* Values */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 hover:gradient-shadow transition-shadow duration-500"
            >
              <div className="gradient-bg rounded-xl w-10 h-10 flex items-center justify-center mb-4">
                <v.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Team */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl font-bold text-foreground mb-2">Meet the <span className="gradient-text">team</span></h2>
          <p className="text-muted-foreground mb-8">The people behind ProjectFlow.</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {team.map((t) => (
              <div key={t.name} className="glass rounded-2xl p-6 text-center hover:gradient-shadow transition-shadow duration-300">
                <div className="gradient-bg rounded-full w-16 h-16 flex items-center justify-center text-lg font-bold text-primary-foreground mx-auto mb-4">
                  {t.avatar}
                </div>
                <h3 className="font-semibold text-foreground">{t.name}</h3>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
