import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { fetchAdminStats } from "@/services/adminApi";

export function AdminLoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    void fetchAdminStats()
      .then(() => {
        if (!cancelled) navigate("/admin", { replace: true });
      })
      .catch(() => {
        if (!cancelled) navigate("/auth", { replace: true });
      });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#121218]/90 p-8 shadow-2xl backdrop-blur-xl text-center">
        <h1 className="mb-3 text-xl font-semibold text-white">Zenno Admin</h1>
        <p className="mb-6 text-sm text-gray-400">
          Admin now uses your regular Firebase account with the `isAdmin` flag.
        </p>
        <Button asChild className="w-full rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#5B6FD8] text-white shadow-lg">
          <Link to="/auth">Go to sign in</Link>
        </Button>
      </div>
    </div>
  );
}
