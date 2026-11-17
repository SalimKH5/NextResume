import "server-only";
import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, DICTIONARIES, LOCALE_COOKIE, isLocale, type Locale } from "./dictionaries";

/** Cookie first, then the browser's Accept-Language, then English. */
export async function getLocale(): Promise<Locale> {
  const fromCookie = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(fromCookie)) return fromCookie;
  const accept = (await headers()).get("accept-language") ?? "";
  return accept.toLowerCase().startsWith("fr") ? "fr" : DEFAULT_LOCALE;
}

export async function getDictionary() {
  const locale = await getLocale();
  return { locale, t: DICTIONARIES[locale] };
}
