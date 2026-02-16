import { motion } from "framer-motion";
import { MapPin, Briefcase, ArrowRight, ArrowLeft, Heart, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const perks = [
  { icon: Globe, title: "Remote First", desc: "Work from anywhere in the world" },
  { icon: Heart, title: "Health & Wellness", desc: "Full medical, dental, and vision" },
  { icon: Zap, title: "Growth Budget", desc: "$2,000/year for learning & conferences" },
];

const positions = [
  { title: "Senior Frontend Engineer", dept: "Engineering", location: "Remote", type: "Full-time" },
  { title: "Backend Engineer (Rust)", dept: "Engineering", location: "Remote", type: "Full-time" },
  { title: "Product Designer", dept: "Design", location: "Remote / NYC", type: "Full-time" },
  { title: "Developer Advocate", dept: "Marketing", location: "Remote", type: "Full-time" },
  { title: "Technical Writer", dept: "Product", location: "Remote", type: "Part-time" },
  { title: "QA Engineer", dept: "Engineering", location: "Remote / London", type: "Full-time" },
];

export default function Careers() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full gradient-bg opacity-5 blur-3xl" />
      </div>

      <div className="container max-w-5xl relative z-10 px-4 py-20">
        <Button variant="ghost" className="mb-8 text-muted-foreground" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-sm font-medium text-accent">Careers</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6">
            Join our <span className="gradient-text">growing team</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-16">
            We're building the future of project management and we need passionate people to help us get there. Remote-first, impact-driven, and always learning.
          </p>
        </motion.div>

        {/* Perks */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {perks.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 text-center"
            >
              <div className="gradient-bg rounded-xl w-10 h-10 flex items-center justify-center mx-auto mb-3">
                <p.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">{p.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Open positions */}
        <h2 className="text-2xl font-bold text-foreground mb-6">Open Positions</h2>
        <div className="space-y-3">
          {positions.map((pos, i) => (
            <motion.div
              key={pos.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:gradient-shadow transition-shadow duration-300 cursor-pointer group"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-foreground group-hover:gradient-text transition-all">{pos.title}</h3>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {pos.dept}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {pos.location}</span>
                  <span className="bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">{pos.type}</span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
