---
title: docker中安装tomcat
categories: docker
abbrlink: 92a8132a
tags:
  - docker
  - tomcat
---







# tomcat安装

1. **检查是否安装镜像**

   ```shell
   docker images 
   ```

2. **没有安装则拉取tomcat镜像:**

   ```shell
   docker pull tomcat
   ```

3. **拉取成功,启动容器**

   ```shell
   #运行容器：后台运行并指定容器名称
   docker run -d -it -p 8080:8080 --name tomcat8080 tomcat
   -d  后台运行
   -it 交互终端顺便给启动的容器命名
   -name  指定容器名称
   -p 8080:8080 本地8080映射到容器8080
   tomcat 镜像名称
   ```

4. **列出所有容器**

   ```shell
   #列出正在运行的容器
   docker ps
   
   #列出所有容器
   docker ps -a
   
   #列出最近一次启动的容器
   docker ps -l 
   ```

   

5. **访问tomcat**

   显示404访问不到，，我们进入容器查看

   ![image-20210708123411758](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20210708123411758.png)

6. **进入容器**

   ![image-20210708124055432](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20210708124055432.png)

   ```shell
   #指定容器并进入
   docker exec -it tomcat8080 /bin/bash 
   ```

7. **查看webapps**

   访问tomcat其实是访问的webapps下的文件,我们看到webapps下没有任何文件，而在webapps.dist下是我们想要的文件

   删除webapps文件夹,修改webapps.dist文件夹名称为  webapps

   ![image-20210708124339422](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20210708124339422.png)

   ```shell
   #删除目录
   rm -d webapps
   
   #重命名
   mv webapps.dist webapps
   ```

   

8. **重新访问即可**