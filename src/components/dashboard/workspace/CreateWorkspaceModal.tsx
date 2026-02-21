import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, ChevronRight, ChevronLeft, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  TEMPLATES, SHARED_MEMBERS, type TemplateKey, type TeamMember, type Workspace,
  generateSampleTasks,
} from "@/types/workspace";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (workspace: Workspace) => void;
}

export default function CreateWorkspaceModal({ open, onOpenChange, onCreate }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const reset = () => {
    setStep(1);
    setSelectedTemplate(null);
    setName("");
    setDescription("");
    setSelectedMembers([]);
    setMemberSearch("");
    setRoleFilter("all");
  };

  const handleClose = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const handleCreate = () => {
    if (!selectedTemplate || !name.trim()) return;
    const tpl = TEMPLATES.find((t) => t.key === selectedTemplate)!;
    const members = SHARED_MEMBERS.filter((m) => selectedMembers.includes(m.id));
    const workspace: Workspace = {
      id: Date.now().toString(),
      name: name.trim(),
      description,
      template: selectedTemplate,
      members,
      tasks: generateSampleTasks(selectedTemplate),
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      color: tpl.color,
    };
    onCreate(workspace);
    handleClose(false);
  };

  const filteredMembers = SHARED_MEMBERS.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(memberSearch.toLowerCase()) || m.email.toLowerCase().includes(memberSearch.toLowerCase());
    const matchRole = roleFilter === "all" || m.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roles = Array.from(new Set(SHARED_MEMBERS.map((m) => m.role)));

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    const allIds = filteredMembers.map((m) => m.id);
    const allSelected = allIds.every((id) => selectedMembers.includes(id));
    if (allSelected) {
      setSelectedMembers((prev) => prev.filter((id) => !allIds.includes(id)));
    } else {
      setSelectedMembers((prev) => [...new Set([...prev, ...allIds])]);
    }
  };

  const statusColor: Record<string, string> = {
    Online: "bg-green-500",
    Away: "bg-amber-500",
    Offline: "bg-muted-foreground/40",
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass border-border rounded-2xl max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create Workspace</DialogTitle>
          <DialogDescription>
            {step === 1 && "Choose a template for your workspace"}
            {step === 2 && "Name your workspace and add details"}
            {step === 3 && "Select team members for this workspace"}
          </DialogDescription>
        </DialogHeader>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                s < step ? "gradient-bg text-primary-foreground" :
                s === step ? "gradient-border bg-background text-foreground" :
                "bg-muted text-muted-foreground"
              }`}>
                {s < step ? <Check className="h-4 w-4" /> : s}
              </div>
              {s < 3 && <div className={`h-0.5 w-8 rounded ${s < step ? "gradient-bg" : "bg-muted"}`} />}
            </div>
          ))}
          <span className="text-xs text-muted-foreground ml-2">
            {step === 1 ? "Template" : step === 2 ? "Details" : "Team"}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Template Selection */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.key}
                  onClick={() => setSelectedTemplate(tpl.key)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedTemplate === tpl.key
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/40 bg-background"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{tpl.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">{tpl.name}</h3>
                        {selectedTemplate === tpl.key && (
                          <div className="h-5 w-5 rounded-full gradient-bg flex items-center justify-center">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{tpl.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {tpl.tabs.map((tab) => (
                          <span key={tab.key} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            {tab.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="space-y-2">
                <Label>Workspace Name *</Label>
                <Input placeholder="e.g. Q1 Sprint Board" className="glass border-0 rounded-xl" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="What is this workspace for?" className="glass border-0 rounded-xl resize-none" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              {selectedTemplate && (
                <div className="glass rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Selected Template</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{TEMPLATES.find((t) => t.key === selectedTemplate)?.icon}</span>
                    <span className="font-medium text-foreground">{TEMPLATES.find((t) => t.key === selectedTemplate)?.name}</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 3: Team */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search members..." className="glass border-0 rounded-xl pl-9 h-9" value={memberSearch} onChange={(e) => setMemberSearch(e.target.value)} />
                  {memberSearch && (
                    <button onClick={() => setMemberSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="glass border-0 rounded-xl px-3 h-9 text-xs text-foreground bg-transparent"
                >
                  <option value="all">All Roles</option>
                  {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <button onClick={toggleAll} className="text-xs text-primary hover:underline">
                  {filteredMembers.every((m) => selectedMembers.includes(m.id)) ? "Deselect All" : "Select All"}
                </button>
                <span className="text-xs text-muted-foreground">{selectedMembers.length} selected</span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {filteredMembers.map((m) => {
                  const selected = selectedMembers.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      onClick={() => toggleMember(m.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                        selected ? "bg-primary/10 border border-primary/30" : "bg-muted/30 border border-transparent hover:border-border"
                      }`}
                    >
                      <Checkbox checked={selected} className="pointer-events-none" />
                      <div className="relative">
                        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground">
                          {m.avatar}
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${statusColor[m.status]}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium shrink-0">
                        {m.role}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)} className="rounded-xl">
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          ) : (
            <div />
          )}
          {step < 3 ? (
            <Button
              onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
              disabled={step === 1 && !selectedTemplate}
              className="gradient-bg gradient-shadow text-primary-foreground border-0 rounded-xl"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleCreate}
              disabled={!name.trim()}
              className="gradient-bg gradient-shadow text-primary-foreground border-0 rounded-xl"
            >
              <Plus className="h-4 w-4 mr-2" /> Create Workspace
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
