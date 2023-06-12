---
title: springboot使用quartz(一)
abbrlink: 24757
categories: springBoot
tags:
 - java
 - Quartz
 - SpringBoot
---



# 一、spring使用计时器

1. **引入相关依赖**

   ```xml
   	<!--spring quartz定时器 -->
   		<dependency>
   			<groupId>org.quartz-scheduler</groupId>
   			<artifactId>quartz</artifactId>
   			<version>2.3.0</version>
   		</dependency>
   
   		<dependency>
   			<groupId>org.quartz-scheduler</groupId>
   			<artifactId>quartz-jobs</artifactId>
   			<version>2.3.0</version>
   		</dependency>
   
   		<dependency>
   			<groupId>org.springframework</groupId>
   			<artifactId>spring-context-support</artifactId>
   			<version>${spring.version}</version>
   		</dependency>
   ```

2. **创建applicationContext.xml主配置文件**

   ```xml
       <!-- 扫描带注解的类，注入到ioc容器 -->
       <context:component-scan base-package="com.xcw.quartz"></context:component-scan>
       
       <!--引入定时器-->
       <import resource="classpath:spring/applicationContext-quartz.xml"/>
   ```

3. **创建dispatcherServlet-servlet.xml配置文件**

   ```xml
   	<!--扫描所有带注解的包 -->
   	<context:component-scan base-package="com.xcw.quartz"></context:component-scan>
   
   	<!--设置映射器 适配器 -->
   	<mvc:annotation-driven></mvc:annotation-driven>
   
   	<!--视图解析器 -->
   	<bean
   		class="org.springframework.web.servlet.view.InternalResourceViewResolver">
   		<!-- <property name="prefix" value="../" /> -->
   		<property name="suffix" value=".jsp" />
   	</bean>
   ```

4. **web.xml配置 前端控制器和监听器**

   ```xml
   	<!-- 1、启动Spring的容器 -->
       <context-param>
           <param-name>contextConfigLocation</param-name>
           <param-value>classpath:spring/applicationContext.xml</param-value>
       </context-param>
   
       <listener>
           <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
       </listener>
   
   
       <!-- 2、配置SpringMVC的前端控制器，用来拦截所有请求 -->
       <servlet>
           <servlet-name>dispatcherServlet</servlet-name>
   
           <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
           <!-- <init-param>
               <param-name>contextConfigLocation</param-name>
               <param-value>classpath:spring/applicationContext.xml</param-value>
           </init-param> -->
           <!-- 不指定SpringMVC配置文件的地址，默认在WEB-INF目录下存在dispatcherServlet-servlet.xml配置文件，与上述属性同名 -->
           <load-on-startup>1</load-on-startup>
       </servlet>
   
       <servlet-mapping>
           <servlet-name>dispatcherServlet</servlet-name>
           <!-- 拦截所有请求 -->
           <url-pattern>/</url-pattern>
       </servlet-mapping>
   ```

   

5. **创建定时任务**

   ```Java
   public class TaskTest1 {
       
   	public void task1() throws InterruptedException {
   		logger.info("任务执行了");
   	}
   }
   ```

6. **在applicationContext-quartz.xml中配置任务**

   ```xml
   <!--1.配置任务类 -->
   	<bean id="TaskTest1"
   		class="com.xcw.quartz.task.TaskTest1" />
   
   	<!--2.配置配置任务详情 -->
   	<bean id="task1Detail"
   		class="org.springframework.scheduling.quartz.MethodInvokingJobDetailFactoryBean">
   		<!--配置用到的job示例(目标对象) -->
   		<property name="targetObject" ref="TaskTest1" />
   		<!--job中需要执行的方法(目标方法) -->
   		<property name="targetMethod" value="task1"></property>
   	</bean>
   
   	<!--3.配置触发器(配置任务执行时间) -->
   	<bean id="logSaveJobTriggers"
   		class="org.springframework.scheduling.quartz.CronTriggerFactoryBean">
   		<!--注入任务详情 -->
   		<property name="jobDetail" ref="task1Detail" />
   		<!--设置任务执行的时间(使用cron表达式进行标识) 即通过表达式进行指定任务执行的时间点 -->
   		<property name="cronExpression">
   			<!--每两秒执行一次 -->
   			<value>0/2 * * * * ?</value>
   		</property>
   	</bean>
   
   	<!--4.配置调度工厂 -->
   	<bean id="schedulerFactoryBean"
   		class="org.springframework.scheduling.quartz.SchedulerFactoryBean">
   		<property name="triggers">
   			<list>
   				<!--可以配置多个 -->
   				<ref bean="logSaveJobTriggers" />
   			</list>
   		</property>
   	</bean>
   ```



> 5-6步可替换为以下方式

```java
@Component
public class TaskTest1 {
	private Logger logger= LoggerFactory.getLogger(ScheduledTask.class);

    // fixedRate = 5000表示每隔5秒，Spring scheduling会调用一次该方法，不论该方法的执行时间是多少
    @Scheduled(fixedRate = 5000)
    public void task() {
        logger.info("每隔5秒执行一次");
    }

    // fixedDelay = 5000表示当方法执行完毕5秒后，Spring scheduling会再次调用该方法
    @Scheduled(fixedDelay = 5000)
    public void taskAfter() {
        logger.info("当方法执行完毕5秒后执行");
    }

    // cron = "*/5 * * * * * *" 通用的定时任务表达式，表示每隔5秒执行一次
    @Scheduled(cron = "*/5 * * * * *")
    public void taskCron() {
        logger.info("每隔5秒执行一次");
    }
}
```

```xml
<!-- 启用定时任务  开启此配置才能识别@Scheduled注解标注的定时任务 -->
<task:annotation-driven executor="executor" scheduler="scheduler"/>
<!--执行器线程池-->
<task:executor id="executor" pool-size="5" />
<!--调度器线程池-->
<task:scheduler id="scheduler" pool-size="10" />

<!--注意需要引入task命名空间才可使用-->
```





# 二、springboot使用计时器

1. **引入依赖**

   ```xml
   <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-quartz</artifactId>
   </dependency>
   ```

2. **启动类添加注解 开启定时器任务**

   ```java
   @EnableScheduling //开启定时器任务
   ```

3. **创建任务类**

   ```java
   @Component
   public class LogSaveJob {
      private Logger logger= LoggerFactory.getLogger(LogSaveJob.class);
   
       // fixedRate = 5000表示每隔5秒，Spring scheduling会调用一次该方法，不论该方法的执行时间是多少
       @Scheduled(fixedRate = 5000)
       public void task() {
           logger.info("每隔5秒执行一次");
       }
   
       // fixedDelay = 5000表示当方法执行完毕5秒后，Spring scheduling会再次调用该方法
       @Scheduled(fixedDelay = 5000)
       public void taskAfter() {
           logger.info("当方法执行完毕5秒后执行");
       }
   
       // cron = "*/5 * * * * * *" 通用的定时任务表达式，表示每隔5秒执行一次
       @Scheduled(cron = "*/5 * * * * *")
       public void taskCron() {
           logger.info("每隔5秒执行一次");
       }
   }
   ```



> **springboot默认单线程执行任务，要想串行执行任务要创建线程池**  或者使用@EnableAsync来异步调用方法

```java
@Configuration
public class TaskSchedulerConfig {
    @Bean
    public TaskScheduler taskScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        //线程池大小
        scheduler.setPoolSize(20);
        //线程名前缀
        scheduler.setThreadNamePrefix("Task-name-");

        return scheduler;
    }
}
```



# 三、cron表达式

`表达式生成地址：https://cron.qqe2.com/`



**1.cron一共有7位，但是最后一位是年（1970－2099），可以留空，所以我们可以写6位,按顺序依次为**

格式：[秒] [分] [小时] [日] [月] [周] [年]

| 序号 | 说明 | 是否必填 |    允许填写的值    | 允许的通配符  |
| :--: | ---- | -------- | :----------------: | ------------- |
|  1   | 秒   | 是       |        0-59        | , - * /       |
|  2   | 分   | 是       |        0-59        | , - * /       |
|  3   | 小时 | 是       |        0-23        | , - * /       |
|  4   | 日   | 是       |        1-31        | , - * ? / L W |
|  5   | 月   | 是       |  1-12 or JAN-DEC   | , - * /       |
|  6   | 周   | 是       |   1-7 or SUN-SAT   | , - * ? / L # |
|  7   | 年   | 否       | empty 或 1970-2099 | , - * /       |



(*)星号：
可以理解为每的意思，每秒，每分，每天，每月，每年…*

(?)问号：
问号只能出现在日期和星期这两个位置，表示这个位置的值不确定，每天3点执行，所以第六位星期的位置，我们是不需要关注的，就是不确定的值。同时：日期和星期是两个相互排斥的元素，通过问号来表明不指定值。比如，1月10日，比如是星期1，如果在星期的位置是另指定星期二，就前后冲突矛盾了。

(-)减号：
表达一个范围，如在小时字段中使用“10-12”，则表示从10到12点，即10,11,12

(,)逗号：
表达一个列表值，如在星期字段中使用“1,2,4”，则表示星期一，星期二，星期四

(/)斜杠：如：x/y，x是开始值，y是步长，比如在第一位（秒） 0/15就是，从0秒开始，每15秒，最后就是0，15，30，45，60 另：*/y，等同于0/y

(#)井号:

只能出现在周当中





**eg.下面列举几个例子供大家来验证：**

```sql
0 0 3 * * ? 			--每天3点执行
0 5 3 * * ? 			--每天3点5分执行
0 5 3 ? * * 			--每天3点5分执行，与上面作用相同
0 5/10 3 * * ? 			--每天3点的 5分，15分，25分，35分，45分，55分这几个时间点执行
0 10 3 ? * 1 			--每周星期天，3点10分 执行，注：1表示星期天
0 10 3 ? * 1#3 			--每个月的第三个星期，星期天 执行，#号只能出现在星期的位置
```

**常用示例:**
格式: [秒] [分] [小时] [日] [月] [周] [年]

```sh
0 0 12 * * ?  			#每天12点触发
0 15 10 ? * * 			#每天10点15分触发
0 15 10 * * ? 			#每天10点15分触发
0 15 10 * * ? * 		#每天10点15分触发
0 15 10 * * ? 2005 		#2005年每天10点15分触发
0 * 14 * * ? 			#每天下午的 2点到2点59分每分触发
0 0/5 14 * * ? 			#每天下午的 2点到2点59分(整点开始，每隔5分触发)
0 0/5 14,18 * * ? 		#每天下午的 18点到18点59分(整点开始，每隔5分触发)
0 0-5 14 * * ? 			#每天下午的 2点到2点05分每分触发
0 10,44 14 ? 3 WED 		#3月分每周三下午的 2点10分和2点44分触发
0 15 10 ? * MON-FRI 	#从周一到周五每天上午的10点15分触发
0 15 10 15 * ? 			#每月15号上午10点15分触发
0 15 10 L * ? 			#每月最后一天的10点15分触发
0 15 10 ? * 6L 			#每月最后一周的星期五的10点15分触发
0 15 10 ? * 6L 2002-2005 #从2002年到2005年每月最后一周的星期五的10点15分触发
0 15 10 ? * 6#3 		#每月的第三周的星期五开始触发
0 0 12 1/5 * ? 			#每月的第一个中午开始每隔5天触发一次
0 11 11 11 11 ? 		#每年的11月11号 11点11分触发(光棍节)
```

