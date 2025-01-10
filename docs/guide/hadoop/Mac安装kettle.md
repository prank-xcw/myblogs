---
title: Mac安装kettle
sidebar: auto
categories: hodoop
tags:
  - hodoop
---





## 下载地址

> 本文安装的10.2.0
>
> ⚠️注意：我使用的是 zulu-jdk11-x64版本的jdk运行的，用ARM架构的jdk启动报错



### 网盘下载

链接: https://pan.baidu.com/s/1vO8nyMfnM6c3vTiJiLvd5g?pwd=ta6g 

### 官网下载

https://pentaho.com/pentaho-developer-edition/

![image-20250109100252489](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/202501091002314.png)



## 介绍

Kettle改名为pdi，一个开源的etl工具，用于数据清洗、转换、加载。



## 配置环境

### 安装homebrew

> arm架构下需要设置两种HomeBrew的安装
>
> /usr/loacl/homebrew   --传统intel安装路径
>
> /opt/homebrew            --Apple silicon包

```sh
cd /usr/local
sudo mkdir homebrew
sudo chgrp admin homebrew
sudo chmod g+rwx homebrew
curl -L https://github.com/Homebrew/brew/tarball/master | tar xz --strip 1 -C homebre
```



### 环境变量

编辑文件

```sh
vim ~/.zshrc
```

添加以下内容

```sh
# 设置自动选择homebrew
if [ "$(sysctl -n sysctl.proc_translated)" = "1" ]; then
    local brew_path="/usr/local/homebrew/bin"
else
    local brew_path="/opt/homebrew/bin"
fi
export PATH="${brew_path}:${PATH}"
```

刷新文件

```sh
source ~/.zshrc
```



### shell设置Rosetta

设置强制在Intel模式下运行shell，打开shell后执行下面命令

```sh
env /usr/bin/arch -x86_64 /bin/zsh --login
```





## 启动spoon.sh

```sh
# 进入安装目录
cd /Users/xu/Documents/module/data-integration-10.2.0

# 切换至Intel模式
env /usr/bin/arch -x86_64 /bin/zsh --login

#启动服务
sh spoon.sh
```











## 【可选】指定jdk启动spoon.sh

修改`spoon.sh`文件，在代码片段行`setPentahoEnv` 后边指定java_home

```sh
. "$BASEDIR/set-pentaho-env.sh"
setPentahoEnv

# 输入以下代码
_PENTAHO_JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-11.jdk/Contents/Home
_PENTAHO_JAVA="$_PENTAHO_JAVA_HOME"/bin/java
```









