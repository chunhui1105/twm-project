import { useState, useEffect, type ReactNode } from "react";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";

const STORAGE_KEY = "twm-admin-token";

export function AdminGuard({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<"checking" | "locked" | "unlocked">("checking");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      setAuthTokenGetter(() => saved);
      setStatus("unlocked");
    } else {
      setStatus("locked");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError("");
    try {
      const base = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
      const res = await fetch(`${base}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Incorrect password. Please try again.");
        setPassword("");
        setLoading(false);
        return;
      }
      const { token } = await res.json();
      sessionStorage.setItem(STORAGE_KEY, token);
      setAuthTokenGetter(() => token);
      setStatus("unlocked");
    } catch {
      setError("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "locked") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm">
          {/* Logo / title */}
          <div className="text-center mb-8">
            <img src="/twm-logo.png" alt="TWM" className="h-12 mx-auto mb-4 object-contain" />
            <h1 className="text-2xl font-bold tracking-tighter uppercase">Admin Access</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter your password to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                autoFocus
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                placeholder="Admin password"
                className="w-full bg-card border border-border pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-primary font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-sm text-destructive font-mono">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="w-full bg-primary text-primary-foreground py-3 font-bold uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              {loading ? "Verifying…" : "Unlock Admin"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function adminLogout() {
  sessionStorage.removeItem(STORAGE_KEY);
  setAuthTokenGetter(null);
  window.location.href = "/admin";
}
