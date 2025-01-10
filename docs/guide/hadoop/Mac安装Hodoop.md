---
title: Mac安装Hodoop
sidebar: auto
categories: hodoop
tags:
  - hodoop
---





> 准备工作
>
> 配置ssh环境 
>
> ssh-keygen -t rsa -b 4096
>
> cd ~/.ssh
>
> cat id_rsa.pub >> authorized_keys





## 一、安装



PS: 这种安装方式可能会少 lib/native 文件夹，具体原因未知。可切换手动安装：:link:https://archive.apache.org/dist/hadoop/core/

```sh
#使用homebrew安装
brew install hodoop


#检查是否安装成功
hadoop version
```

![image-20250106161415164](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/202501061614594.png)



## 二、配置

### 方式一：brew配置

1. 进入`hadoop`安装目录

   ```sh
   cd /opt/homebrew/Cellar/hadoop/3.4.1/libexec/etc/hadoop
   ```

   

2. 修改 `core-site.xml`

   创建temp目录 `mkdir /opt/homebrew/Cellar/hadoop/tmp`

   ```xml
   <configuration>
     <property>
       <name>fs.defaultFS</name>
       <value>hdfs://localhost:8020</value>
     </property>
    
     <property>
       <name>hadoop.tmp.dir</name>
       <!--创建tmp文件夹，用来指定hadoop运行时产生文件的存放目录-->
       <value>file:/opt/homebrew/Cellar/hadoop/tmp</value>
     </property>
   </configuration>
   ```

   

3. 修改`hdfs-site.xml`

   ```xml
   <configuration>
      <property>
         <name>dfs.replication</name>
         <value>1</value>
       </property>
     
       <property>
          <name>dfs.permissions</name>
          <value>false</value>   
        </property>
      
       <property>
          <name>dfs.namenode.name.dir</name>
           <value>file:/opt/homebrew/Cellar/hadoop/tmp/dfs/name</value>
       </property>
   
        <property>
           <name>dfs.datanode.data.dir</name>
           <value>file:/opt/homebrew/Cellar/hadoop/tmp/dfs/data</value>
        </property>
   </configuration>
   
   
   ```

   **创建目录**

   ```Text
   mkdir /opt/homebrew/Cellar/hadoop/tmp/dfs
   mkdir /opt/homebrew/Cellar/hadoop/tmp/dfs/name
   mkdir /opt/homebrew/Cellar/hadoop/tmp/dfs/data 
   
   
   mkdir /Users/xu/Documents/module/hadoop-3.4.1/tmp/dfs
   mkdir /Users/xu/Documents/module/hadoop-3.4.1/tmp/dfs/name
   mkdir /Users/xu/Documents/module/hadoop-3.4.1/tmp/dfs/data 
   ```

   

   

4. 修改`mapred-site.xml`

   ```xml
   <configuration>
      <property>
         <name>mapreduce.framework.name</name>
          <value>yarn</value>
       </property>
     <property>
        <name>mapred.job.tracker</name>
        <value>localhost:9010</value>
     </property>
    
     <property>
        <name>yarn.app.mapreduce.am.env</name>
        <value>HADOOP_MAPRED_HOME=/opt/homebrew/Cellar/hadoop/3.4.1/libexec</value>
     </property>
     <property>
        <name>mapreduce.map.env</name>
        <value>HADOOP_MAPRED_HOME=/opt/homebrew/Cellar/hadoop/3.4.1/libexec</value>
     </property>
     <property>
        <name>mapreduce.reduce.env</name>
        <value>HADOOP_MAPRED_HOME=/opt/homebrew/Cellar/hadoop/3.4.1/libexec</value>
    </property>
   </configuration>
   
   ```

5. 修改 `yarn-site.xml`

   ```xml
   <configuration>
   
   <!-- Site specific YARN configuration properties -->
     <property>
       <name>yarn.nodemanager.aux-services</name>
       <value>mapreduce_shuffle</value>
     </property>
   
     <property>
       <name>yarn.resourcemanager.address</name>
       <value>localhost:9000</value>
      </property> 
       
     <property>
       <name>yarn.scheduler.capacity.maximum-am-resource-percent</name>
       <value>100</value>
     </property>
   </configuration>
   
   ```

6. 修改 `hadoop-env.sh`

   ```sh
   #指定Java应用程序的本地库
   export HADOOP_OPTS="-Djava.library.path=${HADOOP_HOME}/lib/native"



### 方式二：手动下载

1. 配置环境变量

   `vim ~/.zshrc` 添加以下内容后，执行`source ~/.zshrc`刷新

   ```sh
   # Hadoop
   # 你本机的Hadoop存放地址
   export HADOOP_HOME=/Users/xu/Documents/module/hadoop-3.4.1
   
   export PATH=$PATH:$HADOOP_HOME/sbin:$HADOOP_HOME/bin
   export HADOOP_COMMON_LIB_NATIVE_DIR=$HADOOP_HOME/lib/native
   export HADOOP_OPTS="-Djava.library.path=$HADOOP_HOME/lib/native"
   export HADOOP_MAPRED_HOME=$HADOOP_HOME
   export HADOOP_INSTALL=$HADOOP_HOME
   export HADOOP_COMMON_HOME=$HADOOP_HOME
   export HADOOP_HDFS_HOME=$HADOOP_HOME
   export YARN_HOME=$HADOOP_HOME
   ```

2. 进入安装目录 `/Users/xu/Documents/module/hadoop-3.4.1`

   修改`core-site.xml`

   ```xml
   <configuration>
     <property>
       <name>fs.defaultFS</name>
       <value>hdfs://localhost:8020</value>
     </property>
    
     <property>
       <name>hadoop.tmp.dir</name>
       <!--创建tmp文件夹，用来指定hadoop运行时产生文件的存放目录-->
       <value>file:/Users/xu/Documents/module/hadoop-3.4.1/tmp</value>
     </property>
   </configuration>
   ```

   修改`hdfs-site.xml`

   > 注意：文件中地址需要手动创建
   >
   > ```sh
   > mkdir /Users/xu/Documents/module/hadoop-3.4.1/tmp/dfs
   > mkdir /Users/xu/Documents/module/hadoop-3.4.1/tmp/dfs/name
   > mkdir /Users/xu/Documents/module/hadoop-3.4.1/tmp/dfs/data
   > ```
   >
   > 

   ```xml
   <configuration>
      <property>
         <name>dfs.replication</name>
         <value>1</value>
       </property>
     
       <property>
          <name>dfs.permissions</name>
          <value>false</value>   
        </property>
      
       <property>
          <name>dfs.namenode.name.dir</name>
           <value>file:/Users/xu/Documents/module/hadoop-3.4.1/tmp/dfs/name</value>
       </property>
   
        <property>
           <name>dfs.datanode.data.dir</name>
           <value>file:/Users/xu/Documents/module/hadoop-3.4.1/tmp/dfs/data</value>
        </property>
   </configuration>
   ```

   修改`mapred-site.xml`

   > ⚠️注意：将下面classpath值替换为自己的。
   >
   > 执行命令查询`hadoop classPath`

   ```xml
   <configuration>
      <property>
         <name>mapreduce.framework.name</name>
          <value>yarn</value>
       </property>
     <property>
        <name>mapred.job.tracker</name>
        <value>localhost:9010</value>
     </property>
    
     <property>
       <name>mapreduce.application.classpath</name>
         <!--查到的 Hadoop classpath-->
       <value>/Users/xu/Documents/module/hadoop-3.4.1/etc/hadoop:/Users/xu/Documents/module/hadoop-3.4.1/share/hadoop/common/lib/*:/Users/xu/Documents/module/hadoop-3.4.1/share/hadoop/common/*:/Users/xu/Documents/module/hadoop-3.4.1/share/hadoop/hdfs:/Users/xu/Documents/module/hadoop-3.4.1/share/hadoop/hdfs/lib/*:/Users/xu/Documents/module/hadoop-3.4.1/share/hadoop/hdfs/*:/Users/xu/Documents/module/hadoop-3.4.1/share/hadoop/mapreduce/*:/Users/xu/Documents/module/hadoop-3.4.1/share/hadoop/yarn:/Users/xu/Documents/module/hadoop-3.4.1/share/hadoop/yarn/lib/*:/Users/xu/Documents/module/hadoop-3.4.1/share/hadoop/yarn/*</value>
     </property>
   
     <property>
        <name>yarn.app.mapreduce.am.env</name>
        <value>HADOOP_MAPRED_HOME=/Users/xu/Documents/module/hadoop-3.4.1</value>
     </property>
     <property>
        <name>mapreduce.map.env</name>
        <value>HADOOP_MAPRED_HOME=/Users/xu/Documents/module/hadoop-3.4.1</value>
     </property>
     <property>
        <name>mapreduce.reduce.env</name>
        <value>HADOOP_MAPRED_HOME=/Users/xu/Documents/module/hadoop-3.4.1</value>
    </property>
   </configuration>
   ```

   修改`yarn-site.xml`

   ```xml
   <configuration>
     <property>
       <name>yarn.nodemanager.aux-services</name>
       <value>mapreduce_shuffle</value>
     </property>
   
     <property>
       <name>yarn.resourcemanager.address</name>
       <value>localhost:9000</value>
      </property> 
       
     <property>
       <name>yarn.scheduler.capacity.maximum-am-resource-percent</name>
       <value>100</value>
     </property>
   
     <property>
        <name>yarn.resourcemanager.hostname</name>
        <value>127.0.0.1</value>
      </property>
   </configuration>
   
   
   ```

   修改`hadoop-env.sh`脚本

   ```sh
   #设置JAVA_HOME
   export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-8.jdk/Contents/Home
   
   #指定Java应用程序的本地库
   export HADOOP_OPTS="-Djava.library.path=${HADOOP_HOME}/lib/native"
   ```

   

## 三、启动

### 启动hadoop

```sh
#进入安装目录

#启动
./start-dfs.sh
#停止
./stop-dfs.sh
```





| 应用            | Hadoop2.x | Hadoop3.x |
| --------------- | --------- | --------- |
| Namenode        | 8020      | 9820      |
| Resource Manage |           | 8088      |
| NN HTTP UI      | 50070     | 9870      |
| NN HTTPS UI     | 50470     | 9871      |
| SNN HTTP        | 50091     | 9869      |
| SNN HTTP UI     | 50090     | 9868      |
| DN IPC          | 50020     | 9867      |
| DN              | 55010     | 9866      |
| DN HTTP UI      | 55075     | 9864      |
| DataNode        | 50475     | 9865      |





## 四、命令测试

```sh
#创建一个目录
hdfs dfs -mkdir -p test_input

#推送文件到hdfs 
hdfs dfs -put data/applogs/xxl-job/xxl-job-executor-sample-springboot.log  test_input/xxl-job.log

```

访问 `localhost:9080` 查看已经创建成功

![image-20250108171537041](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/202501081715345.png)

![image-20250108171946840](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/202501081719047.png)



