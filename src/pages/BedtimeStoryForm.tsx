import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { PhoneShell } from "@/components/PhoneShell";
import { FieldLabel, Pill, TextInput } from "@/components/StoryFormFields";

const CITIES = ["Bengaluru", "Mumbai", "Delhi", "Chennai", "Hyderabad", "Pune", "Kolkata", "Other"];
const TONES = ["😄 Warm + funny", "🌙 Quiet + gentle", "🌟 Adventurous", "✨ Magical"];
const OCCASIONS = ["Diwali", "Monsoon", "First day of school", "Birthday"];
const TIMES = ["7pm", "8pm", "9pm", "10pm"];

const BedtimeStoryForm = () => {
  const nav = useNavigate();
  const childName = localStorage.getItem("lulutales_child_name") ?? "Your child";
  const childAge = localStorage.getItem("lulutales_child_age") ?? "";
  const childGender = localStorage.getItem("lulutales_child_gender") ?? "";

  const [city, setCity] = useState("Bengaluru");
  const [otherCity, setOtherCity] = useState("");
  const [tone, setTone] = useState("🌙 Quiet + gentle");
  const [theme, setTheme] = useState("Healthy eating");
  const [occasions, setOccasions] = useState<string[]>([]);
  const [customOccasion, setCustomOccasion] = useState("");
  const [dailyOn, setDailyOn] = useState(false);
  const [email, setEmail] = useState("");
  const [time, setTime] = useState("8pm");

  const toggleOccasion = (o: string) =>
    setOccasions((prev) => (prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o]));

  const submit = () => {
    toast.success("Your bedtime story request has been saved. We'll notify you when it's ready.");
  };

  return (
    <PhoneShell>
      <header className="px-5 pt-4 pb-2">
        <button onClick={() => nav("/magic-hub")} className="mb-3 flex items-center gap-1 text-xs text-primary-deep">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-xl font-extrabold text-foreground">Bedtime story</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pb-6 space-y-5">
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

        <section className="rounded-2xl border border-border bg-card p-4">
          <label className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-foreground">Email me a new bedtime story every day</span>
            <button
              type="button"
              role="switch"
              aria-checked={dailyOn}
              onClick={() => setDailyOn((v) => !v)}
              className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
                dailyOn ? "bg-gradient-primary" : "bg-muted"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow-soft transition-transform ${
                  dailyOn ? "translate-x-[22px]" : "translate-x-0.5"
                }`}
              />
            </button>
          </label>

          {dailyOn && (
            <div className="mt-3 space-y-3">
              <TextInput
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div>
                <FieldLabel>Delivery time</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {TIMES.map((t) => (
                    <Pill key={t} active={time === t} onClick={() => setTime(t)}>{t}</Pill>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        <button
          onClick={submit}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary py-3 text-sm font-extrabold text-primary-foreground shadow-glow"
        >
          Create story <ArrowRight className="h-4 w-4" />
        </button>
      </main>
    </PhoneShell>
  );
};

export default BedtimeStoryForm;
