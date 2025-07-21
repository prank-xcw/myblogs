---
title: Nginx使用(三)
categories: nginx
tags:
  - nginx
---





## nginx常用命令

```sh
cd /usr/local/nginx/sbin/
./nginx				#启动
./nginx -c /usr/local/nginx/conf/nginx.conf #指定配置文件启动
./nginx -v			#查看版本
./nginx -t			#测试conf文件语法是否正确
./nginx -s stop		#停止服务
./nginx -s quit		#优雅的关闭服务
./nginx -s reload	#重启服务

#查询nginx进程
ps aux|grep nginx

```









## 静态代理

再nginx.conf配置文件的 server代码块中添加配置

```nginx
server {
    listen 80;
    
    #所有/images/ 开头的请求，转发到本地指定目录
    location  /images/ {
        alias /home/upload/;
    }
}
```







## 反向代理

### 路径拆解代理

```nginx
server {
    listen 80;

    location /jeecgboot/ {
        proxy_pass http://localhost:9999/;
        # 保留原始请求的 Host头
        proxy_set_header Host $http_host;
        # 向后端传递客户端的真实 IP
        proxy_set_header X-Real-IP $remote_addr;
        # 追加客户端 IP 到代理链（用于追踪原始请求来源）
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
         # 自定义头传递客户端 IP
        proxy_set_header REMOTE-HOST $remote_addr;
    }
}
```



### 集群代理

```nginx
http {
    
    upstream backend {
        server 10.0.0.1:8080;
        server 10.0.0.2:8080;
    }

    server {
        listen 80;
        location /api/ {
            # 固定代理到 upstream
            proxy_pass http://backend;  
            # 保留原始请求的 Host头
            proxy_set_header Host $http_host;
            # 向后端传递客户端的真实 IP
            proxy_set_header X-Real-IP $remote_addr;
            # 追加客户端 IP 到代理链（用于追踪原始请求来源）
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
             # 自定义头传递客户端 IP
            proxy_set_header REMOTE-HOST $remote_addr;
        }
    }
}
```





## 代理不同环境

> 使用 map 创建变量映射，简化逻辑判断。
>
> http {
>     map  (输入变量)   (输出变量)  {
>         匹配模式1 输出值1;
>         匹配模式2 输出值2;
>         default    默认值;
>     }
> }



### 通过cookie代理

**根据 Cookie 中的 env 字段路由**

```nginx
# 1.指定单机服务器
http {
    # 设置变量映射，通过cookie中env变量匹配
    map $cookie_env $backend_server {
        default      "http://prod-server:80";
        "dev"        "http://dev-server:80";
    }

    server {
        listen 80;
        location / {
            # 动态代理到 upstream
            proxy_pass $backend_server;
            proxy_set_header Host $host;
        }
    }
}



# 2.指定集群服务器地址
http {
    upstream prod {
        server 10.0.0.1:80;
    }

    upstream dev {
        server 10.0.0.2:80;
    }

    # 设置变量映射，通过cookie中env变量匹配
    map $cookie_env $backend_server {
        default     prod;
        "dev"       dev;
    }
    
    server {
        listen 80;
        location / {
            # 动态代理到 upstream
            proxy_pass $backend_server;
            proxy_set_header Host $host;
        }
    }
}
```



### 通过请求路径匹配

> - 请求 `/v1/user` → 被代理到 `v1-server`
> - 请求 `/v2/user` → 被代理到 `v2-server`
> - 其他路径 → 被代理到 `prod-server`

```nginx
http {
    # 定义版本路由映射
    map $request_uri $target_server {
        default             http://prod-server:80;
        ~^/v1/              http://v1-server:80;
        ~^/v2/              http://v2-server:80;
    }

    server {
        listen 80;
        location / {
            proxy_pass $target_server;  # 动态代理目标
            proxy_set_header Host $host;
        }
    }
}
```



