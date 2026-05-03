import { ReactNode } from "react";

export const AuthLayout = ({
  children,
  sideTitle = "Regenerative Living",
  sideSubtitle = "Build a sustainable future with Eco-Chain.",
}: {
  children: ReactNode;
  sideTitle?: string;
  sideSubtitle?: string;
}) => (
  <div className="min-h-screen flex bg-surface page-fade">
    {/* Left branding panel */}
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-primary-container/40 blur-3xl" />
        <div className="absolute bottom-32 right-16 w-96 h-96 rounded-full bg-tertiary-container/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-secondary/10 blur-2xl" />
      </div>

      {/* Decorative leaf pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="leaf-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M40 10 C40 10 20 25 20 45 C20 55 28 65 40 65 C52 65 60 55 60 45 C60 25 40 10 40 10Z" fill="none" stroke="white" strokeWidth="1"/>
              <path d="M40 25 L40 55 M32 35 L40 45 L48 35" stroke="white" strokeWidth="0.5" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#leaf-pattern)"/>
        </svg>
      </div>

      <div className="relative z-10 flex flex-col justify-between p-16 w-full">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--on-primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3C12 3 7 8 7 13 C7 16 9 19 12 19 C15 19 17 16 17 13 C17 8 12 3 12 3Z"/>
                <path d="M12 9 L12 16 M9 12 L12 15 L15 12"/>
              </svg>
            </div>
            <span className="text-white/90 text-label-md tracking-wide">Eco-Chain</span>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-display text-white leading-tight">{sideTitle}</h2>
          <p className="text-body-lg text-primary-muted max-w-md">{sideSubtitle}</p>

          <div className="flex gap-6 pt-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary-muted))" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
              </div>
              <span className="text-sm text-primary-muted">Solar Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary-muted))" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 22c4-4 8-7.5 8-12a8 8 0 1 0-16 0c0 4.5 4 8 8 12z"/>
                  <path d="M12 12V8M12 12l3 2"/>
                </svg>
              </div>
              <span className="text-sm text-primary-muted">Native Flora</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary-muted))" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                </svg>
              </div>
              <span className="text-sm text-primary-muted">Water Wise</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-primary-muted/60">
          &copy; {new Date().getFullYear()} Eco-Chain. All rights reserved.
        </div>
      </div>
    </div>

    {/* Right form panel */}
    <div className="flex-1 flex items-center justify-center px-4 py-10 sm:px-6 sm:py-12 lg:px-16">
      <div className="w-full max-w-[440px] page-fade">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center justify-center gap-2 mb-10">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3C12 3 7 8 7 13 C7 16 9 19 12 19 C15 19 17 16 17 13 C17 8 12 3 12 3Z"/>
              <path d="M12 9 L12 16 M9 12 L12 15 L15 12"/>
            </svg>
          </div>
          <span className="text-headline-md text-on-surface">
            <span className="text-primary">Eco</span><span className="text-on-surface">-Chain</span>
          </span>
        </div>

        {children}
      </div>
    </div>
  </div>
);
