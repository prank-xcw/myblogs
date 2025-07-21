---
title: mysql用户授权
categories: database
tags:
 - database
 - mysql
abbrlink: 66daeef6
---




# 用户授权

```sql
/*授予用户通过外网IP对于该数据库的全部权限*/
grant all privileges on `xcgs`.* to 'manager'@'%' ;
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';
/*
all privileges：表示将所有权限授予给用户。也可指定具体的权限，如：SELECT、CREATE、DROP等。
on：表示这些权限对哪些数据库和表生效，格式：数据库名.表名，这里写“*”表示所有数据库，所有表。如果我要指定将权限应用到test库的user表中，可以这么写：test.user
to：将权限授予哪个用户。格式：”用户名”@”登录IP或域名”。%表示没有限制，在任何主机都可以登录。比如：'manager'@'%'，表示manager这个用户可以在任何IP段登录
*/

grant select on xcgs.* to 'manager'@'%';  /*给予查询权限*/

grant insert on xcgs.* to 'manager'@'%'; /*添加插入权限*/

grant delete on xcgs.* to 'manager'@'%'; /*添加删除权限*/

grant update on xcgs.* to 'manager'@'%'; /*添加权限*/

-- 撤消用户权限
REVOKE  ALL privileges  on xcgs.* from 'manager'@'%';

flush privileges; /*刷新权限*/
```







# 修改密码

```sql
-- 修改密码
-- 5.7之前 
update user set password=password('123456') where user='roots';

-- 5.7之后
update user set authentication_string=password('123456') where user='roots';


ALTER USER 'root'@'localhost' IDENTIFIED BY '新密码';
```



```sql
-- 重名名
rename user 'test3'@'%' to 'test1'@'%';
```





## 修改用户权限

```sql
#对指定用户在任何主机上 开放 插入、更新、修改、删除权限
update mysql.user set Insert_priv='Y',Update_priv='Y',Delete_priv='Y',Create_priv='Y',Drop_priv='Y' 
where user = 'root' and host = '%';
```

