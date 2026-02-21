import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Calendar as CalendarIcon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TEMPLATES, type Workspace } from "@/types/workspace";
import SummaryTab from "./tabs/SummaryTab";
import BoardTab from "./tabs/BoardTab";
import ListTab from "./tabs/ListTab";
import CalendarTab from "./tabs/CalendarTab";
import TimelineTab from "./tabs/TimelineTab";
import ReportsTab from "./tabs/ReportsTab";
import BacklogTab from "./tabs/BacklogTab";

interface Props {
  workspace: Workspace;
  onBack: () => void;
  onUpdate: (workspace: Workspace) => void;
}

export default function WorkspaceView({ workspace, onBack, onUpdate }: Props) {
  const template = TEMPLATES.find((t) => t.key === workspace.template)!;
  const [activeTab, setActiveTab] = useState(template.tabs[0].key);

  const renderTab = (key: string) => {
    switch (key) {
      case "summary": return <SummaryTab workspace={workspace} />;
      case "board": return <BoardTab workspace={workspace} onUpdate={onUpdate} />;
      case "list": return <ListTab workspace={workspace} />;
      case "calendar": return <CalendarTab workspace={workspace} />;
      case "timeline": return <TimelineTab workspace={workspace} />;
      case "reports": return <ReportsTab workspace={workspace} />;
      case "backlog": return <BacklogTab workspace={workspace} onUpdate={onUpdate} />;
      default: return <p className="text-muted-foreground text-sm">Coming soon.</p>;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{template.icon}</span>
              <h1 className="text-xl font-bold text-foreground">{workspace.name}</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{template.name}</span>
            </div>
            {workspace.description && (
              <p className="text-xs text-muted-foreground mt-0.5 ml-8">{workspace.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {workspace.members.slice(0, 5).map((m) => (
              <div key={m.id} className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-bold text-foreground">
                {m.avatar}
              </div>
            ))}
            {workspace.members.length > 5 && (
              <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                +{workspace.members.length - 5}
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground">{workspace.members.length} members</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="glass border-0 rounded-xl mb-6 flex-wrap h-auto gap-1 p-1">
          {template.tabs.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key} className="rounded-lg text-xs data-[state=active]:gradient-bg data-[state=active]:text-primary-foreground">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {template.tabs.map((tab) => (
          <TabsContent key={tab.key} value={tab.key}>
            {renderTab(tab.key)}
          </TabsContent>
        ))}
      </Tabs>
    </motion.div>
  );
}
