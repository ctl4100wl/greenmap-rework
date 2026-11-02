import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { DownloadIcon, PrinterIcon, SettingsIcon } from "lucide-react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { useData } from "@/lib/data";
import { baseURL } from "@/lib/utils";

const save = (cv: HTMLCanvasElement, name: string) => {
  const a = document.createElement("a");
  a.download = `qr-${name}.png`;
  a.href = cv.toDataURL("image/png");
  a.click();
};

export default function QRPage() {
  const data = useData();
  const grid = useRef<HTMLDivElement>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    grid.current?.querySelectorAll<HTMLCanvasElement>("canvas").forEach((cv) => {
      QRCode.toCanvas(cv, `${baseURL()}#/cay/${cv.dataset.slug}`, {
        width: 520,
        margin: 1,
        errorCorrectionLevel: "M",
        color: { dark: "#14532d", light: "#ffffff" },
      }).catch(() => setErr(true));
    });
  }, [data.trees]);

  const all = () =>
    grid.current?.querySelectorAll<HTMLCanvasElement>("canvas").forEach((cv, i) => setTimeout(() => save(cv, cv.dataset.slug!), i * 350));

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 print:p-0">
      <h1 className="text-4xl font-extrabold tracking-tight text-heading">Tạo mã QR hàng loạt</h1>
      <p className="noprint mt-2 mb-6 text-muted-foreground">
        Mỗi mã trỏ tới trang chi tiết của một cây. Bấm “In” để in ra giấy dán, hoặc bấm từng mã để tải PNG.
      </p>
      <div className="noprint mb-6 flex flex-wrap gap-3">
        <Button onClick={() => print()}><PrinterIcon /> In tất cả</Button>
        <Button variant="secondary" onClick={all}><DownloadIcon /> Tải tất cả PNG</Button>
        <Button variant="secondary" asChild><Link to="/aadmin"><SettingsIcon /> Bảng quản trị</Link></Button>
      </div>
      {err && <p className="mb-4 text-destructive">Không tạo được mã QR.</p>}
      <div ref={grid} className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 print:grid-cols-3">
        {data.trees.map((t) => (
          <div key={t.slug} className="rounded-2xl border-2 border-dashed border-primary/30 bg-white p-4 text-center text-[#14532d] break-inside-avoid">
            <canvas
              data-slug={t.slug}
              title="Bấm để tải PNG"
              onClick={(e) => save(e.currentTarget, t.slug)}
              className="mx-auto h-auto! w-full! max-w-[180px] cursor-pointer"
            />
            <div className="mt-2 font-extrabold">{t.name}</div>
            <div className="text-xs italic opacity-70">{t.sci}</div>
            <div className="noprint mt-1 text-[10px] break-all opacity-50">{baseURL()}#/cay/{t.slug}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
