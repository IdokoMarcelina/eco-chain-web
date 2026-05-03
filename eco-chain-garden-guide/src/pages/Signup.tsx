import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { EcoInput } from "@/components/ui/EcoInput";
import { GoogleButton } from "@/components/ui/GoogleButton";
import { useSignup } from "@/hooks/useAuth";

const Signup = () => {
  // ── Hook ───────────────────────────────────────────────────────────────────
  // handleSignup sends the POST, then navigates to /verify on success.
  const { handleSignup, isLoading, error } = useSignup();

  // ── Local form state ───────────────────────────────────────────────────────
  const [showPwd, setShowPwd] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Delegate to the hook — it handles the API call + navigation
    handleSignup({ name, email, password, location });
  };

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <h2 className="text-headline-md text-on-surface">Create your account</h2>
        <p className="text-body-md text-on-surface-variant mt-2">Join the regenerative living movement.</p>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <EcoInput
          label="Full Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Amara Okafor"
        />
        <EcoInput
          label="Email Address"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
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
        <EcoInput
          label="Location (optional)"
          placeholder="e.g. Lagos, Nigeria"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {/* Submit — shows spinner text while loading */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-[52px] bg-primary text-white rounded-lg text-label-md hover:opacity-90 transition-opacity mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-outline-variant" />
        <span className="text-caption text-on-surface-variant uppercase">or</span>
        <div className="flex-1 h-px bg-outline-variant" />
      </div>

      <GoogleButton label="Continue with Google" />

      <p className="text-center text-body-md text-on-surface-variant mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link>
      </p>
    </AuthLayout>
  );
};

export default Signup;

