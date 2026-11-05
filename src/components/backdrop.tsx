import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { MeshGradient } from "@paper-design/shaders-react";
import { useTheme } from "@/lib/theme";
import { finePointer } from "@/lib/utils";

const PALETTES = {
  light: ["#f0fdf4", "#bbf7d0", "#4ade80", "#d9f99d", "#a7f3d0", "#ecfccb"],
  dark: ["#021a0f", "#064e3b", "#15803d", "#0b3b2e", "#365314", "#022c22"],
};

/** Animated WebGL mesh gradient (Paper Shaders) with a leaf-vein grid on top for the glass to bend. */
export function Backdrop() {
  const { theme } = useTheme();
  const [still, setStill] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    setStill(mq.matches);
    const on = () => setStill(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* CSS blobs paint first, so there is colour even if WebGL is unavailable */}
      <div className="absolute -top-[20vh] -left-[10vw] size-[60vw] rounded-full bg-[var(--blob-1)] blur-[100px]" />
      <div className="absolute bottom-[-25vh] right-[0vw] size-[50vw] rounded-full bg-[var(--blob-2)] blur-[110px]" />
      <MeshGradient
        key={theme}
        colors={PALETTES[theme]}
        distortion={0.85}
        swirl={0.55}
        grainMixer={0}
        grainOverlay={0.06}
        speed={still || !finePointer ? 0 : 0.22}
        minPixelRatio={1}
        maxPixelCount={finePointer ? 1280 * 720 : 480 * 800}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
      {/* soften the middle so text stays readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,var(--background)_0%,transparent_100%)] opacity-60 dark:opacity-50" />
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_80%)]" />
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
