import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  DownloadIcon,
  EyeIcon,
  ImageIcon,
  PlusIcon,
  QrCodeIcon,
  RefreshCwIcon,
  SettingsIcon,
  Trash2Icon,
  Undo2Icon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/primitives";
import { clearDraft, loadDraft, normalize, saveDraft, useSiteData, type SiteData, type Tree } from "@/lib/data";
import { cn } from "@/lib/utils";

const FONTS = [
  { value: '"Be Vietnam Pro", system-ui, sans-serif', name: "Be Vietnam Pro (mặc định)" },
  { value: "system-ui, \"Segoe UI\", Roboto, sans-serif", name: "Hệ thống (nhanh nhất)" },
  { value: "Georgia, \"Times New Roman\", serif", name: "Georgia" },
];

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

/** Draft state shared by the admin and image pages, persisted to localStorage on every edit. */
function useDraft() {
  const { data } = useSiteData();
  const [draft, setDraft] = useState<SiteData>(() => loadDraft() ?? clone(data!));
  const update = (fn: (d: SiteData) => void) =>
    setDraft((d) => {
      const n = clone(d);
      fn(n);
      saveDraft(n);
      return n;
    });
  return { draft, setDraft, update };
}

function exportJSON(d: SiteData) {
  const blob = new Blob([JSON.stringify(d, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "data.json";
  a.click();
  URL.revokeObjectURL(a.href);
  toast.success("Đã tải data.json");
}

function Field({ label, value, onChange, area }: { label: string; value: string; onChange: (v: string) => void; area?: boolean }) {
  return (
    <div className="mb-3">
      <Label>{label}</Label>
      {area ? <Textarea value={value} onChange={(e) => onChange(e.target.value)} /> : <Input value={value} onChange={(e) => onChange(e.target.value)} />}
    </div>
  );
}

function ImgField({ label, value, onChange, onRemove }: { label?: string; value: string; onChange: (v: string) => void; onRemove?: () => void }) {
  const [state, setState] = useState<"ok" | "bad" | "wait" | "">("");
  useEffect(() => {
    if (!value) return setState("");
    setState("wait");
    const img = new Image();
    img.onload = () => setState("ok");
    img.onerror = () => setState("bad");
    img.src = value + (value.includes("?") ? "&" : "?") + "chk=" + Date.now();
  }, [value]);
  return (
    <div className="mb-3">
      {label && <Label>{label}</Label>}
      <div className="flex items-start gap-3 rounded-2xl border border-border bg-background/40 p-2.5">
        <div className="grid h-16 w-[88px] shrink-0 place-items-center overflow-hidden rounded-xl bg-muted text-[11px] text-muted-foreground">
          {state === "ok" ? <img src={value} alt="" className="size-full object-cover" /> : value ? (state === "bad" ? "⚠ lỗi" : "…") : "chưa có"}
        </div>
        <div className="min-w-0 flex-1">
          <Input value={value} placeholder="assets/ten-file.webp" onChange={(e) => onChange(e.target.value)} className="font-mono text-sm" />
          <div className={cn("mt-1 text-xs", state === "ok" && "font-bold text-primary", state === "bad" && "font-bold text-destructive")}>
            {state === "wait" && "Đang kiểm tra…"}
            {state === "ok" && "✓ Ảnh tồn tại"}
            {state === "bad" && "✗ Không tìm thấy file — kiểm tra lại tên/đuôi"}
          </div>
        </div>
        {onRemove && (
          <Button variant="ghost" size="icon-sm" onClick={onRemove} title="Xoá ảnh này" className="text-destructive">
            <XIcon />
          </Button>
        )}
      </div>
    </div>
  );
}

function Section({ title, tag, children, open: initial = false, actions }: { title: ReactNode; tag?: string; children: ReactNode; open?: boolean; actions?: ReactNode }) {
  const [open, setOpen] = useState(initial);
  return (
    <div className="glass-card mb-3 overflow-hidden rounded-3xl">
      <div role="button" onClick={() => setOpen((v) => !v)} className="flex cursor-pointer items-center gap-3 px-5 py-4 font-bold text-heading hover:bg-foreground/[0.03]">
        <ChevronDownIcon className={cn("size-4 transition-transform", open && "rotate-180")} />
        {title}
        {tag && <span className="ml-auto text-xs font-semibold text-muted-foreground">{tag}</span>}
        {actions && <span className={cn("flex gap-1", !tag && "ml-auto")} onClick={(e) => e.stopPropagation()}>{actions}</span>}
      </div>
      {open && <div className="border-t border-border p-5 animate-in fade-in slide-in-from-top-1">{children}</div>}
    </div>
  );
}

function Toolbar({ draft, extra }: { draft: SiteData; extra?: ReactNode }) {
  return (
    <div className="glass noprint sticky top-[88px] z-20 mb-6 flex flex-wrap gap-2 rounded-3xl p-2.5">
      <Button onClick={() => exportJSON(draft)}><DownloadIcon /> Tải data.json</Button>
      {extra}
    </div>
  );
}

export default function AdminPage() {
  const { draft, setDraft, update } = useDraft();
  const { setData } = useSiteData();
  const nav = useNavigate();
  const h = draft.hero;
  const setTree = (i: number, k: keyof Tree, v: string) => update((d) => void ((d.trees[i] as any)[k] = v));

  return (
    <div className="mx-auto max-w-4xl px-4 pt-10 sm:px-6">
      <h1 className="text-4xl font-extrabold tracking-tight text-heading">Bảng quản trị</h1>
      <p className="mt-2 mb-6 text-muted-foreground">Sửa nội dung và tên file ảnh bằng form, không cần đụng vào code.</p>

      <Toolbar
        draft={draft}
        extra={
          <>
            <Button variant="secondary" onClick={() => { setData(normalize(clone(draft))); nav("/"); toast("Đang xem thử bản nháp"); }}><EyeIcon /> Xem thử trên site</Button>
            <Button variant="secondary" onClick={() => {
              if (!confirm("Bỏ mọi thay đổi và quay về bản gốc?")) return;
              clearDraft();
              fetch(`data.json?v=${Date.now()}`).then((r) => r.json()).then((j) => { const d = normalize(j); setDraft(d); setData(d); toast("Đã khôi phục bản gốc"); });
            }}><Undo2Icon /> Về bản gốc</Button>
            <Button variant="secondary" asChild><Link to="/assets"><ImageIcon /> Quản lý ảnh</Link></Button>
            <Button variant="secondary" asChild><Link to="/qr"><QrCodeIcon /> Trang QR</Link></Button>
          </>
        }
      />

      <div className="mb-6 rounded-2xl bg-primary/10 px-5 py-4 text-sm">
        <b>Quy trình:</b> sửa ở đây → bấm <b>Tải data.json</b> → upload file đó vào repo GitHub (thư mục <code>public/</code>) → site tự dùng nội dung mới. Bản nháp được lưu tạm trong trình duyệt, tắt máy vẫn còn.
      </div>

      <Section title={<><SettingsIcon className="size-4" /> Chung</>} open>
        <div className="grid gap-x-4 sm:grid-cols-2">
          <Field label="Tên thương hiệu" value={draft.brand} onChange={(v) => update((d) => void (d.brand = v))} />
          <Field label="Chân trang" value={draft.footer} onChange={(v) => update((d) => void (d.footer = v))} />
        </div>
        <Label>Font chữ toàn site</Label>
        <select
          value={draft.font || FONTS[0].value}
          onChange={(e) => {
            const v = e.target.value;
            update((d) => void (d.font = v));
            document.documentElement.style.setProperty("--site-font", v);
            toast("Đã đổi font — nhớ Tải data.json để lưu");
          }}
          className="h-10 w-full rounded-xl border border-input bg-background/60 px-3"
        >
          {FONTS.map((f) => <option key={f.value} value={f.value}>{f.name}</option>)}
        </select>
      </Section>

      <Section title="🏠 Trang chủ / Hero" tag={h.image ? "1 ảnh" : "chưa có ảnh"}>
        <div className="grid gap-x-4 sm:grid-cols-2">
          <Field label="Tiêu đề lớn" value={h.h1} onChange={(v) => update((d) => void (d.hero.h1 = v))} />
          <Field label="Phụ đề" value={h.h2} onChange={(v) => update((d) => void (d.hero.h2 = v))} />
          <Field label="Tên trường" value={h.school} onChange={(v) => update((d) => void (d.hero.school = v))} />
          <Field label="Chữ trên nút" value={h.cta} onChange={(v) => update((d) => void (d.hero.cta = v))} />
        </div>
        <Field label="Mô tả ngắn" area value={h.lead} onChange={(v) => update((d) => void (d.hero.lead = v))} />
        <ImgField label="Ảnh nền hero" value={h.image} onChange={(v) => update((d) => void (d.hero.image = v))} />
      </Section>

      <Section title="📖 Hướng dẫn" tag={draft.guideImage ? "1 ảnh" : "chưa có ảnh"}>
        <Field label="Các bước (mỗi dòng 1 bước)" area value={draft.guide.join("\n")} onChange={(v) => update((d) => void (d.guide = v.split("\n").map((s) => s.trim()).filter(Boolean)))} />
        <ImgField label="Ảnh minh hoạ" value={draft.guideImage} onChange={(v) => update((d) => void (d.guideImage = v))} />
      </Section>

      <Section title="🌱 Về dự án">
        <Field label="Mô tả sứ mệnh" area value={draft.about} onChange={(v) => update((d) => void (d.about = v))} />
        <Field label="Người thực hiện (mỗi dòng 1 ý)" area value={draft.credits.join("\n")} onChange={(v) => update((d) => void (d.credits = v.split("\n").map((s) => s.trim()).filter(Boolean)))} />
        <Field label="Công nghệ" area value={draft.tech} onChange={(v) => update((d) => void (d.tech = v))} />
      </Section>

      <h3 className="mt-10 mb-4 text-2xl font-bold text-heading">🌳 Danh sách cây ({draft.trees.length})</h3>
      {draft.trees.map((t, i) => (
        <Section
          key={t.slug + i}
          title={`${i + 1}. ${t.name || "(chưa đặt tên)"}`}
          tag={`${t.imgs.length} ảnh`}
          actions={
            <>
              <Button variant="ghost" size="icon-sm" title="Lên" onClick={() => update((d) => { if (i > 0) [d.trees[i - 1], d.trees[i]] = [d.trees[i], d.trees[i - 1]]; })}><ArrowUpIcon /></Button>
              <Button variant="ghost" size="icon-sm" title="Xuống" onClick={() => update((d) => { if (i < d.trees.length - 1) [d.trees[i + 1], d.trees[i]] = [d.trees[i], d.trees[i + 1]]; })}><ArrowDownIcon /></Button>
              <Button variant="ghost" size="icon-sm" title="Xoá" className="text-destructive" onClick={() => { if (confirm(`Xoá “${t.name}”?`)) { update((d) => void d.trees.splice(i, 1)); toast("Đã xoá"); } }}><Trash2Icon /></Button>
            </>
          }
        >
          <div className="grid gap-x-4 sm:grid-cols-2">
            <Field label="Tên thường" value={t.name} onChange={(v) => setTree(i, "name", v)} />
            <Field label="Tên khoa học" value={t.sci} onChange={(v) => setTree(i, "sci", v)} />
            <Field label="Họ thực vật" value={t.family} onChange={(v) => setTree(i, "family", v)} />
            <Field label="Tên gọi khác" value={t.alias} onChange={(v) => setTree(i, "alias", v)} />
          </div>
          <Field label="Slug (đường dẫn QR — đổi là QR cũ chết)" value={t.slug} onChange={(v) => setTree(i, "slug", v)} />
          <Label className="mt-4">Ảnh ({t.imgs.length})</Label>
          {t.imgs.map((src, k) => (
            <ImgField key={k} value={src} onChange={(v) => update((d) => void (d.trees[i].imgs[k] = v))} onRemove={() => update((d) => void d.trees[i].imgs.splice(k, 1))} />
          ))}
          <Button variant="outline" size="sm" className="mb-4" onClick={() => update((d) => void d.trees[i].imgs.push("assets/"))}><PlusIcon /> Thêm ảnh</Button>
          <Field label="Đặc điểm nhận biết" area value={t.desc} onChange={(v) => setTree(i, "desc", v)} />
          <Field label="Công dụng" area value={t.uses} onChange={(v) => setTree(i, "uses", v)} />
          <Field label="Giá trị sinh thái" area value={t.eco} onChange={(v) => setTree(i, "eco", v)} />
          <Field label="Điều thú vị" area value={t.fun} onChange={(v) => setTree(i, "fun", v)} />
          <Field label="Nhãn mục thú vị (để trống = “Điều thú vị”)" value={t.funLabel} onChange={(v) => setTree(i, "funLabel", v)} />
        </Section>
      ))}
      <Button
        variant="secondary"
        onClick={() => {
          update((d) => void d.trees.push({ slug: "cay-moi-" + Date.now().toString(36).slice(-4), name: "Cây mới", sci: "", family: "", alias: "", imgs: [], desc: "", uses: "", eco: "", fun: "", funLabel: "" }));
          toast("Đã thêm cây mới");
        }}
      >
        <PlusIcon /> Thêm cây mới
      </Button>
    </div>
  );
}

export function AssetsPage() {
  const { draft, update } = useDraft();
  const [key, setKey] = useState(0);
  const refs: { label: string; get: string; set: (d: SiteData, v: string) => void }[] = [];
  if (draft.hero.image) refs.push({ label: "Hero — ảnh nền", get: draft.hero.image, set: (d, v) => void (d.hero.image = v) });
  if (draft.guideImage) refs.push({ label: "Hướng dẫn — ảnh minh hoạ", get: draft.guideImage, set: (d, v) => void (d.guideImage = v) });
  draft.trees.forEach((t, i) =>
    t.imgs.forEach((src, k) => refs.push({ label: `${t.name || "(chưa đặt tên)"} — ảnh ${k + 1}`, get: src, set: (d, v) => void (d.trees[i].imgs[k] = v) })),
  );

  return (
    <div className="mx-auto max-w-4xl px-4 pt-10 sm:px-6">
      <h1 className="text-4xl font-extrabold tracking-tight text-heading">Quản lý ảnh</h1>
      <p className="mt-2 mb-6 text-muted-foreground">Toàn bộ {refs.length} ảnh đang được site sử dụng. Sửa tên file sai ngay tại đây.</p>
      <Toolbar
        draft={draft}
        extra={
          <>
            <Button variant="secondary" onClick={() => setKey((k) => k + 1)}><RefreshCwIcon /> Kiểm tra lại toàn bộ</Button>
            <Button variant="secondary" asChild><Link to="/aadmin"><SettingsIcon /> Bảng quản trị</Link></Button>
          </>
        }
      />
      <div key={key}>
        {refs.map((r, i) => (
          <div key={i} className="glass-card mb-3 rounded-3xl p-4">
            <div className="mb-2 text-sm font-bold text-heading">{r.label}</div>
            <ImgField value={r.get} onChange={(v) => update((d) => r.set(d, v))} />
          </div>
        ))}
      </div>
    </div>
  );
}
