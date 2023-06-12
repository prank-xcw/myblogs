---
title: redis(一)安装与使用
abbrlink: 55384
categories: redis
tags:
  - redis
---

## redis安装

linux：https://redis.io/download

windows: https://github.com/MicrosoftArchive/redis/releases

远程工具：https://github.com/qishibo/AnotherRedisDesktopManager/releases

windows版本直接下载压缩包，解压即可；

#### Linux安装redis：

1. 通过远程管理工具，将压缩包拷贝到Linux服务器中，执行解压操作 `tar -zxf redis-4.0.9.tar.gz`

2. 进入解压文件目录使用`make`对解压的Redis文件进行编译

   注：如果在编译过程中出现问题，有可能是安装包下载的有误，这里可以尝试的用别人下载的安装包或者直接用

   `wget http://download.redis.io/releases/redis-4.0.9.tar.gz`

   如果发现上述读不能解决问题，请参照该链接：https://www.cnblogs.com/liu2-/p/6914159.html

3. .编译成功后，进入src文件夹，执行make install进行Redis安装

4. 编辑**redis.conf**设置**后台启动redis**：daemonize属性改为 yes(表示需要在后台启动)

5. 启动redis服务，并指定启动服务配置文件，**进入redis默认安装目录/usr/local/bin**

   **启动服务**： ./redis-server   redis.conf

   **启动客户端**：./redis-cli 

   ​					config get requirepass						**查看密码**

   ​					config set requirepass "admin"  	  **设置密码**

   ​					auth admin	  									 **密码登录**

   **密码登录：**redis-cli -h 127.0.0.1 -p 6379 -a admin

   ```
   redis-cli #客户端
   redis-server #服务器启动
   redis-sentin #redis集群使用
   rdb文件，快照
   aof记录每一步
   ```

   



## redis的持久化

> ### RDB快照

如何触发RDB快照

测试方法：在指定时间内达到操作次数，就会产生备份文件dump.rdb，此文件会产生在启动redis时的目录中。

1. 第一步修改redis.conf配置文件中的参数：[root@localhost ~]# vim  安装目录下的redis.conf文件，设置两分钟内10次修改就会触发RDB快照

   ```
   save 900 1
   save 120 10
   sava 60 10000
   ```

   

2. 启动服务：服务目录为 /usr/local/bin，Redis服务启动时是在 /bin  目录下启动的，那么产生备份文件dump.rdb就在此目录下，2分钟内添加11个值，查看bin目录下已经产生dump.rdb文件	

   ```
   redis-server  /app/redis-3.0.4/redis.conf	#启动服务
   ```

   

3. 第四步：将redis中的数据清空，并停掉redis服务

   ```
   flush db
   ```

4. 第五步：将dump.rdb备份文件复制回bin目录中，当启动redis服务时会自动读取文件还原数据

5. 第六步：启动服务，查看数据是否还原





优势

适合大规模的数据恢复

对数据完整性和一致性要求不高

 

劣势

 在一定间隔时间做一次备份，所以如果redis意外down掉的话，就会丢失最后一次快照后的所有修改

 Fork的时候，内存中的数据被克隆了一份，大致2倍的膨胀性需要考虑





## redis发布与订阅



> ### 发布

```javascript
publish c1 mess							#publish 频道 message
```



> ### 订阅

```javascript
subscribe a1 b1 c1						#subscribe 频道1 频道2 频道3
```





## redis配置

```properties
# Redis数据库索引（默认为0）
spring.redis.database=0
# Redis服务器地址
spring.redis.host=127.0.0.1
# Redis服务器连接端口
spring.redis.port=6379
# Redis服务器连接密码（默认为空）
spring.redis.password=
# 连接池最大连接数（使用负值表示没有限制）
spring.redis.jedis.pool.max-active=20
# 连接池最大阻塞等待时间（使用负值表示没有限制）
spring.redis.jedis.pool.max-wait=-1
# 连接池中的最大空闲连接
spring.redis.jedis.pool.max-idle=10
# 连接池中的最小空闲连接
spring.redis.jedis.pool.min-idle=0
# 连接超时时间（毫秒）

spring.redis.timeout=1000
```