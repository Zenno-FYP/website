import { useState, useEffect } from "react";
import { DeveloperTrendsCard } from "./components/DeveloperTrendsCard";
import { TopAppUsageCard } from "./components/TopAppUsageCard";
import { TopLanguagesCard } from "./components/TopLanguagesCard";
import { RecentProjectsCard } from "./components/RecentProjectsCard";
import { StrongestSkillsCard } from "./components/StrongestSkillsCard";
import { WelcomeBanner } from "./components/WelcomeBanner";
import { KeyMetricsCard } from "./components/KeyMetricsCard";
import { ZennoAgentCard } from "./components/ZennoAgentCard";
import { ZennoAgentPage } from "./components/ZennoAgentPage";
import { ChatsPage } from "./components/ChatsPage";
import { ProfilePage } from "./components/ProfilePage";
import { MetricsDetailPage } from "./components/MetricsDetailPage";
import { SkillsProjectsDetailPage } from "./components/SkillsProjectsDetailPage";
import { AppLanguagesDetailPage } from "./components/AppLanguagesDetailPage";
import { ProjectDetailPage } from "./components/ProjectDetailPage";
import { AuthPage } from "./components/AuthPage";
import { SettingsPanel } from "./components/SettingsPanel";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./components/ui/dropdown-menu";
import { Bell, MessageCircle, Search, Home, Bot, User, Settings, Sparkles, LogOut, UserCircle } from "lucide-react";
import { TrendingUp, Target } from "lucide-react";

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('isAuthenticated');
    return saved === 'true';
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'zennoAgent' | 'chats' | 'profile' | 'metrics' | 'skillsProjects' | 'appLanguages' | 'projectDetail'>('dashboard');
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('isAuthenticated', String(isAuthenticated));
  }, [isAuthenticated]);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
    localStorage.removeItem('isAuthenticated');
  };

  const recentChats = [
    { 
      id: 1, 
      firstName: "Sarah", 
      lastName: "Chen",
      message: "Fix authentication bug", 
      time: "2 min ago", 
      isOnline: true,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    },
    { 
      id: 2, 
      firstName: "Alex", 
      lastName: "Rivera",
      message: "Update dashboard UI", 
      time: "1 hour ago", 
      isOnline: true,
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop"
    },
    { 
      id: 3, 
      firstName: "Michael", 
      lastName: "Thompson",
      message: "Database optimization", 
      time: "3 hours ago", 
      isOnline: false,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    },
    { 
      id: 4, 
      firstName: "Emma", 
      lastName: "Watson",
      message: "API integration help", 
      time: "Yesterday", 
      isOnline: false,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
    },
  ];

  // Show Auth Page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage theme={theme} onLogin={handleLogin} />;
  }

  return (
    <div className={`min-h-screen relative transition-colors duration-500 ${
      theme === 'dark' 
        ? 'bg-[#0a0a0f]' 
        : 'bg-gradient-to-br from-[#E8EAFF] via-[#F5F3FF] to-[#FDF4FF]'
    }`}>
      {/* Animated Background Elements - Fixed to viewport */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Subtle grid pattern overlay */}
        {theme === 'dark' && (
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        )}
        
        {/* Gradient overlays */}
        <div className={`absolute inset-0 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-[#1a1a2e]/30 via-transparent to-transparent'
            : ''
        }`}></div>
        
        <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-purple-600/15 to-blue-600/8' 
            : 'bg-gradient-to-br from-purple-400/8 to-purple-300/4'
        }`}></div>
        <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-purple-600/15 to-[#7C4DFF]/8' 
            : 'bg-gradient-to-br from-purple-400/8 to-purple-300/4'
        }`} style={{ animationDelay: '2s' }}></div>
        
        {/* Diagonal accent */}
        {theme === 'dark' && (
          <div className="absolute top-0 right-0 w-full h-full">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-purple-600/5 to-transparent rotate-12 transform translate-x-1/3 -translate-y-1/3 blur-2xl"></div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Top Navigation Bar */}
        <nav className={`backdrop-blur-2xl fixed top-0 left-0 right-0 z-40 shadow-sm transition-colors duration-500 ${
          theme === 'dark'
            ? 'bg-[#0f0f14]/90 border-b border-white/10'
            : 'bg-white/80 border-b border-white/40'
        }`}>
          <div className={`absolute inset-0 ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-[#0f0f14]/50 via-transparent to-[#0f0f14]/50'
              : 'bg-gradient-to-r from-white/50 via-transparent to-white/50'
          }`}></div>
          <div className="px-8 py-4 relative z-10">
            <div className="flex items-center gap-6">
              {/* Logo */}
              <div className="flex-shrink-0">
                <div className="relative group cursor-pointer">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                    <Sparkles className="w-6 h-6 text-white drop-shadow-md" />
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="relative w-96 flex-shrink-0">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <Input 
                  placeholder="Search..." 
                  className={`w-full pl-11 pr-4 py-2.5 rounded-xl backdrop-blur-xl shadow-sm hover:shadow-md transition-all ${
                    theme === 'dark'
                      ? 'border-white/10 bg-white/5 hover:bg-white/10 focus:bg-white/10 text-white placeholder:text-gray-400 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20'
                      : 'border-gray-200/50 bg-white/40 hover:bg-white/60 focus:bg-white/60 placeholder:text-gray-500 focus:border-[#5B6FD8]/50 focus:ring-1 focus:ring-[#5B6FD8]/20'
                  }`}
                />
              </div>
              
              {/* Spacer */}
              <div className="flex-1"></div>
              
              {/* Right Actions */}
              <div className="flex items-center gap-2">
                {/* Messages Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className={`relative w-10 h-10 rounded-xl backdrop-blur-xl transition-all duration-300 group flex items-center justify-center ${
                      theme === 'dark'
                        ? 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'
                        : 'bg-white/40 hover:bg-white/60 border border-white/30 hover:border-white/50'
                    }`}>
                      <MessageCircle className={`w-5 h-5 transition-colors ${
                        theme === 'dark'
                          ? 'text-gray-400 group-hover:text-purple-400'
                          : 'text-gray-600 group-hover:text-[#5B6FD8]'
                      }`} />
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full"></span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end"
                    sideOffset={8}
                    collisionPadding={8}
                    className={`w-80 rounded-xl shadow-2xl border backdrop-blur-2xl z-50 ${
                      theme === 'dark'
                        ? 'bg-[#121218]/95 border-white/10'
                        : 'bg-white/95 border-gray-200'
                    }`}
                  >
                    <DropdownMenuLabel className={`px-4 py-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Recent Chats
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className={theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'} />
                    <div className="max-h-96 overflow-y-auto px-2 py-1">
                      {recentChats.map((chat) => (
                        <DropdownMenuItem 
                          key={chat.id}
                          onClick={() => {
                            setSelectedChatId(chat.id);
                            setCurrentPage('chats');
                          }}
                          className={`p-3 cursor-pointer my-1.5 rounded-lg shadow-sm ${
                            theme === 'dark'
                              ? 'hover:bg-white/10 focus:bg-white/10 hover:shadow-md'
                              : 'hover:bg-gray-100 focus:bg-gray-100 hover:shadow-md bg-white/50'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="relative flex-shrink-0">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={chat.avatar} alt={chat.firstName} />
                                <AvatarFallback className="bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] text-white text-sm">
                                  {chat.firstName.charAt(0)}{chat.lastName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
                                theme === 'dark' ? 'border-gray-900' : 'border-white'
                              } ${
                                chat.isOnline ? 'bg-green-500' : 'bg-gray-400'
                              }`}></span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <p className={`font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                  {chat.firstName}
                                </p>
                                <p className={`text-xs flex-shrink-0 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {chat.time}
                                </p>
                              </div>
                              <p className={`text-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                {chat.message}
                              </p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </div>
                    <DropdownMenuSeparator className={theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'} />
                    <DropdownMenuItem 
                      onClick={() => {
                        setSelectedChatId(null);
                        setCurrentPage('chats');
                      }}
                      className={`p-3 cursor-pointer mx-2 my-1 rounded-lg justify-center ${
                        theme === 'dark'
                          ? 'hover:bg-white/10 focus:bg-white/10 text-purple-400'
                          : 'hover:bg-gray-100 focus:bg-gray-100 text-[#5B6FD8]'
                      }`}
                    >
                      <span className="text-sm">View all chats</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className={`relative w-10 h-10 rounded-xl backdrop-blur-xl transition-all duration-300 group flex items-center justify-center ${
                      theme === 'dark'
                        ? 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'
                        : 'bg-white/40 hover:bg-white/60 border border-white/30 hover:border-white/50'
                    }`}>
                      <Bell className={`w-5 h-5 transition-colors ${
                        theme === 'dark'
                          ? 'text-gray-400 group-hover:text-purple-400'
                          : 'text-gray-600 group-hover:text-[#5B6FD8]'
                      }`} />
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className={`w-80 rounded-2xl backdrop-blur-2xl border shadow-2xl ${
                      theme === 'dark'
                        ? 'bg-gray-900/95 border-white/10'
                        : 'bg-white/95 border-gray-200/50'
                    }`}
                  >
                    <DropdownMenuLabel className={`text-base px-4 py-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Notifications
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className={theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'} />
                    
                    <div className="max-h-96 overflow-y-auto">
                      <DropdownMenuItem className={`px-4 py-3 cursor-pointer ${
                        theme === 'dark'
                          ? 'hover:bg-white/5 focus:bg-white/5'
                          : 'hover:bg-gray-100/80 focus:bg-gray-100/80'
                      }`}>
                        <div className="flex gap-3 w-full">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium mb-0.5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              New productivity milestone!
                            </p>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              You've coded 40+ hours this week
                            </p>
                            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                              2 hours ago
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>

                      <DropdownMenuItem className={`px-4 py-3 cursor-pointer ${
                        theme === 'dark'
                          ? 'hover:bg-white/5 focus:bg-white/5'
                          : 'hover:bg-gray-100/80 focus:bg-gray-100/80'
                      }`}>
                        <div className="flex gap-3 w-full">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4ECDC4] to-[#44A6A0] flex items-center justify-center flex-shrink-0">
                            <Bot className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium mb-0.5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              Zenno Agent suggestion
                            </p>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              Try optimizing your morning workflow
                            </p>
                            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                              5 hours ago
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>

                      <DropdownMenuItem className={`px-4 py-3 cursor-pointer ${
                        theme === 'dark'
                          ? 'hover:bg-white/5 focus:bg-white/5'
                          : 'hover:bg-gray-100/80 focus:bg-gray-100/80'
                      }`}>
                        <div className="flex gap-3 w-full">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD93D] to-[#FFC93D] flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium mb-0.5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              TypeScript usage increased
                            </p>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              +18% compared to last month
                            </p>
                            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                              1 day ago
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>

                      <DropdownMenuItem className={`px-4 py-3 cursor-pointer ${
                        theme === 'dark'
                          ? 'hover:bg-white/5 focus:bg-white/5'
                          : 'hover:bg-gray-100/80 focus:bg-gray-100/80'
                      }`}>
                        <div className="flex gap-3 w-full">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B9D] to-[#FF8FA3] flex items-center justify-center flex-shrink-0">
                            <MessageCircle className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium mb-0.5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              New message from Sarah
                            </p>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              Check out the new design mockups
                            </p>
                            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                              2 days ago
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>

                      <DropdownMenuItem className={`px-4 py-3 cursor-pointer ${
                        theme === 'dark'
                          ? 'hover:bg-white/5 focus:bg-white/5'
                          : 'hover:bg-gray-100/80 focus:bg-gray-100/80'
                      }`}>
                        <div className="flex gap-3 w-full">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                            <Target className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium mb-0.5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              Weekly goal achieved
                            </p>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              You completed all your tasks!
                            </p>
                            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                              3 days ago
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator className={theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'} />
                    <DropdownMenuItem className={`px-4 py-2.5 cursor-pointer text-center justify-center ${
                      theme === 'dark'
                        ? 'text-purple-400 hover:bg-white/5 focus:bg-white/5'
                        : 'text-[#5B6FD8] hover:bg-gray-100/80 focus:bg-gray-100/80'
                    }`}>
                      <span className="text-sm font-medium">View all notifications</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Divider */}
                <div className={`w-px h-6 mx-1 ${
                  theme === 'dark' ? 'bg-white/10' : 'bg-gray-300'
                }`}></div>
                
                {/* User Profile Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className={`relative rounded-xl backdrop-blur-xl transition-all duration-300 group flex items-center gap-2 px-2 py-1.5 ${
                      theme === 'dark'
                        ? 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'
                        : 'bg-white/40 hover:bg-white/60 border border-white/30 hover:border-white/50'
                    }`}>
                      <Avatar className="w-7 h-7">
                        <AvatarImage src="https://images.unsplash.com/photo-1570170609489-43197f518df0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHBlcnNvbnxlbnwxfHx8fDE3NjA2MDU5NTh8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="User" />
                        <AvatarFallback className="bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] text-white text-xs">JD</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end"
                    sideOffset={8}
                    collisionPadding={8}
                    className={`w-56 rounded-xl shadow-2xl border backdrop-blur-2xl z-50 ${
                      theme === 'dark'
                        ? 'bg-[#121218]/95 border-white/10'
                        : 'bg-white/95 border-gray-200'
                    }`}
                  >
                    <DropdownMenuLabel className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                      My Account
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className={theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'} />
                    <DropdownMenuItem 
                      onClick={() => setCurrentPage('profile')}
                      className={`cursor-pointer rounded-lg mx-2 my-1 ${
                        theme === 'dark'
                          ? 'hover:bg-white/10 focus:bg-white/10'
                          : 'hover:bg-gray-100 focus:bg-gray-100'
                      }`}
                    >
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setIsSettingsOpen(true)}
                      className={`cursor-pointer rounded-lg mx-2 my-1 ${
                        theme === 'dark'
                          ? 'hover:bg-white/10 focus:bg-white/10'
                          : 'hover:bg-gray-100 focus:bg-gray-100'
                      }`}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className={theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'} />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className={`cursor-pointer rounded-lg mx-2 my-1 ${
                        theme === 'dark'
                          ? 'hover:bg-red-500/10 focus:bg-red-500/10 text-red-400'
                          : 'hover:bg-red-50 focus:bg-red-50 text-red-600'
                      }`}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="px-8 py-6 pt-24">
          {currentPage === 'dashboard' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Section - Main Analytics Panel */}
              <div className="lg:col-span-8 space-y-6">
                {/* Welcome Banner */}
                <WelcomeBanner theme={theme} />
                
                {/* Key Metrics */}
                <KeyMetricsCard 
                  theme={theme} 
                  onMetricClick={(metricType) => setCurrentPage(metricType)}
                />
                
                {/* Developer Trends */}
                <DeveloperTrendsCard theme={theme} />
                
                {/* Bottom Row - App Usage and Languages */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TopAppUsageCard 
                    theme={theme} 
                    onViewClick={() => setCurrentPage('appLanguages')}
                  />
                  <TopLanguagesCard 
                    theme={theme}
                    onViewClick={() => setCurrentPage('appLanguages')}
                  />
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                <ZennoAgentCard 
                  theme={theme} 
                  onSettingsClick={() => setCurrentPage('zennoAgent')}
                />
                <StrongestSkillsCard 
                  theme={theme} 
                  onViewClick={() => setCurrentPage('skillsProjects')}
                />
                <RecentProjectsCard 
                  theme={theme}
                  onViewClick={() => setCurrentPage('skillsProjects')}
                />
              </div>
            </div>
          ) : currentPage === 'zennoAgent' ? (
            <ZennoAgentPage 
              theme={theme} 
              onBack={() => setCurrentPage('dashboard')}
            />
          ) : currentPage === 'chats' ? (
            <ChatsPage
              theme={theme}
              onBack={() => setCurrentPage('dashboard')}
              initialContacts={recentChats}
              selectedContactId={selectedChatId || undefined}
            />
          ) : currentPage === 'profile' ? (
            <ProfilePage
              theme={theme}
              onBack={() => setCurrentPage('dashboard')}
            />
          ) : currentPage === 'metrics' ? (
            <MetricsDetailPage
              theme={theme}
              onBack={() => setCurrentPage('dashboard')}
            />
          ) : currentPage === 'appLanguages' ? (
            <AppLanguagesDetailPage
              theme={theme}
              onBack={() => setCurrentPage('dashboard')}
            />
          ) : currentPage === 'projectDetail' ? (
            <ProjectDetailPage
              theme={theme}
              project={selectedProject}
              onBack={() => setCurrentPage('skillsProjects')}
            />
          ) : (
            <SkillsProjectsDetailPage
              theme={theme}
              onBack={() => setCurrentPage('dashboard')}
              onProjectClick={(project) => {
                setSelectedProject(project);
                setCurrentPage('projectDetail');
              }}
            />
          )}
        </div>
      </div>

      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onThemeChange={handleThemeChange}
      />
    </div>
  );
}