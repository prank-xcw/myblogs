---
title: docker安装与使用nginx
categories: docker
abbrlink: 2ec0109e
tags:
  - docker
  - nginx
---





[TOC]





## 安装nginx

1. **搜索相关版本 **

   ```
   docker search nginx
   ```

   

2. **拉取最新版本**

   ```
   docker pull nginx:latest
   ```

   

3. **查看本地镜像**

   ```
   docker images
   ```

   

4. **运行容器 **

   ```sh
   #docker run -itd --name <容器名> -p 宿主机端口:容器端口 <镜像名>
   docker run -itd --name nginx-test -p 8080:80  nginx
   ```

   - **--name nginx-test**：容器名称。
   - **-p 8080:80**： 端口进行映射，将本地 8080 端口映射到容器内部的 80 端口。
   - **-d **： 设置容器在在后台一直运行
   - **-it	：** 可以进行交互(可进入容器)

5. **安装成功**

   访问服务器8080端口即可进入nginx主页。







## 配置Nginx映射目录

1. **宿主机创建Nginx存储目录**

   ```sh
   #创建目录
   mkdir -p /root/nginx/www /root/nginx/logs /root/nginx/conf
   ```

   > www: nginx存储网站网页的目录
   >
   > logs: nginx日志目录
   >
   > conf: nginx配置文件目录

   

2. **将容器中配置文件复制到本地**

   ```sh
   #查看容器
   docker ps -a
   ```

   ![](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20220408151813881.png)

   

   ```sh
    #指定容器id 
    docker cp  2d103e994bee:/etc/nginx/nginx.conf /root/nginx/conf
   ```

   

3. **创建新容器并映射目录**

   ```sh
   #创建容器名为 nginx-web的容器
   docker run -itd -p 80:80 --name nginx-web \
   -v /root/nginx/www:/usr/share/nginx/html \
   -v /root/nginx/conf/nginx.conf:/etc/nginx/nginx.conf \
   -v /root/nginx/logs:/var/log/nginx \
   -v /app/down:/app/down \
   nginx-web
   ```

   

   

4. **本地创建index.html文件**

   在/root/nginx/www/创建文件,输入以下内容保存

   ```html
   <!DOCTYPE html>
   <html>
   <head>
   <meta charset="utf-8">
   <title>docker搭建nginx</title>
   </head>
   <body>
       <h1>docker搭建nginx映射成功</h1>
   </body>
   </html>
   ```

5. **访问服务器80端口,出现页面内容则映射成功**





## Nginx反向代理







## Nginx使用目录浏览功能

启用目录浏览访问，nginx默认没有开启该功能，要开启则要在server或local代码块中添加 autoindex on;



1. **修改nginx.conf文件,在server代码块中添加以下代码**

   ```sh
   ##虚拟目录开启目录流量 指定到/app/down/目录下
   location /down/ {
                 alias /app/down/;
                 #目录显示文件
                 autoindex on;
                 #off 显示kb，mb，gb
                 autoindex_exact_size off;
                 #服务器时间
                 autoindex_localtime on;
   
   }
   ```

   ![](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20210421140919170.png)

   > alias 指向的目录需要和宿主机建立映射