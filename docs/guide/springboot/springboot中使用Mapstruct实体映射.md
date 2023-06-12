---
title: springboot中使用Mapstruct实体映射
abbrlink: 54462
categories: springBoot
tags:
 - java
 - SpringBoot
---





## 介绍：

对象与对象之间的互相转换，就需要有一个专门用来解决转换问题的工具

MapStruct 就是这样的一个属性映射工具，只需要定义一个 Mapper 接口，MapStruct 就会自动实现这个映射接口，避免了复杂繁琐的映射实现。

MapStruct官网地址： http://mapstruct.org/







## 引入依赖：

```xml
  		<!--实体于模型之间转换 start-->
        <dependency>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct</artifactId>
            <version>1.4.1.Final</version>
        </dependency>
        <dependency>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct-processor</artifactId>
            <version>1.4.1.Final</version>
        </dependency>
		<dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok-mapstruct-binding</artifactId>
            <version>0.2.0</version>
        </dependency>

        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>
```



## 编写mapstruct接口

```java
package com.xcw.app.db.mapper;

import org.mapstruct.InheritConfiguration;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.MapperConfig;
import org.mapstruct.Mappings;

import java.util.List;

/**
 * @Author xcw
 * @Date 2021/1/29 14:27
 * @Description 实体类转换基本接口
 */
@MapperConfig
public interface BaseMapstruct<Entity, Domain> {

    @Mappings({})
    @InheritConfiguration
    Entity toEntity(Domain domin);

    @InheritInverseConfiguration
    Domain toDomain(Entity entity);

    @InheritConfiguration
    List<Entity> toEntity(List<Domain> domin);

    @InheritInverseConfiguration
    List<Domain> toDomain(List<Entity> entity);

}
```



## 创建Entity和VO类

```java
@Data
public class OrgEntity {
    private Integer id;

    private String orgName;

    private String orgType;
}


@Data
public class OrgVO {
    private Integer id;

    private String orgName;

    private String org_type;
}
```





## 创建转换接口

```java
@Mapper(componentModel = "spring")
public interface OrgMapper extends BaseMapstruct<OrgEntity, OrgVO> {

    @Override
    @Mappings({@Mapping(source = "org_type", target = "orgType")})
    OrgEntity toEntity(OrgVO domin);

    @Override
    @Mappings({@Mapping(source = "orgType", target = "org_type")})
    OrgVO toDomain(OrgEntity orgEntity);
}

```

> 将不相同的属性，重新方法手动绑定
>
> componentModel = "spring" 表示交给spring容器管理
>
> 编译后自动生成OrgMapper实现类

![image-20210419162202255](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20210419162202255.png)



## 创建service查询后进行转换

![image-20210419162352607](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20210419162352607.png)