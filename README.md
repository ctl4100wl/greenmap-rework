# Green Map — THCS Võ Trường Toản

Bản đồ cây xanh trong trường. React + TypeScript + Tailwind CSS v4 + shadcn/ui, build bằng Vite, host trên GitHub Pages.

## Chạy trên máy

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # xuất ra dist/
```

## Deploy

Mỗi lần push lên `main`, GitHub Actions (`.github/workflows/deploy.yml`) tự build và đưa lên GitHub Pages.
Chỉ cần bật một lần: **Settings → Pages → Source: GitHub Actions**.

## Sửa nội dung

1. Vào `#/aadmin`, sửa bằng form, bấm **Tải data.json**.
2. Upload file đó vào thư mục `public/` của repo (ghi đè `public/data.json`).
3. Ảnh mới bỏ vào `public/assets/`.

Trang ẩn: `#/aadmin` (quản trị), `#/assets` (kiểm tra ảnh), `#/qr` (in mã QR hàng loạt).

Đường dẫn `#/cay/<slug>` giữ nguyên như bản cũ nên các mã QR đã dán trên cây vẫn dùng được.
