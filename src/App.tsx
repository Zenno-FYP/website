import { useState, useEffect } from "react";
import { Routes, Route, Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useIsCheckingAuth, useFirebaseUser } from "@/stores/useAuthHooks";
import { useSyncProfileOnLogin } from "@/hooks/useSyncProfileOnLogin";
import { MainLayout } from "@/layouts/MainLayout";
import { AuthPage } from "@/components/AuthPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ZennoAgentPage } from "@/components/ZennoAgentPage";
import { ChatsPage } from "@/components/ChatsPage";
import { ProfilePage } from "@/components/ProfilePage";
import { PeersPage } from "@/components/PeersPage";
import { MetricsDetailPage } from "@/components/MetricsDetailPage";
import { SkillsProjectsDetailPage } from "@/components/SkillsProjectsDetailPage";
import { AppLanguagesDetailPage } from "@/components/AppLanguagesDetailPage";
import { ProjectDetailPage } from "@/components/ProjectDetailPage";

function AuthPageRoute({ theme }: { theme: "light" | "dark" }) {
  const isCheckingAuth = useIsCheckingAuth();
  const firebaseUser = useFirebaseUser();
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white">
        Loading…
      </div>
    );
  }
  if (firebaseUser) {
    return <Navigate to="/dashboard" replace />;
  }
  return <AuthPage theme={theme} />;
}

function RequireAuth() {
  const isCheckingAuth = useIsCheckingAuth();
  const firebaseUser = useFirebaseUser();
  useSyncProfileOnLogin();

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white">
        Loading…
      </div>
    );
  }
  if (!firebaseUser) {
    return <Navigate to="/auth" replace />;
  }
  return <Outlet />;
}

function ChatsRoute({ theme }: { theme: "light" | "dark" }) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const initialPeerUserId =
    (state as { initialPeerUserId?: string } | null)?.initialPeerUserId ?? null;

  return (
    <ChatsPage
      theme={theme}
      onBack={() => navigate("/dashboard")}
      initialPeerUserId={initialPeerUserId}
      onConsumedInitialPeer={() =>
        navigate("/chats", { replace: true, state: {} })
      }
    />
  );
}

function ZennoAgentRoute({ theme }: { theme: "light" | "dark" }) {
  const navigate = useNavigate();
  return <ZennoAgentPage theme={theme} onBack={() => navigate("/dashboard")} />;
}

function ProfileRoute({ theme }: { theme: "light" | "dark" }) {
  const navigate = useNavigate();
  return <ProfilePage theme={theme} onBack={() => navigate("/dashboard")} />;
}

function PeerProfileRoute({ theme }: { theme: "light" | "dark" }) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const viewUserId =
    (state as { viewUserId?: string } | null)?.viewUserId ?? null;

  if (!viewUserId) {
    return <Navigate to="/peers" replace />;
  }

  return (
    <ProfilePage
      theme={theme}
      viewUserId={viewUserId}
      backLabel="Back to peers"
      onBack={() => navigate("/peers")}
      onStartChatWithPeer={(userId) =>
        navigate("/chats", { state: { initialPeerUserId: userId } })
      }
    />
  );
}

function PeersRoute({ theme }: { theme: "light" | "dark" }) {
  const navigate = useNavigate();
  return (
    <PeersPage
      theme={theme}
      onBack={() => navigate("/dashboard")}
      onSelectPeer={(id) =>
        navigate("/peers/profile", { state: { viewUserId: id } })
      }
    />
  );
}

function MetricsRoute({ theme }: { theme: "light" | "dark" }) {
  const navigate = useNavigate();
  return (
    <MetricsDetailPage theme={theme} onBack={() => navigate("/dashboard")} />
  );
}

function AppLanguagesRoute({ theme }: { theme: "light" | "dark" }) {
  const navigate = useNavigate();
  return (
    <AppLanguagesDetailPage
      theme={theme}
      onBack={() => navigate("/dashboard")}
    />
  );
}

function SkillsProjectsRoute({ theme }: { theme: "light" | "dark" }) {
  const navigate = useNavigate();
  return (
    <SkillsProjectsDetailPage
      theme={theme}
      onBack={() => navigate("/dashboard")}
      onProjectClick={(project) =>
        navigate(`/projects/${encodeURIComponent(project.name)}`)
      }
    />
  );
}

function ProjectDetailRoute({ theme }: { theme: "light" | "dark" }) {
  const navigate = useNavigate();
  return (
    <ProjectDetailPage
      theme={theme}
      onBack={() => navigate("/analytics/skills-projects")}
    />
  );
}

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    void useAuthStore.getState().initializeAuth();
  }, []);

  return (
    <Routes>
      <Route path="/auth" element={<AuthPageRoute theme={theme} />} />
      <Route element={<RequireAuth />}>
        <Route
          path="/"
          element={<MainLayout theme={theme} onThemeChange={setTheme} />}
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            path="dashboard"
            element={<DashboardPage theme={theme} />}
          />
          <Route
            path="zenno-agent"
            element={<ZennoAgentRoute theme={theme} />}
          />
          <Route path="chats" element={<ChatsRoute theme={theme} />} />
          <Route path="peers" element={<PeersRoute theme={theme} />} />
          <Route
            path="peers/profile"
            element={<PeerProfileRoute theme={theme} />}
          />
          <Route path="profile" element={<ProfileRoute theme={theme} />} />
          <Route
            path="analytics/metrics"
            element={<MetricsRoute theme={theme} />}
          />
          <Route
            path="analytics/apps-languages"
            element={<AppLanguagesRoute theme={theme} />}
          />
          <Route
            path="analytics/skills-projects"
            element={<SkillsProjectsRoute theme={theme} />}
          />
          <Route
            path="projects/:projectName"
            element={<ProjectDetailRoute theme={theme} />}
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
