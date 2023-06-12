---
title: Linux防火墙配置
categories: linux
abbrlink: 57d4a2c8
tags:
  - linux
---









## 防火墙打开关闭

```sh
# 打开防火墙
systemctl start firewalld

# 关闭防火墙
systemctl stop firewalld

#重启防火墙
firewall-cmd --reload
```



## 查看开放端口

```sh
#查看已开放端口集合
firewall-cmd --zone=public --list-ports

#查看指定端口是否开放
firewall-cmd --query-port=6379/tcp
```



## 开放端口

```sh
# 永久性开放端口
firewall-cmd --permanent --zone=public --add-port=6379/tcp

#移除开放端口
firewall-cmd --permanent --remove-port=6379/tcp
```

