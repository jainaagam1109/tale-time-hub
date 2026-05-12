import { ReactNode } from "react";

export const FieldLabel = ({ children }: { children: ReactNode }) => (
  <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{children}</div>
);

export const Pill = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
      active
        ? "border-primary bg-gradient-primary text-primary-foreground"
        : "border-border bg-card text-muted-foreground hover:border-primary/40"
    }`}
  >
    {children}
  </button>
);

export const TextInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none ${
      props.className ?? ""
    }`}
  />
);
