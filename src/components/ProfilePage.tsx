import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import {
  ArrowLeft,
  Calendar,
  Mail,
  Github,
  Linkedin,
  Twitter,
  Clock,
  Code2,
  Zap,
  Award,
  Edit2,
  Save,
  X,
  Eye,
  EyeOff,
  Loader2,
  ChevronDown,
  ChevronUp,
  Flame,
  TrendingUp,
  Camera,
  MessageCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { AxiosError } from "axios";
import {
  fetchProfilePage,
  fetchPublicProfile,
  type ProfilePageResponse,
  type ProfileProjectCard,
  type PublicProfileUser,
} from "@/services/api";
import { userService, type ProfilePreferences } from "@/services/userService";
import { handleApiError } from "@/services/errorHandler";
import { useFirebaseUser, useUser, useAuthActions } from "@/stores/useAuthHooks";

interface ProfilePageProps {
  theme: "light" | "dark";
  onBack: () => void;
  /** When set, show that user’s public profile (read-only, server applies their visibility prefs). */
  viewUserId?: string | null;
  backLabel?: string;
  /** Public profile only: start a direct message with this user. */
  onStartChatWithPeer?: (userId: string) => void;
}

const MAX_GLOBAL_VISIBLE = 6;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

function emptyPrefs(): ProfilePreferences {
  return {
    hidden_project_names: [],
    project_order: [],
    hidden_skill_names: [],
    hidden_app_names: [],
    hidden_language_names: [],
  };
}

function mergeProjectOrder(savedOrder: string[], projects: ProfileProjectCard[]): string[] {
  const names = projects.map((p) => p.project_name);
  const set = new Set(names);
  const ordered = savedOrder.filter((n) => set.has(n));
  for (const n of names) {
    if (!ordered.includes(n)) ordered.push(n);
  }
  return ordered;
}

function formatJoinDate(iso: string | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

function formatLastActiveCompact(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

/** App / active hours from decimal hours */
function formatHours(h: number): string {
  if (!Number.isFinite(h) || h <= 0) return "0s";
  const sec = h * 3600;
  if (sec < 60) return `${Math.max(1, Math.round(sec))}s`;
  if (h < 1) return `${Math.round(sec / 60)}m`;
  return h >= 10 ? `${h.toFixed(1)}h` : `${h.toFixed(2)}h`;
}

function projectTitle(p: ProfileProjectCard): string {
  const d = p.display_name?.trim();
  return d && d.length > 0 ? d : p.project_name;
}

function insightLabel(ins: ProfileProjectCard["insight"]): string {
  if (ins.kind === "flow_focus" && ins.flow_focus_percent != null) {
    return `Flow focus ${ins.flow_focus_percent}%`;
  }
  if (ins.kind === "dominant_context" && ins.label != null && ins.percent != null) {
    return `${ins.label} ${ins.percent}%`;
  }
  return "—";
}

/** Distinct colors per language; hash fallback for unknown names. */
const LANG_DISTINCT_COLORS: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3776AB",
  JSON: "#FFA726",
  HTML: "#E34C26",
  CSS: "#563D7C",
  Markdown: "#083FA1",
  YAML: "#CB171E",
  "C#": "#239120",
  Go: "#00ADD8",
  Rust: "#DEA584",
  Java: "#F89820",
  Kotlin: "#7F52FF",
  Ruby: "#CC342D",
  PHP: "#777BB4",
  Swift: "#F05138",
  Vue: "#42B883",
  SQL: "#E38B00",
  Shell: "#89E051",
  Bash: "#89E051",
  SCSS: "#CF649A",
  SASS: "#CF649A",
  Less: "#1D365D",
};

function languageBarColor(name: string): string {
  const key = name.trim();
  if (LANG_DISTINCT_COLORS[key]) {
    return LANG_DISTINCT_COLORS[key];
  }
  const lower = key.toLowerCase();
  for (const [k, v] of Object.entries(LANG_DISTINCT_COLORS)) {
    if (k.toLowerCase() === lower) return v;
  }
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 62% 52%)`;
}

/** Normalize slice widths so stacked segments fill 100% of the bar (API % can sum to &lt;100). */
function normalizedLanguagePercents(languages: ProfileProjectCard["languages"]): { name: string; percent: number }[] {
  const raw = languages.map((l) => ({
    name: l.name,
    percent: Math.max(0, Number(l.percent) || 0),
  }));
  const sum = raw.reduce((s, x) => s + x.percent, 0);
  if (sum <= 0) return raw;
  return raw.map((x) => ({ ...x, percent: (x.percent / sum) * 100 }));
}

export function ProfilePage({
  theme,
  onBack,
  viewUserId = null,
  backLabel = "Back to Dashboard",
  onStartChatWithPeer,
}: ProfilePageProps) {
  const navigate = useNavigate();
  const firebaseUser = useFirebaseUser();
  const user = useUser();
  const { setUser } = useAuthActions();
  const isPublicView = Boolean(viewUserId);

  const [pageData, setPageData] = useState<ProfilePageResponse | null>(null);
  const [publicUser, setPublicUser] = useState<PublicProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [removePhotoPending, setRemovePhotoPending] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editGithub, setEditGithub] = useState("");
  const [editLinkedin, setEditLinkedin] = useState("");
  const [editTwitter, setEditTwitter] = useState("");

  const [draftOrder, setDraftOrder] = useState<string[]>([]);
  const [draftHiddenProjects, setDraftHiddenProjects] = useState<Set<string>>(() => new Set());
  const [draftHiddenSkills, setDraftHiddenSkills] = useState<Set<string>>(() => new Set());
  const [draftHiddenApps, setDraftHiddenApps] = useState<Set<string>>(() => new Set());
  const [draftHiddenLangs, setDraftHiddenLangs] = useState<Set<string>>(() => new Set());

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (viewUserId) {
        const data = await fetchPublicProfile(viewUserId);
        setPublicUser(data.user);
        setPageData(data.profile);
      } else {
        setPublicUser(null);
        const [u, page] = await Promise.all([userService.getProfile(), fetchProfilePage()]);
        setUser(u);
        setPageData(page);
      }
    } catch (err: unknown) {
      const message = err instanceof AxiosError ? handleApiError(err) : "Could not load profile.";
      setError(message);
      console.error("profile load:", err);
    } finally {
      setLoading(false);
    }
  }, [setUser, viewUserId]);

  useEffect(() => {
    void loadAll();
  }, [loadAll, firebaseUser?.uid]);

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    };
  }, [photoPreviewUrl]);

  const prefs = isPublicView ? emptyPrefs() : (user?.profile_preferences ?? emptyPrefs());

  const projectByName = useMemo(() => {
    const m = new Map<string, ProfileProjectCard>();
    for (const p of pageData?.projects ?? []) m.set(p.project_name, p);
    return m;
  }, [pageData?.projects]);

  const viewProjectOrder = useMemo(
    () => mergeProjectOrder(prefs.project_order ?? [], pageData?.projects ?? []),
    [prefs.project_order, pageData?.projects],
  );

  const hiddenProjectsView = useMemo(() => new Set(prefs.hidden_project_names ?? []), [prefs.hidden_project_names]);
  const hiddenSkillsView = useMemo(() => new Set(prefs.hidden_skill_names ?? []), [prefs.hidden_skill_names]);
  const hiddenAppsView = useMemo(() => new Set(prefs.hidden_app_names ?? []), [prefs.hidden_app_names]);
  const hiddenLangsView = useMemo(() => new Set(prefs.hidden_language_names ?? []), [prefs.hidden_language_names]);

  const subject = useMemo(() => {
    if (isPublicView) {
      if (!publicUser) return null;
      return {
        name: publicUser.name,
        email: undefined as string | undefined,
        profilePhoto: publicUser.profilePhoto,
        description: publicUser.description,
        github_url: publicUser.github_url,
        linkedin_url: publicUser.linkedin_url,
        twitter_url: publicUser.twitter_url,
        createdAt: publicUser.createdAt ?? undefined,
      };
    }
    if (!user) return null;
    return {
      name: user.name,
      email: user.email,
      profilePhoto: user.profilePhoto ?? null,
      description: user.description,
      github_url: user.github_url,
      linkedin_url: user.linkedin_url,
      twitter_url: user.twitter_url,
      createdAt: user.createdAt,
    };
  }, [isPublicView, publicUser, user]);

  const openEdit = () => {
    if (isPublicView || !user || !pageData) return;
    setEditName(user.name);
    setEditDescription(user.description ?? "");
    setEditGithub(user.github_url ?? "");
    setEditLinkedin(user.linkedin_url ?? "");
    setEditTwitter(user.twitter_url ?? "");
    setDraftOrder(mergeProjectOrder(user.profile_preferences?.project_order ?? [], pageData.projects));
    setDraftHiddenProjects(new Set(user.profile_preferences?.hidden_project_names ?? []));
    setDraftHiddenSkills(new Set(user.profile_preferences?.hidden_skill_names ?? []));
    setDraftHiddenApps(new Set(user.profile_preferences?.hidden_app_names ?? []));
    setDraftHiddenLangs(new Set(user.profile_preferences?.hidden_language_names ?? []));
    setPhotoError(null);
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoPreviewUrl(null);
    setPhotoFile(null);
    setRemovePhotoPending(false);
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setPhotoError(null);
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoPreviewUrl(null);
    setPhotoFile(null);
    setRemovePhotoPending(false);
    setIsEditMode(false);
  };

  const onPhotoFileChosen = (fileList: FileList | null) => {
    setPhotoError(null);
    const file = fileList?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file (PNG, JPG, or WebP).");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError("Image must be 5 MB or smaller.");
      return;
    }
    setRemovePhotoPending(false);
    setPhotoFile(file);
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoPreviewUrl(URL.createObjectURL(file));
  };

  const clearPendingPhoto = () => {
    setPhotoError(null);
    setPhotoFile(null);
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoPreviewUrl(null);
    setRemovePhotoPending(true);
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    setPhotoError(null);
    try {
      if (photoFile) {
        const withPhoto = await userService.updateProfilePhoto(photoFile);
        setUser(withPhoto);
      }
      const updated = await userService.patchProfile({
        name: editName.trim() || user.name,
        description: editDescription,
        github_url: editGithub.trim(),
        linkedin_url: editLinkedin.trim(),
        twitter_url: editTwitter.trim(),
        profile_preferences: {
          hidden_project_names: [...draftHiddenProjects],
          project_order: [...draftOrder],
          hidden_skill_names: [...draftHiddenSkills],
          hidden_app_names: [...draftHiddenApps],
          hidden_language_names: [...draftHiddenLangs],
        },
        ...(removePhotoPending && !photoFile ? { remove_profile_photo: true } : {}),
      });
      setUser(updated);
      const page = await fetchProfilePage();
      setPageData(page);
      if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
      setPhotoPreviewUrl(null);
      setPhotoFile(null);
      setRemovePhotoPending(false);
      if (photoInputRef.current) photoInputRef.current.value = "";
      setIsEditMode(false);
    } catch (err: unknown) {
      const message = err instanceof AxiosError ? handleApiError(err) : "Could not save profile.";
      setError(message);
      console.error("save profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const moveProject = (index: number, dir: -1 | 1) => {
    setDraftOrder((order) => {
      const j = index + dir;
      if (j < 0 || j >= order.length) return order;
      const next = [...order];
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  const cardBase = `rounded-3xl shadow-md border backdrop-blur-xl ${
    theme === "dark" ? "bg-white/5 border-white/10" : "bg-white/60 border-white/40"
  }`;

  const socialBtnClass = `rounded-xl ${
    theme === "dark" ? "border-white/10 hover:bg-white/10" : "border-gray-300 hover:bg-white/80"
  }`;

  const renderProjectCard = (p: ProfileProjectCard, index: number | null) => {
    const hidden = isEditMode && index !== null && draftHiddenProjects.has(p.project_name);
    return (
      <Card
        key={p.project_name}
        className={`rounded-2xl border backdrop-blur-xl p-6 shadow-md transition-all ${
          theme === "dark"
            ? `bg-white/5 border-white/10 ${hidden ? "opacity-45" : "hover:bg-white/10"}`
            : `bg-white/40 border-white/30 ${hidden ? "opacity-45" : "hover:bg-white/60"}`
        }`}
      >
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {isEditMode && index !== null ? (
                <div className="flex flex-col gap-0.5">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => moveProject(index, -1)}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => moveProject(index, 1)}
                    disabled={index === draftOrder.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              ) : null}
              {!isPublicView && !isEditMode ? (
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/projects/${encodeURIComponent(p.project_name)}`)
                  }
                  className={`text-lg font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60 rounded ${
                    theme === "dark"
                      ? "text-white hover:text-purple-300"
                      : "text-gray-900 hover:text-[#5B6FD8]"
                  }`}
                  aria-label={`Open project ${projectTitle(p)}`}
                >
                  {projectTitle(p)}
                </button>
              ) : (
                <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {projectTitle(p)}
                </h3>
              )}
            </div>
            {p.display_name?.trim() && p.display_name.trim() !== p.project_name && (
              <p className={`mb-2 font-mono text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                {p.project_name}
              </p>
            )}
            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {p.description?.trim() || "No project description."}
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <span className={`flex items-center gap-1.5 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                <Clock className="h-4 w-4 shrink-0" />
                Last active {formatLastActiveCompact(p.last_active)}
              </span>
              <span className={`flex items-center gap-1.5 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                <Zap className="h-4 w-4 shrink-0" />
                {formatHours(p.app_time_hours)} in apps
              </span>
              <span className={`flex items-center gap-1.5 ${theme === "dark" ? "text-purple-300" : "text-[#5B6FD8]"}`}>
                <Flame className="h-4 w-4 shrink-0" />
                {insightLabel(p.insight)}
              </span>
            </div>
          </div>
          {isEditMode ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 w-8 shrink-0 p-0"
              onClick={() => {
                setDraftHiddenProjects((prev) => {
                  const next = new Set(prev);
                  if (next.has(p.project_name)) next.delete(p.project_name);
                  else next.add(p.project_name);
                  return next;
                });
              }}
            >
              {draftHiddenProjects.has(p.project_name) ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          ) : null}
        </div>

        {p.languages.length > 0 ? (
          <div className="mb-4">
            <p className={`mb-2 text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Language distribution
            </p>
            <div
              className={`mb-2 flex h-2.5 w-full overflow-hidden rounded-full ${
                theme === "dark" ? "bg-white/10" : "bg-gray-200/80"
              }`}
              role="img"
              aria-label="Language share of lines of code"
            >
              {normalizedLanguagePercents(p.languages).map((lang) => {
                const pct = lang.percent;
                if (pct <= 0) return null;
                const color = languageBarColor(lang.name);
                return (
                  <div
                    key={lang.name}
                    title={`${lang.name} ${pct.toFixed(1)}%`}
                    className="h-full min-w-px"
                    style={{
                      flex: `0 0 ${pct}%`,
                      maxWidth: `${pct}%`,
                      backgroundColor: color,
                    }}
                  />
                );
              })}
            </div>
            <div className="flex flex-wrap gap-3">
              {p.languages.map((lang) => (
                <div key={lang.name} className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 shrink-0 rounded-full ring-1 ring-black/10 dark:ring-white/20"
                    style={{ backgroundColor: languageBarColor(lang.name) }}
                  />
                  <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    {lang.name} ({lang.percent}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className={`mb-4 text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>No LOC snapshot yet.</p>
        )}

        <div className="mb-4">
          <p className={`mb-2 text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Top apps</p>
          <div className="flex flex-wrap gap-2">
            {p.top_apps.map((app) => (
              <span
                key={app.name}
                className={`rounded-lg border px-2.5 py-1 text-xs ${
                  theme === "dark" ? "border-white/10 bg-white/5 text-gray-300" : "border-gray-200 bg-white/70 text-gray-700"
                }`}
              >
                {app.name} · {formatHours(app.duration_hours)}
              </span>
            ))}
            {p.top_apps.length === 0 ? (
              <span className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>—</span>
            ) : null}
          </div>
        </div>

        <div>
          <p className={`mb-2 text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Top skills</p>
          <div className="flex flex-wrap gap-2">
            {p.top_skills.map((s) => (
              <span
                key={s.name}
                className="rounded-lg bg-gradient-to-r from-[#5B6FD8] to-[#7C4DFF] px-2.5 py-1 text-xs text-white"
              >
                {s.name} · {formatHours(s.duration_hours)}
              </span>
            ))}
            {p.top_skills.length === 0 ? (
              <span className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>—</span>
            ) : null}
          </div>
        </div>
      </Card>
    );
  };

  const globalSkills = pageData?.top_skills ?? [];
  const globalApps = pageData?.top_apps ?? [];
  const globalLangs = pageData?.top_languages ?? [];

  const visibleSkills = isEditMode
    ? globalSkills
    : isPublicView
      ? globalSkills.slice(0, MAX_GLOBAL_VISIBLE)
      : globalSkills.filter((s) => !hiddenSkillsView.has(s.name)).slice(0, MAX_GLOBAL_VISIBLE);
  const visibleApps = isEditMode
    ? globalApps
    : isPublicView
      ? globalApps.slice(0, MAX_GLOBAL_VISIBLE)
      : globalApps.filter((a) => !hiddenAppsView.has(a.name)).slice(0, MAX_GLOBAL_VISIBLE);
  const visibleLangs = isEditMode
    ? globalLangs
    : isPublicView
      ? globalLangs.slice(0, MAX_GLOBAL_VISIBLE)
      : globalLangs.filter((l) => !hiddenLangsView.has(l.name)).slice(0, MAX_GLOBAL_VISIBLE);

  return (
    <div className="min-h-screen pb-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Button
          onClick={onBack}
          variant="ghost"
          className={`group flex items-center gap-2 rounded-xl ${
            theme === "dark"
              ? "text-gray-300 hover:bg-white/10 hover:text-white"
              : "text-gray-600 hover:bg-white/60 hover:text-gray-900"
          }`}
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {backLabel}
        </Button>

        {!loading && user && !isPublicView && (
          <>
            {isEditMode ? (
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="outline"
                  disabled={saving}
                  className={`rounded-xl ${
                    theme === "dark" ? "border-white/10 bg-white/5 text-white hover:bg-white/10" : "border-white/60 bg-white/50"
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
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save changes
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                onClick={openEdit}
                className="rounded-xl bg-gradient-to-r from-[#5B6FD8] to-[#7C4DFF] text-white hover:opacity-95"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit profile
              </Button>
            )}
          </>
        )}
      </div>

      {loading && (
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Loading profile…</p>
      )}
      {error && <p className={theme === "dark" ? "text-red-400" : "text-red-600"}>{error}</p>}

      {!loading && subject && pageData && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-7xl space-y-6"
        >
          <motion.div variants={itemVariants}>
            <Card className={`${cardBase} p-8`}>
              <div className="flex flex-col gap-8 md:flex-row">
                <div className="flex flex-col items-center gap-4 md:items-start">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-transparent shadow-2xl ring-2 ring-[#5B6FD8]/40">
                      <AvatarImage
                        src={
                          isEditMode
                            ? (photoPreviewUrl ?? (!removePhotoPending ? (user!.profilePhoto ?? undefined) : undefined))
                            : (subject.profilePhoto ?? undefined)
                        }
                        alt={subject.name}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] text-3xl text-white">
                        {subject.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isEditMode ? (
                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="sr-only"
                        aria-label="Choose profile photo"
                        onChange={(e) => onPhotoFileChosen(e.target.files)}
                      />
                    ) : null}
                  </div>

                  <div className="flex w-full max-w-[16rem] flex-col gap-2 md:max-w-none">
                    {isEditMode ? (
                      <>
                        <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className={`rounded-xl ${socialBtnClass}`}
                            onClick={() => photoInputRef.current?.click()}
                          >
                            <Camera className="h-4 w-4" />
                            Change photo
                          </Button>
                          {(user!.profilePhoto || photoPreviewUrl) && !removePhotoPending ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className={`rounded-xl ${
                                theme === "dark" ? "text-gray-300 hover:bg-white/10" : "text-gray-700 hover:bg-gray-100"
                              }`}
                              onClick={clearPendingPhoto}
                            >
                              Remove photo
                            </Button>
                          ) : null}
                          {removePhotoPending && user!.profilePhoto ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className={`rounded-xl ${
                                theme === "dark" ? "text-purple-300 hover:bg-white/10" : "text-[#5B6FD8] hover:bg-gray-100"
                              }`}
                              onClick={() => {
                                setRemovePhotoPending(false);
                                setPhotoError(null);
                              }}
                            >
                              Undo remove
                            </Button>
                          ) : null}
                        </div>
                        <p className={`text-center text-[11px] leading-snug md:text-left ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                          JPG, PNG, WebP, or GIF · max 5 MB
                        </p>
                        {photoError ? (
                          <p className={`text-center text-xs md:text-left ${theme === "dark" ? "text-red-400" : "text-red-600"}`}>
                            {photoError}
                          </p>
                        ) : null}
                      </>
                    ) : null}
                  </div>

                  <div className="flex gap-2">
                    {!isEditMode ? (
                      <>
                        {subject.github_url ? (
                          <Button size="sm" variant="outline" className={socialBtnClass} asChild>
                            <a href={subject.github_url} target="_blank" rel="noopener noreferrer">
                              <Github className="h-4 w-4" />
                            </a>
                          </Button>
                        ) : null}
                        {subject.linkedin_url ? (
                          <Button size="sm" variant="outline" className={socialBtnClass} asChild>
                            <a href={subject.linkedin_url} target="_blank" rel="noopener noreferrer">
                              <Linkedin className="h-4 w-4" />
                            </a>
                          </Button>
                        ) : null}
                        {subject.twitter_url ? (
                          <Button size="sm" variant="outline" className={socialBtnClass} asChild>
                            <a href={subject.twitter_url} target="_blank" rel="noopener noreferrer">
                              <Twitter className="h-4 w-4" />
                            </a>
                          </Button>
                        ) : null}
                        {!subject.github_url && !subject.linkedin_url && !subject.twitter_url ? (
                          <span className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                            No social links yet
                          </span>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                </div>

                <div className="min-w-0 flex-1 space-y-4">
                  {isEditMode ? (
                    <>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        maxLength={200}
                        className={`rounded-xl text-2xl font-semibold ${
                          theme === "dark" ? "border-white/20 bg-white/10 text-white" : "border-gray-200 bg-white/80"
                        }`}
                      />
                      <div className={`flex items-center gap-2 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        <Mail className="h-4 w-4 shrink-0" />
                        {user!.email}
                      </div>
                      <div className="grid gap-2 sm:grid-cols-3">
                        <Input
                          placeholder="GitHub URL"
                          value={editGithub}
                          onChange={(e) => setEditGithub(e.target.value)}
                          className={`rounded-xl text-sm ${theme === "dark" ? "border-white/20 bg-white/10 text-white" : ""}`}
                        />
                        <Input
                          placeholder="LinkedIn URL"
                          value={editLinkedin}
                          onChange={(e) => setEditLinkedin(e.target.value)}
                          className={`rounded-xl text-sm ${theme === "dark" ? "border-white/20 bg-white/10 text-white" : ""}`}
                        />
                        <Input
                          placeholder="X / Twitter URL"
                          value={editTwitter}
                          onChange={(e) => setEditTwitter(e.target.value)}
                          className={`rounded-xl text-sm ${theme === "dark" ? "border-white/20 bg-white/10 text-white" : ""}`}
                        />
                      </div>
                      <p className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                        Paste full profile URLs (https://…)
                      </p>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={4}
                        maxLength={2000}
                        placeholder="Short description about you…"
                        className={`w-full max-w-2xl resize-y rounded-xl border p-3 text-sm ${
                          theme === "dark"
                            ? "border-white/20 bg-white/10 text-gray-200 placeholder:text-gray-500"
                            : "border-gray-200 bg-white/80 text-gray-800"
                        }`}
                      />
                    </>
                  ) : (
                    <>
                      <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-3">
                        <h1
                          className={`min-w-0 flex-1 text-4xl font-semibold tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                        >
                          {subject.name}
                        </h1>
                        {isPublicView && viewUserId && onStartChatWithPeer ? (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => onStartChatWithPeer(viewUserId)}
                            className="shrink-0 rounded-xl bg-gradient-to-r from-[#5B6FD8] to-[#7C4DFF] text-white hover:opacity-95"
                          >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Message
                          </Button>
                        ) : null}
                      </div>
                      {subject.email ? (
                        <div className={`flex flex-wrap items-center gap-2 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                          <Mail className="h-4 w-4 shrink-0" />
                          {subject.email}
                        </div>
                      ) : null}
                      <p className={`max-w-2xl leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        {isPublicView
                          ? subject.description?.trim() || "No bio yet."
                          : subject.description?.trim() || "Add a short bio in Edit profile."}
                      </p>
                    </>
                  )}

                  <div className={`flex flex-wrap items-center gap-2 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    <Calendar className="h-4 w-4 shrink-0" />
                    Joined {formatJoinDate(subject.createdAt)}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 md:grid-cols-4">
                    {[
                      { label: "Streak", value: `${pageData.streak_days}d`, sub: "Days with sync" },
                      {
                        label: "Projects",
                        value: `${pageData.total_projects}`,
                        sub: isPublicView ? "Shown on profile" : "On your account",
                      },
                      {
                        label: "App hours",
                        value: formatHours(pageData.total_app_time_hours),
                        sub: "All projects",
                      },
                      {
                        label: "Flow focus",
                        value:
                          pageData.global_flow_focus_percent != null
                            ? `${pageData.global_flow_focus_percent}%`
                            : "—",
                        sub: "Context mix",
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className={`rounded-2xl p-4 text-center shadow-md ${
                          theme === "dark" ? "bg-white/5" : "bg-white/60"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          {s.label === "Streak" ? <Flame className="h-5 w-5 text-orange-400" /> : null}
                          <span className={`text-2xl font-semibold tabular-nums ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                            {s.value}
                          </span>
                        </div>
                        <div className={`text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{s.label}</div>
                        <div className={`mt-0.5 text-[10px] ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>{s.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-1">
              <motion.div variants={itemVariants}>
                <Card className={`${cardBase} p-6`}>
                  <div className="mb-6 flex items-center gap-2">
                    <div className="rounded-xl bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] p-2">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <h2 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Top skills</h2>
                  </div>
                  <p className={`mb-4 text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                    {isPublicView
                      ? `All projects · up to ${MAX_GLOBAL_VISIBLE} shown`
                      : `All projects · up to ${MAX_GLOBAL_VISIBLE} shown (hide in edit)`}
                  </p>
                  <div className="space-y-4">
                    {visibleSkills.map((skill) => {
                      const dim =
                        isEditMode &&
                        (draftHiddenSkills.has(skill.name) ? true : false);
                      return (
                        <div key={skill.name} className={dim ? "opacity-40" : ""}>
                          <div className="mb-2 flex items-center justify-between gap-2">
                            <span className={`text-sm ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{skill.name}</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm ${theme === "dark" ? "text-purple-300" : "text-[#5B6FD8]"}`}>
                                {skill.percent}%
                              </span>
                              {isEditMode ? (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={() => {
                                    setDraftHiddenSkills((prev) => {
                                      const n = new Set(prev);
                                      if (n.has(skill.name)) n.delete(skill.name);
                                      else n.add(skill.name);
                                      return n;
                                    });
                                  }}
                                >
                                  {draftHiddenSkills.has(skill.name) ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              ) : null}
                            </div>
                          </div>
                          {!dim || !isEditMode ? (
                            <Progress
                              value={skill.percent}
                              className={`h-2 ${theme === "dark" ? "bg-white/10" : "bg-gray-200"}`}
                            />
                          ) : null}
                        </div>
                      );
                    })}
                    {visibleSkills.length === 0 ? (
                      <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>No skills tracked yet.</p>
                    ) : null}
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className={`${cardBase} p-6`}>
                  <div className="mb-6 flex items-center gap-2">
                    <div className="rounded-xl bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] p-2">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <h2 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Top apps</h2>
                  </div>
                  <div className="space-y-3">
                    {visibleApps.map((app) => {
                      const dim = isEditMode && draftHiddenApps.has(app.name);
                      return (
                        <div
                          key={app.name}
                          className={`rounded-2xl border p-3 ${
                            theme === "dark" ? "border-white/10 bg-white/5" : "border-gray-100 bg-white/60"
                          } ${dim ? "opacity-40" : ""}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <div className={`text-sm ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{app.name}</div>
                              <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                {formatHours(app.duration_hours)}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm ${theme === "dark" ? "text-purple-300" : "text-[#5B6FD8]"}`}>
                                {app.percent}%
                              </span>
                              {isEditMode ? (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={() => {
                                    setDraftHiddenApps((prev) => {
                                      const n = new Set(prev);
                                      if (n.has(app.name)) n.delete(app.name);
                                      else n.add(app.name);
                                      return n;
                                    });
                                  }}
                                >
                                  {draftHiddenApps.has(app.name) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              ) : null}
                            </div>
                          </div>
                          {!dim || !isEditMode ? (
                            <Progress
                              value={app.percent}
                              className={`mt-2 h-1.5 ${theme === "dark" ? "bg-white/10" : "bg-gray-200"}`}
                            />
                          ) : null}
                        </div>
                      );
                    })}
                    {visibleApps.length === 0 ? (
                      <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>No app time yet.</p>
                    ) : null}
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className={`${cardBase} p-6`}>
                  <div className="mb-6 flex items-center gap-2">
                    <div className="rounded-xl bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] p-2">
                      <Code2 className="h-5 w-5 text-white" />
                    </div>
                    <h2 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Languages</h2>
                  </div>
                  <div className="space-y-3">
                    {visibleLangs.map((lang) => {
                      const dim = isEditMode && draftHiddenLangs.has(lang.name);
                      return (
                        <div
                          key={lang.name}
                          className={`rounded-xl border p-3 ${
                            theme === "dark" ? "border-white/10 bg-white/5" : "border-gray-100 bg-white/60"
                          } ${dim ? "opacity-40" : ""}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-sm ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{lang.name}</span>
                            <div className="flex items-center gap-2">
                              <div className="text-right text-sm">
                                <div className={theme === "dark" ? "text-purple-300" : "text-[#5B6FD8]"}>{lang.percent}%</div>
                                <div className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                                  {lang.lines.toLocaleString()} lines
                                </div>
                              </div>
                              {isEditMode ? (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={() => {
                                    setDraftHiddenLangs((prev) => {
                                      const n = new Set(prev);
                                      if (n.has(lang.name)) n.delete(lang.name);
                                      else n.add(lang.name);
                                      return n;
                                    });
                                  }}
                                >
                                  {draftHiddenLangs.has(lang.name) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              ) : null}
                            </div>
                          </div>
                          {!dim || !isEditMode ? (
                            <Progress
                              value={lang.percent}
                              className={`mt-2 h-1.5 ${theme === "dark" ? "bg-white/10" : "bg-gray-200"}`}
                            />
                          ) : null}
                        </div>
                      );
                    })}
                    {visibleLangs.length === 0 ? (
                      <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>No lines of code yet.</p>
                    ) : null}
                  </div>
                </Card>
              </motion.div>
            </div>

            <div className="space-y-6 lg:col-span-2">
              <motion.div variants={itemVariants}>
                <Card className={`${cardBase} p-6`}>
                  <div className="mb-6 flex items-center gap-2">
                    <div className="rounded-xl bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] p-2">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <h2 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Projects</h2>
                  </div>
                  <p className={`mb-4 text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                    {isPublicView
                      ? "What they choose to show from synced agent data."
                      : "Reorder or hide cards in edit mode. Metrics use your synced agent data."}
                  </p>
                  <div className="space-y-6">
                    {isEditMode
                      ? draftOrder.map((pn, index) => {
                          const card = projectByName.get(pn);
                          if (!card) return null;
                          return renderProjectCard(card, index);
                        })
                      : isPublicView
                        ? pageData.projects.map((card) => renderProjectCard(card, null))
                        : viewProjectOrder
                            .filter((pn) => projectByName.has(pn) && !hiddenProjectsView.has(pn))
                            .map((pn) => {
                              const card = projectByName.get(pn);
                              if (!card) return null;
                              return renderProjectCard(card, null);
                            })}
                    {!isEditMode && isPublicView && pageData.projects.length === 0 ? (
                      <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>
                        Nothing to show here yet.
                      </p>
                    ) : null}
                    {!isEditMode &&
                    !isPublicView &&
                    viewProjectOrder.filter((pn) => projectByName.has(pn) && !hiddenProjectsView.has(pn)).length === 0 ? (
                      <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>
                        No projects to show (add from the agent or unhide in edit).
                      </p>
                    ) : null}
                    {isEditMode && draftOrder.some((pn) => draftHiddenProjects.has(pn)) ? (
                      <p className={`text-center text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                        {draftOrder.filter((pn) => draftHiddenProjects.has(pn)).length} hidden on profile
                      </p>
                    ) : null}
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
