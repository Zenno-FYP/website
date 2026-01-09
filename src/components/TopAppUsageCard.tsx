import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Code, Chrome, Terminal, MessageSquare, Figma, TrendingUp, ArrowRight } from "lucide-react";

type TimePeriod = "24hours" | "week" | "month" | "year";

// Data for 24 hours
const apps24Hours = [
  { 
    name: "VS Code", 
    hours: 6.5, 
    percentage: 85, 
    trend: "+12%",
    color: "#5B6FD8",
    icon: Code,
    gradient: "from-[#5B6FD8] to-[#7C4DFF]"
  },
  { 
    name: "Chrome", 
    hours: 4.2, 
    percentage: 68, 
    trend: "+8%",
    color: "#4ECDC4",
    icon: Chrome,
    gradient: "from-[#4ECDC4] to-[#44A6A0]"
  },
  { 
    name: "Terminal", 
    hours: 3.8, 
    percentage: 62, 
    trend: "+15%",
    color: "#FF6B9D",
    icon: Terminal,
    gradient: "from-[#FF6B9D] to-[#FF8FA3]"
  },
  { 
    name: "Slack", 
    hours: 2.1, 
    percentage: 45, 
    trend: "-3%",
    color: "#FFD93D",
    icon: MessageSquare,
    gradient: "from-[#FFD93D] to-[#FFC93D]"
  },
  { 
    name: "Figma", 
    hours: 1.5, 
    percentage: 30, 
    trend: "+5%",
    color: "#9B59B6",
    icon: Figma,
    gradient: "from-[#9B59B6] to-[#8E44AD]"
  },
];

// Data for week
const appsWeek = [
  { 
    name: "VS Code", 
    hours: 42, 
    percentage: 82, 
    trend: "+10%",
    color: "#5B6FD8",
    icon: Code,
    gradient: "from-[#5B6FD8] to-[#7C4DFF]"
  },
  { 
    name: "Chrome", 
    hours: 28, 
    percentage: 65, 
    trend: "+6%",
    color: "#4ECDC4",
    icon: Chrome,
    gradient: "from-[#4ECDC4] to-[#44A6A0]"
  },
  { 
    name: "Terminal", 
    hours: 24, 
    percentage: 58, 
    trend: "+12%",
    color: "#FF6B9D",
    icon: Terminal,
    gradient: "from-[#FF6B9D] to-[#FF8FA3]"
  },
  { 
    name: "Slack", 
    hours: 14, 
    percentage: 40, 
    trend: "-2%",
    color: "#FFD93D",
    icon: MessageSquare,
    gradient: "from-[#FFD93D] to-[#FFC93D]"
  },
  { 
    name: "Figma", 
    hours: 10, 
    percentage: 28, 
    trend: "+4%",
    color: "#9B59B6",
    icon: Figma,
    gradient: "from-[#9B59B6] to-[#8E44AD]"
  },
];

// Data for month
const appsMonth = [
  { 
    name: "VS Code", 
    hours: 168, 
    percentage: 80, 
    trend: "+8%",
    color: "#5B6FD8",
    icon: Code,
    gradient: "from-[#5B6FD8] to-[#7C4DFF]"
  },
  { 
    name: "Chrome", 
    hours: 115, 
    percentage: 62, 
    trend: "+5%",
    color: "#4ECDC4",
    icon: Chrome,
    gradient: "from-[#4ECDC4] to-[#44A6A0]"
  },
  { 
    name: "Terminal", 
    hours: 98, 
    percentage: 55, 
    trend: "+10%",
    color: "#FF6B9D",
    icon: Terminal,
    gradient: "from-[#FF6B9D] to-[#FF8FA3]"
  },
  { 
    name: "Slack", 
    hours: 56, 
    percentage: 38, 
    trend: "-1%",
    color: "#FFD93D",
    icon: MessageSquare,
    gradient: "from-[#FFD93D] to-[#FFC93D]"
  },
  { 
    name: "Figma", 
    hours: 42, 
    percentage: 25, 
    trend: "+3%",
    color: "#9B59B6",
    icon: Figma,
    gradient: "from-[#9B59B6] to-[#8E44AD]"
  },
];

// Data for year
const appsYear = [
  { 
    name: "VS Code", 
    hours: 2016, 
    percentage: 78, 
    trend: "+15%",
    color: "#5B6FD8",
    icon: Code,
    gradient: "from-[#5B6FD8] to-[#7C4DFF]"
  },
  { 
    name: "Chrome", 
    hours: 1380, 
    percentage: 60, 
    trend: "+10%",
    color: "#4ECDC4",
    icon: Chrome,
    gradient: "from-[#4ECDC4] to-[#44A6A0]"
  },
  { 
    name: "Terminal", 
    hours: 1176, 
    percentage: 52, 
    trend: "+18%",
    color: "#FF6B9D",
    icon: Terminal,
    gradient: "from-[#FF6B9D] to-[#FF8FA3]"
  },
  { 
    name: "Slack", 
    hours: 672, 
    percentage: 35, 
    trend: "+2%",
    color: "#FFD93D",
    icon: MessageSquare,
    gradient: "from-[#FFD93D] to-[#FFC93D]"
  },
  { 
    name: "Figma", 
    hours: 504, 
    percentage: 22, 
    trend: "+7%",
    color: "#9B59B6",
    icon: Figma,
    gradient: "from-[#9B59B6] to-[#8E44AD]"
  },
];

interface TopAppUsageCardProps {
  theme: 'light' | 'dark';
  onViewClick?: () => void;
}

export function TopAppUsageCard({ theme, onViewClick }: TopAppUsageCardProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("24hours");
  
  const getAppsData = () => {
    switch (timePeriod) {
      case "24hours":
        return apps24Hours;
      case "week":
        return appsWeek;
      case "month":
        return appsMonth;
      case "year":
        return appsYear;
      default:
        return apps24Hours;
    }
  };
  
  const apps = getAppsData();
  const totalHours = apps.reduce((sum, app) => sum + app.hours, 0);
  
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
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Total: {totalHours.toFixed(1)} hours</p>
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
        <div className="mb-4">
          <Select value={timePeriod} onValueChange={(value) => setTimePeriod(value as TimePeriod)}>
            <SelectTrigger className={`w-[140px] rounded-xl text-sm shadow-sm ${
              theme === 'dark'
                ? 'border-gray-700 bg-gray-800/50 text-white hover:bg-gray-800'
                : 'border-gray-200 bg-white text-gray-900'
            }`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={`rounded-xl backdrop-blur-2xl border shadow-2xl ${
              theme === 'dark'
                ? 'bg-gray-900/95 border-white/10'
                : 'bg-white/95 border-gray-200/50'
            }`}>
              <SelectItem value="24hours" className={theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}>Last 24 Hours</SelectItem>
              <SelectItem value="week" className={theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}>This Week</SelectItem>
              <SelectItem value="month" className={theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}>This Month</SelectItem>
              <SelectItem value="year" className={theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}>This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {apps.map((app, index) => (
            <div 
              key={index} 
              className={`group p-4 rounded-2xl backdrop-blur-xl transition-all duration-300 hover:shadow-md border shadow-sm ${
                theme === 'dark'
                  ? 'border-white/5 hover:bg-white/10 hover:border-white/20 shadow-black/10'
                  : 'border-gray-100/50 hover:bg-white/60 hover:border-white/80 shadow-gray-200/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.gradient} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
                  <app.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{app.name}</p>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${app.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {app.trend}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{app.hours}h</p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{app.percentage}%</p>
                    </div>
                  </div>
                  <div className={`relative w-full h-2 rounded-full overflow-hidden ${
                    theme === 'dark' ? 'bg-gray-700/80' : 'bg-gray-200/60'
                  }`}>
                    <div
                      className="absolute top-0 left-0 h-full rounded-full transition-all duration-700"
                      style={{ 
                        width: `${app.percentage}%`,
                        background: `linear-gradient(to right, ${app.color}, ${app.color}dd)`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Footer */}
        <div className={`mt-5 pt-5 flex items-center justify-between ${
          theme === 'dark' ? 'border-t border-white/10' : 'border-t border-gray-200/60'
        }`}>
          <div className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>+8% compared to yesterday</span>
          </div>
        </div>
      </div>
    </Card>
  );
}