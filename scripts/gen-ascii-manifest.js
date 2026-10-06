"use strict";

// 扫描 ascii/ 目录，生成 worker.js 用的静态导入清单。
// Cloudflare Workers 运行时没有 fs，esbuild 也不支持 glob import，
// 所以必须在打包期把每份字符画显式 import 进来。
// Node 侧（Vercel / 本地）不需要这个文件，直接 fs.readdirSync，见 lib/runtime-node.js。
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "ascii");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".txt")).sort();

const content = [
  "// 由 scripts/gen-ascii-manifest.js 自动生成，勿手改。",
  "// 新增字符画后跑 npm run build:ascii 重新生成。",
  ...files.map((f, i) => `import a${i} from "./${f}";`),
  "",
  `export default [${files.map((_, i) => `a${i}`).join(", ")}];`,
  "",
].join("\n");

fs.writeFileSync(path.join(dir, "manifest.js"), content);
console.log(`[fake-ai-api] 已生成 ascii/manifest.js（${files.length} 份字符画）`);
