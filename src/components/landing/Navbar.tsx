import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = ["Features", "Integrations", "Pricing", "Docs"];

interface NavbarProps {
  onSignIn?: () => void;
  onSignUp?: () => void;
}

export function Navbar({ onSignIn, onSignUp }: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-4 inset-x-0 z-50 flex justify-center px-4"
    >
      <div className="glass rounded-2xl px-6 py-3 flex items-center justify-between w-full max-w-5xl">
        <div className="flex items-center gap-2">
          <div className="gradient-bg rounded-lg p-1.5">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground">ProjectFlow</span>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={onSignIn}
          >
            Sign In
          </Button>
          <Button
            size="sm"
            className="gradient-bg gradient-shadow text-primary-foreground border-0 rounded-xl"
            onClick={onSignUp}
          >
            Get Started
          </Button>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl mt-2 p-4 md:hidden absolute top-full w-full max-w-5xl"
        >
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="block py-2 text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {item}
            </a>
          ))}
          <div className="flex gap-2 mt-3">
            <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground" onClick={() => { setOpen(false); onSignIn?.(); }}>
              Sign In
            </Button>
            <Button size="sm" className="flex-1 gradient-bg gradient-shadow text-primary-foreground border-0 rounded-xl" onClick={() => { setOpen(false); onSignUp?.(); }}>
              Get Started
            </Button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
