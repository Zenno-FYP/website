import { Smartphone, Globe, Database, Cloud, Terminal, ArrowRight } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface StrongestSkillsCardProps {
  theme: 'light' | 'dark';
  onViewClick?: () => void;
}

export function StrongestSkillsCard({ theme, onViewClick }: StrongestSkillsCardProps) {
  const skills = [
    { 
      name: "Mobile Development", 
      percentage: 90, 
      icon: Smartphone,
      color: "from-purple-500 to-purple-600"
    },
    { 
      name: "Backend Development", 
      percentage: 85, 
      icon: Database,
      color: "from-blue-500 to-blue-600"
    },
    { 
      name: "Cloud Architecture", 
      percentage: 75, 
      icon: Cloud,
      color: "from-indigo-500 to-indigo-600"
    },
    { 
      name: "DevOps & CI/CD", 
      percentage: 65, 
      icon: Terminal,
      color: "from-cyan-500 to-cyan-600"
    },
    { 
      name: "Web Frontend", 
      percentage: 30, 
      icon: Globe,
      color: "from-pink-500 to-pink-600"
    },
  ];

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
          <h3 className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
            Strongest Skills
          </h3>
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

        <div className="space-y-5">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {skill.name}
                    </span>
                  </div>
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {skill.percentage}%
                  </span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${
                  theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
                }`}>
                  <div 
                    className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${skill.percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}