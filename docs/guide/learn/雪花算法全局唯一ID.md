---
title: 实现全局唯一ID
abbrlink: 39446
categories: learn
---



## 集群高并发情况下如何保证分布式唯一ID全局生成



> 工程分布式部署，要求抗住高并发。并且生成的id是根据时间自增的



## 1.ID生成规则

- **全局唯一：**
  - 不能出现重复ID号；
- **趋势递增：**
  - 在MySQL的innoDB.引擎中使用的是聚集索引，由于多数RDBMS使用B+tree的数据结构来存储索引数据，在主键的选择上面我们应该尽量使用有序的主键保证写入性能;
- **单调递增：**
  - 保证下一个大于上一个；例如事务版本号，IM增量消息，排序等排序要求;
- **信息安全：**
  - 如果ID是连续的，恶意用户的扒取工作就非常容易做了，直接按照顺序下载指定URL即可;如果是订单号就更危险了，竞争对手直接知道我们一天的单量。所以在一些应用场景下，需要ID无规则不规则，让竞争对手不好猜。
- **含时间戳：**
  - 可以在开发中快速了解分布式ID的生成时间。



## 2.ID生成的系统可用性

- 高可用
  - 发一个获取分布式ID的请求，服务器就要保证99.999%的情况下给我创建一个唯一分布式ID
- 低延迟
  - 发一个获取分布式ID的请求，服务器要快速，急速。
- 高QPS
  - 例如一口气10万个创建分布式ID请求，服务器要扛得住压力。



## 3.一般方案

1. **UUID：**

   字符串太长，不自增，影响存储性能；

2. **数据库自增：**

   

3. **Redis生成策略：**

   通过使用incr，incrby实现，缺陷：维护多台Redis麻烦



## 4.SnowFlake雪花算法

- 算法原理：生成一个64bit大小的整数

  1. **1bit**，不用，因；为二进制中最高位是符号位，1表示负数，0表示正数。生成的id一般都是用整数，所以最高位固定为0；

  2. **41bit-时间戳**，用来记录时间戳，毫秒级。

     41位可以表示2^{41}-1个数字，减1是因为可表示的数值范围是从0开始算的，而不是1。(2^{41})/(1000*60*60* 24*365)=69年

  3. **10bit-工作机器id**:用来记录工作机器id.

     可以部署2^10=1024个节点，包括5位datacenterId和5位workerId；0-31表示不同的datecenterId和workerId；

  4. **12bit-序列号**，序列号，用来记录同毫秒内产生的不同id。

     表示最大正整数2^12-1=4095，同一机器，同一毫秒内产生的ID序号；



使用糊涂工具使用雪花算法

下载地址：https://www.hutool.cn/docs/#/



- 引入依赖

  ```xml
  		<dependency>
  			<groupId>cn.hutool</groupId>
  			<artifactId>hutool-all</artifactId>
  			<version>5.4.6</version>
  		</dependency>
  ```

- 使用

  ```java
  @RequestMapping("/hutool")
  	public Long hutool() {
  		long workerId = 1;// 工作ID 0-31
  		long datacenterId = 1;// 数据中心ID 0-31
  		
  		Snowflake snowflake = IdUtil.createSnowflake(workerId, datacenterId);//传入参数
  		long nextId = snowflake.nextId();//获得long类型Id
  		System.out.println(nextId);//输出到控制台
  		
  		return nextId;//返回到页面
  	}
  ```

  

