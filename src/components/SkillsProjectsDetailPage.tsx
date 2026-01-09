import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, Code, Award, Clock, GitBranch, Calendar, Users, CheckCircle2, TrendingUp } from "lucide-react";
import { LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface SkillsProjectsDetailPageProps {
  theme: 'light' | 'dark';
  onBack: () => void;
  onProjectClick: (project: any) => void;
}

// Skills Data
const skillsData = [
  { skill: 'React', level: 95, hours: 450, projects: 12 },
  { skill: 'TypeScript', level: 92, hours: 380, projects: 10 },
  { skill: 'Node.js', level: 88, hours: 320, projects: 8 },
  { skill: 'Python', level: 85, hours: 290, projects: 7 },
  { skill: 'JavaScript', level: 98, hours: 520, projects: 15 },
  { skill: 'CSS/Tailwind', level: 90, hours: 410, projects: 14 },
];

const skillGrowthData = [
  { month: 'Jul', React: 85, TypeScript: 80, NodeJS: 75, Python: 72 },
  { month: 'Aug', React: 88, TypeScript: 83, NodeJS: 78, Python: 76 },
  { month: 'Sep', React: 90, TypeScript: 86, NodeJS: 82, Python: 80 },
  { month: 'Oct', React: 92, TypeScript: 88, NodeJS: 85, Python: 82 },
  { month: 'Nov', React: 93, TypeScript: 90, NodeJS: 87, Python: 84 },
  { month: 'Dec', React: 95, TypeScript: 92, NodeJS: 88, Python: 85 },
];

const radarSkillsData = [
  { category: 'Frontend', score: 95 },
  { category: 'Backend', score: 88 },
  { category: 'Database', score: 82 },
  { category: 'DevOps', score: 75 },
  { category: 'Testing', score: 85 },
  { category: 'Design', score: 78 },
];

// Projects Data
const detailedProjects = [
  {
    name: 'E-Commerce Platform',
    status: 'In Progress',
    progress: 75,
    tech: ['React', 'Node.js', 'MongoDB'],
    startDate: 'Nov 15, 2024',
    deadline: 'Jan 15, 2025',
    lastActive: '2 hours ago',
    team: 5,
    commits: 234,
    hours: 156,
    completedTasks: 45,
    totalTasks: 60,
    color: 'from-[#5B6FD8] to-[#7C4DFF]'
  },
  {
    name: 'Analytics Dashboard',
    status: 'In Progress',
    progress: 60,
    tech: ['TypeScript', 'React', 'Recharts'],
    startDate: 'Dec 1, 2024',
    deadline: 'Jan 30, 2025',
    lastActive: '1 day ago',
    team: 3,
    commits: 128,
    hours: 89,
    completedTasks: 30,
    totalTasks: 50,
    color: 'from-[#4ECDC4] to-[#44A6A0]'
  },
  {
    name: 'Mobile App Backend',
    status: 'Completed',
    progress: 100,
    tech: ['Python', 'FastAPI', 'PostgreSQL'],
    startDate: 'Oct 1, 2024',
    deadline: 'Dec 15, 2024',
    lastActive: '3 days ago',
    team: 4,
    commits: 312,
    hours: 203,
    completedTasks: 75,
    totalTasks: 75,
    color: 'from-[#FFD93D] to-[#FFC93D]'
  },
  {
    name: 'CRM System',
    status: 'Planning',
    progress: 15,
    tech: ['Next.js', 'TypeScript', 'Prisma'],
    startDate: 'Dec 20, 2024',
    deadline: 'Mar 1, 2025',
    lastActive: '5 hours ago',
    team: 6,
    commits: 45,
    hours: 28,
    completedTasks: 8,
    totalTasks: 95,
    color: 'from-[#FF6B9D] to-[#FF8FA3]'
  },
];

export function SkillsProjectsDetailPage({ theme, onBack, onProjectClick }: SkillsProjectsDetailPageProps) {
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
              Skills & Projects Overview
            </h1>
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Comprehensive analysis of your development skills and project portfolio
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className={`p-4 rounded-2xl shadow-lg backdrop-blur-2xl border ${
          theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
        }`}>
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Skills</p>
              <p className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>12</p>
            </div>
          </div>
        </Card>

        <Card className={`p-4 rounded-2xl shadow-lg backdrop-blur-2xl border ${
          theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
        }`}>
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4ECDC4] to-[#44A6A0] flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Active Projects</p>
              <p className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>4</p>
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
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Hours</p>
              <p className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>2.4k</p>
            </div>
          </div>
        </Card>

        <Card className={`p-4 rounded-2xl shadow-lg backdrop-blur-2xl border ${
          theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
        }`}>
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B9D] to-[#FF8FA3] flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Achievements</p>
              <p className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>28</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Skills Section */}
      <div className="space-y-4">
        <h2 className={`text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Skills Analytics
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skill Growth Over Time */}
          <Card className={`p-6 rounded-3xl shadow-lg backdrop-blur-2xl border ${
            theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
          }`}>
            <div className="mb-4">
              <h3 className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Skill Growth (6 Months)
              </h3>
              <p className={`text-sm mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Proficiency progression over time
              </p>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={skillGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#ffffff15' : '#00000015'} vertical={false} />
                <XAxis dataKey="month" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} style={{ fontSize: '11px' }} />
                <YAxis domain={[60, 100]} stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} style={{ fontSize: '11px' }} />
                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', border: 'none', borderRadius: '12px' }} />
                <Legend />
                <Line type="monotone" dataKey="React" stroke="#5B6FD8" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="TypeScript" stroke="#4ECDC4" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="NodeJS" stroke="#FFD93D" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Python" stroke="#FF6B9D" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Skill Categories Radar */}
          <Card className={`p-6 rounded-3xl shadow-lg backdrop-blur-2xl border ${
            theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
          }`}>
            <div className="mb-4">
              <h3 className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Skill Categories
              </h3>
              <p className={`text-sm mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Proficiency across development areas
              </p>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarSkillsData}>
                <PolarGrid stroke={theme === 'dark' ? '#ffffff20' : '#00000020'} />
                <PolarAngleAxis dataKey="category" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} style={{ fontSize: '11px' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                <Radar name="Proficiency" dataKey="score" stroke="#5B6FD8" fill="#5B6FD8" fillOpacity={0.6} />
                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', border: 'none', borderRadius: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Individual Skills List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillsData.map((skill, index) => (
            <Card key={index} className={`p-4 rounded-2xl shadow-lg backdrop-blur-2xl border transition-all hover:scale-105 ${
              theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Code className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-[#5B6FD8]'}`} />
                  <h4 className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {skill.skill}
                  </h4>
                </div>
                <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-purple-400' : 'text-[#5B6FD8]'}`}>
                  {skill.level}%
                </span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden mb-2 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-200'}`}>
                <div 
                  className="h-full bg-gradient-to-r from-[#5B6FD8] to-[#7C4DFF] rounded-full transition-all"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {skill.hours}h
                </span>
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {skill.projects} projects
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Projects Section */}
      <div className="space-y-4">
        <h2 className={`text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Active Projects
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {detailedProjects.map((project, index) => (
            <Card 
              key={index} 
              onClick={() => onProjectClick(project)}
              className={`p-5 rounded-2xl shadow-lg backdrop-blur-2xl border transition-all hover:shadow-xl cursor-pointer ${
                theme === 'dark' ? 'bg-gray-800/50 border-white/10 hover:bg-gray-800/70' : 'bg-white/50 border-white/60 hover:bg-white/70'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center flex-shrink-0`}>
                  <GitBranch className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className={`text-base font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {project.name}
                      </h3>
                      <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Click to view details
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.tech.map((tech, techIndex) => (
                      <span key={techIndex} className={`px-2 py-0.5 rounded-md text-xs ${
                        theme === 'dark' ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                      <div>
                        <p className={`text-[10px] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Hours Spent</p>
                        <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{project.hours}h</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                      <div>
                        <p className={`text-[10px] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Last Active</p>
                        <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{project.lastActive}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}