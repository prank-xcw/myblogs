//侧边栏
const sidebarConfig = require("./sidebarConfig");
//导航栏
const navConfig = require("./navConfig");
module.exports = {
  //host: "localhost", // ip
  port: "8099", //端口号
  title: "prank",
  description: "记录开发问题",
  // 默认语言
  // locales: {
  //   "/": {
  //     lang: "zh-CN",
  //     title: "个人博客",
  //   },
  // },
  base: "/blogs/", // 这是部署到github相关的配置
  // 注入到当前页面的 HTML <head> 中的标签
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }], // 增加一个自定义的 favicon(网页标签的图标)
  ],
  markdown: {
    lineNumbers: true, // 代码块显示行号
  },
  search: true,
  searchMaxSuggestions: 10,
  plugins: [
    ["@vuepress/back-to-top"],
    [
      "@vuepress/last-updated",
      {
        transformer: (timestamp, lang) => {
          // 不要忘了安装 moment
          const moment = require("moment");
          moment.locale(lang);
          return moment(timestamp).fromNow();
        },
      },
    ],
    ["vuepress-plugin-code-copy", { successText: "复制成功!" }],
  ],
  //主题配置-----------------------------------------------------------------------------------------
  theme: "reco", //需要下载对应主题  npm install vuepress-theme-reco --save-dev
  themeConfig: {
    logo: "/logo.jpg",
    author: "恶作剧",
    authorAvatar: "/avatar.jpg",
    sidebarDepth: 2, // 将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
    lastUpdated: true, // 文档更新时间：每个文件git最后提交的时间
    dateFormat: "YYYY-MM-DD HH:mm:ss", // 自定义时间格式
    //displayAllHeaders: true,//显示所有页面标题来链接，默认false
    // 在所有页面中启用自动生成子侧边栏，原 sidebar 仍然兼容
    subSidebar: "auto",
    // 代码块样式（默认——tomorrow）
    codeTheme: "solarizedlight",
    // 博客配置
    type: "blog",
    blogConfig: {
      category: {
        location: 2, // 在导航栏菜单中所占的位置，默认2
        text: "博客", // 默认文案 “分类”
        target: "_blank",
      },
      tag: {
        location: 3, // 在导航栏菜单中所占的位置，默认3
        text: "Tag", // 默认文案 “标签”
        target: "_blank",
      },
      socialLinks: [
        // 信息栏展示社交信息
        { icon: "reco-github", link: "https://github.com/prank-xcw/" },
      ],
    },
    nav: navConfig,
    //sidebar: sidebarConfig,
  },
};
