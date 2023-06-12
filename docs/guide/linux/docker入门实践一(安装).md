---
title: docker入门实践一(安装)
categories: linux
abbrlink: bfe6fd56
tags:
  - linux
  - docker
---







> 环境：
>
> Centos7





> docker原名 `dotCloud`2010开源,在2013发布正式版本1.0
>
> 注意：必须使用内核3.10及其以上版本，才可以使用docker。



**查看当前内核版本（可选）**

```shell
uname -r
```

**升级内核（可选）**

```shell
yum -y update
```



# 删除旧版本(可选)

`如果安装了旧版本，卸载旧版本，没有安装则可以忽略。旧版本名称为docker或docker-engine`

```sh
#查看是否已经安装docker
yum list installed | grep docker

#卸载相关yum源
sudo yum remove docker \
                docker-client \
                docker-client-latest \
                docker-common \
                docker-latest \
                docker-latest-logrotate \
                docker-logrotate \
                docker-engine
                
#删除主机上的映像、容器、卷或自定义配置文件
sudo rm -rm /var/lib/docker
```



# 安装docker-ce

1. **安装工具包，也叫依赖包**

   ```shell
   sudo yum install -y yum-utils device-mapper-persistent-data lvm2
   ```

2. **配置docker安装源：**

   ```shell
   #官方源
   sudo yum-config-manager  --add-repo https://download.docker.com/linux/centos/docker-ce.repo
   
   #国内阿里镜像源
   sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
   ```

3. **安装docker：**

   安装最新版docker

   ```shell
    sudo yum install docker-ce docker-ce-cli containerd.io
   ```

   如果不想安装最新办,可查看仓库选择版本安装

   ```shell
   #列表显示出所有版本
   yum list docker-ce --showduplicates | sort -r
   
   # 选择特定版本安装
   sudo yum install docker-ce-<version> docker-ce-cli-<version> containerd.io
   ```

4. **启动docker服务：**

   ```shell
   systemctl start docker
   
   #开机自启
   sudo systemctl enable docker
   
   #重启docker服务
   sudo systemctl daemon-reload
   sudo systemctl restart docker
   ```



# 卸载docker-ce

1. **卸载yum源**

   ```shell
   sudo yum remove docker-ce docker-ce-cli containerd.io
   ```

2. **删除相关目录及镜像**

   ```shell
    sudo rm -rf /var/lib/docker
    sudo rm -rf /var/lib/containerd
   ```
   
3. **重启docker服务**

   ```shell
   #重启docker服务
   sudo systemctl daemon-reload
   sudo systemctl restart docker
   ```

   

# Docker常用命令

**docker命令官方文档：**https://docs.docker.com/engine/reference/run/



## 帮助命令

```shell
docker version	# docker版本信息
docker info		# docker详细信息
docker <命令> --help	# --help提示详细参数
```



## 镜像命令(Image)

**docker images  列出本地的镜像**

```shell
docker images 		# 列出镜像

#可选参数
 -a					# 列出所有镜像
 -f					# 过滤镜像条件
 -q					# 只显示镜像id
```



**docker serach 搜索镜像 **

```shell
# docker search mysql:5.7

#可选参数
-f 					# 过滤条件
```



**docker pull 拉取镜像**

```shell
docker pull <imageName>		# 拉取指定镜像名

docker pull <imageId>		# 指定镜像id
```



**docker rmi 删除本地镜像**

```shell
docker rmi -f <imageName>		# 指定镜像名删除

docker rmi -f <imageId>			# 指定镜像id删除

#清除失效镜像
docker rmi $(docker images -f "dangling=true" -q)

```



## **容器命令(Container）**

**docker  run  启动并且创建容器**

```shell
docker run [可选参数] imageName					#指定镜像名启动新容器

#可选参数
-d			# 后台启动
-it			# 可以进行交互(可进入容器)
-p			# 端口映射
	-p	主机端口:容器端口
	-p	主机ip:主机端口:容器端口

-name 		# 生成容器名称
-restart    # 自动重启选择  no不重启(默认)		always始终重启		on-failure退出时重启

```



**docker ps 查看容器状态**

```shell
docker	ps	# 显示正运行的容器

#可选参数
	-a		# 列出所有容器
	-l		# 列出最近一次启动的容器
	-q		# 列出最近一次运行的容器id
```



**docker exec 进入容器**

```shell
docker exec -it 容器名 /bin/bash

#-it  	    与容器进行连接
#/bin/bash  开启与容器的一个终端操作
```



**退出容器**

```shell
exit #退出容器
```



**启动与停止容器**

```shell
docker start/stop/restart <container> 	 #：开启/停止/重启container
docker start [container_id]				 #：再次运行某个container （包括历史container）
```



**docker rm 删除容器**

```shell
docker rm <container...> #：删除一个或多个container
docker rm `docker ps -a -q` #：删除所有的container
```



**端口映射**

```sh
docker run  -itd -name <容器名> -p 9000:9000 <镜像名>
-name  指定容器名称
-p 9000:9000 本地9000映射到容器9000
```

```sh
#修改端口映射   其中的hash_of_the_container是docker镜像的hash值，可以通过docker ps查看
vim  /var/lib/docker/containers/[hash_of_the_container]/hostconfig.json 
```





