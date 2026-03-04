import { useState } from "react";
import { motion } from "framer-motion";
import { User, Shield, Eye, Key, Save, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

const sections = [
  { id: "profile", icon: User, label: "Profile" },
  { id: "visibility", icon: Eye, label: "Visibility" },
  { id: "privacy", icon: Lock, label: "Privacy" },
  { id: "password", icon: Shield, label: "Password" },
];

export default function AccountSettingsPage() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your profile, visibility, and security</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <nav className="glass rounded-2xl p-3 space-y-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all ${
                  activeSection === s.id
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

        <div className="lg:col-span-3 space-y-6">
          {/* Profile */}
          {activeSection === "profile" && (
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
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm text-foreground">Bio</Label>
                  <Input placeholder="A short bio about yourself" className="glass border-0 rounded-xl h-10" />
                </div>
              </div>
            </div>
          )}

          {/* Visibility */}
          {activeSection === "visibility" && (
            <div className="glass rounded-2xl p-6">
              <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
                <Eye className="h-4 w-4" /> Visibility Settings
              </h2>
              <div className="space-y-4">
                {[
                  { label: "Profile visibility", desc: "Who can see your profile information", options: ["Everyone", "Team only", "Private"] },
                  { label: "Activity status", desc: "Show when you're online or away", options: ["Visible", "Hidden"] },
                  { label: "Email visibility", desc: "Who can see your email address", options: ["Everyone", "Team only", "Hidden"] },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <select className="glass border-0 rounded-xl h-9 px-3 text-sm text-foreground bg-transparent">
                      {item.options.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Privacy */}
          {activeSection === "privacy" && (
            <div className="glass rounded-2xl p-6">
              <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
                <Lock className="h-4 w-4" /> Privacy Settings
              </h2>
              <div className="space-y-4">
                {[
                  { label: "Data sharing", desc: "Allow anonymized data to improve the product", defaultOn: true },
                  { label: "Read receipts", desc: "Let others know when you've read their messages", defaultOn: true },
                  { label: "Search indexing", desc: "Allow your profile to appear in search results", defaultOn: false },
                  { label: "Third-party integrations", desc: "Allow connected apps to access your data", defaultOn: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <div className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${item.defaultOn ? "bg-primary" : "bg-muted"}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-primary-foreground rounded-full transition-all ${item.defaultOn ? "right-1" : "left-1"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Password */}
          {activeSection === "password" && (
            <div className="glass rounded-2xl p-6">
              <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
                <Shield className="h-4 w-4" /> Password & Security
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
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm text-foreground">Confirm New Password</Label>
                    <Input type="password" placeholder="••••••••" className="glass border-0 rounded-xl h-10" />
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 border-t border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm" className="glass border-0 rounded-xl">
                    <Key className="h-3.5 w-3.5 mr-1.5" /> Enable 2FA
                  </Button>
                </div>
                <div className="flex items-center justify-between py-3 border-t border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground">Active Sessions</p>
                    <p className="text-xs text-muted-foreground">Manage your active login sessions</p>
                  </div>
                  <Button variant="outline" size="sm" className="glass border-0 rounded-xl text-destructive hover:text-destructive">
                    Revoke All
                  </Button>
                </div>
              </div>
            </div>
          )}

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
