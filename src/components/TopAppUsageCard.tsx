import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Code, Chrome, Terminal, MessageSquare, Figma, TrendingUp, ArrowRight, Loader2 } from "lucide-react";
import { fetchToolUsage, TopApp } from "@/services/api";
import { useFirebaseUser } from "@/stores/useAuthHooks";

interface TopAppUsageCardProps {
  theme: 'light' | 'dark';
  onViewClick?: () => void;
}

// Map app names to icons for better display
const getAppIcon = (appName: string) => {
  const name = appName.toLowerCase();
  if (name.includes('code') || name.includes('vscode') || name.includes('vs')) return Code;
  if (name.includes('chrome') || name.includes('brave') || name.includes('firefox')) return Chrome;
  if (name.includes('terminal') || name.includes('cmd') || name.includes('powershell')) return Terminal;
  if (name.includes('slack') || name.includes('whatsapp') || name.includes('message')) return MessageSquare;
  if (name.includes('figma')) return Figma;
  return Code;
};

// Color palette for apps
const getAppColor = (appName: string): { color: string; gradient: string } => {
  const colors: Record<string, { color: string; gradient: string }> = {
    'VS Code': { color: "#5B6FD8", gradient: "from-[#5B6FD8] to-[#7C4DFF]" },
    'Chrome': { color: "#4ECDC4", gradient: "from-[#4ECDC4] to-[#44A6A0]" },
    'Brave': { color: "#FB542B", gradient: "from-[#FB542B] to-[#FF8C42]" },
    'Terminal': { color: "#FF6B9D", gradient: "from-[#FF6B9D] to-[#FF8FA3]" },
    'Slack': { color: "#FFD93D", gradient: "from-[#FFD93D] to-[#FFC93D]" },
    'Figma': { color: "#9B59B6", gradient: "from-[#9B59B6] to-[#8E44AD]" },
    'Whatsapp': { color: "#25D366", gradient: "from-[#25D366] to-[#20BA58]" },
    'Explorer': { color: "#0078D4", gradient: "from-[#0078D4] to-[#0063B1]" },
    'Mongodbcompass': { color: "#00ED64", gradient: "from-[#00ED64] to-[#00D149]" },
  };
  
  return colors[appName] || { color: "#5B6FD8", gradient: "from-[#5B6FD8] to-[#7C4DFF]" };
};

export function TopAppUsageCard({ theme, onViewClick }: TopAppUsageCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apps, setApps] = useState<TopApp[]>([]);
  const [totalHours, setTotalHours] = useState<number>(0);
  const [usageIncrease, setUsageIncrease] = useState<number>(0);
  
  // Subscribe to firebaseUser from store
  const firebaseUser = useFirebaseUser();

  useEffect(() => {
    const loadToolUsage = async () => {
      try {
        // Only load if user exists
        if (!firebaseUser || !firebaseUser.email) {
          setIsLoading(false);
          setError(null);
          return;
        }
        
        setIsLoading(true);
        setError(null);
        
        // Get fresh token to ensure session is valid
        await firebaseUser.getIdToken(true);
        console.log('Loading tool usage for user:', firebaseUser.email);
        
        const data = await fetchToolUsage();
        setApps(data.top_apps.apps);
        setTotalHours(data.top_apps.total_usage_hours);
        setUsageIncrease(data.top_apps.usage_increase_from_yesterday_percent);
      } catch (err) {
        console.error('Failed to fetch tool usage:', err);
        const errMsg = err instanceof Error ? err.message : 'Failed to load app usage data';
        if (errMsg.includes('401') || errMsg.includes('Unauthorized')) {
          setError('Authentication failed. Please log in again');
        } else {
          setError(errMsg);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadToolUsage();
  }, [firebaseUser?.uid]);
  
  return (
    <Card className={`p-6 rounded-3xl shadow-lg hover:shadow-xl backdrop-blur-2xl transition-all cursor-pointer overflow-hidden relative ${
      theme === 'dark'
        ? 'bg-gray-800/50 border border-white/10 hover:bg-gray-800/70'
        : 'bg-white/50 border border-white/60 hover:bg-white/70'
    }`}>
      {/* Decorative gradient */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -z-0 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-purple-600/15 to-transparent'
          : 'bg-gradient-to-br from-[#5B6FD8]/10 to-transparent'
      }`}></div>
      <div className={`absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl -z-0 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-[#7C4DFF]/10 to-transparent'
          : 'bg-gradient-to-br from-[#7C4DFF]/5 to-transparent'
      }`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`mb-1.5 font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>App Usage</h3>
              </div>
              <Button
                onClick={onViewClick}
                size="sm"
                className={`group relative overflow-hidden px-4 py-2 rounded-lg transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 text-purple-300 border border-purple-500/30 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20'
                    : 'bg-gradient-to-r from-[#5B6FD8]/10 to-[#7C4DFF]/10 hover:from-[#5B6FD8]/20 hover:to-[#7C4DFF]/20 text-[#5B6FD8] border border-[#5B6FD8]/30 hover:border-[#5B6FD8]/50 hover:shadow-lg hover:shadow-[#5B6FD8]/20'
                }`}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  View Details
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className={`w-6 h-6 animate-spin ${theme === 'dark' ? 'text-white/50' : 'text-gray-400'}`} />
          </div>
        ) : error ? (
          <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Last 7 Days: {totalHours.toFixed(2)} hours</p>
            </div>

            <div className="space-y-3">
              {apps.map((app, index) => {
                const Icon = getAppIcon(app.name);
                const { color, gradient } = getAppColor(app.name);
                const trendColor = app.change_percent >= 0 ? 'text-green-600' : 'text-red-600';
                const trendBgColor = app.change_percent >= 0 ? 'bg-green-100' : 'bg-red-100';
                
                return (
                  <div 
                    key={index} 
                    className={`group p-4 rounded-2xl backdrop-blur-xl transition-all duration-300 hover:shadow-md border shadow-sm ${
                      theme === 'dark'
                        ? 'border-white/5 hover:bg-white/10 hover:border-white/20 shadow-black/10'
                        : 'border-gray-100/50 hover:bg-white/60 hover:border-white/80 shadow-gray-200/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center gap-2.5">
                            <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{app.name}</p>
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${trendBgColor} ${trendColor}`}>
                              {app.change_percent >= 0 ? '+' : ''}{app.change_percent}%
                            </span>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{app.duration_hours.toFixed(2)}h</p>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{app.percent_of_total.toFixed(1)}%</p>
                          </div>
                        </div>
                        <div className={`relative w-full h-2 rounded-full overflow-hidden ${
                          theme === 'dark' ? 'bg-gray-700/80' : 'bg-gray-200/60'
                        }`}>
                          <div
                            className="absolute top-0 left-0 h-full rounded-full transition-all duration-700"
                            style={{ 
                              width: `${app.percent_of_total}%`,
                              background: `linear-gradient(to right, ${color}, ${color}dd)`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Footer */}
            <div className={`mt-5 pt-5 flex items-center justify-between ${
              theme === 'dark' ? 'border-t border-white/10' : 'border-t border-gray-200/60'
            }`}>
              <div className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <TrendingUp className={`w-4 h-4 ${usageIncrease >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                <span>{usageIncrease >= 0 ? '+' : ''}{usageIncrease}% compared to yesterday</span>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}