import { X, Moon, Sun, Monitor, Palette, Bell, Shield, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export function SettingsPanel({ isOpen, onClose, theme, onThemeChange }: SettingsPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={`fixed right-0 top-0 h-full w-full md:w-[450px] z-50 transform transition-transform duration-300 shadow-2xl ${
        theme === 'dark' 
          ? 'bg-[#0f0f14]/95 backdrop-blur-3xl border-l border-white/10' 
          : 'bg-white/90 backdrop-blur-3xl border-l border-gray-200/50'
      }`}>
        <div className="h-full overflow-y-auto">
          {/* Header */}
          <div className={`sticky top-0 z-10 px-8 py-6 border-b backdrop-blur-2xl ${
            theme === 'dark' ? 'border-white/10 bg-[#0f0f14]/90' : 'border-gray-200/50 bg-white/80'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  theme === 'dark' 
                    ? 'bg-white/10 border border-white/20' 
                    : 'bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF]'
                }`}>
                  <Shield className={`w-6 h-6 ${theme === 'dark' ? 'text-white' : 'text-white'}`} />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Settings</h2>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Customize your experience</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className={`rounded-xl ${
                  theme === 'dark' 
                    ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-6 space-y-8">
            {/* Appearance Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Palette className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-[#5B6FD8]'}`} />
                <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Appearance</h3>
              </div>
              
              {/* Theme Toggle */}
              <div className={`p-5 rounded-2xl ${
                theme === 'dark' 
                  ? 'bg-white/5 border border-white/10' 
                  : 'bg-gray-50/50 border border-gray-200/50'
              }`}>
                <div className="space-y-4">
                  <div 
                    className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
                      theme === 'light'
                        ? 'bg-gradient-to-br from-[#5B6FD8]/10 to-[#7C4DFF]/5 border-2 border-[#5B6FD8]/30'
                        : theme === 'dark' 
                          ? 'bg-white/5 border border-white/10 hover:bg-white/10'
                          : 'bg-white border border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => onThemeChange('light')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        theme === 'light' 
                          ? 'bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF]' 
                          : theme === 'dark'
                            ? 'bg-white/10'
                            : 'bg-gray-100'
                      }`}>
                        <Sun className={`w-5 h-5 ${theme === 'light' ? 'text-white' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Light Mode</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Bright and clean</p>
                      </div>
                    </div>
                    {theme === 'light' && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    )}
                  </div>

                  <div 
                    className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-purple-500/20 to-[#7C4DFF]/10 border-2 border-purple-500/40'
                        : 'bg-white border border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => onThemeChange('dark')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        theme === 'dark' 
                          ? 'bg-gradient-to-br from-purple-500 to-[#7C4DFF]' 
                          : 'bg-gray-100'
                      }`}>
                        <Moon className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Dark Mode</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Easy on the eyes</p>
                      </div>
                    </div>
                    {theme === 'dark' && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-[#7C4DFF] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bell className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-[#5B6FD8]'}`} />
                <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
              </div>
              
              <div className="space-y-3">
                <div className={`flex items-center justify-between p-4 rounded-xl ${
                  theme === 'dark' 
                    ? 'bg-white/5 border border-white/10' 
                    : 'bg-gray-50/50 border border-gray-200/50'
                }`}>
                  <div>
                    <Label className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Push Notifications</Label>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Receive notifications on this device</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className={`flex items-center justify-between p-4 rounded-xl ${
                  theme === 'dark' 
                    ? 'bg-white/5 border border-white/10' 
                    : 'bg-gray-50/50 border border-gray-200/50'
                }`}>
                  <div>
                    <Label className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Email Digest</Label>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Daily summary of your activity</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className={`flex items-center justify-between p-4 rounded-xl ${
                  theme === 'dark' 
                    ? 'bg-white/5 border border-white/10' 
                    : 'bg-gray-50/50 border border-gray-200/50'
                }`}>
                  <div>
                    <Label className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Sound Effects</Label>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Play sounds for notifications</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>

            {/* Logout Section */}
            <div>
              <Button 
                onClick={() => alert('Logout functionality would be implemented here')}
                className={`w-full p-6 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                  theme === 'dark'
                    ? 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40'
                    : 'bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300'
                }`}
                variant="ghost"
              >
                <div className="flex items-center justify-center gap-3 relative z-10">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                    theme === 'dark'
                      ? 'bg-red-500/20 group-hover:bg-red-500/30'
                      : 'bg-red-100 group-hover:bg-red-200'
                  }`}>
                    <LogOut className={`w-5 h-5 ${
                      theme === 'dark' ? 'text-red-400' : 'text-red-600'
                    }`} />
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold ${
                      theme === 'dark' ? 'text-red-400' : 'text-red-600'
                    }`}>Logout</p>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-red-400/60' : 'text-red-600/60'
                    }`}>Sign out of your account</p>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
