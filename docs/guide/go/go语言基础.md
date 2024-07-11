---
title: go语言基础
categories: go
tags:
  - go

---



## 基本命令



```sh
#查看版本信息
go version

#查看环境信息
go env

#设置代理 Go 1.13 及以上（推荐）
go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.io,direct
# 或 go env -w GOPROXY=https://goproxy.cn,direct

```



## 目录结构

- src 目录：放置项目和库的源文件；
- pkg 目录：放置编译后生成的包/库的归档文件；
- bin 目录：放置编译后生成的可执行文件。







## 标准库



| Go语言标准库包名 | 功  能                                                       |
| ---------------- | ------------------------------------------------------------ |
| bufio            | 带缓冲的 I/O 操作                                            |
| bytes            | 实现字节操作                                                 |
| container        | 封装堆、列表和环形列表等容器                                 |
| crypto           | 加密算法                                                     |
| database         | 数据库驱动和接口                                             |
| debug            | 各种调试文件格式访问及调试功能                               |
| encoding         | 常见算法如 JSON、XML、Base64 等                              |
| flag             | 命令行解析                                                   |
| fmt              | 格式化操作                                                   |
| go               | Go语言的词法、语法树、类型等。可通过这个包进行代码信息提取和修改 |
| html             | HTML 转义及模板系统                                          |
| image            | 常见图形格式的访问及生成                                     |
| io               | 实现 I/O 原始访问接口及访问封装                              |
| math             | 数学库                                                       |
| net              | 网络库，支持 Socket、HTTP、邮件、RPC、SMTP 等                |
| os               | 操作系统平台不依赖平台操作封装                               |
| path             | 兼容各操作系统的路径操作实用函数                             |
| plugin           | Go 1.7 加入的插件系统。支持将代码编译为插件，按需加载        |
| reflect          | 语言反射支持。可以动态获得代码中的类型信息，获取和修改变量的值 |
| regexp           | 正则表达式封装                                               |
| runtime          | 运行时接口                                                   |
| sort             | 排序接口                                                     |
| strings          | 字符串转换、解析及实用函数                                   |
| time             | 时间接口                                                     |
| text             | 文本模板及 Token 词法器                                      |









## 基本类型

- bool
- string
- int、int8、int16、int32、int64
- uint、uint8、uint16、uint32、uint64、uintptr
- byte // uint8 的别名
- rune // int32 的别名 代表一个 Unicode 码
- float32、float64
- complex64、complex128



> 定义变量方式  var  i int;









## 常用web框架

1. **Gin**  go语言写的http web框架

   https://github.com/gin-gonic/gin

   

2. **Beego** go语言下高性能web框架

   https://github.com/astaxie/beego

   

3. **Buffalo** Go语言下快速开发web的框架

   

4. **Echo**  高性能极简的Web框架

   

5. **Iris:** 目前发展最快的Go Web框架。提供完整的MVC功能并且面向未来。

   官网地址：

   https://github.com/kataras/iris

   中文地址：

   http://www.codebaoku.com/iris/iris-index.html

