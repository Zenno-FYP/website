import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { ArrowLeft, MapPin, Calendar, Link as LinkIcon, Mail, Github, Linkedin, Twitter, Clock, Code2, Zap, TrendingUp, Award, Star, Edit2, Save, X, Eye, EyeOff, GripVertical } from "lucide-react";
import { motion } from "motion/react";

interface ProfilePageProps {
  theme: 'light' | 'dark';
  onBack: () => void;
}

export function ProfilePage({ theme, onBack }: ProfilePageProps) {
  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Profile data state
  const [userData, setUserData] = useState({
    name: "John Doe",
    username: "@johndoe",
    bio: "Full-stack developer passionate about building scalable web applications. Experienced in React, TypeScript, and Node.js. Always learning and exploring new technologies.",
    avatar: "https://images.unsplash.com/photo-1570170609489-43197f518df0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHBlcnNvbnxlbnwxfHx8fDE3NjA2MDU5NTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    location: "San Francisco, CA",
    joinDate: "January 2023",
    email: "john.doe@example.com",
    website: "johndoe.dev",
    social: {
      github: "johndoe",
      linkedin: "johndoe",
      twitter: "johndoe"
    },
    stats: {
      totalProjects: 24,
      totalHours: 1847,
      avgProductivity: 87,
      streak: 42
    }
  });

  // Visibility states
  const [skillsVisibility, setSkillsVisibility] = useState<{[key: string]: boolean}>({
    "React": true,
    "TypeScript": true,
    "Node.js": true,
    "Python": true,
    "PostgreSQL": true,
    "Docker": true,
    "GraphQL": true,
    "AWS": true
  });

  const [appsVisibility, setAppsVisibility] = useState<{[key: string]: boolean}>({
    "VS Code": true,
    "Chrome": true,
    "Terminal": true,
    "Figma": true,
    "Slack": true
  });

  const [languagesVisibility, setLanguagesVisibility] = useState<{[key: string]: boolean}>({
    "TypeScript": true,
    "JavaScript": true,
    "Python": true,
    "HTML/CSS": true,
    "SQL": true
  });

  const [projectsVisibility, setProjectsVisibility] = useState<{[key: number]: boolean}>({
    1: true,
    2: true,
    3: true
  });

  // Projects state for reordering
  const [recentProjects, setRecentProjects] = useState([
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with React and Node.js",
      duration: "3 months",
      totalHours: 342,
      status: "Completed",
      languages: [
        { name: "TypeScript", percentage: 45 },
        { name: "JavaScript", percentage: 30 },
        { name: "CSS", percentage: 15 },
        { name: "SQL", percentage: 10 }
      ],
      topApps: [
        { name: "VS Code", hours: 156 },
        { name: "Chrome", hours: 89 },
        { name: "Terminal", hours: 45 }
      ],
      skills: ["React", "Node.js", "PostgreSQL", "AWS"],
      tools: ["Docker", "GitHub Actions", "Stripe API"],
      productivity: 92
    },
    {
      id: 2,
      title: "Analytics Dashboard",
      description: "Real-time analytics dashboard with data visualization",
      duration: "2 months",
      totalHours: 245,
      status: "Active",
      languages: [
        { name: "TypeScript", percentage: 55 },
        { name: "JavaScript", percentage: 25 },
        { name: "Python", percentage: 20 }
      ],
      topApps: [
        { name: "VS Code", hours: 124 },
        { name: "Chrome", hours: 67 },
        { name: "Terminal", hours: 34 }
      ],
      skills: ["React", "D3.js", "Python", "MongoDB"],
      tools: ["Recharts", "FastAPI", "Redis"],
      productivity: 88
    },
    {
      id: 3,
      title: "Mobile App API",
      description: "RESTful API for mobile application backend",
      duration: "1.5 months",
      totalHours: 198,
      status: "Completed",
      languages: [
        { name: "Python", percentage: 60 },
        { name: "JavaScript", percentage: 25 },
        { name: "SQL", percentage: 15 }
      ],
      topApps: [
        { name: "VS Code", hours: 98 },
        { name: "Postman", hours: 45 },
        { name: "Terminal", hours: 38 }
      ],
      skills: ["FastAPI", "PostgreSQL", "Docker", "JWT"],
      tools: ["Nginx", "Docker Compose", "Swagger"],
      productivity: 90
    }
  ]);

  const topSkills = [
    { name: "React", level: 95, category: "Frontend", hours: 520 },
    { name: "TypeScript", level: 92, category: "Language", hours: 480 },
    { name: "Node.js", level: 88, category: "Backend", hours: 410 },
    { name: "Python", level: 85, category: "Language", hours: 380 },
    { name: "PostgreSQL", level: 82, category: "Database", hours: 340 },
    { name: "Docker", level: 78, category: "DevOps", hours: 310 },
    { name: "GraphQL", level: 75, category: "API", hours: 290 },
    { name: "AWS", level: 72, category: "Cloud", hours: 260 }
  ];

  const topApps = [
    { name: "VS Code", hours: 842, percentage: 45, icon: "💻" },
    { name: "Chrome", hours: 420, percentage: 23, icon: "🌐" },
    { name: "Terminal", hours: 312, percentage: 17, icon: "⚡" },
    { name: "Figma", hours: 156, percentage: 8, icon: "🎨" },
    { name: "Slack", hours: 117, percentage: 7, icon: "💬" }
  ];

  const topLanguages = [
    { name: "TypeScript", percentage: 42, hours: 654, lines: 125000 },
    { name: "JavaScript", percentage: 28, hours: 436, lines: 89000 },
    { name: "Python", percentage: 18, hours: 280, lines: 52000 },
    { name: "HTML/CSS", percentage: 8, hours: 124, lines: 28000 },
    { name: "SQL", percentage: 4, hours: 62, lines: 8500 }
  ];

  const handleSave = () => {
    setIsEditMode(false);
    // Save logic would go here (API call, etc.)
  };

  const handleCancel = () => {
    setIsEditMode(false);
    // Optionally reset to original values
  };

  const toggleSkillVisibility = (skillName: string) => {
    setSkillsVisibility(prev => ({ ...prev, [skillName]: !prev[skillName] }));
  };

  const toggleAppVisibility = (appName: string) => {
    setAppsVisibility(prev => ({ ...prev, [appName]: !prev[appName] }));
  };

  const toggleLanguageVisibility = (langName: string) => {
    setLanguagesVisibility(prev => ({ ...prev, [langName]: !prev[langName] }));
  };

  const toggleProjectVisibility = (projectId: number) => {
    setProjectsVisibility(prev => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  const moveProject = (index: number, direction: 'up' | 'down') => {
    const newProjects = [...recentProjects];
    if (direction === 'up' && index > 0) {
      [newProjects[index], newProjects[index - 1]] = [newProjects[index - 1], newProjects[index]];
    } else if (direction === 'down' && index < newProjects.length - 1) {
      [newProjects[index], newProjects[index + 1]] = [newProjects[index + 1], newProjects[index]];
    }
    setRecentProjects(newProjects);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header with Back Button and Edit Button */}
      <div className="mb-6 flex items-center justify-between">
        <Button
          onClick={onBack}
          variant="ghost"
          className={`group flex items-center gap-2 ${
            theme === 'dark'
              ? 'text-gray-300 hover:text-white hover:bg-white/10'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
          }`}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Button>

        {isEditMode ? (
          <div className="flex gap-2">
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
          </div>
        ) : (
          <Button
            onClick={() => setIsEditMode(true)}
            className="rounded-xl bg-gradient-to-r from-[#5B6FD8] to-[#7C4DFF] hover:from-[#4d5fc7] hover:to-[#6b3eef] text-white"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Profile Header Card */}
        <motion.div variants={itemVariants}>
          <Card className={`rounded-3xl shadow-md border backdrop-blur-xl p-8 ${
            theme === 'dark'
              ? 'bg-white/5 border-white/10'
              : 'bg-white/60 border-white/40'
          }`}>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center md:items-start gap-4">
                <div className="relative group">
                  <Avatar className="w-32 h-32 border-4 border-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] shadow-2xl">
                    <AvatarImage src={userData.avatar} alt={userData.name} />
                    <AvatarFallback className="bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] text-white text-3xl">
                      {userData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-xl group-hover:blur-2xl transition-all"></div>
                </div>
                
                {/* Social Links */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className={`rounded-xl ${
                      theme === 'dark'
                        ? 'border-white/10 hover:bg-white/10'
                        : 'border-gray-300 hover:bg-white/80'
                    }`}
                  >
                    <Github className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={`rounded-xl ${
                      theme === 'dark'
                        ? 'border-white/10 hover:bg-white/10'
                        : 'border-gray-300 hover:bg-white/80'
                    }`}
                  >
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={`rounded-xl ${
                      theme === 'dark'
                        ? 'border-white/10 hover:bg-white/10'
                        : 'border-gray-300 hover:bg-white/80'
                    }`}
                  >
                    <Twitter className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Profile Details */}
              <div className="flex-1 space-y-4">
                <div>
                  {isEditMode ? (
                    <>
                      <Input
                        value={userData.name}
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                        className={`text-2xl mb-2 h-auto py-2 px-3 rounded-xl ${
                          theme === 'dark'
                            ? 'bg-white/10 border-white/20 text-white'
                            : 'bg-white/60 border-gray-300 text-gray-900'
                        }`}
                      />
                      <Input
                        value={userData.username}
                        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                        className={`text-lg mb-4 h-auto py-2 px-3 rounded-xl ${
                          theme === 'dark'
                            ? 'bg-white/10 border-white/20 text-purple-400'
                            : 'bg-white/60 border-gray-300 text-[#5B6FD8]'
                        }`}
                      />
                      <textarea
                        value={userData.bio}
                        onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                        rows={3}
                        className={`w-full max-w-2xl p-3 rounded-xl resize-none ${
                          theme === 'dark'
                            ? 'bg-white/10 border border-white/20 text-gray-300'
                            : 'bg-white/60 border border-gray-300 text-gray-700'
                        }`}
                      />
                    </>
                  ) : (
                    <>
                      <h1 className={`text-4xl mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{userData.name}</h1>
                      <p className={`text-lg mb-4 ${
                        theme === 'dark' ? 'text-purple-400' : 'text-[#5B6FD8]'
                      }`}>{userData.username}</p>
                      <p className={`max-w-2xl ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>{userData.bio}</p>
                    </>
                  )}
                </div>

                {/* Meta Information */}
                <div className="flex flex-wrap gap-4">
                  <div className={`flex items-center gap-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <MapPin className="w-4 h-4" />
                    {isEditMode ? (
                      <Input
                        value={userData.location}
                        onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                        className={`text-sm h-auto py-1 px-2 rounded-lg w-40 ${
                          theme === 'dark'
                            ? 'bg-white/10 border-white/20 text-gray-400'
                            : 'bg-white/60 border-gray-300 text-gray-600'
                        }`}
                      />
                    ) : (
                      <span className="text-sm">{userData.location}</span>
                    )}
                  </div>
                  <div className={`flex items-center gap-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Joined {userData.joinDate}</span>
                  </div>
                  <div className={`flex items-center gap-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <LinkIcon className="w-4 h-4" />
                    {isEditMode ? (
                      <Input
                        value={userData.website}
                        onChange={(e) => setUserData({ ...userData, website: e.target.value })}
                        className={`text-sm h-auto py-1 px-2 rounded-lg w-32 ${
                          theme === 'dark'
                            ? 'bg-white/10 border-white/20 text-gray-400'
                            : 'bg-white/60 border-gray-300 text-gray-600'
                        }`}
                      />
                    ) : (
                      <span className="text-sm">{userData.website}</span>
                    )}
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <div className={`p-4 rounded-2xl text-center shadow-md ${
                    theme === 'dark' ? 'bg-white/5' : 'bg-white/60'
                  }`}>
                    <div className={`text-2xl mb-1 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{userData.stats.totalProjects}</div>
                    <div className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Projects</div>
                  </div>
                  <div className={`p-4 rounded-2xl text-center shadow-md ${
                    theme === 'dark' ? 'bg-white/5' : 'bg-white/60'
                  }`}>
                    <div className={`text-2xl mb-1 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{userData.stats.totalHours}h</div>
                    <div className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Total Hours</div>
                  </div>
                  <div className={`p-4 rounded-2xl text-center shadow-md ${
                    theme === 'dark' ? 'bg-white/5' : 'bg-white/60'
                  }`}>
                    <div className={`text-2xl mb-1 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{userData.stats.avgProductivity}%</div>
                    <div className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Productivity</div>
                  </div>
                  <div className={`p-4 rounded-2xl text-center shadow-md ${
                    theme === 'dark' ? 'bg-white/5' : 'bg-white/60'
                  }`}>
                    <div className={`text-2xl mb-1 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{userData.stats.streak} days</div>
                    <div className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Streak 🔥</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Skills and Apps */}
          <div className="lg:col-span-1 space-y-6">
            {/* Top Skills */}
            <motion.div variants={itemVariants}>
              <Card className={`rounded-3xl shadow-md border backdrop-blur-xl p-6 ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white/60 border-white/40'
              }`}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF]">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <h2 className={`text-xl ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Top Skills</h2>
                </div>
                <div className="space-y-4">
                  {topSkills.map((skill, idx) => (
                    <div key={idx} className={`${!skillsVisibility[skill.name] && 'opacity-40'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex-1">
                          <span className={`text-sm ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>{skill.name}</span>
                          <span className={`text-xs ml-2 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>({skill.hours}h)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${
                            theme === 'dark' ? 'text-purple-400' : 'text-[#5B6FD8]'
                          }`}>{skill.level}%</span>
                          {isEditMode && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleSkillVisibility(skill.name)}
                              className="h-6 w-6 p-0"
                            >
                              {skillsVisibility[skill.name] ? (
                                <Eye className="w-4 h-4" />
                              ) : (
                                <EyeOff className="w-4 h-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                      {skillsVisibility[skill.name] && (
                        <Progress 
                          value={skill.level} 
                          className={`h-2 ${
                            theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Most Used Apps */}
            <motion.div variants={itemVariants}>
              <Card className={`rounded-3xl shadow-md border backdrop-blur-xl p-6 ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white/60 border-white/40'
              }`}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF]">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h2 className={`text-xl ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Most Used Apps</h2>
                </div>
                <div className="space-y-4">
                  {topApps.map((app, idx) => 
                    (appsVisibility[app.name] || isEditMode) && (
                      <div key={idx} className={`p-4 rounded-2xl shadow-sm transition-opacity ${
                        theme === 'dark' ? 'bg-white/5' : 'bg-white/60'
                      } ${!appsVisibility[app.name] && 'opacity-40'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-2xl">{app.icon}</span>
                            <div>
                              <div className={`text-sm ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>{app.name}</div>
                              <div className={`text-xs ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>{app.hours}h</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`${
                              theme === 'dark' ? 'text-purple-400' : 'text-[#5B6FD8]'
                            }`}>{app.percentage}%</span>
                            {isEditMode && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleAppVisibility(app.name)}
                                className="h-6 w-6 p-0"
                              >
                                {appsVisibility[app.name] ? (
                                  <Eye className="w-4 h-4" />
                                ) : (
                                  <EyeOff className="w-4 h-4" />
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                        {appsVisibility[app.name] && (
                          <Progress 
                            value={app.percentage} 
                            className={`h-1.5 ${
                              theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </div>
                    )
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Top Languages */}
            <motion.div variants={itemVariants}>
              <Card className={`rounded-3xl shadow-md border backdrop-blur-xl p-6 ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white/60 border-white/40'
              }`}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF]">
                    <Code2 className="w-5 h-5 text-white" />
                  </div>
                  <h2 className={`text-xl ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Languages</h2>
                </div>
                <div className="space-y-3">
                  {topLanguages.map((lang, idx) => 
                    (languagesVisibility[lang.name] || isEditMode) && (
                      <div key={idx} className={`p-3 rounded-xl shadow-sm transition-opacity ${
                        theme === 'dark' ? 'bg-white/5' : 'bg-white/60'
                      } ${!languagesVisibility[lang.name] && 'opacity-40'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`text-sm ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>{lang.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <div className={`text-sm ${
                                theme === 'dark' ? 'text-purple-400' : 'text-[#5B6FD8]'
                              }`}>{lang.percentage}%</div>
                              <div className={`text-xs ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>{lang.lines.toLocaleString()} lines</div>
                            </div>
                            {isEditMode && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleLanguageVisibility(lang.name)}
                                className="h-6 w-6 p-0"
                              >
                                {languagesVisibility[lang.name] ? (
                                  <Eye className="w-4 h-4" />
                                ) : (
                                  <EyeOff className="w-4 h-4" />
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                        {languagesVisibility[lang.name] && (
                          <Progress 
                            value={lang.percentage} 
                            className={`h-1.5 ${
                              theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </div>
                    )
                  )}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Recent Projects */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div variants={itemVariants}>
              <Card className={`rounded-3xl shadow-md border backdrop-blur-xl p-6 ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white/60 border-white/40'
              }`}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF]">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h2 className={`text-xl ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Recent Projects</h2>
                </div>

                <div className="space-y-6">
                  {recentProjects.map((project, index) => 
                    projectsVisibility[project.id] && (
                      <Card key={project.id} className={`rounded-2xl border backdrop-blur-xl p-6 cursor-pointer transition-all hover:scale-[1.02] shadow-md ${
                        theme === 'dark'
                          ? 'bg-white/5 border-white/10 hover:bg-white/10'
                          : 'bg-white/40 border-white/30 hover:bg-white/60'
                      }`}>
                        {/* Project Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {isEditMode && (
                                <div className="flex flex-col gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => moveProject(index, 'up')}
                                    disabled={index === 0}
                                    className="h-5 w-5 p-0"
                                  >
                                    ▲
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => moveProject(index, 'down')}
                                    disabled={index === recentProjects.length - 1}
                                    className="h-5 w-5 p-0"
                                  >
                                    ▼
                                  </Button>
                                </div>
                              )}
                              <h3 className={`text-lg ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>{project.title}</h3>
                              <Badge className={`${
                                project.status === 'Active'
                                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                  : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                              }`}>
                                {project.status}
                              </Badge>
                            </div>
                            <p className={`text-sm mb-3 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>{project.description}</p>
                            
                            {/* Project Meta */}
                            <div className="flex flex-wrap gap-4 mb-4">
                              <div className={`flex items-center gap-2 text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                <Clock className="w-4 h-4" />
                                {project.duration}
                              </div>
                              <div className={`flex items-center gap-2 text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                <Zap className="w-4 h-4" />
                                {project.totalHours} hours
                              </div>
                              <div className={`flex items-center gap-2 text-sm ${
                                theme === 'dark' ? 'text-purple-400' : 'text-[#5B6FD8]'
                              }`}>
                                <Star className="w-4 h-4" />
                                {project.productivity}% productivity
                              </div>
                            </div>
                          </div>
                          {isEditMode && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleProjectVisibility(project.id)}
                              className="h-8 w-8 p-0"
                            >
                              <EyeOff className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        {/* Language Distribution */}
                        <div className="mb-4">
                          <p className={`text-sm mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>Language Distribution</p>
                          <div className="flex gap-2 mb-2">
                            {project.languages.map((lang, idx) => (
                              <div 
                                key={idx} 
                                className={`h-2 rounded-full ${
                                  idx === 0 ? 'bg-purple-500' :
                                  idx === 1 ? 'bg-blue-500' :
                                  idx === 2 ? 'bg-green-500' :
                                  'bg-yellow-500'
                                }`}
                                style={{ width: `${lang.percentage}%` }}
                              />
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {project.languages.map((lang, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  idx === 0 ? 'bg-purple-500' :
                                  idx === 1 ? 'bg-blue-500' :
                                  idx === 2 ? 'bg-green-500' :
                                  'bg-yellow-500'
                                }`}></div>
                                <span className={`text-xs ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}>{lang.name} ({lang.percentage}%)</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Top Apps Used */}
                        <div className="mb-4">
                          <p className={`text-sm mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>Top Apps Used</p>
                          <div className="flex flex-wrap gap-2">
                            {project.topApps.map((app, idx) => (
                              <Badge 
                                key={idx}
                                variant="outline"
                                className={`${
                                  theme === 'dark'
                                    ? 'bg-white/5 border-white/10 text-gray-300'
                                    : 'bg-white/60 border-gray-300 text-gray-700'
                                }`}
                              >
                                {app.name}: {app.hours}h
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Skills & Tools */}
                        <div className="space-y-3">
                          <div>
                            <p className={`text-sm mb-2 ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>Skills</p>
                            <div className="flex flex-wrap gap-2">
                              {project.skills.map((skill, idx) => (
                                <Badge 
                                  key={idx}
                                  className="bg-gradient-to-r from-[#5B6FD8] to-[#7C4DFF] text-white border-0"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className={`text-sm mb-2 ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>Tools & Frameworks</p>
                            <div className="flex flex-wrap gap-2">
                              {project.tools.map((tool, idx) => (
                                <Badge 
                                  key={idx}
                                  variant="outline"
                                  className={`${
                                    theme === 'dark'
                                      ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                                      : 'bg-purple-100 border-purple-300 text-purple-700'
                                  }`}
                                >
                                  {tool}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                  )}
                  {isEditMode && recentProjects.some(p => !projectsVisibility[p.id]) && (
                    <div className={`text-sm text-center py-4 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {recentProjects.filter(p => !projectsVisibility[p.id]).length} project(s) hidden
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}