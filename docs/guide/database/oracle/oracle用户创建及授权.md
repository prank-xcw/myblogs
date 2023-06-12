---
title: oracle用户创建及授权
categories: database
abbrlink: a782733c
tags:
 - database
 - oracle
---













# 创建用户

```sql
-- 创建用户 create user <username> identified by <password>;
create user learn identified by xcw1017#;


-- 删除用户
drop user <username> cascade;
```



# 创建表空间

```sql
-- 创建表空间  create tablespace <tablespacename> datafile <xx.dbf> size 100m;
-- tablespacename 表空间名称
-- xx.dbf  数据文件存放位置
-- 100m  表空间大小
create tablespace learn datafile '/home/oracle/app/oracle/oradata/helowin/learn.dbf' size 100m;

```



## 用户分配表空间

```sql
-- alter user <username> default tablespace <tablespacename>;
alter user learn default tablespace learn;
```



# 授权grant

```sql
--授予dba权限
grant dba to userName

--授予用户登录数据库的权限： 
grant create session to userName;

--授予用户基本操作权限；
grant resource to userName;

--授予用户操作表空间的权限：
grant unlimited tablespace to userName;
grant create tablespace to userName;
grant alter tablespace to userName;
grant drop tablespace to userName;
grant manage tablespace to userName;

--授权该用户可以查询某个表的权限
grant select on 授权的表名 to 用户名; 
--授权该用户可以更新某个表的权限
grant update on 授权的表名 to 用户名; 
--授权该用户可以插入某个表的权限
grant insert on 授权的表名 to 用户名; 
--授权该用户可以删除某个表的权限
grant delete on 授权的表名 to 用户名; 

--授予用户操作表的权限：
grant create table to userName; (包含有create index权限, alter table, drop table权限)
--授予用户操作视图的权限:
grant create view to userName; (包含有alter view, drop view权限)
--授予用户操作触发器的权限：
grant create trigger to userName; (包含有alter trigger, drop trigger权限)
--授予用户操作存储过程的权限：
grant create procedure to userName;(包含有alter procedure, drop procedure 和function 以及 package权限)
--授予用户操作序列的权限：
grant create sequence to userName; (包含有创建、修改、删除以及选择序列)
```



# 权限回收revoke

```sql
--回收dba权限 
revoke dba from userName;


--授予用户基本操作权限；
revoke resource from userName;


--回收用户操作表的权限：
revoke create table from userName; (包含有create index权限, alter table, drop table权限)

```





# 权限查看

```sql
-- 查看用户权限
select * from session_privs;

-- 查看用户角色
select * from user_role_privs;
```





# 解锁与锁定

```sql
-- 解锁对应用户  alter user <userName> account unlock;
alter user scott account unlock;

-- （锁定）
alter user scott account lock;
```





# 更改密码

```sql
-- 更改密码 alter user <userName> identified by <newPassword>;
alter user scott identified by xcw1017#;
```

