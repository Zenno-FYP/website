import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

const projects = [
  { id: "P1", name: "E-Commerce Platform", stack: "MERN", stackColor: "from-green-500 to-emerald-600", lastActive: "2 hours ago" },
  { id: "P2", name: "Mobile Fitness App", stack: "Flutter", stackColor: "from-blue-500 to-cyan-500", lastActive: "1 day ago" },
  { id: "P3", name: "Data Analytics Tool", stack: "Python", stackColor: "from-yellow-500 to-orange-500", lastActive: "1 month ago" },
];

interface RecentProjectsCardProps {
  theme: 'light' | 'dark';
  onViewClick?: () => void;
}

export function RecentProjectsCard({ theme, onViewClick }: RecentProjectsCardProps) {
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
        
        <div className="space-y-3">
          {projects.map((project, index) => (
            <div 
              key={index} 
              className={`group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 cursor-pointer border shadow-sm ${
                theme === 'dark'
                  ? 'border-white/5 hover:bg-white/10 hover:border-white/20 hover:shadow-lg shadow-black/10'
                  : 'border-gray-100/50 hover:bg-white/60 hover:border-white/80 hover:shadow-md shadow-gray-200/50'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/20'
                  : 'bg-gradient-to-br from-[#5B6FD8]/10 to-[#7C4DFF]/10 border border-[#5B6FD8]/20'
              }`}>
                <span className={`font-semibold ${theme === 'dark' ? 'text-purple-400' : 'text-[#5B6FD8]'}`}>{project.id}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`truncate font-semibold mb-1.5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{project.name}</p>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r ${project.stackColor} text-white shadow-sm`}>
                    {project.stack}
                  </span>
                  <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
                  <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{project.lastActive}</span>
                </div>
              </div>
              <div className={`flex-shrink-0 w-2 h-2 rounded-full ${
                index === 0 
                  ? 'bg-green-500 shadow-lg shadow-green-500/50' 
                  : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
              }`}></div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}