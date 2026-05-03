import { useEffect, useRef, useState, KeyboardEvent, ClipboardEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useVerifyOtp, useResendOtp } from "@/hooks/useAuth";

const Verify = () => {
  const { state } = useLocation() as { state?: { email?: string } };
  const email = state?.email || "your@email.com";

  // ── OTP digit state ────────────────────────────────────────────────────────
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [countdown, setCountdown] = useState(60);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  // ── Hooks ──────────────────────────────────────────────────────────────────
  // handleVerify sends email + joined OTP to the backend
  const { handleVerify, isLoading: isVerifying, error: verifyError } = useVerifyOtp();
  // handleResend triggers the resend-OTP endpoint
  const { handleResend, isLoading: isResending, error: resendError, success: resendSuccess } = useResendOtp();

  // ── Countdown timer ────────────────────────────────────────────────────────
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // ── Digit helpers ──────────────────────────────────────────────────────────
  const setDigit = (i: number, val: string) => {
    const v = val.replace(/\D/g, "").slice(-1);
    setDigits((arr) => {
      const next = [...arr];
      next[i] = v;
      return next;
    });
    if (v && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const arr = text.split("");
    setDigits((prev) => prev.map((d, i) => arr[i] ?? d));
    refs.current[Math.min(text.length, 5)]?.focus();
  };

  // ── Verify handler ─────────────────────────────────────────────────────────
  const verify = () => {
    const otp = digits.join("");
    if (otp.length < 6) return; // don't fire if OTP is incomplete
    // The hook navigates to /login on success
    handleVerify(email, otp);
  };

  // ── Resend handler ─────────────────────────────────────────────────────────
  const resend = async () => {
    await handleResend(email);
    // Only reset the countdown if the API call succeeded
    setCountdown(60);
  };

  const mm = Math.floor(countdown / 60);
  const ss = String(countdown % 60).padStart(2, "0");

  return (
    <AuthLayout>
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4">
          <Mail size={22} className="text-white" />
        </div>
        <h2 className="text-headline-md text-on-surface">Check your inbox</h2>
        <p className="text-body-md text-on-surface-variant mt-2 text-center">
          We sent a 6-digit code to <span className="text-on-surface font-semibold">{email}</span>. Enter it below.
        </p>
      </div>

      {/* ── Error / success banners ── */}
      {verifyError && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {verifyError}
        </div>
      )}
      {resendError && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {resendError}
        </div>
      )}
      {resendSuccess && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
          A new code has been sent to {email}.
        </div>
      )}

      {/* ── OTP input boxes ── */}
      <div className="flex justify-between gap-2 mb-6">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => (refs.current[i] = el)}
            value={d}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => handleKey(i, e)}
            onPaste={handlePaste}
            inputMode="numeric"
            maxLength={1}
            className="w-[52px] h-[60px] bg-surface-container border border-outline-variant rounded-lg text-center text-[24px] font-bold text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        ))}
      </div>

      {/* ── Verify button ── */}
      <button
        onClick={verify}
        disabled={isVerifying || digits.join("").length < 6}
        className="w-full h-[52px] bg-primary text-white rounded-lg text-label-md hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isVerifying ? "Verifying…" : "Verify Email"}
      </button>

      {/* ── Resend section ── */}
      <p className="text-center text-body-md text-on-surface-variant mt-5">
        Didn't receive it?{" "}
        {countdown > 0 ? (
          <span className="text-on-surface-variant">Resend in {mm}:{ss}</span>
        ) : (
          <button
            onClick={resend}
            disabled={isResending}
            className="text-primary font-semibold hover:underline disabled:opacity-60"
          >
            {isResending ? "Sending…" : "Resend code"}
          </button>
        )}
      </p>

      <Link to="/signup" className="mt-4 inline-flex items-center gap-1.5 text-label-md text-on-surface-variant hover:text-primary">
        <ArrowLeft size={16} /> Back to Sign Up
      </Link>
    </AuthLayout>
  );
};

export default Verify;

