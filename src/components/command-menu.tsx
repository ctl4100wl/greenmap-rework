import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Command } from "cmdk";
import { BookOpenIcon, HomeIcon, InfoIcon, ListTreeIcon, MoonIcon, ScanLineIcon, SearchIcon, TreesIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/primitives";
import { useData } from "@/lib/data";
import { useTheme } from "@/lib/theme";
import { useUI } from "@/lib/ui";
import { fold } from "@/lib/utils";

const item =
  "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm outline-none transition-colors data-[selected=true]:bg-primary/12 data-[selected=true]:text-foreground";
const group =
  "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground";

export function CommandMenu() {
  const data = useData();
  const { searchOpen, setSearchOpen, setScanOpen } = useUI();
  const { toggle } = useTheme();
  const nav = useNavigate();

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (e.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    addEventListener("keydown", on);
    return () => removeEventListener("keydown", on);
  }, [setSearchOpen]);

  const go = (fn: () => void) => {
    setSearchOpen(false);
    fn();
  };

  return (
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
      <DialogContent showClose={false} className="top-[18vh] max-w-xl translate-y-0 p-0">
        <DialogTitle className="sr-only">Tìm cây</DialogTitle>
        <Command
          loop
          filter={(value, search, keywords) => {
            const hay = fold([value, ...(keywords ?? [])].join(" "));
            return fold(search).split(/\s+/).every((w) => hay.includes(w)) ? 1 : 0;
          }}
        >
          <div className="flex items-center gap-3 border-b border-border px-4">
            <SearchIcon className="size-5 text-muted-foreground" />
            <Command.Input
              autoFocus
              placeholder="Tìm theo tên, tên khoa học, họ…"
              className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
            <Kbd>Esc</Kbd>
          </div>
          <Command.List className="max-h-[min(60vh,420px)] overflow-y-auto overscroll-contain p-2">
            <Command.Empty className="py-10 text-center text-sm text-muted-foreground">
              Không tìm thấy cây nào.
            </Command.Empty>
            <Command.Group heading={`Danh sách cây (${data.trees.length})`} className={group}>
              {data.trees.map((t) => (
                <Command.Item
                  key={t.slug}
                  value={t.slug}
                  keywords={[t.name, t.sci, t.family, t.alias]}
                  onSelect={() => go(() => nav(`/cay/${t.slug}`))}
                  className={item}
                >
                  {t.imgs[0] ? (
                    <img src={t.imgs[0]} alt="" className="size-10 rounded-lg object-cover" loading="lazy" />
                  ) : (
                    <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                      <TreesIcon className="size-5" />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{t.name}</span>
                    <span className="block truncate text-xs text-muted-foreground italic">{t.sci || "—"}</span>
                  </span>
                  <span className="hidden text-xs text-muted-foreground sm:block">{t.family.replace(/\s*\(.*\)/, "")}</span>
                </Command.Item>
              ))}
            </Command.Group>
            <Command.Group heading="Trang" className={group}>
              {[
                { to: "/", label: "Trang chủ", icon: HomeIcon },
                { to: "/huong-dan", label: "Hướng dẫn", icon: BookOpenIcon },
                { to: "/danh-sach", label: "Danh sách cây", icon: ListTreeIcon },
                { to: "/du-an", label: "Về dự án", icon: InfoIcon },
              ].map((p) => (
                <Command.Item key={p.to} value={`trang ${p.label}`} onSelect={() => go(() => nav(p.to))} className={item}>
                  <p.icon className="size-4 text-muted-foreground" />
                  {p.label}
                </Command.Item>
              ))}
              <Command.Item value="quet ma qr scan" onSelect={() => go(() => setScanOpen(true))} className={item}>
                <ScanLineIcon className="size-4 text-muted-foreground" />
                Quét mã QR trên cây
              </Command.Item>
              <Command.Item value="giao dien sang toi dark mode theme" onSelect={() => go(() => toggle())} className={item}>
                <MoonIcon className="size-4 text-muted-foreground" />
                Đổi giao diện sáng / tối
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
