"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDragDrop } from "./DraggableContext";
import { useI18n } from "@/i18n/I18nProvider";
import { DICTIONARIES } from "@/i18n/dictionaries";

export default function CreateCV() {
  const router = useRouter();
  const { information } = useDragDrop();
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createResume = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = title.trim();
    if (!name) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/CvtTmplates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_template: 1,
          title_template: name,
          informations: { ...information, ...DICTIONARIES[locale].resume.titles },
        }),
      });
      if (!res.ok) throw new Error();
      const data: { insertedId: string } = await res.json();
      router.push(`/cv-editions/${data.insertedId}`);
    } catch {
      setError(t.create.error);
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="h-12 gap-2 px-5">
          <Plus className="size-4" /> {t.dashboard.newResume}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={createResume} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle className="text-2xl tracking-tight">{t.create.title}</DialogTitle>
            <DialogDescription>
              {t.create.description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="resume-title">{t.create.name}</Label>
            <Input
              id="resume-title"
              autoFocus
              required
              maxLength={120}
              placeholder={t.create.placeholder}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11"
            />
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {t.create.cancel}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending || !title.trim()}>
              {pending ? t.create.creating : t.create.create}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
