import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, Code2, Cpu, Clock, Activity, TrendingUp, Users, FileCode, Zap, Target, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface AppLanguagesDetailPageProps {
  theme: 'light' | 'dark';
  onBack: () => void;
}

// App Usage Data
const detailedAppUsage = [
  { name: 'VS Code', hours: 156, percentage: 42, sessions: 324, avgSession: '28m', color: '#0078D4', trend: '+12%' },
  { name: 'Chrome', hours: 98, percentage: 26, sessions: 458, avgSession: '12m', color: '#4285F4', trend: '+8%' },
  { name: 'Figma', hours: 67, percentage: 18, sessions: 145, avgSession: '27m', color: '#F24E1E', trend: '+15%' },
  { name: 'Slack', hours: 32, percentage: 9, sessions: 234, avgSession: '8m', color: '#4A154B', trend: '-5%' },
  { name: 'Terminal', hours: 18, percentage: 5, sessions: 89, avgSession: '12m', color: '#48C774', trend: '+20%' },
];

const appCategories = [
  { category: 'Development', hours: 174, percentage: 47, color: '#5B6FD8' },
  { category: 'Design', hours: 67, percentage: 18, color: '#F24E1E' },
  { category: 'Browser', hours: 98, percentage: 26, color: '#4285F4' },
  { category: 'Communication', hours: 32, percentage: 9, color: '#4A154B' },
];

const weeklyAppUsage = [
  { day: 'Mon', hours: 18.2, topApp: 'VS Code' },
  { day: 'Tue', hours: 18.8, topApp: 'VS Code' },
  { day: 'Wed', hours: 19.5, topApp: 'VS Code' },
  { day: 'Thu', hours: 20.6, topApp: 'VS Code' },
  { day: 'Fri', hours: 18.7, topApp: 'Figma' },
  { day: 'Sat', hours: 11.1, topApp: 'Chrome' },
  { day: 'Sun', hours: 9.5, topApp: 'Chrome' },
];

// Languages Data
const detailedLanguages = [
  { name: 'TypeScript', lines: 15420, files: 234, percentage: 35, hours: 145, color: '#3178C6', trend: '+18%' },
  { name: 'JavaScript', lines: 12350, files: 189, percentage: 28, hours: 112, color: '#F7DF1E', trend: '+12%' },
  { name: 'Python', lines: 8920, files: 156, percentage: 20, hours: 89, color: '#3776AB', trend: '+25%' },
  { name: 'HTML/CSS', lines: 4560, files: 98, percentage: 10, hours: 56, color: '#E34F26', trend: '+8%' },
  { name: 'SQL', lines: 2180, files: 45, percentage: 5, hours: 34, color: '#CC2927', trend: '+15%' },
  { name: 'Other', lines: 890, files: 67, percentage: 2, hours: 12, color: '#6B7280', trend: '+5%' },
];

const languageGrowth = [
  { month: 'Jul', TypeScript: 12000, JavaScript: 10500, Python: 6500, HTML: 3800 },
  { month: 'Aug', TypeScript: 12800, JavaScript: 11200, Python: 7100, HTML: 4000 },
  { month: 'Sep', TypeScript: 13500, JavaScript: 11500, Python: 7800, HTML: 4200 },
  { month: 'Oct', TypeScript: 14200, JavaScript: 11800, Python: 8200, HTML: 4300 },
  { month: 'Nov', TypeScript: 14800, JavaScript: 12100, Python: 8600, HTML: 4400 },
  { month: 'Dec', TypeScript: 15420, JavaScript: 12350, Python: 8920, HTML: 4560 },
];

const languageByProject = [
  { project: 'E-Commerce', TypeScript: 45, JavaScript: 25, Python: 15, CSS: 15 },
  { project: 'Analytics', TypeScript: 60, JavaScript: 10, Python: 20, CSS: 10 },
  { project: 'Mobile App', TypeScript: 35, JavaScript: 30, Python: 25, CSS: 10 },
  { project: 'CRM System', TypeScript: 50, JavaScript: 20, Python: 15, CSS: 15 },
];

export function AppLanguagesDetailPage({ theme, onBack }: AppLanguagesDetailPageProps) {
  const totalAppHours = detailedAppUsage.reduce((sum, app) => sum + app.hours, 0);
  const totalLines = detailedLanguages.reduce((sum, lang) => sum + lang.lines, 0);
  const totalFiles = detailedLanguages.reduce((sum, lang) => sum + lang.files, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={onBack}
            variant="outline"
            size="icon"
            className={`rounded-xl backdrop-blur-xl transition-all ${
              theme === 'dark'
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                : 'bg-white/50 hover:bg-white/70 border-white/60 text-gray-900'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className={`text-3xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Apps & Languages Analytics
            </h1>
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Detailed insights into your development environment and code contributions
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className={`p-5 rounded-2xl shadow-lg backdrop-blur-2xl border transition-all hover:shadow-xl ${
          theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] flex items-center justify-center shadow-md">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className={`text-xs mb-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Hours</p>
              <p className={`text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{totalAppHours}h</p>
            </div>
          </div>
        </Card>

        <Card className={`p-5 rounded-2xl shadow-lg backdrop-blur-2xl border transition-all hover:shadow-xl ${
          theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4ECDC4] to-[#44A6A0] flex items-center justify-center shadow-md">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className={`text-xs mb-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Apps Tracked</p>
              <p className={`text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{detailedAppUsage.length}</p>
            </div>
          </div>
        </Card>

        <Card className={`p-5 rounded-2xl shadow-lg backdrop-blur-2xl border transition-all hover:shadow-xl ${
          theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFD93D] to-[#FFC93D] flex items-center justify-center shadow-md">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className={`text-xs mb-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Lines of Code</p>
              <p className={`text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{(totalLines / 1000).toFixed(1)}k</p>
            </div>
          </div>
        </Card>

        <Card className={`p-5 rounded-2xl shadow-lg backdrop-blur-2xl border transition-all hover:shadow-xl ${
          theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF6B9D] to-[#FF8FA3] flex items-center justify-center shadow-md">
              <FileCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className={`text-xs mb-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Languages</p>
              <p className={`text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{detailedLanguages.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* App Usage Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Cpu className={`w-6 h-6 ${theme === 'dark' ? 'text-purple-400' : 'text-[#5B6FD8]'}`} />
          <h2 className={`text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Application Usage
          </h2>
        </div>

        {/* Top Apps & Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* App Category Distribution */}
          <Card className={`p-6 rounded-3xl shadow-lg backdrop-blur-2xl border ${
            theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
          }`}>
            <div className="mb-4">
              <h3 className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Usage by Category
              </h3>
              <p className={`text-sm mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Time distribution across app categories
              </p>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={appCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) => `${category} ${percentage}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="hours"
                >
                  {appCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                  }}
                  formatter={(value: any) => `${value}h`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {appCategories.map((cat, index) => (
                <div key={index} className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white/60'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {cat.category}
                    </span>
                  </div>
                  <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {cat.hours}h
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {cat.percentage}% of total
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Weekly Usage Trend */}
          <Card className={`p-6 rounded-3xl shadow-lg backdrop-blur-2xl border ${
            theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Weekly Usage Trend
                </h3>
                <p className={`text-sm mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Daily hours across all apps
                </p>
              </div>
              <div className={`px-3 py-1.5 rounded-lg ${
                theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
              }`}>
                <span className="text-sm font-medium">+8%</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={weeklyAppUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#ffffff15' : '#00000015'} vertical={false} />
                <XAxis 
                  dataKey="day" 
                  stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} 
                  style={{ fontSize: '12px' }}
                  tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                />
                <YAxis 
                  stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} 
                  style={{ fontSize: '12px' }}
                  tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                  }}
                  labelStyle={{ color: theme === 'dark' ? '#ffffff' : '#111827', fontWeight: 600 }}
                />
                <Bar 
                  dataKey="hours" 
                  fill="url(#colorGradient)" 
                  radius={[8, 8, 0, 0]}
                  name="Hours"
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5B6FD8" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#7C4DFF" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Detailed App Usage List */}
        <div className="grid grid-cols-1 gap-3">
          {detailedAppUsage.map((app, index) => (
            <Card key={index} className={`p-5 rounded-2xl shadow-lg backdrop-blur-2xl border transition-all hover:shadow-xl hover:scale-[1.01] ${
              theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
            }`}>
              <div className="flex items-center gap-4">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                  style={{ backgroundColor: theme === 'dark' ? `${app.color}25` : `${app.color}15` }}
                >
                  <div className="w-7 h-7 rounded-lg" style={{ backgroundColor: app.color }}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <h3 className={`text-base font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {app.name}
                      </h3>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                        app.trend.startsWith('+')
                          ? theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                          : theme === 'dark' ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                      }`}>
                        {app.trend}
                      </span>
                    </div>
                    <div className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {app.hours}h
                    </div>
                  </div>
                  <div className="flex items-center gap-6 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Users className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {app.sessions} sessions
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {app.avgSession} avg
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Activity className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {app.percentage}% of total
                      </span>
                    </div>
                  </div>
                  <div className={`h-2.5 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-200'}`}>
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${app.percentage}%`, 
                        backgroundColor: app.color,
                        boxShadow: `0 0 10px ${app.color}40`
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Programming Languages Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Code2 className={`w-6 h-6 ${theme === 'dark' ? 'text-purple-400' : 'text-[#5B6FD8]'}`} />
          <h2 className={`text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Programming Languages
          </h2>
        </div>

        {/* Most Used Languages Overview */}
        <Card className={`p-6 rounded-3xl shadow-lg backdrop-blur-2xl border ${
          theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
        }`}>
          <div className="mb-4">
            <h3 className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Most Used Languages
            </h3>
            <p className={`text-sm mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Language distribution by lines of code
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {detailedLanguages.slice(0, 6).map((lang, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-xl transition-all hover:scale-105 ${
                  theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-white/60 hover:bg-white/80'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md"
                    style={{ backgroundColor: theme === 'dark' ? `${lang.color}25` : `${lang.color}15` }}
                  >
                    <Code2 className="w-5 h-5" style={{ color: lang.color }} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {lang.name}
                    </p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {lang.percentage}%
                    </p>
                  </div>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-200'}`}>
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${lang.percentage * 2}%`, 
                      backgroundColor: lang.color,
                      boxShadow: `0 0 8px ${lang.color}40`
                    }}
                  />
                </div>
                <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {lang.lines.toLocaleString()} lines
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Language Growth & Usage Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Language Growth Over Time */}
          <Card className={`p-6 rounded-3xl shadow-lg backdrop-blur-2xl border ${
            theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Language Growth (6 Months)
                </h3>
                <p className={`text-sm mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Lines of code progression
                </p>
              </div>
              <div className={`px-3 py-1.5 rounded-lg ${
                theme === 'dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'
              }`}>
                <span className="text-sm font-medium">+33%</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={languageGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#ffffff15' : '#00000015'} vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} 
                  style={{ fontSize: '11px' }}
                  tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                />
                <YAxis 
                  stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} 
                  style={{ fontSize: '11px' }}
                  tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                  }}
                  labelStyle={{ color: theme === 'dark' ? '#ffffff' : '#111827', fontWeight: 600 }}
                />
                <Legend />
                <Line type="monotone" dataKey="TypeScript" stroke="#3178C6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="JavaScript" stroke="#F7DF1E" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Python" stroke="#3776AB" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="HTML" stroke="#E34F26" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Language Usage by Project */}
          <Card className={`p-6 rounded-3xl shadow-lg backdrop-blur-2xl border ${
            theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
          }`}>
            <div className="mb-4">
              <h3 className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Language by Project
              </h3>
              <p className={`text-sm mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Language distribution across projects
              </p>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={languageByProject}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#ffffff15' : '#00000015'} vertical={false} />
                <XAxis 
                  dataKey="project" 
                  stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} 
                  style={{ fontSize: '10px' }}
                  tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                />
                <YAxis 
                  stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} 
                  style={{ fontSize: '11px' }}
                  tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                  label={{ value: '%', angle: -90, position: 'insideLeft', fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                  }}
                  labelStyle={{ color: theme === 'dark' ? '#ffffff' : '#111827', fontWeight: 600 }}
                />
                <Legend />
                <Bar dataKey="TypeScript" stackId="a" fill="#3178C6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="JavaScript" stackId="a" fill="#F7DF1E" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Python" stackId="a" fill="#3776AB" radius={[0, 0, 0, 0]} />
                <Bar dataKey="CSS" stackId="a" fill="#E34F26" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Detailed Languages List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {detailedLanguages.map((lang, index) => (
            <Card key={index} className={`p-5 rounded-2xl shadow-lg backdrop-blur-2xl border transition-all hover:shadow-xl hover:scale-[1.01] ${
              theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
            }`}>
              <div className="flex items-center gap-4 mb-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
                  style={{ backgroundColor: theme === 'dark' ? `${lang.color}25` : `${lang.color}15` }}
                >
                  <Code2 className="w-6 h-6" style={{ color: lang.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-base font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {lang.name}
                    </h3>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                      lang.trend.startsWith('+')
                        ? theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                        : theme === 'dark' ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                    }`}>
                      {lang.trend}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      {lang.files} files
                    </span>
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      {lang.hours}h coding
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Lines written
                  </span>
                  <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {lang.lines.toLocaleString()}
                  </span>
                </div>
                <div className={`h-2.5 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-200'}`}>
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${lang.percentage * 2}%`, 
                      backgroundColor: lang.color,
                      boxShadow: `0 0 10px ${lang.color}40`
                    }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
