import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full gradient-bg opacity-10 blur-3xl" />
      </div>

      <div className="container max-w-3xl relative z-10 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to{" "}
            <span className="gradient-text">transform</span> your workflow?
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-lg mx-auto">
            Join 10,000+ teams already shipping faster with ProjectFlow. Free to start, scales with your team.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="gradient-bg gradient-shadow text-primary-foreground border-0 rounded-xl text-base px-10 h-14"
            >
              Get Started for Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="glass rounded-xl text-base px-10 h-14"
            >
              Talk to Sales
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-muted-foreground">
            <span>✓ Free forever plan</span>
            <span>✓ No credit card</span>
            <span>✓ Self-host option</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
