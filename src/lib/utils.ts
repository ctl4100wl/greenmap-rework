import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Lowercase and strip Vietnamese diacritics so "bang lang" matches "Bằng lăng". */
export function fold(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d");
}

/** Site root URL without the hash — QR codes point at `${baseURL()}#/cay/<slug>`. */
export const baseURL = () => location.href.split("#")[0];

/** Mouse-driven device. Phones skip the GPU-heavy effects (live blur animation, lens filter, moving shader). */
export const finePointer = typeof matchMedia !== "undefined" && matchMedia("(hover: hover) and (pointer: fine)").matches;

/** Animated blur for motion props; nothing on phones. */
export const soft = (px: number) => (finePointer ? { filter: `blur(${px}px)` } : {});
