import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { EcoInput } from "@/components/ui/EcoInput";
import { GoogleButton } from "@/components/ui/GoogleButton";
import { useAuth } from "@/context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [showPwd, setShowPwd] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    signup(name, email);
    navigate("/verify", { state: { email } });
  };

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <h2 className="text-headline-md text-on-surface">Create your account</h2>
        <p className="text-body-md text-on-surface-variant mt-2">Join the regenerative living movement.</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <EcoInput label="Full Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Amara Okafor" />
        <EcoInput label="Email Address" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <EcoInput
          label="Password"
          type={showPwd ? "text" : "password"}
          required
          placeholder="••••••••"
          trailing={
            <button type="button" onClick={() => setShowPwd((v) => !v)} className="hover:text-on-surface">
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />
        <EcoInput label="Location (optional)" placeholder="e.g. Lagos, Nigeria" />
        <button type="submit" className="w-full h-[52px] bg-primary text-white rounded-lg text-label-md hover:opacity-90 transition-opacity mt-2">
          Create Account
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
