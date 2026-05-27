# 迷糊笔记

个人技术博客，记录开发问题和日常踩坑，基于 [VuePress 1.x](https://v1.vuepress.vuejs.org/zh/) + [vuepress-theme-reco](https://vuepress-theme-reco.recoluan.com/) 构建。

- 博客地址：[https://index.onceprank.cn](https://index.onceprank.cn)
- 内容范围：Java、Spring Boot、数据库（MySQL / Oracle）、Redis、Linux、Docker、Nginx、MQ、Go、Python、前端、Mac、Git 等



## 指南





> 版本：
>
> ​	node		14.21.3
>
> ​	npm		 6.14.18





## 项目启动前执行



**安装对应主题**

```sh
npm install vuepress-theme-reco --save-dev
```



**须安装日期插件**

```sh
 npm install moment
```





## 启动

**本地开发**（默认端口 `8099`，在 `docs/.vuepress/config.js` 中配置）

```sh
npm run dev
```

**生产构建**（输出到 `docs/.vuepress/dist`，已加入 `.gitignore`，不会随源码提交）

```sh
npm run build
```







## 部署



### 部署系统到GitHub

在根目录下的`deploy.sh`文件中设置对应的仓库名，随后执行脚本

脚本会执行 `npm run build`，进入 `docs/.vuepress/dist` 目录，写入 CNAME（`index.onceprank.cn`），然后强推到独立的 GitHub Pages 仓库 `prank-xcw/prank-xcw.github.io`。

```sh
./deploy.sh "本次部署说明"
```

> 注意：`deploy.sh` 内部使用 `git push -f`，发布仓库只保留最新一次构建产物，没有历史记录。



### 部署项目

在根目录下的`deployProject.sh`文件中设置对应的仓库名，执行脚本

把当前源码仓库推送到 GitHub `prank-xcw/myblogs`。首次推送时需要在脚本内打开 `git remote add origin ...` 那一行。

```sh
./deployProject.sh "提交说明"
```



## 目录结构

```
myblogs
├── docs
│   ├── README.md              # 站点首页（home: true）
│   ├── index.md
│   ├── guide/                 # 所有文章按主题分目录存放
│   │   ├── java/
│   │   ├── springboot/
│   │   ├── database/
│   │   │   ├── mysql/
│   │   │   └── oracle/
│   │   ├── linux/
│   │   ├── redis/
│   │   ├── nginx/
│   │   ├── mq/
│   │   └── ...
│   └── .vuepress
│       ├── config.js          # 站点配置（标题、端口、插件、主题）
│       ├── navConfig.js       # 顶部导航栏
│       ├── sidebarConfig.js   # 侧边栏入口（调用本地自动生成器）
│       ├── vuepress-sidebar-auto/
│       │   └── vuepress-sidebar-auto.js   # 自动扫描 guide 目录生成侧边栏
│       ├── public/            # logo、favicon 等公共静态资源
│       └── dist/              # 构建产物，不提交到源码仓库
├── deploy.sh                  # 构建并发布到 GitHub Pages
├── deployProject.sh           # 推送源码仓库
├── package.json
└── README.md
```



## 新增文章规范

### 1. 文件位置

把 Markdown 放到 `docs/guide/<主题>/` 目录下，最深支持到 `docs/guide/<a>/<b>/<c>` 三级（再深的层级会被自动侧边栏插件截断）。

### 2. Frontmatter 必填项

每篇文章顶部必须包含 frontmatter，否则博客分类页和标签页会缺项：

```yaml
---
title: 文章标题
categories: 一级分类（建议与 guide 下的目录名保持一致）
tags:
  - 标签一
  - 标签二
---
```

### 3. 文件命名与排序

侧边栏排序规则在 `docs/.vuepress/vuepress-sidebar-auto/vuepress-sidebar-auto.js` 中实现，**按文件名 `-` 之后的尾段数字排序**。如果一个目录下有多篇有顺序关系的文章，文件名后缀加 `-1` / `-2` / `-3` 控制顺序：

```
docker入门实践一-1.md
docker入门实践二-2.md
docker入门实践三-3.md
```

不带 `-N` 后缀的文件按字符串排序，多文件混排时容易乱序。

### 4. 图片资源

为每篇引用图片的文章创建同名 `xxx.assets/` 目录存放图片（Typora 默认行为），相对路径引用即可，例如：

```
docker安装与使用nginx.md
docker安装与使用nginx.assets/
└── 截图1.png
```

### 5. README 与 index 不会进侧边栏

自动侧边栏插件会跳过文件名为 `README.md` 或 `index.md` 的文件，这两类文件仅作目录首页，不会出现在侧边栏导航中。



## 故障排查

### `error:0308010C:digital envelope routines::unsupported`

Node 17+ 默认 OpenSSL 3，旧版 webpack/terser 用了被弃用的 md4 算法会触发该错误。两种解决办法任选其一：

- 切回 Node 14（推荐，使用 nvm：`nvm use 14`）
- 临时设置环境变量再执行命令：

  ```sh
  NODE_OPTIONS=--openssl-legacy-provider npm run dev
  NODE_OPTIONS=--openssl-legacy-provider npm run build
  ```



## 内置功能

`docs/.vuepress/config.js` 中已启用的插件，写文章时可直接使用：

- **代码行号**：所有代码块默认显示行号，主题为 `solarizedlight`
- **代码复制**：每个代码块自带「复制成功!」按钮，来自 `vuepress-plugin-code-copy`
- **Mermaid 图表**：可用 ` ```mermaid ` 直接画流程图、时序图，来自 `vuepress-plugin-mermaidjs`
- **更新时间**：每篇文章底部显示「更新时间」，根据 git 最后提交时间自动生成
- **回到顶部**：`@vuepress/back-to-top`
- **全文搜索**：顶部搜索框最多显示 10 条建议



