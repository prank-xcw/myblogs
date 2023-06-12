---
title: Centos7安装Git和Maven
abbrlink: 38767
categories: linux
tags:
  - linux
  - git
  - maven
---





> 安装环境：
>
> Centos7
>
> git-2.29.2
>
> mven-3.6.1



**安装git有两种方法，yum安装的版本比较旧**

## 一、yum安装git

`输入命令即可完成安装`

```sh
yum -y install git
```

`查看git版本`

```sh
git --version	
```



## 二、GitHub下载指定版本

1. 进入git在GitHub上发布版本页面https://github.com/git/git/releases，这个页面我们可以找到所有git已发布的版本。这里我们选择最新版的`tar.gz`包

2. 解压压缩包 `tar -zxvf git-2.29.2.tar.gz`

3. 进入到解压后的文件夹

   ```sh
   cd git-2.29.2
   ```

4. 拿到解压后的源码以后我们需要编译源码了，不过在此之前需要安装编译所需要的依赖。

   ```sh
   yum install curl-devel expat-devel gettext-devel openssl-devel zlib-devel gcc perl-ExtUtils-MakeMaker
   
   ```

   **中途出现提示时，按y**

5. 安装编译源码所需依赖的时候，yum自动安装了git，这时候你需要先卸载这个旧版的git。

   ```shell
   yum -y remove git
   ```

6. 编译git源码

   ```sh
   make prefix=/usr/local/git all
   ```

7. 安装git至`/usr/local/git`路径

   ```shell
   make prefix=/usr/local/git install
   ```

8. 配置环境变量

   ```shell
   vi /etc/profile 
   ```

   底部添加

   ```shell
   export PATH=$PATH:/usr/local/git/bin
   ```

9. 刷新环境变量

   ```shell
   source /etc/profile
   ```

10. 查看Git是否安装成功

    ```shell
    git --version
    ```





## 三、安装maven

Binary表示已经编译好的(推荐)

Source表示未编译的

1. **官网下载maven版本**

   `下载地址：`http://maven.apache.org/download.cgi

   `各个版本下载：`https://archive.apache.org/dist/maven/maven-3/

   ![img](https://img-blog.csdnimg.cn/20190730112439444.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM4MjcwMTA2,size_16,color_FFFFFF,t_70)

2. **上传到linux的/usr/local目录,创建maven目录**

3. **解压文件到/usr/local/maven/下**

   ```shell
   tar -zxvf apache-maven-3.6.1-bin.tar.gz
   ```

4. **配置环境变量**

   ```shell
   vi /etc/profile
   ```

   **底部输入**

   ```shell
   export PATH=$PATH:/usr/local/maven/maven-3.6.1/bin
   ```

5. **刷新环境变量**

   ```sh
   source /etc/profile
   ```

6. **查看版本**

   ```sh
   mvn -v 
   ```




`注意：`安装好maven后修改  配置文件/usr/local/maven/maven-3.6.1/conf/setting.xml 指定jar包的仓库地址

1. **配置仓库地址**

   ```xml
   <localRepository>/usr/local/maven/repo</localRepository>
   ```

2. **因为国外的服务器下载jar包很慢所以我们改为阿里云服务器**

   ```xml
    <!-- 阿里云仓库 -->
    <mirror>
        <id>alimaven</id>
        <mirrorOf>central</mirrorOf>
        <name>aliyun maven</name>
        <url>http://maven.aliyun.com/nexus/content/repositories/central/</url>
    </mirror>
   ```

3. **配置jdk在profiles标签中(我使用的jdk1.8)**

   ```xml
   <!-- java版本 --> 
   <profile>
         <id>jdk-1.8</id>
         <activation>
   	    <activeByDefault>true</activeByDefault>
           <jdk>1.8</jdk>
         </activation>
   
         <properties>
           <maven.compiler.source>1.8</maven.compiler.source>
   		<maven.compiler.target>1.8</maven.compiler.target>
   		<maven.compiler.compilerVersion>1.8</maven.compiler.compilerVersion>
         </properties>
   </profile>
   ```

4. 配置完成，在命令行输入mvn help:system测试，看到下载链接里面是ailiyun的链接表示配置成功

   此命令下载maven所需的配置及jar包





