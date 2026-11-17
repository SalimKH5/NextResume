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

export default function CreateCV() {
  const router = useRouter();
  const { information } = useDragDrop();
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
          informations: { ...information, title: name },
        }),
      });
      if (!res.ok) throw new Error();
      const data: { insertedId: string } = await res.json();
      router.push(`/cv-editions/${data.insertedId}`);
    } catch {
      setError("The resume wasn't created. Check your connection and try again.");
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="h-12 gap-2 px-5">
          <Plus className="size-4" /> New resume
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={createResume} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle className="text-2xl tracking-tight">New resume</DialogTitle>
            <DialogDescription>
              Give it a name you’ll recognise, like the role you’re applying for.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="resume-title">Name</Label>
            <Input
              id="resume-title"
              autoFocus
              required
              maxLength={120}
              placeholder="Product designer — 2026"
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
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending || !title.trim()}>
              {pending ? "Creating…" : "Create resume"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
