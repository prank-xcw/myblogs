---
title: Nginx使用(二)
abbrlink: 38371
categories: nginx
tags:
  - nginx
---



## 使用目录浏览功能(autoindex)

启用目录浏览访问，nginx默认没有开启该功能，要开启则要在server或local代码块中添加 autoindex  on;



**参数说明：**

| 属性名               | 属性值                                                       |
| -------------------- | ------------------------------------------------------------ |
| autoindex            | 默认为off不开启。on为开启                                    |
| autoindex_exact_size | 默认为on，显示出文件的确切大小，单位是bytes。<br>改为off后，显示出文件的大概大小，单位是kB或者MB或者GB |
| autoindex_localtime  | 默认off，文件时间为GMT时间;<br>on,文件显示时间为服务器时间;  |



**修改 /etc/local/nginx/conf/nginx.conf文件**

`server新增location指令块`

```shell
  ##虚拟目录开启目录流量 指定到/app/down/目录下
  location /downs/ {
                alias /app/down/;
                #目录显示文件
                autoindex on;
                #off 显示kb，mb，gb
                autoindex_exact_size off;
                #服务器时间
                autoindex_localtime on;

  }

```

![image-20210421140919170](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20210421140919170.png)



**查看nginx中指向的目录下**

![image-20210825102107902](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20210825102107902.png)



**启动nginx**

```shell
#进入 /etc/local/nginx/sbin/

#启动或重启nginx
./nginx  或者  ./nginx -s reload
```



**访问配置的url**

![image-20210825102507304](https://raw.githubusercontent.com/prank-xcw/images/master/imgs/image-20210825102507304.png)



> 注意:  alias目录必须要以 / 结尾且alias只能在location中使用;







```mermaid
sequenceDiagram
participant 用户
participant 系统


用户->>系统: 登录请求
Note right of 系统: 验证用户信息
系统-->>用户: 登录成功
