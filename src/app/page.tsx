import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { ArrowRight } from "lucide-react";
import { Navbar1 } from "@/components/Navbar";
import { Slash } from "@/components/brand/Slash";
import { Backdrop, DotTitle } from "@/components/brand/Backdrop";
import { authOptions } from "@/lib/AuthOption";

const TEMPLATES = [
  { src: "/template1.png", name: "Two-column classic" },
  { src: "/template2.png", name: "Sidebar accent" },
  { src: "/template3.png", name: "Single-column minimal" },
];

const STEPS = [
  { title: "Sign in with Google", body: "Your resumes are saved to your account, so you can come back and edit any time." },
  { title: "Pick a template", body: "Start from a layout and switch whenever you like; your content stays in place." },
  { title: "Drag in your sections", body: "Experience, education, skills, languages, interests. Reorder them by dragging." },
  { title: "Download a PDF", body: "Print-ready A4, with the fonts, colors and spacing you chose." },
];

export default async function Home() {
  const session = await getServerSession(authOptions);
  const startHref = session ? "/locale/dashboard" : "/Auth";

  return (
    <>
      <Navbar1 />
      <main>
        {/* Hero */}
        <section className="relative isolate flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-10 text-center">
          <Backdrop />

          <div className="relative">
            <h1 className="nr-display text-ink text-[clamp(3.6rem,14vw,11.5rem)]">
              <span className="block">Land the</span>
              <span className="block">
                interview
                <span
                  aria-hidden="true"
                  className="inline-block size-[0.15em] rounded-full bg-mint ml-[0.04em]"
                />
              </span>
            </h1>
            <Slash className="nr-slash nr-slash-in pointer-events-none absolute h-[112%] mix-blend-multiply drop-shadow-[0_0_24px_rgba(23,226,165,0.45)]" />
          </div>

          <p className="mt-10 max-w-[38rem] text-base leading-relaxed text-ink/85 sm:text-lg">
            NextResume is a free resume builder for people at a turning point in their careers.
            Choose a template, drag in your experience and download a polished PDF, with no
            design skills needed.
          </p>

          <Link href={startHref} className="nr-cta mt-10 text-lg sm:text-xl">
            Build your resume <ArrowRight className="size-5" strokeWidth={2.5} />
          </Link>
        </section>

        {/* Templates strip, the "logos" row of the reference */}
        <section
          id="templates"
          className="mx-auto grid max-w-[1440px] scroll-mt-24 items-center gap-10 px-4 py-16 sm:px-8 lg:grid-cols-[minmax(0,16rem)_1fr] lg:px-[5.5%]"
        >
          <p className="max-w-56 text-[0.95rem] leading-snug">
            <span className="text-mint-deep">/</span> Three templates, ready for your story.
          </p>
          <ul className="grid grid-cols-3 gap-4 sm:gap-8">
            {TEMPLATES.map((t) => (
              <li key={t.src}>
                <Link href={startHref} className="group block">
                  <div className="relative aspect-[1/1.414] overflow-hidden rounded-sm border border-line bg-muted transition-colors group-hover:border-mint">
                    <Image
                      src={t.src}
                      alt={`${t.name} resume template`}
                      fill
                      sizes="(min-width: 1024px) 25vw, 33vw"
                      className="object-cover object-top grayscale transition duration-300 group-hover:grayscale-0"
                    />
                  </div>
                  <span className="mt-3 block text-sm text-muted-foreground group-hover:text-ink">
                    {t.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* How it works: a real sequence, so the steps are numbered */}
        <section
          id="how-it-works"
          className="mx-auto max-w-[1440px] scroll-mt-24 border-t border-line px-4 py-24 sm:px-8 lg:px-[5.5%]"
        >
          <DotTitle as="h2" className="text-[clamp(2.5rem,6vw,4.75rem)]">
            From blank page to PDF
          </DotTitle>
          <ol className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <li key={step.title} className="border-t-2 border-ink pt-5">
                <span className="text-sm text-mint-deep font-semibold">/{i + 1}</span>
                <h3 className="mt-3 text-xl font-medium tracking-tight">{step.title}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">{step.body}</p>
              </li>
            ))}
          </ol>
          <Link href={startHref} className="nr-cta mt-16 text-lg">
            Start now <ArrowRight className="size-5" strokeWidth={2.5} />
          </Link>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-8 text-sm text-muted-foreground sm:px-8 lg:px-[5.5%]">
          <span>© {new Date().getFullYear()} NextResume</span>
          <a href="https://github.com/SalimKH5/NextResume" className="hover:text-ink">
            GitHub
          </a>
        </div>
      </footer>
    </>
  );
}
