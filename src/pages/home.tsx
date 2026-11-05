import { soft } from "@/lib/utils";
import { useRef } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRightIcon, ListTreeIcon, MapPinIcon, QrCodeIcon, SparklesIcon, TreesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/primitives";
import { Reveal, TreeCard } from "@/components/common";
import { LeafLogo } from "@/components/backdrop";
import { useData } from "@/lib/data";
import { useUI } from "@/lib/ui";

const rise = (i: number) => ({
  initial: { opacity: 0, y: 24, ...soft(10) },
  animate: { opacity: 1, y: 0, ...soft(0) },
  transition: { duration: 0.8, delay: 0.1 + i * 0.08, ease: [0.22, 0.9, 0.3, 1] as const },
});

export default function HomePage() {
  const data = useData();
  const { setScanOpen } = useUI();
  const h = data.hero;
  const families = new Set(data.trees.map((t) => t.family).filter(Boolean)).size;

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section ref={heroRef} className="relative mx-auto max-w-6xl px-4 pt-8 sm:px-6 md:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <div className="relative z-10 text-center lg:text-left">
            <motion.div {...rise(0)} className="mb-6 flex justify-center lg:justify-start">
              <Badge variant="glass" size="lg" className="pl-1.5">
                <span className="grid size-6 place-items-center rounded-full bg-primary text-primary-foreground">
                  <MapPinIcon className="size-3.5!" />
                </span>
                {h.school}
              </Badge>
            </motion.div>

            <motion.h1
              {...rise(1)}
              className="text-gradient text-[clamp(3.2rem,9vw,6.5rem)] leading-[0.92] font-black tracking-[-0.04em]"
            >
              {h.h1}
            </motion.h1>
            <motion.h2
              {...rise(2)}
              className="mt-4 text-[clamp(1rem,2.2vw,1.6rem)] leading-tight font-extrabold tracking-tight text-heading uppercase"
            >
              {h.h2}
            </motion.h2>
            <motion.p {...rise(3)} className="mx-auto mt-5 max-w-[30em] text-[clamp(15px,1.3vw,18px)] text-muted-foreground lg:mx-0">
              {h.lead}
            </motion.p>
            <motion.div {...rise(4)} className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Button variant="glow" size="xl" onClick={() => setScanOpen(true)}>
                {h.cta}
              </Button>
              <Button variant="secondary" size="xl" asChild>
                <Link to="/danh-sach">
                  <ListTreeIcon /> Danh sách cây
                </Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, ...soft(16) }}
            animate={{ opacity: 1, scale: 1, ...soft(0) }}
            transition={{ duration: 1.1, ease: [0.22, 0.9, 0.3, 1] }}
            className="relative"
          >
            {/* glow halo */}
            <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-tr from-emerald-400/40 via-lime-300/30 to-teal-300/30 blur-3xl dark:from-emerald-500/25 dark:via-lime-400/10 dark:to-teal-500/20" />
            <div className="glass-card relative overflow-hidden rounded-[2.25rem] p-2">
              <div className="relative aspect-[4/3.4] overflow-hidden rounded-[1.75rem] lg:aspect-[4/4.4]">
                <motion.img
                  style={{ y: photoY, scale: photoScale }}
                  src={h.image}
                  alt={`Trường ${h.school}`}
                  className="absolute inset-0 size-full object-cover object-[70%_center]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              </div>
            </div>

            {/* floating glass stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="glass absolute -bottom-5 -left-3 flex items-center gap-3 rounded-2xl px-4 py-3 sm:-left-8"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/40">
                <TreesIcon className="size-5" />
              </span>
              <div className="text-left leading-tight">
                <div className="text-2xl font-black text-heading">{data.trees.length}</div>
                <div className="text-xs font-medium text-muted-foreground">loài cây</div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.85, duration: 0.7 }}
              className="glass absolute top-6 -right-3 flex items-center gap-3 rounded-2xl px-4 py-3 sm:-right-6"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-foreground text-background">
                <QrCodeIcon className="size-5" />
              </span>
              <div className="text-left text-xs leading-tight font-semibold text-muted-foreground">
                Quét QR
                <br />
                <span className="text-foreground">trên từng cây</span>
              </div>
            </motion.div>
            <LeafLogo className="absolute -top-8 -left-6 size-20 animate-[sway_7s_ease-in-out_infinite] text-primary/30 sm:size-28" />
          </motion.div>
        </div>
      </section>

      {/* ---------------- MARQUEE ---------------- */}
      <section className="relative mt-20 overflow-hidden py-4 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-[marquee_45s_linear_infinite] gap-3 hover:[animation-play-state:paused]">
          {[...data.trees, ...data.trees].map((t, i) => (
            <Link
              key={i}
              to={`/cay/${t.slug}`}
              className="glass-lite flex items-center gap-3 rounded-full py-1.5 pr-5 pl-1.5 transition hover:scale-105"
            >
              <img src={t.imgs[0]} alt="" className="size-9 rounded-full object-cover" loading="lazy" />
              <span className="font-semibold whitespace-nowrap">{t.name}</span>
              <span className="text-sm whitespace-nowrap text-muted-foreground italic">{t.sci}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------- BENTO ---------------- */}
      <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Reveal>
              <h3 className="text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">Có gì trong trường?</h3>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mt-2 text-muted-foreground">{data.trees.length} loài cây đã được ghi nhận và gắn mã QR.</p>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <Button variant="secondary" asChild>
              <Link to="/danh-sach" className="group">
                Xem tất cả
                <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </Reveal>
        </div>

        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.trees.slice(0, 4).map((t, i) => (
            <TreeCard key={t.slug} tree={t} index={i} large={i === 0} />
          ))}
          <Reveal className="sm:col-span-2" delay={0.2}>
            <div className="glass-card relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-6">
              <div className="absolute -top-16 -right-16 size-48 rounded-full bg-primary/25 blur-3xl" />
              <SparklesIcon className="size-7 text-primary" />
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  [data.trees.length, "loài cây"],
                  [families, "họ thực vật"],
                  [data.trees.reduce((n, t) => n + t.imgs.length, 0), "hình ảnh"],
                ].map(([n, l]) => (
                  <div key={l}>
                    <div className="text-4xl font-black tracking-tight text-heading">{n}</div>
                    <div className="text-sm text-muted-foreground">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {data.guide.map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="glass-card group relative h-full overflow-hidden rounded-3xl p-6 transition duration-500 hover:-translate-y-1">
                <span aria-hidden className="absolute -top-4 -right-1 text-[7rem] leading-none font-black text-primary/[0.07] transition group-hover:text-primary/15">
                  {i + 1}
                </span>
                <span className="grid size-10 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30">
                  {i + 1}
                </span>
                <p className="relative mt-4 font-medium">{s}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
