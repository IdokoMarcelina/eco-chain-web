/**
 * hooks/useAuth.ts
 * -----------------
 * Custom React hook that wraps every authentication API call.
 * Each action (signup, login, verifyOtp, resendOtp) exposes:
 *   • isLoading  – true while the network request is in-flight
 *   • error      – string message if the request failed, otherwise null
 *   • success    – true when the last request succeeded
 *
 * The hook also reads/writes to AuthContext so the rest of the app
 * (e.g. Dashboard) can access the logged-in user.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  apiSignup,
  apiLogin,
  apiVerifyOtp,
  apiResendOtp,
  saveToken,
  saveRefreshToken,
  SignupPayload,
} from "@/services/api";
import { useAuth } from "@/context/AuthContext";

// ── Signup ────────────────────────────────────────────────────────────────────

/**
 * useSignup
 * Handles the user registration flow.
 *
 * Usage:
 *   const { handleSignup, isLoading, error } = useSignup();
 *   await handleSignup({ name, email, password, location });
 */
export function useSignup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (payload: SignupPayload) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await apiSignup(payload);

      setSuccess(true);

      // Store email in navigation state so Verify page can read it
      navigate("/verify", { state: { email: payload.email } });
    } catch (err: any) {
      setError(err.message ?? "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignup, isLoading, error, success };
}

// ── Verify OTP ────────────────────────────────────────────────────────────────

/**
 * useVerifyOtp
 * Handles OTP verification.
 *
 * Usage:
 *   const { handleVerify, isLoading, error, success } = useVerifyOtp();
 *   await handleVerify(email, otp);
 */
export function useVerifyOtp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleVerify = async (email: string, otp: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await apiVerifyOtp({ email, otp });

      setSuccess(true);

      // Redirect to login after successful verification
      navigate("/login");
    } catch (err: any) {
      setError(err.message ?? "OTP verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleVerify, isLoading, error, success };
}

// ── Resend OTP ────────────────────────────────────────────────────────────────

/**
 * useResendOtp
 * Triggers the resend-OTP endpoint and surfaces feedback.
 *
 * Usage:
 *   const { handleResend, isLoading, error, success } = useResendOtp();
 *   await handleResend(email);
 */
export function useResendOtp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResend = async (email: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await apiResendOtp({ email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message ?? "Could not resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleResend, isLoading, error, success };
}

// ── Login ─────────────────────────────────────────────────────────────────────

/**
 * useLogin
 * Handles user login, stores the returned token, updates AuthContext,
 * then redirects to /dashboard.
 *
 * Usage:
 *   const { handleLogin, isLoading, error } = useLogin();
 *   await handleLogin(email, password);
 */
export function useLogin() {
  const navigate = useNavigate();
  const { login } = useAuth(); // login() updates the in-memory user in AuthContext
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const data = await apiLogin({ email, password });

      // Save both tokens from the real backend response shape:
      // { access: "...", refresh: "...", user: { id, name, email, ... } }
      saveToken(data.access);
      saveRefreshToken(data.refresh);

      // Update AuthContext with the real user name from the backend
      login(data.user.name, data.user.email);

      setSuccess(true);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Login failed. Check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading, error, success };
}
