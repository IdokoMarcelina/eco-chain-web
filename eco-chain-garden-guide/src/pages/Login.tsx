import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { EcoInput } from "@/components/ui/EcoInput";
import { GoogleButton } from "@/components/ui/GoogleButton";
import { useLogin } from "@/hooks/useAuth";

const Login = () => {
  // ── Hook ───────────────────────────────────────────────────────────────────
  // handleLogin sends credentials, saves token, updates context, navigates.
  const { handleLogin, isLoading, error } = useLogin();

  // ── Local form state ───────────────────────────────────────────────────────
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <h2 className="text-headline-md text-on-surface">Welcome back</h2>
        <p className="text-body-md text-on-surface-variant mt-2">Sign in to your account</p>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <EcoInput
          label="Email Address"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <div>
          <EcoInput
            label="Password"
            type={showPwd ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            trailing={
              <button type="button" onClick={() => setShowPwd((v) => !v)} className="hover:text-on-surface">
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />
          <div className="text-right mt-1.5">
            <a href="#" className="text-label-md text-primary hover:underline">Forgot password?</a>
          </div>
        </div>

        {/* Submit — disabled + label change while loading */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-[52px] bg-primary text-white rounded-lg text-label-md hover:opacity-90 transition-opacity mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-outline-variant" />
        <span className="text-caption text-on-surface-variant uppercase">or</span>
        <div className="flex-1 h-px bg-outline-variant" />
      </div>

      <GoogleButton label="Continue with Google" />

      <p className="text-center text-body-md text-on-surface-variant mt-6">
        Don't have an account?{" "}
        <Link to="/signup" className="text-primary font-semibold hover:underline">Sign up</Link>
      </p>
    </AuthLayout>
  );
};

export default Login;

