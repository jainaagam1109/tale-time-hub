import { useNavigate } from "react-router-dom";
import { ChevronLeft, Clock, CheckCircle2 } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { BottomNav } from "@/components/BottomNav";
import { ProfileAvatarButton } from "@/components/ProfileAvatarButton";

const habits = [
  { label: "Healthy eating", value: 80 },
  { label: "Sleep routine", value: 60 },
  { label: "Sharing", value: 40 },
];

const Insights = () => {
  const nav = useNavigate();
  const childName = localStorage.getItem("lulutales_child_name") ?? "your child";

  return (
    <PhoneShell>
      <header className="px-5 pt-4 pb-2">
        <div className="mb-3 flex items-center justify-between">
          <ProfileAvatarButton />
          <button onClick={() => nav(-1)} className="flex items-center gap-1 text-xs text-primary-deep">
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
        </div>
        <h1 className="text-2xl font-extrabold text-foreground">What {childName} learned</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pb-6 space-y-5">
        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <Clock className="h-5 w-5 text-primary-deep" />
            <div className="mt-2 text-lg font-extrabold text-foreground">2.5 hrs</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Screen saved this week</div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <CheckCircle2 className="h-5 w-5 text-primary-deep" />
            <div className="mt-2 text-lg font-extrabold text-foreground">3 episodes</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Completed</div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Habits practiced
          </h2>
          <div className="space-y-3">
            {habits.map((h) => (
              <div key={h.label}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-bold text-foreground">{h.label}</span>
                  <span className="text-muted-foreground">{h.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-primary"
                    style={{ width: `${h.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-tag-warm-border bg-tag-warm-bg p-4">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-tag-warm-fg">AI insight</div>
          <p className="mt-1 text-sm text-tag-warm-fg">
            {childName} responds best to gentle, narrative-led lessons. Try a bedtime story tonight to reinforce
            the sharing habit.
          </p>
        </section>
      </main>

      <BottomNav />
    </PhoneShell>
  );
};

export default Insights;
