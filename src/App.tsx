import { soft } from "@/lib/utils";
import { lazy, Suspense, useEffect, type ReactNode } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { Toaster } from "sonner";
import { Backdrop, LeafLogo, ScrollProgress } from "@/components/backdrop";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { CommandMenu } from "@/components/command-menu";
import { ScannerDialog } from "@/components/scanner-dialog";
import { DataProvider, useSiteData } from "@/lib/data";
import { ThemeProvider, useTheme } from "@/lib/theme";
import { UIProvider } from "@/lib/ui";
import HomePage from "@/pages/home";
import TreePage from "@/pages/tree";
import { AboutPage, GuidePage, TreesPage } from "@/pages/content";

// Hidden tool pages load on demand so visitors never download them.
const QRPage = lazy(() => import("@/pages/qr"));
const AdminPage = lazy(() => import("@/pages/admin"));
const AssetsPage = lazy(() => import("@/pages/admin").then((m) => ({ default: m.AssetsPage })));

const TITLES: Record<string, string> = {
  "/": "Green Map",
  "/huong-dan": "Hướng dẫn — Green Map",
  "/danh-sach": "Danh sách cây — Green Map",
  "/du-an": "Về dự án — Green Map",
  "/qr": "Tạo mã QR — Green Map",
  "/aadmin": "Quản trị — Green Map",
  "/assets": "Quản lý ảnh — Green Map",
};

function Page({ children }: { children: ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 14, ...soft(10) }}
      animate={{ opacity: 1, y: 0, ...soft(0) }}
      exit={{ opacity: 0, y: -8, ...soft(10) }}
      transition={{ duration: 0.45, ease: [0.22, 0.9, 0.3, 1] }}
      className="min-h-[60vh]"
    >
      {children}
    </motion.main>
  );
}

function Shell() {
  const location = useLocation();
  const { data } = useSiteData();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const p = location.pathname;
    const tree = p.startsWith("/cay/") && data?.trees.find((t) => t.slug === p.slice(5));
    document.title = tree ? `${tree.name} — Green Map` : (TITLES[p] ?? "Green Map");
  }, [location.pathname, data]);

  return (
    <>
      <SiteHeader />
      <AnimatePresence mode="wait">
        <Page key={location.pathname}>
          <Suspense fallback={<div className="min-h-[60vh]" />}>
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/huong-dan" element={<GuidePage />} />
              <Route path="/danh-sach" element={<TreesPage />} />
              <Route path="/du-an" element={<AboutPage />} />
              <Route path="/cay/:slug" element={<TreePage />} />
              <Route path="/qr" element={<QRPage />} />
              <Route path="/aadmin" element={<AdminPage />} />
              <Route path="/assets" element={<AssetsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Page>
      </AnimatePresence>
      <SiteFooter />
      <CommandMenu />
      <ScannerDialog />
    </>
  );
}

function Gate() {
  const { data, error } = useSiteData();
  const { theme } = useTheme();
  return (
    <>
      <Backdrop />
      <ScrollProgress />
      <Toaster position="bottom-center" theme={theme} toastOptions={{ className: "!rounded-full !font-semibold" }} />
      {data ? (
        <Shell />
      ) : (
        <div className="grid min-h-dvh place-items-center">
          <div className="flex flex-col items-center gap-4 text-primary">
            <LeafLogo className="size-12 animate-pulse" />
            {error && <p className="text-muted-foreground">Không tải được dữ liệu. Vui lòng tải lại trang.</p>}
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <UIProvider>
          <HashRouter>
            <Gate />
          </HashRouter>
        </UIProvider>
      </DataProvider>
    </ThemeProvider>
  );
}
