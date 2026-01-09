import { Card } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "./ui/badge";

const chats = [
  { 
    name: "Sarah", 
    message: "Hey! Can you review the latest design files?", 
    time: "2m ago", 
    avatar: "S", 
    color: "from-[#5B6FD8] to-[#7C4DFF]",
    online: true,
    unread: 2
  },
  { 
    name: "Alex", 
    message: "The API integration is complete ✅", 
    time: "1h ago", 
    avatar: "A", 
    color: "from-[#4ECDC4] to-[#44A6A0]",
    online: true,
    unread: 0
  },
  { 
    name: "Emma", 
    message: "Thanks for the help with the bug fix!", 
    time: "5h ago", 
    avatar: "E", 
    color: "from-[#FF6B9D] to-[#FF8FA3]",
    online: false,
    unread: 0
  },
];

interface RecentChatsCardProps {
  theme: 'light' | 'dark';
}

export function RecentChatsCard({ theme }: RecentChatsCardProps) {
  return (
    <Card className={`p-6 rounded-3xl shadow-lg hover:shadow-xl backdrop-blur-2xl transition-all overflow-hidden relative ${
      theme === 'dark'
        ? 'bg-gray-800/50 border border-white/10'
        : 'bg-white/50 border border-white/60'
    }`}>
      {/* Decorative gradient */}
      <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl -z-0 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-purple-600/15 to-transparent'
          : 'bg-gradient-to-br from-[#5B6FD8]/10 to-transparent'
      }`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Recent Chats</h3>
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Stay connected</p>
          </div>
          <Button variant="ghost" size="icon" className={`h-9 w-9 rounded-xl ${
            theme === 'dark'
              ? 'text-gray-400 hover:text-gray-200 hover:bg-white/10'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/80'
          }`}>
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="space-y-2">
          {chats.map((chat, index) => (
            <div 
              key={index} 
              className={`flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 cursor-pointer group border shadow-sm ${
                theme === 'dark'
                  ? 'border-white/5 hover:bg-white/10 hover:border-white/20 hover:shadow-lg shadow-black/10'
                  : 'border-gray-100/50 hover:bg-white/60 hover:border-white/80 hover:shadow-md shadow-gray-200/50'
              }`}
            >
              <div className="relative flex-shrink-0">
                <Avatar className={`w-11 h-11 ring-2 shadow-lg transition-transform group-hover:scale-105 ${
                  theme === 'dark' ? 'ring-gray-700/50' : 'ring-white/80'
                }`}>
                  <AvatarFallback className={`bg-gradient-to-br ${chat.color} text-white font-semibold`}>
                    {chat.avatar}
                  </AvatarFallback>
                </Avatar>
                {chat.online && (
                  <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 shadow-sm ${
                    theme === 'dark' ? 'border-gray-800' : 'border-white'
                  }`}>
                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <p className={`font-semibold transition-colors ${
                    theme === 'dark'
                      ? 'text-white group-hover:text-purple-400'
                      : 'text-gray-900 group-hover:text-[#5B6FD8]'
                  }`}>{chat.name}</p>
                  <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{chat.time}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className={`text-sm truncate flex-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>{chat.message}</p>
                  {chat.unread > 0 && (
                    <Badge className={`rounded-full h-5 min-w-[20px] px-1.5 flex items-center justify-center text-xs font-semibold shadow-md ${
                      theme === 'dark'
                        ? 'bg-purple-500 hover:bg-purple-500'
                        : 'bg-[#5B6FD8] hover:bg-[#5B6FD8]'
                    } text-white`}>
                      {chat.unread}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
