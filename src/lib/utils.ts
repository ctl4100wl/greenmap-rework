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
