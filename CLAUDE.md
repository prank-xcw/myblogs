# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目性质

这是一个**个人技术博客（迷糊笔记）**，不是普通业务代码仓库。99% 的内容是 `docs/guide/` 下的中文 Markdown 笔记，覆盖 Java、Spring Boot、数据库、Linux、Docker、Redis、Nginx、MQ、Go、Python、前端等主题。仓库基于 **VuePress 1.9.9 + vuepress-theme-reco** 构建。

构建出的静态站点会被推送到独立仓库 `prank-xcw/prank-xcw.github.io`（域名 `index.onceprank.cn`）；当前仓库本身托管在 `prank-xcw/myblogs`。

## 常用命令

依赖版本（`README.md`）：Node 14.21.3 / npm 6.14.18。已安装 `node_modules`，正常情况下无需 `npm install`。

```sh
npm run dev      # 本地开发，端口 8099（在 docs/.vuepress/config.js 中设置）
npm run build    # 生成静态文件到 docs/.vuepress/dist
./deploy.sh "msg"        # 构建并强推 dist 到 GitHub Pages 仓库（带 CNAME）
./deployProject.sh "msg" # 把当前源码仓库推送到 GitHub
```

注意 `deploy.sh` 内部会 `git init` + `git push -f`，**只针对 `dist` 目录生效**，不要在仓库根目录跑 `git init`。

**Node 17+ 环境必须加 `NODE_OPTIONS=--openssl-legacy-provider`**，否则 webpack/terser 的 md4 调用会触发 `error:0308010C:digital envelope routines::unsupported`：

```sh
NODE_OPTIONS=--openssl-legacy-provider npm run build
```

## 内容架构（关键）

### 目录约定

```
docs/
├── README.md                # 站点首页（home: true）
├── index.md
├── guide/<topic>/[<sub>/]<slug>.md   # 所有正文笔记
└── .vuepress/
    ├── config.js            # 站点配置（标题、端口、插件、主题）
    ├── navConfig.js         # 顶部导航
    ├── sidebarConfig.js     # 侧边栏（调用自定义自动生成器）
    ├── vuepress-sidebar-auto/vuepress-sidebar-auto.js  # 自动生成侧边栏的本地插件
    ├── public/              # logo、favicon 等静态资源
    └── dist/                # 构建产物，不要提交到当前仓库（已在 .gitignore）
```

`docs/.vuepress/dist` 目录在本地可能存在，但属于 `deploy.sh` 的工作区，源码仓库的 `.gitignore` 已忽略，**修改文档时不要顺手把它一起 commit**。

### 文章 frontmatter 规范

新增文档时按这个模板写：

```yaml
---
title: 标题
categories: <一级分类，对应 docs/guide/ 下的目录名>
tags:
  - <标签1>
  - <标签2>
---
```

`title / categories / tags` 都会被 reco 主题用于"博客 / 分类 / 标签"页，缺失会让分类页缺项。

### 自动侧边栏与文件命名

`docs/.vuepress/vuepress-sidebar-auto/vuepress-sidebar-auto.js` 在构建时扫描 `docs/guide/`：

- **过滤规则**：仅纳入 `.md` 文件，并排除 `README.md` / `index.md`（这两类作为目录首页存在）。
- **排序规则**（`vuepress-sidebar-auto.js:53-58`）：按文件名 `-` 之后的尾段数字排序。也就是说，如果想控制顺序，文件名带 `-1 / -2 / -3` 这种后缀，比如 `docker入门实践一-1.md`、`docker入门实践二-2.md`。没有 `-N` 后缀的文件会按字符串排序，多文件混排时会乱。
- **目录分组**：每个子目录会成为一个可折叠分组，分组标题取目录名 `-` 之前的部分。
- **路径深度**：脚本最多处理到 `docs/guide/<a>/<b>/<c>` 三级，超过这个深度会被截断，不要把笔记放得更深。

### `<topic>.assets` 资源目录

VuePress 文档里引用的图片放在与文档同名的 `xxx.assets/` 目录中（参考 `docs/guide/linux/docker/docker安装与使用nginx.assets`）。这是 Typora 默认的相对路径约定，请保持。

## 修改文档时的注意事项

- 写中文笔记，不要把已有中文标题/正文改成英文。
- 文件名、目录名、frontmatter 中的中文是有意为之（站点 URL 也是中文路径），不要做"统一英文化"重构。
- 涉及 SQL、Shell、Java、配置等代码块时，保留语言标识（``` ```sql / ```sh / ```java），`config.js` 配置了 `lineNumbers: true` 和 `solarizedlight` 主题，靠语言标识高亮。
- 站点已启用 `vuepress-plugin-mermaidjs`，可以在 Markdown 里用 \`\`\`mermaid 画图。
- 已启用 `vuepress-plugin-code-copy`，代码块自带"复制成功!"按钮，写示例时不需要额外处理。

## 部署链路（容易踩坑）

1. `deploy.sh` 第 20 行硬编码 `echo 'index.onceprank.cn' > CNAME`，**别改成别的域名**，否则 GitHub Pages 自定义域名会失效。
2. `deploy.sh` 用 `git push -f https://github.com/prank-xcw/prank-xcw.github.io master`——发布仓库永远只保留最新构建产物，没有历史。出问题回滚要从源码仓库重新构建。
3. `deployProject.sh` 第 13 行有一行被注释的 `git remote add origin ...`，仅首次推送需要打开。日常用直接执行就行。
