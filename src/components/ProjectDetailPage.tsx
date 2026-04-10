import { useEffect, useState, useCallback, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  Edit2,
  Save,
  X,
  Code,
  Clock,
  Calendar,
  FileCode,
  Loader2,
  AppWindow,
  Keyboard,
  Chrome,
  Terminal,
  MessageSquare,
  Figma,
  Zap,
  Bug,
  BookOpen,
  MessageCircle,
  CircleSlash,
  Ellipsis,
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react";
import { AxiosError } from "axios";
import {
  fetchProjectDetail,
  patchProject,
  deleteProject,
  ProjectDetailResponse,
  ProjectContextBreakdown,
  ProjectNamedHoursRow,
} from "@/services/api";
import { handleApiError } from "@/services/errorHandler";
import { useFirebaseUser } from "@/stores/useAuthHooks";

interface ProjectDetailPageProps {
  theme: "light" | "dark";
  onBack: () => void;
  /** Used when the app opens this screen via state instead of `/projects/:projectName` */
  project?: { name: string } | null;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3776AB",
  JSON: "#F7DF1E",
  HTML: "#E34C26",
  CSS: "#563D7C",
  Markdown: "#083FA1",
  YAML: "#CB171E",
};

function langColor(name: string): string {
  return LANG_COLORS[name] ?? "#5B6FD8";
}

function formatActivityDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function formatLines(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return `${n}`;
}

/** Prefer precise seconds from API so short skills are not hidden as 0.0h */
function formatSkillDuration(sec: number): string {
  if (!Number.isFinite(sec) || sec <= 0) return "—";
  if (sec < 60) return `${Math.max(1, Math.round(sec))}s`;
  if (sec < 3600) return `${Math.round(sec / 60)}m`;
  const h = sec / 3600;
  return h < 10 ? `${h.toFixed(2)}h` : `${h.toFixed(1)}h`;
}

/** Context / app rows store decimal hours; avoid showing 0.0h when sync uses seconds (e.g. Research 175s). */
function formatDurationFromHours(h: number): string {
  if (!Number.isFinite(h) || h <= 0) return "0s";
  const sec = h * 3600;
  if (sec < 60) return `${Math.max(1, Math.round(sec))}s`;
  if (h < 1) return `${Math.round(sec / 60)}m`;
  return h >= 10 ? `${h.toFixed(1)}h` : `${h.toFixed(2)}h`;
}

function formatLastActiveCompact(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function displayTitle(data: ProjectDetailResponse | null): string {
  if (!data) return "Project";
  const d = data.display_name?.trim();
  return d && d.length > 0 ? d : data.project_name;
}

function contextHoursTotal(cb: ProjectContextBreakdown): number {
  return (
    cb.flow_hours +
    cb.debugging_hours +
    cb.research_hours +
    cb.communication_hours +
    cb.distracted_hours +
    cb.other_hours
  );
}

const CONTEXT_ROWS: {
  key: keyof ProjectContextBreakdown;
  label: string;
  color: string;
  icon: LucideIcon;
}[] = [
  { key: "flow_hours", label: "Flow", color: "#5B6FD8", icon: Zap },
  { key: "debugging_hours", label: "Debugging", color: "#FF6B6B", icon: Bug },
  { key: "research_hours", label: "Research", color: "#4ECDC4", icon: BookOpen },
  { key: "communication_hours", label: "Communication", color: "#FFD93D", icon: MessageCircle },
  { key: "distracted_hours", label: "Distracted", color: "#FF6B9D", icon: CircleSlash },
  { key: "other_hours", label: "Other context", color: "#94A3B8", icon: Ellipsis },
];

const APP_COLOR_PALETTE = [
  "linear-gradient(to bottom right, #5B6FD8, #7C4DFF)",
  "linear-gradient(to bottom right, #4ECDC4, #44A6A0)",
  "linear-gradient(to bottom right, #FB542B, #FF8C42)",
  "linear-gradient(to bottom right, #FF6B9D, #FF8FA3)",
  "linear-gradient(to bottom right, #FFD93D, #FFC93D)",
  "linear-gradient(to bottom right, #9B59B6, #8E44AD)",
  "linear-gradient(to bottom right, #25D366, #20BA58)",
  "linear-gradient(to bottom right, #0078D4, #0063B1)",
];

function hashNameToPaletteIndex(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % APP_COLOR_PALETTE.length;
}

function appLinearGradient(name: string): string {
  return APP_COLOR_PALETTE[hashNameToPaletteIndex(name)];
}

function appBarGradient(name: string): string {
  const hex = ["#5B6FD8", "#4ECDC4", "#FB542B", "#FF6B9D", "#FFD93D", "#9B59B6", "#25D366", "#0078D4"][
    hashNameToPaletteIndex(name)
  ];
  return `linear-gradient(to right, ${hex}, ${hex}dd)`;
}

function getAppIconComponent(appName: string): LucideIcon {
  const n = appName.toLowerCase();
  if (n.includes("code") || n.includes("vscode") || n.includes("vs ")) return Code;
  if (n.includes("chrome") || n.includes("brave") || n.includes("firefox") || n.includes("edge")) return Chrome;
  if (n.includes("terminal") || n.includes("cmd") || n.includes("powershell")) return Terminal;
  if (n.includes("slack") || n.includes("whatsapp") || n.includes("message") || n.includes("discord"))
    return MessageSquare;
  if (n.includes("figma")) return Figma;
  return AppWindow;
}

function langSquareGradient(languageName: string): string {
  const c = langColor(languageName);
  return `linear-gradient(to bottom right, ${c}, ${c}cc)`;
}

function DashboardStyleRow({
  theme,
  name,
  percent,
  squareGradientCss,
  barGradientCss,
  icon,
  rightPrimary,
  rightSecondary,
}: {
  theme: "light" | "dark";
  name: string;
  percent: number;
  squareGradientCss: string;
  barGradientCss: string;
  icon: ReactNode;
  rightPrimary: string;
  rightSecondary?: string;
}) {
  return (
    <div
      className={`group rounded-2xl border p-4 shadow-sm backdrop-blur-xl transition-all duration-300 ${
        theme === "dark"
          ? "border-white/5 shadow-black/10 hover:border-white/20 hover:bg-white/[0.07]"
          : "border-gray-100/50 shadow-gray-200/50 hover:border-white/80 hover:bg-white/60"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-md transition-transform group-hover:scale-105"
          style={{ background: squareGradientCss }}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className={`truncate font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{name}</p>
            <div className="shrink-0 text-right">
              <p className={`font-semibold tabular-nums ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {rightPrimary}
              </p>
              {rightSecondary ? (
                <p className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>{rightSecondary}</p>
              ) : null}
            </div>
          </div>
          <div
            className={`relative h-2 w-full overflow-hidden rounded-full ${
              theme === "dark" ? "bg-gray-700/80" : "bg-gray-200/60"
            }`}
          >
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(100, percent)}%`,
                background: barGradientCss,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const TOP_APPS_PREVIEW = 5;

function AppUsageRows({ rows, theme }: { rows: ProjectNamedHoursRow[]; theme: "light" | "dark" }) {
  const [expanded, setExpanded] = useState(false);

  if (rows.length === 0) {
    return (
      <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>No app time recorded yet.</p>
    );
  }

  const hasMore = rows.length > TOP_APPS_PREVIEW;
  const visible = expanded || !hasMore ? rows : rows.slice(0, TOP_APPS_PREVIEW);
  const hiddenCount = rows.length - TOP_APPS_PREVIEW;

  return (
    <div className="space-y-3">
      {visible.map((row) => {
        const Icon = getAppIconComponent(row.name);
        const g = appLinearGradient(row.name);
        const bar = appBarGradient(row.name);
        return (
          <DashboardStyleRow
            key={row.name}
            theme={theme}
            name={row.name}
            percent={row.percent}
            squareGradientCss={g}
            barGradientCss={bar}
            icon={<Icon className="h-6 w-6 text-white" strokeWidth={2} />}
            rightPrimary={formatDurationFromHours(row.duration_hours)}
            rightSecondary={`${row.percent.toFixed(1)}% of app time`}
          />
        );
      })}
      {hasMore ? (
        <div className="flex justify-center pt-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setExpanded((e) => !e)}
            className={`gap-1.5 rounded-xl ${
              theme === "dark"
                ? "text-gray-300 hover:bg-white/10 hover:text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {expanded ? (
              <>
                Show less
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Show more ({hiddenCount} more)
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function LanguageTimeRows({ rows, theme }: { rows: ProjectNamedHoursRow[]; theme: "light" | "dark" }) {
  if (rows.length === 0) {
    return (
      <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>No language time recorded yet.</p>
    );
  }
  return (
    <div className="space-y-3">
      {rows.map((row) => {
        const c = langColor(row.name);
        const bar = `linear-gradient(to right, ${c}, ${c}dd)`;
        return (
          <DashboardStyleRow
            key={row.name}
            theme={theme}
            name={row.name}
            percent={row.percent}
            squareGradientCss={langSquareGradient(row.name)}
            barGradientCss={bar}
            icon={<FileCode className="h-6 w-6 text-white" strokeWidth={2} />}
            rightPrimary={formatDurationFromHours(row.duration_hours)}
            rightSecondary={`${row.percent.toFixed(1)}% of language time`}
          />
        );
      })}
    </div>
  );
}

function panelCardClass(theme: "light" | "dark"): string {
  return `relative overflow-hidden rounded-3xl border p-6 shadow-lg backdrop-blur-2xl transition-all ${
    theme === "dark"
      ? "border-white/10 bg-gray-800/50 hover:bg-gray-800/70"
      : "border-white/60 bg-white/50 hover:bg-white/70"
  }`;
}

function panelDecorBlurs(theme: "light" | "dark") {
  return (
    <>
      <div
        className={`pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full blur-3xl ${
          theme === "dark"
            ? "bg-gradient-to-br from-purple-600/20 to-blue-600/10"
            : "bg-gradient-to-br from-[#5B6FD8]/15 to-[#7C4DFF]/10"
        }`}
      />
      <div
        className={`pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full blur-3xl ${
          theme === "dark"
            ? "bg-gradient-to-br from-[#7C4DFF]/15 to-transparent"
            : "bg-gradient-to-br from-[#7C4DFF]/12 to-[#5B6FD8]/8"
        }`}
      />
    </>
  );
}

function SectionHeading({
  theme,
  title,
  subtitle,
}: {
  theme: "light" | "dark";
  title: string;
  subtitle: ReactNode;
}) {
  return (
    <div className="mb-5">
      <h3 className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{title}</h3>
      <div className={`mt-1 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{subtitle}</div>
    </div>
  );
}

function MetricStripCard({
  theme,
  label,
  value,
  icon: Icon,
  gradient,
  bgBlob,
}: {
  theme: "light" | "dark";
  label: string;
  value: string;
  icon: LucideIcon;
  gradient: string;
  bgBlob: string;
}) {
  return (
    <Card
      className={`relative min-w-[7.25rem] flex-1 overflow-hidden rounded-2xl border p-4 shadow-lg backdrop-blur-2xl ${
        theme === "dark"
          ? "border-white/10 bg-gray-800/50"
          : "border-white/60 bg-white/50"
      }`}
    >
      <div
        className={`pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full blur-2xl ${bgBlob} opacity-50`}
      />
      <div className="relative z-10 flex flex-col items-center text-center">
        <div
          className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-md ${gradient}`}
        >
          <Icon className="h-5 w-5 text-white" strokeWidth={2} />
        </div>
        <p
          className={`line-clamp-2 text-sm font-bold leading-tight tabular-nums ${theme === "dark" ? "text-white" : "text-gray-900"}`}
        >
          {value}
        </p>
        <p className={`mt-0.5 text-[11px] leading-tight ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          {label}
        </p>
      </div>
    </Card>
  );
}

export function ProjectDetailPage({ theme, onBack, project }: ProjectDetailPageProps) {
  const { projectName: projectNameParam } = useParams();
  const fromRoute =
    projectNameParam != null && projectNameParam !== ""
      ? decodeURIComponent(projectNameParam)
      : "";
  const fromProp = project?.name?.trim() ?? "";
  const canonicalName = fromRoute || fromProp;

  const firebaseUser = useFirebaseUser();
  const [data, setData] = useState<ProjectDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDisplayName, setEditedDisplayName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(() => {
    if (!canonicalName) {
      setLoading(false);
      setError("Missing project name.");
      return;
    }
    setLoading(true);
    setError(null);
    fetchProjectDetail(canonicalName)
      .then((res) => {
        setData(res);
        setEditedDisplayName(res.display_name?.trim() ? res.display_name : res.project_name);
        setEditedDescription(res.description ?? "");
      })
      .catch((err: unknown) => {
        const message =
          err instanceof AxiosError ? handleApiError(err) : "Could not load project.";
        setError(message);
        console.error("fetchProjectDetail:", err);
      })
      .finally(() => setLoading(false));
  }, [canonicalName, project?.name]);

  useEffect(() => {
    load();
  }, [load, firebaseUser?.uid]);

  const handleSave = async () => {
    if (!canonicalName || !data) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await patchProject(canonicalName, {
        display_name: editedDisplayName.trim(),
        description: editedDescription,
      });
      setData(updated);
      setIsEditing(false);
    } catch (err: unknown) {
      const message =
        err instanceof AxiosError ? handleApiError(err) : "Could not save changes.";
      setError(message);
      console.error("patchProject:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!data) return;
    setEditedDisplayName(data.display_name?.trim() ? data.display_name : data.project_name);
    setEditedDescription(data.description ?? "");
    setIsEditing(false);
  };

  const handleDeleteProject = async () => {
    if (!canonicalName) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteProject(canonicalName);
      setDeleteConfirmOpen(false);
      onBack();
    } catch (err: unknown) {
      const message =
        err instanceof AxiosError ? handleApiError(err) : "Could not delete project.";
      setError(message);
      console.error("deleteProject:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <Button
            onClick={onBack}
            variant="outline"
            size="icon"
            className={`shrink-0 rounded-xl backdrop-blur-xl transition-all ${
              theme === "dark"
                ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                : "border-white/60 bg-white/50 text-gray-900 hover:bg-white/70"
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <label className={`block text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Display name
                </label>
                <Input
                  value={editedDisplayName}
                  onChange={(e) => setEditedDisplayName(e.target.value)}
                  maxLength={200}
                  placeholder={data?.project_name}
                  className={`rounded-xl ${
                    theme === "dark"
                      ? "border-white/15 bg-white/10 text-white"
                      : "border-gray-200 bg-white/80 text-gray-900"
                  }`}
                />
                <p className={`text-xs leading-relaxed ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                  <span className={`font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    Sync name (unchanged):
                  </span>{" "}
                  <span className="font-mono">{data?.project_name}</span>
                  {" · "}
                  Only the display name is saved. Match the sync name or clear the field to use the default title.
                </p>
              </div>
            ) : (
              <>
                <h1 className={`text-2xl font-semibold tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {loading ? "…" : displayTitle(data)}
                </h1>
                {data && data.display_name?.trim() && data.display_name.trim() !== data.project_name && (
                  <p className={`mt-1 font-mono text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                    {data.project_name}
                  </p>
                )}
              </>
            )}
            <p className={`mt-1.5 text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Edit <span className="font-medium">display name</span> (dashboard only) and description. The project sync
              name stays the same. Stats come from your agent sync.
            </p>
          </div>
        </div>
        {!loading && data && (
          <div className="flex shrink-0 flex-wrap gap-2">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                  className={`rounded-xl ${
                    theme === "dark"
                      ? "border-white/15 text-white hover:bg-white/10"
                      : "border-gray-200"
                  }`}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={saving}
                  className="rounded-xl bg-gradient-to-r from-[#5B6FD8] to-[#7C4DFF] text-white hover:opacity-95"
                >
                  {saving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDeleteConfirmOpen(true)}
                  disabled={deleting}
                  className={`rounded-xl border-red-500/40 text-red-600 hover:bg-red-500/10 hover:text-red-700 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/15 dark:hover:text-red-300`}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setDeleteConfirmOpen(false);
                    setIsEditing(true);
                  }}
                  className="rounded-xl bg-gradient-to-r from-[#5B6FD8] to-[#7C4DFF] text-white hover:opacity-95"
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {!loading && data && deleteConfirmOpen && (
        <Card
          className={`rounded-2xl border p-5 ${
            theme === "dark"
              ? "border-red-500/25 bg-red-950/20"
              : "border-red-200 bg-red-50/80"
          }`}
        >
          <p className={`text-sm font-medium ${theme === "dark" ? "text-red-200" : "text-red-900"}`}>
            Delete this project?
          </p>
          <p className={`mt-2 text-sm leading-relaxed ${theme === "dark" ? "text-red-100/80" : "text-red-800/90"}`}>
            This removes the project and <span className="font-medium">all daily activity</span> stored for{" "}
            <span className="font-mono">{data.project_name}</span> on the server. Your agent can create the project
            again the next time it syncs.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={deleting}
              className={`rounded-xl ${
                theme === "dark"
                  ? "border-white/15 text-white hover:bg-white/10"
                  : "border-gray-200"
              }`}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void handleDeleteProject()}
              disabled={deleting}
              className="rounded-xl"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete permanently
            </Button>
          </div>
        </Card>
      )}

      {loading && (
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Loading…</p>
      )}
      {error && (
        <p className={theme === "dark" ? "text-red-400" : "text-red-600"}>{error}</p>
      )}

      {!loading && data && (
        <>
          <div className="flex flex-row flex-nowrap items-stretch gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <MetricStripCard
              theme={theme}
              label="Active hours"
              value={formatDurationFromHours(data.app_time_hours)}
              icon={Clock}
              gradient="from-[#5B6FD8] to-[#7C4DFF]"
              bgBlob="bg-gradient-to-br from-[#5B6FD8]/30 to-[#7C4DFF]/20"
            />
            <MetricStripCard
              theme={theme}
              label="Lines of code"
              value={formatLines(data.total_lines)}
              icon={FileCode}
              gradient="from-emerald-500 to-teal-600"
              bgBlob="bg-gradient-to-br from-emerald-500/25 to-teal-500/15"
            />
            <MetricStripCard
              theme={theme}
              label="Files"
              value={`${data.total_files}`}
              icon={FileCode}
              gradient="from-amber-500 to-orange-500"
              bgBlob="bg-gradient-to-br from-amber-400/25 to-orange-500/15"
            />
            <MetricStripCard
              theme={theme}
              label="Last active"
              value={formatLastActiveCompact(data.last_active)}
              icon={Calendar}
              gradient="from-pink-500 to-rose-500"
              bgBlob="bg-gradient-to-br from-pink-500/25 to-rose-500/15"
            />
          </div>

          <p className={`text-[11px] leading-snug ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
            Activity rows are one document per calendar day per <span className="font-mono">project_name</span> (e.g.
            website vs backend). Active hours sum <span className="font-mono">apps</span> across those days for this
            project only.
          </p>

          <Card className={panelCardClass(theme)}>
            {panelDecorBlurs(theme)}
            <div className="relative z-10">
              <SectionHeading
                theme={theme}
                title="Description"
                subtitle="Notes for this project (saved on the server)."
              />
              {isEditing ? (
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  maxLength={2000}
                  rows={4}
                  placeholder="Short summary of what this project is…"
                  className={`w-full resize-y rounded-2xl border p-3 text-sm ${
                    theme === "dark"
                      ? "border-white/15 bg-white/5 text-white placeholder:text-gray-500"
                      : "border-gray-200 bg-white/80 text-gray-900 placeholder:text-gray-400"
                  }`}
                />
              ) : (
                <p
                  className={`text-sm leading-relaxed ${
                    data.description?.trim()
                      ? theme === "dark"
                        ? "text-gray-300"
                        : "text-gray-700"
                      : theme === "dark"
                        ? "text-gray-500 italic"
                        : "text-gray-400 italic"
                  }`}
                >
                  {data.description?.trim() || "No description yet. Click Edit to add one."}
                </p>
              )}
              {data.first_seen && (
                <p className={`mt-3 text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                  First seen {formatActivityDate(data.first_seen)}
                </p>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className={panelCardClass(theme)}>
              {panelDecorBlurs(theme)}
              <div className="relative z-10">
                <SectionHeading
                  theme={theme}
                  title="Top apps"
                  subtitle="Time in each app while this project was active (daily activity rows)."
                />
                <AppUsageRows rows={data.top_apps} theme={theme} />
              </div>
            </Card>

            <Card className={panelCardClass(theme)}>
              {panelDecorBlurs(theme)}
              <div className="relative z-10">
                <SectionHeading
                  theme={theme}
                  title="Context"
                  subtitle="Focus mix from synced context (seconds → m / s / h)."
                />
                {contextHoursTotal(data.context_breakdown) <= 0 ? (
                  <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>
                    No context breakdown for this project yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {CONTEXT_ROWS.map(({ key, label, color, icon: CtxIcon }) => {
                      const hours = data.context_breakdown[key];
                      if (hours <= 0) return null;
                      const total = contextHoursTotal(data.context_breakdown);
                      const pct = total > 0 ? (hours / total) * 100 : 0;
                      const square = `linear-gradient(to bottom right, ${color}, ${color}cc)`;
                      const bar = `linear-gradient(to right, ${color}, ${color}dd)`;
                      return (
                        <DashboardStyleRow
                          key={key}
                          theme={theme}
                          name={label}
                          percent={pct}
                          squareGradientCss={square}
                          barGradientCss={bar}
                          icon={<CtxIcon className="h-6 w-6 text-white" strokeWidth={2} />}
                          rightPrimary={formatDurationFromHours(hours)}
                          rightSecondary={`${pct.toFixed(1)}% of context`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </Card>
          </div>

          <Card className={panelCardClass(theme)}>
            {panelDecorBlurs(theme)}
            <div className="relative z-10">
              <SectionHeading
                theme={theme}
                title="Performance"
                subtitle={
                  <>
                    From daily <span className="font-mono">behavior</span>: typing and mouse rates weighted by context
                    time each day; idle time summed across days.
                  </>
                }
              />
              <div className="flex flex-row flex-nowrap items-stretch gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div
                  className={`min-w-[7rem] flex-1 rounded-2xl border p-4 text-center shadow-sm ${
                    theme === "dark" ? "border-white/10 bg-white/[0.04]" : "border-gray-100 bg-white/70"
                  }`}
                >
                  <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] shadow-md">
                    <Keyboard className="h-5 w-5 text-white" />
                  </div>
                  <p className={`text-lg font-bold tabular-nums ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {data.behavior.avg_typing_kpm > 0 ? data.behavior.avg_typing_kpm : "—"}
                  </p>
                  <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>KPM typing</p>
                </div>
                <div
                  className={`min-w-[7rem] flex-1 rounded-2xl border p-4 text-center shadow-sm ${
                    theme === "dark" ? "border-white/10 bg-white/[0.04]" : "border-gray-100 bg-white/70"
                  }`}
                >
                  <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#4ECDC4] to-[#44A6A0] shadow-md">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <p className={`text-lg font-bold tabular-nums ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {data.behavior.avg_mouse_cpm > 0 ? data.behavior.avg_mouse_cpm : "—"}
                  </p>
                  <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>CPM mouse</p>
                </div>
                <div
                  className={`min-w-[7rem] flex-1 rounded-2xl border p-4 text-center shadow-sm ${
                    theme === "dark" ? "border-white/10 bg-white/[0.04]" : "border-gray-100 bg-white/70"
                  }`}
                >
                  <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFD93D] to-[#FFC93D] shadow-md">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <p className={`text-lg font-bold tabular-nums ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {data.behavior.total_idle_hours > 0
                      ? formatDurationFromHours(data.behavior.total_idle_hours)
                      : "—"}
                  </p>
                  <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Idle total</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className={panelCardClass(theme)}>
              {panelDecorBlurs(theme)}
              <div className="relative z-10">
                <SectionHeading
                  theme={theme}
                  title="Languages (lines)"
                  subtitle="Latest snapshot from project sync — lines per language."
                />
                {data.languages.length === 0 ? (
                  <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>
                    No language snapshot yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {data.languages.map((lang) => {
                      const c = langColor(lang.name);
                      const square = `linear-gradient(to bottom right, ${c}, ${c}cc)`;
                      const bar = `linear-gradient(to right, ${c}, ${c}dd)`;
                      return (
                        <DashboardStyleRow
                          key={lang.name}
                          theme={theme}
                          name={lang.name}
                          percent={lang.percent}
                          squareGradientCss={square}
                          barGradientCss={bar}
                          icon={<FileCode className="h-6 w-6 text-white" strokeWidth={2} />}
                          rightPrimary={`${lang.lines.toLocaleString()} lines`}
                          rightSecondary={`${lang.percent.toFixed(1)}% of LOC`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </Card>

            <Card className={panelCardClass(theme)}>
              {panelDecorBlurs(theme)}
              <div className="relative z-10">
                <SectionHeading
                  theme={theme}
                  title="Languages (active time)"
                  subtitle="Tracked time per language from activity sync."
                />
                <LanguageTimeRows rows={data.languages_by_active_time} theme={theme} />
              </div>
            </Card>
          </div>

          <Card className={panelCardClass(theme)}>
            {panelDecorBlurs(theme)}
            <div className="relative z-10">
              <SectionHeading
                theme={theme}
                title="Skills in this project"
                subtitle="Merged by name — short sessions show as seconds or minutes."
              />
              {data.skills.length === 0 ? (
                <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>
                  No skill time recorded for this project yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {(() => {
                    const maxSec = Math.max(...data.skills.map((s) => s.duration_sec), 1);
                    return data.skills.map((skill, idx) => {
                      const g = appLinearGradient(skill.name);
                      const bar = appBarGradient(skill.name);
                      const pct = maxSec > 0 ? (skill.duration_sec / maxSec) * 100 : 0;
                      return (
                        <DashboardStyleRow
                          key={`${skill.name}-${idx}`}
                          theme={theme}
                          name={skill.name}
                          percent={pct}
                          squareGradientCss={g}
                          barGradientCss={bar}
                          icon={<Code className="h-6 w-6 text-white" strokeWidth={2} />}
                          rightPrimary={formatSkillDuration(skill.duration_sec)}
                          rightSecondary="vs longest skill in project"
                        />
                      );
                    });
                  })()}
                </div>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
