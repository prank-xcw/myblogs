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

1. **搜索相关版本**

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

   

4. **运行容器**

   ```sh
   #docker run -itd --name <容器名> -p 宿主机端口:容器端口 <镜像名>
   docker run --name mysql -p 3306:3306 --restart=always  -e MYSQL_ROOT_PASSWORD=123456 -e TZ=Asia/Shanghai -itd mysql
   ```

   - 参数说明 `--name mysql5.7`表示为该容器起一个名称，与容器ID对应，方便后续的使用，注意该名称在Docker容器中是唯一的。
   - `-p 3306:3306`将宿主机的3306端口映射到容器的3306端口，外部使用3306来访问。
   - `--restart=always`表示Docker容器启动后该容器也启动。
   - `-e MYSQL_ROOT_PASSWORD=123456` 初始化 root 用户的密码为123456。
   - `-e TZ=Asia/Shanghai`设置时区
   - `-v /root/mysql/log:/var/log/mysql`等设置表示容器外部（也就是宿主机）与容器内部中的目录进行映射，方便对容器内部的mysql进行配置。需要注意的是如果启动其它的mysql容器，该映射路径需要修改，否则存在冲突外部无法连接。
   - `-itd mysql` 表示指定镜像名称，并后台进程运行,可以进行交互。



## 配置映射

1. **创建映射目录**

   创建映射目录`mkdir -p /home/mysql/log /home/mysql/data /home/mysql/conf`

   

2. **复制容器相关映射文件**

   ```shell
   docker cp mysql:/etc/mysql /home/mysql/conf
   docker cp mysql:/etc/my.cnf  /home/mysql/conf
   ```

   > 当 MySQL 服务启动时会以 /etc/mysql/my.cnf 为配置文件，本文件会导入 /etc/mysql/conf.d 目录中所有以 .cnf 为后缀的文件。
   >
   > 这些文件会拓展或覆盖 /etc/mysql/my.cnf 文件中的配置项。因此你可以创建你自己需要的配置文件并挂载至 MySQL 容器中的 /etc/mysql/conf.d 目录
   >
   > 

3. **删除旧容器并启动新容器**

   ```shell
   #停止
   docker stop mysql
   #删除旧容器
   docker rm mysql
   #启动新容器
   docker run -itd --name mysql -p 3306:3306 --restart=always  \
   -e MYSQL_ROOT_PASSWORD=123456 \
   -e TZ=Asia/Shanghai \
   -v /home/mysql/log:/var/log/mysql \
   -v /home/mysql/data:/var/lib/mysql \
   -v /home/mysql/conf/:/etc/mysql \
   mysql
   
   
   #mysql日志映射
   -v /home/mysql/log:/var/log/mysql 
   #mysql数据映射
   -v /home/mysql/data:/var/lib/mysql 
   #mysql配置映射
   -v /home/mysql/conf/:/etc/mysql
   ```

   

   > 会输出数据文件的存放路径
   > show variables like '%datadir%';
   >
   > 库表大小是否敏感 lower_case_file_system变量 0敏感 1不敏感
   > show variables like "%case%";

   

## 开启远程登录

```mysql
mysql -u root -p
use mysql;
#查看用户权限信息
select host, user from user;
+-----------+------------------+
| host      | user             |
+-----------+------------------+
| %         | root             |
| localhost | mysql.infoschema |
| localhost | mysql.session    |
| localhost | mysql.sys        |
| localhost | root             |
+-----------+------------------+

#更新root用户连接 若root用户没有host=%的值则改为%
#update user set host='%' where user='root';

#授权MySql远程访问;
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%'WITH GRANT OPTION;
```



> 失败信息`Public Key Retrieval is not allowed` 将连接属性改为`allowPublicKeyRetrieval=true`



## 修改密码

```sh

ALTER USER 'root'@'localhost' IDENTIFIED BY '你的密码';
FLUSH PRIVILEGES;
```



