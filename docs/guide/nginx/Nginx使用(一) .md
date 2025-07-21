---
title: Nginx使用(一)
categories: nginx
abbrlink: 64d53267
tags:
  - nginx
---



## 安装所需环境

Nginx 是 C语言 开发，建议在 Linux 上运行，当然，也可以安装 Windows 版本，本篇则使用 [CentOS](http://www.linuxidc.com/topicnews.aspx?tid=14) 7 作为安装环境。



**一. gcc 安装**
安装 nginx 需要先将官网下载的源码进行编译，编译依赖 gcc 环境，如果没有 gcc 环境，则需要安装：

```shell
yum install gcc-c++
```



**二. PCRE pcre-devel 安装**
PCRE(Perl Compatible Regular Expressions) 是一个Perl库，包括 perl 兼容的正则表达式库。nginx 的 http 模块使用 pcre 来解析正则表达式，所以需要在 linux 上安装 pcre 库，pcre-devel 是使用 pcre 开发的一个二次开发库。nginx也需要此库。命令：	

```shell
yum install -y pcre pcre-devel
```



**三. zlib 安装**
zlib 库提供了很多种压缩和解压缩的方式， nginx 使用 zlib 对 http 包的内容进行 gzip ，所以需要在 Centos 上安装 zlib 库。

```shell
yum install -y zlib zlib-devel
```



**四. OpenSSL 安装**
OpenSSL 是一个强大的安全套接字层密码库，囊括主要的密码算法、常用的密钥和证书封装管理功能及 SSL 协议，并提供丰富的应用程序供测试或其它目的使用。
nginx 不仅支持 http 协议，还支持 https（即在ssl协议上传输http），所以需要在 Centos 安装 OpenSSL 库。

```shell
yum install -y openssl openssl-devel
```



## 安装Nginx

1. 官网下载压缩包：http://nginx.org/en/download.html![image-20210421094236874](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20210421094236874.png)
2. 使用`wget`命令下载（推荐）。确保系统已经安装了wget，如果没有安装，执行 yum install wget 安装。

```s
#网络下载
wget -c http://nginx.org/download/nginx-1.20.0.tar.gz
```



## 解压Nginx

```shell
tar -zxvf nginx-1.20.0.tar.gz
cd nginx-1.20.0
```



## 配置Nginx

方式一：使用默认配置

```shell
./configure
```



方式二：自定义配置

```
./configure \
--prefix=/usr/local/nginx \
--conf-path=/usr/local/nginx/conf/nginx.conf \
--pid-path=/usr/local/nginx/conf/nginx.pid \
--lock-path=/var/lock/nginx.lock \
--error-log-path=/var/log/nginx/error.log \
--http-log-path=/var/log/nginx/access.log \
--with-http_gzip_static_module \
--http-client-body-temp-path=/var/temp/nginx/client \
--http-proxy-temp-path=/var/temp/nginx/proxy \
--http-fastcgi-temp-path=/var/temp/nginx/fastcgi \
--http-uwsgi-temp-path=/var/temp/nginx/uwsgi \
--http-scgi-temp-path=/var/temp/nginx/scgi
```

> 注：将临时文件目录指定为/var/temp/nginx，需要在/var下创建temp及nginx目录





## 编译Nginx

```
make
make install
```



```shell
#查找安装路径
whereis nginx
```

![image-20210421110806636](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20210421110806636.png)





## Nginx命令

```shell
cd /usr/local/nginx/sbin/
./nginx				#启动
./nginx -c /usr/local/nginx/conf/nginx.conf #指定配置文件启动
./nginx -v			#查看版本
./nginx -t			#测试conf文件语法是否正确
./nginx -s stop		#停止服务
./nginx -s quit		#优雅的关闭服务
./nginx -s reload	#重启服务

#查询nginx进程
ps aux|grep nginx

```





## Nginx配置文件高亮提示

```shell
#进入nginx压缩包文件
cd /app/nginx-1.20.0/

#进入contrib/vim/
cd contrib/vim/

#复制所有文件到 /usr/share/vim/vimfiles/
cp -r ./* /usr/share/vim/vimfiles/

```

![image-20210421114521303](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20210421114521303.png)





参考链接： https://www.cnblogs.com/liujuncm5/p/6713784.html