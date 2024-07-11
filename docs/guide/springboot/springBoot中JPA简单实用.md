---
title: springboot使用jpa
abbrlink: 64452
categories: springBoot
tags:
 - java
 - SpringBoot
 - JPA
---





## JPA常用注解

- @Entity：在数据库创建该实体类对应的表

  @Table：指定表名字

  @Id：指定为表的id
  @GeneratedValue(generator = "jpa")：id生成策略，，generator指定
  @GenericGenerator(name = "jpa", strategy = "uuid") ：自定义策略

  @Column：指定表中该字段名称

  @JsonFormat：后台到前台的时间格式的转换

  ​							@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", locale = "zh", timezone="GMT+8")

  @DateTimeFormat：前后到后台的时间格式的转换

  @Temporal：指定日期格式，分为三种

  ​						TemporalType.DATE：年月日yyyy-mm-dd

  ​						TemporalType.TIME: 时分秒HH:MM:SS

  ​						TemporalType.TIMESTAMP:年月日时分秒 yyyy-MM-dd hh:mm:ss

  

  

  ## 自动生成创建时间、修改时间

  1. 实体类添加
  
     ```java
     /**
      * 创建时间
      */
     @CreatedDate
     private Date createTime;
     
     /**
      * 修改时间
      */
     @LastModifiedDate
     private Date modifyTime;
     ```
  
  2. 实体类头部添加
  
     ```java
   @EntityListeners(AuditingEntityListener.class)//监听开始时间  更新时间
     ```

  3. springboot启动类添加注解
  
     ```java
      @EnableJpaAuditing
     ```
  
  




## jpa+querydsl查询

第一步：导入依赖，配置yml

```xml
<dependency>
    <groupId>com.querydsl</groupId>
    <artifactId>querydsl-jpa</artifactId>
</dependency>
<!--QueryDSL支持-->
<dependency>
    <groupId>com.querydsl</groupId>
    <artifactId>querydsl-apt</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <!--MySQL数据库支持-->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <scope>runtime</scope>
    </dependency>
    <!--构造支持-->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
```

```xml
<!--还需要加上Maven APT plugin，使用 APT 自动生成一些类:-->
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
```

```yml
#yml
server:
  port: 8888

#hibernate配置
spring:
  jpa:
    hibernate:
      ddl-auto: update    #更新或创建数据库
      #naming:             #命名策略，会将Java代码中的驼峰命名法映射到数据库中会变成下划线法
        #implicit-strategy: org.hibernate.boot.model.naming.ImplicitNamingStrategyLegacyJpaImpl
        #physical-strategy: org.springframework.boot.orm.jpa.hibernate.SpringPhysicalNamingStrategy
    show-sql: true        #显示SQL语句
  datasource:
    username: root
    password: root
    url: jdbc:mysql://localhost:3306/ssh?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf8
    driver-class-name: com.mysql.cj.jdbc.Driver


```

第二步：创建实体类

​								必须加上@Entity注解才能生成Q类；

​								使用lombok生成set，get方法；

```java
@Entity
@Table(name = "emp")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Users implements Serializable {
    @Id
    @GeneratedValue(generator = "jpa")
    @GenericGenerator(name = "jpa", strategy = "uuid")
    @Column(name = "id")
    private String id;

    @Column(name = "emp_name")
    private String enpName;

    @Column(name = "emp_age")
    private Integer empAge;

}

```



第三步：编译代码。idea可点击右侧窗口maven下compile进行编译，则会在target/generated-sources/java下生成Q类



第四步：创建JPAQueryFactory的实体类管理者

​	方法一：编写类管理类，继承这个类

```java
public abstract class QuerydslManager {
    //实体管理者
    @PersistenceContext
    protected EntityManager entityManager;

    protected JPAQueryFactory jpaQueryFactory;

    //初始化查询工厂
    @PostConstruct
    public void init() {
        jpaQueryFactory = new JPAQueryFactory(entityManager);
    }

}
//--------------------------------------继承管理类
@RestController
@Log4j2
public class UsersDao extends QuerydslManager {

    @RequestMapping("/findUser")
    public List<Person> findAll() {
        int page = 0; // 第几页
        int pageSize = 3; // 每页大小

        QPerson qPerson = QPerson.person;
        List<Person> result = jpaQueryFactory.selectFrom(qPerson).offset(page).limit(pageSize).fetch();

        log.info("值为{}", result);
        return result;
}
```

方法二：springboot添加bean，控制层通过自动注入使用

```java
@SpringBootApplication
public class BootJpaApplication {

    public static void main(String[] args) {
        SpringApplication.run(BootJpaApplication.class, args);
    }

    //让Spring管理JPAQueryFactory
    @Bean
    public JPAQueryFactory jpaQueryFactory(EntityManager entityManager){
        return new JPAQueryFactory(entityManager);
    }
}
//------------------------自动注入到对象内
@RestController
@Log4j2
public class UsersDao {
	@AutoWrite
    JPAQueryFactory jpaQueryFactory;
    
    @RequestMapping("/findUser")
    public List<Person> findAll() {
        int page = 0; // 第几页
        int pageSize = 3; // 每页大小

        QPerson qPerson = QPerson.person;
        List<Person> result = jpaQueryFactory.selectFrom(qPerson).offset(page).limit(pageSize).fetch();

        log.info("值为{}", result);
        return result;
}

```







## JPA的@Query

https://segmentfault.com/q/1010000009070592/a-1020000009071449

### 1.hql联合查询

> 返回自定义vo
>
>  必须使用new +全类名() 否则可能出错
>
> 查询的属性顺序，要和自定义的类属性顺序一致

```java
    @Query(value = "SELECT " +
            "       new com.response.vo( " +
            "        t1.name AS  tname,     " +
            "        count( t2.book ) AS booksNumbers,  " +
            "        case when sum(t2.books) is null then 0 else sum(t2.books) end AS books " +
            "      ) FROM    " +
            "        UserEntity t1 " +
            "        LEFT JOIN book t2 ON t2.userId = t1.userId    " +
            "        WHERE  " +
            "        AND (t2.createdTime >= :startTime OR t2.createdTime is NULL)   " +
            "        GROUP BY " +
            "        t1.name, " +
            "        ORDER BY " +
            "        booksNumbers DESC nulls last, " +
            "        books  nulls last")
    List<Vo> findByBook(@Param("startTime") Date startTime);

```



### 2.sql可执行的sql 返回Object数组

```
@Query(select p.id,p.name,p.age from Person p)
 List<Object[]> findPersonResult();
```

```java
//转换为java 类
 List<VO> VOList = new ArrayList();
 for (Object[] obj : objarr) {
            VO item = new VO();
            item.setId(obj[0].toString());
            item.setName(obj[1].toString());
            item.setAge(((Number) obj[2]).longValue());
            item.setBonusPoints(obj[3].toString());
            VOList.add(item);
}
```



### 3.使用原生sql实现分页

```java
    @Query(value = "SELECT  * from a",countQuery = " SELECT  count(*) from (SELECT  * from a) "
          nativeQuery = true)
    Page<Map<String, Object>> findAll(Pageable Pageable);
//分页查询只需要传入pageable对象即可，返回数据为Page对象
```



## Expressions语法

### 使用数据库的原生函数

```java
QEntity entity = QEntity.entity;

StringTemplate string = Expressions.stringTemplate("to_char({0}, {1})", entity.createdTime, "YYYY-MM");

//查询当天的所有记录  可以这样写
queryFactory.select(
    entity.id,
    entity.name,
    entity.type,
    entity.createdTime)
    .from(entity)
    .where(stringTemplate.eq(DateFormatUtils.format(new Date(),"YYYY-MM")));

```





## EntityManager使用



### 1.结果转换为数组

#### 查询结果默认转换为对象数组

```java
String sql = "select a.id, a.USER_NAME, a.PASS_WORD from t_user a"
Query query = entityManager.createNativeQuery(sql);
List<Object[]> resultList =  pageQuery.getResultList();
```



### 2.结果转换为Map

```java

String sql = "select a.id, a.USER_NAME, a.PASS_WORD from t_user a"
Query query = entityManager.createNativeQuery(sql);
//设置转换类
query.unwrap(NativeQuery.class).setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);
List<Map<String,Object>> resultList =  pageQuery.getResultList();
```





### 3.结果转换为自定义类

```java
String sql = "select a.id, a.USER_NAME, a.PASS_WORD from t_user a"
Query query = entityManager.createNativeQuery(sql);
//设置转换类
query.unwrap(NativeQuery.class).setResultTransformer(Transformers.aliasToBean(TUser.class));
List<TUser> resultList =  pageQuery.getResultList();
```



> 注意：
>
> 方法三中查询的若是Oracle库，需要将查询字段别名加上引号，因为Oracle默认查询时会转换为大写，与映射的实体中驼峰命名的属性无法对应；
>
> 例如：`select a.id \"id\", a.USER_NAME \"userName\", a.PASS_WORD \"passWord\" from t_user a`











## 一对一使用

**使用@OneToOne注解表示一对一查询**



A类

```java
@Data
@Entity
@Table(name = "a")
public class A implements Serializable {

    @Id
    @Column(name = "ID", length = 32)
    private String id;
    
    private String name;
    
    private String bId;

    @OneToOne
    @JoinColumn(name = "bId", referencedColumnName = "id", insertable = false, updatable = false)
    private B b;
}
```



B类

```java
@Data
@Entity
@Table(name = "b")
public class b implements Serializable {

    @Id
    @Column(name = "ID", length = 32)
    private String id;
    
    private String no;
}
```

