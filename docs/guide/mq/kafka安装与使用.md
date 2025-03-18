---
title: kafka安装与使用
abbrlink: 56a5a991
categories: mq
tags:
  - mq
  - java
  - kafka
---





# kafka安装使用

> 官方下载地址：http://kafka.apache.org/downloads
>
> 依赖环境：java8+、zookeeper
>
> kafka0.5以上集成了zookeeper所以此版本不需要下载zookeeper。此文档中我安装了最新版本2.8.0



1. **下载完成后解压文件**

2. **配置**

   kafka解压后进入config目录，这个目录下是所有配置

   **consumer.properites** 消费者配置，此处我们使用默认的即可

   **producer.properties**   生产者配置，此处我们使用默认的即可

   **server.properties** kafka服务器的配置，此配置文件用来配置kafka服务器，目前仅介绍几个最基础的配置

   - **broker.id:** 申明当前kafka服务器在集群中的唯一ID，需配置为integer,并且集群中的每一个kafka服务器的id都应是唯一的，我们这里采用默认配置即可

   - **listeners:** 申明此kafka服务器需要监听的端口号， 例如：listeners=PLAINTEXT:// 192.168.2.130:9092 或者 

     listeners=PLAINTEXT:// localhost:9092

   - **zookeeper.connect:** 申明kafka所连接的zookeeper的地址 ，需配置为zookeeper的地址，由于本次使用的是kafka高版本中自带zookeeper，使用默认配置即可 zookeeper.connect=localhost:2181

3. **运行**

   ​	进入kafka解压目录

   - 启动zookeeper

     ```shell
     nohup bin/zookeeper-server-start.sh  config/zookeeper.properties &
     # nohup 表示后台用户退出也不关闭
     # & 后台运行
     # -daemon 表示后台启动
     ```
     
   - 启动kafka
   
     ```shell
     nohup bin/kafka-server-start.sh -daemon config/server.properties &
     ```
   
4. **消息发送**

   - **创建一个名称为test的topic(主题消息)**

     ```shell
     bin/kafka-topics.sh --create --bootstrap-server localhost:9092  --topic test
     
     # --create 创建
     # --zookeeper 指定zookeeper
     
     
     # 可通过以下命令查看创建的topic
     bin/kafka-topics.sh --list --bootstrap-server localhost:9092
     # 查看指定的topic详情
     bin/kafka-topics.sh --bootstrap-server 192.168.230.128:9092 --describe --topic test
     ```

   - **创建消费者consumer**

     ```shell
     #创建一个用于消费topic为test的消费者
     bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test --from-beginning
     
     #创建完成后发现没有任何变化，这是因为消费者没有收到消息，不用关闭这个，打开一个新的终端
     ```

   - **创建生产者producer**

     ```shell
     # 创建一个用于生产消息的生产者
     bin/kafka-console-producer.sh --broker-list localhost:9092 --topic test
     
     # 生产者随便发送消息，消费者都可以收到消息
     ```

   - **终止kafka**

     ```shell
     # 终止kafka
     ctrl + c
     
     # 删除kafka的本地数据 包括创建的主题
     rm -rf /tmp/kafka-logs /tmp/zookeeper
     
     ```

     



# Springboot中使用Kafka

### 依赖文件

```xml
		<!-- kafka依赖 -->
        <dependency>
            <groupId>org.springframework.kafka</groupId>
            <artifactId>spring-kafka</artifactId>
        </dependency>
		<!--json 转换-->
         <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
            <version>1.2.70</version>
        </dependency>
        <!--引入lombok依赖-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>
         <!--web-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
```

### yaml配置文件

```yaml
spring:
  kafka:
    bootstrap-servers: 192.168.2.130:9092
    producer:
      # 发生错误后，消息重发的次数。
      retries: 0
      #当有多个消息需要被发送到同一个分区时，生产者会把它们放在同一个批次里。该参数指定了一个批次可以使用的内存大小，按照字节数计算。
      batch-size: 16384
      # 设置生产者内存缓冲区的大小。
      buffer-memory: 33554432
      # 键的序列化方式
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      # 值的序列化方式
      value-serializer: org.apache.kafka.common.serialization.StringSerializer
      # acks=0 ： 生产者在成功写入消息之前不会等待任何来自服务器的响应。
      # acks=1 ： 只要集群的首领节点收到消息，生产者就会收到一个来自服务器成功响应。
      # acks=all ：只有当所有参与复制的节点全部收到消息时，生产者才会收到一个来自服务器的成功响应。
      acks: 1
    consumer:
      # group-id 可以设置默认组
      # 自动提交的时间间隔 在spring boot 2.X 版本中这里采用的是值的类型为Duration 需要符合特定的格式，如1S,1M,2H,5D
      auto-commit-interval: 1S
      # 该属性指定了消费者在读取一个没有偏移量的分区或者偏移量无效的情况下该作何处理：
      # latest（默认值）在偏移量无效的情况下，消费者将从最新的记录开始读取数据（在消费者启动之后生成的记录）
      # earliest ：在偏移量无效的情况下，消费者将从起始位置读取分区的记录
      auto-offset-reset: earliest
      # 是否自动提交偏移量，默认值是true,为了避免出现重复数据和数据丢失，可以把它设置为false,然后手动提交偏移量
      enable-auto-commit: false
      # 键的反序列化方式
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      # 值的反序列化方式
      value-deserializer: org.apache.kafka.common.serialization.StringDeserializer
    listener:
      # 在侦听器容器中运行的线程数。
      concurrency: 5
      #listner负责ack，每调用一次，就立即commit
      ack-mode: manual_immediate
      missing-topics-fatal: false
```

### 创建生产者Producer

```java
@Log4j2
@Component
public class KafkaProducer {
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    /**
     * 消息发送
     * @param topic   标签名称
     * @param message 消息内容
     */
    public void send(String topic, String message) {
        log.info("生产消息==={}", message);
        ListenableFuture<SendResult<String, String>> future = kafkaTemplate.send(topic, message);
        future.addCallback(new ListenableFutureCallback<SendResult<String, String>>() {
            @Override
            public void onFailure(Throwable ex) {
                log.error("生产消息失败===={}, ex:{}", message, ex);
            }
            @Override
            public void onSuccess(SendResult<String, String> result) {

            }
        });
    }

}
```

### 创建消费者Consumer

```java
@Log4j2
@Component
public class KafkaConsumer {
    
    @KafkaListener(topics = "test", groupId = "test")
    public void saveMessage(ConsumerRecord<?, ?> record, Acknowledgment ack, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
        //判断是否为null
        Optional<?> message = Optional.ofNullable(record.value());
        if (message.isPresent()) {
            log.info("消费了消息 Topic: " + topic + ",Message:" + message.get().toString());
            //确认已消费消息
            ack.acknowledge();
        }
    }
}
```

> 注意消费者的@KafkaListener中监听的是，指定的 topic组和topic名称，不能缺少任意一项
>
> 我在此监听的是test标签组的消息

### 创建Controller测试

```java
@Log4j2
@RestController
@RequestMapping("/kafka")
public class KafkaController {

    @Autowired
    KafkaProducer kafkaProducer;

    @GetMapping("/send")
    public String sendMessage() {
        kafkaProducer.send("test", "这是一条topic消息");
        return "发送成功";
    }
}
```



