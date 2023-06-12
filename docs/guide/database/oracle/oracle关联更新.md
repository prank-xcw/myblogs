---
title: oracle关联更新sql
abbrlink: 52879
categories: database
tags:
 - database
 - oracle
---









# 关联更新三种方式

`准备好 表1,表2`

```
select * from t1;
```



| FNAME | FMONEY |
| ----- | ------ |
| A     | 20     |
| B     | 30     |

```sql
select * from t2;
```

| FNAME | FMONEY |
| ----- | ------ |
| A     | 100    |
| C     | 40     |
| D     | 50     |

需求：参考 T2，修改 T1 表，修改条件为两表的 FNAME 列内容一致。





## 方式一 UPDATE

**常见陷阱：**

```sql
UPDATE T1 
SET T1.FMONEY = (select T2.FMONEY from t2 where T2.FNAME = T1.FNAME)
```



执行后，T1表数据如下（<span style="color:red;">错误！！！</span>）：

| FNAME | FMONEY       |
| ----- | ------------ |
| A     | 100          |
| B     | 空了！！！！ |

**正确写法：**

```sql
UPDATE T1 
SET T1.FMONEY = (select T2.FMONEY from t2 where T2.FNAME = T1.FNAME)
WHERE EXISTS(SELECT 1 FROM T2 WHERE T2.FNAME = T1.FNAME);
```

执行后，T1表数据如下（<span style="color:red;">正确</span>）：

| FNAME | FMONEY |
| ----- | ------ |
| A     | 100    |
| B     | 30     |

> 注意：
> 必须加最后一行<span style="color:red;"> `WHERE EXISTS(SELECT 1 FROM T2 WHERE T2.FNAME = T1.FNAME)` </span>判断
> 避免将 t1 不存在 t2 的字段更新为空值：上述测试数据 t1.B 就被更新为空了，这是不对的。
>
> “exists（xxx）”就表示括号里的语句能不能查出记录，它要查的记录是否存在。
>
> 因此“select 1”这里的 “1”其实是无关紧要的，换成“*”也没问题，它只在乎括号里的数据能不能查找出来，是否存在这样的记录，如果存在，这 1） 句的where 条件成立。



## 方式2：内联视图更新

```sql
UPDATE (
select t1.fmoney  fmoney1,t2.fmoney  fmoney2 from t1,t2 where t1.fname = t2.fname
)t
set fmoney1 =fmoney2;
```



## 方式3：merge更新

```sql
merge into t1
using (select t2.fname,t2.fmoney from t2) t
on (t.fname = t1.fname)
when matched then 
  update  set t1.fmoney = t.fmoney;
```









# Oracle误修改操作

`Oracle提供了另1个快速数据库恢复机制, 就是Flashback  一般只适用于短时间内的恢复, 对于一段相当时间前的误操作, 很可能因为undo数据被覆盖而恢复失败.`



Flashback table 操作会修改表里的数据, **从而有可能引起data rows的行移动**，那么在执行Flashback table 前必须启用数据行的移动特性.

```sql
Alter table <table_name> enable row movement;  
--实例  启用row movement属性
alter table t1 enable row movement;
--实例 查看T1,T2是否启用row movement属性
select table_name, row_movement from user_tables where table_name in ('T1','T2');
```

**使用闪回技术恢复数据**

```sql
--语法
Flashback table <table_name> to SCN <scn_number> [<ENABLE|DISABLE> TRIGGERS];

Flashback table <table_name> to Timestamp <scn_number> [<ENABLE|DISABLE> TRIGGERS];

--实例1 恢复到某个时间点时候
flashback table t1 to timestamp to_timestamp('2021-04-08 12:00:00','yyyy-mm-dd hh24:mi:ss');


--实例2 通过scn恢复
SELECT timestamp_to_scn(to_timestamp('2021-04-08 15:00:00','yyyy-mm-dd hh24:mi:ss')) SCN FROM <table_name>;

FLASHBACK TABLE <table_name> TO SCN 123579067;
```

