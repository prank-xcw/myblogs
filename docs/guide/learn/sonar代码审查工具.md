---
title: sonar代码审查工具
abbrlink: 61707
categories: learn
---



## 文档地址

官方文档地址：http://www.sonar.org.cn/install/1896.html

sonar下载地址：https://www.sonarqube.org/downloads/

sonar-scanner下载地址1：https://docs.sonarqube.org/7.8/analysis/scan/sonarscanner/

sonar-scanner下载地址2：https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/

准备：jdk1.8

​			mysql >= 5.6

​			sonar7.8

​			sonar-scanner**3.3** 



## 一、安装

1. 解压进入bin目录启动StartSonar.bat
2. 启动浏览器，访问http://localhost:9000



## 二、配置

1.打开mysql，新建一个数据库。

2.打开sonarqube安装目录下的F:\sonar\sonarqube-7.8\conf\sonar.properties文件

3.在mysql5.X节点下输入以下信息

```properties
sonar.jdbc.url=jdbc:mysql://127.0.0.1:3306/sonardb?useUnicode=true&characterEncoding=utf8&rewriteBatchedStatements=true&useConfigs=maxPerformance
sonar.jdbc.username=root
sonar.jdbc.password=root
sonar.sorceEncoding=UTF-8
sonar.login=admin
sonar.password=admin
```

url是数据库连接地址，username是数据库用户名，jdbc.password是数据库密码

login是sonarqube的登录名，sonar.password是sonarqube的密码

4.重启sonarqube服务，再次访问http://localhost:9000，会稍微有点慢，因为要初始化数据库信息

5.数据库初始化成功后，登录



## 三、使用

1.打开F:\sonar\sonar-scanner-3.3\conf\sonar-runner.properties文件

2.mysql节点下输入以下信息

```properties
sonar.jdbc.url=jdbc:mysql://172.0.0.1:3306/sonardb?useUnicode=true&characterEncoding=utf8&rewriteBatchedStatements=true&useConfigs=maxPerformance
sonar.jdbc.username=gmsd
sonar.jdbc.password=gmsdtrade
```

`注意：如果测试项目与服务器不在同一台机子，则需要添加服务器的IP：`

```properties
#----- Default SonarQube server
sonar.host.url=http://XXX.XXX.XXX.XXX:9000
```

3.配置环境变量

​	a.新建变量，name=SONAR_RUNNER_HOME。value=F:\sonar\sonar-scanner-cli-3.3

​	b.打开path，输入%SONAR_RUNNER_HOME%\bin;

​	c.cmd窗口中输入 sonar-scanner--version会提示成功



4.打开要进行代码分析的项目根目录，新建sonar-project.properties文件

5.输入以下信息

```properties
#key，唯一标识，直接用项目名即可
sonar.projectKey=boot-jpa
sonar.projectName=boot-jpa
sonar.projectVersion=1.0
#要扫描的代码路径，sonar-project.properties文件的相对路径。【配成.或src】
sonar.sources=.
sonar.sourceEncoding=UTF-8
sonar.language=java
```

6.设置成功后，启动sonarqube服务，并启动cmd

7.在cmd进入项目所在的根目录，输入命令：sonar-scanner等待分析成功

8.打开http://localhost:9000/，主页出现了分析项目的概要图







## 扫描maven 多模块项目

官方参考文档：https://docs.sonarqube.org/latest/analysis/scan/sonarscanner-for-maven/



#### 1.配置插件

maven的setting.xml文件中配置，sonarqube插件

```xml
<settings>
    <pluginGroups>
        <pluginGroup>org.sonarsource.scanner.maven</pluginGroup>
    </pluginGroups>
    <profiles>
        <profile>
            <id>sonar</id>
            <activation>
                <activeByDefault>true</activeByDefault>
            </activation>
            <properties>
                <!-- Optional URL to server. Default value is http://localhost:9000 -->
                <sonar.host.url>
                  http://localhost:9000
                </sonar.host.url>
            </properties>
        </profile>
     </profiles>
</settings>
```



#### 2.扫描项目

项目打包后，执行扫描

```sh
mvn clean install -DskipTests  #跳过test打包
mvn sonar:sonar
```



#### 3.打开sonar后台地址

http://localhost:9000