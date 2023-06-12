---
title: springboot使用Druid
categories: springBoot
abbrlink: da9bca76
tags:
 - java
 - SpringBoot
---



[TOC]



## 1.依赖

```xml
	
 <dependencies>

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


    </dependencies>

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



## 2.配置文件设置

**druid数据源配置**

```properties
#------------------------------------druid数据源
spring.datasource.type=com.alibaba.druid.pool.DruidDataSource
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/test?useUnicode=true&characterEncoding=utf-8&useSSL=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root

#------------------------------------数据源连接池配置
spring.datasource.druid.initial-size=5
#初始化连接大小
spring.datasource.druid.min-idle=5
#最大连接池数量
spring.datasource.druid.max-active=20
#连接最大等待时间 ms
spring.datasource.druid.max-wait=60000
#间隔多久检测一次，检测需要关闭的空闲连接
spring.datasource.druid.time-between-eviction-runs-millis=60000
#连接池中最小生存时间
spring.datasource.druid.min-evictable-idle-time-millis=300000
#测试连接
spring.datasource.druid.validation-query=select 1 from dual
#申请连接时检测，建议为true，不影响性能，并保证安全性
spring.datasource.druid.test-while-idle=true
#获取连接时检测，建议关闭，影响性能
spring.datasource.druid.test-on-borrow=true
#归还连接时检测，建议关闭，影响性能
spring.datasource.druid.test-on-return=true
#-------------------------------------druid监控配置
#开启web监控的filter
spring.datasource.druid.web-stat-filter.enabled=true
#开启后台管理servlet
spring.datasource.druid.stat-view-servlet.enabled=true
#后台监控的账号密码
spring.datasource.druid.stat-view-servlet.login-username=admin
spring.datasource.druid.stat-view-servlet.login-password=admin
#IP白名单(没有配置或为空，表示允许所有访问)
spring.datasource.druid.stat-view-servlet.allow=127.0.0.1
#IP黑名单(黑白名单共同存在时，deny优先于allow)
spring.datasource.druid.stat-view-servlet.deny=
#-------------------------------------druid内置Filter
# 配置监控统计拦截的filters，去掉后监控界面sql无法统计，'wall'用于防火墙
spring.datasource.druid.filters=stat,wall
#开启sql监控
spring.datasource.druid.filter.stat.enabled=true
#慢查询执行时
spring.datasource.druid.filter.stat.slow-sql-millis=1000
#记录慢查询
spring.datasource.druid.filter.stat.log-slow-sql=true
#配置防火墙
spring.datasource.druid.filter.wall.enabled=true
```



**Jpa配置**

```yml
spring:
  jpa:
    show-sql: true        #显示SQL语句
    hibernate:
      ddl-auto: validate    #update更新或创建数据库
      naming:             #命名策略，会将Java代码中的驼峰命名法映射到数据库中会变成下划线法
        #implicit-strategy: org.hibernate.boot.model.naming.ImplicitNamingStrategyLegacyJpaImpl
        physical-strategy: org.springframework.boot.orm.jpa.hibernate.SpringPhysicalNamingStrategy
    properties:
      hibernate:
        format_sql: true     #格式化sql
        use_sql_comments: true  #显示sql注释
```



## 3.创建实体类

```java
@Data
@Entity
@Builder
@Table(name = "t_user")
@NoArgsConstructor
@AllArgsConstructor
public class TuserEntity {

    @Id
    private Long userId;

    private String userName;

    private String passWord;

    private Integer userStatus;
}

```



## 4.创建repository接口

```java
@Repository
public interface TuserRepository extends JpaRepository<TuserEntity, Long>, JpaSpecificationExecutor<TuserEntity>, QuerydslPredicateExecutor<TuserEntity> {

}

```



## 5.创建实体管理类

```java
public abstract class QueryDSLEntityManager {

	@PersistenceContext
	protected EntityManager entityManager;

	protected JPAQueryFactory queryFactory;

	@PostConstruct
	public void init() {
		queryFactory = new JPAQueryFactory(entityManager);
	}

}

```



## 6.创建dao

```java
@Component
public class UserDao extends QueryDSLEntityManager {

    @Resource
    TuserRepository TuserRepository;


    public TuserEntity saveTuser(TuserEntity tuserEntity) {
        TuserEntity save = tuserDao.save(tuserEntity);
        return save;
    }

    public List<TuserEntity> findTuser() {
        List<TuserEntity> all = tuserDao.findAll();
        return all;
    }
}
```



## 7.创建controller

```

@RestController
@RequestMapping("/user")
public class UserController {

    @Resource
    UserDao userDao;

    @RequestMapping("/save")
    public TuserEntity saveTuser() {
        TuserEntity tuserEntity = TuserEntity.builder()
                .userId(236500L)
                .userName("小饼干")
                .passWord("admin")
                .userStatus(1)
                .build();
        TuserEntity enti = userDao.saveTuser(tuserEntity);
        return enti;
    }

    @RequestMapping("/findTuser")
    public List<TuserEntity> findTuser() {
        List<TuserEntity> list = userDao.findTuser();
        return list;
    }


}
```



## 8.效果图

![image-20220222172634305](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20220222172634305.png)



## 9.访问监控地址

默认地址为 localhost:8080/durid   账号密码为配置文件中配置的账号密码

![image-20220222172836643](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20220222172836643.png)

