---
title: Java线程
abbrlink: 50590
categories: java
tags:
 - java
---



## 线程的状态

1. **新建（newThread）**

   当新建一个线程后，该线程处于新建状态，此时它和 Java对象一样，仅仅由Java 虚拟机为其分配内存空间，并初始化成员变量。同时已经有了相应的内存空间和其他资源，但是尚未运行start（）方法。

   

2. **就绪（runnable）**

   当线程有资格运行，但调度程序还没有把它选定为运行线程时线程所处的状态。当start()方法调用时,线程首先进人就绪状态。在线程运行之后或者从阻塞状态回来后，也返回到就绪状态。

   

3. **运行（running）**

   当一个线程进入“运行”状态下，并不代表它可以一直执行到run()结束。因为事实上它只是加入此应用程序执行安排的队列中，正在等待分享CPU资源，也就是等候执行权，在何时给予线程执行权则由JVM决定，同时也由线程的优先级决定。

   

4. **死亡（dead）**

   处于死亡状态的线程不具有继续运行的能力，线程的死亡有两种，一种是正常运行的线程完成了它全部工作(run()方法中全部语句)，另一种是线程被提前强制终止，即强制run()方法结束。所谓死亡状态就是线程释放了分配给线程对象的内存。不要试图对死亡的线程调用start()方法来启动它,死亡线程不可能再次运行。

   

5. **阻塞（blocked）**

   阻塞状态是线程因为某种原因放弃CPU使用权，暂时停止运行。直到线程进入就绪状态，才有机会转到运行状态。阻塞的情况分为以下3种。

   (1）等待阻塞:运行的线程执行wait()方法，JVM会把该线程放入等待池中。

   (2)同步阻塞:运行的线程在获取对象的同步锁时，若该同步锁被别的线程占用，则JVM会把该线程放入锁池中。

   ( 3）其他阻塞:运行的线程执行sleep()或join()方法，或者发出了IO 请求时，JVM 会把该线程置为阻塞状态。当sleep()状态超时、join()等待线程终止或者超时、或者I/O处理完毕时，线程重新转入就绪状态。



## **new Thread的弊端**

```java
new Thread(new Runnable() {
 
@Override
public void run() {
// TODO Auto-generated method stub
}
}).start();
```

a. 每次new Thread新建对象性能差。

b. 线程缺乏统一管理，可能无限制新建线程，相互之间竞争，及可能占用过多系统资源导致死机或oom。

c. 缺乏更多功能，如定时执行、定期执行、线程中断。



`相比new Thread，Java提供的四种线程池的好处在于：`

a. 重用存在的线程，减少对象创建、消亡的开销，性能佳。

b. 可有效控制最大并发线程数，提高系统资源的使用率，同时避免过多资源竞争，避免堵塞。
c. 提供定时执行、定期执行、单线程、并发数控制等功能





## JDK自带的四种线程池



**Java里面线程池的顶级接口是Executor，但是严格意义上讲Executor并不是一个线程池，而只是一个执行线程的工具。真正的线程池接口是ExecutorService。**



| 线程名                  | 介绍                                                         |
| ----------------------- | ------------------------------------------------------------ |
| newCachedThreadPool     | 创建一个可缓存线程池，如果线程池长度超过处理需要，可灵活回收空闲线程，若无可回收，则新建线程。 |
| newFixedThreadPool      | 创建一个定长线程池，可控制线程最大并发数，超出的线程会在队列中等待。 |
| newScheduledThreadPool  | 创建一个定长线程池，支持定时及周期性任务执行。               |
| newSingleThreadExecutor | 创建一个单线程化的线程池，它只会用唯一的工作线程来执行任务，保证所有任务按照指定顺序(FIFO, LIFO, 优先级)执行。 |



**创建线程的方式**

```java
// 第一种线程池:固定个数的线程池,可以为每个CPU核绑定一定数量的线程数
ExecutorService fixedThreadPool = Executors.newFixedThreadPool(processors * 2);
// 缓存线程池，无上限
ExecutorService cachedThreadPool = Executors.newCachedThreadPool();
// 单一线程池,永远会维护存在一条线程
ExecutorService singleThreadPool = Executors.newSingleThreadExecutor();
// 固定个数的线程池，可以执行延时任务，也可以执行带有返回值的任务。
ScheduledExecutorService scheduledThreadPool = Executors.newScheduledThreadPool(5);

```



```Java
//创建线程池
ExecutorService threadPool = Executors.newFixedThreadPool(5);

for (int i = 0; i < 10; i++) {
            threadPool.execute(() -> {
                System.out.println(Thread.currentThread().getName());
            });
}
--------------------------------------------------------------------------------------------
--结果
pool-1-thread-1
pool-1-thread-2
pool-1-thread-1
pool-1-thread-3
pool-1-thread-2
pool-1-thread-4
pool-1-thread-4
pool-1-thread-1
pool-1-thread-5
pool-1-thread-2
```





## ThreadPoolExecutor的七大参数



| 参数名                            | 参数介绍                                                     |
| --------------------------------- | ------------------------------------------------------------ |
| corePoolSize（线程池基本大小）    | 核心线程数量，永远不会被销毁                                 |
| maximumPoolSize（线程池最大大小） | 线程池中的最大线程数量                                       |
| keepAliveTime（线程存活保持时间） | 当线程池创建的线程数大于 corePoolSize但小于等于maximumPoolSize的时候，只要线程处于空闲的时候，线程池会根据 keepAliveTime设置的时间去销毁多出 corePoolSize个数的线程 |
| unit（keepAliveTime 的时间单位）  | 默认毫秒级别                                                 |
| workQueue（阻塞队列）             | 存放任务的工作队列，用来存放 corePoolSize处理不过来的任务    |
| threadFactory(线程工程)           | 用来生产线程以便去处理任务，可以自定义适合业务的线程工厂     |
| handler（任务拒绝策略）           | 用来处理当 workQueue已经满且 maximumPoolSize达到最大上限的时候，用来处理新提交的任务 |

