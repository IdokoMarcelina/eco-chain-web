import { Link } from "react-router-dom";
import {
  Leaf, Droplets, Star, ArrowRight, Sprout, Globe, ShieldCheck,
  TreePine, Sun, Wind,
} from "lucide-react";

// ── Reusable components ───────────────────────────────────────────────────────

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm border border-white/10">
    {children}
  </span>
);

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: any;
  title: string;
  description: string;
  color: string;
}) => (
  <div className="group bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(6,27,14,0.07)] hover:shadow-[0_8px_32px_rgba(6,27,14,0.12)] transition-all hover:-translate-y-0.5 border border-[#f0eee9]">
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
      style={{ background: `${color}18` }}
    >
      <Icon size={22} style={{ color }} />
    </div>
    <h3 className="text-lg font-semibold text-[#1b1c19] mb-2 leading-tight">{title}</h3>
    <p className="text-sm text-[#434843] leading-relaxed">{description}</p>
  </div>
);

const StatPill = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center">
    <div className="text-3xl sm:text-4xl font-bold text-white leading-none">{value}</div>
    <div className="text-xs sm:text-sm text-white/60 mt-1 font-medium">{label}</div>
  </div>
);

const StepCard = ({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) => (
  <div className="flex gap-4">
    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
      <span className="text-white text-sm font-bold">{number}</span>
    </div>
    <div>
      <h3 className="text-base font-semibold text-[#1b1c19] mb-1">{title}</h3>
      <p className="text-sm text-[#434843] leading-relaxed">{description}</p>
    </div>
  </div>
);

// ── Primary CTA button ────────────────────────────────────────────────────────
const StartNowBtn = ({
  variant = "primary",
  size = "md",
}: {
  variant?: "primary" | "outline-white" | "outline-dark";
  size?: "sm" | "md" | "lg";
}) => {
  const sizeClass =
    size === "lg"
      ? "h-14 px-8 text-base gap-2.5"
      : size === "sm"
      ? "h-9 px-4 text-xs gap-1.5"
      : "h-11 px-6 text-sm gap-2";

  const variantClass =
    variant === "outline-white"
      ? "border-2 border-white/40 text-white hover:bg-white/10"
      : variant === "outline-dark"
      ? "border-2 border-primary text-primary hover:bg-primary hover:text-white"
      : "bg-[#94492c] text-white hover:opacity-90 shadow-[0_4px_14px_rgba(148,73,44,0.35)] hover:shadow-[0_6px_20px_rgba(148,73,44,0.45)]";

  return (
    <Link
      to="/signup"
      className={`inline-flex items-center justify-center rounded-xl font-semibold transition-all ${sizeClass} ${variantClass}`}
    >
      Start Now
      <ArrowRight size={size === "lg" ? 18 : 15} />
    </Link>
  );
};

// ── Page ─────────────────────────────────────────────────────────────────────

const LandingPage = () => (
  <div className="min-h-screen bg-[#fbf9f4] font-[Manrope,system-ui,sans-serif] antialiased">

    {/* ══ NAVBAR ══════════════════════════════════════════════════════════════ */}
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fbf9f4]/90 backdrop-blur-md border-b border-[#f0eee9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Leaf size={14} className="text-white" />
          </div>
          <span className="font-bold text-lg text-[#1b1c19]">
            Eco<span style={{ color: "#94492c" }}>-Chain</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-[#434843]">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-primary transition-colors">How it works</a>
          <a href="#impact" className="hover:text-primary transition-colors">Impact</a>
          <Link to="/login" className="hover:text-primary transition-colors">Log in</Link>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link to="/login" className="sm:hidden text-sm font-medium text-[#434843] hover:text-primary transition-colors">
            Log in
          </Link>
          <StartNowBtn size="sm" />
        </div>
      </div>
    </nav>

    {/* ══ HERO ════════════════════════════════════════════════════════════════ */}
    <section className="relative overflow-hidden bg-primary pt-32 pb-24 sm:pt-40 sm:pb-32 px-4 sm:px-6">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute top-10 left-[10%] w-72 h-72 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 right-[5%] w-96 h-96 rounded-full bg-[#94492c]/15 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 w-64 h-64 rounded-full bg-[#8a9a5b]/10 blur-2xl" />
      </div>

      {/* Decorative leaf pattern */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none" aria-hidden>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="lp" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M40 10 C40 10 20 25 20 45 C20 55 28 65 40 65 C52 65 60 55 60 45 C60 25 40 10 40 10Z" fill="none" stroke="white" strokeWidth="1" />
              <path d="M40 25 L40 55 M32 35 L40 45 L48 35" stroke="white" strokeWidth="0.5" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lp)" />
        </svg>
      </div>

      <div className="relative max-w-3xl mx-auto text-center">
        <Badge><Sprout size={10} /> Regenerative Living Platform</Badge>

        <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.15] tracking-tight">
          Grow a garden that<br className="hidden sm:block" />{" "}
          <span style={{ color: "#8a9a5b" }}>heals the planet</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
          Eco-Chain matches you with native African plants perfectly adapted to your environment —
          saving water, restoring biodiversity, and building a sustainable future from your backyard.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <StartNowBtn size="lg" />
          <Link
            to="/login"
            className="inline-flex items-center gap-2 h-14 px-8 rounded-xl border-2 border-white/30 text-white text-base font-semibold hover:bg-white/10 transition-all"
          >
            Log in
          </Link>
        </div>

        {/* Social proof */}
        <p className="mt-8 text-white/40 text-xs font-medium tracking-wide">
          Join thousands of eco-gardeners across Africa
        </p>
      </div>
    </section>

    {/* ══ STATS BAR ═══════════════════════════════════════════════════════════ */}
    <section className="bg-primary/95 border-t border-white/10 py-8 px-4 sm:px-6" id="impact">
      <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
        <StatPill value="80%" label="Less water used" />
        <StatPill value="500+" label="Native plant species" />
        <StatPill value="12k+" label="Active gardeners" />
        <StatPill value="4.2t" label="CO₂ offset per year" />
      </div>
    </section>

    {/* ══ FEATURES ════════════════════════════════════════════════════════════ */}
    <section className="py-20 sm:py-28 px-4 sm:px-6" id="features">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#94492c] mb-3">What we offer</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#061b0e] leading-tight">
            Everything your eco-garden needs
          </h2>
          <p className="mt-4 text-[#434843] max-w-xl mx-auto leading-relaxed">
            From AI-powered plant matching to care schedules and biodiversity tracking —
            all in one beautiful, easy-to-use platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <FeatureCard
            icon={Leaf}
            title="Green Match AI"
            description="Tell us your location, sun exposure, and soil type. We'll recommend the perfect native plants for your exact conditions."
            color="#061b0e"
          />
          <FeatureCard
            icon={Droplets}
            title="Water Intelligence"
            description="Xeriscape-first recommendations mean your garden uses up to 80% less water than conventional landscaping."
            color="#94492c"
          />
          <FeatureCard
            icon={Star}
            title="Biodiversity Score"
            description="Track how your garden contributes to local pollinators, birds, and insects with a real-time biodiversity impact score."
            color="#8a9a5b"
          />
          <FeatureCard
            icon={Globe}
            title="Climate-Adaptive"
            description="Plants chosen for your specific climate zone so they thrive even as weather patterns shift over time."
            color="#1b3022"
          />
          <FeatureCard
            icon={ShieldCheck}
            title="Care Reminders"
            description="Never miss a watering, pruning, or feeding day. Get personalised care schedules for every plant in your garden."
            color="#94492c"
          />
          <FeatureCard
            icon={TreePine}
            title="Carbon Tracking"
            description="See the real CO₂ offset your garden generates and export annual impact reports for ESG or personal records."
            color="#061b0e"
          />
        </div>
      </div>
    </section>

    {/* ══ HOW IT WORKS ════════════════════════════════════════════════════════ */}
    <section className="bg-[#f5f3ee] py-20 sm:py-28 px-4 sm:px-6" id="how-it-works">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Text side */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#94492c] mb-3">Simple process</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#061b0e] leading-tight mb-10">
            Your garden journey<br />in 4 steps
          </h2>
          <div className="space-y-8">
            <StepCard number="1" title="Create your account" description="Sign up in seconds — no credit card needed. Tell us a little about where you live." />
            <StepCard number="2" title="Set your conditions" description="Enter your plot location, sun hours, soil type, and water goals." />
            <StepCard number="3" title="Get matched" description="Our Green Match engine surfaces native plants perfectly suited to your environment." />
            <StepCard number="4" title="Grow & track impact" description="Add plants to your garden, follow care schedules, and watch your biodiversity score rise." />
          </div>
        </div>

        {/* Visual side */}
        <div className="relative">
          <div className="aspect-square max-w-sm mx-auto lg:max-w-none rounded-3xl bg-primary overflow-hidden shadow-[0_24px_64px_rgba(6,27,14,0.18)] flex items-center justify-center">
            <div className="absolute inset-0 opacity-[0.04]">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="lp2" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M30 8 C30 8 14 20 14 34 C14 42 21 50 30 50 C39 50 46 42 46 34 C46 20 30 8 30 8Z" fill="none" stroke="white" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#lp2)" />
              </svg>
            </div>
            <div className="relative z-10 text-center px-8">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6 backdrop-blur">
                <Leaf size={36} className="text-white" />
              </div>
              <p className="text-white text-xl font-bold leading-tight">Your sustainable<br />garden starts here</p>
              <p className="text-white/50 text-sm mt-3">Powered by native plant science</p>
              <div className="flex justify-center gap-3 mt-8">
                {[Sun, Droplets, Wind].map((Icon, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur">
                    <Icon size={16} className="text-white/70" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ══ CTA BANNER ══════════════════════════════════════════════════════════ */}
    <section className="bg-primary py-20 sm:py-28 px-4 sm:px-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-[#8a9a5b]/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[#94492c]/15 blur-3xl" />
      </div>
      <div className="relative max-w-2xl mx-auto">
        <Badge><Sprout size={10} /> Free to get started</Badge>
        <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
          Ready to grow something<br className="hidden sm:block" /> that matters?
        </h2>
        <p className="mt-5 text-white/60 text-base max-w-lg mx-auto leading-relaxed">
          Join thousands of regenerative gardeners across Africa. Your first plant match is on us.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <StartNowBtn size="lg" />
          <Link
            to="/login"
            className="inline-flex items-center gap-2 h-14 px-8 rounded-xl border-2 border-white/30 text-white text-base font-semibold hover:bg-white/10 transition-all"
          >
            Already have an account
          </Link>
        </div>
      </div>
    </section>

    {/* ══ FOOTER ══════════════════════════════════════════════════════════════ */}
    <footer className="bg-[#061b0e] py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
            <Leaf size={12} className="text-white" />
          </div>
          <span className="font-bold text-white">Eco<span style={{ color: "#8a9a5b" }}>-Chain</span></span>
        </Link>
        <p className="text-white/30 text-xs text-center">
          © {new Date().getFullYear()} Eco-Chain · Regenerative Living · All rights reserved
        </p>
        <div className="flex gap-5 text-white/40 text-xs font-medium">
          <a href="#" className="hover:text-white/70 transition-colors">Privacy</a>
          <a href="#" className="hover:text-white/70 transition-colors">Terms</a>
          <a href="#" className="hover:text-white/70 transition-colors">Contact</a>
        </div>
      </div>
    </footer>

  </div>
);

export default LandingPage;
