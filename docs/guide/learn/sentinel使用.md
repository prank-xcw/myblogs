---
title: sentinel使用
categories: learn
abbrlink: f7a18cad
tags:
  - alibaba
---



# Alibaba Sentinel下载



sentinel下载地址：https://github.com/alibaba/Sentinel/tags

中文文档：https://github.com/alibaba/Sentinel/wiki/%E4%BB%8B%E7%BB%8D



下载：选择jar文件下载；

启动：在jar所在目录下，打开cmd命令窗口，输入命令

```sh
java -jar sentin-dashboard-1.8.0.jar 
```



访问：http://localhost:8080   账号密码默认为 sentinel/sentinel





## 项目使用sentinel

```xml
		<dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>

        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
        </dependency>

		<dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
            <!--去除jackson-dataformat-xml，否则会返回xml文件，而不是JSON-->
            <exclusions>
                <exclusion>
                    <groupId>com.fasterxml.jackson.dataformat</groupId>
                    <artifactId>jackson-dataformat-xml</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
```



bootstarp.yaml中指定sentinel主机

```yaml
spring:
  application:
    name: nacos-server
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848 #nacos服务中心地址
      config:
        server-addr: 127.0.0.1:8848 #nacos配置中心地址
        file-extension: yaml    #指定文件类型
        group: test
        #namespace: b75a0be0-ab8e-4918-8c3c-1c5b60aaf5ee  #命名空间ID
    sentinel:
      transport:
        dashboard: localhost:8080 #配置sentinel dashboard地址
        port: 8719 #默认8719，加入被占用会自动从8719开始依次+1扫描直至找到未被占用的端口
    #      datasource:
    #        ds1:
    #          nacos:
    #            server-addr: localhost:8848
    #            data-id: cloudalibaba-sentinel-service
    #            group-id: DEFAULT_GROUP
    #            data-type: json #编写这个值提示红色❌号但可以运行，不写启动服务报错
    #            rule-type: flow #编写这个值提示红色❌号但可以运行，不写启动服务报错
```

**启动类添加@EnableDiscoveryClient，开启服务注册与发现**



## Sentinel流控

- **资源名：**唯一名称，请求路径
- **针对来源：**填写服务名，默认default(不区分来源)
- **阈值类型/单机阈值：**
  - **QPS(每分钟请求数量):** 当调用该请求时，进行限流
  - **线程数：** 当调用该请求达到线程数阈值时，进行限流
- **是否集群：**不需要集群
- **流控模式：**
  - **直接：**达到条件直接限流
  - **关联：**当关联的资源达到阈值，限流自己
  - **链路：**只记录指定链路上的流量 如：a-b-c 对其中一个进行流控，该链路都会有流控
- **流控效果：**
  - **快速失败：**直接失败，抛出异常
  - **Warm Up：**根据冷加载因子(默认3)，从阈值经过预热时长，达到预设QPS阈值
  - **排队等待：**匀速排队，让请求匀速请求，阈值类型必须为`QPS`,否则无效；



> **Warm Up：**根据冷因子加载（默认3），从阈值中经过预热时长，达到设定的Qps阈值；
>
> 公式： 10/3=3 |QPS/S=预热值    刚开始为一秒3个限流，三秒后阈值达到10限流
>
> 常用于秒杀



## Sentinel降级

中文文档：https://github.com/alibaba/Sentinel/wiki/%E7%86%94%E6%96%AD%E9%99%8D%E7%BA%A7

熔断降级规则（DegradeRule）包含下面几个重要的属性：

| Field              | 说明                                                         | 默认值     |
| ------------------ | ------------------------------------------------------------ | ---------- |
| resource           | 资源名，即规则的作用对象                                     |            |
| grade              | 熔断策略，支持慢调用比例/异常比例/异常数策略                 | 慢调用比例 |
| count              | 慢调用比例模式下为慢调用临界 RT（超出该值计为慢调用）；异常比例/异常数模式下为对应的阈值 |            |
| timeWindow         | 熔断时长，单位为 s                                           |            |
| minRequestAmount   | 熔断触发的最小请求数，请求数小于该值时即使异常比率超出阈值也不会熔断（1.7.0 引入） | 5          |
| statIntervalMs     | 统计时长（单位为 ms），如 60*1000 代表分钟级（1.8.0 引入）   | 1000 ms    |
| slowRatioThreshold | 慢调用比例阈值，仅慢调用比例模式有效（1.8.0 引入）           |            |

1. 慢调用比例 ：设置慢调用RT，请求的响应时间大于后称为慢调用； 当一秒内大于最小请求数，且形成慢调用的比例大于阈值，接下来熔断时长内请求熔断；
2. 异常比例：一秒内请求数大于最小请求数，且异常比例大于阈值，接下来会进入熔断；
3. 异常数：一秒内异常请求超过阈值，进行熔断;