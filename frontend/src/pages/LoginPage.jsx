import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard.jsx";
import { useAuth } from "../providers/AuthProvider.jsx";
import { useToast } from "../providers/ToastProvider.jsx";
import { loginUser, registerUser } from "../services/api.js";

const roleRoutes = {
  admin: "/admin",
  officer: "/officer",
  farmer: "/farmer"
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { push } = useToast();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("farmer");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response =
        mode === "login"
          ? await loginUser({ email, password })
          : await registerUser({ name, email, password, role });
      if (!response?.data?.user || !response?.data?.tokens) {
        throw new Error("Invalid login response");
      }
      const { user, tokens } = response.data;
      login(user, tokens);
      push("Login successful.", "success");
      navigate(roleRoutes[user.role] || "/login");
    } catch (error) {
      push("Login failed. Check credentials.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-ink-900 dark:via-ink-800 dark:to-ink-700 flex items-center justify-center px-6">
      <GlassCard className="w-full max-w-xl space-y-6 animated-fade">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Ministry of Rural Development
          </p>
          <h1 className="mt-2 text-2xl font-semibold">
            Land Compensation Decision Support
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Secure sign-in for authorized officers, administrators, and farmers.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "register" && (
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm shadow-sm outline-none focus:border-slateblue-500 dark:border-slate-700 dark:bg-ink-800"
                placeholder="Ravi Kumar"
              />
            </div>
          )}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm shadow-sm outline-none focus:border-slateblue-500 dark:border-slate-700 dark:bg-ink-800"
              placeholder="user@domain.gov.in"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm shadow-sm outline-none focus:border-slateblue-500 dark:border-slate-700 dark:bg-ink-800"
              placeholder="••••••••"
            />
          </div>
          {mode === "register" && (
            <div>
              <label className="text-sm font-medium">Role</label>
              <div className="mt-2 flex gap-3">
                {["farmer", "officer"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRole(item)}
                    className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition ${
                      role === item
                        ? "bg-slateblue-500 text-white"
                        : "bg-slate-100 text-slate-600 dark:bg-ink-700 dark:text-slate-200"
                    }`}
                  >
                    {item.toUpperCase()}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Admin accounts are created by the system only.
              </p>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-mint-500 px-4 py-3 text-sm font-semibold text-white shadow-glass transition hover:-translate-y-0.5 disabled:opacity-70"
          >
            {loading
              ? mode === "login"
                ? "Signing In..."
                : "Creating Account..."
              : mode === "login"
              ? "Sign In"
              : "Create Account"}
          </button>
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-ink-700"
          >
            {mode === "login"
              ? "New user? Register"
              : "Already have an account? Sign in"}
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
