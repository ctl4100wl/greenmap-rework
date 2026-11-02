import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { MenuIcon, MoonIcon, ScanLineIcon, SearchIcon, SunIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/primitives";
import { LeafLogo } from "@/components/backdrop";
import { useData } from "@/lib/data";
import { useTheme } from "@/lib/theme";
import { useUI } from "@/lib/ui";
import { cn } from "@/lib/utils";

export const NAV = [
  { to: "/", label: "Trang chủ" },
  { to: "/huong-dan", label: "Hướng dẫn" },
  { to: "/danh-sach", label: "Danh sách cây" },
  { to: "/du-an", label: "Về dự án" },
];

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}
      onClick={(e) => toggle({ x: e.clientX, y: e.clientY })}
      className="overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: -20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.25 }}
        >
          {theme === "dark" ? <MoonIcon className="size-[18px]" /> : <SunIcon className="size-[18px]" />}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}

export function SiteHeader() {
  const data = useData();
  const { setScanOpen, setSearchOpen } = useUI();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const on = () => setStuck(scrollY > 8);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  const active = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to) || (to === "/danh-sach" && pathname.startsWith("/cay/"));

  return (
    <header className="noprint sticky top-0 z-50 px-3 pt-3 sm:px-5">
      <div
        className={cn(
          "glass relative mx-auto flex h-16 max-w-6xl items-center gap-2 rounded-full px-3 pl-5 transition-shadow duration-500 ease-out-expo",
          stuck && "shadow-2xl",
        )}
      >
        <Link to="/" className="group flex shrink-0 items-center gap-2.5 font-extrabold tracking-wide text-primary">
          <span className="grid size-9 place-items-center rounded-full bg-primary/12 ring-1 ring-primary/20 transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110">
            <LeafLogo className="size-5" />
          </span>
          <span className="text-[17px] whitespace-nowrap">{data.brand}</span>
        </Link>

        <nav className="relative mx-auto hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                active(n.to) ? "text-primary-foreground" : "text-foreground/70 hover:text-foreground",
              )}
            >
              {active(n.to) && (
                <motion.span
                  layoutId="nav-pill"
                  className="liquid-drop absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{n.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-0 sm:gap-1 md:ml-0">
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden h-10 cursor-pointer items-center gap-2 rounded-full border border-border bg-background/40 pr-2 pl-3.5 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-foreground lg:flex"
          >
            <SearchIcon className="size-4" />
            <span className="pr-6">Tìm cây…</span>
            <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
            <Kbd>K</Kbd>
          </button>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Tìm cây" onClick={() => setSearchOpen(true)}>
            <SearchIcon className="size-[18px]" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Quét mã QR" onClick={() => setScanOpen(true)}>
            <ScanLineIcon className="size-[18px]" />
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
            {open ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -10, scale: 0.98, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, scale: 0.98, filter: "blur(6px)" }}
            transition={{ duration: 0.25 }}
            className="glass-strong absolute inset-x-3 top-[84px] flex flex-col gap-1 rounded-3xl p-2 shadow-2xl md:hidden"
          >
            {NAV.map((n, i) => (
              <motion.div key={n.to} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                <NavLink
                  to={n.to}
                  className={cn(
                    "block rounded-2xl px-4 py-3 font-semibold transition",
                    active(n.to) ? "bg-primary text-primary-foreground" : "hover:bg-foreground/5",
                  )}
                >
                  {n.label}
                </NavLink>
              </motion.div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export function SiteFooter() {
  const data = useData();
  return (
    <footer className="noprint mt-24 px-3 pb-6 sm:px-5">
      <div className="glass relative mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 rounded-3xl px-6 py-6 text-sm sm:flex-row">
        <div className="flex items-center gap-2.5 font-bold text-primary">
          <LeafLogo className="size-5" />
          {data.brand}
        </div>
        <p className="text-center text-muted-foreground">{data.footer}</p>
        <nav className="flex gap-4 text-muted-foreground">
          {NAV.slice(1).map((n) => (
            <Link key={n.to} to={n.to} className="transition hover:text-primary">
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
