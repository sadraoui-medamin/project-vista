import { motion } from "framer-motion";
import { Key, ExternalLink, Shield, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function LicensingPage() {
  const { user } = useAuth();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          Licensing <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Server and Data Center licensing</p>
      </div>

      <div className="space-y-6">
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Key className="h-4 w-4" /> Current License
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">License Type</p>
                <p className="text-sm font-medium text-foreground capitalize">{user?.plan || "Free"} License</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">License Key</p>
                <p className="text-sm font-mono text-foreground">XXXX-XXXX-XXXX-{user?.plan === "pro" ? "PRO1" : "FREE"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Expiration</p>
                <p className="text-sm font-medium text-foreground">{user?.plan === "free" ? "Never" : "Mar 4, 2027"}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Licensed Users</p>
                <p className="text-sm font-medium text-foreground">{user?.plan === "free" ? "5 / 5" : "Unlimited"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Server className="h-4 w-4" /> Deployment
          </h2>
          <div className="space-y-3">
            {[
              { label: "Cloud hosted", desc: "Managed infrastructure with automatic updates", active: true },
              { label: "On-premises", desc: "Self-hosted deployment for enterprise customers", active: user?.plan === "enterprise" },
            ].map((d) => (
              <div key={d.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{d.label}</p>
                  <p className="text-xs text-muted-foreground">{d.desc}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${d.active ? "bg-green-500/20 text-green-500" : "bg-muted text-muted-foreground"}`}>
                  {d.active ? "Active" : "Not available"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4" /> Compliance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["SOC 2", "GDPR", "HIPAA", "ISO 27001"].map((cert) => (
              <div key={cert} className="glass rounded-xl p-3 text-center">
                <p className="text-sm font-semibold text-foreground">{cert}</p>
                <p className="text-xs text-muted-foreground">Certified</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
