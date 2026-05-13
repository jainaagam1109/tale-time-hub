import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Users,
  Shield,
  Share2,
  Mail,
  LogOut,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { PhoneShell } from "@/components/PhoneShell";
import { FloatingMiniPlayer } from "@/components/FloatingMiniPlayer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type Kid = { id: string; name: string; age: number };

const Row = ({
  icon: Icon,
  label,
  onClick,
  sub,
  danger,
}: {
  icon: any;
  label: string;
  onClick: () => void;
  sub?: string;
  danger?: boolean;
}) => (
  <button
    onClick={onClick}
    className="flex w-full items-center gap-3 border-b border-border bg-card px-4 py-3 text-left transition-colors hover:bg-secondary/40"
  >
    <div
      className={`flex h-9 w-9 items-center justify-center rounded-xl ${
        danger ? "bg-destructive/10 text-destructive" : "bg-secondary text-primary-deep"
      }`}
    >
      <Icon className="h-4 w-4" />
    </div>
    <div className="flex-1">
      <div className={`text-sm font-bold ${danger ? "text-destructive" : "text-foreground"}`}>{label}</div>
      {sub && <div className="text-[11px] text-muted-foreground">{sub}</div>}
    </div>
    {!danger && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
  </button>
);

const Profile = () => {
  const nav = useNavigate();
  const { user, signOut } = useAuth();
  const [kids, setKids] = useState<Kid[]>([]);
  const activeId = typeof window !== "undefined" ? localStorage.getItem("lulutales_profile_id") : null;
  const [showKids, setShowKids] = useState(false);
  const [sessionMins, setSessionMins] = useState<number>(() =>
    parseInt(localStorage.getItem("lulutales_session_minutes") ?? "30", 10)
  );

  useEffect(() => {
    if (!user) return;
    supabase
      .from("child_profiles")
      .select("id, name, age")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => setKids(data ?? []));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("lulutales_session_minutes", String(sessionMins));
  }, [sessionMins]);

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

  const handleShare = async () => {
    const url = window.location.origin;
    if (navigator.share) {
      try {
        await navigator.share({ title: "StoryLoom", url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    }
  };

  const parentName = user?.email?.split("@")[0] ?? "Parent";

  return (
    <PhoneShell>
      <header className="px-5 pt-4 pb-3">
        <button onClick={() => nav(-1)} className="mb-3 flex items-center gap-1 text-xs text-primary-deep">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pb-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-card text-2xl ring-2 ring-card">
            👩
          </div>
          <div>
            <div className="text-lg font-extrabold capitalize text-foreground">{parentName}</div>
            <div className="text-xs text-muted-foreground">
              Parent account · {kids.length} child {kids.length === 1 ? "profile" : "profiles"}
            </div>
          </div>
        </div>

        <section className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-primary-deep">Session settings</div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-foreground">Session time limit</div>
              <div className="text-[11px] text-muted-foreground">App auto-pauses after this many minutes</div>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={5}
                max={240}
                value={sessionMins}
                onChange={(e) => setSessionMins(parseInt(e.target.value, 10) || 0)}
                className="w-16 rounded-xl border border-border bg-card px-2 py-1.5 text-center text-base font-extrabold text-foreground focus:border-primary focus:outline-none"
              />
              <span className="text-xs text-muted-foreground">min</span>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <Row icon={BarChart3} label="View Insights" onClick={() => nav("/insights")} />
          <Row icon={Users} label="Open / Add kids' profiles" onClick={() => setShowKids((v) => !v)} />
          {showKids && (
            <div className="space-y-2 bg-secondary/30 px-4 py-3">
              {kids.map((k) => {
                const isActive = k.id === activeId;
                return (
                  <button
                    key={k.id}
                    onClick={() => switchTo(k)}
                    className={`flex w-full items-center gap-3 rounded-2xl border bg-card p-3 text-left transition-colors ${
                      isActive ? "border-primary" : "border-border"
                    }`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-sm font-extrabold text-primary-foreground">
                      {k.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-foreground">{k.name}</div>
                      <div className="text-[11px] text-muted-foreground">{k.age} years</div>
                    </div>
                    {isActive && (
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-primary-deep">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
              <button
                onClick={() => nav("/onboarding")}
                className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-border p-3 text-left text-muted-foreground hover:border-primary hover:text-primary"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border">
                  <Plus className="h-4 w-4" />
                </div>
                <div className="text-sm font-bold">Add child</div>
              </button>
            </div>
          )}
          <Row icon={Shield} label="Permissions" onClick={() => toast("Coming soon")} />
          <Row icon={Share2} label="Share app" onClick={handleShare} />
          <Row icon={Mail} label="Contact us" sub="hello@storyloom.app" onClick={() => (window.location.href = "mailto:hello@storyloom.app")} />
          <Row icon={LogOut} label="Log out" onClick={handleSignOut} danger />
        </section>
      </main>

      <FloatingMiniPlayer />
    </PhoneShell>
  );
};

export default Profile;
