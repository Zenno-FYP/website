import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, Zap, Target, Clock, AlertCircle, Award, Play, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface MetricsDetailPageProps {
  theme: 'light' | 'dark';
  onBack: () => void;
}

// Data
const weeklyWPMData = [
  { day: 'Mon', wpm: 82, target: 75 },
  { day: 'Tue', wpm: 85, target: 75 },
  { day: 'Wed', wpm: 79, target: 75 },
  { day: 'Thu', wpm: 88, target: 75 },
  { day: 'Fri', wpm: 87, target: 75 },
  { day: 'Sat', wpm: 75, target: 75 },
  { day: 'Sun', wpm: 70, target: 75 },
];

const dailyMistakes = [
  { day: 'Mon', errors: 28, corrected: 25 },
  { day: 'Tue', errors: 25, corrected: 23 },
  { day: 'Wed', errors: 22, corrected: 20 },
  { day: 'Thu', errors: 20, corrected: 19 },
  { day: 'Fri', errors: 23, corrected: 22 },
  { day: 'Sat', errors: 18, corrected: 17 },
  { day: 'Sun', errors: 16, corrected: 15 },
];

const commonMistakes = [
  { issue: 'Missing semicolons', frequency: 42, language: 'JavaScript' },
  { issue: 'Undefined variables', frequency: 35, language: 'Python' },
  { issue: 'Type mismatches', frequency: 28, language: 'TypeScript' },
  { issue: 'Bracket mismatch', frequency: 22, language: 'All' },
  { issue: 'Import errors', frequency: 18, language: 'React' },
];

const skillAccuracy = [
  { skill: 'JavaScript', accuracy: 95 },
  { skill: 'TypeScript', accuracy: 93 },
  { skill: 'Python', accuracy: 91 },
  { skill: 'React', accuracy: 94 },
  { skill: 'Node.js', accuracy: 92 },
  { skill: 'HTML/CSS', accuracy: 96 },
];

const productivityBySession = [
  { time: 'Morning\n(6-12)', productivity: 78, sessions: 42 },
  { time: 'Afternoon\n(12-18)', productivity: 92, sessions: 58 },
  { time: 'Evening\n(18-24)', productivity: 65, sessions: 25 },
  { time: 'Night\n(0-6)', productivity: 45, sessions: 8 },
];

const recentSessions = [
  { date: 'Dec 31, 2:30 PM', duration: '2h 45m', productivity: 94, tasks: 8 },
  { date: 'Dec 31, 9:15 AM', duration: '1h 30m', productivity: 88, tasks: 5 },
  { date: 'Dec 30, 3:00 PM', duration: '3h 15m', productivity: 96, tasks: 12 },
  { date: 'Dec 30, 10:00 AM', duration: '2h 00m', productivity: 85, tasks: 6 },
  { date: 'Dec 29, 4:00 PM', duration: '2h 20m', productivity: 91, tasks: 9 },
];

export function MetricsDetailPage({ theme, onBack }: MetricsDetailPageProps) {
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
              Key Metrics Analytics
            </h1>
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Comprehensive analysis of your coding performance metrics
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className={`p-4 rounded-2xl shadow-lg backdrop-blur-2xl border ${
          theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
        }`}>
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Current WPM</p>
              <p className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>87</p>
            </div>
          </div>
        </Card>

        <Card className={`p-4 rounded-2xl shadow-lg backdrop-blur-2xl border ${
          theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
        }`}>
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4ECDC4] to-[#44A6A0] flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Peak WPM</p>
              <p className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>95</p>
            </div>
          </div>
        </Card>

        <Card className={`p-4 rounded-2xl shadow-lg backdrop-blur-2xl border ${
          theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
        }`}>
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B9D] to-[#FF8FA3] flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Today Errors</p>
              <p className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>23</p>
            </div>
          </div>
        </Card>

        <Card className={`p-4 rounded-2xl shadow-lg backdrop-blur-2xl border ${
          theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
        }`}>
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4ECDC4] to-[#44A6A0] flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Accuracy</p>
              <p className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>94.2%</p>
            </div>
          </div>
        </Card>

        <Card className={`p-4 rounded-2xl shadow-lg backdrop-blur-2xl border ${
          theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
        }`}>
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD93D] to-[#FFC93D] flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Avg Session</p>
              <p className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>2.4h</p>
            </div>
          </div>
        </Card>

        <Card className={`p-4 rounded-2xl shadow-lg backdrop-blur-2xl border ${
          theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
        }`}>
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] flex items-center justify-center">
              <Play className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Sessions</p>
              <p className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>25</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WPM Performance */}
        <Card className={`p-6 rounded-3xl shadow-lg backdrop-blur-2xl border ${
          theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                WPM Performance vs Target
              </h3>
              <p className={`text-sm mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Weekly coding speed analysis
              </p>
            </div>
            <div className={`px-3 py-1.5 rounded-lg ${
              theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
            }`}>
              <span className="text-sm font-medium">+12%</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyWPMData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#ffffff15' : '#00000015'} vertical={false} />
              <XAxis dataKey="day" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} style={{ fontSize: '12px' }} />
              <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }} />
              <Legend />
              <Bar dataKey="wpm" fill="#5B6FD8" radius={[8, 8, 0, 0]} name="WPM" />
              <Bar dataKey="target" fill="#4ECDC4" radius={[8, 8, 0, 0]} name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Error Analysis */}
        <Card className={`p-6 rounded-3xl shadow-lg backdrop-blur-2xl border ${
          theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
        }`}>
          <div className="mb-4">
            <h3 className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Error & Correction Tracking
            </h3>
            <p className={`text-sm mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Mistakes made vs successfully corrected
            </p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dailyMistakes}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#ffffff15' : '#00000015'} vertical={false} />
              <XAxis dataKey="day" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} style={{ fontSize: '12px' }} />
              <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }} />
              <Legend />
              <Bar dataKey="errors" fill="#FF6B9D" radius={[8, 8, 0, 0]} name="Errors" />
              <Bar dataKey="corrected" fill="#4ECDC4" radius={[8, 8, 0, 0]} name="Corrected" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Accuracy by Skill */}
        <Card className={`p-6 rounded-3xl shadow-lg backdrop-blur-2xl border ${
          theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
        }`}>
          <div className="mb-4">
            <h3 className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Accuracy by Skill
            </h3>
            <p className={`text-sm mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Code accuracy across different technologies
            </p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={skillAccuracy}>
              <PolarGrid stroke={theme === 'dark' ? '#ffffff20' : '#00000020'} />
              <PolarAngleAxis dataKey="skill" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} style={{ fontSize: '11px' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
              <Radar name="Accuracy %" dataKey="accuracy" stroke="#5B6FD8" fill="#5B6FD8" fillOpacity={0.6} />
              <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', border: 'none', borderRadius: '12px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Productivity by Time */}
        <Card className={`p-6 rounded-3xl shadow-lg backdrop-blur-2xl border ${
          theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
        }`}>
          <div className="mb-4">
            <h3 className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Productivity by Time of Day
            </h3>
            <p className={`text-sm mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              When you're most productive
            </p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={productivityBySession}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#ffffff15' : '#00000015'} vertical={false} />
              <XAxis dataKey="time" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} style={{ fontSize: '11px' }} />
              <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', border: 'none', borderRadius: '12px' }} />
              <Bar dataKey="productivity" fill="url(#productivityGradient)" radius={[8, 8, 0, 0]} name="Productivity %" />
              <defs>
                <linearGradient id="productivityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5B6FD8" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#7C4DFF" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Common Mistakes & Recent Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Common Mistakes */}
        <Card className={`p-6 rounded-3xl shadow-lg backdrop-blur-2xl border ${
          theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
        }`}>
          <h3 className={`text-lg mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Most Common Mistakes
          </h3>
          <div className="space-y-3">
            {commonMistakes.map((mistake, index) => (
              <div key={index} className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white/60'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {mistake.issue}
                    </p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {mistake.language}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    theme === 'dark' ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                  }`}>
                    {mistake.frequency}x
                  </span>
                </div>
                <div className={`h-1.5 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-200'}`}>
                  <div 
                    className="h-full bg-gradient-to-r from-[#FF6B9D] to-[#FF8FA3] rounded-full"
                    style={{ width: `${(mistake.frequency / 50) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Sessions */}
        <Card className={`p-6 rounded-3xl shadow-lg backdrop-blur-2xl border ${
          theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
        }`}>
          <h3 className={`text-lg mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Recent Coding Sessions
          </h3>
          <div className="space-y-2">
            {recentSessions.map((session, index) => (
              <div key={index} className={`p-3 rounded-xl flex items-center justify-between ${
                theme === 'dark' ? 'bg-white/5' : 'bg-white/60'
              }`}>
                <div className="flex items-center gap-3">
                  <Clock className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-[#5B6FD8]'}`} />
                  <div>
                    <p className={`text-xs font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {session.date}
                    </p>
                    <p className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {session.duration} • {session.tasks} tasks
                    </p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  session.productivity >= 90 
                    ? theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                    : theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                }`}>
                  {session.productivity}%
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
