import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Check, Zap, Building2, Rocket, Download, Receipt, ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, type Plan } from "@/contexts/AuthContext";

const plans = [
  {
    key: "free" as Plan,
    name: "Free",
    icon: Rocket,
    price: "$0",
    period: "forever",
    desc: "Basic features for small teams",
    features: ["Up to 5 team members", "3 active projects", "Basic Kanban boards", "1 GB storage", "Community support"],
  },
  {
    key: "pro" as Plan,
    name: "Pro",
    icon: Zap,
    price: "$12",
    period: "per user/mo",
    desc: "Advanced features & integrations",
    popular: true,
    features: ["Unlimited members", "Unlimited projects", "Advanced sprints & boards", "50 GB storage", "Priority support", "Time tracking & budgets", "Custom fields & labels", "API & webhook access"],
  },
  {
    key: "enterprise" as Plan,
    name: "Enterprise",
    icon: Building2,
    price: "Custom",
    period: "tailored",
    desc: "Full control & dedicated support",
    features: ["Everything in Pro", "SSO / SAML auth", "Advanced RBAC & audit logs", "Unlimited storage", "Dedicated account manager", "Custom integrations", "On-premises deployment", "99.99% SLA"],
  },
];

const billingHistory = [
  { id: "INV-2026-003", date: "Mar 1, 2026", amount: "$12.00", status: "Paid", plan: "Pro" },
  { id: "INV-2026-002", date: "Feb 1, 2026", amount: "$12.00", status: "Paid", plan: "Pro" },
  { id: "INV-2026-001", date: "Jan 1, 2026", amount: "$12.00", status: "Paid", plan: "Pro" },
  { id: "INV-2025-012", date: "Dec 1, 2025", amount: "$12.00", status: "Paid", plan: "Pro" },
  { id: "INV-2025-011", date: "Nov 1, 2025", amount: "$0.00", status: "Free", plan: "Free" },
];

const featureComparison = [
  { feature: "Team members", free: "5", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Projects", free: "3", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Storage", free: "1 GB", pro: "50 GB", enterprise: "Unlimited" },
  { feature: "Kanban boards", free: "✓", pro: "✓", enterprise: "✓" },
  { feature: "Sprints", free: "—", pro: "✓", enterprise: "✓" },
  { feature: "Time tracking", free: "—", pro: "✓", enterprise: "✓" },
  { feature: "Custom fields", free: "—", pro: "✓", enterprise: "✓" },
  { feature: "API access", free: "—", pro: "✓", enterprise: "✓" },
  { feature: "SSO / SAML", free: "—", pro: "—", enterprise: "✓" },
  { feature: "Audit logs", free: "—", pro: "—", enterprise: "✓" },
  { feature: "Dedicated support", free: "—", pro: "—", enterprise: "✓" },
  { feature: "On-premises", free: "—", pro: "—", enterprise: "✓" },
  { feature: "SLA guarantee", free: "—", pro: "—", enterprise: "99.99%" },
];

export default function BillingPage() {
  const { user, setPlan } = useAuth();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your subscription and billing details</p>
      </div>

      {/* Current Plan Banner */}
      <div className="glass rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="gradient-bg rounded-xl w-12 h-12 flex items-center justify-center">
            <CreditCard className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Plan</p>
            <p className="text-xl font-bold gradient-text capitalize">{user?.plan || "free"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right mr-4">
            <p className="text-sm text-muted-foreground">Next billing date</p>
            <p className="text-sm font-medium text-foreground">Apr 1, 2026</p>
          </div>
          {user?.plan !== "enterprise" && (
            <Button className="gradient-bg gradient-shadow text-primary-foreground border-0 rounded-xl gap-2">
              <ArrowUpCircle className="h-4 w-4" /> Upgrade Plan
            </Button>
          )}
        </div>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <button
          onClick={() => setBillingCycle("monthly")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${billingCycle === "monthly" ? "gradient-bg text-primary-foreground" : "glass text-muted-foreground hover:text-foreground"}`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingCycle("yearly")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${billingCycle === "yearly" ? "gradient-bg text-primary-foreground" : "glass text-muted-foreground hover:text-foreground"}`}
        >
          Yearly <span className="text-xs opacity-75">Save 20%</span>
        </button>
      </div>

      {/* Subscription Plans */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {plans.map((p) => {
          const isCurrent = user?.plan === p.key;
          const displayPrice = billingCycle === "yearly" && p.key === "pro" ? "$10" : p.price;
          return (
            <div
              key={p.key}
              className={`glass rounded-2xl p-6 relative transition-shadow duration-300 ${
                isCurrent ? "ring-2 ring-primary/40 gradient-shadow" : p.popular ? "ring-1 ring-primary/20" : "hover:gradient-shadow"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="gradient-bg text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">Most Popular</span>
                </div>
              )}
              <div className={`rounded-xl w-10 h-10 flex items-center justify-center mb-4 ${isCurrent ? "gradient-bg" : "bg-muted"}`}>
                <p.icon className={`h-5 w-5 ${isCurrent ? "text-primary-foreground" : "text-muted-foreground"}`} />
              </div>
              <h3 className="text-lg font-bold text-foreground">{p.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{p.desc}</p>
              <div className="mb-4">
                <span className="text-3xl font-bold gradient-text">{displayPrice}</span>
                <span className="text-sm text-muted-foreground ml-1">{p.period}</span>
              </div>
              {isCurrent ? (
                <div className="inline-flex items-center gap-1 text-sm font-medium text-primary mb-4">
                  <Check className="h-4 w-4" /> Current Plan
                </div>
              ) : (
                <Button
                  size="sm"
                  className="gradient-bg gradient-shadow text-primary-foreground border-0 rounded-xl w-full mb-4"
                  onClick={() => setPlan(p.key)}
                >
                  {p.key === "free" ? "Downgrade" : "Upgrade"}
                </Button>
              )}
              <ul className="space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs">
                    <div className="gradient-bg rounded-full w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-2.5 w-2.5 text-primary-foreground" />
                    </div>
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className="glass rounded-2xl overflow-hidden mb-8">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Feature Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Feature</th>
                <th className="text-center px-4 py-3 text-muted-foreground font-medium">Free</th>
                <th className="text-center px-4 py-3 font-medium gradient-text">Pro</th>
                <th className="text-center px-4 py-3 text-muted-foreground font-medium">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {featureComparison.map((row) => (
                <tr key={row.feature} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3 text-foreground">{row.feature}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{row.free}</td>
                  <td className="px-4 py-3 text-center font-medium text-foreground">{row.pro}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{row.enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Billing History */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Receipt className="h-4 w-4" /> Billing History
          </h2>
          <Button variant="outline" size="sm" className="glass border-0 rounded-xl gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
        </div>
        <div className="divide-y divide-border">
          {billingHistory.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{inv.id}</p>
                  <p className="text-xs text-muted-foreground">{inv.date} · {inv.plan}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground">{inv.amount}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${inv.status === "Paid" ? "bg-green-500/20 text-green-500" : "bg-muted text-muted-foreground"}`}>
                  {inv.status}
                </span>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Download className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
