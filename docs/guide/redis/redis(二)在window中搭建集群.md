---
title: redis(二)在window中搭建集群
abbrlink: 46636
categories: redis
tags:
  - redis
---

## redis主从复制

### 1.修改配置文件

```shell
#常用命令
info replication 						#查看主从信息
slaveof host地址 port号 				  #指定为主服务
slaveof on one							#不指定任何主服务
```

将解压后的redis中redis.windows.conf文件复制二份，并进行命名与配置`分为一主两从`

![image-20201231165524740](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20201231165524740.png)



`主节点master：redis.windows6379.conf`

```sh
port 6379
```

 `从节点slaveof：redis.windows6380.conf`

```sh
port 6380

#使用命令设置主节点
slaveof 127.0.0.1 6379  #设置master服务器为6379
```

`从节点slaveof：redis.windows6381.conf`

```sh
port 6381

#使用命令设置主节点
slaveof 127.0.0.1 6379  #设置master服务器为6379
```





### 2.启动服务

#### cmd命令启动

远程工具下载：https://github.com/qishibo/AnotherRedisDesktopManager/releases

启动三个服务端，使用远程连接工具生成三个客户端

```sh
redis-server.exe redis.windows6379.conf
redis-server.exe redis.windows6380.conf
redis-server.exe redis.windows6381.conf
```



打开远程工具，连接对应客户端，在`6380、6381中输入命令设置为6379的从节点`

![image-20201231171333167](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20201231171333167.png)

设置好主从后，在6379新增一个key，在6380、6381中可以查到，但是从节点不能新增

![image-20201231171730546](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20201231171730546.png)





#### redis服务启动

其实redis可安装成redis服务，也可设置开启自启动

```sh
#新增为服务
redis-server.exe --service-install 配置文件 --service-name 生成的服务名
#删除服务
redis-server.exe --service-uninstall --service-name 服务名
```



1. redis目录打开cmd 输入命令 生成服务

   `redis-server.exe --service-install redis.windows6379.conf --service-name redis6379`

   `redis-server.exe --service-install redis.windows6380.conf --service-name redis6380`

   `redis-server.exe --service-install redis.windows6381.conf --service-name redis6381`

   ![image-20201231172351594](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20201231172351594.png)

   

2. `win+r 输入services.msc`打开服务可看到已添加到服务中

   ![image-20201231172539782](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20201231172539782.png)

   

3. 卸载命令`redis-server --service-uninstall --service-name redis6379`



#### redis脚本启动

- 新建三个`bat启动文件`

  ![image-20201231173047267](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20201231173047267.png)



- 按照以下格式依次输入到三个文件中

```sh
@echo off
SET DIR=%~dp0\Redis-6379\			#Redis-6379代表目录
START %DIR%redis-server.exe %DIR%redis.windows6379.conf	# redis.windows6379.con指定配置文件
```







## redis哨兵模式sentinel

- 方式一：新建sentinel.conf文件后   cmd直接执行命令启动` redis-server.exe sentinel.conf`

  ```sh
  # 当前Sentinel服务运行的端口
  port 26379
  
  #监视一个名为mymaster的master,master为172.0.0.1,端口号为6380,而将这个master判断为失效,至少需要2个sentinel同意(只要同意 Sentinel 的数量不达标，自动故障迁移就不会执行)不过要注意， 无论你设置要多少个 Sentinel 同意才能判断一个服务器失效， 一个 Sentinel 都需要获得系统中多数 Sentinel 的支持， 才能发起一次自动故障迁移 
  sentinel monitor master 127.0.0.1 6380 1
  
  # 哨兵认定当前主节点master失效的判别间隔时间
  sentinel down-after-milliseconds master 5000
  sentinel failover-timeout mymaster 180000 #故障转移的超时时间  
  
  
  sentinel config-epoch master 2
  sentinel leader-epoch master 2
  ```

- 方式二 ：服务启动

  ```shell
  #cmd执行命令生成服务
  #格式  redis-server.exe --service-install conf配置文件 --service-name 想要生成的服务名
  redis-server.exe --service-install sentinel.conf --service-name redis-sentinel
  ```

  

- 方式三：新建sentinel启动脚本

  ```sh
  #新建sentinel.bat输入以下内容
  @echo off
  SET DIR=%~dp0\
  START %DIR%redis-server.exe %DIR%sentinel.conf --sentinel
  ```

  