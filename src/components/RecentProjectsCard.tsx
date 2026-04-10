import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { useFirebaseUser, useUser } from "@/stores/useAuthHooks";
import { fetchProjectInsights, ProjectDetail } from "@/services/api";
import { getRelativeTime, getActivityStatus } from "@/utils/timeFormatter";

function projectListTitle(project: ProjectDetail): string {
  const d = project.display_name?.trim();
  return d && d.length > 0 ? d : project.name;
}

const PROJECT_LABEL_COLORS = [
  { bg: "from-green-500 to-emerald-600", icon: "from-green-500 to-emerald-600", iconText: "text-white" },
  { bg: "from-blue-500 to-cyan-500", icon: "from-blue-500 to-cyan-500", iconText: "text-white" },
  { bg: "from-yellow-500 to-orange-500", icon: "from-yellow-500 to-orange-500", iconText: "text-white" },
  { bg: "from-purple-500 to-pink-500", icon: "from-purple-500 to-pink-500", iconText: "text-white" },
  { bg: "from-red-500 to-rose-500", icon: "from-red-500 to-rose-500", iconText: "text-white" },
];

interface RecentProjectsCardProps {
  theme: 'light' | 'dark';
  onViewClick?: () => void;
}

export function RecentProjectsCard({ theme, onViewClick }: RecentProjectsCardProps) {
  const firebaseUser = useFirebaseUser();
  const user = useUser();
  const timezoneOffset = user?.timezone_offset ?? 0;
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseUser?.uid) return;

    const loadProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchProjectInsights();
        setProjects(data.current_projects);
      } catch (err) {
        console.error('Failed to load projects:', err);
        setError('Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [firebaseUser?.uid]);

  return (
    <Card className={`p-6 rounded-3xl shadow-lg hover:shadow-xl backdrop-blur-2xl transition-all overflow-hidden relative ${
      theme === 'dark'
        ? 'bg-gray-800/50 border border-white/10'
        : 'bg-white/50 border border-white/60'
    }`}>
      {/* Decorative gradient */}
      <div className={`absolute -top-12 -right-12 w-56 h-56 rounded-full blur-3xl -z-0 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-purple-600/15 to-transparent'
          : 'bg-gradient-to-br from-[#5B6FD8]/10 to-transparent'
      }`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Current Projects</h3>
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Active development</p>
          </div>
          <Button
            onClick={onViewClick}
            disabled={isLoading}
            size="sm"
            className={`group relative overflow-hidden px-4 py-2 rounded-lg transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 text-purple-300 border border-purple-500/30 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20 disabled:opacity-50'
                : 'bg-gradient-to-r from-[#5B6FD8]/10 to-[#7C4DFF]/10 hover:from-[#5B6FD8]/20 hover:to-[#7C4DFF]/20 text-[#5B6FD8] border border-[#5B6FD8]/30 hover:border-[#5B6FD8]/50 hover:shadow-lg hover:shadow-[#5B6FD8]/20 disabled:opacity-50'
            }`}
          >
            <span className="relative z-10 flex items-center gap-1.5">
              View Details
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Button>
        </div>
        
        <div className="space-y-3">
          {isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-300/20 dark:bg-gray-600/20 animate-pulse">
                  <div className="w-12 h-12 rounded-xl bg-gray-300/40 dark:bg-gray-600/40"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300/40 dark:bg-gray-600/40 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-300/40 dark:bg-gray-600/40 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </>
          ) : error ? (
            <div className={`text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`}>
              {error}
            </div>
          ) : projects.length === 0 ? (
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              No projects found
            </div>
          ) : (
            projects.map((project, index) => {
              const colorPair = PROJECT_LABEL_COLORS[index % PROJECT_LABEL_COLORS.length];
              const projectId = `P${index + 1}`;
              const activityStatus = getActivityStatus(project.last_active, timezoneOffset);
              const relativeTime = getRelativeTime(project.last_active, timezoneOffset);

              return (
                <div 
                  key={index} 
                  className={`group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 cursor-pointer border shadow-sm ${
                    theme === 'dark'
                      ? 'border-white/5 hover:bg-white/10 hover:border-white/20 hover:shadow-lg shadow-black/10'
                      : 'border-gray-100/50 hover:bg-white/60 hover:border-white/80 hover:shadow-md shadow-gray-200/50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform bg-gradient-to-br ${colorPair.icon}`}>
                    <span className={`font-semibold ${colorPair.iconText}`}>{projectId}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`truncate font-semibold mb-1.5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {projectListTitle(project)}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{relativeTime}</span>
                    </div>
                  </div>
                  <div className={`flex-shrink-0 w-2.5 h-2.5 rounded-full ${activityStatus.color}`}></div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Card>
  );
}