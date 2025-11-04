---
title: dockerCompose使用
sidebar: auto
categories: docker
---



## docker-composem命令

### 构建镜像

```sh
# 只构建镜像，不启动容器
docker-compose -f docker-compose.yml build
```



### 启动容器

```sh
# 启动容器
docker-compose -f docker-compose.yml up -d

# 仅启动特定服务
docker-compose -f docker-compose.yml up -d service_name
```



### 构建并启动

```sh
# 指定yml 构建全部镜像并启动容器
docker-compose -f docker-compose.yml up -d --build

# 指定yml 构建指定镜像(Test)并启动容器
docker-compose -f docker-compose.yml up -d --build  Test
```



### 停止容器

```sh
# 指定yml 停止并删除容器
docker-compose -f docker-compose.yml  down
```



### 清理悬空镜像

当您使用 `docker-compose build` 重建服务时，新镜像会替换旧镜像的标签。

```sh
# 第一次构建
docker-compose build
# 输出: Successfully tagged myapp:latest

# 修改代码后再次构建
docker-compose build
# 新镜像: myapp:latest
# 旧镜像: <none> (dangling)



# 删除所有悬空镜像
docker image prune

# 强制删除（无需确认）
docker image prune -f

# 删除所有未被使用的镜像（包括悬空镜像）
docker image prune -a

# 删除特定时间前的悬空镜像
docker image prune --filter "until=24h"
```







## docker生成离线包

```sh
# 进入项目目录
cd /path/to/your/project

# 构建镜像（使用您的 docker-compose.yml）
docker-compose -f docker-compose.yml build

# 保存镜像为离线包
docker save -o bjyd-offline-images.tar \
    bjyd-module-business:1.0 \
    $(docker images --filter "dangling=false" --format "{{.Repository}}:{{.Tag}}" | grep -v '<none>')
    
    
    

# 使用 scp 传输（替换目标机器信息）
scp bjyd-offline-images.tar user@target-machine:/path/to/destination/
```



```docker
docker save -o /home/appuser/deploy/docker-image/test/manage-web_$1.tar wanda-spm/manage-web:$1
```



