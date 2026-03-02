import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState, useMemo } from "react";
import { UsageTrendDay } from "@/services/api";

interface DeveloperTrendsCardProps {
  theme: 'light' | 'dark';
  usageTrendData?: UsageTrendDay[];
}

type MetricFilter = "all" | "focused" | "reading" | "distracted" | "idle";

export function DeveloperTrendsCard({ theme, usageTrendData }: DeveloperTrendsCardProps) {
  const [metricFilter, setMetricFilter] = useState<MetricFilter>("all");

  const chartData = useMemo(() => {
    if (!usageTrendData || usageTrendData.length === 0) {
      return [];
    }

    return usageTrendData.map(day => ({
      time: day.day_name,
      focused_hours: day.focused_hours,
      reading_hours: day.reading_hours,
      distracted_hours: day.distracted_hours,
      idle_hours: day.idle_hours,
    }));
  }, [usageTrendData]);

  const shouldShowLine = (metric: "focused_hours" | "reading_hours" | "distracted_hours" | "idle_hours") => {
    if (metricFilter === "all") return true;
    const metricMap: Record<MetricFilter, string> = {
      "all": "all",
      "focused": "focused_hours",
      "reading": "reading_hours",
      "distracted": "distracted_hours",
      "idle": "idle_hours"
    };
    return metricMap[metricFilter] === metric;
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
                metricFilter === "focused" 
                  ? "border-[#5B6FD8] text-[#5B6FD8] bg-[#5B6FD8]/10" 
                  : theme === 'dark'
                    ? "border-gray-600 text-gray-400 bg-gray-800/50"
                    : "border-gray-300 text-gray-500 bg-gray-50"
              }`}
              onClick={() => setMetricFilter("focused")}
            >
              ● Focused
            </Badge>
            <Badge 
              variant="outline" 
              className={`rounded-full cursor-pointer transition-all ${
                metricFilter === "reading" 
                  ? "border-[#4ECDC4] text-[#4ECDC4] bg-[#4ECDC4]/10" 
                  : theme === 'dark'
                    ? "border-gray-600 text-gray-400 bg-gray-800/50"
                    : "border-gray-300 text-gray-500 bg-gray-50"
              }`}
              onClick={() => setMetricFilter("reading")}
            >
              ● Reading
            </Badge>
            <Badge 
              variant="outline" 
              className={`rounded-full cursor-pointer transition-all ${
                metricFilter === "distracted" 
                  ? "border-[#FF6B9D] text-[#FF6B9D] bg-[#FF6B9D]/10" 
                  : theme === 'dark'
                    ? "border-gray-600 text-gray-400 bg-gray-800/50"
                    : "border-gray-300 text-gray-500 bg-gray-50"
              }`}
              onClick={() => setMetricFilter("distracted")}
            >
              ● Distracted
            </Badge>
            <Badge 
              variant="outline" 
              className={`rounded-full cursor-pointer transition-all ${
                metricFilter === "idle" 
                  ? "border-[#FFD93D] text-[#FFD93D] bg-[#FFD93D]/10" 
                  : theme === 'dark'
                    ? "border-gray-600 text-gray-400 bg-gray-800/50"
                    : "border-gray-300 text-gray-500 bg-gray-50"
              }`}
              onClick={() => setMetricFilter("idle")}
            >
              ● Idle
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="relative mt-4 z-10">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart 
            data={chartData}
            margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E8EAFF'} vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF" 
              axisLine={false}
              tickLine={false}
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9CA3AF" 
              axisLine={false}
              tickLine={false}
              style={{ fontSize: '12px' }}
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
              formatter={(value) => `${(value as number).toFixed(1)}h`}
              labelFormatter={() => ''}
            />
            <Legend />
            {shouldShowLine("focused_hours") && (
              <Line 
                type="monotone" 
                dataKey="focused_hours" 
                stroke="#5B6FD8" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#5B6FD8' }}
                name="Focused"
              />
            )}
            {shouldShowLine("reading_hours") && (
              <Line 
                type="monotone" 
                dataKey="reading_hours" 
                stroke="#4ECDC4" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#4ECDC4' }}
                name="Reading"
              />
            )}
            {shouldShowLine("distracted_hours") && (
              <Line 
                type="monotone" 
                dataKey="distracted_hours" 
                stroke="#FF6B9D" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#FF6B9D' }}
                name="Distracted"
              />
            )}
            {shouldShowLine("idle_hours") && (
              <Line 
                type="monotone" 
                dataKey="idle_hours" 
                stroke="#FFD93D" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#FFD93D' }}
                name="Idle"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

