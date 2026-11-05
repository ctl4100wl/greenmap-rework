import { Fragment, useId, useLayoutEffect, useRef, useState, type ComponentProps, type ElementType, type ReactNode } from "react";
import { cn, finePointer } from "@/lib/utils";

/*
 * Liquid glass: the backdrop is run through an SVG filter whose displacement map is a lens
 * profile drawn for this element's exact size and corner radius. Near the rim the backdrop is
 * pulled inward (magnified, like the curved edge of a glass slab), the centre stays clear, and
 * the R/G/B channels are displaced by slightly different amounts for a prism fringe.
 *
 * SVG filters inside backdrop-filter only render in Chromium; other browsers get frosted glass.
 */

const supportsSvgBackdrop =
  finePointer &&
  typeof navigator !== "undefined" && /Chrome\/|Chromium\//.test(navigator.userAgent) && !/Firefox\//.test(navigator.userAgent);

const mapCache = new Map<string, string>();

// keep only R, only G, only B — added back together after each is displaced differently
const CHANNEL = [
  "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0",
  "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0",
  "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0",
];

/** Encode the inward refraction vector for every pixel into R (x) and G (y), 128 = no shift. */
function lensMap(w: number, h: number, r: number, bezel: number) {
  const key = `${w}x${h}x${r}x${bezel}`;
  const hit = mapCache.get(key);
  if (hit) return hit;

  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  const d = img.data;
  const hx = w / 2;
  const hy = h / 2;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // signed distance to a rounded rect (negative inside)
      const px = x + 0.5 - hx;
      const py = y + 0.5 - hy;
      const qx = Math.abs(px) - (hx - r);
      const qy = Math.abs(py) - (hy - r);
      const ox = Math.max(qx, 0);
      const oy = Math.max(qy, 0);
      const sd = Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - r;
      const depth = -sd; // distance in from the edge

      let nx = 0;
      let ny = 0;
      let m = 0;
      if (depth < bezel) {
        // outward normal of the rounded rect, flipped to point inward
        if (qx > 0 && qy > 0) {
          const l = Math.hypot(ox, oy) || 1;
          nx = ox / l;
          ny = oy / l;
        } else if (qx > qy) nx = 1;
        else ny = 1;
        nx *= -Math.sign(px) || 0;
        ny *= -Math.sign(py) || 0;
        // circular-arc lens profile: gentle inside, steep at the rim
        const t = 1 - Math.max(depth, 0) / bezel;
        m = 1 - Math.sqrt(Math.max(0, 1 - t * t));
      }
      const i = (y * w + x) * 4;
      d[i] = 128 + 127 * m * nx;
      d[i + 1] = 128 + 127 * m * ny;
      d[i + 2] = 128;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const url = cv.toDataURL();
  if (mapCache.size > 40) mapCache.clear();
  mapCache.set(key, url);
  return url;
}

type Props<T extends ElementType> = {
  as?: T;
  children?: ReactNode;
  className?: string;
  /** Width of the curved rim in px. */
  bezel?: number;
  /** Maximum backdrop shift in px at the very edge. */
  strength?: number;
  /** Backdrop blur in px — keeps text on the glass readable. */
  frost?: number;
  /** Extra prism split between channels (0 = none). */
  dispersion?: number;
} & Omit<ComponentProps<T>, "as" | "children" | "className">;

export function LiquidGlass<T extends ElementType = "div">({
  as,
  children,
  className,
  bezel = 18,
  strength = 44,
  frost = 2.5,
  dispersion = 0.05,
  ...rest
}: Props<T>) {
  const Comp = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const id = "lg" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const [box, setBox] = useState<{ w: number; h: number; r: number } | null>(null);

  useLayoutEffect(() => {
    if (!supportsSvgBackdrop) return;
    const el = ref.current!;
    const measure = () => {
      const w = Math.round(el.offsetWidth);
      const h = Math.round(el.offsetHeight);
      if (!w || !h) return;
      const r = Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, w / 2, h / 2);
      setBox((b) => (b && b.w === w && b.h === h && b.r === r ? b : { w, h, r }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const map = box && lensMap(box.w, box.h, box.r, Math.min(bezel, box.h / 2, box.w / 2));

  return (
    <Comp ref={ref} className={cn("liquid-glass relative isolate", className)} {...rest}>
      <span
        aria-hidden
        className="liquid-glass__lens"
        style={map ? { backdropFilter: `url(#${id}) saturate(1.7) brightness(var(--lg-bright))` } : undefined}
      />
      <span aria-hidden className="liquid-glass__rim" />
      {children}
      {map && box && (
        <svg width="0" height="0" className="absolute" aria-hidden>
          <filter id={id} x="0" y="0" width={box.w} height={box.h} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation={frost} result="src" />
            <feImage href={map} x="0" y="0" width={box.w} height={box.h} result="raw" preserveAspectRatio="none" />
            <feGaussianBlur in="raw" stdDeviation="2" result="lens" />
            {[0, 1, 2].map((c) => (
              // Fragment, not <g>: filter primitives must be direct children of <filter>
              <Fragment key={c}>
                <feDisplacementMap in="src" in2="lens" scale={strength * (1 + dispersion * c)} xChannelSelector="R" yChannelSelector="G" result={`d${c}`} />
                <feColorMatrix in={`d${c}`} type="matrix" values={CHANNEL[c]} result={`c${c}`} />
              </Fragment>
            ))}
            {/* add the three channels back together (feBlend screen washes out in Chromium) */}
            <feComposite in="c0" in2="c1" operator="arithmetic" k2="1" k3="1" result="rg" />
            <feComposite in="rg" in2="c2" operator="arithmetic" k2="1" k3="1" result="rgb" />
            {/* feDisplacementMap samples nearest-neighbour, which stair-steps curves; this smooths it */}
            <feGaussianBlur in="rgb" stdDeviation="0.9" />
          </filter>
        </svg>
      )}
    </Comp>
  );
}
