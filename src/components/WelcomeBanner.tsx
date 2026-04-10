import { Card } from "./ui/card";
import { Bot, Sparkles, Zap, Target } from "lucide-react";
import { useUser } from "@/stores/useAuthHooks";

interface WelcomeBannerProps {
  theme: "light" | "dark";
}

export function WelcomeBanner({ theme }: WelcomeBannerProps) {
  const profileUser = useUser();
  const firstName =
    profileUser?.name?.split(/\s+/)[0] || "there";

  return (
    <Card
      className={`p-8 rounded-3xl backdrop-blur-2xl shadow-lg hover:shadow-xl transition-all relative overflow-hidden ${
        theme === "dark"
          ? "bg-gray-800/50 border border-white/10"
          : "bg-white/50 border border-white/60"
      }`}
    >
      <div
        className={`absolute inset-0 ${
          theme === "dark"
            ? "bg-gradient-to-r from-purple-900/20 via-[#7C4DFF]/10 to-purple-900/20"
            : "bg-gradient-to-r from-[#5B6FD8]/5 via-purple-50/50 to-[#7C4DFF]/5"
        }`}
      />
      <div
        className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl ${
          theme === "dark"
            ? "bg-gradient-to-br from-purple-600/20 to-transparent"
            : "bg-gradient-to-br from-[#5B6FD8]/10 to-transparent"
        }`}
      />
      <div className="flex items-center justify-between relative z-10">
        <div className="flex-1">
          <h2
            className={`mb-2 font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Hello {firstName}!
          </h2>
          <p
            className={`leading-relaxed max-w-lg ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Welcome to your developer analytics dashboard. Track your
            coding activity, explore skills, and connect with peers.
          </p>
        </div>
        <div className="flex-shrink-0 ml-8 relative hidden sm:block">
          <div className="w-48 h-48 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#5B6FD8]/20 to-[#7C4DFF]/20 blur-2xl" />
            </div>
            <div className="relative z-10 w-32 h-32 rounded-3xl bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] flex items-center justify-center shadow-lg">
              <Bot className="w-16 h-16 text-white" strokeWidth={1.5} />
              <div className="absolute -top-2 -right-2 w-10 h-10 rounded-xl bg-gradient-to-br from-[#4ECDC4] to-[#44A6A0] flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-2 -left-2 w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD93D] to-[#FFC93D] flex items-center justify-center shadow-md">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="absolute top-1/2 -right-3 w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B9D] to-[#FF8FA3] flex items-center justify-center shadow-md">
                <Target className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
