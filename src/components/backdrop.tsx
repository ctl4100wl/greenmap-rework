import { motion, useScroll, useSpring } from "motion/react";

/** Fixed aurora blobs + faint grid behind every page. */
export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
      <div className="absolute -top-[20vh] -left-[10vw] size-[60vw] max-w-[820px] max-h-[820px] rounded-full bg-[var(--blob-1)] blur-[100px] animate-[blob_22s_ease-in-out_infinite]" />
      <div className="absolute top-[10vh] -right-[15vw] size-[50vw] max-w-[700px] max-h-[700px] rounded-full bg-[var(--blob-2)] blur-[110px] animate-[blob_28s_ease-in-out_infinite_reverse]" />
      <div className="absolute bottom-[-25vh] left-[25vw] size-[45vw] max-w-[640px] max-h-[640px] rounded-full bg-[var(--blob-3)] blur-[120px] animate-[blob_32s_ease-in-out_infinite]" />
      {/* film grain keeps big gradients from banding */}
      <svg className="absolute inset-0 size-full opacity-[0.035] mix-blend-overlay dark:opacity-[0.06]">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX }}
      className="noprint fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-emerald-500 via-green-400 to-lime-400"
    />
  );
}

export function LeafLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 21c0-6 3-10 8-12-1 7-4 10-8 12z" />
      <path d="M12 21C9 16 5 14 2 14c2 5 6 7 10 7z" />
    </svg>
  );
}
