import { useNavigate } from "react-router-dom";

export const ProfileAvatarButton = () => {
  const nav = useNavigate();
  const childName = typeof window !== "undefined" ? localStorage.getItem("lulutales_child_name") ?? "?" : "?";
  return (
    <button
      onClick={() => nav("/profile")}
      aria-label="Open profile"
      className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-base font-extrabold text-primary-foreground shadow-soft ring-2 ring-card"
    >
      {childName.charAt(0).toUpperCase()}
    </button>
  );
};
