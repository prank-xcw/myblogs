---
title: Centos7中安装MySQL5.7.30
abbrlink: 820
categories: linux
tags:
  - linux
  - mysql
---









> 接下来介绍mysql的两中安装方式，压缩包安装 和 yum源安装



# 压缩包安装

## 一、MySQL下载地址

`下载地址：`https://downloads.mysql.com/archives/community/



## 二、环境监测



**是否有安装mysql：**rpm -qa|grep mysql

**有则卸载：**rpm -e --nodeps mysql-libs-5.1.52-1.el6_0.1.x86_64

**是否安装是否自带mariadb`这是mysql的一个分支`：**rpm -qa|grep mariadb

​	**使用rpm -e --nodeps命令全部卸载：**



## 三、解压安装

**1.解压：**

```sh
[root@128 opt]# tar -zxvf mysql-5.7.30-linux-glibc2.12-x86_64.tar.gz 
```

**2.解压完成后重命名并移动到/usr/local/**

```shell
[root@128 opt]# mv mysql-5.7.30-linux-glibc2 mysql-5.7.30
[root@128 opt]# mv mysql-5.7.30 /usr/local/mysql/
```

**3.检查mysql组和用户是否存在，如果没有则创建**

```shell
[root@128 opt]# cat /etc/group|grep mysql
[root@128 opt]# groupadd mysql
[root@128 opt]# useradd -r -g mysql mysql		#useradd -r参数表示mysql用户是系统用户，不可用于登录系统

```



**4.安装数据库**

```sh
#创建data目录
cd /usr/local/mysql/mysql-5.7.30
mkdir data

#/usr/local/mysql/mysql-5.7.30的所有者及所属组改为mysql
chown -R mysql.mysql /usr/local/mysql/mysql-5.7.30
```



**5.创建配置文件**

`在/usr/local/mysql/mysql-5.7.30/support-files目录下创建my_default.cnf输入配置`

```sh
[mysqld]
#设置mysql的安装目录
basedir =/usr/local/mysql/mysql-5.7.30
#设置mysql数据库的数据存放目录
datadir = /usr/local/mysql/mysql-5.7.30/data
#设置端口
port = 3306

socket = /tmp/mysql.sock
#设置字符集
character-set-server=utf8
#日志存放目录
log-error = /usr/local/mysql/mysql-5.7.30/data/mysqld.log
pid-file = /usr/local/mysql/mysql-5.7.30/data/mysqld.pid
#允许时间类型的数据为零(去掉NO_ZERO_IN_DATE,NO_ZERO_DATE)
sql_mode=ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
#ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
```

**拷贝或覆盖配置文件**

```sh
[root@128 support-files]# cp my_default.cnf /etc/my.cnf
```



**6.初始化Mysql**

```shell
[root@128 bin]# ./mysqld --defaults-file=/etc/my.cnf --basedir=/usr/local/mysql/mysql-5.7.30/ --datadir=/usr/local/mysql/mysql-5.7.30/data/ --user=mysql --initialize


#/bin/mysqld: error while loading shared libraries: libaio.so.1: cannot open shared object file: No such file or 就安装libaio，如果没有则跳过
 yum install libaio

```



**7.初始化后查看日志**

```shell
grep "password" /usr/local/mysql/mysql-5.7.30/data/mysqld.log  #查看临时密码
```



**8.启动脚本放到开机初始化目录**

```shell
cp /usr/local/musql/mysql-5.7.30/support-files/mysql.server /etc/init.d/mysql
```



**9.启动mysql**

```sh
service mysql start
```



**10.修改密码**

首先登陆MySQL，前面的那个是随机生成的。

```shell
./mysql -u root -p   #bin目录下,,,然后输入第七步的临时密码
```

在执行下面三步操作，然后重新登陆。

```SH
SET PASSWORD = PASSWORD('123456');							#新密码
ALTER USER 'root'@'localhost' PASSWORD EXPIRE NEVER;		#("密码永不过期")
FLUSH PRIVILEGES;											#更新配置
```



**11.远程连接**

这时候远程连接是不成功的，所以我们要配置远程连接

`登录数据库执行以下三个命令`

```sh
use mysql                                            #访问mysql库
update user set host = '%' where user = 'root';      #使root能再任何host访问
FLUSH PRIVILEGES;                                    #刷新
```



> 到这，已经安装好了，如果不希望每次进到bin目录下使用mysql命令，则执行一下命令。
>
> `ln -s  /usr/local/mysql/mysql-5.7.30/bin/mysql    /usr/bin`





# yum安装

选择版本地址：https://downloads.mysql.com/archives/community/

下载server和client两个



## 一、检测是否安装

```sh
yum list installed | grep mysql
```

**如果已安装则删除**

```sh
yum -y remove mysql-libs.x86_64
```

**检测mariadb是否安装，安装则删除（mariadb是从mysql来的，是它的一个分支，需要清理掉）**

```sh
rpm -qa|grep mariadb
rpm -e --nodeps mysql-libs.x86_64
```



## 二、下载mysql5.7 rpm源

`安装server和client、lib、common四个`

```sh
wget https://downloads.mysql.com/archives/get/p/23/file/mysql-community-server-5.7.30-1.el7.x86_64.rpm
wget https://downloads.mysql.com/archives/get/p/23/file/mysql-community-client-5.7.30-1.el7.x86_64.rpm
wget https://downloads.mysql.com/archives/get/p/23/file/mysql-community-libs-5.7.30-1.el7.x86_64.rpm
wget https://downloads.mysql.com/archives/get/p/23/file/mysql-community-common-5.7.30-1.el7.x86_64.rpm 

 #拒绝连接可加入参数-e robots=off 
```

`使用wget下载速度很慢，我们可以使用mwget加速wget`

安装mget

```sh
wget http://jaist.dl.sourceforge.net/project/kmphpfm/mwget/0.1/mwget_0.1.0.orig.tar.bz2

tar -xjvf mwget_0.1.0.orig.tar.bz2

cd mwget_0.1.0.orig

#执行./configure
./configure
```

如果出现 error: C++ compiler cannot create executables 说明没有安装c++编译器 安装一个c++编译器就可以了

```sh
yum install gcc-c++
#安装完后仍要执行一下 ./configure
```

如果执行./configure 出现 configure: error: Your intltool is too old.  You need intltool 0.35.0 or later.需要安装0.35.0以上的版本

```sh
yum install intltool
#安装完后仍要执行一下 ./configure
```

然后做最后的安装(编译一下)

```sh
make
make install
#安装完毕后 可以使用mwget下载
mwget url
```



## 三、安装rpm安装包

```sh
#先安装common
rpm -ivh mysql-common.xxx
#在安装lib
rpm -ivh mysql-lib.xxx
#在安装client
rpm -ivh mysql-client.xxx
#安装服务端server
rpm -ivh mysql-server.xxx
```



## 四、启动服务

`查看是否成功`

```
mysql -V
```

`运行mysql`

```
service mysqld start
```



## 五、取得mysql初始化随机密码

```sh
grep "password" /var/log/mysqld.log
```



## 六、登录mysql

```
mysql -u root -p
粘贴密码
```



## 七、修改密码并设置可远程连接

**修改密码**

```SH
set global validate_password_policy=0;						#设置密码规则
set global validate_password_length=1;							
ALTER USER 'root'@'localhost' IDENTIFIED BY '你的密码';
FLUSH PRIVILEGES;											#更新配置
```



## 八、开放端口

```shell
#开放mysql默认的端口 3306
firewall-cmd --zone=public --add-port=3306/tcp --permanent 

#重启防火墙
firewall-cmd --reload

#查看端口是否开放
firewall-cmd --query-port=3306/tcp

```







# **远程连接**

**配置mysql数据库可以远程连接**

```sh
use mysql                                            #访问mysql库
update user set host = '%' where user = 'root';      #使root能再任何host访问
FLUSH PRIVILEGES;                                    #刷新
```



# 更改密码策略

```sql
-- 查看当前的密码策略
SHOW VARIABLES LIKE 'validate_password%';
-- 设置密码复杂度-- 设置为 LOW，放宽密码复杂性要求
SET GLOBAL validate_password_policy = LOW;
-- 设置最小密码长度为 6
SET GLOBAL validate_password_length = 6;
```



# Mysql新增用户

```sql
-- 创建用户指定密码
CREATE USER 'hive'@'localhost' IDENTIFIED BY '12345678'; 
-- 设置可远程连接
GRANT ALL ON *.* TO 'hive'@'localhost';
#刷新mysql系统权限关系表
flush privileges;
```







> 查看安装路径
>
> rpm -qa | grep mysql     `查看是否安装`
>
> rpm -ql   软件名				`查看详细信息`