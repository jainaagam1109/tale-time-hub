import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Headphones, Moon, BookOpen } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { BottomNav } from "@/components/BottomNav";
import { ProfileAvatarButton } from "@/components/ProfileAvatarButton";

const MagicHub = () => {
  const nav = useNavigate();

  const cards = [
    {
      title: "Generate audio story",
      desc: "A bespoke tale, narrated for your child",
      icon: Headphones,
      tag: "BETA",
      tagClass: "bg-tag-mint-bg text-tag-mint-fg border-tag-mint-border",
      onClick: () => nav("/magic-hub/audio"),
      disabled: false,
    },
    {
      title: "Generate bedtime story",
      desc: "Calm, gentle stories for sleep time",
      icon: Moon,
      tag: "BETA",
      tagClass: "bg-tag-mint-bg text-tag-mint-fg border-tag-mint-border",
      onClick: () => nav("/magic-hub/bedtime"),
      disabled: false,
    },
    {
      title: "Personalised story book",
      desc: "Printed keepsake delivered to your door",
      icon: BookOpen,
      tag: "COMING SOON",
      tagClass: "bg-muted text-muted-foreground border-border",
      onClick: () => {},
      disabled: true,
    },
  ];

  return (
    <PhoneShell>
      <header className="px-5 pt-4 pb-2">
        <button onClick={() => nav(-1)} className="mb-3 flex items-center gap-1 text-xs text-primary-deep">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-primary-deep">Create</div>
        <h1 className="text-2xl font-extrabold text-foreground">Magic Hub</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pb-6 space-y-3">
        {cards.map(({ title, desc, icon: Icon, tag, tagClass, onClick, disabled }) => (
          <button
            key={title}
            onClick={onClick}
            disabled={disabled}
            className={`flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-soft transition-colors ${
              disabled ? "opacity-60" : "hover:border-primary"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-card text-primary-deep">
              <Icon className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="text-sm font-extrabold text-foreground">{title}</div>
                <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${tagClass}`}>
                  {tag}
                </span>
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">{desc}</div>
            </div>
            {!disabled && <ChevronRight className="h-5 w-5 text-muted-foreground" />}
          </button>
        ))}
      </main>

      <BottomNav />
    </PhoneShell>
  );
};

export default MagicHub;
