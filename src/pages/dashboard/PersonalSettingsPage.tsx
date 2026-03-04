import { motion } from "framer-motion";
import { Bell, Palette, Globe } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function PersonalSettingsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Personal Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage notification preferences and themes</p>
      </div>

      <div className="space-y-6">
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </h2>
          <div className="space-y-4">
            {[
              { label: "Email notifications", desc: "Receive email for task assignments and mentions", on: true },
              { label: "Push notifications", desc: "Browser notifications for real-time updates", on: true },
              { label: "Weekly digest", desc: "Summary of your team's activity every Monday", on: false },
              { label: "Sprint reminders", desc: "Get notified before sprint deadlines", on: true },
            ].map((n) => (
              <div key={n.label} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-foreground">{n.label}</p>
                  <p className="text-xs text-muted-foreground">{n.desc}</p>
                </div>
                <div className={`w-10 h-6 rounded-full relative cursor-pointer ${n.on ? "bg-primary" : "bg-muted"}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-primary-foreground rounded-full ${n.on ? "right-1" : "left-1"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

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

        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
            <Globe className="h-4 w-4" /> Language & Region
          </h2>
          <div className="space-y-4">
            {[
              { label: "Language", value: "English" },
              { label: "Date format", value: "MM/DD/YYYY" },
              { label: "Start of week", value: "Monday" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <select className="glass border-0 rounded-xl h-9 px-3 text-sm text-foreground bg-transparent">
                  <option>{item.value}</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
