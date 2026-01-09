import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import { ArrowLeft, Download, Bot, Bell, Volume2, Power, Sparkles, Palette } from "lucide-react";
import { useState } from "react";

const tones = [
  { id: "friendly", label: "Friendly", emoji: "😊", description: "Warm and approachable responses" },
  { id: "motivational", label: "Motivational", emoji: "💪", description: "Encouraging and energetic" },
  { id: "professional", label: "Professional", emoji: "💼", description: "Formal and business-like" },
  { id: "casual", label: "Casual", emoji: "✨", description: "Relaxed and conversational" }
];

interface ZennoAgentPageProps {
  theme: 'light' | 'dark';
  onBack: () => void;
}

export function ZennoAgentPage({ theme, onBack }: ZennoAgentPageProps) {
  const [selectedTone, setSelectedTone] = useState("motivational");
  const [playSounds, setPlaySounds] = useState(true);
  const [limitNotifications, setLimitNotifications] = useState(false);
  const [shutdownAgent, setShutdownAgent] = useState(false);
  const [notificationVolume, setNotificationVolume] = useState([70]);

  return (
    <div className="min-h-screen pb-12 relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-60">
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

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className={`mb-6 rounded-xl transition-all ${
            theme === 'dark'
              ? 'hover:bg-white/10 text-gray-300 hover:text-white'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7C4DFF] to-[#5B6FD8] flex items-center justify-center shadow-xl`}>
              <Bot className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div>
              <h1 className={`text-3xl mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Zenno Agent
              </h1>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Configure your AI assistant preferences
              </p>
            </div>
          </div>
          
          <Button 
            className="rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#5B6FD8] hover:from-[#6B3FEE] hover:to-[#4A5FC7] text-white shadow-lg hover:shadow-xl transition-all"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Agent
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Tone Settings */}
        <Card className={`p-6 rounded-3xl shadow-xl border backdrop-blur-2xl transition-all ${
          theme === 'dark'
            ? 'bg-[#121218]/80 border-white/10 hover:border-white/20'
            : 'bg-white/80 border-gray-200 hover:border-gray-300'
        }`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'
            }`}>
              <Palette className={`w-6 h-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div>
              <h3 className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                Agent Personality
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Choose how Zenno communicates
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {tones.map((tone) => (
              <div
                key={tone.id}
                onClick={() => setSelectedTone(tone.id)}
                className={`p-4 rounded-2xl cursor-pointer transition-all ${
                  selectedTone === tone.id
                    ? theme === 'dark'
                      ? 'bg-gradient-to-br from-purple-500/30 to-blue-500/20 border-2 border-purple-500/50 shadow-lg'
                      : 'bg-gradient-to-br from-purple-100 to-blue-50 border-2 border-purple-400 shadow-md'
                    : theme === 'dark'
                    ? 'bg-white/5 border border-white/10 hover:bg-white/10'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    selectedTone === tone.id
                      ? 'bg-white/20'
                      : theme === 'dark'
                      ? 'bg-white/10'
                      : 'bg-white'
                  }`}>
                    <span className="text-2xl">{tone.emoji}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {tone.label}
                      </span>
                      {selectedTone === tone.id && (
                        <Badge className="bg-green-500 text-white border-0 text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {tone.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Statistics Card */}
        <Card className={`p-6 rounded-3xl shadow-xl border backdrop-blur-2xl transition-all ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-[#7C4DFF]/20 to-[#5B6FD8]/10 border-purple-500/20'
            : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200'
        }`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'
            }`}>
              <Sparkles className={`w-6 h-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div>
              <h3 className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                Agent Statistics
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Performance metrics
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-2xl col-span-2 shadow-sm ${
              theme === 'dark' ? 'bg-white/10' : 'bg-white/60'
            }`}>
              <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Nudges
              </p>
              <p className={`text-2xl mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                1,247
              </p>
              <div className={`flex items-center justify-between pt-3 border-t ${
                theme === 'dark' ? 'border-white/10' : 'border-gray-200'
              }`}>
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Today
                </span>
                <span className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  47
                </span>
              </div>
            </div>
            <div className={`p-4 rounded-2xl shadow-sm ${
              theme === 'dark' ? 'bg-white/10' : 'bg-white/60'
            }`}>
              <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Avg Response Time
              </p>
              <p className={`text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                15 min
              </p>
            </div>
            <div className={`p-4 rounded-2xl shadow-sm ${
              theme === 'dark' ? 'bg-white/10' : 'bg-white/60'
            }`}>
              <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Success Rate
              </p>
              <p className={`text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                94%
              </p>
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className={`p-6 rounded-3xl shadow-xl border backdrop-blur-2xl transition-all ${
          theme === 'dark'
            ? 'bg-[#121218]/80 border-white/10 hover:border-white/20'
            : 'bg-white/80 border-gray-200 hover:border-gray-300'
        }`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'
            }`}>
              <Bell className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <h3 className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                Notifications
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage alert preferences
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Play Sounds */}
            <div className={`flex items-center justify-between p-4 rounded-2xl shadow-sm ${
              theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-3">
                <Volume2 className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                <div>
                  <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Play Sounds
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Audio alerts for notifications
                  </p>
                </div>
              </div>
              <Switch
                checked={playSounds}
                onCheckedChange={setPlaySounds}
              />
            </div>

            {/* Notification Volume */}
            {playSounds && (
              <div className={`p-4 rounded-2xl shadow-sm ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-3">
                  <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Notification Volume
                  </p>
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {notificationVolume[0]}%
                  </span>
                </div>
                <Slider
                  value={notificationVolume}
                  onValueChange={setNotificationVolume}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            )}

            {/* Limit Notifications */}
            <div className={`flex items-center justify-between p-4 rounded-2xl shadow-sm ${
              theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-3">
                <Bell className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                <div>
                  <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Limit Notifications
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Reduce notification frequency
                  </p>
                </div>
              </div>
              <Switch
                checked={limitNotifications}
                onCheckedChange={setLimitNotifications}
              />
            </div>

            {/* Shutdown Agent */}
            <div className={`flex items-center justify-between p-4 rounded-2xl border-2 shadow-sm ${
              shutdownAgent
                ? theme === 'dark'
                  ? 'bg-red-500/10 border-red-500/30'
                  : 'bg-red-50 border-red-200'
                : theme === 'dark'
                ? 'bg-white/5 border-transparent'
                : 'bg-gray-50 border-transparent'
            }`}>
              <div className="flex items-center gap-3">
                <Power className={`w-5 h-5 ${
                  shutdownAgent
                    ? 'text-red-500'
                    : theme === 'dark'
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`} />
                <div>
                  <p className={`font-medium ${
                    shutdownAgent
                      ? 'text-red-500'
                      : theme === 'dark'
                      ? 'text-white'
                      : 'text-gray-900'
                  }`}>
                    Shutdown Agent
                  </p>
                  <p className={`text-xs ${
                    shutdownAgent
                      ? 'text-red-500/80'
                      : theme === 'dark'
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  }`}>
                    Blocks all nudges from Zenno Agent
                  </p>
                </div>
              </div>
              <Switch
                checked={shutdownAgent}
                onCheckedChange={setShutdownAgent}
              />
            </div>
          </div>
        </Card>
      </div>
      </div>
    </div>
  );
}
