import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import { ScanLineIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useData } from "@/lib/data";
import { useUI } from "@/lib/ui";

type Scanner = { stop: () => Promise<void>; clear: () => void };

export function ScannerDialog() {
  const { scanOpen, setScanOpen } = useUI();
  const data = useData();
  const nav = useNavigate();
  const [msg, setMsg] = useState<ReactNode>("Đang mở camera…");
  const scanner = useRef<Scanner | null>(null);

  const listLink = (
    <Link to="/danh-sach" onClick={() => setScanOpen(false)} className="font-bold text-primary">
      Xem danh sách cây →
    </Link>
  );

  useEffect(() => {
    if (!scanOpen) return;
    let cancelled = false;
    setMsg("Đang mở camera…");

    (async () => {
      let Html5Qrcode: typeof import("html5-qrcode").Html5Qrcode;
      try {
        ({ Html5Qrcode } = await import("html5-qrcode"));
      } catch {
        setMsg(<>Không tải được thư viện quét. {listLink}</>);
        return;
      }
      // Radix mounts the dialog content a frame later; wait for #qr-reader.
      await new Promise((r) => requestAnimationFrame(r));
      if (cancelled || !document.getElementById("qr-reader")) return;
      const s = new Html5Qrcode("qr-reader", { verbose: false });
      scanner.current = s;
      try {
        await s.start(
          { facingMode: "environment" },
          // No qrbox: the library would draw its own shaded box and corners over ours.
          { fps: 10, aspectRatio: 1 },
          (text) => {
            const m = String(text).match(/#\/cay\/([a-z0-9-]+)/i);
            if (m && data.trees.some((t) => t.slug === m[1])) {
              setScanOpen(false);
              nav(`/cay/${m[1]}`);
              return;
            }
            setMsg(
              /^https?:\/\//i.test(text) ? (
                <>
                  Mã này không thuộc Green Map:{" "}
                  <a href={text} target="_blank" rel="noopener" className="font-bold break-all text-primary">
                    {text}
                  </a>
                </>
              ) : (
                <>
                  Nội dung mã: <b>{String(text).slice(0, 120)}</b>
                </>
              ),
            );
          },
          () => {},
        );
        if (!cancelled) setMsg("Đưa camera vào mã QR gắn trên thân cây.");
      } catch {
        if (!cancelled) setMsg(<>Không mở được camera (cần HTTPS và quyền truy cập). {listLink}</>);
      }
    })();

    return () => {
      cancelled = true;
      const s = scanner.current;
      scanner.current = null;
      s?.stop().then(() => s.clear()).catch(() => {});
    };
  }, [scanOpen]);

  return (
    <Dialog open={scanOpen} onOpenChange={setScanOpen}>
      <DialogContent className="max-w-md p-0">
        <div className="flex items-center gap-3 px-5 py-4">
          <span className="grid size-9 place-items-center rounded-full bg-primary/12 text-primary">
            <ScanLineIcon className="size-[18px]" />
          </span>
          <DialogTitle className="text-[17px] font-bold">Quét mã QR trên cây</DialogTitle>
        </div>
        <div className="relative mx-4 aspect-square overflow-hidden rounded-2xl bg-black">
          <div id="qr-reader" className="absolute inset-0" />
          {/* viewfinder corners + sweeping line */}
          <div className="pointer-events-none absolute inset-[14%]">
            {["top-0 left-0 border-t-4 border-l-4 rounded-tl-2xl", "top-0 right-0 border-t-4 border-r-4 rounded-tr-2xl", "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-2xl", "right-0 bottom-0 border-r-4 border-b-4 rounded-br-2xl"].map((c) => (
              <span key={c} className={`absolute size-10 border-emerald-400 ${c}`} />
            ))}
            <span className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_16px_2px] shadow-emerald-400/60 animate-[scan-line_2.4s_ease-in-out_infinite]" />
          </div>
        </div>
        <p className="px-5 py-4 text-center text-sm text-muted-foreground">{msg}</p>
      </DialogContent>
    </Dialog>
  );
}
