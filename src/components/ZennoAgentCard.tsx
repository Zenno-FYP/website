import { Card } from "./ui/card";
import { Bot, Bell, Settings } from "lucide-react";
import { Badge } from "./ui/badge";

const tones = [
  { id: "friendly", label: "Friendly", emoji: "😊" },
  { id: "motivational", label: "Motivational", emoji: "💪" },
  { id: "professional", label: "Professional", emoji: "💼" },
  { id: "casual", label: "Casual", emoji: "✨" }
];

interface ZennoAgentCardProps {
  theme: 'light' | 'dark';
  onSettingsClick?: () => void;
}

export function ZennoAgentCard({ theme, onSettingsClick }: ZennoAgentCardProps) {
  const selectedTone = "motivational"; // Currently selected tone
  const notificationCount = 47;
  const selectedToneData = tones.find(t => t.id === selectedTone);
  
  return (
    <Card 
      onClick={onSettingsClick}
      className="p-7 rounded-3xl shadow-xl hover:shadow-2xl border border-white/40 bg-gradient-to-br from-[#7C4DFF]/90 via-[#6B5FD8]/90 to-[#5B6FD8]/90 backdrop-blur-2xl text-white transition-all overflow-hidden relative group cursor-pointer"
    >
      {/* Enhanced Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/15 rounded-full blur-3xl group-hover:blur-2xl transition-all"></div>
      <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/8 rounded-full blur-2xl"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/25 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform">
              <Bot className="w-7 h-7 text-white drop-shadow-lg" />
            </div>
            <div>
              <h3 className="text-white mb-0.5 font-bold">Zenno Agent</h3>
              <p className="text-xs text-white/70">AI Assistant</p>
            </div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onSettingsClick?.();
            }}
            className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg hover:bg-white/30 hover:scale-105 transition-all cursor-pointer"
          >
            <Settings className="w-5 h-5 text-white/90 drop-shadow-md" />
          </button>
        </div>

        {/* Notification Count */}
        <div className="mb-6 p-5 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl group-hover:bg-white/25 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/25 flex items-center justify-center shadow-md">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/80 mb-1">Total Nudges</p>
                <p className="text-3xl text-white">{notificationCount}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-white/20">
            <span className="text-xs text-white/70">Today</span>
            <span className="text-lg text-white">12</span>
          </div>
        </div>

        {/* Active Tone */}
        <div>
          <p className="text-xs text-white/70 mb-3">Active Tone</p>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 hover:bg-white/25 hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="text-xl">{selectedToneData?.emoji}</span>
            </div>
            <span className="text-white flex-1">{selectedToneData?.label}</span>
            <Badge className="bg-green-500/90 text-white border-0 hover:bg-green-500 shadow-md px-3">
              Active
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
