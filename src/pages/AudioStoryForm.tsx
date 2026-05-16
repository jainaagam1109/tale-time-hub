import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ArrowRight, AlertTriangle, Info } from "lucide-react";
import { toast } from "sonner";
import { PhoneShell } from "@/components/PhoneShell";
import { FloatingMiniPlayer } from "@/components/FloatingMiniPlayer";
import { FieldLabel, TextInput } from "@/components/StoryFormFields";
import { createPersonalisedStory } from "@/lib/stories";
import { supabase } from "@/integrations/supabase/client";

type ProfileFields = {
  name: string;
  age: string;
  gender: string;
  family_type: string;
  city: string;
  personality: string;
  home_type: string;
  family_members: string;
  family_address_terms: string;
};

const empty: ProfileFields = {
  name: "",
  age: "",
  gender: "",
  family_type: "",
  city: "",
  personality: "",
  home_type: "",
  family_members: "",
  family_address_terms: "",
};

const AddressTermsLabel = () => {
  const [show, setShow] = useState(false);
  return (
    <div className="mb-2 flex items-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
      Family address terms
      <div className="relative inline-block">
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="ml-1 text-muted-foreground hover:text-primary-deep"
          aria-label="Info"
        >
          <Info className="h-3.5 w-3.5" />
        </button>
        {show && (
          <div className="absolute left-1/2 top-full z-10 mt-1 w-56 -translate-x-1/2 rounded-xl border border-border bg-card p-2.5 text-[11px] normal-case tracking-normal text-foreground shadow-soft">
            What the child calls each family member, e.g. Father: Papa, Mother: Mummy, Grandmother: Dadi
            <button
              onClick={() => setShow(false)}
              className="mt-1 block w-full text-center text-[10px] font-semibold text-primary-deep"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const AudioStoryForm = () => {
  const nav = useNavigate();
  const profileId = typeof window !== "undefined" ? localStorage.getItem("lulutales_profile_id") : null;

  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState<ProfileFields>(empty);
  const [theme, setTheme] = useState("");
  const [occasion, setOccasion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!profileId) {
      setLoading(false);
      return;
    }
    supabase
      .from("child_profiles")
      .select(
        "name, age, gender, family_type, city, personality, home_type, family_members, family_address_terms"
      )
      .eq("id", profileId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setFields({
            name: data.name ?? "",
            age: data.age != null ? String(data.age) : "",
            gender: data.gender ?? "",
            family_type: data.family_type ?? "",
            city: data.city ?? "",
            personality: data.personality ?? "",
            home_type: data.home_type ?? "",
            family_members: data.family_members ?? "",
            family_address_terms: data.family_address_terms ?? "",
          });
        }
        setLoading(false);
      });
  }, [profileId]);

  const setField = (k: keyof ProfileFields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!profileId) {
      toast.error("Please complete onboarding first.");
      return;
    }
    if (!theme.trim()) {
      toast.error("Please enter a theme for the story.");
      return;
    }
    setSubmitting(true);
    try {
      const created = await createPersonalisedStory({
        title: `${fields.name || "Your child"}'s ${theme.trim()} Story`,
        theme: theme.trim(),
        description: null,
        story_type: "personalised_audio",
        age_group: fields.age || null,
        child_profile_id: profileId,
        thumbnail: "✨",
        generation_params: {
          ...fields,
          theme: theme.trim(),
          occasion: occasion.trim() || null,
        },
      });
      toast.success("Story request saved! We'll generate it shortly.");
      nav(`/generating/${created.id}`);
    } catch (e: any) {
      toast.error(e?.message ?? "Could not save story");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PhoneShell>
      <header className="px-5 pt-4 pb-2">
        <button onClick={() => nav("/magic-hub")} className="mb-3 flex items-center gap-1 text-xs text-primary-deep">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-xl font-extrabold text-foreground">Audio story</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Review your child's details and adjust anything for this story. Changes here won't update the saved profile.
        </p>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pb-6 space-y-5">
        {!profileId && (
          <div className="flex items-start gap-2 rounded-2xl border border-tag-warm-border bg-tag-warm-bg p-3 text-xs text-tag-warm-fg">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <div>
              No child profile found.{" "}
              <Link to="/onboarding" className="font-bold underline">
                Please complete onboarding first.
              </Link>
            </div>
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-border bg-card p-4 text-xs text-muted-foreground">
            Loading profile…
          </div>
        ) : (
          <>
            <section className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-primary-deep">
                Review for this story
              </div>

              <div>
                <FieldLabel>Name</FieldLabel>
                <TextInput value={fields.name} onChange={setField("name")} />
              </div>
              <div>
                <FieldLabel>Age</FieldLabel>
                <TextInput value={fields.age} onChange={setField("age")} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel>Gender</FieldLabel>
                <TextInput value={fields.gender} onChange={setField("gender")} />
              </div>
              <div>
                <FieldLabel>Family setup</FieldLabel>
                <TextInput value={fields.family_type} onChange={setField("family_type")} />
              </div>
              <div>
                <FieldLabel>City</FieldLabel>
                <TextInput value={fields.city} onChange={setField("city")} />
              </div>
              <div>
                <FieldLabel>Personality</FieldLabel>
                <TextInput value={fields.personality} onChange={setField("personality")} />
              </div>
              <div>
                <FieldLabel>Home type</FieldLabel>
                <TextInput
                  value={fields.home_type}
                  onChange={setField("home_type")}
                  placeholder="e.g. apartment, independent house, society"
                />
              </div>
              <div>
                <FieldLabel>Family members</FieldLabel>
                <TextInput
                  value={fields.family_members}
                  onChange={setField("family_members")}
                  placeholder="e.g. Dadi, Papa, older sibling"
                />
              </div>
              <div>
                <AddressTermsLabel />
                <TextInput
                  value={fields.family_address_terms}
                  onChange={setField("family_address_terms")}
                />
              </div>
            </section>

            <section className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-primary-deep">
                Story details
              </div>
              <div>
                <FieldLabel>Theme</FieldLabel>
                <TextInput
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="e.g. Friendship, Courage, Healthy eating"
                />
              </div>
              <div>
                <FieldLabel>Occasion (optional)</FieldLabel>
                <TextInput
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  placeholder="e.g. Diwali, First day of school, Birthday"
                />
              </div>
            </section>

            <button
              onClick={submit}
              disabled={submitting || !profileId}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary py-3 text-sm font-extrabold text-primary-foreground shadow-glow disabled:opacity-50"
            >
              {submitting ? "Saving…" : "Create story"} <ArrowRight className="h-4 w-4" />
            </button>
          </>
        )}
      </main>
      <FloatingMiniPlayer />
    </PhoneShell>
  );
};

export default AudioStoryForm;
