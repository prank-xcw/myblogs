---
title: springboot中整合springsession+redis
categories: springBoot
abbrlink: aaa7de2d
tags:
 - java
 - SpringBoot
 - redis
---





项目结构

```  shell
--spring-parent
  --spring-session-01
  --spring-session-02
```



# 一、新建工程

父模块依赖

```xml
       <!-- 引入 spring-session 依赖 -->
        <dependency>
            <groupId>org.springframework.session</groupId>
            <artifactId>spring-session-data-redis</artifactId>
        </dependency>
         <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
```



子模块不用添加依赖



# 二、yaml配置文件

> 两个子模块设置以下配置，除端口号不一致外

```yaml
server:
 port: 9530

#redis地址 其余信息有默认
spring:
  redis:
    host: 127.0.0.1
```



# 三、redis配置类

> 两个模块都创建配置类

```java
package com.learn.spring.session.config;

import com.alibaba.fastjson.support.spring.GenericFastJsonRedisSerializer;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectMapper.DefaultTyping;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializer;

/**
 * @description redis配置类
 */
@Configuration
public class RedisConfig {

    /**
     * redisTemplate 序列化格式
     */
    @Bean
    @SuppressWarnings("all")
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        ObjectMapper om = new ObjectMapper();
        // 指定要序列化的域，field,get和set,以及修饰符范围，ANY是都有包括private和public
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        om.enableDefaultTyping(DefaultTyping.NON_FINAL);

        //使用Jackson2JsonRedisSerializer来序列化和反序列化redis的value值（默认使用JDK的序列化方式）
        Jackson2JsonRedisSerializer jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer(Object.class);
        jackson2JsonRedisSerializer.setObjectMapper(om);

        //采用String的序列化方式
        RedisSerializer redisSerializer = RedisSerializer.string();

        RedisTemplate<String, Object> template = new RedisTemplate<String, Object>();
        // 配置连接工厂
        template.setConnectionFactory(factory);
        template.setKeySerializer(redisSerializer);
        template.setHashKeySerializer(redisSerializer);
        template.setValueSerializer(jackson2JsonRedisSerializer);
        template.setHashValueSerializer(jackson2JsonRedisSerializer);
        template.afterPropertiesSet();
        return template;
    }

    /**
     * 设置spring session redis 序列化方式
     */
    @Bean
    RedisSerializer<Object> springSessionDefaultRedisSerializer() {
        return new GenericFastJsonRedisSerializer();
    }
}

```



# 四、controller

两个子模块都添加controller

```java
@RestController
public class SessionController {
    //存放Session值
    @RequestMapping("/setSession")
    public String setSession(HttpServletRequest request){
        request.getSession().setAttribute("username","admin");
        return "ok";
    }
 
    //获取Session值
    @RequestMapping("/getSession")
    public String getSession(HttpServletRequest request){
        return (String)request.getSession().getAttribute("username");
    }
}
```

**项目的启动类添加注解**

```java
@EnableRedisHttpSession开启redis对SpringSession的支持
```



**访问** http://localhost:9530/setSession 自动存入redis

![image-20210616171830880](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20210616171830880.png)



**访问**http://localhost:9531/getSession 根据sessionId获取数据

![image-20210616171918225](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20210616171918225.png)



**查看redis，信息已经保存成功**



![image-20210616171750105](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20210616171750105.png)