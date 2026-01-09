import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Code2, FileCode, ArrowRight } from "lucide-react";

type TimePeriod = "24hours" | "week" | "month" | "year";

// Data for 24 hours
const languageData24Hours = [
  { label: "JavaScript", percentage: 35, color: "#5B6FD8", lines: "0.5K", files: 12 },
  { label: "Python", percentage: 28, color: "#4ECDC4", lines: "0.4K", files: 8 },
  { label: "TypeScript", percentage: 22, color: "#FF6B9D", lines: "0.3K", files: 6 },
  { label: "Go", percentage: 10, color: "#FFD93D", lines: "0.15K", files: 3 },
  { label: "Rust", percentage: 5, color: "#9B59B6", lines: "0.08K", files: 2 },
];

// Data for week
const languageDataWeek = [
  { label: "JavaScript", percentage: 35, color: "#5B6FD8", lines: "3.5K", files: 42 },
  { label: "Python", percentage: 28, color: "#4ECDC4", lines: "2.8K", files: 35 },
  { label: "TypeScript", percentage: 22, color: "#FF6B9D", lines: "2.2K", files: 28 },
  { label: "Go", percentage: 10, color: "#FFD93D", lines: "1.0K", files: 12 },
  { label: "Rust", percentage: 5, color: "#9B59B6", lines: "0.5K", files: 6 },
];

// Data for month
const languageDataMonth = [
  { label: "JavaScript", percentage: 35, color: "#5B6FD8", lines: "12.5K", files: 142 },
  { label: "Python", percentage: 28, color: "#4ECDC4", lines: "9.8K", files: 98 },
  { label: "TypeScript", percentage: 22, color: "#FF6B9D", lines: "7.2K", files: 76 },
  { label: "Go", percentage: 10, color: "#FFD93D", lines: "3.1K", files: 34 },
  { label: "Rust", percentage: 5, color: "#9B59B6", lines: "1.8K", files: 18 },
];

// Data for year
const languageDataYear = [
  { label: "JavaScript", percentage: 35, color: "#5B6FD8", lines: "150K", files: 1704 },
  { label: "Python", percentage: 28, color: "#4ECDC4", lines: "117.6K", files: 1176 },
  { label: "TypeScript", percentage: 22, color: "#FF6B9D", lines: "86.4K", files: 912 },
  { label: "Go", percentage: 10, color: "#FFD93D", lines: "37.2K", files: 408 },
  { label: "Rust", percentage: 5, color: "#9B59B6", lines: "21.6K", files: 216 },
];

interface TopLanguagesCardProps {
  theme: 'light' | 'dark';
  onViewClick?: () => void;
}

export function TopLanguagesCard({ theme, onViewClick }: TopLanguagesCardProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");
  
  const getLanguageData = () => {
    switch (timePeriod) {
      case "24hours":
        return languageData24Hours;
      case "week":
        return languageDataWeek;
      case "month":
        return languageDataMonth;
      case "year":
        return languageDataYear;
      default:
        return languageDataMonth;
    }
  };
  
  const languageData = getLanguageData();
  const topLanguage = languageData[0];
  
  // Calculate totals
  const totalLines = languageData.reduce((acc, lang) => {
    const linesNum = parseFloat(lang.lines.replace('K', '')) * 1000;
    return acc + linesNum;
  }, 0);
  const totalFiles = languageData.reduce((acc, lang) => acc + lang.files, 0);
  const totalLanguages = languageData.length;
  
  return (
    <Card className={`p-8 rounded-3xl shadow-lg hover:shadow-xl backdrop-blur-2xl transition-all cursor-pointer overflow-hidden relative ${
      theme === 'dark'
        ? 'bg-gray-800/50 border border-white/10 hover:bg-gray-800/70'
        : 'bg-white/50 border border-white/60 hover:bg-white/70'
    }`}>
      {/* Decorative circles */}
      <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-purple-600/20 to-blue-600/15'
          : 'bg-gradient-to-br from-[#5B6FD8]/15 to-[#7C4DFF]/10'
      }`}></div>
      <div className={`absolute -bottom-8 -left-8 w-32 h-32 rounded-full blur-3xl ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-[#7C4DFF]/20 to-purple-600/15'
          : 'bg-gradient-to-br from-[#7C4DFF]/15 to-[#5B6FD8]/10'
      }`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center justify-between flex-1">
            <div>
              <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Language Distribution</h3>
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
        <div className="mb-6">
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

        {/* Featured Language Card */}
        <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/25 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm opacity-90">Most Used</p>
                <p className="text-xl">{topLanguage.label}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl">{topLanguage.percentage}%</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 opacity-80" />
              <span className="opacity-90">{topLanguage.lines} lines</span>
            </div>
            <div className="opacity-60">•</div>
            <span className="opacity-90">{topLanguage.files} files</span>
          </div>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-2 gap-3">
          {languageData.slice(1).map((lang, index) => (
            <div 
              key={index}
              className={`p-4 rounded-2xl backdrop-blur-xl transition-all group shadow-sm ${
                theme === 'dark'
                  ? 'bg-gray-900/40 border border-white/10 hover:border-white/20 hover:bg-gray-900/60 hover:shadow-lg'
                  : 'bg-white/60 border border-white/60 hover:border-white/80 hover:bg-white/80 hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <p className={`text-sm ${
                  theme === 'dark'
                    ? 'text-gray-300 group-hover:text-white'
                    : 'text-gray-700 group-hover:text-gray-900'
                }`}>{lang.label}</p>
                <p className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{lang.percentage}%</p>
              </div>
              
              {/* Circular Progress */}
              <div className="relative w-full">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${lang.percentage}%`,
                        backgroundColor: lang.color
                      }}
                    ></div>
                  </div>
                </div>
                <div className={`mt-2 flex items-center justify-between text-xs ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  <span>{lang.lines} lines</span>
                  <span>{lang.files} files</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Divider */}
        <Separator className={`my-6 ${
          theme === 'dark' ? 'bg-white/10' : 'bg-gray-200/60'
        }`} />
        
        {/* Total Stats Row */}
        <div className="flex items-center justify-between gap-6">
          <div className={`flex-1 text-center p-3 rounded-xl ${
            theme === 'dark' 
              ? 'bg-gray-900/30 border border-white/5' 
              : 'bg-white/40 border border-white/40'
          }`}>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>Total Lines</p>
            <p className={`text-lg mt-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{(totalLines / 1000).toFixed(1)}K</p>
          </div>
          
          <div className={`flex-1 text-center p-3 rounded-xl ${
            theme === 'dark' 
              ? 'bg-gray-900/30 border border-white/5' 
              : 'bg-white/40 border border-white/40'
          }`}>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>Total Files</p>
            <p className={`text-lg mt-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{totalFiles}</p>
          </div>
          
          <div className={`flex-1 text-center p-3 rounded-xl ${
            theme === 'dark' 
              ? 'bg-gray-900/30 border border-white/5' 
              : 'bg-white/40 border border-white/40'
          }`}>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>Total Languages</p>
            <p className={`text-lg mt-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{totalLanguages}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}