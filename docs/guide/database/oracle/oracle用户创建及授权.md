---
title: oracle用户创建及授权
categories: database
abbrlink: a782733c
tags:
 - database
 - oracle
---



## oracle12C命令



### 创建用户

```sql
-- 查看数据库是不是CDB  
-- CDB：公共账户 创建的用户名前需添加 C## 或 c##  例如：create user c##MASS identified by xcw1017#;
-- PDB：私有账户
select CDB from v$database;

-- 查看全部用户
SELECT username, user_id, created, account_status FROM dba_users ORDER BY created DESC;

-- 创建用户 create user <username> identified by <password>;
create user MASS identified by xcw1017#;

-- 删除用户
drop user <username> cascade;

-- 查看所有用户
select * from dba_users;
```



### 表空间

#### 查看、创建、删除

```sql
-- 创建表空间  create tablespace <tablespacename> datafile <xx.dbf> size 100m;
-- tablespacename 表空间名称
-- xx.dbf  数据文件存放位置
-- 100m  表空间大小



-- 查看表空间
select tablespace_name from dba_tablespaces;

-- 创建表空间
create tablespace MASS
datafile 'C:\application\oracle\oracleHome\oradata\orcl\PDB_MASS.DBF' size 50m
autoextend on 
next 50m maxsize 20480m 
extent management local;

-- 删除表空间
drop tablespace MASS including contents;


-- 查看表空间数据文件路径
select * from dba_data_files
```



### 用户分配表空间

```sql
-- alter user <username> default tablespace <tablespacename>;
alter user MASS default tablespace MASS;
```



### 授权grant

```sql
-- 授予dba权限(谨慎执行)
grant dba to userName

-- 授予用户登录数据库的权限： 
grant create session to userName;

-- 授予用户基本操作权限；
grant resource to userName;

-- 授予用户操作表空间的权限：
grant unlimited tablespace to userName;
grant create tablespace to userName;
grant alter tablespace to userName;
grant drop tablespace to userName;
grant manage tablespace to userName;
grant create user,drop user,alter user,create any view,connect,resource,dba,create session,create any sequence to userName;

-- 授权该用户可以查询某个表的权限
grant select on 授权的表名 to 用户名; 
-- 授权该用户可以更新某个表的权限
grant update on 授权的表名 to 用户名; 
-- 授权该用户可以插入某个表的权限
grant insert on 授权的表名 to 用户名; 
-- 授权该用户可以删除某个表的权限
grant delete on 授权的表名 to 用户名; 

-- 授予用户操作表的权限：
grant create table to userName; (包含有create index权限, alter table, drop table权限)
-- 授予用户操作视图的权限:
grant create view to userName; (包含有alter view, drop view权限)
-- 授予用户操作触发器的权限：
grant create trigger to userName; (包含有alter trigger, drop trigger权限)
-- 授予用户操作存储过程的权限：
grant create procedure to userName;(包含有alter procedure, drop procedure 和function 以及 package权限)
-- 授予用户操作序列的权限：
grant create sequence to userName; (包含有创建、修改、删除以及选择序列)
```



### 权限回收revoke

```sql
--回收dba权限 
revoke dba from userName;


--授予用户基本操作权限；
revoke resource from userName;


--回收用户操作表的权限：
revoke create table from userName; (包含有create index权限, alter table, drop table权限)

```





### 权限查看

```sql
-- 查看用户权限
select * from session_privs;

-- 查看用户角色
select * from user_role_privs;
```





### 解锁与锁定

```sql
-- 解锁对应用户  alter user <userName> account unlock;
alter user scott account unlock;

-- （锁定）
alter user scott account lock;
```





### 更改密码

```sql
-- 更改密码 alter user <userName> identified by <newPassword>;
alter user scott identified by xcw1017#;

-- 延长密码有效期（例如设为1年）
ALTER PROFILE DEFAULT LIMIT PASSWORD_LIFE_TIME 365;

-- 设置密码永不过期（谨慎使用）
ALTER PROFILE your_profile LIMIT PASSWORD_LIFE_TIME UNLIMITED;

-- 修改最大失败尝试次数（例如设为无限次）
ALTER PROFILE DEFAULT LIMIT FAILED_LOGIN_ATTEMPTS UNLIMITED;
```











## oracle切换pdb模式

> cdb与pdb区别
>
> cdb共享公共数据
>
> pdb独立的业务数据库



```sql
-- 在 CDB 中执行，查询全部服务名
SELECT name, pdb FROM v$services;


ALTER PLUGGABLE DATABASE ALL CLOSE IMMEDIATE; -- 关闭所有 PDB

SHUTDOWN IMMEDIATE; -- 关闭CDB
STARTUP; -- 启动 CDB（自动进入 MOUNT 状态）
ALTER DATABASE OPEN; -- 打开 CDB
```





### 1.sqlplus进入管理员模式

```sql
sqlplus / as sysdba


-- 查看连接模式
show con_name;

-- 查询结果
    ｜CDB$ROOT ｜-- CDB模式
    ｜ORCLPDB  | -- PDB模式
```

禁用Oracle数据库中的复制依赖跟踪功能

```sql
 alter system set replication_dependency_tracking =false scope=spfile;
```



### 2.查询并打开PDB

```sql
-- 查询pdb名字和打开状态
select con_id,name,open_mode from v$pdbs;

-- 手动打开pdb，可发现oracle12c默认创建了一个pdb名称为ORCLPDB，但是默认为mounted，需要打开
alter pluggable database ORCLPDB open;
-- 保存pdb状态
ALTER PLUGGABLE DATABASE ORCLPDB SAVE STATE;

```



### 3.创建触发器

```sql
-- 创建触发器，并指定pdb和实例同时开启
create trigger OPEN_ORCLPDB after startup on database
　　 begin
　　 execute immediate 'alter pluggable database orclpdb open';
　　 end;
　　 /
　　 
　　 

```

### 4.修改当前会话为PDB

```sql
-- 修改容器连接模式
alter session set container=ORCLPDB;

-- 查看连接模式
show con_name;
```







## oracle更改监听文件

```bash
# 查看数据库信息
lsnrctl status

# 重新加载配置（无需停止）
lsnrctl reload  

# 完全重启
lsnrctl stop && lsnrctl start 

```



### listener.ora

监听连接请求，路由到正确的数据库实例。

```bash
# 定义静态注册的数据库实例/服务列表
SID_LIST_LISTENER =
  (SID_LIST =
    (SID_DESC =
      (SID_NAME = CLRExtProc)  										# 服务名，固定为 CLRExtProc
      (ORACLE_HOME = C:\application\oracle\oracleHome\product)		# Oracle安装目录
      (PROGRAM = extproc)											# 调用的外部程序（extproc.exe）
      (ENVS = "EXTPROC_DLLS=ONLY:C:\application\oracle\oracleHome\product\bin\oraclr12.dll")
    )
    (SID_DESC =
      (GLOBAL_DBNAME= ORCL)  
      (SID_NAME = ORCL)
      (ORACLE_HOME = C:\application\oracle\oracleHome\product)
    )
    (SID_DESC =
      (GLOBAL_DBNAME= orclpdb)
      (SID_NAME = orclpdb)
      (ORACLE_HOME = C:\application\oracle\oracleHome\product)
    )
  )

# 定义监听器的网络地址和协议配置
LISTENER =
  (DESCRIPTION_LIST =
    (DESCRIPTION =
      (ADDRESS = (PROTOCOL = TCP)(HOST = 10.211.55.5)(PORT = 1521))
      (ADDRESS = (PROTOCOL = IPC)(KEY = EXTPROC1521))
    )
  )

```



### tnsnames.ora 

将服务别名转换为网络地址，简化连接输入。

```bash
LISTENER_ORCL =
  (ADDRESS = (PROTOCOL = TCP)(HOST = 10.211.55.5)(PORT = 1521))


ORACLR_CONNECTION_DATA =
  (DESCRIPTION =
    (ADDRESS_LIST =
      (ADDRESS = (PROTOCOL = IPC)(KEY = EXTPROC1521))
    )
    (CONNECT_DATA =
      (SID = CLRExtProc)
      (PRESENTATION = RO)
    )
  )

# ORCL服务 CDB模式
#ORCL =
#  (DESCRIPTION =
#    (ADDRESS = (PROTOCOL = TCP)(HOST = 10.211.55.5)(PORT = 1521))
#    (CONNECT_DATA =
#      (SERVER = DEDICATED)
#      (SERVICE_NAME = orcl)
#    )
#  )


# orclpdb服务  pdb模式
orclpdb =
  (DESCRIPTION =
    (ADDRESS = (PROTOCOL = TCP)(HOST = 10.211.55.5)(PORT = 1521))
    (CONNECT_DATA =
      (SERVER = DEDICATED)
      (SERVICE_NAME = orclpdb)
    )
  )
```















## oracle导入dmp文件

### imp命令

```sql
-- 导入整个数据库
imp "mass/xcw1017!@10.211.55.5:1521/orclpdb" file=\\Mac\Home\Downloads\orapub5.dmp full=y
imp USERID=system/password@orcl FILE=full_backup.dmp FULL=Y LOG=full_import.log


-- 导入指定表
imp USERID=system/password@orcl FILE=full_backup.dmp TABLES=(emp,dept) IGNORE=Y

-- 仅导入表结构
imp USERID=system/password@orcl FILE=full_backup.dmp ROWS=N

```



### exp命令

```sql
-- 以 SYS 用户执行
@?/rdbms/admin/utlpwdmg.sql

-- 导出整个数据库
exp USERID=mass/xcw1017!@orclpdb FILE=full_backup.dmp FULL=Y LOG=full_export.log

-- 导出指定用户的对象
exp USERID=system/password@orcl FILE=scott_data.dmp OWNER=scott

-- 导出指定表
exp USERID=scott/tiger@orcl FILE=emp_dept.dmp TABLES=(emp, dept)

-- 只导出表结构
exp USERID=scott/tiger@orcl FILE=structure.dmp ROWS=N


```





### impdb

```sql
-- 导入整个用户
impdp system/password@target_db FULL=Y DIRECTORY=dpump_dir DUMPFILE=full_db.dmp LOGFILE=imp_full.log

-- 导入指定数据库
impdp mass/xcw1017!@orclpdb SCHEMAS=mass  DUMPFILE=MASS_DB.DMP LOGFILE=imp_mass_db.log
```





### expdb

```sql
-- 导出整个数据库
expdp mass/xcw1017!@orclpdb FULL=Y  DUMPFILE=full_db.dmp LOGFILE=exp_full.log

-- 指定用户对象导出
expdp mass/xcw1017!@orclpdb SCHEMAS=mass  DUMPFILE=mass_db.dmp LOGFILE=exp_mass_db.log


 C:\APPLICATION\ORACLE\ORACLEHOME\ORDIR\ADMIN\ORCL\DPDUMP\07662D3E940E42E18FE7173F3DB7AF88\MASS_DB.DMP
```







> exp高级用法
>
> 

1. 使用参数文件

   创建配置文件 `params.par`

   ```bash
   # params.par 内容
   FILE=expdat.dmp
   TABLES=(emp, dept)
   ROWS=Y
   DIRECT=Y
   LOG=export.log
   ```

   执行命令时指定参数文件

   ```bash
   exp USERID=scott/tiger@orcl PARFILE=params.par
   
   ```

2. 多文件导出（大文件拆分）

   ```bash
   # 表示分为part1.dmp、part2.dmp、part3.dmp文件，每个文件最大2G
   exp USERID=system/password@orcl FILE=part1.dmp,part2.dmp,part3.dmp FILESIZE=2G FULL=Y
   ```

   







## oracle清空数据库表

```sql
-- SELECT TABLE_NAME FROM USER_TABLES 查询到全部表

BEGIN
  FOR t IN (SELECT TABLE_NAME FROM USER_TABLES) 
  LOOP
    EXECUTE IMMEDIATE 'DROP TABLE "' || t.TABLE_NAME || '" CASCADE CONSTRAINTS PURGE';
  END LOOP;
END;

```

