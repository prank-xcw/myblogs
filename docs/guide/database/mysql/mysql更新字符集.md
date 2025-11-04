---
title: mysql更新字符集
categories: database
tags:
  - database
  - mysql
---





## 查询指定库 字符集和排序规则

```sql
SELECT @@character_set_database, @@collation_database;
```





## 更改指定数据库字符集

``` sql
ALTER DATABASE database_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```





## 查询指定表 排序规则

```sql
SHOW TABLE STATUS where name ='sys_depart';
```





## 查询指定表中字段 排序规则

```sql
SHOW FULL COLUMNS FROM sys_depart;
```







## 生成对应表的 更新表字符集

```sql
select
	CONCAT('ALTER TABLE `', TABLE_SCHEMA, '`.`', TABLE_NAME, '` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;') as alter_sql
from
	information_schema.TABLES
where
	TABLE_SCHEMA = database()
	and TABLE_TYPE = 'BASE TABLE';

-- ALTER TABLE `database_name`.`sys_depart` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;


```

