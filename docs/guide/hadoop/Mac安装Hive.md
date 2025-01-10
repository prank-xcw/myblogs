---
title: Mac安装Hive
sidebar: auto
categories: hodoop
tags:
  - hodoop

---





## 下载地址

官网：:link:  https://archive.apache.org/dist/hive/

安装版本：3.1.3-bin.tar.gz

![image-20250108173800765](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/202501081738448.png)







## 配置Hive

> 我的Hive安装目录放在了 /Users/xu/Documents/module/apache-hive-3.1.3/下

### 添加环境变量

1. 打开配置文件

   ```sh
   vim ~/.zshrc
   ```

   

2. 追加Hive环境变量

   ```sh
   export HIVE_HOME=/Users/xu/Documents/module/apache-hive-3.1.3
   export PATH=$HIVE_HOME/bin:$PATH
   ```

3. 刷新环境变量

   ```sh
   source ~/.zshrc
   ```

4. 查看hive版本

   ```sh
   hive --version
   
   #出现报错信息后是因为hive和hadoop中的SLF4J的jar包重复了，删除一个就好，我删除了hive中的jar
   SLF4J: Class path contains multiple SLF4J bindings.
   SLF4J: Found binding in [jar:file:/Users/xu/Documents/module/apache-hive-3.1.3/lib/log4j-slf4j-impl-2.17.1.jar!/org/slf4j/impl/StaticLoggerBinder.class]
   SLF4J: Found binding in [jar:file:/Users/xu/Documents/module/hadoop-3.4.1/share/hadoop/common/lib/slf4j-reload4j-1.7.36.jar!/org/slf4j/impl/StaticLoggerBinder.class]
   SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
   SLF4J: Actual binding is of type [org.apache.logging.slf4j.Log4jLoggerFactory]
   Hive 3.1.3
   Git git://MacBook-Pro.fios-router.home/Users/ngangam/commit/hive -r 4df4d75bf1e16fe0af75aad0b4179c34c07fc975
   Compiled by ngangam on Sun Apr 3 16:58:16 EDT 2022
   From source with checksum 5da234766db5dfbe3e92926c9bbab2af
   ```







### 更改hive配置文件

1. 重命名conf文件夹下`hive-default.xml.template`

   ```sh
   cd /Users/xu/Documents/module/apache-hive-3.1.3/conf
   mv hive-default.xml.template hive-default.xml
   ```

2. conf目录下新建`hive-site.xml`文件， 添加内容

   指定MySQL配置

   ```xml
   <?xml version="1.0" encoding="UTF-8" standalone="no"?>
   <?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
   <configuration>
     <property>
       <name>javax.jdo.option.ConnectionURL</name>
       <value>jdbc:mysql://localhost:3306/hive?createDatabaseIfNotExist=true&amp;useSSL=false&amp;allowPublicKeyRetrieval=true</value>
       <description>JDBC连接</description>
     </property>
     <property>
       <name>javax.jdo.option.ConnectionDriverName</name>
       <value>com.mysql.jdbc.Driver</value>
       <description>Driver class name for a JDBC metastore</description>
     </property>
     <property>
       <name>javax.jdo.option.ConnectionUserName</name>
       <value>hive</value>
       <description>用户名</description>
     </property>
     <property>
       <name>javax.jdo.option.ConnectionPassword</name>
       <value>12345678</value>
       <description>密码</description>
     </property>
   </configuration>
   ```

   





## 配置Hive数据库

1. 新建数据库

   ```sql
   create database hive; 
   
   CREATE USER 'hive'@'localhost' IDENTIFIED BY '12345678'; 
   
   GRANT ALL ON *.* TO 'hive'@'localhost';
   
   #刷新mysql系统权限关系表
   flush privileges;
   
   ```

2. 使用Hive的bin目录下`schematool`自带工具初始化数据库

   ```Text
   schematool -dbType mysql -initSchema
   ```



初始化数据库报错，需要在`/Users/xu/Documents/module/apache-hive-3.1.3/lib`目录下加入MySQL驱动jar包

驱动下载地址：:link: https://downloads.mysql.com/archives/c-j/

![image-20250108185423103](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/202501081854824.png)

![image-20250108185716013](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/202501081857191.png)





## 启动Hive并访问

1. 进入 `bin目录`,启动服务

   ```sh
   cd /Users/xu/Documents/module/apache-hive-3.1.3/bin
   
   #后台启动HiveServer2，允许客户端执行Hive查询，默认端口10000
   hive --service hiveserver2 &
   
   
   #停止hive
   hive --service hiveserver2 stop
   ```

2. 浏览器访问`http://localhost:10002` 进入Hive的Web界面

3. 客户端连接

   ```sh
   beeline -u jdbc:hive2://localhost:10000/ -n hive -p hive
   ```

   







