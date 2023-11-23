---
title: mac常见安装软件问题
categories: mac
tags:
 - mac
---





## 移除安全隔离属性，解决应用损坏打不开



**quarantine 隔离属性**

```shell
sudo xattr -rd com.apple.quarantine /Applications/示例.app
```





## 重写写入签名，解决应用来源可信和完整性

```shell
sudo codesign --force --deep --sign - /Applications/示例.app
```



- `sudo`: 以超级用户权限运行命令，通常需要管理员权限来执行签名操作。
- `codesign`: macOS 中用于对应用程序、框架、插件等进行代码签名的命令行工具。
- `--force`: 强制签名，即使文件已经签名也会重新签名。
- `--deep`: 递归地签名包含的所有组件，包括子目录中的文件。
- `--sign <identity>`: 使用指定的签名标识符进行签名。这是一个必需的参数，用于指定签名时使用的密钥链中的证书。



