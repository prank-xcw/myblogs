---
title: 本地项目上传到gitee
abbrlink: 12488
categories: learn
---

<LogoGithub />

## 1.本地仓库先执行初始化

在项目中打开git命令框输入 **git init**，会发现文件夹中生成了.git文件夹说明初始化成功

![image-20201207110509533](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/20201207123157.png)



## 2.建立远程仓库

新建一个远程仓库

![image-20201207110908992](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/20201207123205.png)



## 3.建立连接

复制链接并在本地输入命令 git remote origin master 仓库链接

![image-20201207111438162](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/20201207123211.png)

![image-20201207112620751](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/20201207123217.png)



## 4.上传项目

> 注意：若新建仓库时勾选了，Readme文件初始化，要先执行 git pull origin master

git add . 	将文件放入缓存区；git add . 代表放入所有 git add [文件名]代表放入指定文件

git commit -m "文件描述"  将缓存区发送到本地仓库

git push -u origin master 将本地仓库推送到远程仓库

![image-20201207113801017](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/20201207123221.png)

