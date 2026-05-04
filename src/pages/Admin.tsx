import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { PhoneShell } from "@/components/PhoneShell";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().trim().min(1).max(120),
  theme: z.string().trim().max(60).optional(),
  age_group: z.string().trim().max(20).optional(),
  description: z.string().trim().max(2000).optional(),
  duration: z.number().int().min(0).max(36000).optional(),
  thumbnail: z.string().trim().max(8).optional(),
});

const Admin = () => {
  const [form, setForm] = useState({
    title: "",
    theme: "",
    age_group: "4-7",
    description: "",
    duration: "",
    tags: "",
    thumbnail: "📖",
    is_featured: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({
      title: form.title,
      theme: form.theme || undefined,
      age_group: form.age_group || undefined,
      description: form.description || undefined,
      duration: form.duration ? parseInt(form.duration, 10) : undefined,
      thumbnail: form.thumbnail || undefined,
    });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    if (!file) {
      toast.error("Please choose an audio file");
      return;
    }
    setBusy(true);
    try {
      const ext = file.name.split(".").pop() || "mp3";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("stories-audio").upload(path, file, {
        contentType: file.type || "audio/mpeg",
      });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("stories-audio").getPublicUrl(path);

      const { data: story, error: insErr } = await supabase
        .from("stories")
        .insert({
          title: parsed.data.title,
          theme: parsed.data.theme ?? null,
          description: parsed.data.description ?? null,
          age_group: parsed.data.age_group ?? null,
          duration: parsed.data.duration ?? null,
          thumbnail: parsed.data.thumbnail ?? null,
          audio_url: pub.publicUrl,
          is_featured: form.is_featured,
        })
        .select()
        .single();
      if (insErr || !story) throw insErr;

      const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
      if (tags.length) {
        await supabase.from("story_tags").insert(tags.map((tag) => ({ story_id: story.id, tag })));
      }

      toast.success("Story uploaded!");
      setForm({
        title: "",
        theme: "",
        age_group: "4-7",
        description: "",
        duration: "",
        tags: "",
        thumbnail: "📖",
        is_featured: false,
      });
      setFile(null);
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary";

  return (
    <PhoneShell>
      <div className="flex-1 overflow-y-auto px-5 pt-8 pb-10">
        <h1 className="text-2xl font-extrabold text-foreground">Admin · Upload story</h1>
        <p className="mb-6 mt-1 text-xs text-muted-foreground">Internal page</p>

        <form onSubmit={submit} className="space-y-3">
          <input className={inputCls} placeholder="Title" value={form.title} onChange={(e) => set("title", e.target.value)} />
          <input className={inputCls} placeholder="Theme (e.g. Courage)" value={form.theme} onChange={(e) => set("theme", e.target.value)} />
          <input className={inputCls} placeholder="Age group (e.g. 4-7)" value={form.age_group} onChange={(e) => set("age_group", e.target.value)} />
          <input className={inputCls} placeholder="Thumbnail emoji" value={form.thumbnail} onChange={(e) => set("thumbnail", e.target.value)} />
          <textarea
            className={`${inputCls} min-h-[90px]`}
            placeholder="Description"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
          <input
            className={inputCls}
            placeholder="Duration in seconds"
            type="number"
            value={form.duration}
            onChange={(e) => set("duration", e.target.value)}
          />
          <input
            className={inputCls}
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={(e) => set("tags", e.target.value)}
          />
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => set("is_featured", e.target.checked)}
            />
            Featured (show in Recommended)
          </label>
          <div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Audio file
            </div>
            <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="w-full text-sm" />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="mt-2 w-full rounded-full bg-gradient-primary py-3.5 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-50"
          >
            {busy ? "Uploading…" : "Upload story"}
          </button>
        </form>
      </div>
    </PhoneShell>
  );
};

export default Admin;
