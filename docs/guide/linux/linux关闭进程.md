---
title: linux关闭进程
categories: linux
tags:
  - linux
---







## 端口占用情况

```shell
#查看指定端口是否运行进程
netstat -lnpt | grep 8080
```



## 查看java运行情况

```shell
#方法一：查询出对应进程号
ps -ef | grep java

#方法二：指定启动类查看，查出进程号
 ps -ef |grep $USER| grep "SpringBootDemo" | grep -v grep | awk '{print $2}'

```
