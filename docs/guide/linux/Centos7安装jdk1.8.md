---
title: Centos7安装jdk1.8
abbrlink: 6391
categories: linux
tags:
  - linux
---





# 卸载openjdk

1. 查看jdk版本

   ```
   java -version
   ```

2. 查看Java安装软件

   ```sh
   [root@centos ~]# rpm -qa|grep java
   
   java-1.7.0-openjdk-headless-1.7.0.261-2.6.22.2.el7_8.x86_64
   python-javapackages-3.4.1-11.el7.noarch
   tzdata-java-2020a-1.el7.noarch
   java-1.8.0-openjdk-headless-1.8.0.262.b10-1.el7.x86_64
   java-1.8.0-openjdk-1.8.0.262.b10-1.el7.x86_64
   javapackages-tools-3.4.1-11.el7.noarch
   java-1.7.0-openjdk-1.7.0.261-2.6.22.2.el7_8.x86_64
   ```

3. 卸载jdk

   .noarch可以不用删除

   ```sh
   [root@centos ~]# yum -y remove java-1.8
   ```






# 安装JDK

官方地址：https://www.oracle.com/java/technologies/oracle-java-archive-downloads.html

1. **上传jdk安装包** (`此处上传的是tar.gz安装包`)

2. **解压安装**

   ```sh
   [root@centos opt]# tar -zxvf jdk-8u271-linux-i586.tar.gz 
   ```

3. **将解压后的移动到 /usr/local/java/**

   ```sh
   [root@root opt]# mv -f jdk1.8.0_271 /usr/local/java/
   ```

4. **编辑 /etc/profile配置jdk环境变量**

   **注：JAVA_HOME指向的是安装解压后的文件**

   ```sh
   export JAVA_HOME=/usr/local/java/ #记得这里要改成自己安装的版本噢
   
   export JRE_HOME=${JAVA_HOME}/jre
   
   export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib
   
   export PATH=${JAVA_HOME}/bin:$PATH
   
   ```

5. **刷新环境变量**

   ```sh
   [root@root opt]# source /etc/profile
   ```

6. **重新查看java版本**

   ```sh
   [root@root opt]# java -version
   java version "1.8.0_271"
   Java(TM) SE Runtime Environment (build 1.8.0_271-b09)
   Java HotSpot(TM) 64-Bit Server VM (build 25.271-b09, mixed mode)
   ```



### rpm安装

```shell
#一步搞定，环境变量也不需配置
rpm -ivh  jdk-8u271-linux-i586.rpm 
```

