// Self-hosted resume fonts: loaded in the editor only, and bundled so they
// render identically on screen and in the printed PDF.
import "@fontsource-variable/inter";
import "@fontsource-variable/roboto";
import "@fontsource-variable/open-sans";
import "@fontsource-variable/montserrat";
import "@fontsource-variable/source-sans-3";
import "@fontsource-variable/lora";
import "@fontsource-variable/playfair-display";
import "@fontsource-variable/eb-garamond";
import "@fontsource/lato/400.css";
import "@fontsource/lato/400-italic.css";
import "@fontsource/lato/700.css";
import "@fontsource/merriweather/400.css";
import "@fontsource/merriweather/400-italic.css";
import "@fontsource/merriweather/700.css";

export type ResumeFont = { label: string; value: string; kind: "sans" | "serif" };

export const RESUME_FONTS: ResumeFont[] = [
  { label: "Inter", value: "'Inter Variable', Arial, sans-serif", kind: "sans" },
  { label: "Source Sans 3", value: "'Source Sans 3 Variable', Arial, sans-serif", kind: "sans" },
  { label: "Lato", value: "Lato, Arial, sans-serif", kind: "sans" },
  { label: "Open Sans", value: "'Open Sans Variable', Arial, sans-serif", kind: "sans" },
  { label: "Roboto", value: "'Roboto Variable', Arial, sans-serif", kind: "sans" },
  { label: "Montserrat", value: "'Montserrat Variable', Arial, sans-serif", kind: "sans" },
  { label: "Lora", value: "'Lora Variable', Georgia, serif", kind: "serif" },
  { label: "Merriweather", value: "Merriweather, Georgia, serif", kind: "serif" },
  { label: "EB Garamond", value: "'EB Garamond Variable', Garamond, Georgia, serif", kind: "serif" },
  { label: "Playfair Display", value: "'Playfair Display Variable', Georgia, serif", kind: "serif" },
  { label: "Arial", value: "Arial, sans-serif", kind: "sans" },
  { label: "Georgia", value: "Georgia, serif", kind: "serif" },
];
