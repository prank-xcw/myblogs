---
title: Java使用stream
sidebar: auto
categories: java
tags:
  - java
abbrlink: 6cf86d98
---











## stream和parallelStream

串行流stream：串行处理数据，不产生异步线程。

并行流parallelStream：parallelStream提供了流的并行处理，它是Stream的另一重要特性，其底层使用Fork/Join框架实现。简单理解就是多线程异步任务的一种实现。

建议：数据量不大的情况下建议使用stream即可，不要盲目大量使用parallelStream,因为parallelStream是多线程异步的，也就是说会产生多线程，消耗内存不说，说不定还会更慢，并非一定会更快更好。



## 常用方法使用

### groupingBy

**转换数据为Map，value是符合条件的集合**



```java
       List<User> userList = userMapper.findAll();
       Map<String, List<User>> userMap = userList.stream().collect(Collectors.groupingBy(User::getId));
```



### toMap

**根据字段分组**

```Java
List<User> userList = userMapper.findAll();

Map<String, List<User>> userMap = userList.stream()
    .collect(Collectors.toMap(User::getName, e -> new ArrayList(Collections.singletonList(e)), (List<User> newList, List<User> oldList) -> {
                    newList.addAll(oldList);
                    return newList;
                })
    );
```



**根据id为key转换为对象map**

```java
List<User> userList = userMapper.findAll();

Map<String, User> umap = userList.stream().collect(Collectors.toMap(User::getId, Function.identity()));
```



### filter

**筛选掉符合条件的数据**

```java
List<User> userList = userMapper.findAll();

userList = userList.stream().filter( u -> u.getId() != null).collect(Collectors.toList());
```



### anyMatch

**只要有一个符合条件的，就返回true**

```java
List<User> userList = userMapper.findAll();

boolean isState = userList.stream().anyMatch(u -> u.getState() != null);
```



### allMatch

**必须所以数据符合条件才会返回true**

```java
List<User> userList = userMapper.findAll();

boolean isState = userList.stream().allMatch(u -> u.getState() != null);
```



### noneMatch

**都不满足条件返回true**

```java
List<User> userList = userMapper.findAll();

boolean isState = userList.stream().noneMatch(u -> u.getState() != null);
```



### map

**获取数据属性值**

```java
List<User> userList = userMapper.findAll();

List<String> idList = userList.stream().map(u -> u.getId()).collect(Collectors.toList());
```



### peek

**改变数据属性值**

```java
List<User> userList = userMapper.findAll();

userList = userList.stream().peek(u -> u.setState(0)).collect(Collectors.toList());
```



> map和peek区别是 map有属性值，peek没有属性值

