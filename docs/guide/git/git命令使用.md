---
title: git命令使用

categories: git
tags:
  - git
---







## 代码拉取

```sh
# 拉取代码
git clone https://xxx.git
```









## :question:代码拉取443

> 设置代理（clash）

```sh
# 设置 HTTP 代理
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890

# 或者设置 SOCKS5 代理
git config --global http.proxy socks5://127.0.0.1:7890
git config --global https.proxy socks5://127.0.0.1:7890

```



> 取消代理

```sh
git config --global --unset http.proxy
git config --global --unset https.proxy
```

