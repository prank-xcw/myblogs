---
title: docker安装redis
categories: redis
tags:
  - docker
  - redis

---





## 安装redis

### 1.拉取镜像

```shell
docker pull redis
```

### 2.下载对应版本的配置

```http
https://redis.io/docs/management/config
```



### 3.创建映射配置文件

配置文件上传至`/home/redis/conf` 并在`/home/redis/log `目录中创建空文件`redis.log`

```shell
mkdir -p /home/redis/conf /home/redis/data /home/redis/log  

#创建挂载日志文件，并授权
vi /home/redis/log/redis.log
chmod 777 /home/redis/log/redis.log
```

配置文件内容为

```conf
#默认127.0.0.1改为0.0.0.0，解除本地连接限制
bind 0.0.0.0

#开启保护模式，限制为本地访问,默认yes
protected-mode no

#端口设置6379
port 6379

#给redis设置密码
requirepass 123456

# 是否开启AOF持久化
appendonly yes

# 对访问客户端的一种心跳检测，每个n秒检测一次。单位为秒，如果设置为0，则不会进行Keepalive检测
tcp-keepalive 300

#是否为守护进程，设置为no，因为该配置和docker run中-d参数冲突，会导致容器一直启动失败
daemonize no

# 指定日志文件名
logfile "/var/log/reids.log"
```



### 4.运行容器

```shell
docker run -itd --name redis -p 6379:6379 -v /home/redis/conf/redis.conf:/usr/local/etc/redis/redis.conf -v /home/redis/data/:/data -v /home/redis/log/redis.log:/var/log/redis.log  redis:7 redis-server /usr/local/etc/redis/redis.conf
```

> 说明：
>
> `--name redis` 指定容器名称
>
> `-v /home/redis/conf/redis.conf:/usr/local/etc/redis/redis.conf` 将宿主机redis.conf挂载到容器中
>
> `-v /home/redis/data/:/data` 将redis数据存储路径挂载到宿主机目录中
>
> `-v /home/redis/log/redis.log:/var/log/redis.log` 挂载redis日志
>
> `redis-server /usr/local/etc/redis/redis.conf` 启动redis服务并指定配置文件







## redis集群











