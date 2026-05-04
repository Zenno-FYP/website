import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Code,
  Clock,
  GitBranch,
  FileCode,
  Layers,
  Award,
} from "lucide-react";
import { AxiosError } from "axios";
import { fetchSkillsProjectsDetail, SkillsProjectsDetailResponse } from "@/services/api";
import { handleApiError } from "@/services/errorHandler";
import { useFirebaseUser } from "@/stores/useAuthHooks";
import { getRelativeTime } from "@/utils/timeFormatter";

interface SkillsProjectsDetailPageProps {
  theme: "light" | "dark";
  onBack: () => void;
  onProjectClick: (project: { name: string }) => void;
}

const PREVIEW_LIMIT = 5;

const PALETTE = [
  "from-[#5B6FD8] to-[#7C4DFF]",
  "from-[#4ECDC4] to-[#44A6A0]",
  "from-[#FFD93D] to-[#FFC93D]",
  "from-[#FF6B9D] to-[#FF8FA3]",
  "from-[#9B59B6] to-[#8E44AD]",
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function projectGradient(name: string): string {
  return PALETTE[hashString(name) % PALETTE.length];
}

function projectDisplayTitle(project: { name: string; display_name: string | null }): string {
  const d = project.display_name?.trim();
  return d && d.length > 0 ? d : project.name;
}

function lastActiveRelative(iso: string | null): string {
  if (!iso) return "No activity yet";
  const rel = getRelativeTime(iso);
  return rel === "unknown" ? "Unknown" : rel;
}

function formatLines(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return `${n}`;
}

export function SkillsProjectsDetailPage({ theme, onBack, onProjectClick }: SkillsProjectsDetailPageProps) {
  const firebaseUser = useFirebaseUser();
  const [data, setData] = useState<SkillsProjectsDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skillsExpanded, setSkillsExpanded] = useState(false);
  const [projectsExpanded, setProjectsExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchSkillsProjectsDetail()
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message =
            err instanceof AxiosError ? handleApiError(err) : "Could not load skills & projects. Try again later.";
          setError(message);
          console.error("fetchSkillsProjectsDetail:", err);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [firebaseUser?.uid]);

  const gridBorder =
    theme === "dark" ? "border-white/10 bg-gray-800/50" : "border-white/60 bg-white/50";

  const skills = data?.skills ?? [];
  const projects = data?.projects ?? [];
  const summary = data?.summary;

  const visibleSkills = skillsExpanded ? skills : skills.slice(0, PREVIEW_LIMIT);
  const visibleProjects = projectsExpanded ? projects : projects.slice(0, PREVIEW_LIMIT);
  const moreSkills = skills.length > PREVIEW_LIMIT;
  const moreProjects = projects.length > PREVIEW_LIMIT;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={onBack}
            variant="outline"
            size="icon"
            className={`rounded-xl backdrop-blur-xl transition-all ${
              theme === "dark"
                ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                : "border-white/60 bg-white/50 text-gray-900 hover:bg-white/70"
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className={`text-3xl ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Skills & Projects Overview
            </h1>
            <p className={`mt-1 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              App active time per project from activity sync; skills and code from project snapshots
            </p>
          </div>
        </div>
      </div>

      {loading && (
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Loading…</p>
      )}
      {error && (
        <p className={theme === "dark" ? "text-red-400" : "text-red-600"}>{error}</p>
      )}

      {!loading && !error && data && (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card className={`rounded-2xl border p-4 shadow-lg backdrop-blur-2xl ${gridBorder}`}>
              <div className="flex flex-col gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF]">
                  <Layers className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Projects</p>
                  <p className={`text-xl tabular-nums ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {summary?.total_projects ?? 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card className={`rounded-2xl border p-4 shadow-lg backdrop-blur-2xl ${gridBorder}`}>
              <div className="flex flex-col gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#4ECDC4] to-[#44A6A0]">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Active time</p>
                  <p className={`text-xl tabular-nums ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {(summary?.total_app_time_hours ?? 0) < 1
                      ? `${Math.round((summary?.total_app_time_hours ?? 0) * 60)} min`
                      : `${(summary?.total_app_time_hours ?? 0).toFixed(1)}h`}
                  </p>
                </div>
              </div>
            </Card>

            <Card className={`rounded-2xl border p-4 shadow-lg backdrop-blur-2xl ${gridBorder}`}>
              <div className="flex flex-col gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFD93D] to-[#FFC93D]">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Skills tracked</p>
                  <p className={`text-xl tabular-nums ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {summary?.unique_skills_count ?? 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card className={`rounded-2xl border p-4 shadow-lg backdrop-blur-2xl ${gridBorder}`}>
              <div className="flex flex-col gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B9D] to-[#FF8FA3]">
                  <FileCode className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Lines of code</p>
                  <p className={`text-xl ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {formatLines(summary?.total_lines_of_code ?? 0)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className={`text-2xl ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Skills by time</h2>
            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              From project skill tracking (all projects combined). Active time per project is shown below.
            </p>

            {skills.length === 0 ? (
              <Card className={`rounded-2xl border p-8 text-center ${gridBorder}`}>
                <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                  No skill time recorded yet. Sync the desktop agent with your projects.
                </p>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {visibleSkills.map((skill) => (
                    <Card
                      key={skill.name}
                      className={`rounded-2xl border p-4 shadow-lg backdrop-blur-2xl transition-all hover:shadow-md ${gridBorder}`}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Code className={`h-5 w-5 ${theme === "dark" ? "text-purple-400" : "text-[#5B6FD8]"}`} />
                          <h4 className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                            {skill.name}
                          </h4>
                        </div>
                        <span className={`text-sm font-semibold tabular-nums ${theme === "dark" ? "text-purple-300" : "text-[#5B6FD8]"}`}>
                          {skill.percent_of_total.toFixed(1)}%
                        </span>
                      </div>
                      <div className={`mb-2 h-2 overflow-hidden rounded-full ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-200"}`}>
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#5B6FD8] to-[#7C4DFF] transition-all"
                          style={{ width: `${Math.min(100, skill.percent_of_total)}%` }}
                        />
                      </div>
                      <p className={`text-xs tabular-nums ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        {skill.duration_hours < 1
                          ? `${Math.round(skill.duration_hours * 60)} min total`
                          : `${skill.duration_hours.toFixed(1)}h total`}
                      </p>
                    </Card>
                  ))}
                </div>
                {moreSkills && (
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setSkillsExpanded((e) => !e)}
                      className={`gap-1.5 rounded-xl ${
                        theme === "dark"
                          ? "text-gray-300 hover:bg-white/10 hover:text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {skillsExpanded ? (
                        <>
                          Show less
                          <ChevronUp className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          View more ({skills.length - PREVIEW_LIMIT} more)
                          <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="space-y-4">
            <h2 className={`text-2xl ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Projects</h2>
            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Name and description; open a project to edit. Sorted by most recently active.
            </p>

            {projects.length === 0 ? (
              <Card className={`rounded-2xl border p-8 text-center ${gridBorder}`}>
                <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                  No projects synced yet.
                </p>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {visibleProjects.map((project) => {
                    const title = projectDisplayTitle(project);
                    const desc = project.description?.trim();
                    return (
                      <Card
                        key={project.name}
                        role="button"
                        tabIndex={0}
                        onClick={() => onProjectClick({ name: project.name })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onProjectClick({ name: project.name });
                          }
                        }}
                        className={`group cursor-pointer overflow-hidden rounded-2xl border shadow-lg backdrop-blur-2xl transition-all hover:shadow-xl ${
                          theme === "dark"
                            ? "border-white/10 bg-gray-800/40 hover:border-white/15"
                            : "border-white/60 bg-white/40 hover:border-gray-300/80"
                        }`}
                      >
                        <div className="flex items-stretch gap-0">
                          <div
                            className={`w-1.5 shrink-0 bg-gradient-to-b ${projectGradient(project.name)}`}
                            aria-hidden
                          />
                          <div className="flex min-w-0 flex-1 items-center gap-3 p-4 pr-3">
                            <div
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-md ${projectGradient(project.name)}`}
                            >
                              <GitBranch className="h-5 w-5 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3
                                className={`truncate font-semibold tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                                title={title}
                              >
                                {title}
                              </h3>
                              {project.display_name?.trim() && project.display_name.trim() !== project.name && (
                                <p
                                  className={`truncate text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}
                                  title={project.name}
                                >
                                  {project.name}
                                </p>
                              )}
                              <p
                                className={`mt-1 line-clamp-2 text-sm leading-snug ${
                                  desc
                                    ? theme === "dark"
                                      ? "text-gray-400"
                                      : "text-gray-600"
                                    : theme === "dark"
                                      ? "text-gray-600 italic"
                                      : "text-gray-400 italic"
                                }`}
                              >
                                {desc || "No description yet — add one on the project page."}
                              </p>
                              <p
                                className={`mt-2 text-xs tabular-nums ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}
                              >
                                <span className="font-medium">Last active</span>
                                {" · "}
                                {lastActiveRelative(project.last_active)}
                              </p>
                            </div>
                            <ChevronRight
                              className={`h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                                theme === "dark" ? "text-gray-500" : "text-gray-400"
                              }`}
                              aria-hidden
                            />
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
                {moreProjects && (
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setProjectsExpanded((e) => !e)}
                      className={`gap-1.5 rounded-xl ${
                        theme === "dark"
                          ? "text-gray-300 hover:bg-white/10 hover:text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {projectsExpanded ? (
                        <>
                          Show less
                          <ChevronUp className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          View more ({projects.length - PREVIEW_LIMIT} more)
                          <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
