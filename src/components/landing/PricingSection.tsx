import { motion } from "framer-motion";
import { Check, Zap, Building2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingSectionProps {
  onGetStarted?: () => void;
}

const plans = [
  {
    name: "Free",
    icon: Rocket,
    price: "$0",
    period: "forever",
    desc: "Perfect for small teams just getting started.",
    features: [
      "Up to 5 team members",
      "3 active projects",
      "Basic Kanban boards",
      "1 GB storage",
      "Community support",
      "Basic analytics",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    icon: Zap,
    price: "$12",
    period: "per user / month",
    desc: "For growing teams that need more power.",
    features: [
      "Unlimited team members",
      "Unlimited projects",
      "Advanced sprints & boards",
      "50 GB storage",
      "Priority support",
      "Time tracking & budgets",
      "Custom fields & labels",
      "API & webhook access",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    icon: Building2,
    price: "Custom",
    period: "tailored pricing",
    desc: "For organizations needing full control.",
    features: [
      "Everything in Pro",
      "SSO / SAML authentication",
      "Advanced RBAC & audit logs",
      "Unlimited storage",
      "Dedicated account manager",
      "Custom integrations",
      "On-premises deployment",
      "99.99% SLA guarantee",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function PricingSection({ onGetStarted }: PricingSectionProps) {
  return (
    <section id="pricing" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-[600px] h-[600px] rounded-full gradient-bg opacity-5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-accent opacity-5 blur-3xl" />
      </div>

      <div className="container max-w-6xl relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-accent">Pricing</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-4">
            Simple, <span className="gradient-text">transparent</span> pricing
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Start free and scale as your team grows. No hidden fees, no surprises.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 items-start"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={item}
              className={`glass rounded-3xl p-8 relative transition-shadow duration-500 ${
                plan.popular
                  ? "gradient-shadow ring-2 ring-primary/30"
                  : "hover:gradient-shadow"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="gradient-bg text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="gradient-bg rounded-xl w-10 h-10 flex items-center justify-center mb-4">
                <plan.icon className="h-5 w-5 text-primary-foreground" />
              </div>

              <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">{plan.desc}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold gradient-text">{plan.price}</span>
                <span className="text-sm text-muted-foreground ml-2">{plan.period}</span>
              </div>

              <Button
                className={`w-full rounded-xl h-11 text-sm font-medium mb-6 ${
                  plan.popular
                    ? "gradient-bg gradient-shadow text-primary-foreground border-0"
                    : "glass border-0 text-foreground hover:gradient-shadow"
                }`}
                onClick={onGetStarted}
              >
                {plan.cta}
              </Button>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <div className="gradient-bg rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
