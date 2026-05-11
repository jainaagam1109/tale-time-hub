import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Plus, Users } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type Kid = { id: string; name: string; age: number };

const Profile = () => {
  const nav = useNavigate();
  const { user, signOut } = useAuth();
  const [kids, setKids] = useState<Kid[]>([]);
  const activeId = localStorage.getItem("lulutales_profile_id");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("child_profiles")
      .select("id, name, age")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => setKids(data ?? []));
  }, [user]);

  const switchTo = (k: Kid) => {
    localStorage.setItem("lulutales_profile_id", k.id);
    localStorage.setItem("lulutales_child_name", k.name);
    localStorage.setItem("lulutales_child_age", String(k.age));
    nav("/");
  };

  const handleSignOut = async () => {
    await signOut();
    nav("/auth", { replace: true });
  };

  return (
    <PhoneShell>
      <header className="px-5 pt-4 pb-2">
        <h1 className="text-2xl font-extrabold text-foreground">Profile</h1>
        <p className="mt-1 text-xs text-muted-foreground">{user?.email}</p>
      </header>
      <main className="flex-1 px-5 pb-6">
        <div className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <Users className="h-3 w-3" /> Kid profiles
        </div>
        <div className="space-y-2">
          {kids.map((k) => {
            const isActive = k.id === activeId;
            return (
              <button
                key={k.id}
                onClick={() => switchTo(k)}
                className={`flex w-full items-center gap-3 rounded-2xl border bg-card p-3 text-left transition-colors ${
                  isActive ? "border-primary" : "border-border hover:border-primary/40"
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-lg font-extrabold text-primary-foreground">
                  {k.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-foreground">{k.name}</div>
                  <div className="text-xs text-muted-foreground">{k.age} years</div>
                </div>
                {isActive && <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-primary-deep">Active</span>}
              </button>
            );
          })}
          <button
            onClick={() => nav("/onboarding")}
            className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 p-3 text-left text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border">
              <Plus className="h-5 w-5" />
            </div>
            <div className="text-sm font-bold">Add child</div>
          </button>
        </div>

        <button
          onClick={handleSignOut}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card py-3 text-sm font-bold text-foreground hover:border-primary"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </main>
      <BottomNav />
    </PhoneShell>
  );
};

export default Profile;
