import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  GlobeIcon,
  LeafIcon,
  MapPinIcon,
  SearchIcon,
  ShoppingBasketIcon,
  SparklesIcon,
  TagIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import { Reveal, Spotlight, TreeImage } from "@/components/common";
import { useData, type Tree } from "@/lib/data";
import { cn } from "@/lib/utils";

function Gallery({ tree }: { tree: Tree }) {
  const [[i, dir], set] = useState<[number, number]>([0, 0]);
  const n = tree.imgs.length;
  const go = (k: number, d: number) => set([(k + n) % n, d]);

  useEffect(() => set([0, 0]), [tree.slug]);
  useEffect(() => {
    if (n < 2) return;
    const on = (e: KeyboardEvent) => {
      if (/^(INPUT|TEXTAREA)$/.test((e.target as HTMLElement).tagName) || document.querySelector("[role=dialog]")) return;
      if (e.key === "ArrowLeft") (go(i - 1, -1), e.preventDefault());
      if (e.key === "ArrowRight") (go(i + 1, 1), e.preventDefault());
    };
    addEventListener("keydown", on);
    return () => removeEventListener("keydown", on);
  });

  if (!n) return null;
  return (
    <div className="grid gap-3">
      <div className="relative">
        {/* ambient glow: a blurred copy of the current photo */}
        <img src={tree.imgs[i]} alt="" aria-hidden className="absolute inset-4 -z-10 size-[calc(100%-2rem)] scale-105 rounded-[2rem] object-cover opacity-60 blur-3xl saturate-150 dark:opacity-40" />
        <div className="glass-card group relative overflow-hidden rounded-[2rem] p-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem] bg-primary/5">
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.img
                key={i}
                src={tree.imgs[i]}
                alt={tree.name}
                custom={dir}
                variants={{
                  enter: (d: number) => ({ x: d * 60, opacity: 0, scale: 1.04, filter: "blur(12px)" }),
                  center: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)" },
                  exit: (d: number) => ({ x: d * -60, opacity: 0, filter: "blur(12px)" }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.22, 0.9, 0.3, 1] }}
                drag={n > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) go(i + 1, 1);
                  else if (info.offset.x > 60) go(i - 1, -1);
                }}
                className="absolute inset-0 size-full cursor-grab object-cover active:cursor-grabbing"
              />
            </AnimatePresence>
            {n > 1 && (
              <>
                {[
                  { d: -1, cls: "left-3", Icon: ChevronLeftIcon, label: "Ảnh trước" },
                  { d: 1, cls: "right-3", Icon: ChevronRightIcon, label: "Ảnh sau" },
                ].map(({ d, cls, Icon, label }) => (
                  <button
                    key={d}
                    onClick={() => go(i + d, d)}
                    aria-label={label}
                    className={cn(
                      "glass absolute top-1/2 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-foreground transition-all duration-300 hover:scale-110 md:opacity-0 md:group-hover:opacity-100",
                      cls,
                    )}
                  >
                    <Icon className="size-5" />
                  </button>
                ))}
                <span className="absolute right-3 bottom-3 rounded-full bg-black/40 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                  {i + 1}/{n}
                </span>
                <div className="absolute bottom-3.5 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {tree.imgs.map((_, k) => (
                    <span key={k} className={cn("h-1.5 rounded-full bg-white transition-all duration-500", k === i ? "w-6" : "w-1.5 opacity-50")} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {n > 1 && (
        <div className="flex flex-wrap items-center gap-2.5">
          {tree.imgs.map((src, k) => (
            <button
              key={src + k}
              onClick={() => go(k, k > i ? 1 : -1)}
              className={cn(
                "relative h-16 w-20 cursor-pointer overflow-hidden rounded-xl ring-2 transition-all duration-300 sm:h-[68px] sm:w-[90px]",
                k === i ? "ring-primary" : "opacity-60 ring-transparent hover:-translate-y-0.5 hover:opacity-100",
              )}
            >
              <img src={src} alt="" className="size-full object-cover" onError={(e) => e.currentTarget.parentElement?.remove()} />
            </button>
          ))}
          <span className="ml-1 hidden text-xs text-muted-foreground sm:block">Dùng phím ← → để xem ảnh khác</span>
        </div>
      )}
    </div>
  );
}

function InfoBox({
  icon: Icon,
  title,
  text,
  className,
  tone = "default",
  delay = 0,
}: {
  icon: typeof LeafIcon;
  title: string;
  text: string;
  className?: string;
  tone?: "default" | "fun";
  delay?: number;
}) {
  if (!text) return null;
  return (
    <Reveal className={className} delay={delay}>
      <Spotlight className="h-full rounded-3xl">
        <div
          className={cn(
            "glass-card relative h-full overflow-hidden rounded-3xl p-6 sm:p-7",
            tone === "fun" && "bg-gradient-to-br from-primary/15 via-transparent to-lime-400/10",
          )}
        >
          {tone === "fun" && <div className="absolute -top-20 -right-10 size-56 rounded-full bg-lime-400/20 blur-3xl" />}
          <h4 className="relative flex items-center gap-3 text-sm font-bold tracking-wider text-primary uppercase">
            <span className="grid size-9 place-items-center rounded-xl bg-primary/12">
              <Icon className="size-[18px]" />
            </span>
            {title}
          </h4>
          <p className="relative mt-4 text-[17px] leading-relaxed">{text}</p>
        </div>
      </Spotlight>
    </Reveal>
  );
}

export default function TreePage() {
  const data = useData();
  const { slug } = useParams();
  const idx = data.trees.findIndex((t) => t.slug === slug);
  if (idx < 0) return <Navigate to="/" replace />;

  const t = data.trees[idx];
  const prev = data.trees[(idx - 1 + data.trees.length) % data.trees.length];
  const next = data.trees[(idx + 1) % data.trees.length];

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 md:pt-12">
      <Reveal>
        <Link to="/danh-sach" className="group mb-8 inline-flex items-center gap-2 rounded-full py-1 pr-3 font-semibold text-primary">
          <ArrowLeftIcon className="size-4 transition-transform group-hover:-translate-x-1" />
          Danh sách cây
        </Link>
      </Reveal>

      <div className={cn("grid items-center gap-8 lg:gap-12", t.imgs.length && "lg:grid-cols-[1fr_1.15fr]")}>
        <div className="order-2 lg:order-1">
          <Reveal delay={0.05}>
            <h1 className="text-[clamp(2.4rem,6vw,4.2rem)] leading-[1.02] font-black tracking-tight text-heading">{t.name}</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-2 text-xl text-muted-foreground italic">{t.sci || "Đang cập nhật tên khoa học"}</div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-6 flex flex-wrap gap-2">
              {t.family && <Badge size="lg"><LeafIcon /> {t.family}</Badge>}
              {t.alias && <Badge size="lg"><TagIcon /> {t.alias}</Badge>}
              <Badge size="lg" variant="glass"><MapPinIcon className="text-primary" /> {data.hero.school}</Badge>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 hidden max-w-lg text-lg leading-relaxed text-muted-foreground lg:block">{t.desc}</p>
          </Reveal>
        </div>
        <div className="order-1 lg:order-2">
          <Gallery tree={t} />
        </div>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <InfoBox icon={SearchIcon} title="Đặc điểm nhận biết" text={t.desc} className="md:col-span-2" />
        <InfoBox icon={ShoppingBasketIcon} title="Công dụng" text={t.uses} delay={0.05} className={cn(!t.eco && "md:col-span-2")} />
        <InfoBox icon={GlobeIcon} title="Giá trị sinh thái" text={t.eco} delay={0.1} />
        <InfoBox icon={SparklesIcon} title={t.funLabel || "Điều thú vị"} text={t.fun} tone="fun" className="md:col-span-2" delay={0.1} />
      </div>

      <nav className="mt-12 grid gap-4 sm:grid-cols-2">
        {[
          { tree: prev, dir: "prev" as const },
          { tree: next, dir: "next" as const },
        ].map(({ tree, dir }) => (
          <Link
            key={dir}
            to={`/cay/${tree.slug}`}
            className={cn(
              "glass-card group flex items-center gap-4 rounded-3xl p-3 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10",
              dir === "next" && "flex-row-reverse text-right",
            )}
          >
            <TreeImage src={tree.imgs[0]} alt="" className="size-16 shrink-0 rounded-2xl object-cover" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider [.flex-row-reverse_&]:justify-end">
                {dir === "prev" ? <ArrowLeftIcon className="size-3.5 transition-transform group-hover:-translate-x-1" /> : null}
                {dir === "prev" ? "Trước" : "Tiếp"}
                {dir === "next" ? <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-1" /> : null}
              </div>
              <div className="truncate text-lg font-bold text-heading">{tree.name}</div>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
}
