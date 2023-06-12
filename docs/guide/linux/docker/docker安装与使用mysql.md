---
title: docker安装与使用mysql
categories: docker
abbrlink: 1f97b6a7
tags:
  - docker
  - mysql
---





[TOC]



## 安装mysql

1. **搜索相关版本 **

   ```
   docker search mysql
   ```

   

2. **拉取最新版本**

   ```
   docker pull mysql:latest
   ```

   

3. **查看本地镜像**

   ```
   docker images
   ```

   

4. **运行容器 **

   ```sh
   #docker run -itd --name <容器名> -p 宿主机端口:容器端口 <镜像名>
   docker run --name mysql -p 3306:3306 --restart=always  -e MYSQL_ROOT_PASSWORD=xcw1017@ -e TZ=Asia/Shanghai -itd mysql
   
   #可加入相关目录映射配置
   -v /root/mysql/log:/var/log/mysql -v /root/mysql/data:/var/lib/mysql -v /root/mysql/conf:/etc/mysql
   ```

   - 参数说明
     --name mysql5.7表示为该容器起一个名称，与容器ID对应，方便后续的使用，注意该名称在Docker容器中是唯一的。
     -p 3307:3306将宿主机的3307端口映射到容器的3306端口，外部使用3307来访问。
     --restart=always表示Docker容器启动后该容器也启动。
     -e MYSQL_ROOT_PASSWORD=xcw1017@初始化 root 用户的密码。
     -e TZ=Asia/Shanghai设置时区
     -v /root/mysql/log:/var/log/mysql等设置表示容器外部（也就是宿主机）与容器内部中的目录进行映射，方便对容器内部的mysql进行配置。需要注意的是如果启动其它的mysql容器，该映射路径需要修改，否则存在冲突外部无法连接。
     -itd mysql 表示指定镜像名称，并后台进程运行,可以进行交互。