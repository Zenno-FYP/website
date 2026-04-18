import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Code, Chrome, Terminal, MessageSquare, Figma, ArrowRight, Loader2 } from "lucide-react";
import { fetchProfilePage, ProfileGlobalAppRow } from "@/services/api";
import { useFirebaseUser } from "@/stores/useAuthHooks";

interface TopAppUsageCardProps {
  theme: 'light' | 'dark';
  onViewClick?: () => void;
}

const getAppIcon = (appName: string) => {
  const name = appName.toLowerCase();
  if (name.includes('code') || name.includes('vscode') || name.includes('vs')) return Code;
  if (name.includes('chrome') || name.includes('brave') || name.includes('firefox')) return Chrome;
  if (name.includes('terminal') || name.includes('cmd') || name.includes('powershell')) return Terminal;
  if (name.includes('slack') || name.includes('whatsapp') || name.includes('message')) return MessageSquare;
  if (name.includes('figma')) return Figma;
  return Code;
};

const APP_COLOR_PALETTE = [
  { color: "#5B6FD8", linearGradient: "linear-gradient(to bottom right, #5B6FD8, #7C4DFF)" },
  { color: "#4ECDC4", linearGradient: "linear-gradient(to bottom right, #4ECDC4, #44A6A0)" },
  { color: "#FB542B", linearGradient: "linear-gradient(to bottom right, #FB542B, #FF8C42)" },
  { color: "#FF6B9D", linearGradient: "linear-gradient(to bottom right, #FF6B9D, #FF8FA3)" },
  { color: "#FFD93D", linearGradient: "linear-gradient(to bottom right, #FFD93D, #FFC93D)" },
];

const getAppColor = (appName: string) => {
  let hash = 0;
  for (let i = 0; i < appName.length; i++) {
    hash = ((hash << 5) - hash) + appName.charCodeAt(i);
    hash = hash & hash;
  }
  return APP_COLOR_PALETTE[Math.abs(hash) % APP_COLOR_PALETTE.length];
};

export function TopAppUsageCard({ theme, onViewClick }: TopAppUsageCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apps, setApps] = useState<ProfileGlobalAppRow[]>([]);
  const firebaseUser = useFirebaseUser();

  useEffect(() => {
    if (!firebaseUser?.email) { setIsLoading(false); return; }
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    fetchProfilePage()
      .then((data) => { if (!cancelled) setApps(data.top_apps.slice(0, 5)); })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load app data');
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [firebaseUser?.uid]);

  return (
    <Card className={`p-6 rounded-3xl shadow-lg hover:shadow-xl backdrop-blur-2xl transition-all cursor-pointer overflow-hidden relative ${
      theme === 'dark'
        ? 'bg-gray-800/50 border border-white/10 hover:bg-gray-800/70'
        : 'bg-white/50 border border-white/60 hover:bg-white/70'
    }`}>
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -z-0 ${
        theme === 'dark' ? 'bg-gradient-to-br from-purple-600/15 to-transparent' : 'bg-gradient-to-br from-[#5B6FD8]/10 to-transparent'
      }`}></div>
      <div className={`absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl -z-0 ${
        theme === 'dark' ? 'bg-gradient-to-br from-[#7C4DFF]/10 to-transparent' : 'bg-gradient-to-br from-[#7C4DFF]/5 to-transparent'
      }`}></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Top Apps</h3>
            <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>All time · Top 5</p>
          </div>
          <Button
            onClick={onViewClick}
            size="sm"
            className={`group relative overflow-hidden px-4 py-2 rounded-lg transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 text-purple-300 border border-purple-500/30 hover:border-purple-400/50'
                : 'bg-gradient-to-r from-[#5B6FD8]/10 to-[#7C4DFF]/10 hover:from-[#5B6FD8]/20 hover:to-[#7C4DFF]/20 text-[#5B6FD8] border border-[#5B6FD8]/30 hover:border-[#5B6FD8]/50'
            }`}
          >
            <span className="relative z-10 flex items-center gap-1.5">
              View Details
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className={`w-6 h-6 animate-spin ${theme === 'dark' ? 'text-white/50' : 'text-gray-400'}`} />
          </div>
        ) : error ? (
          <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>{error}</p>
          </div>
        ) : apps.length === 0 ? (
          <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <p className="text-sm">No app usage data yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {apps.map((app, index) => {
              const Icon = getAppIcon(app.name);
              const { color, linearGradient } = getAppColor(app.name);
              const displayTime = app.duration_hours < 1
                ? `${Math.round(app.duration_hours * 60)}m`
                : `${app.duration_hours.toFixed(1)}h`;

              return (
                <div
                  key={index}
                  className={`group p-4 rounded-2xl backdrop-blur-xl transition-all duration-300 hover:shadow-md border shadow-sm ${
                    theme === 'dark'
                      ? 'border-white/5 hover:bg-white/10 hover:border-white/20'
                      : 'border-gray-100/50 hover:bg-white/60 hover:border-white/80'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform"
                      style={{ background: linearGradient }}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className={`font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{app.name}</p>
                        <div className="text-right ml-3 flex-shrink-0">
                          <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{displayTime}</p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{app.percent.toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className={`relative w-full h-1.5 rounded-full overflow-hidden ${
                        theme === 'dark' ? 'bg-gray-700/80' : 'bg-gray-200/60'
                      }`}>
                        <div
                          className="absolute top-0 left-0 h-full rounded-full transition-all duration-700"
                          style={{ width: `${app.percent}%`, background: `linear-gradient(to right, ${color}, ${color}dd)` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
