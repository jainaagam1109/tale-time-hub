import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ArrowRight, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { PhoneShell } from "@/components/PhoneShell";
import { FieldLabel, Pill, TextInput } from "@/components/StoryFormFields";
import { createPersonalisedStory } from "@/lib/stories";

const CITIES = ["Bengaluru", "Mumbai", "Delhi", "Chennai", "Hyderabad", "Pune", "Kolkata", "Other"];
const TONES = ["😄 Warm + funny", "🌙 Quiet + gentle", "🌟 Adventurous", "✨ Magical"];
const OCCASIONS = ["Diwali", "Monsoon", "First day of school", "Birthday"];

const AudioStoryForm = () => {
  const nav = useNavigate();
  const childName = localStorage.getItem("lulutales_child_name") ?? "Your child";
  const childAge = localStorage.getItem("lulutales_child_age") ?? "";
  const childGender = localStorage.getItem("lulutales_child_gender") ?? "";
  const profileId = typeof window !== "undefined" ? localStorage.getItem("lulutales_profile_id") : null;

  const [city, setCity] = useState("Bengaluru");
  const [otherCity, setOtherCity] = useState("");
  const [tone, setTone] = useState(TONES[0]);
  const [theme, setTheme] = useState("Healthy eating");
  const [occasions, setOccasions] = useState<string[]>([]);
  const [customOccasion, setCustomOccasion] = useState("");

  const toggleOccasion = (o: string) =>
    setOccasions((prev) => (prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o]));

  const submit = () => {
    toast.success("Narrator selection coming soon. Your story request has been saved.");
  };

  return (
    <PhoneShell>
      <header className="px-5 pt-4 pb-2">
        <button onClick={() => nav("/magic-hub")} className="mb-3 flex items-center gap-1 text-xs text-primary-deep">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-xl font-extrabold text-foreground">Audio story</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pb-6 space-y-5">
        <div className="rounded-2xl border border-border bg-card p-3">
          <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>Monthly usage</span>
            <span className="font-bold text-primary-deep">1 / 3</span>
          </div>
          <div className="h-1.5 rounded-full bg-secondary">
            <div className="h-full w-1/3 rounded-full bg-gradient-primary" />
          </div>
          <div className="mt-1 text-[10px] text-muted-foreground">1 of 3 audio stories used this month</div>
        </div>

        <div className="rounded-2xl bg-secondary p-3 text-xs text-foreground">
          <span className="font-bold">{childName}</span>
          {childAge && <> · {childAge} yrs</>}
          {childGender && <> · {childGender}</>}
        </div>

        <section>
          <FieldLabel>City</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {CITIES.map((c) => (
              <Pill key={c} active={city === c} onClick={() => setCity(c)}>{c}</Pill>
            ))}
          </div>
          {city === "Other" && (
            <div className="mt-2">
              <TextInput
                placeholder="Type your city"
                value={otherCity}
                onChange={(e) => setOtherCity(e.target.value)}
              />
            </div>
          )}
        </section>

        <section>
          <FieldLabel>Tone</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <Pill key={t} active={tone === t} onClick={() => setTone(t)}>{t}</Pill>
            ))}
          </div>
        </section>

        <section>
          <FieldLabel>Theme</FieldLabel>
          <TextInput value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="e.g. Friendship" />
        </section>

        <section>
          <FieldLabel>Occasion</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {OCCASIONS.map((o) => (
              <Pill key={o} active={occasions.includes(o)} onClick={() => toggleOccasion(o)}>{o}</Pill>
            ))}
          </div>
          <div className="mt-2">
            <TextInput
              placeholder="Add another occasion"
              value={customOccasion}
              onChange={(e) => setCustomOccasion(e.target.value)}
            />
          </div>
        </section>

        <button
          onClick={submit}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary py-3 text-sm font-extrabold text-primary-foreground shadow-glow"
        >
          Next: Choose narrator <ArrowRight className="h-4 w-4" />
        </button>
      </main>
    </PhoneShell>
  );
};

export default AudioStoryForm;
