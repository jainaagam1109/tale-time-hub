import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { PhoneShell } from "@/components/PhoneShell";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const ages = [4, 5, 6, 7];
const genders = ["Girl", "Boy", "Prefer not to say"];
const families = ["Single parent", "Two parents", "Joint family", "Grandparents"];

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(60),
  age: z.number().int().min(2).max(14),
});

const Pill = ({ active, onClick, children }: any) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
      active
        ? "border-primary bg-secondary text-primary-deep"
        : "border-border bg-card text-muted-foreground hover:border-primary/40"
    }`}
  >
    {children}
  </button>
);

const Onboarding = () => {
  const nav = useNavigate();
  const { session, loading: authLoading } = useAuth();
  const [name, setName] = useState("");
  const [age, setAge] = useState<number>(5);
  const [gender, setGender] = useState<string>("");
  const [family, setFamily] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !session) nav("/auth", { replace: true });
  }, [session, authLoading, nav]);

  const submit = async () => {
    if (!session) return;
    const parsed = schema.safeParse({ name, age });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("child_profiles")
      .insert({
        name: name.trim(),
        age,
        gender: gender || null,
        family_type: family || null,
        user_id: session.user.id,
      })
      .select()
      .single();
    setLoading(false);
    if (error || !data) {
      toast.error("Couldn't save. Try again.");
      return;
    }
    localStorage.setItem("lulutales_profile_id", data.id);
    localStorage.setItem("lulutales_child_name", data.name);
    localStorage.setItem("lulutales_child_age", String(data.age));
    nav("/");
  };

  return (
    <PhoneShell>
      <div className="flex-1 px-6 pb-10 pt-12">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-3xl">
            🎙️
          </div>
          <h1 className="text-2xl font-extrabold text-foreground">Lulutales</h1>
          <p className="mt-1 text-sm text-muted-foreground">Audio stories for curious kids</p>
        </div>

        <h2 className="mb-1 text-xl font-bold text-foreground">About your child</h2>
        <p className="mb-6 text-sm text-muted-foreground">We'll use this to personalise stories.</p>

        <label className="mb-4 block">
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Child's name
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Aanya"
            maxLength={60}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </label>

        <div className="mb-4">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Age</div>
          <div className="flex flex-wrap gap-2">
            {ages.map((a) => (
              <Pill key={a} active={age === a} onClick={() => setAge(a)}>
                {a}
              </Pill>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Gender (optional)
          </div>
          <div className="flex flex-wrap gap-2">
            {genders.map((g) => (
              <Pill key={g} active={gender === g} onClick={() => setGender(gender === g ? "" : g)}>
                {g}
              </Pill>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Family setup (optional)
          </div>
          <div className="flex flex-wrap gap-2">
            {families.map((f) => (
              <Pill key={f} active={family === f} onClick={() => setFamily(family === f ? "" : f)}>
                {f}
              </Pill>
            ))}
          </div>
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="w-full rounded-full bg-gradient-primary py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition-opacity disabled:opacity-50"
        >
          {loading ? "Saving…" : "Continue →"}
        </button>
      </div>
    </PhoneShell>
  );
};

export default Onboarding;
