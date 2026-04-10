import { useState, useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useFirebaseUser } from "@/stores/useAuthHooks";
import { fetchProjectInsights } from "@/services/api";
import { Skill } from "@/services/api";

interface StrongestSkillsCardProps {
  theme: 'light' | 'dark';
  onViewClick?: () => void;
}

// Color palette for skills - using inline styles instead of Tailwind to ensure dynamic colors work
const SKILL_GRADIENTS = [
  { start: '#5B6FD8', end: '#7C4DFF' },    // Purple-Blue
  { start: '#FF6B6B', end: '#FF8787' },    // Red-Pink
  { start: '#4ECDC4', end: '#44A08D' },    // Teal-Green
  { start: '#FFE66D', end: '#FFA502' },    // Yellow-Orange
  { start: '#95E1D3', end: '#38ADA9' },    // Mint-Teal
];

export function StrongestSkillsCard({ theme, onViewClick }: StrongestSkillsCardProps) {
  const firebaseUser = useFirebaseUser();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseUser?.uid) return;

    const loadSkills = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchProjectInsights();
        setSkills(data.strongest_skills);
      } catch (err) {
        console.error('Failed to load strongest skills:', err);
        setError('Failed to load skills');
      } finally {
        setIsLoading(false);
      }
    };

    loadSkills();
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
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h3 className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
              Strongest Skills
            </h3>
          </div>
          <Button
            onClick={onViewClick}
            size="sm"
            disabled={isLoading}
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

        {isLoading ? (
          <div className="space-y-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-300/30 dark:bg-gray-600/30 rounded-full w-3/4 animate-pulse"></div>
                <div className="h-2 bg-gray-300/30 dark:bg-gray-600/30 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className={`text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`}>
            {error}
          </div>
        ) : skills.length === 0 ? (
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            No skills data available
          </div>
        ) : (
          <div className="space-y-5">
            {skills.map((skill, index) => {
              const gradient = SKILL_GRADIENTS[index % SKILL_GRADIENTS.length];
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {skill.name}
                    </span>
                    <span className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {skill.percent.toFixed(1)}%
                    </span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden w-full ${
                    theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
                  }`}>
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${Math.min(100, Math.max(0, skill.percent))}%`,
                        background: `linear-gradient(to right, ${gradient.start}, ${gradient.end})`
                      }}
                    ></div>
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