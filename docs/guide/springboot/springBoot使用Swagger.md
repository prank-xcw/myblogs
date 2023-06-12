---
title: springboot整合使用Swagger
abbrlink: 35706
categories: springBoot
tags:
 - java
 - SpringBoot
 - swagger
---



## 1.添加pom依赖

```xml
<!-- swagger -->
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <version>2.9.0</version>
</dependency>
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger-ui</artifactId>
    <version>2.9.0</version>
</dependency>
```





## 2.创建Swagger配置类（与springboot启动类平级）

```Java
package com.xcw.api;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;
/**
 * @autor xcw
 * @date 2020/12/30 11:48
 * @discription swagger的api文档
 */
@Configuration
@EnableSwagger2
public class SwaggerConfig {
    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                //个人信息
                .apiInfo(apiInfo())
                .select()
                // 自行修改为自己的包路径
                .apis(RequestHandlerSelectors.basePackage("com.xcw.api.controller"))
                .paths(PathSelectors.any())
                .build();
    }
    // 构建 api文档的详细信息函数,注意这里的注解引用的是哪个
    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                // 页面标题
                .title("***系统-api文档")
                // 创建人
                .contact(new Contact("小饼干", "http://www.baidu.com", ""))
                // 版本号
                .version("1.0")
                // 描述
                .description("API 描述")
                .build();
    }
}

```

### 启动springboot项目

- 访问 localhost:8080/swagger-ui.html
- 效果：![image-20201230120649614](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20201230120649614.png)





## 3.Swagger注解配置解读

- @APi：用于类的上方
  - 实例：![image-20201230121020361](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20201230121020361.png)
  - 效果：![image-20201230121102637](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20201230121102637.png)
- @ApiOperation：用于方法上方
  - 实例：![image-20201230121355538](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20201230121355538.png)
  - 效果：![image-20201230121437126](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20201230121437126.png)
- @ApiImplicitParam：用于方法上方，指定各个参数，用在@ApiImplicitParams注解中
  - name：参数名
  - value：参数描述
  - require：参数是否必须
  - type：参数类型
  - defauvalue：默认值
  - parampath：参数地址
    - header：通过@RequestHeader获取
    - query：通过@RequestParam获取
    - path：通过@PathVariable获取（Restful风格）
    - body，form（不常用）

实例：

![image-20201230122223904](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20201230122223904.png)

效果：

![image-20201230122303871](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20201230122303871.png)

