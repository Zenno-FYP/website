import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebaseUser } from "@/stores/useAuthHooks";
import {
  fetchPerformanceMetrics,
  type PerformanceMetricsResponse,
} from "@/services/api";
import { WelcomeBanner } from "@/components/WelcomeBanner";
import { KeyMetricsCard } from "@/components/KeyMetricsCard";
import { DeveloperTrendsCard } from "@/components/DeveloperTrendsCard";
import { TopAppUsageCard } from "@/components/TopAppUsageCard";
import { TopLanguagesCard } from "@/components/TopLanguagesCard";
import { ZennoAgentCard } from "@/components/ZennoAgentCard";
import { StrongestSkillsCard } from "@/components/StrongestSkillsCard";
import { RecentProjectsCard } from "@/components/RecentProjectsCard";
import { type WeekPeriod } from "@/components/WeekToggle";

interface DashboardPageProps {
  theme: "light" | "dark";
}

export function DashboardPage({ theme }: DashboardPageProps) {
  const navigate = useNavigate();
  const firebaseUser = useFirebaseUser();
  const [period, setPeriod] = useState<WeekPeriod>("current_week");
  const [performanceMetrics, setPerformanceMetrics] =
    useState<PerformanceMetricsResponse | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);

  useEffect(() => {
    if (!firebaseUser) return;
    let cancelled = false;
    setMetricsLoading(true);
    (async () => {
      try {
        const data = await fetchPerformanceMetrics(period);
        if (!cancelled) setPerformanceMetrics(data);
      } catch (error) {
        console.error("Failed to fetch performance metrics:", error);
      } finally {
        if (!cancelled) setMetricsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [firebaseUser, period]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Section */}
      <div className="lg:col-span-8 space-y-6">
        <WelcomeBanner theme={theme} />

        <div className={metricsLoading ? "opacity-60 pointer-events-none transition-opacity" : "transition-opacity"}>
          <KeyMetricsCard
            theme={theme}
            onMetricClick={() => navigate("/analytics/metrics")}
            performanceData={performanceMetrics?.performance_summary}
          />
        </div>

        <div className={metricsLoading ? "opacity-60 pointer-events-none transition-opacity" : "transition-opacity"}>
          <DeveloperTrendsCard
            theme={theme}
            usageTrendData={performanceMetrics?.usage_trend_graph}
            period={period}
            onPeriodChange={setPeriod}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TopAppUsageCard
            theme={theme}
            onViewClick={() => navigate("/analytics/apps-languages")}
          />
          <TopLanguagesCard
            theme={theme}
            onViewClick={() => navigate("/analytics/apps-languages")}
          />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        <ZennoAgentCard
          theme={theme}
          onSettingsClick={() => navigate("/zenno-agent")}
        />
        <StrongestSkillsCard
          theme={theme}
          onViewClick={() => navigate("/analytics/skills-projects")}
        />
        <RecentProjectsCard
          theme={theme}
          onViewClick={() => navigate("/analytics/skills-projects")}
        />
      </div>
    </div>
  );
}
