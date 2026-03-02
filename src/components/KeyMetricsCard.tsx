import { Card } from "./ui/card";
import { TrendingUp, TrendingDown, Zap, Clock, Mouse, MousePointer } from "lucide-react";
import { PerformanceMetric } from "@/services/api";

interface KeyMetricsCardProps {
  theme: 'light' | 'dark';
  onMetricClick?: (metricType: 'metrics') => void;
  performanceData?: {
    wpm: PerformanceMetric;
    daily_active_average: PerformanceMetric;
    total_clicks: PerformanceMetric;
    total_scrolls: PerformanceMetric;
  };
}

export function KeyMetricsCard({ theme, onMetricClick, performanceData }: KeyMetricsCardProps) {
  const metricsConfig = [
    {
      key: 'wpm',
      label: "Words Per Minute",
      icon: Zap,
      gradient: "from-[#5B6FD8] to-[#7C4DFF]",
      bgGradient: "from-[#5B6FD8]/10 to-[#7C4DFF]/5"
    },
    {
      key: 'daily_active_average',
      label: "Daily Active Average",
      icon: Clock,
      gradient: "from-[#FFD93D] to-[#FFC93D]",
      bgGradient: "from-[#FFD93D]/10 to-[#FFC93D]/5"
    },
    {
      key: 'total_clicks',
      label: "Total Clicks",
      icon: Mouse,
      gradient: "from-[#4ECDC4] to-[#44A6A0]",
      bgGradient: "from-[#4ECDC4]/10 to-[#44A6A0]/5"
    },
    {
      key: 'total_scrolls',
      label: "Total Scrolls",
      icon: MousePointer,
      gradient: "from-[#FF6B9D] to-[#FF8FA3]",
      bgGradient: "from-[#FF6B9D]/10 to-[#FF8FA3]/5"
    }
  ];

  const getMetricValue = (key: string): PerformanceMetric | undefined => {
    if (!performanceData) return undefined;
    return performanceData[key as keyof typeof performanceData];
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricsConfig.map((config, index) => {
        const metric = getMetricValue(config.key);
        
        const value = metric?.value ?? 0;
        const change = metric?.change_percent ?? 0;
        
        // Determine trend based on change_percent
        let trend: 'up' | 'down' | 'neutral';
        if (change > 0) {
          trend = 'up';
        } else if (change < 0) {
          trend = 'down';
        } else {
          trend = 'neutral';
        }
        
        return (
          <Card 
            key={index}
            onClick={() => onMetricClick?.('metrics')}
            className={`p-6 rounded-3xl shadow-lg hover:shadow-xl backdrop-blur-2xl transition-all cursor-pointer group overflow-hidden relative ${
              theme === 'dark'
                ? 'border border-white/10 bg-gray-800/50 hover:bg-gray-800/70'
                : 'border border-white/60 bg-white/50 hover:bg-white/70'
            }`}
          >
            {/* Background Gradient */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${config.bgGradient} rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity`}></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative z-10">
              {/* Icon and Trend */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <config.icon className="w-7 h-7 text-white" />
                </div>
                <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] ml-auto ${
                  trend === "up" 
                    ? "bg-green-100 text-green-700" 
                    : trend === "down"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                }`}>
                  {trend === "up" ? (
                    <TrendingUp className="w-2.5 h-2.5" />
                  ) : trend === "down" ? (
                    <TrendingDown className="w-2.5 h-2.5" />
                  ) : null}
                  <span className="font-medium">{change > 0 ? '+' : ''}{change.toFixed(0)}%</span>
                </div>
              </div>

              {/* Metric Value */}
              <div className="mb-2">
                <div className="flex items-baseline gap-1">
                  <p className={`text-3xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{typeof value === 'number' ? value.toFixed(config.key === 'wpm' ? 1 : 0) : value}</p>
                  {config.key === 'daily_active_average' && (
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>hours</span>
                  )}
                </div>
              </div>

              {/* Label */}
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{config.label}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}