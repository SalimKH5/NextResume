"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { PhoneInput } from "@/components/phone-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DotTitle } from "@/components/brand/Backdrop";
import { useI18n } from "@/i18n/I18nProvider";

type ProfileForm = {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfbirth: string;
  phoneNumber: string;
  email: string;
  address: string;
  postalCode: string;
  town: string;
  country: string;
};

const toDateInput = (d?: Date | string) => {
  if (!d) return "";
  const date = new Date(d);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

const fromUser = (u?: UserType): ProfileForm => ({
  firstName: u?.firstName ?? "",
  lastName: u?.lastName ?? "",
  gender: u?.gender ?? "",
  dateOfbirth: toDateInput(u?.dateOfbirth),
  phoneNumber: u?.phoneNumber ?? "",
  email: u?.email ?? "",
  address: u?.address ?? "",
  postalCode: u?.postalCode ?? "",
  town: u?.town ?? "",
  country: u?.country ?? "",
});

type Status = { kind: "idle" } | { kind: "saving" } | { kind: "saved" } | { kind: "error"; message: string };

function Field({
  id,
  label,
  optional,
  className,
  children,
}: {
  id?: string;
  label: string;
  optional?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {optional && <span className="font-normal text-muted-foreground"> {optional}</span>}
      </Label>
      {children}
    </div>
  );
}

const inputClass = "h-12 text-base";

export default function ProfilePage() {
  const { data: session, update, status: sessionStatus } = useSession();
  const [form, setForm] = useState<ProfileForm>(() => fromUser(session?.user));
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const { t } = useI18n();
  const p = t.profile;
  const opt = p.optional;

  // Fill the form once the session is available.
  useEffect(() => {
    if (sessionStatus === "authenticated") setForm(fromUser(session?.user));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionStatus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (status.kind !== "idle") setStatus({ kind: "idle" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ kind: "saving" });
    // email is the account identity and is not editable here
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, ...payload } = form;
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? p.saveError);
      }
      await update();
      setStatus({ kind: "saved" });
    } catch (err) {
      setStatus({ kind: "error", message: (err as Error).message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-12">
      <div>
        <DotTitle className="text-[clamp(2.75rem,7vw,5rem)]">{p.title}</DotTitle>
        <p className="mt-4 max-w-lg text-muted-foreground">
          {p.lead}
        </p>
      </div>

      <fieldset className="grid gap-x-8 gap-y-7 border-t-2 border-ink pt-8 md:grid-cols-2">
        <legend className="sr-only">Personal details</legend>
        <Field id="firstName" label={p.firstName}>
          <Input id="firstName" name="firstName" autoComplete="given-name" value={form.firstName} onChange={handleChange} className={inputClass} required />
        </Field>
        <Field id="lastName" label={p.lastName}>
          <Input id="lastName" name="lastName" autoComplete="family-name" value={form.lastName} onChange={handleChange} className={inputClass} required />
        </Field>

        <div className="flex flex-col gap-2" role="radiogroup" aria-labelledby="gender-label">
          <span id="gender-label" className="text-sm font-medium">
            {p.gender} <span className="font-normal text-muted-foreground">{opt}</span>
          </span>
          <div className="flex h-12 items-center gap-6">
            {[
              { value: "female", label: p.woman },
              { value: "male", label: p.man },
            ].map((g) => (
              <label key={g.value} className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value={g.value}
                  checked={form.gender === g.value}
                  onChange={handleChange}
                  className="size-4 accent-[var(--ink)]"
                />
                {g.label}
              </label>
            ))}
          </div>
        </div>

        <Field id="dateOfbirth" label={p.birth} optional={opt}>
          <Input id="dateOfbirth" name="dateOfbirth" type="date" autoComplete="bday" value={form.dateOfbirth} onChange={handleChange} className={inputClass} />
        </Field>

        <Field label={p.phone} optional={opt}>
          <PhoneInput
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={(value) => setForm((prev) => ({ ...prev, phoneNumber: value ?? "" }))}
          />
        </Field>

        <Field id="email" label={p.email}>
          <Input id="email" name="email" type="email" value={form.email} readOnly disabled className={inputClass} />
        </Field>
      </fieldset>

      <fieldset className="grid gap-x-8 gap-y-7 border-t-2 border-ink pt-8 md:grid-cols-3">
        <legend className="sr-only">Address</legend>
        <Field id="address" label={p.address} optional={opt} className="md:col-span-3">
          <Input id="address" name="address" autoComplete="street-address" value={form.address} onChange={handleChange} className={inputClass} />
        </Field>
        <Field id="postalCode" label={p.postalCode} optional={opt}>
          <Input id="postalCode" name="postalCode" autoComplete="postal-code" value={form.postalCode} onChange={handleChange} className={inputClass} />
        </Field>
        <Field id="town" label={p.city} optional={opt}>
          <Input id="town" name="town" autoComplete="address-level2" value={form.town} onChange={handleChange} className={inputClass} />
        </Field>
        <Field id="country" label={p.country} optional={opt}>
          <Input id="country" name="country" autoComplete="country-name" value={form.country} onChange={handleChange} className={inputClass} />
        </Field>
      </fieldset>

      <div className="flex flex-wrap items-center gap-5 border-t border-line pt-8">
        <Button type="submit" size="lg" className="h-12 px-6" disabled={status.kind === "saving"}>
          {status.kind === "saving" ? p.saving : p.save}
        </Button>
        <p aria-live="polite" className="text-sm">
          {status.kind === "saved" && <span className="text-mint-deep">{p.saved}</span>}
          {status.kind === "error" && <span className="text-destructive">{status.message}</span>}
        </p>
      </div>
    </form>
  );
}
