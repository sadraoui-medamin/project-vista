import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Workspace } from "@/types/workspace";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const priorityDot: Record<string, string> = {
  Critical: "bg-destructive",
  High: "bg-orange-500",
  Medium: "bg-primary",
  Low: "bg-muted-foreground/40",
};

export default function CalendarTab({ workspace }: { workspace: Workspace }) {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const prev = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const next = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  // Map tasks to day numbers (simplified: parse "Mar 10" style dates)
  const tasksByDay = useMemo(() => {
    const map: Record<number, typeof workspace.tasks> = {};
    const monthShort = MONTHS[month].slice(0, 3);
    workspace.tasks.forEach((t) => {
      if (t.dueDate) {
        const parts = t.dueDate.split(" ");
        if (parts.length >= 2 && parts[0] === monthShort) {
          const day = parseInt(parts[1]);
          if (!isNaN(day) && day >= 1 && day <= daysInMonth) {
            if (!map[day]) map[day] = [];
            map[day].push(t);
          }
        }
      }
    });
    return map;
  }, [workspace.tasks, month, daysInMonth]);

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const today = new Date();
  const isToday = (d: number) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">{MONTHS[month]} {year}</h3>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={prev} className="h-8 w-8 rounded-lg">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={next} className="h-8 w-8 rounded-lg">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
        ))}
        {cells.map((day, i) => (
          <div
            key={i}
            className={`min-h-[80px] rounded-lg p-1.5 text-xs ${
              day ? "bg-muted/30 hover:bg-muted/50 transition-colors" : ""
            } ${day && isToday(day) ? "ring-1 ring-primary" : ""}`}
          >
            {day && (
              <>
                <span className={`inline-block w-6 h-6 rounded-full text-center leading-6 mb-0.5 ${
                  isToday(day) ? "gradient-bg text-primary-foreground font-bold" : "text-foreground"
                }`}>
                  {day}
                </span>
                <div className="space-y-0.5">
                  {(tasksByDay[day] || []).slice(0, 3).map((t) => (
                    <div key={t.id} className="flex items-center gap-1 truncate">
                      <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${priorityDot[t.priority]}`} />
                      <span className="truncate text-[10px] text-foreground">{t.title}</span>
                    </div>
                  ))}
                  {(tasksByDay[day]?.length || 0) > 3 && (
                    <span className="text-[10px] text-muted-foreground">+{tasksByDay[day]!.length - 3} more</span>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
