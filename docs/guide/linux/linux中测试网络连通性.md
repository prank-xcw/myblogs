---
title: linux中测试网络联通性
sidebar: auto
categories: linux
tags:
  - linux
  - 网络
---







## curl

`curl`主要用于，接口调用，web调试，数据传输。



### 基础测试

```sh
curl http://example.com       # 测试 HTTP 访问（默认端口 80）
curl https://example.com      # 测试 HTTPS 访问（默认端口 443）

curl -v https://example.com   # 显示详细内容

curl http://example.com:8080    # 测试 8080 端口的 HTTP 服务
curl https://example.com:8443   # 测试 8443 端口的 HTTPS 服务
```





### WEB调试

### GET请求

```bash
curl https://api.example.com/data      # 获取接口数据
curl -o result.json https://api.example.com/data  # 保存响应到文件
```



### POST请求

```bash
# 提交表单数据（键值对）
curl -X POST https://api.example.com/submit \
  -d "username=admin&password=123456"

# 提交 JSON 数据
curl -X POST https://api.example.com/submit \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "123456"}'
  
curl  -X POST http://172.16.39.136:9003/rights/front/outer/productQtyChange.shtml \
     -H "Content-Type: application/json" \
     -d  '{"sign":"cKRD/DngtebMr1f63+oko7/yPmpfYb3l9Spum22iFNZK5bBSfbha5ymp2FyZUQG2inQrRkUDlYP/MEHFhnrQpPvEbwwAvmJiWtNmPGRNJqHBmDZXmqwqJ1vZNBHO8MUOpTyPtBtaHBwm+Xb2ISHXEzra7sJCxO34eEVtGnKBoJw=","body":"op6FE22w/51+nd+fGjJCF9i1KHFfS7+BCPqA40r4gct2lzb6DYUQy+c83vUncSTENzaLSWTV0rrnncwpNfaGPw==","channelId":"LN_TEST_APPID_2022","transactionId":"b15d5f8358554bcf991a83481df7d7a6","timestamp":"20250217182353806"}'
  
```



### 文件上传

```bash
# 上传文件（表单形式）
curl -X POST https://api.example.com/upload \
  -F "file=@/path/to/file.txt" \
  -F "description=My File"

# 直接上传二进制文件（PUT）
curl -X PUT https://api.example.com/upload/file.txt \
  --data-binary @/path/to/file.txt
  
```



### 文件下载

```bash
curl -O https://example.com/files/data.zip  # 保存为原始文件名
curl -o custom_name.zip https://example.com/files/data.zip  # 自定义文件名
```





### curl常见问题

```bash
#1.域名解析失败
curl: (6) Could not resolve host: example.com

#2.连接被拒绝
curl: (7) Failed to connect to example.com port 80: Connection refused

#3.SSL连接失败
curl: (35) SSL peer handshake failed
```





## telnet

`telnet`用于测试端口连通性、手动协议交互。

```bash
# telnet <主机名或IP> <端口>

telnet www.baidu.com 80 #测试HTTP服务80端口
```





