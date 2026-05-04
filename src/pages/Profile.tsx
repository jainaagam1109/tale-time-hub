import { PhoneShell } from "@/components/PhoneShell";
import { BottomNav } from "@/components/BottomNav";

const Profile = () => {
  const name = localStorage.getItem("lulutales_child_name") ?? "—";
  return (
    <PhoneShell>
      <header className="px-5 pt-8 pb-4">
        <h1 className="text-2xl font-extrabold text-foreground">Profile</h1>
      </header>
      <main className="flex-1 px-5">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Child
          </div>
          <div className="text-lg font-bold text-foreground">{name}</div>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">More coming soon ✨</p>
      </main>
      <BottomNav />
    </PhoneShell>
  );
};

export default Profile;
