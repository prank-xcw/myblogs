---

title: docker中安装gitLab
sidebar: auto
categories: docker
abbrlink: ac91f241
tags:
  - docker

---



> 环境需求：centos7
>



## 安装GitLab



### 搜索镜像

```shell
docker search gitlab
```

![image-20210825145847397](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20210825145847397.png)



- 通过搜索镜像可以看到很多镜像，本文选择中文版本进行安装



### 拉取镜像

```shell
 docker pull twang2218/gitlab-ce-zh
```



### 镜像启动容器

```shell
docker run -d \
	-p 8443:443 \
    -p 8090:80  \
    -p 8022:22  \
    --restart always  \
    --name gitlab  \
    -v /usr/local/gitlab/etc:/etc/gitlab  \
    -v /usr/local/gitlab/log:/var/log/gitlab  \
    -v /usr/local/gitlab/data:/var/opt/gitlab  \
    --privileged=true  \
    twang2218/gitlab-ce-zh

```

> --name:  指定生成容器的名称





## 配置GitLab

### 进入容器

```shell
#进入创建的gitlab容器
docker exec -it gitlab bash
```



### 修改gitlab.rb文件

```shell
# /etc/gitlab/gitlab.rb文件是gitlab配置文件
cd /etc/gitlab

vim gitlab.rb
```



### 修改端口和Url

```shell
#配置自己的服务器地址

# 在gitlab创建项目时候http地址的host(不用添加端口)
external_url 'http://192.168.2.130'

# 在gitlab创建项目时候ssh地址的host(不用添加端口)
gitlab_rails['gitlab_ssh_host'] = '192.168.2.130'

# docker run 的时候我们把22端口映射为外部的8022了，这里修改下
gitlab_rails['gitlab_shell_ssh_port'] = 8022
```



### 修改邮箱配置

```shell
# 是否启用
gitlab_rails['smtp_enable'] = true
# SMTP服务的地址
gitlab_rails['smtp_address'] = "smtp.163.com"
# 端口
gitlab_rails['smtp_port'] = 465
# 你的邮箱（发送账号）
gitlab_rails['smtp_user_name'] = "15933077087@163.com"
# 授权码
gitlab_rails['smtp_password'] = "********"
# 域名
gitlab_rails['smtp_domain'] = "smtp.163.com"
# 登录验证
gitlab_rails['smtp_authentication'] = "login"

# 使用了465端口，就需要配置下面三项
gitlab_rails['smtp_enable_starttls_auto'] = true
gitlab_rails['smtp_tls'] = true
gitlab_rails['smtp_openssl_verify_mode'] = 'none'

# 你的邮箱（发送账号）
gitlab_rails['gitlab_email_from'] = '15933077087@163.com'
```



### 编译配置信息

**执行此指令会有点慢**

```shell
gitlab-ctl reconfigure
```



### 修改port

```shell
#文件路径/opt/gitlab/embedded/service/gitlab-rails/config
vim /opt/gitlab/embedded/service/gitlab-rails/config/gitlab.yml

#gitlab默认端口为80  调整为映射端口8090
```

![image-20210825161459421](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20210825161459421.png)



### 重启GitLab

```shell
gitlab-ctl restart
```



### 验证邮箱服务

```shell
// 在容器中进入命令行
 gitlab-rails console

// 测试邮件发送
 Notify.test_email("xxx@qq.com","title","gitlab").deliver_now

// 退出命令行
 exit

// 退出容器
 exit
```



### 访问GitLab服务地址

```shell
http://192.168.2.130:8090
```

