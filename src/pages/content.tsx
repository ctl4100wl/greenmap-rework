import { useMemo, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { BookOpenIcon, CodeIcon, LeafIcon, ScanLineIcon, SearchIcon, UsersIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, Input } from "@/components/ui/primitives";
import { PageHeader, Reveal, TreeCard } from "@/components/common";
import { useData } from "@/lib/data";
import { useUI } from "@/lib/ui";
import { cn, fold } from "@/lib/utils";

const wrap = "mx-auto max-w-6xl px-4 pt-10 sm:px-6 md:pt-16";

/* ================= HƯỚNG DẪN ================= */
export function GuidePage() {
  const data = useData();
  const { setScanOpen } = useUI();
  return (
    <div className={wrap}>
      <PageHeader
        eyebrow={<><BookOpenIcon className="size-3.5" /> Hướng dẫn</>}
        title="Hướng dẫn"
        sub={`${data.guide.length} bước để tra cứu một cây trong trường.`}
      />
      <div className="grid items-start gap-8 lg:grid-cols-2">
        <ol className="relative space-y-4">
          <div className="absolute top-6 bottom-6 left-[27px] w-px bg-gradient-to-b from-primary/60 via-primary/30 to-transparent" />
          {data.guide.map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <li className="glass-card relative flex gap-4 rounded-3xl p-4 pr-6">
                <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full bg-primary font-bold text-primary-foreground shadow-lg shadow-primary/40">
                  {i + 1}
                </span>
                <p className="pt-1.5 text-[17px] font-medium">{s}</p>
              </li>
            </Reveal>
          ))}
          <Reveal delay={0.3}>
            <div className="flex flex-wrap gap-3 pt-2 pl-14">
              <Button variant="glow" onClick={() => setScanOpen(true)}>
                <ScanLineIcon /> Quét mã QR trên cây
              </Button>
              <Button variant="secondary" asChild>
                <Link to="/danh-sach">Danh sách cây</Link>
              </Button>
            </div>
          </Reveal>
        </ol>
        {data.guideImage && (
          <Reveal delay={0.15}>
            <div className="relative">
              <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-primary/20 blur-3xl" />
              <div className="glass-card overflow-hidden rounded-[2rem] p-2">
                <img src={data.guideImage} alt="Quét mã QR" className="w-full rounded-[1.6rem]" onError={(e) => e.currentTarget.remove()} />
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}

/* ================= DANH SÁCH CÂY ================= */
export function TreesPage() {
  const data = useData();
  const [q, setQ] = useState("");
  const [family, setFamily] = useState<string | null>(null);

  const families = useMemo(() => {
    const m = new Map<string, number>();
    data.trees.forEach((t) => t.family && m.set(t.family, (m.get(t.family) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [data.trees]);

  const list = useMemo(() => {
    const words = fold(q).split(/\s+/).filter(Boolean);
    return data.trees.filter((t) => {
      if (family && t.family !== family) return false;
      const hay = fold([t.name, t.sci, t.family, t.alias].join(" "));
      return words.every((w) => hay.includes(w));
    });
  }, [data.trees, q, family]);

  return (
    <div className={wrap}>
      <PageHeader
        eyebrow={<><LeafIcon className="size-3.5" /> {data.hero.school}</>}
        title="Danh sách cây"
        sub={`${data.trees.length} loài đã ghi nhận trong khuôn viên trường.`}
      />

      <Reveal delay={0.12}>
        <div className="glass relative z-30 mb-8 md:sticky md:top-[88px] flex flex-col gap-3 rounded-3xl p-3 md:flex-row md:items-start">
          <div className="relative shrink-0 md:w-72">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm theo tên…"
              className="rounded-full border-transparent bg-background/70 pl-10"
            />
            {q && (
              <button onClick={() => setQ("")} className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground" aria-label="Xoá">
                <XIcon className="size-4" />
              </button>
            )}
          </div>
          {/* wraps instead of scrolling sideways, so no family is ever cut off */}
          <div className="flex flex-wrap gap-1.5 md:pt-0.5">
            {[["", data.trees.length] as const, ...families].map(([f, n]) => {
              const on = (family ?? "") === f;
              return (
                <button
                  key={f || "all"}
                  onClick={() => setFamily(f || null)}
                  className={cn(
                    "relative shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors",
                    on ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {on && <motion.span layoutId="fam-pill" className="liquid-drop absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                  <span className="relative">
                    {f ? f.replace(/\s*\(.*\)/, "") : "Tất cả"} <span className="opacity-60">{n}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((t, i) => (
            <TreeCard key={t.slug} tree={t} index={i} instant />
          ))}
        </AnimatePresence>
      </div>
      {!list.length && (
        <div className="py-20 text-center text-muted-foreground">Không tìm thấy cây nào.</div>
      )}
    </div>
  );
}

/* ================= VỀ DỰ ÁN ================= */
export function AboutPage() {
  const data = useData();
  return (
    <div className={wrap}>
      <PageHeader
        eyebrow={<><LeafIcon className="size-3.5" /> {data.brand}</>}
        title="Về dự án"
        sub={`Số hoá cây xanh trong khuôn viên ${data.hero.school}.`}
      />
      <div className="grid gap-4 md:grid-cols-6">
        <Reveal className="md:col-span-6">
          <Card className="overflow-hidden p-8 sm:p-10">
            <div className="absolute -top-24 -right-24 size-72 rounded-full bg-primary/20 blur-3xl" />
            <p className="relative max-w-3xl text-xl leading-relaxed font-medium text-balance sm:text-2xl">{data.about}</p>
          </Card>
        </Reveal>
        {data.credits.length > 0 && (
          <Reveal className="md:col-span-3" delay={0.08}>
            <Card className="h-full p-7">
              <span className="grid size-11 place-items-center rounded-2xl bg-primary/12 text-primary">
                <UsersIcon className="size-5" />
              </span>
              <div className="mt-5 space-y-1.5 text-lg">
                {data.credits.map((c) => (
                  <p key={c}>{c}</p>
                ))}
              </div>
            </Card>
          </Reveal>
        )}
        {data.tech && (
          <Reveal className="md:col-span-3" delay={0.14}>
            <Card className="h-full p-7">
              <span className="grid size-11 place-items-center rounded-2xl bg-primary/12 text-primary">
                <CodeIcon className="size-5" />
              </span>
              <p className="mt-5 text-muted-foreground">{data.tech}</p>
            </Card>
          </Reveal>
        )}
      </div>
    </div>
  );
}
