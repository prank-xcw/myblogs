---
title: vue-cli使用
sidebar: auto
categories: vue
tags:
  - vue
  - web


---







## node安装

> 下载地址：https://nodejs.org/en/download/



### 基础配置

```sh
#查看node安装版本
node -v

#查看npm软件包管理工具版本
npm -v	

#查看软件包镜像源
npm config get registry


#设置为国内镜像源 淘宝源
npm config set registry https://registry.npmmirror.com
```



### 进阶使用

 `nrm`管理多个镜像源

```sh
#安装nrm
npm install -g nrm

#查看可用的镜像
nrm ls

#切换到指定镜像
nrm use taobao

#测试指定源速度
nrm test taobao
```





## 安装vue-cli



```sh
#-g 全局安装
npm install -g vue-cli

#查看vue-cli版本
vue -V
```







## 创建vue-cli项目

1. 新建空目录，我创建目录地址为 `/Users/xu/Documents/VueProject/`

2. 创建`webPack`模板项目，一路选`no`

   ```sh
   #初始化一个项目，项目名为 vue-cli-test
   vue init webpack vue-cli-test
   
   ```

   ![image-20250115184447909](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/202501151844328.png)

   

3. 进入项目目录，初始化并运行

   ```sh
   cd vue-cli-test
   #安装所需依赖
   npm install
   #运行
   npm run dev
   ```

   



## 使用vue-router

​	vue-router是vue.js中的路由管理器，和vue.js深度集成，用于动态路由，视图转发等效果。

### 安装

```sh
# --save-dev安装到开发环境
npm install vue-router --save-dev
```







