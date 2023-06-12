---
title: springboot中使用skywalking实现日志追踪
categories: springBoot
abbrlink: 6578c966
tags:
 - java
 - SpringBoot
 - skywalking
---



[TOC]

## SkyWalking分布式追踪系统

### 介绍

Skywalking是一个国产的开源框架，2015年有吴晟个人开源，2017年加入Apache孵化器，国人开源的产品，主要开发人员来自于华为，2019年4月17日Apache董事会批准SkyWalking成为顶级项目，支持Java、.Net、NodeJs等探针，数据存储支持Mysql、Elasticsearch等，跟Pinpoint一样采用字节码注入的方式实现代码的无侵入，探针采集数据粒度粗，但性能表现优秀，且对云原生支持，目前增长势头强劲，社区活跃。

Skywalking是分布式系统的应用程序性能监视工具，专为微服务，云原生架构和基于容器（Docker，K8S,Mesos）架构而设计，它是一款优秀的APM（Application Performance Management）工具，包括了分布式追踪，性能指标分析和服务依赖分析等。

**目前主流的工具有：**Cat、Zipkin、Pinpoint、SkyWalking



### 主要架构

SkyWalking 逻辑上分为四部分: 探针, 平台后端, 存储和用户界面。

- **skyWalking agent探针** 使用Javaagent做字节码植入，无侵入式的收集，并通过HTTP或者gRPC方式发送数据到Skywalking Collector。
- **Skywalking Collector ** 链路数据收集器，对agent传过来的数据进行整合分析处理并落入相关的数据存储中。
- **Storage 存储** 通过开放的插件化的接口存放 SkyWalking 数据. 你可以选择一个既有的存储系统, 如 ElasticSearch, H2 或 MySQL 集群(Sharding-Sphere 管理),也可以选择自己实现一个存储系统. 当然, 我们非常欢迎你贡献新的存储系统实现。
- **UI** 一个基于接口高度定制化的Web系统，用户可以可视化查看和管理 SkyWalking 数据。



## 环境

官网下载地址：https://skywalking.apache.org/downloads/

参考博客：https://blog.csdn.net/qq_28690975/article/details/112985643

- JDK1.8
- Maven 3.6.0
- skyWalking 8.7.0
- springBoot 2.1.7



## 引入依赖

```xml
		<dependency>
            <groupId>org.apache.skywalking</groupId>
            <artifactId>apm-toolkit-trace</artifactId>
            <version>8.3.0</version>
        </dependency>
        <dependency>
            <groupId>org.apache.skywalking</groupId>
            <artifactId>apm-toolkit-log4j-2.x</artifactId>
            <version>8.3.0</version>
        </dependency>
		<dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-log4j2</artifactId>
        </dependency>
```



## 配置Log4j2

**在日志格式中添加 [%traceId] 即可**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!--Configuration后面的status，这个用于设置log4j2自身内部的信息输出，可以不设置，当设置成trace时，你会看到log4j2内部各种详细输出-->
<!--monitorInterval：Log4j能够自动检测修改配置 文件和重新配置本身，设置间隔秒数-->
<configuration monitorInterval="5">
    <!--日志级别以及优先级排序: OFF > FATAL > ERROR > WARN > INFO > DEBUG > TRACE > ALL -->

    <Properties>
        <!-- 格式化输出：%date表示日期，%thread表示线程名，%-5level：级别从左显示5个字符宽度 %msg：日志消息，%n是换行符 %logger{36} 表示 Logger 名字最长36个字符-->


        <!--1.文件输出格式-->
        <property name="file_pattern" value="%d{yyyy-MM-dd HH:mm:ss} [%traceId] [%thread] [%-5level]  %msg %l%n" />
        <!--2.控制台显示日志格式-->
        <!--[%traceId]：追踪id-->
        <!--[%sw_ctx]：打印为[$serviceName,$instanceName,$traceId,$traceSegmentId,$spanId]：服务名,实例名,追踪id,追踪片段id,跨度id-->
        <property name="console_pattern" value="%red{%d{yyyy-MM-dd HH:mm:ss}} [%traceId] %green{[%thread]} %magenta{[%-5level]} %cyan{%msg} %l%n"/>
        <!--3.skyWalking收集格式-->
        <property name="skyWalking_pattern" value="%msg %l%n"/>

        <!-- 定义日志存储的路径 -->
        <property name="FILE_PATH" value="./log/spring-skywalking/" />
        <property name="FILE_NAME" value="spring-skywalking" />
    </Properties>

    <appenders>

        <GRPCLogClientAppender name="skyWalking_log">
            <PatternLayout  pattern="${skyWalking_pattern}"/>
        </GRPCLogClientAppender>

        <console name="Console" target="SYSTEM_OUT">
            <!--输出日志的格式-->
            <PatternLayout pattern="${console_pattern}"/>
            <!--控制台只输出level及其以上级别的信息（onMatch），其他的直接拒绝（onMismatch）-->
            <ThresholdFilter level="info" onMatch="ACCEPT" onMismatch="DENY"/>
        </console>

        <!--文件会打印出所有信息，这个log每次运行程序会自动清空，由append属性决定，适合临时测试用-->
        <File name="file_log" fileName="${FILE_PATH}/test.log" append="true">
            <PatternLayout pattern="${file_pattern}"/>
        </File>

        <!-- 这个会打印出所有的info及以下级别的信息，每次大小超过size，则这size大小的日志会自动存入按年份-月份建立的文件夹下面并进行压缩，作为存档-->
        <RollingFile name="RollingFileInfo" fileName="${FILE_PATH}/info.log" filePattern="${FILE_PATH}/${FILE_NAME}-info-%d{yyyy-MM-dd}-%i.log.gz">
            <!--控制台只输出level及以上级别的信息（onMatch），其他的直接拒绝（onMismatch）-->
            <ThresholdFilter level="info" onMatch="ACCEPT" onMismatch="DENY"/>
            <PatternLayout pattern="${file_pattern}"/>
            <Policies>
                <!--interval属性用来指定多久滚动一次，默认是1 hour-->
                <TimeBasedTriggeringPolicy interval="1"/>
                <SizeBasedTriggeringPolicy size="10MB"/>
            </Policies>
            <!-- DefaultRolloverStrategy属性如不设置，则默认为最多同一文件夹下7个文件开始覆盖-->
            <DefaultRolloverStrategy max="15"/>
        </RollingFile>

        <!-- 这个会打印出所有的warn及以下级别的信息，每次大小超过size，则这size大小的日志会自动存入按年份-月份建立的文件夹下面并进行压缩，作为存档-->
        <RollingFile name="RollingFileWarn" fileName="${FILE_PATH}/warn.log" filePattern="${FILE_PATH}/${FILE_NAME}-warn-%d{yyyy-MM-dd}-%i.log.gz">
            <!--控制台只输出level及以上级别的信息（onMatch），其他的直接拒绝（onMismatch）-->
            <ThresholdFilter level="warn" onMatch="ACCEPT" onMismatch="DENY"/>
            <PatternLayout pattern="${file_pattern}"/>
            <Policies>
                <!--interval属性用来指定多久滚动一次，默认是1 hour-->
                <TimeBasedTriggeringPolicy interval="1"/>
                <SizeBasedTriggeringPolicy size="10MB"/>
            </Policies>
            <!-- DefaultRolloverStrategy属性如不设置，则默认为最多同一文件夹下7个文件开始覆盖-->
            <DefaultRolloverStrategy max="15"/>
        </RollingFile>

        <!-- 这个会打印出所有的error及以下级别的信息，每次大小超过size，则这size大小的日志会自动存入按年份-月份建立的文件夹下面并进行压缩，作为存档-->
        <RollingFile name="RollingFileError" fileName="${FILE_PATH}/error.log" filePattern="${FILE_PATH}/${FILE_NAME}-error-%d{yyyy-MM-dd}-%i.log.gz">
            <!--控制台只输出level及以上级别的信息（onMatch），其他的直接拒绝（onMismatch）-->
            <ThresholdFilter level="error" onMatch="ACCEPT" onMismatch="DENY"/>
            <PatternLayout pattern="${file_pattern}"/>
            <Policies>
                <!--interval属性用来指定多久滚动一次，默认是1 hour-->
                <TimeBasedTriggeringPolicy interval="1"/>
                <SizeBasedTriggeringPolicy size="10MB"/>
            </Policies>
            <!-- DefaultRolloverStrategy属性如不设置，则默认为最多同一文件夹下7个文件开始覆盖-->
            <DefaultRolloverStrategy max="15"/>
        </RollingFile>

    </appenders>

    <!--Logger节点用来单独指定日志的形式，比如要为指定包下的class指定不同的日志级别等。-->
    <!--然后定义loggers，只有定义了logger并引入的appender，appender才会生效-->
    <loggers>

        <!--过滤掉spring和mybatis的一些无用的DEBUG信息-->
        <logger name="org.mybatis" level="info" additivity="false">
            <AppenderRef ref="Console"/>
        </logger>
        <!--监控系统信息-->
        <!--若是additivity设为false，则 子Logger 只会在自己的appender里输出，而不会在 父Logger 的appender里输出。-->
        <Logger name="org.springframework" level="info" additivity="false">
            <AppenderRef ref="Console"/>
        </Logger>

        <root level="info">
            <appender-ref ref="skyWalking_log"/>
            <appender-ref ref="Console"/>
            <appender-ref ref="file_log"/>
<!--            <appender-ref ref="RollingFileInfo"/>-->
<!--            <appender-ref ref="RollingFileWarn"/>-->
<!--            <appender-ref ref="RollingFileError"/>-->
        </root>
    </loggers>

</configuration>

```



## 下载编译好的8.7.0版本包

![image-20220316173431946](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20220316173431946.png)

![image-20220316175350887](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20220316175350887.png)





## 使用探针实现日志追踪

### 启动脚本

**启动bin目录下的OapService.bat,Linux启动sh后缀文件**

![image-20220316180054171](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20220316180054171.png)



### 启动Java服务

**设置探针启动参数**

```sh
-javaagent:F:\learn\skywalking\apache-skywalking-apm-bin-es7\agent\skywalking-agent.jar
-Dskywalking.agent.service_name=skywalking-test
-Dskywalking.collector.backend_service=127.0.0.1:11800
```

**若使用命令启动jar需要在-jar指令前指定配置：**

```
java -javaagent:/agent/skywalking-agent.jar -Dskywalking.agent.service_name=skywalking-test
-jar springboot.jar 
```



**idea中可以在启动类中更改Vm option参数**

![image-20220317101846297](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20220317101846297.png)



> -javaagent:			指定探针jar包
>
> skywalking.agent.service_name  指定服务名
>
> skywalking.collector.backend_service  设置oap服务地址(同一机器中可省略)
>
> **具体配置可查看agent/config/agent.config文件查看**





### 访问服务

**可以看到打印的日志中可以看到 TID：追踪id**

![image-20220317102109538](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20220317102109538.png)





## 使用UI

Log4j2日志收集格式：https://skywalking.apache.org/docs/main/v8.7.0/en/setup/service-agent/java-agent/application-toolkit-log4j-2.x/

1. 启动bin目录下的webappservice.bat脚本文件

2. 访问 127.0.0.1:8080  

3. 添加grpc日志

   ```xml
   		<GRPCLogClientAppender name="skyWalking_log">
               <PatternLayout  pattern="${skyWalking_pattern}"/>
           </GRPCLogClientAppender>
   ```

4. 请求项目



![image-20220317131140037](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20220317131140037.png)





> 注意：使用后台监控前，需要启动先启动需要监控的服务，默认端口8080，可在webapp/webapp.yml文件中修改端口
>
> 启动顺序 Java服务---->oapService.bat---->webappservice.bat 
>
> ​		或者Java服务---->startup.bat  因为startup.bat就是启动以上两个脚本



## 切换存储方式

**调整config/application.yml文件**

```yml
# 默认存储方式h2
storage:
    selector: ${SW_STORAGE:h2}

# 调整mysql配置  注意更改，数据库信息
storage:
  selector: ${SW_STORAGE:mysql}
  mysql:
    properties:
      jdbcUrl: ${SW_JDBC_URL:"jdbc:mysql://localhost:3306/swtest"}
      dataSource.user: ${SW_DATA_SOURCE_USER:root}
      dataSource.password: ${SW_DATA_SOURCE_PASSWORD:root}
      dataSource.cachePrepStmts: ${SW_DATA_SOURCE_CACHE_PREP_STMTS:true}
      dataSource.prepStmtCacheSize: ${SW_DATA_SOURCE_PREP_STMT_CACHE_SQL_SIZE:250}
      dataSource.prepStmtCacheSqlLimit: ${SW_DATA_SOURCE_PREP_STMT_CACHE_SQL_LIMIT:2048}
      dataSource.useServerPrepStmts: ${SW_DATA_SOURCE_USE_SERVER_PREP_STMTS:true}
    metadataQueryMaxSize: ${SW_STORAGE_MYSQL_QUERY_MAX_SIZE:5000}
    maxSizeOfArrayColumn: ${SW_STORAGE_MAX_SIZE_OF_ARRAY_COLUMN:20}
    numOfSearchableValuesPerTag: ${SW_STORAGE_NUM_OF_SEARCHABLE_VALUES_PER_TAG:2}
```



**需要在oap-libs目录下放入mysql连接驱动的jar包，否则启动报错**

下载对应版本：https://mvnrepository.com/artifact/mysql/mysql-connector-java



**重新启动startup.bat后mysql会自动创建需要的表**