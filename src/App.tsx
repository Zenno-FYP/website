import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useIsCheckingAuth, useFirebaseUser } from "@/stores/useAuthHooks";
import { useSyncProfileOnLogin } from "@/hooks/useSyncProfileOnLogin";
import { needsEmailVerification } from "@/lib/authHelpers";
import { MainLayout } from "@/layouts/MainLayout";
import { AuthPage } from "@/components/AuthPage";
import { LandingPage } from "@/components/landing/LandingPage";

// Lazy-load heavy authenticated pages so the initial sign-in bundle stays small.
const DashboardPage = lazy(() =>
  import("@/pages/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);
const ZennoAgentPage = lazy(() =>
  import("@/components/ZennoAgentPage").then((m) => ({ default: m.ZennoAgentPage })),
);
const ChatsPage = lazy(() =>
  import("@/components/ChatsPage").then((m) => ({ default: m.ChatsPage })),
);
const ProfilePage = lazy(() =>
  import("@/components/ProfilePage").then((m) => ({ default: m.ProfilePage })),
);
const PeersPage = lazy(() =>
  import("@/components/PeersPage").then((m) => ({ default: m.PeersPage })),
);
const MetricsDetailPage = lazy(() =>
  import("@/components/MetricsDetailPage").then((m) => ({
    default: m.MetricsDetailPage,
  })),
);
const SkillsProjectsDetailPage = lazy(() =>
  import("@/components/SkillsProjectsDetailPage").then((m) => ({
    default: m.SkillsProjectsDetailPage,
  })),
);
const AppLanguagesDetailPage = lazy(() =>
  import("@/components/AppLanguagesDetailPage").then((m) => ({
    default: m.AppLanguagesDetailPage,
  })),
);
const ProjectDetailPage = lazy(() =>
  import("@/components/ProjectDetailPage").then((m) => ({
    default: m.ProjectDetailPage,
  })),
);
const NotificationsPage = lazy(() =>
  import("@/components/NotificationsPage").then((m) => ({
    default: m.NotificationsPage,
  })),
);
const PrivacyPolicyPage = lazy(() =>
  import("@/pages/PrivacyPolicyPage").then((m) => ({
    default: m.PrivacyPolicyPage,
  })),
);
const TermsOfServicePage = lazy(() =>
  import("@/pages/TermsOfServicePage").then((m) => ({
    default: m.TermsOfServicePage,
  })),
);
const SecurityPage = lazy(() =>
  import("@/pages/SecurityPage").then((m) => ({ default: m.SecurityPage })),
);

function PageFallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="h-8 w-8 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
    </div>
  );
}

function LandingPageRoute() {
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
    if (needsEmailVerification(firebaseUser)) {
      return <Navigate to="/auth" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  return <LandingPage />;
}

/** Marketing home — same UI as `/`, but always shown (logged-in users can open from app header). */
function PublicLandingRoute() {
  return <LandingPage />;
}

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
  // Unverified password users stay on /auth so AuthPage can render the
  // EmailVerificationCard step instead of bouncing them to the dashboard.
  if (firebaseUser && !needsEmailVerification(firebaseUser)) {
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
  // Block protected routes for password users that have not verified their email.
  if (needsEmailVerification(firebaseUser)) {
    return <Navigate to="/auth" replace />;
  }
  return <Outlet />;
}

function ChatsRoute({ theme }: { theme: "light" | "dark" }) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const stateData = state as
    | { initialPeerUserId?: string; initialConversationId?: string }
    | null;
  const initialPeerUserId = stateData?.initialPeerUserId ?? null;
  const initialConversationId = stateData?.initialConversationId ?? null;

  return (
    <ChatsPage
      theme={theme}
      onBack={() => navigate("/dashboard")}
      initialPeerUserId={initialPeerUserId}
      initialConversationId={initialConversationId}
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
      <Route path="/" element={<LandingPageRoute />} />
      <Route path="/home" element={<PublicLandingRoute />} />
      <Route path="/auth" element={<AuthPageRoute theme={theme} />} />
      <Route
        path="/privacy"
        element={
          <Suspense fallback={<PageFallback />}>
            <PrivacyPolicyPage />
          </Suspense>
        }
      />
      <Route
        path="/terms"
        element={
          <Suspense fallback={<PageFallback />}>
            <TermsOfServicePage />
          </Suspense>
        }
      />
      <Route
        path="/security"
        element={
          <Suspense fallback={<PageFallback />}>
            <SecurityPage />
          </Suspense>
        }
      />
      <Route element={<RequireAuth />}>
        <Route
          element={<MainLayout theme={theme} onThemeChange={setTheme} />}
        >
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<PageFallback />}>
                <DashboardPage theme={theme} />
              </Suspense>
            }
          />
          <Route
            path="zenno-agent"
            element={
              <Suspense fallback={<PageFallback />}>
                <ZennoAgentRoute theme={theme} />
              </Suspense>
            }
          />
          <Route
            path="chats"
            element={
              <Suspense fallback={<PageFallback />}>
                <ChatsRoute theme={theme} />
              </Suspense>
            }
          />
          <Route
            path="peers"
            element={
              <Suspense fallback={<PageFallback />}>
                <PeersRoute theme={theme} />
              </Suspense>
            }
          />
          <Route
            path="peers/profile"
            element={
              <Suspense fallback={<PageFallback />}>
                <PeerProfileRoute theme={theme} />
              </Suspense>
            }
          />
          <Route
            path="profile"
            element={
              <Suspense fallback={<PageFallback />}>
                <ProfileRoute theme={theme} />
              </Suspense>
            }
          />
          <Route
            path="analytics/metrics"
            element={
              <Suspense fallback={<PageFallback />}>
                <MetricsRoute theme={theme} />
              </Suspense>
            }
          />
          <Route
            path="analytics/apps-languages"
            element={
              <Suspense fallback={<PageFallback />}>
                <AppLanguagesRoute theme={theme} />
              </Suspense>
            }
          />
          <Route
            path="analytics/skills-projects"
            element={
              <Suspense fallback={<PageFallback />}>
                <SkillsProjectsRoute theme={theme} />
              </Suspense>
            }
          />
          <Route
            path="projects/:projectName"
            element={
              <Suspense fallback={<PageFallback />}>
                <ProjectDetailRoute theme={theme} />
              </Suspense>
            }
          />
          <Route
            path="notifications"
            element={
              <Suspense fallback={<PageFallback />}>
                <NotificationsPage />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
