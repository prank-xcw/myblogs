---
title: springboot使用assembly打包项目
categories: springBoot
abbrlink: 4b5e8175
tags:
 - java
 - SpringBoot
---



[TOC]



## 介绍

maven-assembly-plugin 是用来定制打包方式的插件，允许自己组装依赖，文档，文件进行打包。

详细可观看官网：https://maven.apache.org/plugins/maven-assembly-plugin/descriptor-refs.html





## 使用步骤



### 目录结构

```sh
# 项目中添加以下配置目录和文件

assembly
|
|-- assembly.xml

deploy
|
|-- env
    |-- prod
    |-- test
        |-- bin
        |   |-- start.sh
        |   |-- main.sh
        |   |-- stop.sh
        |-- conf
        	|-- application.yml
```



### 1.pom引入相关依赖

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-assembly-plugin</artifactId>
    <version>3.1.0</version>
    <configuration>
        <!--打包方式一：官方提供的定制化打包方式，包括bin,jar-with-dependencies,src,project-->
         <!--
        <descriptorRefs>
            <descriptorRef>jar-with-dependencies</descriptorRef>
        </descriptorRefs>
		-->

        <!--打包方式二：指定assembly.xml文件-->
        <descriptors>
            <descriptor>./assembly/assembly.xml</descriptor>
        </descriptors>
    </configuration>
    <executions>
        <execution>
            <id>make-assembly</id>
            <phase>package</phase>
            <goals>
                <!--只运行一次-->
                <goal>single</goal>
            </goals>
        </execution>
    </executions>
</plugin>


<profiles>
    <profile>
        <id>test</id>
        <properties>
            <package.environment>test</package.environment>
        </properties>
        <!--默认选择-->
        <activation>
            <activeByDefault>true</activeByDefault>
        </activation>
    </profile>

    <profile>
        <id>prod</id>
        <properties>
            <package.environment>prod</package.environment>
        </properties>
    </profile>
</profiles>
```





### 2.自定义descriptor模式的xml文件

创建位置为pom的descriptor中指定的位置

```xml
<assembly xmlns="http://maven.apache.org/plugins/maven-assembly-plugin/assembly/1.1.3"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/plugins/maven-assembly-plugin/assembly/1.1.3 http://maven.apache.org/xsd/assembly-1.1.3.xsd">

    <id>${package.environment}</id>

    <!--支持的打包格式有zip、tar、tar.gz (or tgz)、tar.bz2 (or tbz2)、jar、dir、war，可以同时指定多个打包格式-->
    <formats>
        <format>dir</format>
        <format>zip</format>
        <format>tar.gz</format>
    </formats>

    <includeBaseDirectory>true</includeBaseDirectory>

    <!--指定依赖包目录-->
    <dependencySets>
        <dependencySet>
            <outputDirectory>lib</outputDirectory>
            <scope>runtime</scope>
        </dependencySet>
    </dependencySets>

    <!--管理存放位置-->
    <fileSets>
        <fileSet>
            <directory>deploy/env/${package.environment}/bin</directory>
            <outputDirectory>bin</outputDirectory>
            <includes>
                <include>*.sh</include>
            </includes>
            <fileMode>0755</fileMode>
            <lineEnding>unix</lineEnding>
        </fileSet>
        <fileSet>
            <directory>${project.build.directory}</directory>
            <outputDirectory>lib</outputDirectory>
            <includes>
                <include>${project.artifactId}-*.jar</include>
            </includes>
        </fileSet>
        <fileSet>
            <directory>deploy/env/${package.environment}/conf</directory>
            <outputDirectory>res</outputDirectory>
        </fileSet>
        <fileSet>
            <directory>${project.build.directory}/classes/layout</directory>
            <outputDirectory>res/layout</outputDirectory>
        </fileSet>
        <fileSet>
            <directory>${project.build.directory}/classes/static</directory>
            <outputDirectory>res/static</outputDirectory>
        </fileSet>
        <fileSet>
            <directory>${project.build.directory}/classes/templates</directory>
            <outputDirectory>res/templates</outputDirectory>
        </fileSet>
    </fileSets>
</assembly>

```



### 3.创建各环境需要的bin和配置文件



> start.sh 
>
> 
>
> 11800 端口号
>
> \>/dev/null &  将输出丢弃掉

```sh
#!/bin/sh
./main.sh 11800 >/dev/null &
```



> main.sh
>
> 
>
> JAVA_HOME     jdk安装路径
>
> CLASSPATH     包括依赖包、配置文件、静态文件、前端页面
>
> PROVIDER		springBoot启动类全路径

```sh
#!/bin/sh
#set java_home
JAVA_HOME=/usr/local/java/jdk1.8.0_311
CLASSPATH=./../res:./../lib/*
echo -------------------------------------------------------------------
echo -------------------------------------------------------------------
echo ===================start AssemblyMain ...============================
PROVIDER=com.learn.spring.assembly.AssemblyMain
MEM_ARGS="-Xms128m -Xmx128m  -XX:MetaspaceSize=256m -XX:MaxMetaspaceSize=256m"
JAVA_OPTIONS="-Denv.name=AssemblyMain -Dserver.port=$1"

${JAVA_HOME}/bin/java ${MEM_ARGS} ${JAVA_OPTIONS} -classpath ${CLASSPATH} ${PROVIDER}

```



> stop.sh
>
> 
>
> awk '{print $2}'   打印第二个字段
>
> 找到该进程的进程id，并关闭进程

```sh
ps -ef |grep $USER| grep "AssemblyMain" | grep -v grep | awk '{print $2}'| xargs kill
```



### 4.执行命令选择环境进行打包

```
mvn -Ptest clean package assembly:single -Dmaven.test.skip=true

-Ptest测试环境打包

```



