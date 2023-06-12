---
title: springboot分库分表使用
categories: springBoot
abbrlink: 84a659c
tags:
 - java
 - sharding-jdbc
---



[TOC]





> 准备环境：
>
> springboot 2.1.7
>
> JPA
>
> sharding 4.1.0
>
> Druid-spring-boot-starter  1.2.6
>
> 





## 1.环境依赖

```xml
		<!--mvc支持-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <!--mysql依赖-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <!--QueryDSL支持-->
        <dependency>
            <groupId>com.querydsl</groupId>
            <artifactId>querydsl-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>com.querydsl</groupId>
            <artifactId>querydsl-apt</artifactId>
        </dependency>
        <!--druid数据源-->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid-spring-boot-starter</artifactId>
            <version>1.2.6</version>
        </dependency>
        <!--sharding分库分表-->
        <dependency>
            <groupId>org.apache.shardingsphere</groupId>
                <artifactId>sharding-jdbc-spring-boot-starter</artifactId>
            <version>${shardingsphere.version}</version>
        </dependency>



	<build>
        <plugins>
            <!--因为是类型安全的，所以还需要加上Maven APT plugin，使用 APT 自动生成一些类:-->
            <plugin>
                <groupId>com.mysema.maven</groupId>
                <artifactId>apt-maven-plugin</artifactId>
                <version>1.1.3</version>
                <executions>
                    <execution>
                        <goals>
                            <goal>process</goal>
                        </goals>
                        <configuration>
                            <outputDirectory>target/generated-sources/java</outputDirectory>
                            <processor>com.querydsl.apt.jpa.JPAAnnotationProcessor</processor>
                        </configuration>
                    </execution>
                </executions>
            </plugin>

        </plugins>
    </build>
```





## 2.添加properties

```properties
##设置数据源 多个数据源逗号隔开
spring.shardingsphere.datasource.names=db0
#spring.shardingsphere.props.sql-show=true
#spring.shardingsphere.sharding.default-data-source-name=db0
spring.shardingsphere.datasource.db0.type=com.alibaba.druid.pool.DruidDataSource
spring.shardingsphere.datasource.db0.driver-class-name=com.mysql.cj.jdbc.Driver
spring.shardingsphere.datasource.db0.url=jdbc:mysql://localhost:3306/test?useUnicode=true&characterEncoding=utf-8&useSSL=true&serverTimezone=UTC
spring.shardingsphere.datasource.db0.username=root
spring.shardingsphere.datasource.db0.password=root
spring.shardingsphere.datasource.db0.maximum-pool-size=64
spring.shardingsphere.datasource.db0.connection-timeout=60000
spring.shardingsphere.datasource.db0.max-lifetime=60000
#测试连接
#spring.shardingsphere.datasource.db0.connection-test-query=SELECT 'X'
spring.shardingsphere.datasource.db0.minimum-idle=10
spring.shardingsphere.datasource.db1.type=com.alibaba.druid.pool.DruidDataSource
spring.shardingsphere.datasource.db1.driver-class-name=com.mysql.cj.jdbc.Driver
spring.shardingsphere.datasource.db1.url=jdbc:mysql://localhost:3306/test?useUnicode=true&characterEncoding=utf-8&useSSL=true&serverTimezone=UTC
spring.shardingsphere.datasource.db1.username=root
spring.shardingsphere.datasource.db1.password=root
spring.shardingsphere.datasource.db1.maximum-pool-size=64
spring.shardingsphere.datasource.db1.connection-timeout=60000
spring.shardingsphere.datasource.db1.max-lifetime=60000
#测试连接
#spring.shardingsphere.datasource.db1.connection-test-query=SELECT 'X'
spring.shardingsphere.datasource.db1.minimum-idle=10
#分库分表策略  使用feture Task语法
spring.shardingsphere.sharding.tables.t_user.actual-data-nodes=db0.t_user->{0..2}

#分表字段
spring.shardingsphere.sharding.tables.t_user.table-strategy.inline.sharding-column=userStatus
#分表规则: 单库时省略数据源前缀，多库需加上数据源前缀
spring.shardingsphere.sharding.tables.t_user.table-strategy.inline.algorithm-expression=db0.t_user->{userStatus % 3}
# 表id
spring.shardingsphere.sharding.tables.t_user.key-generator.column=userId
# 表id生成策略：雪花算法SNOWFLAKE
spring.shardingsphere.sharding.tables.t_user.key-generator.type=SNOWFLAKE
```



