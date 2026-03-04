import { motion } from "framer-motion";
import { Settings, Globe, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function WorkspaceSettingsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Workspace Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage workspace name, domains, user groups and time zone</p>
      </div>

      <div className="space-y-6">
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Settings className="h-4 w-4" /> General
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-foreground">Workspace Name</Label>
              <Input defaultValue="My Workspace" className="glass border-0 rounded-xl h-10" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-foreground">Workspace URL</Label>
              <Input defaultValue="my-workspace" className="glass border-0 rounded-xl h-10" />
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Globe className="h-4 w-4" /> Domain & Region
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-foreground">Allowed Domains</Label>
              <Input defaultValue="company.com" className="glass border-0 rounded-xl h-10" />
              <p className="text-xs text-muted-foreground">Users with these email domains can join automatically</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-foreground">Time Zone</Label>
              <Input defaultValue="UTC-5 (Eastern)" className="glass border-0 rounded-xl h-10" />
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="h-4 w-4" /> User Groups
          </h2>
          <div className="space-y-3">
            {["Engineering", "Design", "Product", "Marketing"].map((group) => (
              <div key={group} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{group}</span>
                </div>
                <Button variant="outline" size="sm" className="glass border-0 rounded-xl text-xs">Manage</Button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="gradient-bg gradient-shadow text-primary-foreground border-0 rounded-xl px-8">
            Save Changes
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
