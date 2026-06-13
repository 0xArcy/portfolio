import fs from "fs";
import path from "path";

export const dynamic = "force-static";

export function generateStaticParams() {
  const rawDir = path.join(process.cwd(), "public", "raw");
  const params: { slug: string; file: string }[] = [];
  for (const slug of fs.readdirSync(rawDir)) {
    const slugPath = path.join(rawDir, slug);
    if (!fs.statSync(slugPath).isDirectory()) continue;
    for (const file of fs.readdirSync(slugPath)) {
      if (file.endsWith(".txt")) params.push({ slug, file: file.slice(0, -4) });
    }
  }
  return params;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; file: string }> }
) {
  const { slug, file } = await params;

  if (slug.includes("..") || slug.includes("/") || file.includes("..") || file.includes("/")) {
    return new Response("Not found", { status: 404 });
  }

  const filePath = path.join(process.cwd(), "public", "raw", slug, `${file}.txt`);
  let content: string;
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const escaped = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${file} — raw output</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #f4f4ef;
      color: #1a1a1a;
      font-family: 'Courier New', Courier, monospace;
      padding: 48px 32px 80px;
    }
    .header {
      max-width: 900px;
      margin: 0 auto 24px;
      padding-bottom: 14px;
      border-bottom: 2px solid #d8d8d0;
    }
    .header h1 { font-size: 0.95rem; color: #555; font-weight: normal; }
    .header p { font-size: 0.8rem; color: #999; margin-top: 4px; }
    pre {
      max-width: 900px;
      margin: 0 auto;
      white-space: pre;
      overflow-x: auto;
      font-size: 0.83rem;
      line-height: 1.55;
      color: #1a1a1a;
      tab-size: 4;
    }
    @media (max-width: 640px) {
      body { padding: 20px 14px 48px; }
      pre { font-size: 0.74rem; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>raw output: ${file}.txt</h1>
    <p>writeup: ${slug}</p>
  </div>
  <pre>${escaped}</pre>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
