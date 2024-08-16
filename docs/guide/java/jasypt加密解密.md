---
title: jasypt 加密解密
sidebar: auto
categories: java
tags:
  - java

---







> 说明：
>
> - algorithm: 加密算法
> - input：加密的内容
> - password： 盐值（后面解密也需使用这个盐值进行解密）
> - OUTPUT: 加密之后的内容
> - org.jasypt.intf.cli.JasyptPBEStringEncryptionCLI 加密类
> - org.jasypt.intf.cli.JasyptPBEStringDecryptionCLI 解密类





## 加密

```Text
java -cp  /Users/xu/.m2/repository/org/jasypt/jasypt/1.9.2/jasypt-1.9.2.jar org.jasypt.intf.cli.JasyptPBEStringEncryptionCLI input="abc123" password=SWEpUd3hB8thu1GA algorithm=PBEWithMD5AndDES
```





## 解密

```Text
java -cp  /Users/xu/.m2/repository/org/jasypt/jasypt/1.9.2/jasypt-1.9.2.jar org.jasypt.intf.cli.JasyptPBEStringDecryptionCLI input="IJMB3S7dJAVcEmXCuElvpz3YzMHqMMM3" password=SWEpUd3hB8thu1GA algorithm=PBEWithMD5AndDES
```







