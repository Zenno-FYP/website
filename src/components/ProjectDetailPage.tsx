import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowLeft, Edit2, Save, X, Code, Clock, Calendar, FileCode, Layers, Smartphone, Globe, Database, Terminal } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ProjectDetailPageProps {
  theme: 'light' | 'dark';
  project: any;
  onBack: () => void;
}

export function ProjectDetailPage({ theme, project, onBack }: ProjectDetailPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(project.name);
  const [editedDescription, setEditedDescription] = useState(
    "A full-featured e-commerce platform with real-time inventory management, secure payment processing, and advanced analytics dashboard for monitoring sales and user behavior."
  );

  // Project-specific data
  const languageData = [
    { language: 'JavaScript', lines: 15420, percentage: 42, color: '#5B6FD8' },
    { language: 'TypeScript', lines: 8340, percentage: 23, color: '#4ECDC4' },
    { language: 'CSS/SCSS', lines: 5680, percentage: 15, color: '#FFD93D' },
    { language: 'HTML', lines: 4230, percentage: 12, color: '#FF6B9D' },
    { language: 'JSON', lines: 2890, percentage: 8, color: '#9CA3AF' },
  ];

  const topSkills = [
    { skill: 'React', proficiency: 95, hours: 89 },
    { skill: 'Node.js', proficiency: 88, hours: 45 },
    { skill: 'MongoDB', proficiency: 82, hours: 22 },
  ];

  const toolsUsed = [
    { name: 'VS Code', icon: Code, hours: 142, percentage: 91 },
    { name: 'Terminal', icon: Terminal, hours: 8, percentage: 5 },
    { name: 'Browser DevTools', icon: Globe, hours: 6, percentage: 4 },
  ];

  const appPlatforms = [
    { platform: 'Web App', icon: Globe, type: 'Primary' },
    { platform: 'Mobile Responsive', icon: Smartphone, type: 'Secondary' },
    { platform: 'API Backend', icon: Database, type: 'Service' },
  ];

  const weeklyActivity = [
    { week: 'Week 1', hours: 32, commits: 45 },
    { week: 'Week 2', hours: 38, commits: 52 },
    { week: 'Week 3', hours: 28, commits: 38 },
    { week: 'Week 4', hours: 35, commits: 48 },
    { week: 'Week 5', hours: 23, commits: 31 },
  ];

  const totalLines = languageData.reduce((sum, lang) => sum + lang.lines, 0);

  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(project.name);
    setIsEditing(false);
  };

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
          <div className="flex-1">
            {isEditing ? (
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className={`text-2xl font-semibold h-auto py-2 px-3 rounded-xl ${
                  theme === 'dark'
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'bg-white/60 border-gray-300 text-gray-900'
                }`}
              />
            ) : (
              <h1 className={`text-3xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {editedName}
              </h1>
            )}
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Project Analytics & Details
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleCancel}
                variant="outline"
                className={`rounded-xl ${
                  theme === 'dark'
                    ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                    : 'bg-white/50 hover:bg-white/70 border-white/60 text-gray-900'
                }`}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="rounded-xl bg-gradient-to-r from-[#5B6FD8] to-[#7C4DFF] hover:from-[#4d5fc7] hover:to-[#6b3eef] text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="rounded-xl bg-gradient-to-r from-[#5B6FD8] to-[#7C4DFF] hover:from-[#4d5fc7] hover:to-[#6b3eef] text-white"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Project
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className={`p-4 rounded-2xl shadow-lg backdrop-blur-2xl border ${
          theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
        }`}>
          <div className="flex flex-col gap-2">
            <Clock className={`w-8 h-8 ${theme === 'dark' ? 'text-purple-400' : 'text-[#5B6FD8]'}`} />
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Hours</p>
              <p className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{project.hours}h</p>
            </div>
          </div>
        </Card>

        <Card className={`p-4 rounded-2xl shadow-lg backdrop-blur-2xl border ${
          theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
        }`}>
          <div className="flex flex-col gap-2">
            <FileCode className={`w-8 h-8 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Lines of Code</p>
              <p className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{totalLines.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className={`p-4 rounded-2xl shadow-lg backdrop-blur-2xl border ${
          theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
        }`}>
          <div className="flex flex-col gap-2">
            <Layers className={`w-8 h-8 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Technologies</p>
              <p className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{project.tech.length}</p>
            </div>
          </div>
        </Card>

        <Card className={`p-4 rounded-2xl shadow-lg backdrop-blur-2xl border ${
          theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
        }`}>
          <div className="flex flex-col gap-2">
            <Calendar className={`w-8 h-8 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Last Active</p>
              <p className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{project.lastActive}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Description */}
      <Card className={`p-6 rounded-3xl shadow-lg backdrop-blur-2xl border ${
        theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
      }`}>
        <h3 className={`text-lg mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Project Description
        </h3>
        {isEditing ? (
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            rows={4}
            className={`w-full p-3 rounded-xl resize-none ${
              theme === 'dark'
                ? 'bg-white/10 border border-white/20 text-white placeholder:text-gray-400'
                : 'bg-white/60 border border-gray-300 text-gray-900 placeholder:text-gray-500'
            }`}
          />
        ) : (
          <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {editedDescription}
          </p>
        )}
      </Card>

      {/* Languages & Top Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Languages Distribution */}
        <Card className={`p-6 rounded-3xl shadow-lg backdrop-blur-2xl border ${
          theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
        }`}>
          <h3 className={`text-lg mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Languages Used
          </h3>
          <div className="space-y-3 mb-4">
            {languageData.map((lang, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: lang.color }}></div>
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {lang.language}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {lang.lines.toLocaleString()} lines
                    </span>
                    <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {lang.percentage}%
                    </span>
                  </div>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-200'}`}>
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Skills */}
        <Card className={`p-6 rounded-3xl shadow-lg backdrop-blur-2xl border ${
          theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
        }`}>
          <h3 className={`text-lg mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Top Skills in This Project
          </h3>
          <div className="space-y-4">
            {topSkills.map((skill, index) => (
              <div key={index} className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white/60'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Code className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-[#5B6FD8]'}`} />
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {skill.skill}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {skill.hours}h
                    </span>
                    <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-purple-400' : 'text-[#5B6FD8]'}`}>
                      {skill.proficiency}%
                    </span>
                  </div>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-200'}`}>
                  <div 
                    className="h-full bg-gradient-to-r from-[#5B6FD8] to-[#7C4DFF] rounded-full transition-all"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Tools & Platforms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tools Used */}
        <Card className={`p-6 rounded-3xl shadow-lg backdrop-blur-2xl border ${
          theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
        }`}>
          <h3 className={`text-lg mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Development Tools
          </h3>
          <div className="space-y-3">
            {toolsUsed.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <div key={index} className={`p-3 rounded-xl flex items-center justify-between ${
                  theme === 'dark' ? 'bg-white/5' : 'bg-white/60'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {tool.name}
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {tool.hours}h spent • {tool.percentage}%
                      </p>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                    theme === 'dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {tool.percentage}%
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* App Platforms */}
        <Card className={`p-6 rounded-3xl shadow-lg backdrop-blur-2xl border ${
          theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
        }`}>
          <h3 className={`text-lg mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Application Platforms
          </h3>
          <div className="space-y-3">
            {appPlatforms.map((app, index) => {
              const Icon = app.icon;
              return (
                <div key={index} className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white/60'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                      app.type === 'Primary' ? 'from-[#5B6FD8] to-[#7C4DFF]' :
                      app.type === 'Secondary' ? 'from-[#4ECDC4] to-[#44A6A0]' :
                      'from-[#FFD93D] to-[#FFC93D]'
                    } flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {app.platform}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-md ${
                        app.type === 'Primary' 
                          ? theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                          : app.type === 'Secondary'
                          ? theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700'
                          : theme === 'dark' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {app.type}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Weekly Activity */}
      <Card className={`p-6 rounded-3xl shadow-lg backdrop-blur-2xl border ${
        theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
      }`}>
        <h3 className={`text-lg mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Recent Activity
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={weeklyActivity}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#ffffff15' : '#00000015'} vertical={false} />
            <XAxis dataKey="week" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} style={{ fontSize: '12px' }} />
            <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} style={{ fontSize: '12px' }} />
            <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', border: 'none', borderRadius: '12px' }} />
            <Legend />
            <Bar dataKey="hours" fill="#5B6FD8" radius={[8, 8, 0, 0]} name="Hours" />
            <Bar dataKey="commits" fill="#4ECDC4" radius={[8, 8, 0, 0]} name="Commits" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Technologies Used */}
      <Card className={`p-6 rounded-3xl shadow-lg backdrop-blur-2xl border ${
        theme === 'dark' ? 'bg-gray-800/50 border-white/10' : 'bg-white/50 border-white/60'
      }`}>
        <h3 className={`text-lg mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          All Technologies
        </h3>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech: string, index: number) => (
            <span key={index} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              theme === 'dark' ? 'bg-white/10 text-gray-300' : 'bg-white/60 text-gray-700'
            }`}>
              {tech}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}
