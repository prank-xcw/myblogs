---
title: mysql查询连接数
categories: database
tags:
 - database
 - mysql
---







> 数据库中连接数过多排查步骤





## 查询最大连接数

```sql

-- 数据库最大连接数
SHOW VARIABLES LIKE 'max_connections';

SHOW FULL PROCESSLIST;
```





## 按用户查看连接数

```sql

-- 按用户查看连接数
SELECT 
    USER,
    COUNT(*) AS conn_count
FROM information_schema.PROCESSLIST
GROUP BY USER
ORDER BY conn_count DESC;

```



## 按 IP / 实例查看

```sql
-- 按 IP / 实例看
SELECT 
    SUBSTRING_INDEX(HOST, ':', 1) AS ip,
    COUNT(*) AS conn_count
FROM information_schema.PROCESSLIST
GROUP BY ip
ORDER BY conn_count DESC;
```





## 按超时时间排序

```sql
-- 查询超时连接
SELECT 
    ID,
    USER,
    HOST,
    DB,
    COMMAND,
    TIME
FROM information_schema.PROCESSLIST
WHERE COMMAND = 'Sleep'
  -- AND TIME > 300
  --  and HOST like '10.248.50.54%'
ORDER BY TIME DESC;
```





## 关闭连接

```sql
 KILL <connection_id>;
```

