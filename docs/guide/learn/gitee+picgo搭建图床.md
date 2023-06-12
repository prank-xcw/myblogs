---
title: PicGo搭建图床
abbrlink: 19408
categories: learn
---



### 第一步：gitee创建公开仓库

![image-20201214121912632](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/20201214121912.png)



### 第二步：生成私人令牌

点击  设置---私人令牌---生成新令牌

![image-20201214143341379](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/20201214143341.png)



输入简单描述 勾选以下两项即可，因为只用于图片上传权限适用；

![image-20201214143611087](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/20201214143611.png)

保存该口令用于后边设置picgo

![image-20201214143727494](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/20201214143727.png)



### 第三步：下载picgo应用

#### 官网：https://github.com/Molunerfinn/PicGo/releases/tag/v2.3.0-beta.3



下载[PicGo-Setup-2.3.0-beta.3.exe](https://github.com/Molunerfinn/PicGo/releases/download/v2.3.0-beta.3/PicGo-Setup-2.3.0-beta.3.exe)安装包





### 第四步：下载gitee插件

![image-20201214151227012](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/20201214151227.png)



### 第五步：配置PicGo

点开图床设置--gitee

![image-20201214152223646](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/20201214152223.png)


| 名称    | 作用                         |
| ------- | ---------------------------- |
| URL     | 填写gitee的官网网址          |
| owner   | 注册gitee时留的名字          |
| repo    | 仓库名                       |
| path    | 存储的位置（仓库下的文件夹） |
| token   | 刚才保存的私人令牌           |
| message | 表述型文字（可以不填）       |







查看个人用户名  设置--个人资料--个人空间名称

![image-20201214153147487](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/20201214153147.png)





### 第六步：md文件设置图片上传

指定图片上传服务,在md文件中复制图片时会自动上传到gitee

![image-20201214155035769](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/20201214155035.png)





注意：若上传失败可能是PicGo为启动









