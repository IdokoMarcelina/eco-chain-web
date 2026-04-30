import { ReactNode } from "react";

export const AuthLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-10">
    <div className="w-full max-w-[440px] bg-card rounded-card shadow-card p-12 page-fade">
      <div className="text-center mb-6">
        <h1 className="text-headline-md">
          <span className="text-primary">Eco</span><span className="text-tertiary-foreground">-Chain</span>
        </h1>
        <p className="text-caption text-on-surface-variant mt-1">Regenerative Living</p>
      </div>
      {children}
    </div>
  </div>
);
