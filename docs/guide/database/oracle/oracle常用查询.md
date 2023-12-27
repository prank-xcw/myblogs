---
title: oracle常用查询
categories: database
tags:
 - database
 - oracle

---





# oracle常用查询



## 指定表获取表名注释

```sql
select * from user_tab_comments where table_name='TABLE_NAME' and owner = 'OWNER_NAME';
```





## 指定表字段信息

```sql
-- select * from all_col_comments where owner = 'OWNER_NAME' AND table_name='TABLE_NAME' ;
select * from all_col_comments where owner = 'GXB2B2C' AND table_name='T_BOSS_ORG' ;

```







## 行转列查询

### 原数据

| id   | key  | value |
| ---- | ---- | ----- |
| 1    | 电脑 | $1600 |
| 1    | 手机 | $12   |
| 1    | 导管 | $1    |
| 2    | 电脑 | $2    |
| 2    | 手机 | $22   |



### 方式一：MAX()

#### 效果：

| id   | 电脑  | 手机 | 导管 |
| ---- | ----- | ---- | ---- |
| 1    | $1600 | $12  | $1   |
| 2    | $2    | $22  |      |



#### SQL:

```sql

SELECT id,
	MAX(CASE WHEN type = '电脑' THEN VALUE END) 电脑,
	MAX(CASE WHEN type = '手机' THEN VALUE END) 手机,
	MAX(CASE WHEN type = '导管' THEN VALUE END) 导管 
FROM t_order
GROUP BY id
```



> 此方法没数据库限制



### 方式二：LISTAGG()

#### 效果：

| id   | type           |
| ---- | -------------- |
| 1    | 电脑,手机,导管 |



#### SQL:

```sql
SELECT id,LISTAGG(type,',') type FROM t_order 
WHERE id = 1;
```



> 此方法将，列数据整合到一个结果中



### 方式三：WM_CONCAT()

> 效果和方式二相同，但只适用于Oracle数据库，高版本Oracle不支持该函数；



#### SQL：

```sql
SELECT id,WM_CONCAT(type,',') type 
FROM t_order 
WHERE id = 1;
```









## 列转多行查询



### 原数据

| id   | month       |
| ---- | ----------- |
| 1    | 1月,2月,5月 |
| 2    | 6月,12月    |



### 方式一：REGEXP_SUBSTR()

#### 效果：

| id   | month |
| ---- | ----- |
| 1    | 1月   |
| 1    | 2月   |
| 1    | 5月   |
| 2    | 6月   |
| 2    | 12月  |





#### SQL:

```sql
SELECT
    distinct
	t1.id,
	REGEXP_SUBSTR(t1.month, '[^,]+', 1, LEVEL) AS month
FROM
	t_test t1
CONNECT BY
	LEVEL <= regexp_count(t1.month,',' ) + 1
ORDER BY t1.id;
```



