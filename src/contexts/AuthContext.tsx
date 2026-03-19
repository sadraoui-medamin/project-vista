import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export type Plan = "free" | "pro" | "enterprise";
export type UserRole = "master" | "manager" | "member" | "viewer";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdBy: string; // master's email
  createdAt: string;
}

interface User {
  name: string;
  email: string;
  plan: Plan;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => boolean;
  signUp: (name: string, email: string, password: string) => void;
  signOut: () => void;
  setPlan: (plan: Plan) => void;
  // Team management (master only)
  teamMembers: TeamMember[];
  createTeamMember: (member: Omit<TeamMember, "id" | "createdBy" | "createdAt">) => void;
  deleteTeamMember: (id: string) => void;
  updateTeamMemberRole: (id: string, role: UserRole) => void;
  hasPermission: (feature: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Role-based permissions: what each role can access
const rolePermissions: Record<UserRole, Record<string, boolean | "limited">> = {
  master: {
    dashboard: true, projects: true, chat: true, team: true, time: true,
    analytics: true, billing: true, workspaceSettings: true, personalSettings: true,
    userManagement: true, licensing: true, accountSettings: true, createTeam: true,
  },
  manager: {
    dashboard: true, projects: true, chat: true, team: true, time: true,
    analytics: true, billing: false, workspaceSettings: false, personalSettings: true,
    userManagement: false, licensing: false, accountSettings: true, createTeam: false,
  },
  member: {
    dashboard: true, projects: "limited", chat: true, team: false, time: true,
    analytics: false, billing: false, workspaceSettings: false, personalSettings: true,
    userManagement: false, licensing: false, accountSettings: true, createTeam: false,
  },
  viewer: {
    dashboard: true, projects: "limited", chat: "limited", team: false, time: false,
    analytics: false, billing: false, workspaceSettings: false, personalSettings: true,
    userManagement: false, licensing: false, accountSettings: true, createTeam: false,
  },
};

function getTeamMembers(): TeamMember[] {
  const stored = localStorage.getItem("pf_team_members");
  return stored ? JSON.parse(stored) : [];
}

function saveTeamMembers(members: TeamMember[]) {
  localStorage.setItem("pf_team_members", JSON.stringify(members));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("pf_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(getTeamMembers);

  const signIn = useCallback((email: string, password: string): boolean => {
    // Check if this is a team member account
    const members = getTeamMembers();
    const teamMember = members.find((m) => m.email === email && m.password === password);
    if (teamMember) {
      const u: User = { name: teamMember.name, email: teamMember.email, plan: "free", role: teamMember.role };
      localStorage.setItem("pf_user", JSON.stringify(u));
      setUser(u);
      return true;
    }

    // Check stored master account
    const stored = localStorage.getItem("pf_user");
    const existing = stored ? JSON.parse(stored) : null;
    if (existing && existing.email === email) {
      const u: User = {
        name: existing.name || email.split("@")[0],
        email,
        plan: (existing.plan as Plan) || "free",
        role: "master",
      };
      localStorage.setItem("pf_user", JSON.stringify(u));
      setUser(u);
      return true;
    }

    // New sign in defaults to master
    const u: User = { name: email.split("@")[0], email, plan: "free", role: "master" };
    localStorage.setItem("pf_user", JSON.stringify(u));
    setUser(u);
    return true;
  }, []);

  const signUp = (name: string, email: string, _password: string) => {
    // Sign up is always master (the customer)
    const u: User = { name, email, plan: "free", role: "master" };
    localStorage.setItem("pf_user", JSON.stringify(u));
    setUser(u);
  };

  const signOut = () => {
    localStorage.removeItem("pf_user");
    setUser(null);
  };

  const setPlan = (plan: Plan) => {
    if (!user) return;
    const u = { ...user, plan };
    localStorage.setItem("pf_user", JSON.stringify(u));
    setUser(u);
  };

  const createTeamMember = useCallback(
    (member: Omit<TeamMember, "id" | "createdBy" | "createdAt">) => {
      if (!user || user.role !== "master") return;
      const newMember: TeamMember = {
        ...member,
        id: crypto.randomUUID(),
        createdBy: user.email,
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      };
      const updated = [...getTeamMembers(), newMember];
      saveTeamMembers(updated);
      setTeamMembers(updated);
    },
    [user]
  );

  const deleteTeamMember = useCallback(
    (id: string) => {
      if (!user || user.role !== "master") return;
      const updated = getTeamMembers().filter((m) => m.id !== id);
      saveTeamMembers(updated);
      setTeamMembers(updated);
    },
    [user]
  );

  const updateTeamMemberRole = useCallback(
    (id: string, role: UserRole) => {
      if (!user || user.role !== "master") return;
      const members = getTeamMembers();
      const updated = members.map((m) => (m.id === id ? { ...m, role } : m));
      saveTeamMembers(updated);
      setTeamMembers(updated);
    },
    [user]
  );

  const hasPermission = useCallback(
    (feature: string): boolean => {
      if (!user) return false;
      const perms = rolePermissions[user.role];
      return perms[feature] === true || perms[feature] === "limited";
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user, signIn, signUp, signOut, setPlan,
        teamMembers, createTeamMember, deleteTeamMember, updateTeamMemberRole, hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}

export { rolePermissions };
