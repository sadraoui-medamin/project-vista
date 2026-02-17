import { motion } from "framer-motion";
import { User, Bell, Shield, Palette, Globe, Key, Save, CreditCard, Check, Zap, Building2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, type Plan } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";

const sections = [
  { id: "profile", icon: User, label: "Profile" },
  { id: "notifications", icon: Bell, label: "Notifications" },
  { id: "security", icon: Shield, label: "Security" },
  { id: "appearance", icon: Palette, label: "Appearance" },
  { id: "integrations", icon: Globe, label: "Integrations" },
];

export default function SettingsPage() {
  const { user, setPlan } = useAuth();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account preferences</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="glass rounded-2xl p-3 space-y-1">
            {sections.map((s, i) => (
              <button
                key={s.id}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all ${
                  i === 0
                    ? "gradient-bg text-primary-foreground gradient-shadow"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <s.icon className="h-4 w-4" />
                <span>{s.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
              <User className="h-4 w-4" /> Profile Information
            </h2>
            <div className="flex items-center gap-6 mb-6">
              <div className="gradient-bg rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold text-primary-foreground">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <Button variant="outline" size="sm" className="glass border-0 rounded-xl">Change Avatar</Button>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max 2MB.</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-foreground">Full Name</Label>
                <Input defaultValue={user?.name || ""} className="glass border-0 rounded-xl h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-foreground">Email</Label>
                <Input defaultValue={user?.email || ""} className="glass border-0 rounded-xl h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-foreground">Job Title</Label>
                <Input placeholder="e.g. Product Manager" className="glass border-0 rounded-xl h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-foreground">Timezone</Label>
                <Input defaultValue="UTC-5 (Eastern)" className="glass border-0 rounded-xl h-10" />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </h2>
            <div className="space-y-4">
              {[
                { label: "Email notifications", desc: "Receive email for task assignments and mentions" },
                { label: "Push notifications", desc: "Browser notifications for real-time updates" },
                { label: "Weekly digest", desc: "Summary of your team's activity every Monday" },
                { label: "Sprint reminders", desc: "Get notified before sprint deadlines" },
              ].map((n) => (
                <div key={n.label} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                    <div className="absolute top-1 right-1 w-4 h-4 bg-primary-foreground rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Appearance */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
              <Palette className="h-4 w-4" /> Appearance
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Theme</p>
                <p className="text-xs text-muted-foreground">Switch between light and dark mode</p>
              </div>
              <ThemeToggle />
            </div>
          </div>

          {/* Security */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
              <Shield className="h-4 w-4" /> Security
            </h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-foreground">Current Password</Label>
                  <Input type="password" placeholder="••••••••" className="glass border-0 rounded-xl h-10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-foreground">New Password</Label>
                  <Input type="password" placeholder="••••••••" className="glass border-0 rounded-xl h-10" />
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline" size="sm" className="glass border-0 rounded-xl">
                  <Key className="h-3.5 w-3.5 mr-1.5" /> Enable 2FA
                </Button>
              </div>
            </div>
          </div>

          {/* Subscription */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> Subscription
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {([
                { key: "free" as Plan, name: "Free", icon: Rocket, price: "$0", desc: "Basic features for small teams" },
                { key: "pro" as Plan, name: "Pro", icon: Zap, price: "$12/mo", desc: "Advanced features & integrations" },
                { key: "enterprise" as Plan, name: "Enterprise", icon: Building2, price: "Custom", desc: "Full control & dedicated support" },
              ]).map((p) => {
                const isCurrent = user?.plan === p.key;
                return (
                  <div
                    key={p.key}
                    className={`glass rounded-2xl p-4 text-center transition-shadow duration-300 ${
                      isCurrent ? "ring-2 ring-primary/40 gradient-shadow" : "hover:gradient-shadow"
                    }`}
                  >
                    <div className={`rounded-xl w-10 h-10 flex items-center justify-center mx-auto mb-3 ${isCurrent ? "gradient-bg" : "bg-muted"}`}>
                      <p.icon className={`h-5 w-5 ${isCurrent ? "text-primary-foreground" : "text-muted-foreground"}`} />
                    </div>
                    <h3 className="font-semibold text-foreground">{p.name}</h3>
                    <p className="text-lg font-bold gradient-text">{p.price}</p>
                    <p className="text-xs text-muted-foreground mt-1 mb-3">{p.desc}</p>
                    {isCurrent ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                        <Check className="h-3 w-3" /> Current Plan
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        className="gradient-bg gradient-shadow text-primary-foreground border-0 rounded-xl text-xs w-full"
                        onClick={() => setPlan(p.key)}
                      >
                        {p.key === "free" ? "Downgrade" : "Upgrade"}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end">
            <Button className="gradient-bg gradient-shadow text-primary-foreground border-0 rounded-xl px-8">
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
