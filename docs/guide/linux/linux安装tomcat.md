---
title: Centos7安装tomcat
abbrlink: 54147
categories: linux
tags:
  - linux
  - tomcat
---





## 1.下载tomcat

下载地址：`https://tomcat.apache.org/`

**下载完后解压安装（前提要有jdk才能启动使用）**



## 2.关闭防火墙 或开启端口

**关闭防火墙**

```shell
#查看防火墙状态
firewall-cmd --state 
#关闭防火墙
systemctl stop firewalld
#开启禁止启动防火墙
systemctl disable firewalld
```

**开启8080端口**

```shell
#开放8080
firewall-cmd --zone=public --add-port=8080/tcp --permanent 

#重启防火墙
firewall-cmd --reload

#查看防火墙是否开启
firewall-cmd --query-port=8080/tcp

```



## 3.启动tomcat

**进入tomcat安装目录的bin中执行 `./start.sh`**

```shell
#启动时输出日志
./catalina.sh run
#启动tomcat
./startup.sh
#关闭tomcat
./shutdown.sh 

#查看端口
netstat -lnp | grep 8080
#查看进程
 ps -ef|grep tomcat

```

