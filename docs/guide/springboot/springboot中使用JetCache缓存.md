---
title: springboot中使用JetCache缓存
abbrlink: 21715
categories: springBoot
tags:
 - java
 - SpringBoot
 - JetCache
---




## Redis介绍

jedis是redis的java客户端，通过它可以对redis进行操作，与之功能相似的还包括：Lettuce等。

spring-boot-data-redis 内部实现了对Lettuce和jedis两个客户端的封装，默认使用的是Lettuc



**注：redis服务器要先开启! 或者连接远程服务器上的 Redis,但是依然要开启服务，不然会一直 TimeOut!**

```xml
        <!--redis 缓存-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
```



**application.properties文件**

```properties
#redis
redis:
  #redis机器ip
  hostname: 127.0.0.1
  #redis端口
  port: 6379
  #redis密码
  password:
  #redis超时时间（毫秒），如果不设置，取默认值2000
  timeout: 10000
  #最大空闲数
  maxIdle: 300
  #连接池的最大数据库连接数。设为0表示无限制,如果是jedis 2.4以后用redis.maxTotal
  #maxActive=600
  #控制一个pool可分配多少个jedis实例,用来替换上面的redis.maxActive,如果是jedis 2.4以后用该属性
  maxTotal: 1000
  #最大建立连接等待时间。如果超过此时间将接到异常。设为-1表示无限制。
  maxWaitMillis: 1000
  #连接的最小空闲时间 默认1800000毫秒(30分钟)
  minEvictableIdleTimeMillis: 300000
  #每次释放连接的最大数目,默认3
  numTestsPerEvictionRun: 1024
  #逐出扫描的时间间隔(毫秒) 如果为负数,则不运行逐出线程, 默认-1
  timeBetweenEvictionRunsMillis: 30000
  #是否在从池中取出连接前进行检验,如果检验失败,则从池中去除连接并尝试取出另一个
  testOnBorrow: true
  #在空闲时检查有效性, 默认false
  testWhileIdle: true

  #redis集群配置
  #spring.cluster.nodes=192.168.1.1:7001,192.168.1.1:7002,192.168.1.1:7003,192.168.1.1:7004,192.168.1.1:7005,192.168.1.1:7006
  #spring.cluster.max-redirects=3

  #哨兵模式
  #sentinel.host1=192.168.1.1
  #sentinel.port1=26379

  #sentinel.host2=192.168.1.2
  #sentinel.port2=26379
```



**redisTemplate和stringRedisTemplate**

> 两者的区别是 	redisTemplate以二进制的形式存储数据
>
> ​							stringRedisTemplate以字符串存储数据

```java
@Autowired
    StringRedisTemplate stringRedisTemplate;


    @Test//新增时指定过期时间(秒)
    public void setValue(){
        stringRedisTemplate.opsForValue().set("name","恶作剧",200, TimeUnit.SECONDS);
    }

    @Test//指定失效时间
    public void setByExpire(){
        stringRedisTemplate.expire("name",500,TimeUnit.SECONDS);
    }

    @Test//获取过期时间
    public void getByExpire(){
        Long name = stringRedisTemplate.getExpire("name");
        System.out.println(name);
    }

    @Test//获取
    public void getValue(){
        String name = stringRedisTemplate.opsForValue().get("name");
        System.out.println(name);
    }

    @Test//删除
    public void delValue(){
        stringRedisTemplate.delete("name");
    }
```







## Jetcache缓存工具使用

JetCache主要通过@Cached和@CreateCache实现缓存，@Cached是在接口方法或者类方法上添加缓存，一般以参数为key，以返回值为value存入缓存中。@CreateCache是直接创建一个缓存实例，然后调用put(T key， T value)、get(T key)等方法实现缓存。


**缓存工具的对比**

| 工具名称     | 功能对比                                                     | 备注                       |
| ------------ | ------------------------------------------------------------ | -------------------------- |
| Spring Cache | Spring官方提供，使用简单，功能单一，不能使用缓存刷新、二级缓存 | 对需求不高者可以使用       |
| JetCache     | 阿里出品，原生的支持TTL、两级缓存、分布式自动刷新，还提供了Cache接口用于手工缓存操作。 | 对缓存要求高的用户推荐使用 |



#### jetcache依赖

```xml
 <!--redis 缓存-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
		<dependency>
            <groupId>redis.clients</groupId>
            <artifactId>jedis</artifactId>
            <version>4.2.3</version>
        </dependency>

        <!--jetcache-->
        <dependency>
            <groupId>com.alicp.jetcache</groupId>
            <artifactId>jetcache-starter-redis</artifactId>
            <version>2.6.0</version>
        </dependency>
```



#### **连接方式分为redis和lettuce**

**redis:**

```yaml
jetcache:
  #输出缓存监控信息 间隔时间/分钟
  statIntervalMinutes: 3
  #设置不把areaName作为Key前缀
  areaInCacheName: false
  #/如果@Cached和@CreateCache的name是自动生成的，会默认的将包名和方法名作为前缀，为了不让name太长，该设置时将制定的包名截掉
  hiddenPackages: com.learn.spring
  local:
    default:
      # 缓存类型为linkedhashmap，还可以为caffeine
      type: caffeine
      # 本地缓存元素限制
      limit: 100
      # key转换器，当前只有一个实现，fastjson
      keyConvertor: fastjson
      # 全局过期时间，默认无穷大
      expireAfterWriteInMillis: 300
  remote:
    default:
      # 缓存类型，采用redis，还支持tair
      type: redis
      keyPrefix: cache. #key的前缀
      keyConvertor: fastjson
      valueEncoder: JAVA  # 序列化策略配置，可选JAVA和KRYO
      valueDecoder: JAVA  # 反序列化策略
      #单机redis
      #host: 127.0.0.1
      #port: 6381
      #哨兵模式sentinel
      sentinels: 127.0.0.1:26379
      masterName: master
      readFrom: slavePreferred
      poolConfig:
        maxTotal: 200
        minIdle: 10
        maxIdle: 50
```

**lettuce方式只需要修改连接方式的写法**

```yaml
  remote:
    default:
      # 缓存类型，redis.lettuce
      type: redis.lettuce
      keyPrefix: cache. #key的前缀
      keyConvertor: fastjson
      valueEncoder: JAVA   # 序列化策略配置，可选JAVA和KRYO
      valueDecoder: JAVA  # 反序列化策略
      #单机redis
      #uri: redis://127.0.0.1:6381/
      #哨兵模式sentinel
      uri: redis-sentinel://127.0.0.1:26379/?sentinelMasterId=master
```

| 属性                                                      | 默认值 | 说明                                                         |
| --------------------------------------------------------- | ------ | ------------------------------------------------------------ |
| jetcache.statIntervalMinutes                              | 0      | 统计间隔，0表示不统计                                        |
| jetcache.hiddenPackages                                   | 无     | 自动生成name时，隐藏指定的包名前缀                           |
| jetcache.[local\|remote].${area}.type                     | 无     | 缓存类型，本地支持linkedhashmap、caffeine，远程支持redis、tair |
| jetcache.[local\|remote].${area}.keyConvertor             | 无     | key转换器，当前仅支持fastjson                                |
| jetcache.[local\|remote].${area}.valueEncoder             | java   | 仅remote类型的缓存需要指定，可选java和kryo                   |
| jetcache.[local\|remote].${area}.limit                    | 100    | 仅local类型的缓存需要指定，缓存实例最大元素数                |
| jetcache.[local\|remote].${area}.expireAfterWriteInMillis | 无穷大 | 毫秒单位                                                     |
| jetcache.local.${area}.expireAfterAccessInMillis          | 0      | 仅local类型的缓存有效，毫秒单位，最大不活动间隔              |
|                                                           |        |                                                              |



#### 启动类开启注解

```java
@EnableMethodCache(basePackages = "com.xcw.cache.service") //说明在那些包中启用缓存
@EnableCreateCacheAnnotation   //开启@CreateCache
```



#### 使用@CreateCache创建缓存实例

> 注意：缓存的对象必须实现序列化接口

```java
/**
     * 创建缓存规则
     * key名称为：CacheService.cache
     * 缓存时间 200s
     * 缓存基本 二级缓存(本地+远程)
     */
@CreateCache(name = "CacheService.cache.", expire = 200, cacheType = CacheType.BOTH)
private Cache<String, Object> cache;

public List<OrgEntity> findAll() {
    Object listObject = cache.get("list");
    if (listObject == null) {
        List<OrgEntity> list = orgDao.findAll();
        //当key对应的value不存在则缓存
        cache.put("list", list);
        return list;
    }
    List<OrgEntity> li = JSON.parseArray(JSON.toJSONString(listObject), OrgEntity.class);
    return li;
}
	
```

**生成的key为：keyPrefix + CreateCache中的name +  put时的值 **

![image-20220719160605216](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20220719160605216.png)



#### 使用@cache创建缓存方法

```java
@Cached(name = "CacheService.getAll.", key = "#vo.id", expire = 200, cacheType = CacheType.BOTH)
public List getAll(OrgEntity vo) {
    List<OrgEntity> list = orgDao.findAllBySpecitfication(vo);
    return list;
}
```

**key根据参数来变化，将方法返回值放入缓存，也可不指定key参数**

![image-20220719162756416](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20220719162756416.png)



