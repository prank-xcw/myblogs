---
title: docker部署springboot项目
categories: docker
abbrlink: f9f09c08
tags:
  - docker
  - springboot
---








# docker部署sprinboot项目

## 方法一：手动部署

1. **准备springboot项目jar包**

2. **准备或创建名为Dockerfile的文件填写以下内容**

   ```shell
   FROM java:8
   # VOLUME 指定了临时文件目录为/tmp。
   # 其效果是在主机 /var/lib/docker 目录下创建了一个临时文件，并链接到容器的/tmp
   VOLUME /tmp 
   # 将jar包添加到容器中并更名为app.jar
   ADD boot.jar app.jar 
   ENTRYPOINT ["java","-jar","/app.jar"] 
   ```

   > 命令解释：
   >
   > ​		from指定基础镜像
   >
   > ​		volume 创建目录连接到
   >
   > ​		ADD  添加文件到容器
   >
   > ​		ENTRYPOINT 配置容器将app.jar启动

3. **上传到服务器,并通过docker build 生成镜像**

   ![image-20210708144234540](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20210708144234540.png)

   ```shell
   #boot-app为生成的镜像名  注意指令末有 .
   docker build -t boot-app .
   ```

   ![image-20210708144434455](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20210708144434455.png)

   ```shell
   #查看本地镜像
   docker images
   ```

   

4. **指定镜像 启动容器**

   ```shell
   #启动容器
   docker run -d -p 8848:8888 --name boot-app boot-app
   
   #-d 后台启动
   #-p 映射端口：8848服务器端口 8888访问容器的端口,项目端口	
   #--name 指定容器名称  boot-app
   #第二个boot-app为镜像名称
   ```

   





## 方法二：idea自动部署

1. **docker宿主机开启远程访问**

   ```shell
   #编辑 /lib/systemd/system/docker.service 文件
   vim /lib/systemd/system/docker.service 
   ```

   <img src="https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20210708151023117.png" alt="image-20210708151023117" style="zoom:50%;" />

   ```shell
   #修改属性ExecStart(服务器系统为centose7版本)
   ExecStart=/usr/bin/dockerd -H tcp://0.0.0.0:2375 -H unix://var/run/docker.sock
   #系统在centos7以下版本的设置
   ExecStart=/usr/bin/dockerd -H fd:// -H tcp://0.0.0.0:2375
   
   #保存文件重启守护进程
   systemctl daemon-reload
   
   #重启docker服务
   systemctl restart docker
   ```

   

   **服务器本地测试是否连通，有数据返回说明成功**

   ```shell
   #测试是否修改成功
   curl http://localhost:2375/version
   ```

   ![image-20210708151707430](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20210708151707430.png)

   

   **接下来通过外网访问服务器**

   ![image-20210708151855749](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20210708151855749.png)

   

   > 到这说明已经开启docker远程访问

   

2. **idea安装docker**

   - **安装插件**

     <img src="https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20210708153356507.png" alt="image-20210708153356507" style="zoom: 33%;" />

     

   - **配置docker连接**

     <img src="https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20210708153110324.png" alt="image-20210708153110324" style="zoom: 33%;" />

   

3. **项目中的pom文件添加插件**

   ```xml
   <!--使用docker-maven-plugin插件-->
   <plugin>
       <groupId>com.spotify</groupId>
       <artifactId>docker-maven-plugin</artifactId>
       <!-- <version>1.0.0</version>-->
   
       <!--将插件绑定在某个phase执行-->
       <executions>
           <execution>
               <id>build-image</id>
              <!--将插件绑定在package这个phase上。也就是说，用户只需执行mvn package ，就会自动执行mvn docker:build-->
               <phase>package</phase>
               <goals>
                   <goal>build</goal>
               </goals>
           </execution>
       </executions>
       <configuration>
           <!--指定生成的镜像名-->
           <imageName>${project.artifactId}</imageName>
           <!--指定标签-->
           <imageTags>
               <imageTag>latest</imageTag>
           </imageTags>
           <!-- 指定 Dockerfile 路径-->
           <dockerDirectory>${project.basedir}/src/main/docker</dockerDirectory>
           <!--指定远程 docker api地址-->
           <dockerHost>http://192.168.2.130:2375</dockerHost>
           <!-- 这里是复制 jar 包到 docker 容器指定目录配置 -->
           <resources>
               <resource>
                   <targetPath>/</targetPath>
                   <!--jar 包所在的路径  此处配置的 即对应 target 目录-->
                   <directory>${project.build.directory}</directory>
                   <!-- 需要包含的 jar包 ，这里对应的是 Dockerfile中添加的文件名　-->
                   <include>${project.build.finalName}.jar</include>
               </resource>
           </resources>
           <!-- 以下两行是为了docker push到DockerHub使用的。 -->
           <serverId>docker-hub</serverId>
           <registryUrl>https://index.docker.io/v1</registryUrl>
       </configuration>
   </plugin>
   ```

4. **项目的main文件夹下创建docker和Dockerfile文件**

   ![image-20210708155052832](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20210708155052832.png)

   ```shell
   #文件内容
   
   #项目所依赖的jdk镜像
   FROM java:8
   #将maven构建好的jar添加到镜像中，第二个为别名
   ADD target/*.jar app.jar
   #暴露的端口号(和项目端口号等同)
   EXPOSE 8888
   #镜像所执行的命令
   ENTRYPOINT ["java","-jar","/app.jar"]
   ```

5. **idea执行项目打包可能时间比较长**

   <img src="https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20210708155334882.png" alt="image-20210708155334882" style="zoom: 50%;" />

6. **打包完成后在docker窗口，可看到生成的镜像**

   <img src="https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20210708160849803.png" alt="image-20210708160849803" style="zoom:50%;" />

   

7. **右击镜像,生成指定容器**

   <img src="https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20210708161636328.png" alt="image-20210708161636328" style="zoom: 67%;" />

   ​	

8. **浏览器访问服务器6379端口，成功**