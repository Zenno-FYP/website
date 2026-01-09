import { Card } from "./ui/card";
import { TrendingUp, TrendingDown, Zap, Target, Clock, AlertCircle } from "lucide-react";

interface KeyMetricsCardProps {
  theme: 'light' | 'dark';
  onMetricClick?: (metricType: 'metrics') => void;
}

const metrics = [
  {
    label: "Words Per Minute",
    value: "87",
    unit: "WPM",
    change: "+12%",
    trend: "up",
    icon: Zap,
    gradient: "from-[#5B6FD8] to-[#7C4DFF]",
    bgGradient: "from-[#5B6FD8]/10 to-[#7C4DFF]/5"
  },
  {
    label: "Mistakes Made",
    value: "23",
    unit: "errors",
    change: "-18%",
    trend: "down",
    icon: AlertCircle,
    gradient: "from-[#FF6B9D] to-[#FF8FA3]",
    bgGradient: "from-[#FF6B9D]/10 to-[#FF8FA3]/5"
  },
  {
    label: "Code Accuracy",
    value: "94.2",
    unit: "%",
    change: "+5%",
    trend: "up",
    icon: Target,
    gradient: "from-[#4ECDC4] to-[#44A6A0]",
    bgGradient: "from-[#4ECDC4]/10 to-[#44A6A0]/5"
  },
  {
    label: "Avg Session",
    value: "2.4",
    unit: "hours",
    change: "+8%",
    trend: "up",
    icon: Clock,
    gradient: "from-[#FFD93D] to-[#FFC93D]",
    bgGradient: "from-[#FFD93D]/10 to-[#FFC93D]/5"
  }
];

export function KeyMetricsCard({ theme, onMetricClick }: KeyMetricsCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
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
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${metric.bgGradient} rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity`}></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="relative z-10">
            {/* Icon and Trend */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${metric.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                <metric.icon className="w-7 h-7 text-white" />
              </div>
              <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] ml-auto ${
                metric.trend === "up" 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              }`}>
                {metric.trend === "up" ? (
                  <TrendingUp className="w-2.5 h-2.5" />
                ) : (
                  <TrendingDown className="w-2.5 h-2.5" />
                )}
                <span className="font-medium">{metric.change}</span>
              </div>
            </div>

            {/* Metric Value */}
            <div className="mb-2">
              <div className="flex items-baseline gap-1">
                <p className={`text-3xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{metric.value}</p>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{metric.unit}</span>
              </div>
            </div>

            {/* Label */}
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{metric.label}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}