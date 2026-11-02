import { useRef, type ReactNode } from "react";
import { Link } from "react-router";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { ArrowUpRightIcon, TreesIcon } from "lucide-react";
import type { Tree } from "@/lib/data";
import { cn } from "@/lib/utils";

/** Fade + blur + rise as the element scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 18,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 0.9, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function PageHeader({ eyebrow, title, sub }: { eyebrow?: ReactNode; title: string; sub?: ReactNode }) {
  return (
    <div className="mb-10 sm:mb-14">
      {eyebrow && (
        <Reveal>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-bold tracking-wider text-primary uppercase">
            {eyebrow}
          </div>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h1 className="text-4xl leading-[1.1] font-extrabold tracking-tight text-heading sm:text-5xl md:text-6xl">
          {title}
        </h1>
      </Reveal>
      {sub && (
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

/** Mouse-tracking spotlight that lights up a card's border and surface. */
export function Spotlight({ className, children }: { className?: string; children: ReactNode }) {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const ref = useRef<HTMLDivElement>(null);
  const bg = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, color-mix(in oklch, var(--primary) 22%, transparent), transparent 65%)`;
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      onPointerLeave={() => {
        x.set(-400);
        y.set(-400);
      }}
      className={cn("group/spot relative", className)}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{ background: bg }}
      />
      {children}
    </div>
  );
}

export function TreeImage({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  if (!src)
    return (
      <div className={cn("grid place-items-center bg-primary/8 text-primary/50", className)}>
        <TreesIcon className="size-10" />
      </div>
    );
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      onError={(e) => e.currentTarget.removeAttribute("src")}
    />
  );
}

export function TreeCard({ tree, index = 0, large = false }: { tree: Tree; index?: number; large?: boolean }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: Math.min(index, 8) * 0.05, ease: [0.22, 0.9, 0.3, 1] }}
      className={cn("h-full", large && "sm:col-span-2 sm:row-span-2")}
    >
      <Spotlight className="h-full rounded-3xl">
        <Link
          to={`/cay/${tree.slug}`}
          className="glass-card group relative flex h-full flex-col overflow-hidden rounded-3xl p-2 transition-all duration-500 ease-out-expo hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/15"
        >
          <div className={cn("relative overflow-hidden rounded-[20px]", large ? "aspect-[4/3] sm:aspect-auto sm:flex-1" : "aspect-[4/3]")}>
            <TreeImage
              src={tree.imgs[0]}
              alt={tree.name}
              className="size-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.07]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="glass absolute top-3 right-3 grid size-9 translate-y-1 place-items-center rounded-full text-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <ArrowUpRightIcon className="size-4" />
            </span>
            {tree.imgs.length > 1 && (
              <span className="absolute bottom-3 left-3 rounded-full bg-black/35 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-md">
                {tree.imgs.length} ảnh
              </span>
            )}
          </div>
          <div className="flex items-end justify-between gap-3 px-3 pt-3.5 pb-2">
            <div className="min-w-0">
              <h4 className={cn("truncate font-bold text-heading", large ? "text-2xl" : "text-[17px]")}>{tree.name}</h4>
              <small className="block truncate text-sm text-muted-foreground italic">{tree.sci || "—"}</small>
            </div>
          </div>
        </Link>
      </Spotlight>
    </motion.div>
  );
}
