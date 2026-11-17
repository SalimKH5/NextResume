"use client";

import { useRef } from "react";
import { useSession } from "next-auth/react";
import { ImageUp, Trash2 } from "lucide-react";
import { useDragDrop } from "./DraggableContext";
import { useI18n } from "@/i18n/I18nProvider";

export const PHOTO_DEFAULTS = { size: 104, shape: "circle" as const, ring: true };

/** True when the stored value is a real photo (uploaded data URL or http URL), not the old demo file name. */
export const isPhoto = (v?: string) => !!v && (v.startsWith("data:image/") || /^https?:\/\//.test(v));

/** Square-crop and compress an image file in the browser: ~30–60 KB JPEG data URL. */
export async function fileToPhoto(file: File, max = 480): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("not-an-image");
  if (file.size > 15 * 1024 * 1024) throw new Error("too-large");
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = url;
    });
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    const sx = (img.naturalWidth - side) / 2;
    // faces sit in the upper part of most portraits: bias the crop upwards
    const sy = Math.max(0, (img.naturalHeight - side) * 0.35);
    const out = Math.min(max, side);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = out;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, sx, sy, side, side, 0, 0, out, out);
    return canvas.toDataURL("image/jpeg", 0.86);
  } finally {
    URL.revokeObjectURL(url);
  }
}

const radius = (shape?: string) => (shape === "square" ? "6%" : shape === "rounded" ? "22%" : "50%");

/**
 * The person's photo on the resume. Without an uploaded photo it shows their
 * initials (it used to show the same demo stranger on every CV).
 * In the editor, hovering shows "Change photo" / "Remove" (never printed).
 */
export default function ProfilePhoto({ onDark = false }: { onDark?: boolean }) {
  const { information, setInformations, fontOptions } = useDragDrop();
  const { data: session } = useSession();
  const { t } = useI18n();
  const input = useRef<HTMLInputElement>(null);

  const src = information?.picture?.label;
  const size = fontOptions.photoSize ?? PHOTO_DEFAULTS.size;
  const shape = fontOptions.photoShape ?? PHOTO_DEFAULTS.shape;
  const ring = fontOptions.photoRing ?? PHOTO_DEFAULTS.ring;
  const accent = fontOptions.secondColor || "#077a59";
  const name = [session?.user?.firstName, session?.user?.lastName].filter(Boolean).join(" ");
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "CV";

  const setPhoto = (label: string) =>
    setInformations((prev) => ({ ...prev, picture: { display: true, label } }));

  const pick = async (file?: File) => {
    if (!file) return;
    try {
      setPhoto(await fileToPhoto(file));
    } catch {
      /* invalid file: keep the current photo */
    }
  };

  const style: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: radius(shape),
    boxShadow: ring ? `0 0 0 3px ${onDark ? "rgba(255,255,255,0.9)" : "#fff"}, 0 0 0 5px ${accent}` : undefined,
  };

  return (
    <div className="nr-hover relative inline-block shrink-0" style={{ width: size, height: size }}>
      {isPhoto(src) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name || t.editor.photo.alt} draggable={false} className="block size-full object-cover" style={style} />
      ) : (
        <div
          role="img"
          aria-label={name || t.editor.photo.alt}
          className="grid size-full place-items-center font-semibold"
          style={{ ...style, background: accent, color: "#fff", fontSize: size * 0.36, letterSpacing: "0.02em" }}
        >
          {initials}
        </div>
      )}

      <div className="nr-actions no-print -bottom-3 left-1/2" style={{ translate: "-50% 0" }}>
        <button type="button" className="nr-action" aria-label={t.editor.photo.change} title={t.editor.photo.change} onClick={() => input.current?.click()}>
          <ImageUp />
        </button>
        {isPhoto(src) && (
          <button type="button" className="nr-action" data-danger aria-label={t.editor.photo.remove} title={t.editor.photo.remove} onClick={() => setPhoto("")}>
            <Trash2 />
          </button>
        )}
      </div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          pick(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
