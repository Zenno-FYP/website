import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";

// Data for 24 hours view
const hourlyData = [
  { time: "00:00", all: 45, productivity: 50, coding: 40, distraction: 15 },
  { time: "02:00", all: 30, productivity: 35, coding: 25, distraction: 10 },
  { time: "04:00", all: 20, productivity: 22, coding: 18, distraction: 5 },
  { time: "06:00", all: 25, productivity: 28, coding: 22, distraction: 8 },
  { time: "08:00", all: 60, productivity: 65, coding: 55, distraction: 20 },
  { time: "10:00", all: 75, productivity: 80, coding: 70, distraction: 25 },
  { time: "12:00", all: 70, productivity: 72, coding: 68, distraction: 22 },
  { time: "14:00", all: 85, productivity: 90, coding: 80, distraction: 30 },
  { time: "16:00", all: 80, productivity: 82, coding: 78, distraction: 28 },
  { time: "18:00", all: 65, productivity: 68, coding: 62, distraction: 18 },
  { time: "20:00", all: 50, productivity: 55, coding: 45, distraction: 15 },
  { time: "22:00", all: 40, productivity: 42, coding: 38, distraction: 12 },
];

// Data for week view (days)
const weeklyData = [
  { time: "MON", all: 70, productivity: 75, coding: 65, distraction: 22 },
  { time: "TUE", all: 78, productivity: 82, coding: 74, distraction: 25 },
  { time: "WED", all: 85, productivity: 88, coding: 82, distraction: 28 },
  { time: "THU", all: 80, productivity: 83, coding: 77, distraction: 26 },
  { time: "FRI", all: 75, productivity: 78, coding: 72, distraction: 24 },
  { time: "SAT", all: 55, productivity: 60, coding: 50, distraction: 15 },
  { time: "SUN", all: 45, productivity: 50, coding: 40, distraction: 12 },
];

// Data for month view (dates)
const monthlyData = [
  { time: "1", all: 65, productivity: 70, coding: 60, distraction: 20 },
  { time: "5", all: 72, productivity: 75, coding: 69, distraction: 22 },
  { time: "10", all: 68, productivity: 72, coding: 64, distraction: 18 },
  { time: "15", all: 85, productivity: 88, coding: 82, distraction: 28 },
  { time: "20", all: 78, productivity: 80, coding: 76, distraction: 25 },
  { time: "25", all: 82, productivity: 85, coding: 79, distraction: 26 },
  { time: "30", all: 75, productivity: 78, coding: 72, distraction: 24 },
];

// Data for year view (months)
const yearlyData = [
  { time: "JAN", all: 65, productivity: 70, coding: 60, distraction: 20 },
  { time: "FEB", all: 72, productivity: 75, coding: 69, distraction: 22 },
  { time: "MAR", all: 68, productivity: 72, coding: 64, distraction: 19 },
  { time: "APR", all: 85, productivity: 88, coding: 82, distraction: 28 },
  { time: "MAY", all: 78, productivity: 80, coding: 76, distraction: 24 },
  { time: "JUN", all: 82, productivity: 85, coding: 79, distraction: 26 },
  { time: "JUL", all: 90, productivity: 92, coding: 88, distraction: 30 },
  { time: "AUG", all: 75, productivity: 78, coding: 72, distraction: 23 },
  { time: "SEP", all: 80, productivity: 83, coding: 77, distraction: 25 },
  { time: "OCT", all: 88, productivity: 90, coding: 86, distraction: 29 },
  { time: "NOV", all: 85, productivity: 87, coding: 83, distraction: 27 },
  { time: "DEC", all: 70, productivity: 73, coding: 67, distraction: 21 },
];

type TimePeriod = "24hours" | "week" | "month" | "year";
type MetricFilter = "all" | "productivity" | "coding" | "distraction";

interface DeveloperTrendsCardProps {
  theme: 'light' | 'dark';
}

export function DeveloperTrendsCard({ theme }: DeveloperTrendsCardProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");
  const [metricFilter, setMetricFilter] = useState<MetricFilter>("all");

  const getChartData = () => {
    switch (timePeriod) {
      case "24hours":
        return hourlyData;
      case "week":
        return weeklyData;
      case "month":
        return monthlyData;
      case "year":
        return yearlyData;
      default:
        return monthlyData;
    }
  };

  const chartData = getChartData();

  const shouldShowLine = (metric: "productivity" | "coding" | "distraction") => {
    if (metricFilter === "all") return true;
    return metricFilter === metric;
  };

  return (
    <Card className={`p-8 rounded-3xl shadow-lg hover:shadow-xl backdrop-blur-2xl transition-all cursor-pointer relative overflow-hidden ${
      theme === 'dark'
        ? 'bg-gray-800/50 border border-white/10 hover:bg-gray-800/70'
        : 'bg-white/50 border border-white/60 hover:bg-white/70'
    }`}>
      <div className={`absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-purple-600/10 to-transparent'
          : 'bg-gradient-to-br from-[#5B6FD8]/5 to-transparent'
      }`}></div>
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h3 className={`mb-1 font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Usage Trend</h3>
          <div className="flex items-center gap-3">
            <Badge 
              variant="outline" 
              className={`rounded-full cursor-pointer transition-all ${
                metricFilter === "all" 
                  ? "border-[#5B6FD8] text-[#5B6FD8] bg-[#5B6FD8]/10" 
                  : theme === 'dark'
                    ? "border-gray-600 text-gray-400 bg-gray-800/50"
                    : "border-gray-300 text-gray-500 bg-gray-50"
              }`}
              onClick={() => setMetricFilter("all")}
            >
              ● All
            </Badge>
            <Badge 
              variant="outline" 
              className={`rounded-full cursor-pointer transition-all ${
                metricFilter === "productivity" 
                  ? "border-[#FF6B9D] text-[#FF6B9D] bg-[#FF6B9D]/10" 
                  : theme === 'dark'
                    ? "border-gray-600 text-gray-400 bg-gray-800/50"
                    : "border-gray-300 text-gray-500 bg-gray-50"
              }`}
              onClick={() => setMetricFilter("productivity")}
            >
              ● Productivity
            </Badge>
            <Badge 
              variant="outline" 
              className={`rounded-full cursor-pointer transition-all ${
                metricFilter === "coding" 
                  ? "border-[#4ECDC4] text-[#4ECDC4] bg-[#4ECDC4]/10" 
                  : theme === 'dark'
                    ? "border-gray-600 text-gray-400 bg-gray-800/50"
                    : "border-gray-300 text-gray-500 bg-gray-50"
              }`}
              onClick={() => setMetricFilter("coding")}
            >
              ● Coding
            </Badge>
            <Badge 
              variant="outline" 
              className={`rounded-full cursor-pointer transition-all ${
                metricFilter === "distraction" 
                  ? "border-[#FFD93D] text-[#FFD93D] bg-[#FFD93D]/10" 
                  : theme === 'dark'
                    ? "border-gray-600 text-gray-400 bg-gray-800/50"
                    : "border-gray-300 text-gray-500 bg-gray-50"
              }`}
              onClick={() => setMetricFilter("distraction")}
            >
              ● Distraction
            </Badge>
          </div>
        </div>
        <Select value={timePeriod} onValueChange={(value) => setTimePeriod(value as TimePeriod)}>
          <SelectTrigger className={`w-[180px] rounded-xl ${
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
      
      <div className="relative mt-4 z-10">
        <div className={`absolute -top-2 right-4 flex items-center gap-2 backdrop-blur-xl px-4 py-2 rounded-xl shadow-md z-10 ${
          theme === 'dark'
            ? 'bg-gray-800/70 border border-white/10'
            : 'bg-white/70 border border-white/60'
        }`}>
          <div className="text-right">
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {timePeriod === "24hours" && "Last 24 Hours"}
              {timePeriod === "week" && "This Week"}
              {timePeriod === "month" && "This Month"}
              {timePeriod === "year" && "This Year"}
            </p>
            <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
              {metricFilter === "all" && "All Metrics"}
              {metricFilter === "productivity" && "Productivity"}
              {metricFilter === "coding" && "Coding"}
              {metricFilter === "distraction" && "Distraction"}
            </p>
          </div>
          <div className={theme === 'dark' ? 'text-purple-400' : 'text-[#5B6FD8]'}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart 
            data={chartData}
            margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F8" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF" 
              axisLine={false}
              tickLine={false}
              style={{ fontSize: '12px' }}
              height={50}
              dy={10}
            />
            <YAxis 
              stroke="#9CA3AF" 
              axisLine={false}
              tickLine={false}
              style={{ fontSize: '12px' }}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(value) => `${value}%`}
              width={60}
              dx={-5}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme === 'dark' ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)', 
                border: 'none',
                borderRadius: '12px',
                boxShadow: theme === 'dark' 
                  ? '0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)' 
                  : '0 10px 40px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5)',
                padding: '12px',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                color: theme === 'dark' ? '#F3F4F6' : '#1F2937'
              }}
              formatter={(value) => `${value}%`}
              labelFormatter={() => ''}
            />
            {shouldShowLine("productivity") && (
              <Line 
                type="monotone" 
                dataKey="productivity" 
                stroke="#FF6B9D" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#FF6B9D' }}
                name="Productivity"
              />
            )}
            {shouldShowLine("coding") && (
              <Line 
                type="monotone" 
                dataKey="coding" 
                stroke="#4ECDC4" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#4ECDC4' }}
                name="Coding"
              />
            )}
            {shouldShowLine("distraction") && (
              <Line 
                type="monotone" 
                dataKey="distraction" 
                stroke="#FFD93D" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#FFD93D' }}
                name="Distraction"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
