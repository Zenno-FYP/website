import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import {
  ArrowLeft,
  Download,
  Bot,
  Bell,
  Power,
  Sparkles,
  Palette,
  Calendar,
  Brain,
  Heart,
  Volume2,
  RefreshCw,
  Check,
  Loader2,
  TrendingUp,
  BellOff,
  Clock,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import {
  fetchAgentPreferences,
  updateAgentPreferences,
  fetchAgentNudgeStats,
  AgentPreferences,
  AgentNudgeStats,
  WorkSchedule,
  FocusStyle,
  WellbeingGoal,
  AgentTone,
} from "@/services/api";

// Hide the Download Agent button entirely until VITE_DESKTOP_AGENT_DOWNLOAD_URL
// is configured (e.g. signed installer hosted on the marketing site / GitHub
// Releases). Users on environments without this var won't see a dead button.
const DESKTOP_AGENT_DOWNLOAD_URL =
  (import.meta.env.VITE_DESKTOP_AGENT_DOWNLOAD_URL as string | undefined)?.trim() || "";

// ── Option sets ────────────────────────────────────────────────────────────────

const tones: { id: AgentTone; label: string; emoji: string; description: string }[] = [
  { id: "friendly",      label: "Friendly",      emoji: "😊", description: "Warm and approachable responses" },
  { id: "motivational",  label: "Motivational",  emoji: "💪", description: "Encouraging and energetic" },
  { id: "professional",  label: "Professional",  emoji: "💼", description: "Formal and business-like" },
  { id: "casual",        label: "Casual",        emoji: "✨", description: "Relaxed and conversational" },
];

const schedules: { id: WorkSchedule; label: string; emoji: string; description: string }[] = [
  { id: "morning",   label: "Morning Bird",  emoji: "🌅", description: "Active 6 AM – 4 PM" },
  { id: "standard",  label: "Standard Day",  emoji: "🏢", description: "Active 8 AM – 8 PM" },
  { id: "evening",   label: "Evening Shift", emoji: "🌆", description: "Active 11 AM – 10 PM" },
  { id: "night_owl", label: "Night Owl",     emoji: "🦉", description: "Active 2 PM – 1 AM" },
];

const focusStyles: { id: FocusStyle; label: string; emoji: string; description: string }[] = [
  { id: "deep",      label: "Deep Focus",  emoji: "🎯", description: "110-min break reminders" },
  { id: "moderate",  label: "Moderate",    emoji: "⚖️",  description: "75-min break reminders" },
  { id: "pomodoro",  label: "Pomodoro",    emoji: "🍅", description: "35-min sprint cycles" },
];

const wellbeingGoals: { id: WellbeingGoal; label: string; emoji: string; description: string }[] = [
  { id: "focused",  label: "Stay Focused",     emoji: "🔥", description: "Celebrate deep work, flag distractions" },
  { id: "burnout",  label: "Prevent Burnout",  emoji: "💚", description: "Prioritise rest and recovery cues" },
  { id: "habits",   label: "Build Habits",     emoji: "📈", description: "Reference day-level patterns for insight" },
  { id: "minimal",  label: "Minimal Mode",     emoji: "🤫", description: "Only essential nudges, no fluff" },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

const SUPPRESSION_REASON_LABELS: Record<string, string> = {
  nudge_disabled: "Nudges disabled",
  quiet_hours: "Quiet hours",
  too_recent: "Too recent",
  insufficient_activity: "Not enough activity",
  user_idle: "User idle",
  in_meeting: "In a meeting",
  aggregation_failed: "Aggregation failed",
  display_failed: "Display failed",
  unknown: "Unknown",
};

function formatSuppressionReason(reason: string): string {
  if (SUPPRESSION_REASON_LABELS[reason]) return SUPPRESSION_REASON_LABELS[reason];
  return reason
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Defaults ───────────────────────────────────────────────────────────────────

const defaultPrefs: AgentPreferences = {
  user_id: "",
  work_schedule: "standard",
  focus_style: "moderate",
  wellbeing_goal: "focused",
  nudge_enabled: true,
  notification_sound: false,
  agent_tone: "motivational",
};

// ── Component ──────────────────────────────────────────────────────────────────

interface ZennoAgentPageProps {
  theme: "light" | "dark";
  onBack: () => void;
}

export function ZennoAgentPage({ theme, onBack }: ZennoAgentPageProps) {
  const [prefs, setPrefs] = useState<AgentPreferences>(defaultPrefs);
  const [stats, setStats] = useState<AgentNudgeStats>({ total_nudges: 0, today_nudges: 0, this_week_nudges: 0, total_suppressed: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch data ─────────────────────────────────────────────────────────────

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedPrefs, fetchedStats] = await Promise.all([
        fetchAgentPreferences(),
        fetchAgentNudgeStats(),
      ]);
      setPrefs(fetchedPrefs);
      setStats(fetchedStats);
    } catch {
      setError("Failed to load agent data. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Save helper ────────────────────────────────────────────────────────────

  const save = useCallback(async (patch: Partial<AgentPreferences>) => {
    setSaving(true);
    setSaved(false);
    setError(null);
    // Optimistic update: snapshot the previous value so we can revert
    // if the API call fails. This makes the toggle/segmented controls
    // feel instant even on a slow connection.
    let previous: AgentPreferences | null = null;
    setPrefs((prev) => {
      previous = prev;
      return { ...prev, ...patch };
    });
    try {
      const updated = await updateAgentPreferences(patch);
      setPrefs(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      if (previous) setPrefs(previous);
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }, []);

  const handleToneChange = (tone: AgentTone) => save({ agent_tone: tone });
  const handleScheduleChange = (s: WorkSchedule) => save({ work_schedule: s });
  const handleFocusChange = (f: FocusStyle) => save({ focus_style: f });
  const handleGoalChange = (g: WellbeingGoal) => save({ wellbeing_goal: g });
  const handleSoundToggle = (v: boolean) => save({ notification_sound: v });
  const handleNudgeToggle = (v: boolean) => save({ nudge_enabled: v });

  // ── UI helpers ─────────────────────────────────────────────────────────────

  const dark = theme === "dark";
  const cardBase = `p-6 rounded-3xl shadow-xl border backdrop-blur-2xl transition-all ${
    dark ? "bg-[#121218]/80 border-white/10 hover:border-white/20" : "bg-white/80 border-gray-200 hover:border-gray-300"
  }`;

  function OptionGrid<T extends string>({
    options,
    value,
    onChange,
  }: {
    options: { id: T; label: string; emoji: string; description: string }[];
    value: T;
    onChange: (v: T) => void;
  }) {
    return (
      <div className="space-y-3">
        {options.map((opt) => (
          <div
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`p-4 rounded-2xl cursor-pointer transition-all ${
              value === opt.id
                ? dark
                  ? "bg-gradient-to-br from-purple-500/30 to-blue-500/20 border-2 border-purple-500/50 shadow-lg"
                  : "bg-gradient-to-br from-purple-100 to-blue-50 border-2 border-purple-400 shadow-md"
                : dark
                ? "bg-white/5 border border-white/10 hover:bg-white/10"
                : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                value === opt.id ? "bg-white/20" : dark ? "bg-white/10" : "bg-white"
              }`}>
                <span className="text-xl">{opt.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`font-medium text-sm ${dark ? "text-white" : "text-gray-900"}`}>
                    {opt.label}
                  </span>
                  {value === opt.id && (
                    <Badge className="bg-green-500 text-white border-0 text-xs px-2 py-0">Active</Badge>
                  )}
                </div>
                <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-600"}`}>
                  {opt.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen pb-12 relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-60">
        {dark && (
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }} />
        )}
        <div className={`absolute inset-0 ${dark ? "bg-gradient-to-br from-[#1a1a2e]/30 via-transparent to-transparent" : ""}`} />
        <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
          dark ? "bg-gradient-to-br from-purple-600/15 to-blue-600/8" : "bg-gradient-to-br from-purple-400/8 to-purple-300/4"
        }`} />
        <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
          dark ? "bg-gradient-to-br from-purple-600/15 to-[#7C4DFF]/8" : "bg-gradient-to-br from-purple-400/8 to-purple-300/4"
        }`} style={{ animationDelay: "2s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className={`mb-6 rounded-xl transition-all ${
              dark ? "hover:bg-white/10 text-gray-300 hover:text-white" : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7C4DFF] to-[#5B6FD8] flex items-center justify-center shadow-xl">
                <Bot className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
              <div>
                <h1 className={`text-3xl mb-1 ${dark ? "text-white" : "text-gray-900"}`}>
                  Zenno Agent
                </h1>
                <p className={dark ? "text-gray-400" : "text-gray-600"}>
                  Personalize your AI assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Save status indicator */}
              {saving && (
                <div className={`flex items-center gap-1.5 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving…
                </div>
              )}
              {saved && (
                <div className="flex items-center gap-1.5 text-sm text-green-500">
                  <Check className="w-4 h-4" />
                  Saved
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={loadData}
                disabled={loading}
                className={`rounded-xl ${dark ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
              {DESKTOP_AGENT_DOWNLOAD_URL ? (
                <Button
                  asChild
                  className="rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#5B6FD8] hover:from-[#6B3FEE] hover:to-[#4A5FC7] text-white shadow-lg hover:shadow-xl transition-all"
                >
                  <a
                    href={DESKTOP_AGENT_DOWNLOAD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Download the Zenno desktop agent installer"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Agent
                  </a>
                </Button>
              ) : null}
            </div>
          </div>

          {error && (
            <div className={`mt-4 p-3 rounded-xl text-sm ${dark ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-red-50 text-red-600 border border-red-200"}`}>
              {error}
            </div>
          )}
        </div>

        {/* ── Row 1: Statistics + Nudge Master Switch ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Statistics */}
          <Card className={`lg:col-span-2 p-6 rounded-3xl shadow-xl border backdrop-blur-2xl bg-gradient-to-br ${
            dark
              ? "from-[#7C4DFF]/20 to-[#5B6FD8]/10 border-purple-500/20"
              : "from-purple-50 to-blue-50 border-purple-200"
          }`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${dark ? "bg-purple-500/20" : "bg-purple-100"}`}>
                <Sparkles className={`w-6 h-6 ${dark ? "text-purple-400" : "text-purple-600"}`} />
              </div>
              <div>
                <h3 className={dark ? "text-white" : "text-gray-900"}>Agent Statistics</h3>
                <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}>Live nudge metrics</p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-24">
                <Loader2 className={`w-8 h-8 animate-spin ${dark ? "text-purple-400" : "text-purple-500"}`} />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {/* Total nudges */}
                <div className={`p-4 rounded-2xl shadow-sm ${dark ? "bg-white/10" : "bg-white/60"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className={`w-4 h-4 ${dark ? "text-purple-400" : "text-purple-600"}`} />
                    <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-600"}`}>All Time</p>
                  </div>
                  <p className={`text-3xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>
                    {stats.total_nudges.toLocaleString()}
                  </p>
                  <p className={`text-xs mt-1 ${dark ? "text-gray-500" : "text-gray-500"}`}>Total Nudges</p>
                </div>

                {/* This week nudges */}
                <div className={`p-4 rounded-2xl shadow-sm ${dark ? "bg-white/10" : "bg-white/60"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className={`w-4 h-4 ${dark ? "text-green-400" : "text-green-600"}`} />
                    <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-600"}`}>This Week</p>
                  </div>
                  <p className={`text-3xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>
                    {stats.this_week_nudges}
                  </p>
                  <p className={`text-xs mt-1 ${dark ? "text-gray-500" : "text-gray-500"}`}>Nudges This Week</p>
                </div>

                {/* Total suppressed */}
                <div className={`p-4 rounded-2xl shadow-sm ${dark ? "bg-white/10" : "bg-white/60"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <BellOff className={`w-4 h-4 ${dark ? "text-orange-400" : "text-orange-500"}`} />
                    <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-600"}`}>Suppressed</p>
                  </div>
                  <p className={`text-3xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>
                    {stats.total_suppressed.toLocaleString()}
                  </p>
                  <p className={`text-xs mt-1 ${dark ? "text-gray-500" : "text-gray-500"}`}>Not Shown</p>
                </div>
              </div>
            )}

            {/* Suppression reason breakdown (when desktop agent is up to date) */}
            {!loading && stats.suppressed_by_reason && Object.keys(stats.suppressed_by_reason).length > 0 && (
              <div className={`mt-5 p-4 rounded-2xl ${dark ? "bg-white/5 border border-white/10" : "bg-white/60 border border-gray-200"}`}>
                <p className={`text-xs uppercase tracking-wide mb-3 ${dark ? "text-gray-400" : "text-gray-600"}`}>
                  Why nudges were suppressed
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(stats.suppressed_by_reason)
                    .sort((a, b) => b[1] - a[1])
                    .map(([reason, count]) => (
                      <span
                        key={reason}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                          dark ? "bg-orange-500/15 text-orange-200 border border-orange-400/30"
                               : "bg-orange-50 text-orange-700 border border-orange-200"
                        }`}
                        title={reason}
                      >
                        {formatSuppressionReason(reason)}
                        <span className={dark ? "text-orange-300/80" : "text-orange-600/80"}>
                          {count.toLocaleString()}
                        </span>
                      </span>
                    ))}
                </div>
              </div>
            )}
          </Card>

          {/* Quick controls */}
          <Card className={cardBase}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${dark ? "bg-blue-500/20" : "bg-blue-100"}`}>
                <Bell className={`w-6 h-6 ${dark ? "text-blue-400" : "text-blue-600"}`} />
              </div>
              <div>
                <h3 className={dark ? "text-white" : "text-gray-900"}>Controls</h3>
                <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}>Quick settings</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Nudge master switch */}
              <div className={`flex items-center justify-between p-4 rounded-2xl ${
                !prefs.nudge_enabled
                  ? dark ? "bg-red-500/10 border-2 border-red-500/30" : "bg-red-50 border-2 border-red-200"
                  : dark ? "bg-white/5 border border-white/10" : "bg-gray-50 border border-gray-200"
              }`}>
                <div className="flex items-center gap-3">
                  <Power className={`w-5 h-5 ${!prefs.nudge_enabled ? "text-red-500" : dark ? "text-gray-400" : "text-gray-600"}`} />
                  <div>
                    <p className={`font-medium text-sm ${!prefs.nudge_enabled ? "text-red-500" : dark ? "text-white" : "text-gray-900"}`}>
                      Nudges {prefs.nudge_enabled ? "Enabled" : "Disabled"}
                    </p>
                    <p className={`text-xs ${!prefs.nudge_enabled ? "text-red-500/80" : dark ? "text-gray-400" : "text-gray-600"}`}>
                      {prefs.nudge_enabled ? "Agent is running" : "All nudges are off"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={prefs.nudge_enabled}
                  onCheckedChange={handleNudgeToggle}
                  disabled={saving || loading}
                />
              </div>

              {/* Notification sound toggle */}
              <div className={`flex items-center justify-between p-4 rounded-2xl ${dark ? "bg-white/5 border border-white/10" : "bg-gray-50 border border-gray-200"}`}>
                <div className="flex items-center gap-3">
                  <Volume2 className={`w-5 h-5 ${dark ? "text-gray-400" : "text-gray-600"}`} />
                  <div>
                    <p className={`font-medium text-sm ${dark ? "text-white" : "text-gray-900"}`}>
                      Notification Sound
                    </p>
                    <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-600"}`}>
                      {prefs.notification_sound ? "Chime plays with each nudge" : "Silent notifications"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={prefs.notification_sound}
                  onCheckedChange={handleSoundToggle}
                  disabled={saving || loading}
                />
              </div>

              {prefs.updatedAt && (
                <p className={`text-xs text-center ${dark ? "text-gray-600" : "text-gray-400"}`}>
                  Last updated {new Date(prefs.updatedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* ── Row 2: Personalization ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Work Schedule */}
          <Card className={cardBase}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${dark ? "bg-orange-500/20" : "bg-orange-100"}`}>
                <Calendar className={`w-6 h-6 ${dark ? "text-orange-400" : "text-orange-600"}`} />
              </div>
              <div>
                <h3 className={dark ? "text-white" : "text-gray-900"}>Work Schedule</h3>
                <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}>Sets your active hours & quiet window</p>
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className={`w-6 h-6 animate-spin ${dark ? "text-gray-500" : "text-gray-400"}`} /></div>
            ) : (
              <OptionGrid options={schedules} value={prefs.work_schedule} onChange={handleScheduleChange} />
            )}
          </Card>

          {/* Focus Style */}
          <Card className={cardBase}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${dark ? "bg-cyan-500/20" : "bg-cyan-100"}`}>
                <Brain className={`w-6 h-6 ${dark ? "text-cyan-400" : "text-cyan-600"}`} />
              </div>
              <div>
                <h3 className={dark ? "text-white" : "text-gray-900"}>Focus Style</h3>
                <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}>Tunes break reminders & flow streaks</p>
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className={`w-6 h-6 animate-spin ${dark ? "text-gray-500" : "text-gray-400"}`} /></div>
            ) : (
              <OptionGrid options={focusStyles} value={prefs.focus_style} onChange={handleFocusChange} />
            )}
          </Card>
        </div>

        {/* ── Row 3: Wellbeing + Agent Tone ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Wellbeing Goal */}
          <Card className={cardBase}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${dark ? "bg-green-500/20" : "bg-green-100"}`}>
                <Heart className={`w-6 h-6 ${dark ? "text-green-400" : "text-green-600"}`} />
              </div>
              <div>
                <h3 className={dark ? "text-white" : "text-gray-900"}>Wellbeing Goal</h3>
                <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}>Sets AI nudge persona & frequency</p>
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className={`w-6 h-6 animate-spin ${dark ? "text-gray-500" : "text-gray-400"}`} /></div>
            ) : (
              <OptionGrid options={wellbeingGoals} value={prefs.wellbeing_goal} onChange={handleGoalChange} />
            )}
          </Card>

          {/* Agent Tone */}
          <Card className={cardBase}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${dark ? "bg-purple-500/20" : "bg-purple-100"}`}>
                <Palette className={`w-6 h-6 ${dark ? "text-purple-400" : "text-purple-600"}`} />
              </div>
              <div>
                <h3 className={dark ? "text-white" : "text-gray-900"}>Agent Personality</h3>
                <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}>How Zenno communicates with you</p>
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className={`w-6 h-6 animate-spin ${dark ? "text-gray-500" : "text-gray-400"}`} /></div>
            ) : (
              <OptionGrid options={tones} value={prefs.agent_tone} onChange={handleToneChange} />
            )}
          </Card>
        </div>

        {/* Sync hint */}
        <p className={`mt-6 text-center text-xs ${dark ? "text-gray-600" : "text-gray-400"}`}>
          Changes save instantly and are picked up by the desktop agent within 5 minutes.
        </p>
      </div>
    </div>
  );
}
