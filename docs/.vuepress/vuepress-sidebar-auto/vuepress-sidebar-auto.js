/**
 * 自动扫描 docs 下的指定目录，生成 VuePress 侧边栏 children 数组
 *
 * 约定：
 *  - 仅纳入 .md 文件，排除 README.md / index.md
 *  - 同级文件按文件名 "-" 之后的尾段数字升序排列
 *  - 没有数字尾段的文件按字符串自然顺序排列
 *  - 子目录变成可折叠分组
 */

const fs = require("fs");
const path = require("path");

const EXCLUDE = new Set(["README.md", "index.md"]);

function isMd(n) {
  return n.endsWith(".md") && !EXCLUDE.has(n);
}

function trailingNum(name) {
  const tail = name.replace(/\.md$/, "").match(/[^-]*$/)[0];
  const n = parseInt(tail, 10);
  return Number.isNaN(n) ? NaN : n;
}

function cmpName(a, b) {
  const ax = trailingNum(a);
  const bx = trailingNum(b);
  if (Number.isNaN(ax) && Number.isNaN(bx)) return a.localeCompare(b);
  if (Number.isNaN(ax)) return 1;
  if (Number.isNaN(bx)) return -1;
  return ax - bx;
}

function build(dir, prefix) {
  const entries = fs.readdirSync(dir).sort(cmpName);
  const children = [];
  for (const item of entries) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      children.push({
        title: item.split("-")[0],
        collapsable: true,
        sidebarDepth: 2,
        children: build(full, `${prefix}/${item}`),
      });
    } else if (isMd(item)) {
      children.push(`${prefix}/${item}`);
    }
  }
  return children;
}

function getChildren(docsRoot, ele) {
  return build(path.join(docsRoot, ele), `/${ele}`);
}

module.exports = { getChildren };