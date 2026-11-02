import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Tree = {
  slug: string;
  name: string;
  sci: string;
  family: string;
  alias: string;
  imgs: string[];
  desc: string;
  uses: string;
  eco: string;
  fun: string;
  funLabel: string;
};

export type SiteData = {
  brand: string;
  footer: string;
  font?: string;
  hero: { image: string; h1: string; h2: string; school: string; lead: string; cta: string };
  guide: string[];
  guideImage: string;
  about: string;
  credits: string[];
  tech: string;
  trees: Tree[];
};

/** Accept older data.json shapes (about as {mission}, missing arrays) so uploads never break the site. */
export function normalize(raw: any): SiteData {
  const d = { ...raw };
  if (d.about && typeof d.about === "object") d.about = d.about.mission ?? "";
  d.about ??= "";
  d.credits ??= [];
  d.tech ??= "";
  d.guide ??= [];
  d.guideImage ??= "";
  d.trees = (d.trees ?? []).map((t: any) => ({
    slug: "", name: "", sci: "", family: "", alias: "", desc: "", uses: "", eco: "", fun: "", funLabel: "",
    ...t,
    imgs: t.imgs ?? [],
  }));
  delete d.pages;
  return d as SiteData;
}

type Ctx = {
  data: SiteData | null;
  error: boolean;
  /** Swap the live data in memory — used by the admin "preview" button. */
  setData: (d: SiteData) => void;
};

const DataContext = createContext<Ctx>({ data: null, error: false, setData: () => {} });

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`data.json?v=${Date.now()}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j) => setData(normalize(j)))
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    if (data?.font) document.documentElement.style.setProperty("--site-font", data.font);
  }, [data?.font]);

  return <DataContext.Provider value={{ data, error, setData }}>{children}</DataContext.Provider>;
}

export const useSiteData = () => useContext(DataContext);

/** Only call inside routes rendered after data has loaded. */
export function useData() {
  const { data } = useContext(DataContext);
  if (!data) throw new Error("data not loaded");
  return data;
}

/* ---------- admin draft, stored in the same key the old site used ---------- */
export const DRAFT_KEY = "greenmap-draft";
export const loadDraft = (): SiteData | null => {
  try {
    const s = localStorage.getItem(DRAFT_KEY);
    return s ? normalize(JSON.parse(s)) : null;
  } catch {
    return null;
  }
};
export const saveDraft = (d: SiteData) => {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
  } catch {}
};
export const clearDraft = () => {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {}
};
