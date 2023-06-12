---
title: nacos使用
categories: learn
abbrlink: a7bbcf40
tags:
  - alibaba
---





# nacos使用



下载地址：https://github.com/alibaba/nacos/tags



## 步骤一

**MySQL数据持久化**

1. ​	新建数据库nacos

2. ​    执行conf目录中nacos-mysql.sql文件

3. ​    修改conf目录下`application.properties`配置文件,指定数据库

   ```properties
   spring.datasource.platform=mysql
   
   ### Count of DB:
   db.num=1
   
   ### Connect URL of DB:
   db.url.0=jdbc:mysql://127.0.0.1:3306/nacos?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC
   db.user=root
   db.password=root
   ```



## 步骤二

**启动bin目录下startup**

访问http://localhost:8848/nacos/进入界面

账号密码默认值为nacos



**若出现异常：**

```java
WebServerException: Unable to start embedded Tomcat
```

**原因：**

startup启动文件中的启动方式；

默认为cluster集群方式启动的；

`可切换为单机方式启动，nacos支持 单机模式standalone   集群模式cluster  多集群模式`

**解决方案：**

修改`startup`文件`MODE`属性改为`standalone单机模式`

或者cmd启动指定启动方式`startup.cmd -m standalone`

重新启动，重新访问。