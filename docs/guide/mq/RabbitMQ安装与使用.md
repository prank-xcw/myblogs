---
title: RabbitMQ安装与使用
sidebar: auto
categories: mq
tags:
  - mq
  - brew
---







## 介绍

> 🚀 RabbitMQ版本：4.1.3





### 核心端口

|   端口    |            名称/协议             |                           用途说明                           | 默认状态 |
| :-------: | :------------------------------: | :----------------------------------------------------------: | :------: |
| **5672**  |          AMQP 0-9-1/1.0          | **主通信端口** 客户端应用程序（生产者/消费者）通过此端口发送/接收消息 |   开启   |
| **15672** |        HTTP API/管理界面         | **Web 管理控制台** 提供可视化监控界面和REST API访问 (需启用`rabbitmq_management`插件) | 插件启用 |
| **4369**  | epmd (Erlang Port Mapper Daemon) | **节点发现端口** RabbitMQ集群节点之间互相发现和通信的基础端口 | 自动开启 |
| **25672** |        Erlang 分布式协议         | **节点间通信端口** 用于RabbitMQ集群中节点间的内部通信和数据同步 | 自动开启 |





### 关系模型图

```mermaid
graph LR
    P(Producer) -- 通过 Channel 发布消息 --> E(Exchange)
    E -- 根据 Binding 规则路由 --> Q(Queue)
    Q -- 通过 Channel 投递消息 --> C(Consumer)
    E -. Binding .- Q
```







## brew安装与配置

#### 1.安装

```sh
brew install rabbitmq
```

![image-20250807115041242](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20250807115041242.png)



#### 2.添加到PATH中

```sh
# 我安装的rabbitmq版本时4.1.3
export RABBIT_HOME=/opt/homebrew/Cellar/rabbitmq/4.1.3
export PATH=$PATH:$RABBIT_HOME/sbin

# 刷新环境变量
source ~/.zshrc
```





#### 3.启动

```sh
#方式一：
brew services start rabbitmq

#方式二
sh rabbitmq-server
```



#### 4.启用管理插件

```sh
# 执行命令启用管理页面，访问 http://localhost:15672 查看，默认账号密码为：guest
rabbitmq-plugins enable rabbitmq_management
```



#### 解决错误

**brew启动rabbitmq失败**

```sh
# 查看错误日志文件
cat /opt/homebrew/var/log/rabbitmq/std_error.log

# 重置权限
sudo chown -R $(whoami) /opt/homebrew/var/lib/rabbitmq

# 停用
brew services stop rabbitmq
# 重启启动
brew services start rabbitmq
```





### 配置文件介绍

:warning::warning::warning:注意本人配置文件是针对 4.1.3版本的配置，3.8.0以下个别配置不适用

目录`/opt/homebrew/etc/rabbitmq/`

```
/opt/homebrew/etc/rabbitmq/
├── rabbitmq-env.conf         # 环境变量配置文件
└── rabbitmq.conf             # 主配置文件（新格式）
```



#### 环境变量配置

**rabbitmq-env.conf**

```sh
# 监听地址 127.0.0.1(开发) / 内网IP(生产)
NODE_IP_ADDRESS=127.0.0.1

# 节点名称 格式：name@host
NODENAME=rabbit@localhost

# 主配置文件路径
# CONFIG_FILE=/opt/homebrew/etc/rabbitmq/rabbitmq.conf

# 数据存储路径
RABBITMQ_MNESIA_BASE=/opt/homebrew/var/lib/rabbitmq/mnesia

# 指定日志文件的存储目录
RABBITMQ_LOG_BASE=/opt/homebrew/var/log/rabbitmq 

# 插件路径
PLUGINS_DIR="/opt/homebrew/opt/rabbitmq/plugins:/opt/homebrew/share/rabbitmq/plugins"
```



#### 主配置文件

**rabbitmq.conf**

```sh
## ===========================================
## 核心服务器设置 (Core Server Settings)
## ===========================================

# 监听地址与端口
listeners.tcp.default = 5672         # AMQP 默认端口
listeners.ssl.default = 5671         # SSL 加密端口
management.tcp.port = 15672          # Web 管理端口
# management.ssl.port = 15671          # Web 加密管理端口
# management.ssl.cacertfile = /path/to/ca.pem
# management.ssl.certfile = /path/to/cert.pem
# management.ssl.keyfile = /path/to/key.pem

# 网络优化（生产环境必调）
tcp_listen_options.backlog = 1024     # 挂起连接队列长度
tcp_listen_options.nodelay = true     # 禁用 Nagle 算法
tcp_listen_options.keepalive = true   # 启用 TCP keepalive
tcp_listen_options.exit_on_close = false

# 连接并发设置
num_acceptors.tcp = 10                # TCP 接收器进程数
channel_max = 2048                     # 单连接最大通道数
connection_max = 1000                  # 最大客户端连接数


## ===========================================
## 集群与分布式 (Clustering)
## ===========================================

# 节点发现
cluster_formation.peer_discovery_backend = classic_config # 手动配置节点
cluster_formation.classic_config.nodes.1 = rabbit@node1
cluster_formation.classic_config.nodes.2 = rabbit@node2

# 网络分区策略  ignore 不处理分区、pause_minority 暂停少数派节点、pause_if_all_down 指定节点不可用时暂停、autoheal自动恢复
cluster_partition_handling = pause_minority

# 节点间通信
cluster_keepalive_interval = 10000            # 节点心跳间隔(ms)


## ===========================================
## 内存与磁盘管理 (Memory & Disk)
## ===========================================

# 内存管理
vm_memory_high_watermark.relative = 0.6   # 内存使用60%触发流控
vm_memory_high_watermark_paging_ratio = 0.5  # 内存达到50%水线时开始分页

# 磁盘管理 (临界值) absolute和relative 都配置取最大
disk_free_limit.absolute = 5GB           # 最小磁盘空间（低于则阻塞生产者）
disk_free_limit.relative = 1.5           # 磁盘空间 = 内存大小 * 该系数



## ===========================================
## 功能插件设置 (Plugins)
## ===========================================

# 管理插件
management.tcp.ip = 0.0.0.0                 # 监听地址
management.path_prefix = /mgt               # Web 路径
management.rates_mode = basic               # 数据采样模式

# Prometheus 监控
prometheus.return_per_object_metrics = true  # 细粒度指标
prometheus.path = /metrics                   # 指标端点

# MQTT 插件
mqtt.listeners.tcp.default = 1883           # MQTT 默认端口
mqtt.allow_anonymous = false                # 禁用匿名访问


## ===========================================
## 认证与授权 (Authentication)
## ===========================================

# 默认账户安全
loopback_users.guest = false              # 禁用geust远程访问 true 禁用 false 不禁用
default_user = guest                      # 默认用户名
default_pass = qwer1234!                  # 默认密码


```









## 更改guest密码

### 方法1

```sh
# 确保RabbitMQ正在运行
brew services start rabbitmq

# 更改guest密码
rabbitmqctl change_password guest "qwer1234!"

# 允许guest远程访问（可选）
rabbitmqctl set_user_tags guest administrator
```



### 方法2

```sh
# 停止服务
brew services stop rabbitmq

# 删除数据目录
rm -rf /opt/homebrew/var/lib/rabbitmq/mnesia/*

# 创建配置文件
echo "default_pass = qwer1234!" > /opt/homebrew/etc/rabbitmq/rabbitmq.conf

# 启动服务
brew services start rabbitmq
```





## 创建新用户

```sh
# 创建新管理员用户
rabbitmqctl add_user service_user qwer1234!
# 设置标签
rabbitmqctl set_user_tags service_user administrator

####################################################### 用户授权
# 管理员权限 读写配置权限
rabbitmqctl set_permissions -p / service_user ".*" ".*" ".*"
# 只允许操作以"orders_"开头的资源
rabbitmqctl set_permissions -p / service_user "^orders_.*" "^orders_.*" "^orders_.*"
# 只授予必要权限
rabbitmqctl set_permissions -p / service_user "^service_queue$" "^service_exchange$" "^service_queue$"



# 删除用户
#rabbitmqctl delete_user service_user
```

