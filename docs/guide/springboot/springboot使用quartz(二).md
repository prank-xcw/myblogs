---
title: springboot使用quartz(二)
categories: springBoot
tags:
  - java
  - Quartz
  - SpringBoot
abbrlink: 36d99f4f
---





[TOC]









# Spring任务调度

> spring中使用任务调度很简单，只需要使用@EnableScheduling开启任务调度，其次在对应任务方法上使用@Scheduled就可以实现



1. spring boot的启动类添加注解`@EnableScheduling`

   

2. 新建任务并指定任务触发时间

   ```Java
   @Log4j2
   @Component
   public class SpringJob {
   
       // fixedRate = 5000表示每隔5秒，Spring scheduling会调用一次该方法，不论该方法的执行时间是多少
       @Scheduled(fixedRate = 5000)
       public void task() {
           log.info(Thread.currentThread().getName()+ " start");
         
           log.info(Thread.currentThread().getName() + " end");
       }
   
       // cron = "*/5 * * * * * *" 通用的定时任务表达式，表示每隔5秒执行一次
       @Scheduled(cron = "*/5 * * * * *")
       public void taskCron() {
           log.info("Spring annotation start 每隔5秒执行一次");
         
           log.info("Spring annotation end 每隔5秒执行一次");
       }
   
   
   }
   ```



**指定spring任务调度线程池**

```Java
/**
 * @author xcw
 * @date 2021/5/31 15:15
 * @description 任务调度器 :springboot默认单线程执行任务，要想串行执行任务要创建线程池
 */
@Configuration
public class ThreadPoolConfig {
    /**
     * 任务调度器线程配置
     */
    @Bean
    public TaskScheduler taskScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        //线程池大小
        scheduler.setPoolSize(20);
        //线程名前缀
        scheduler.setThreadNamePrefix(" Task-Scheduler-");
        // 设置线程池关闭的时候等待所有任务都完成再继续销毁其他的Bean
        scheduler.setWaitForTasksToCompleteOnShutdown(true);
        // 线程池对拒绝任务的处理策略,当线程池没有处理能力的时候，该策略会直接在 execute 方法的调用线程中运行被拒绝的任务；如果执行程序已关闭，则会丢弃该任务
        scheduler.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        return scheduler;
    }
}
```





# Quartz使用

## 基本使用

1. springboot2.x后只需引入依赖

   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-quartz</artifactId>
   </dependency>
   ```

   

2. 创建任务，实现Job接口或者继承QuartzJobBean类都可以

   ```java
   package com.learn.spring.quartz.job;
   
   import com.learn.spring.quartz.servic.QuartzService;
   import lombok.extern.log4j.Log4j2;
   import org.quartz.DisallowConcurrentExecution;
   import org.quartz.Job;
   import org.quartz.JobExecutionContext;
   import org.quartz.JobExecutionException;
   
   @Log4j2
   //此注解表示禁用并发执行Job
   @DisallowConcurrentExecution
   public class TaskTest implements Job {
   
       @Override
       public void execute(JobExecutionContext context) {
           log.info("TaskTest job start;");
         
           log.info("TaskTest job end;");
       }
   }
   
   ```

   

3. 创建QuartzConfig，给任务绑定对应的触发器

   ```java
   package com.learn.spring.quartz.config;
   
   import com.learn.spring.quartz.job.TaskTest;
   import lombok.SneakyThrows;
   import org.quartz.*;
   import org.quartz.impl.StdSchedulerFactory;
   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.beans.factory.annotation.Qualifier;
   import org.springframework.context.annotation.Bean;
   import org.springframework.context.annotation.Configuration;
   
   /**
    * <pre>
    *      1.配置jobDetail
    *      2.配置Trigger
    *      3.springboot自动调用任务调度器
    * </pre>
    */
   @Configuration
   public class QuartzConfig {
   
       @Bean("TaskTestDetail")
       public JobDetail buildTaskTestDetailDetail() {
           return JobBuilder.newJob(TaskTest.class)
                   //任务名称和任务分组 组合成任务唯一标识
                   .withIdentity("TaskName", "default_job_group")
                   //无触发器（Trigger）指向时是否需要继续持久化
                   .storeDurably()
                   .build();
       }
   
       @Bean
       public Trigger buildTaskTestDetailTrigger(@Qualifier("TaskTestDetail") JobDetail jobDetail) {
           return TriggerBuilder.newTrigger()
                   //优先级 默认5
                   .withPriority(5)
                   //设置触发器名称、触发器分组，组合为触发器唯一标识
                   .withIdentity("TaskTriggerName", "default_trigger_group")
                   //设置用于定义触发器的规则
                   .withSchedule(SimpleScheduleBuilder.repeatSecondlyForever(5))
                   .forJob(jobDetail)
                   .build();
           /**
            * 触发规则有以下四种
            * CronScheduleBuilder              ：cron表达式
            * SimpleScheduleBuilder            ：每隔一段时间执行一次(时分秒)，可以设置执行总次数
            * CalendarIntervalScheduleBuilder  ：每隔一段时间执行一次(年月日)
            * DailyTimeIntervalScheduleBuilder ： 设置年月日中的某些固定日期，可以设置执行总次数
            *
            */
           
       }
   
   }
   
   ```

   



## 触发器



> Quartz一共有四种触发器以下规则
>
>  CronScheduleBuilder              	 	：cron表达式
>  SimpleScheduleBuilder         		  ：每隔一段时间执行一次(时分秒)，可以设置执行总次数
>  CalendarIntervalScheduleBuilder  ：每隔一段时间执行一次(年月日)
>  DailyTimeIntervalScheduleBuilder ： 设置年月日中的某些固定日期，可以设置执行总次数



**CronScheduleBuilder：cron表达式**

```java 
CronScheduleBuilder builder = CronScheduleBuilder.cronSchedule("*/5 * * * * ?");
```



**SimpleScheduleBuilder：每隔一段时间执行一次(时分秒)，可以设置执行总次数**

- RepeatForever：指定触发器将无限期重复。
- WithRepeatCount：指定重复次数

```java
SimpleScheduleBuilder builder = SimpleScheduleBuilder
    .repeatSecondlyForTotalCount(5, 3);
//  .simpleSchedule()
//  .withIntervalInSeconds(3) //每隔3秒执行一次
//  .repeatForever()) //一直执行，奔腾到老不停歇
//  .withRepeatCount(5); //重复计数，重复5次 （如果没有任务开始时间，会在创建触发器时就触发一次（n+1））
```



**CalendarIntervalScheduleBuilder：每隔一段时间执行一次(年月日)**

- OnDaysOfTheWeek：设置触发器一周中的哪几天

- OnMondayThroughFriday：从星期一到星期五

- OnSaturdayAndSunday：周六和周日

- OnEveryDay：每天

- 每天10:00到23:10.00的每一分钟执行一次

  

```Java
CalendarIntervalScheduleBuilder builder = CalendarIntervalScheduleBuilder
                    .calendarIntervalSchedule()
//                    .withIntervalInMonths(1)// 每月执行一次
                    .withIntervalInWeeks(1); // 每周执行一次
```



**DailyTimeIntervalScheduleBuilder： 设置年月日中的某些固定日期，可以设置执行总次数**

- startTimeOfDay 每天开始时间
- endTimeOfDay 每天结束时间
- daysOfWeek 需要执行的星期
- interval 执行间隔
- repeatCount 重复次数

```Java
DailyTimeIntervalScheduleBuilder
    .dailyTimeIntervalSchedule() // 使用dailyTimeIntervalSchedule
    .startingDailyAt(TimeOfDay.hourAndMinuteOfDay(9, 0)) // 设置开始时间,从九点开始
    .endingDailyAt(TimeOfDay.hourAndMinuteOfDay(17, 0)) // 设置结束时间，下午五点结束
    .withIntervalInHours(1) // 每一小时执行一次
    .withRepeatCount(14)// 一共执行14次（实际执行14+1次）
    .onDaysOfTheWeek(1, 2, 3, 4); // 周一到周四执行。不写即每天执行
```







## 创建工具类



> 使用工具类可实现对任务的 添加、暂停、恢复、删除操作



**先创建一个传递参数的Bean**

```Java
package com.learn.spring.quartz.config;

import lombok.Builder;
import lombok.Data;
import org.quartz.Job;
import org.quartz.Trigger;

import java.io.Serializable;

@Data
@Builder
public class QuartzBean implements Serializable {

    private static final long serialVersionUID = 7262123422794578743L;
    /**
     * 任务名称
     */
    private String jobName;

    /**
     * 任务分组
     */
    private String jobGroup;

    /**
     * 没有Trigger指向时，是否需要继续持久化
     */
    private boolean storeDurably = true;

    /**
     * Trigger优先级,当多个Trigger有相同的触发时间时，优先级最高的先触发
     */
    private int priority = Trigger.DEFAULT_PRIORITY;


    /**
     * 任务类
     */
    private Class<? extends Job> jobClass;

    /**
     * 计划执行表达式
     */
    private String cronExpression;
}

```



```Java
package com.learn.spring.quartz.config;

import lombok.extern.log4j.Log4j2;
import org.quartz.*;
import org.quartz.impl.StdSchedulerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @author xcw
 * @date 2022/9/21 15:24
 * @description Quartz任务操作帮助类
 * <p>
 * 自定义添加、删除、修改定时任务
 */
@Log4j2
@Component
public class QuartzHelper {

    private static SchedulerFactory sf = new StdSchedulerFactory();


    /**
     * 任务调度器
     */
    private static Scheduler scheduler;

    @Autowired
    public void setScheduler(Scheduler scheduler) {
        QuartzHelper.scheduler = scheduler;
    }


    /**
     * 添加新的定时任务
     * <p>
     * 传入  {@link QuartzBean} 任务配置类
     */
    public static void addJob(QuartzBean quartzBean) {
        try {
            // 构建一个jobDetail
            JobDetail jobDetail = JobBuilder.newJob(quartzBean.getJobClass())
                    .withIdentity(quartzBean.getJobName(), quartzBean.getJobGroup())
                    .storeDurably(quartzBean.isStoreDurably())
                    .build();

            // 创建以一个cron 表达式的调度器
            CronScheduleBuilder scheduleBuilder = CronScheduleBuilder.cronSchedule(quartzBean.getCronExpression());

            // 创建一个触发器
            CronTrigger trigger = TriggerBuilder.newTrigger()
                    .withIdentity(quartzBean.getJobName(), quartzBean.getJobGroup())
                    .withPriority(quartzBean.getPriority())
                    .withSchedule(scheduleBuilder).build();

            //将job添加到任务调度器，并关联对应的触发器
            scheduler.scheduleJob(jobDetail, trigger);
        } catch (SchedulerException e) {
            log.error("添加新任务异常,Task Name [{}],Task Group [{}]", quartzBean.getJobName(), quartzBean.getJobGroup());
            e.printStackTrace();
        }
    }

    public static void addJob(String jobName, Job job, String cronExpression) {
        addJob(jobName, job, cronExpression, null);
    }

    public static void addJob(String jobName, Job job, String cronExpression, JobDataMap jobDataMap) {
        addJob(jobName, null, job, cronExpression, jobDataMap);
    }

    public static void addJob(String jobName, String jobGroup, Job job, String cronExpression, JobDataMap jobDataMap) {
        addJob(jobName, null, job, cronExpression, true, jobDataMap);
    }

    public static void addJob(String jobName, String jobGroup, Job job, String cronExpression, Boolean storeDurably, JobDataMap jobDataMap) {
        try {
            // 构建一个jobDetail
            jobDataMap = jobDataMap == null ? new JobDataMap() : jobDataMap;
            JobDetail jobDetail = JobBuilder.newJob(job.getClass())
                    .withIdentity(jobName, jobGroup)
                    .usingJobData(jobDataMap)
                    .storeDurably(storeDurably)
                    .build();

            // 创建以一个cron 表达式的调度器
            CronScheduleBuilder scheduleBuilder = CronScheduleBuilder.cronSchedule(cronExpression);

            // 创建一个触发器
            CronTrigger trigger = TriggerBuilder.newTrigger()
                    .withIdentity(jobName, jobGroup)
                    .withSchedule(scheduleBuilder).build();

            //将job添加到任务调度器，并关联对应的触发器
            scheduler.scheduleJob(jobDetail, trigger);
        } catch (SchedulerException e) {
            log.error("添加新任务异常,Task Name [{}],Task Group [{}]", jobName, jobGroup);
            e.printStackTrace();
        }
    }


    /**
     * 暂停定时任务
     */
    public static void pauseJob(QuartzBean quartzBean) {
        JobKey jobKey = getJobKey(quartzBean);
        pauseJob(jobKey);
    }

    public static void pauseJob(String jobName) {
        pauseJob(jobName, null);
    }

    public static void pauseJob(String jobName, String jobGroupName) {
        JobKey jobKey = getJobKey(jobName, jobGroupName);
        pauseJob(jobKey);
    }

    public static void pauseJob(JobKey jobKey) {
        try {
            scheduler.pauseJob(jobKey);
        } catch (SchedulerException e) {
            log.error("暂停任务异常,Task Name [{}],Task Group [{}]", jobKey.getName(), jobKey.getGroup());
            e.printStackTrace();
        }
    }

    /**
     * 恢复/重新启动定时任务
     */
    public static void resumeJob(QuartzBean quartzBean) {
        JobKey jobKey = getJobKey(quartzBean);
        resumeJob(jobKey);
    }

    public static void resumeJob(String jobName) {
        resumeJob(jobName, null);
    }

    public static void resumeJob(String jobName, String jobGroupName) {
        JobKey jobKey = getJobKey(jobName, jobGroupName);
        resumeJob(jobKey);
    }

    public static void resumeJob(JobKey jobKey) {
        try {
            scheduler.resumeJob(jobKey);
        } catch (SchedulerException e) {
            log.error("任务恢复异常,Task Name [{}],Task Group [{}]", jobKey.getName(), jobKey.getGroup());
            e.printStackTrace();
        }
    }


    /**
     * 手动触发一次
     *
     * @param jobName 定时任务名称
     */
    public static void runOnce(String jobName) {
        runOnce(jobName, null);
    }

    /**
     * 手动触发一次
     *
     * @param jobName      定时任务名称
     * @param jobGroupName 定时任务分组
     */
    public static void runOnce(String jobName, String jobGroupName) {
        JobKey jobKey = getJobKey(jobName, jobGroupName);
        runOnce(jobKey);
    }

    public static void runOnce(JobKey jobKey) {
        try {
            scheduler.resumeJob(jobKey);
        } catch (SchedulerException e) {
            e.printStackTrace();
        }
    }


    /**
     * 更新定时任务触发时间
     */
    public static void updateJob(QuartzBean quartzBean) {
        //获取到对应任务的触发器
        TriggerKey triggerKey = getTriggerKey(quartzBean);
        updateJob(triggerKey, quartzBean.getCronExpression());
    }

    public static void updateJob(String triggerName, String cronExpression) {
        updateJob(triggerName, null, cronExpression);
    }

    public static void updateJob(String triggerName, String triggerGroupName, String cronExpression) {
        //获取到对应任务的触发器
        TriggerKey triggerKey = getTriggerKey(triggerName, triggerGroupName);
        updateJob(triggerKey, cronExpression);
    }

    /**
     * 更新定时任务触发时间
     */
    public static void updateJob(TriggerKey triggerKey, String cronExpression) {
        try {
            //获取到对应任务的触发器

            //设置定时任务表达式
            CronScheduleBuilder scheduleBuilder = CronScheduleBuilder.cronSchedule(cronExpression);

            //重新构建任务的触发器trigger
            CronTrigger trigger = (CronTrigger) scheduler.getTrigger(triggerKey);
            trigger = trigger.getTriggerBuilder()
                    .withIdentity(triggerKey)
                    .withSchedule(scheduleBuilder).build();
            //重置对应的job
            scheduler.rescheduleJob(triggerKey, trigger);
        } catch (SchedulerException e) {
            log.error("更新任务异常,Task Name [{}],Task Group [{}]", triggerKey.getName(), triggerKey.getGroup());
            e.printStackTrace();
        }
    }


    /**
     * 删除对应定时任务
     *
     * @param name 任务名称
     */
    public static void removeJob(String name) {
        removeJob(name, null);
    }

    public static void removeJob(String name, String groupName) {
        TriggerKey triggerKey = getTriggerKey(name, groupName);
        JobKey jobKey = getJobKey(name, groupName);
        try {
            scheduler.pauseTrigger(triggerKey);
            scheduler.unscheduleJob(triggerKey);
            scheduler.deleteJob(jobKey);
        } catch (SchedulerException e) {
            log.error("删除任务异常,Task Name [{}],Task Group [{}]", jobKey.getName(), jobKey.getGroup());
            e.printStackTrace();
        }
    }


    private static JobKey getJobKey(QuartzBean quartzBean) {
        return getJobKey(quartzBean.getJobName(), quartzBean.getJobGroup());
    }

    private static JobKey getJobKey(String jobName, String jobGroupName) {
        return JobKey.jobKey(jobName, jobGroupName);
    }

    private static TriggerKey getTriggerKey(QuartzBean quartzBean) {
        return getTriggerKey(quartzBean.getJobName(), quartzBean.getJobGroup());
    }

    private static TriggerKey getTriggerKey(String groupName, String group) {
        return TriggerKey.triggerKey(groupName, group);
    }
}

```













# 遇到的问题



**解决Job类里使用@Autowired出现空指针异常：重新JobFactory方法注入到Spring，重新指定调度器（Schelder）的JobFactory**



```Java
package com.learn.spring.quartz.config;

import org.quartz.spi.TriggerFiredBundle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.scheduling.quartz.AdaptableJobFactory;
import org.springframework.stereotype.Component;

/**
 * 解决SpringBoot不能在Quartz中注入Bean的问题
 */
@Component
public class QuartzJobFactory extends AdaptableJobFactory {
    /**
     * AutowireCapableBeanFactory接口是BeanFactory的子类，可以连接和填充那些生命周期不被Spring管理的已存在的bean实例
     */
    @Autowired
    private AutowireCapableBeanFactory capableBeanFactory;

    /**
     * 创建Job实例
     */
    @Override
    protected Object createJobInstance(TriggerFiredBundle bundle) throws Exception {
        // 实例化对象
        Object jobInstance = super.createJobInstance(bundle);
        // 进行注入（Spring管理该Bean）
        capableBeanFactory.autowireBean(jobInstance);
        //返回对象
        return jobInstance;
    }

}

```



```java
@Autowired
    private QuartzJobFactory jobFactory;

    @Bean
    @SneakyThrows
    public Scheduler scheduler() {
        SchedulerFactory schedulerFactory = new StdSchedulerFactory();
        Scheduler scheduler = schedulerFactory.getScheduler();
        // 自定义 JobFactory 使得在 Quartz Job 中可以使用 @Autowired/有参构造
        scheduler.setJobFactory(jobFactory);
        scheduler.start();
        return scheduler;
    }
```

