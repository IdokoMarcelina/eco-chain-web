import { InputHTMLAttributes, ReactNode, forwardRef } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  icon?: ReactNode;
  trailing?: ReactNode;
};

export const EcoInput = forwardRef<HTMLInputElement, Props>(
  ({ label, icon, trailing, className = "", ...rest }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-label-md text-on-surface">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full h-12 bg-surface-container border border-outline-variant rounded-lg text-body-md text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors ${
            icon ? "pl-10" : "pl-4"
          } ${trailing ? "pr-12" : "pr-4"} ${className}`}
          {...rest}
        />
        {trailing && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">{trailing}</div>
        )}
      </div>
    </div>
  )
);
EcoInput.displayName = "EcoInput";
