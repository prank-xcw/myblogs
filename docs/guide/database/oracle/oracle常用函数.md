---
title: oracle常用函数
abbrlink: 45617
categories: database
tags:
 - database
 - oracle
---





## 一、Oracle中 sys_guid()

sys_guid(),是Oracle 8i 后提供的函数。SYS_GUID产生并返回一个十六进制**32位**的**全球唯一的标识符** 。在大多数平台,生成的标识符由主机标符，执行函数的进程或者线程标识符，和进程或线程的一个非重复的值(字节序列)
大概就是长这个样子了



### 用法1：建表时给主键设置的默认值

代码：

```sql
create table TT_USER
(
  userid   VARCHAR2(500) default sys_guid(),
  username VARCHAR2(50),
  adress   VARCHAR2(150),
  area     VARCHAR2(30)
);
```



### 用法2：插入时给主键传入的值

代码：

```sql
insert into TT_USER
 values
 (sys_guid(),'小明','中国','12345');
```







## 二、Oracle的单行函数



### **一、字符串函数**

字符函数接受字符参数，这些参数可以是表中的列，也可以是一个字符串表达式。

常用的字符函数：

| 函数                     | 说明                                                         |
| ------------------------ | ------------------------------------------------------------ |
| ASCII(X)                 | 返回字符X的ASCII码                                           |
| CONCAT(X,Y)              | 连接字符串X和Y                                               |
| INSTR(X,STR[,START][,N)  | 从X中查找str，可以指定从start开始，也可以指定从n开始         |
| LENGTH(X)                | 返回X的长度                                                  |
| LOWER(X)                 | X转换成小写                                                  |
| UPPER(X)                 | X转换成大写                                                  |
| LTRIM(X[,TRIM_STR])      | 把X的左边截去trim_str字符串，缺省截去空格                    |
| RTRIM(X[,TRIM_STR])      | 把X的右边截去trim_str字符串，缺省截去空格                    |
| TRIM([TRIM_STR FROM]X)   | 把X的两边截去trim_str字符串，缺省截去空格                    |
| REPLACE(X,old,new)       | 在X中查找old，并替换成new                                    |
| SUBSTR(X,start[,length]) | 返回X的字串，从start处开始，截取length个字符，缺省length，默认到结尾 |

上面各函数的例子：

| 示例                                         | 示例结果   |
| -------------------------------------------- | ---------- |
| SELECT ASCII('a') FROM dual;                 | 97         |
| SELECT CONCAT('Hello','world') FROM dual;    | Helloworld |
| SELECT INSTR('Hello world','or') FROM dual;  | 8          |
| SELECT LENGTH('Hello') FROM dual;            | 5          |
| SELECT LOWER('Hello') FROM dual;             | hello      |
| SELECT UPPER('hello') FROM dual;             | HELLO      |
| SELECT LTRIM('=Hello=','=') FROM dual;       | Hello=     |
| SELECT RTRIM('=Hello=','=') FROM dual;       | =Hello     |
| SELECT TRIM('='FROM'=Hello=') FROM dual;     | Hello      |
| SELECT REPLACE('ABCDE','CD','AAA')FROM dual; | ABAAAE     |
| SELECT SUBSTR('ABCDE',2,3) FROM dual;        | BCD        |

### **二、数字函数**

数字函数接受数字参数，参数可以来自表中的一列，也可以是一个数字表达式。

| 函数         | 说明                | 示例                    |
| ------------ | ------------------- | ----------------------- |
| ABS(X)       | X的绝对值           | ABS(-3)=3               |
| ACOS(X)      | X的反余弦           | ACOS(1)=0               |
| COS(X)       | 余弦                | COS(1)=0.54030230586814 |
| CEIL(X)      | 大于或等于X的最小值 | CEIL(5.4)=6             |
| FLOOR(X)     | 小于或等于X的最大值 | FLOOR(5.8)=5            |
| LOG(X,Y)     | X为底Y的对数        | LOG(2，4)=2             |
| MOD(X,Y)     | X除以Y的余数        | MOD(8，3)=2             |
| POWER(X,Y)   | X的Y次幂            | POWER(2，3)=8           |
| ROUND(X[,Y]) | X在第Y位四舍五入    | ROUND(3.456，2)=3.46    |
| SQRT(X)      | X的平方根           | SQRT(4)=2               |
| TRUNC(X[,Y]) | X在第Y位截断        | TRUNC(3.456，2)=3.45    |

说明：

**1. ROUND(X[,Y])，**四舍五入。

在缺省 y 时，默认 y=0；比如：ROUND(3.56)=4。

y 是正整数，就是四舍五入到小数点后 y 位。ROUND(5.654,2)=5.65。

y 是负整数，四舍五入到小数点左边|y|位。ROUND(351.654,-2)=400。

**2. TRUNC(x[,y])**，直接截取，不四舍五入。

在缺省 y 时，默认 y=0；比如：TRUNC (3.56)=3。

Y是正整数，就是四舍五入到小数点后 y 位。TRUNC (5.654,2)=5.65。

y 是负整数，四舍五入到小数点左边|y|位。TRUNC (351.654,-2)=300。



### **三、日期函数**

日期函数对日期进行运算。常用的日期函数有：

> sysdate表示当前一天
>
> 

**1、ADD_MONTHS(d,n)**，在某一个日期 d 上，加上指定的月数 n，返回计算后的新日期。

d 表示日期，n 表示要加的月数。

**2、LAST_DAY(d)**，返回指定日期当月的最后一天。

**3、ROUND(d[,fmt])**，返回一个以 fmt 为格式的四舍五入日期值， d 是日期， fmt 是格式

模型。默认 fmt 为 DDD，即月中的某一天。

Ø ① 如果 fmt 为“YEAR”则舍入到某年的 1 月 1 日，即前半年舍去，后半年作为下一年。

Ø ② 如果 fmt 为“MONTH”则舍入到某月的 1 日，即前月舍去，后半月作为下一月。

Ø ③ 默认为“DDD”，即月中的某一天，最靠近的天，前半天舍去，后半天作为第二天。

Ø ④ 如果 fmt 为“DAY”则舍入到最近的周的周日，即上半周舍去，下半周作为下一周周日。



### **四、转换函数**

转换函数将值从一种数据类型转换为另外一种数据类型。常见的转换函数有：

**1、TO_CHAR(d|n[,fmt])**

把日期和数字转换为制定格式的字符串。Fmt是格式化字符串

**2、TO_DATE(X,[,fmt])**

把一个字符串以fmt格式转换成一个日期类型

**3、TO_NUMBER(X,[,fmt])**

把一个字符串以fmt格式转换为一个数字

代码演示：TO_NUM函数

SELECT TO_NUMBER('-$12,345.67','$99,999.99')"num" FROM dual;



### **六、聚合函数**

聚合函数同时对一组数据进行操作，返回一行结果，比如计算一组数据的总和，平均值等。

| 名称     | 作用           | 语法                     |
| -------- | -------------- | ------------------------ |
| AVG      | 平均值         | AVG（表达式）            |
| SUM      | 求和           | SUM(表达式)              |
| MIN、MAX | 最小值、最大值 | MIN(表达式)、MAX(表达式) |
| COUNT    | 数据统计       | COUNT（表达式）          |





# 三、Oracle常用操作

## 修改表结构

```sql
--oracle表名注释
COMMENT ON TABLE <tableName> IS '表名注释';

--oracle新增字段
alter table <tableName> add <columnName> VARCHAR2(1000)   default  NULL; 
COMMENT ON COLUMN <tableName>.<columnName> is '字段注释';
```



## 特殊查询

```sql
--oracle查询时字段为空(查询包含null的字段)
SELECT * FROM user t1 WHERE  t1.age ='' OR t1.age IS NULL;

--oracle查询时字段为空(查询不包含null的字段)
SELECT * FROM user t1 WHERE  t1.age ='' and t1.age not NULL;


--oracle排序字段值为null
--null值始终排前面
select * from table order by id asc nulls first
--null值始终排后面
select * from table order by id desc nulls last


--Oracle求和进行为空补零
select when sum(c.num) is null then  0  else    sum(t.num) from class c

select  NVL(SUM(c.num) ,0)  from class c
```





## 四、日期格式互相转换

**表中的日期类型转换为，时间戳、毫秒**

```sql
select 
	TO_NUMBER(t.time - 8 / 24 
              -  TO_DATE('1970-01-01 0:0:0', 'YYYY-MM-DD HH24:MI:SS')
    )   * 24 * 60 * 60 * 1000 
from test
```



**时间戳转换为日期类型**

```sql
select 
	to_char(t.time/( 24 * 60 * 60 * 1000)  +  TO_DATE('1970-01-01 0:0:0', 'YYYY-MM-DD HH24:MI:SS'))    
from test
```



