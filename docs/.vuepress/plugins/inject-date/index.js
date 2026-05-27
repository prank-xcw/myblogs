/**
 * 本地插件 —— 为缺少 frontmatter.date 的页面自动填充 git 首次提交日期
 *
 * 依赖 @vuepress/last-updated 插件先执行，后者通过 extendPageData
 * 设置 $page.lastUpdated。本插件在其之后运行，将该值写入
 * $page.frontmatter.date，供 reco 主题的 sortPostsByStickyAndDate 排序。
 *
 * 已有 date 的文章不受影响。
 */
const { execSync } = require("child_process");
const path = require("path");

module.exports = (options, ctx) => ({
  extendPageData($page) {
    if ($page.frontmatter.date) return;

    const filePath = $page._filePath;
    if (!filePath) return;

    try {
      const relPath = path.relative(ctx.sourceDir, filePath);
      const buf = execSync(
        `git log --diff-filter=A --follow --format="%ai" -1 -- "${relPath}"`,
        { cwd: ctx.sourceDir, timeout: 5000 }
      );
      const dateStr = buf.toString().trim().split(" +")[0];
      if (dateStr) {
        $page.frontmatter.date = dateStr;
      }
    } catch {
      // 静默忽略
    }
  },
});