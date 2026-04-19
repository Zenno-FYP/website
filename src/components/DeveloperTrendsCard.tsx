import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState, useMemo } from "react";
import { UsageTrendDay } from "@/services/api";
import { WeekToggle, WeekPeriod } from "./WeekToggle";

interface DeveloperTrendsCardProps {
  theme: 'light' | 'dark';
  usageTrendData?: UsageTrendDay[];
  period: WeekPeriod;
  onPeriodChange: (period: WeekPeriod) => void;
}

type MetricFilter = "all" | "flow" | "debugging" | "research" | "communication" | "distracted";

export function DeveloperTrendsCard({ theme, usageTrendData, period, onPeriodChange }: DeveloperTrendsCardProps) {
  const [metricFilter, setMetricFilter] = useState<MetricFilter>("all");

  const chartData = useMemo(() => {
    if (!usageTrendData || usageTrendData.length === 0) {
      return [];
    }

    return usageTrendData.map(day => ({
      time: day.day_name,
      flow_hours: day.flow_hours,
      debugging_hours: day.debugging_hours,
      research_hours: day.research_hours,
      communication_hours: day.communication_hours,
      distracted_hours: day.distracted_hours,
    }));
  }, [usageTrendData]);

  const shouldShowLine = (metric: "flow_hours" | "debugging_hours" | "research_hours" | "communication_hours" | "distracted_hours") => {
    if (metricFilter === "all") return true;
    const metricMap: Record<MetricFilter, string> = {
      "all": "all",
      "flow": "flow_hours",
      "debugging": "debugging_hours",
      "research": "research_hours",
      "communication": "communication_hours",
      "distracted": "distracted_hours"
    };
    return metricMap[metricFilter] === metric;
  };

  return (
    <Card className={`p-8 rounded-3xl shadow-lg hover:shadow-xl backdrop-blur-2xl transition-all relative overflow-hidden ${
      theme === 'dark'
        ? 'bg-gray-800/50 border border-white/10'
        : 'bg-white/50 border border-white/60'
    }`}>
      <div className={`absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-purple-600/10 to-transparent'
          : 'bg-gradient-to-br from-[#5B6FD8]/5 to-transparent'
      }`}></div>
      <div className="flex items-start justify-between mb-6 relative z-10">
        <div>
          <h3 className={`mb-2 font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Developer Trends</h3>
          <div className="flex items-center gap-3 flex-wrap">
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
                metricFilter === "flow" 
                  ? "border-[#5B6FD8] text-[#5B6FD8] bg-[#5B6FD8]/10" 
                  : theme === 'dark'
                    ? "border-gray-600 text-gray-400 bg-gray-800/50"
                    : "border-gray-300 text-gray-500 bg-gray-50"
              }`}
              onClick={() => setMetricFilter("flow")}
            >
              ● Flow
            </Badge>
            <Badge 
              variant="outline" 
              className={`rounded-full cursor-pointer transition-all ${
                metricFilter === "debugging" 
                  ? "border-[#FF6B6B] text-[#FF6B6B] bg-[#FF6B6B]/10" 
                  : theme === 'dark'
                    ? "border-gray-600 text-gray-400 bg-gray-800/50"
                    : "border-gray-300 text-gray-500 bg-gray-50"
              }`}
              onClick={() => setMetricFilter("debugging")}
            >
              ● Debugging
            </Badge>
            <Badge 
              variant="outline" 
              className={`rounded-full cursor-pointer transition-all ${
                metricFilter === "research" 
                  ? "border-[#4ECDC4] text-[#4ECDC4] bg-[#4ECDC4]/10" 
                  : theme === 'dark'
                    ? "border-gray-600 text-gray-400 bg-gray-800/50"
                    : "border-gray-300 text-gray-500 bg-gray-50"
              }`}
              onClick={() => setMetricFilter("research")}
            >
              ● Research
            </Badge>
            <Badge 
              variant="outline" 
              className={`rounded-full cursor-pointer transition-all ${
                metricFilter === "communication" 
                  ? "border-[#FFD93D] text-[#FFD93D] bg-[#FFD93D]/10" 
                  : theme === 'dark'
                    ? "border-gray-600 text-gray-400 bg-gray-800/50"
                    : "border-gray-300 text-gray-500 bg-gray-50"
              }`}
              onClick={() => setMetricFilter("communication")}
            >
              ● Communication
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
          </div>
        </div>
        <WeekToggle period={period} onChange={onPeriodChange} theme={theme} />
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
              formatter={(value) => `${(value as number).toFixed(2)}h`}
              labelFormatter={() => ''}
            />
            <Legend />
            {shouldShowLine("flow_hours") && (
              <Line 
                type="monotone" 
                dataKey="flow_hours" 
                stroke="#5B6FD8" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#5B6FD8' }}
                name="Flow"
              />
            )}
            {shouldShowLine("debugging_hours") && (
              <Line 
                type="monotone" 
                dataKey="debugging_hours" 
                stroke="#FF6B6B" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#FF6B6B' }}
                name="Debugging"
              />
            )}
            {shouldShowLine("research_hours") && (
              <Line 
                type="monotone" 
                dataKey="research_hours" 
                stroke="#4ECDC4" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#4ECDC4' }}
                name="Research"
              />
            )}
            {shouldShowLine("communication_hours") && (
              <Line 
                type="monotone" 
                dataKey="communication_hours" 
                stroke="#FFD93D" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#FFD93D' }}
                name="Communication"
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
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

