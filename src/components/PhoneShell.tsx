import { ReactNode } from "react";

export const PhoneShell = ({ children }: { children: ReactNode }) => (
  <div className="mx-auto flex min-h-screen max-w-[430px] flex-col">
    {children}
  </div>
);
