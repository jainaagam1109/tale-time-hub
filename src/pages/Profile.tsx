import { useState } from "react";
import { PhoneShell } from "@/components/PhoneShell";
import { BottomNav } from "@/components/BottomNav";
import { Pencil, Check, X } from "lucide-react";

const Profile = () => {
  const [name, setName] = useState(localStorage.getItem("lulutales_child_name") ?? "");
  const [age, setAge] = useState(localStorage.getItem("lulutales_child_age") ?? "");
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftAge, setDraftAge] = useState(age);

  const initial = (name || "?").charAt(0).toUpperCase();

  const save = () => {
    setName(draftName);
    setAge(draftAge);
    localStorage.setItem("lulutales_child_name", draftName);
    localStorage.setItem("lulutales_child_age", draftAge);
    setEditing(false);
  };

  return (
    <PhoneShell>
      <header className="px-5 pt-4 pb-2">
        <h1 className="text-2xl font-extrabold text-foreground">Profile</h1>
      </header>
      <main className="flex-1 px-5">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary text-2xl font-extrabold text-primary-foreground shadow-glow">
              {initial}
            </div>
            <div className="flex-1">
              {!editing ? (
                <>
                  <div className="text-lg font-extrabold text-foreground">{name || "Add a name"}</div>
                  <div className="text-xs text-muted-foreground">{age ? `${age} years old` : "Tap edit to set age"}</div>
                </>
              ) : (
                <div className="space-y-2">
                  <input
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-sm"
                    placeholder="Child name"
                  />
                  <input
                    value={draftAge}
                    onChange={(e) => setDraftAge(e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-sm"
                    placeholder="Age"
                    inputMode="numeric"
                  />
                </div>
              )}
            </div>
            {!editing ? (
              <button
                onClick={() => {
                  setDraftName(name);
                  setDraftAge(age);
                  setEditing(true);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-primary-deep"
                aria-label="Edit"
              >
                <Pencil className="h-4 w-4" />
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={save}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground"
                  aria-label="Save"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground"
                  aria-label="Cancel"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 rounded-3xl border border-dashed border-border bg-card/50 p-5 text-center">
          <div className="text-sm font-bold text-foreground">Add another child</div>
          <p className="mt-1 text-xs text-muted-foreground">Profile switching coming soon ✨</p>
        </div>
      </main>
      <BottomNav />
    </PhoneShell>
  );
};

export default Profile;
