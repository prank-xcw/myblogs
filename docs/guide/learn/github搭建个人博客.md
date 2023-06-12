---
title: GitHub+hexo搭建个人博客
abbrlink: 781
categories: learn
---



## 1.安装node环境

首先我们在本机要安装Node环境，我们可以直接来到Node.js官网：https://nodejs.org/en/

下载后，直接双击，然后就是一直下一步下一步的傻瓜式操作。这里要注意的是：**有的人的电脑可能已经安装好Node环境，已经安装好的可以通过在cmd窗口执行下面的命令查看Node版本**：

```
node -v
npm -v
npm install -g npm //更新npm到最新版
npm config set registry https://registry.npm.taobao.org  //更换为淘宝服务器
npm config list//查看npm配置信息
```



## 2.安装Git环境

Git官网下载：`https://git-scm.com/downloads`



## 3.安装hexo

新建文件夹MyBlog



在E:\MyBlog目录下，右击打开`Git Bash`，接着在Gir Bash中执行：`npm install -g hexo`命令，当看到下图所示表示安装完成，第一次可能等的时间会比较长

`hexo -v`查看安装版本号

![image-20201207173224759](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/20201207173224.png)

执行 `hexo init` 初始化项目； 

![image-20201207173243982](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/20201207173244.png)



初始化成功后根目录下会生成相关文件；

1. **source**：该文件夹是存放我们自己文章的地方，文章存放在该目录下的_posts文件夹中。
2. **themes**：用于存放博客的主题信息。
3. **_config.yml**：是hexo博客的配置文件，很多配置信息都在这里面。

接下来执行：`npm install`和`hexo g`，使用**npm源安装所依赖的组件和编译生成静态页面**。

![image-20201207173512224](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/20201207173512.png)



执行完成后根目录会生成 `public`文件夹，该文件夹用于存放静态页面

启动hexo执行命令 `hexo s`，会告诉你浏览器访问`http://localhost:4000`搭建成功



## 4.创建用于提交

```kotlin
git config --global user.name "yourname"
git config --global user.email "youremail"
```

###### 配置本地ssh密钥：

1. git Bash中输入

   ```bash
   ssh-keygen -t rsa -C "email"
   ```

   

2. 生成的位置为C:\Users\Administrator\.ssh

   id_rsa文件私钥

   id_rsa.pub文件公钥

   

###### 配置github密钥：

1. settings--》SSH and key--》new ssh key
2. title任意  key输入本地生成的公钥（不要有回车符）



###### 测试连通性：注意T为大写

```css
ssh -T git@github.com
```



## 5.GitHub新建仓库



新建仓库名，勾选公开，生成描述文件；

​		GitHub仓库名:	用户名.github.io	若是gitee则仓库名为 账号名即可

![image-20201208105105320](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/20201208105105.png)



## 6.Hexo于GitHub关联



打开项目根目录下的`_config.yml`修改：repository后是远程仓库的clone地址；

```undefined
deploy:
  type: git
  repository: git@github.com:wwblog/wwblog.github.io.git
  branch: master
  
```



## 7.安装部署命令

注意若不安装，使用`hexo d`会出错

```undefined
npm install hexo-deployer-git --save
```



## 8.发布到远程仓库

```
hexo clean #清除文件
hexo g 		#生成静态文件
hexo d		#发布到远程

#本地访问
hexo s
```

远程发布成功后，访问`用户名.github.io`完成访问

本地访问`localhost:4000`





## 9.更换默认主题

我这里用的是jacman主题



### 安装

```
 git clone https://github.com/wuchong/jacman.git themes/jacman
```

**Jacman 需要 Hexo 2.7 及以上版本** 

### 启用

修改博客根目录下的配置文件 `_config.yml`，把`theme`的值修改为 `jacman`.

### 更新

```
cd themes/jacman
git pull origin master
```

**请先备份您主题目录下的 `_config.yml` 文件后再升级。**



## 10.主题配置指南

修改  `/themes/jacman/_config.yml` 中的配置。通过[配置指南wiki]( )了解更多

修改完毕后可执行以下命令，访问`用户名.github.io`

```
hexo clean 
hexo g
hexo d
```

