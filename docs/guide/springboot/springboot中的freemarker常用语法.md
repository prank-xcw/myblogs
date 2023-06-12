---
title: springboot中的freemarker常用语法
categories: springBoot
abbrlink: 3ebb4a96
tags:
 - java
 - SpringBoot
---



## 特殊符号

1. ？？
        <!-- ??是判断对象是否为空(??是?exists的缩写) -->
        <#if object ??>${object}<#if>
        如果object不为空，则执行里面语句

2. ？ 
   ①用？判断是否为空，和？？类似，但要在？后面加上关键字
       <!-- ?是"是否"的意思 -->
       <#if object?exists>${object}</#if> 

   ②其他一些用法
        es:
        ${nowDate?time} (将当前时间以时间的格式显示，如：11:11:11)   
        ${nowDate?date} (将当前时间以日期的格式显示，如：2018-8-3) 
        注：time、date的格式可以在freemarker.properties文件中配置

3. ！
  ①\${object!} 如果object为空则不执行
  ②取反
        <!--  如果为空则执行 -->
        <#if !object ??>${object}<#if> 

4. ！！
    它的用法就是忽略list列表当中的空值
    es:
    	<#list lists!! as list>
    	这里如果lists当中有空值，没有！！的话，freemarker会直接抛出异常的



## 分支语句

- **if**

  ```xml
  <#if phone.state == 1 >
  	状态：正在使用
  <#/if>
      
  <!-- if else -->
  <#if phone.state == 1 >
  	状态：正在使用
  <#else>
      状态：无效状态
  <#/if>
      
      
  <!-- if elseif -->
  <#if phone.state == 1 >
  	状态：正在使用
  <#else if phone。state == 2>
      状态：闲置
  <#else>
      状态：无效状态
  <#/if>
      
  ```

- **switch**

  ```xml
  
  <#switch phone.state>
  	<#case 1>
  		状态：正在使用
  		<#break>
  	<#case 2>
  		状态：闲置
  		<#break>
  	<#case 3>
  		状态：已报废
  		<#break>
  	<#default>
  		状态：无效状态
  <#switch>
  ```





## 循环语句

- **map循环**

  ```xml
  <!--vo.urlMap?keys: 将map中的key循环(类似keySet迭代器)-->
  <#if vo.urlMap??>
  	<#list vo.urlMap?keys as key>
  		<li>
  			<a href="${vo.urlMap[key]!''}">${key!''}</a>
  		</li>
  	</#list>
  </#if>
  ```

- **list循环**

  ```xml
  <#list voList as vo>
  	<div>${vo!''}</div>
  </#list>
  ```