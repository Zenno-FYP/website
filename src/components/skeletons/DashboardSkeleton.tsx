import { Skeleton } from "../ui/skeleton";

interface SkeletonProps {
  theme: "light" | "dark";
}

const cardBase = (theme: "light" | "dark") =>
  `p-6 rounded-3xl shadow-lg backdrop-blur-2xl border ${
    theme === "dark"
      ? "border-white/10 bg-gray-800/40"
      : "border-white/60 bg-white/50"
  }`;

/**
 * Skeleton placeholder shown on the first load of the Dashboard page,
 * mirroring the rough shape of the populated layout so the page does
 * not pop or shift when data arrives.
 */
export function DashboardSkeleton({ theme }: SkeletonProps) {
  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      role="status"
      aria-busy="true"
      aria-label="Loading dashboard"
    >
      {/* Left section */}
      <div className="lg:col-span-8 space-y-6">
        {/* Welcome banner */}
        <div className={cardBase(theme)}>
          <Skeleton className="h-7 w-2/3 mb-3" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        {/* Performance metric tiles */}
        <div>
          <Skeleton className="h-5 w-44 mb-3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={cardBase(theme)}>
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="w-14 h-14 rounded-2xl" />
                  <Skeleton className="h-4 w-12 ml-auto" />
                </div>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        </div>

        {/* Developer trends chart */}
        <div className={cardBase(theme)}>
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>
          <Skeleton className="h-56 w-full rounded-2xl" />
        </div>

        {/* Apps + languages row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className={cardBase(theme)}>
              <Skeleton className="h-5 w-32 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Skeleton className="w-9 h-9 rounded-xl" />
                    <Skeleton className="h-3 flex-1" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right sidebar */}
      <div className="lg:col-span-4 space-y-6">
        <div className={cardBase(theme)}>
          <Skeleton className="h-5 w-32 mb-4" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
        <div className={cardBase(theme)}>
          <Skeleton className="h-5 w-40 mb-4" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-20 rounded-full" />
            ))}
          </div>
        </div>
        <div className={cardBase(theme)}>
          <Skeleton className="h-5 w-36 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton placeholder shown on the first load of the Notifications
 * page (and the header dropdown). Renders rows that match the real
 * notification card layout to avoid layout shift.
 */
export function NotificationListSkeleton({
  theme,
  count = 5,
}: SkeletonProps & { count?: number }) {
  return (
    <div
      className="space-y-3"
      role="status"
      aria-busy="true"
      aria-label="Loading notifications"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`flex gap-4 p-4 rounded-xl border ${
            theme === "dark"
              ? "bg-white/[0.02] border-white/5"
              : "bg-white/40 border-gray-200/50"
          }`}
        >
          <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-16 mt-1" />
          </div>
        </div>
      ))}
    </div>
  );
}
