import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-background/60 dark:bg-background/40" />

      {/* Floating orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-[10%] w-72 h-72 rounded-full gradient-bg opacity-20 blur-3xl float-animation" />
        <div className="absolute bottom-1/4 right-[10%] w-96 h-96 rounded-full gradient-bg opacity-15 blur-3xl float-animation-delayed" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-accent opacity-10 blur-3xl float-animation-slow" />
      </div>

      <div className="relative z-10 container max-w-5xl text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8"
          >
            <span className="gradient-bg rounded-full w-2 h-2" />
            <span className="text-xs text-muted-foreground font-medium">v2.0 — Now with AI-powered insights</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
            Ship projects{" "}
            <span className="gradient-text">faster together</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            The open-source project management platform for modern teams.
            Real-time collaboration, agile sprints, and powerful analytics — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="gradient-bg gradient-shadow text-primary-foreground border-0 rounded-xl text-base px-8 h-12"
            >
              Start Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="glass rounded-xl text-base px-8 h-12"
            >
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            No credit card required · Free forever for small teams
          </p>
        </motion.div>

        {/* Floating dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16"
        >
          <div className="glass-strong rounded-2xl p-1 gradient-shadow">
            <div className="rounded-xl bg-card overflow-hidden">
              {/* Mock dashboard */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-accent/60" />
                  <div className="w-3 h-3 rounded-full bg-primary/40" />
                  <div className="flex-1 glass rounded-md h-6 mx-8" />
                </div>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {["Active Tasks", "Completed", "In Review", "Blocked"].map((label, i) => (
                    <div key={label} className="glass rounded-xl p-3 text-left">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-xl font-bold mt-1 gradient-text">{[24, 156, 8, 3][i]}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="glass rounded-lg p-3 h-20">
                      <div className="h-2 w-16 bg-muted rounded mb-2" />
                      <div className="h-2 w-24 bg-muted/60 rounded mb-2" />
                      <div className="h-2 w-12 bg-primary/30 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
