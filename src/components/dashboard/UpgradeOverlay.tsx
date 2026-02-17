import { Lock, ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Plan } from "@/contexts/AuthContext";

interface UpgradeOverlayProps {
  requiredPlan: Plan;
  featureName: string;
  onUpgrade: () => void;
}

export default function UpgradeOverlay({ requiredPlan, featureName, onUpgrade }: UpgradeOverlayProps) {
  return (
    <div className="relative w-full h-full min-h-[60vh]">
      {/* Blurred placeholder */}
      <div className="absolute inset-0 opacity-30 blur-sm pointer-events-none select-none">
        <div className="p-6 space-y-6">
          <div className="h-8 w-48 bg-muted rounded-xl" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-2xl p-6 h-32" />
            ))}
          </div>
          <div className="glass rounded-2xl p-6 h-64" />
        </div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/60 backdrop-blur-sm rounded-2xl">
        <div className="glass rounded-2xl p-8 max-w-sm text-center space-y-4 gradient-shadow">
          <div className="gradient-bg rounded-full w-14 h-14 flex items-center justify-center mx-auto">
            <Lock className="h-6 w-6 text-primary-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground">{featureName} is locked</h3>
          <p className="text-sm text-muted-foreground">
            Upgrade to the <span className="font-semibold gradient-text capitalize">{requiredPlan}</span> plan to unlock {featureName} and other advanced features.
          </p>
          <Button
            onClick={onUpgrade}
            className="gradient-bg gradient-shadow text-primary-foreground border-0 rounded-xl px-6 gap-2"
          >
            <ArrowUpCircle className="h-4 w-4" />
            Upgrade to {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)}
          </Button>
        </div>
      </div>
    </div>
  );
}
