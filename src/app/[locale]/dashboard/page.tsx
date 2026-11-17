"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowUpRight } from "lucide-react";
import CreateCV from "@/components/CreateCV";
import { DotTitle } from "@/components/brand/Backdrop";

type ResumeSummary = { _id: string; title_template: string };

export default function Dashboard() {
  const { status } = useSession();
  const [resumes, setResumes] = useState<ResumeSummary[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    const controller = new AbortController();
    fetch("/api/CvtTmplates", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => setResumes(data?.templates ?? []))
      .catch((err) => {
        if (err?.name !== "AbortError") setError(true);
      });
    return () => controller.abort();
  }, [status]);

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <DotTitle className="text-[clamp(2.75rem,7vw,5rem)]">My resumes</DotTitle>
        <CreateCV />
      </div>

      {error ? (
        <p role="alert" className="text-destructive">
          Your resumes couldn’t be loaded. Refresh the page to try again.
        </p>
      ) : resumes === null ? (
        <ul className="flex flex-col" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <li key={i} className="h-20 border-t border-line">
              <span className="mt-7 block h-5 w-1/3 animate-pulse rounded bg-muted" />
            </li>
          ))}
        </ul>
      ) : resumes.length === 0 ? (
        <div className="border-t-2 border-ink pt-8">
          <p className="text-xl font-medium">No resumes yet.</p>
          <p className="mt-2 max-w-md text-muted-foreground">
            Create your first one. You can switch templates and reorder sections at any time.
          </p>
        </div>
      ) : (
        <ul className="border-b border-line">
          {resumes.map((cv) => (
            <li key={cv._id}>
              <Link
                href={`/cv-editions/${cv._id}`}
                className="group flex items-center gap-6 border-t border-line py-6 transition-colors hover:bg-mint-wash/60 sm:px-2"
              >
                <span className="flex-1 truncate text-xl font-medium tracking-tight sm:text-2xl">
                  {cv.title_template || "Untitled resume"}
                </span>
                <span className="hidden text-sm uppercase sm:inline">Edit</span>
                <ArrowUpRight className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
