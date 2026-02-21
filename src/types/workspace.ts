export type Role = "Admin" | "Manager" | "Developer" | "Designer" | "QA Lead" | "DevOps" | "Viewer";
export type MemberStatus = "Online" | "Away" | "Offline";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: MemberStatus;
  avatar: string;
}

export type TemplateKey = "kanban" | "scrum" | "bug-tracking" | "project-management" | "simple-tasks";

export interface WorkspaceTemplate {
  key: TemplateKey;
  name: string;
  description: string;
  icon: string;
  tabs: WorkspaceTab[];
  color: string;
}

export interface WorkspaceTab {
  key: string;
  label: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  assignee?: string;
  dueDate?: string;
  tags: string[];
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  template: TemplateKey;
  members: TeamMember[];
  tasks: TaskItem[];
  createdAt: string;
  color: string;
}

export const TEMPLATES: WorkspaceTemplate[] = [
  {
    key: "kanban",
    name: "Kanban",
    description: "Visualize workflow with boards and cards. Best for continuous delivery teams.",
    icon: "📋",
    color: "from-primary to-accent",
    tabs: [
      { key: "summary", label: "Summary" },
      { key: "board", label: "Board" },
      { key: "list", label: "List" },
      { key: "calendar", label: "Calendar" },
      { key: "timeline", label: "Timeline" },
    ],
  },
  {
    key: "scrum",
    name: "Scrum",
    description: "Sprint-based agile framework with backlogs, sprints, and retrospectives.",
    icon: "🏃",
    color: "from-accent to-primary",
    tabs: [
      { key: "summary", label: "Summary" },
      { key: "backlog", label: "Backlog" },
      { key: "board", label: "Sprint Board" },
      { key: "list", label: "List" },
      { key: "calendar", label: "Calendar" },
    ],
  },
  {
    key: "bug-tracking",
    name: "Bug Tracking",
    description: "Track, prioritize, and resolve bugs efficiently with severity levels.",
    icon: "🐛",
    color: "from-destructive to-primary",
    tabs: [
      { key: "summary", label: "Summary" },
      { key: "board", label: "Board" },
      { key: "list", label: "List" },
      { key: "calendar", label: "Calendar" },
      { key: "reports", label: "Reports" },
    ],
  },
  {
    key: "project-management",
    name: "Project Management",
    description: "Full project lifecycle management with milestones, Gantt charts, and resource tracking.",
    icon: "📊",
    color: "from-primary to-primary",
    tabs: [
      { key: "summary", label: "Summary" },
      { key: "board", label: "Board" },
      { key: "list", label: "List" },
      { key: "calendar", label: "Calendar" },
      { key: "timeline", label: "Timeline" },
    ],
  },
  {
    key: "simple-tasks",
    name: "Simple Tasks",
    description: "Lightweight task management for small teams or personal projects.",
    icon: "✅",
    color: "from-accent to-accent",
    tabs: [
      { key: "summary", label: "Summary" },
      { key: "list", label: "List" },
      { key: "calendar", label: "Calendar" },
    ],
  },
];

export const SHARED_MEMBERS: TeamMember[] = [
  { id: "1", name: "Alex Kim", email: "alex@projectflow.io", role: "Admin", status: "Online", avatar: "AK" },
  { id: "2", name: "Maria Johnson", email: "maria@projectflow.io", role: "Manager", status: "Online", avatar: "MJ" },
  { id: "3", name: "Sam Rivera", email: "sam@projectflow.io", role: "Developer", status: "Away", avatar: "SR" },
  { id: "4", name: "Pat Lee", email: "pat@projectflow.io", role: "Developer", status: "Offline", avatar: "PL" },
  { id: "5", name: "Jordan Chen", email: "jordan@projectflow.io", role: "Designer", status: "Online", avatar: "JC" },
  { id: "6", name: "Taylor Swift", email: "taylor@projectflow.io", role: "QA Lead", status: "Online", avatar: "TS" },
  { id: "7", name: "Casey Morgan", email: "casey@projectflow.io", role: "Developer", status: "Away", avatar: "CM" },
  { id: "8", name: "Riley Park", email: "riley@projectflow.io", role: "DevOps", status: "Online", avatar: "RP" },
];

export const DEFAULT_COLUMNS: Record<TemplateKey, string[]> = {
  kanban: ["To Do", "In Progress", "In Review", "Done"],
  scrum: ["To Do", "In Progress", "In Review", "Done"],
  "bug-tracking": ["Open", "Investigating", "In Fix", "Testing", "Closed"],
  "project-management": ["Not Started", "In Progress", "Under Review", "Completed"],
  "simple-tasks": ["To Do", "In Progress", "Done"],
};

export function generateSampleTasks(template: TemplateKey): TaskItem[] {
  const now = new Date().toISOString();
  const columns = DEFAULT_COLUMNS[template];

  const taskSets: Record<TemplateKey, Omit<TaskItem, "id" | "createdAt">[]> = {
    kanban: [
      { title: "Design landing page", status: columns[0], priority: "High", assignee: "JC", tags: ["Design"], dueDate: "Mar 10", description: "Create wireframes and mockups for the new landing page" },
      { title: "Implement auth flow", status: columns[1], priority: "Critical", assignee: "SR", tags: ["Backend"], dueDate: "Mar 5", description: "Build login, register, and password reset flows" },
      { title: "Write API docs", status: columns[1], priority: "Medium", assignee: "CM", tags: ["Docs"], dueDate: "Mar 12", description: "Document all REST endpoints" },
      { title: "Setup CI/CD", status: columns[2], priority: "High", assignee: "RP", tags: ["DevOps"], dueDate: "Mar 3", description: "Configure GitHub Actions pipeline" },
      { title: "Database migration", status: columns[3], priority: "Medium", assignee: "PL", tags: ["Backend"], dueDate: "Feb 28", description: "Migrate to new schema" },
      { title: "Mobile responsive", status: columns[0], priority: "Medium", assignee: "JC", tags: ["Frontend"], dueDate: "Mar 15" },
      { title: "Performance audit", status: columns[0], priority: "Low", assignee: "SR", tags: ["QA"], dueDate: "Mar 20" },
      { title: "User testing", status: columns[2], priority: "High", assignee: "TS", tags: ["QA"], dueDate: "Mar 8" },
    ],
    scrum: [
      { title: "User story: Login", status: columns[0], priority: "Critical", assignee: "SR", tags: ["Sprint 1"], dueDate: "Mar 5", description: "As a user, I want to log in with email" },
      { title: "User story: Dashboard", status: columns[0], priority: "High", assignee: "JC", tags: ["Sprint 1"], dueDate: "Mar 7", description: "As a user, I want to see my dashboard" },
      { title: "Spike: Payment gateway", status: columns[1], priority: "High", assignee: "CM", tags: ["Sprint 1"], dueDate: "Mar 6", description: "Research Stripe vs PayPal integration" },
      { title: "User story: Profile", status: columns[1], priority: "Medium", assignee: "PL", tags: ["Sprint 2"], dueDate: "Mar 14" },
      { title: "Bug: Session timeout", status: columns[2], priority: "Critical", assignee: "SR", tags: ["Sprint 1"], dueDate: "Mar 4" },
      { title: "User story: Notifications", status: columns[3], priority: "Medium", assignee: "JC", tags: ["Sprint 1"], dueDate: "Mar 3" },
      { title: "Retrospective notes", status: columns[0], priority: "Low", assignee: "MJ", tags: ["Process"], dueDate: "Mar 8" },
    ],
    "bug-tracking": [
      { title: "Login fails on Safari", status: columns[0], priority: "Critical", assignee: "SR", tags: ["Auth", "Browser"], dueDate: "Mar 3", description: "Users on Safari 17+ cannot log in" },
      { title: "Memory leak in dashboard", status: columns[1], priority: "High", assignee: "PL", tags: ["Performance"], dueDate: "Mar 5", description: "Dashboard leaks memory after 30min" },
      { title: "Broken pagination", status: columns[1], priority: "Medium", assignee: "CM", tags: ["UI"], dueDate: "Mar 6" },
      { title: "Incorrect date format", status: columns[2], priority: "Low", assignee: "SR", tags: ["i18n"], dueDate: "Mar 4" },
      { title: "Upload timeout", status: columns[3], priority: "High", assignee: "RP", tags: ["Backend"], dueDate: "Feb 28" },
      { title: "CSS overflow on mobile", status: columns[0], priority: "Medium", assignee: "JC", tags: ["UI", "Mobile"], dueDate: "Mar 8" },
      { title: "API rate limit error", status: columns[0], priority: "High", assignee: "CM", tags: ["Backend"], dueDate: "Mar 7" },
    ],
    "project-management": [
      { title: "Project kickoff", status: columns[3], priority: "High", assignee: "AK", tags: ["Phase 1"], dueDate: "Feb 20", description: "Initial kickoff meeting and scope definition" },
      { title: "Requirements doc", status: columns[3], priority: "High", assignee: "MJ", tags: ["Phase 1"], dueDate: "Feb 25" },
      { title: "Architecture design", status: columns[1], priority: "Critical", assignee: "SR", tags: ["Phase 2"], dueDate: "Mar 5" },
      { title: "Frontend development", status: columns[1], priority: "High", assignee: "JC", tags: ["Phase 2"], dueDate: "Mar 15" },
      { title: "Backend development", status: columns[0], priority: "High", assignee: "PL", tags: ["Phase 2"], dueDate: "Mar 20" },
      { title: "QA testing", status: columns[0], priority: "Medium", assignee: "TS", tags: ["Phase 3"], dueDate: "Mar 25" },
      { title: "Deployment", status: columns[0], priority: "High", assignee: "RP", tags: ["Phase 3"], dueDate: "Mar 30" },
      { title: "User training", status: columns[0], priority: "Medium", assignee: "MJ", tags: ["Phase 3"], dueDate: "Apr 5" },
    ],
    "simple-tasks": [
      { title: "Weekly standup notes", status: columns[0], priority: "Low", assignee: "AK", tags: ["Recurring"], dueDate: "Mar 3" },
      { title: "Update roadmap", status: columns[1], priority: "Medium", assignee: "MJ", tags: ["Planning"], dueDate: "Mar 5" },
      { title: "Review PRs", status: columns[0], priority: "High", assignee: "SR", tags: ["Dev"], dueDate: "Mar 4" },
      { title: "Client meeting prep", status: columns[0], priority: "High", assignee: "AK", tags: ["Client"], dueDate: "Mar 6" },
      { title: "Send invoices", status: columns[2], priority: "Medium", assignee: "MJ", tags: ["Admin"], dueDate: "Mar 1" },
    ],
  };

  return taskSets[template].map((t, i) => ({
    ...t,
    id: `task-${i + 1}`,
    createdAt: now,
    description: t.description || "",
  }));
}
