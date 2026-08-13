// ============================================
// mock-data 写回模块(仅服务端使用)
// 管理后台的「保存」操作调用此模块,把最新数据写回 mock-data.ts 文件,
// 触发 dev 热更新,前端立即显示最新内容。
// ============================================
import fs from "fs";
import path from "path";
import { departments, members, works, timeline, faqs, stats, honors } from "@/lib/mock-data";

export interface MockData {
  departments?: unknown[];
  members?: unknown[];
  works?: unknown[];
  timeline?: unknown[];
  faqs?: unknown[];
  stats?: unknown[];
  honors?: unknown[];
}

function serialize(name: string, arr: unknown[], type?: string): string {
  return type
    ? `export const ${name}: ${type}[] = ${JSON.stringify(arr, null, 2)};`
    : `export const ${name} = ${JSON.stringify(arr, null, 2)} as const;`;
}

/** 全量重建 src/lib/mock-data.ts(未提供的集合沿用当前 mock 值) */
export function writeMockData(data: MockData) {
  const file = path.join(process.cwd(), "src", "lib", "mock-data.ts");
  const content =
    `// ============================================\n` +
    `// 网站内容数据源(唯一事实源)\n` +
    `// 直接修改此文件保存后,网站内容立即更新(dev 热更新)\n` +
    `// 管理后台的「保存」操作也会写回此文件\n` +
    `// ============================================\n\n` +
    `export interface HonorItem {\n` +
    `  id: string;\n` +
    `  title: string;\n` +
    `  description: string;\n` +
    `  image: string;\n` +
    `  year: string;\n` +
    `}\n\n` +
    serialize("departments", data.departments ?? (departments as unknown as unknown[])) +
    `\n\n` +
    serialize("members", data.members ?? (members as unknown as unknown[])) +
    `\n\n` +
    serialize("works", data.works ?? (works as unknown as unknown[])) +
    `\n\n` +
    serialize("timeline", data.timeline ?? (timeline as unknown as unknown[])) +
    `\n\n` +
    serialize("faqs", data.faqs ?? (faqs as unknown as unknown[])) +
    `\n\n` +
    serialize("stats", data.stats ?? (stats as unknown as unknown[])) +
    `\n\n` +
    serialize("honors", data.honors ?? (honors as unknown as unknown[]), "HonorItem") +
    `\n`;
  fs.writeFileSync(file, content, "utf-8");
}
