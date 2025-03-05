---
title: Python使用(一)
categories: python
tags:
  - python
---







## 介绍

Python是一个解释型编程语言，简单易用，学习成本低，具有可扩展性、跨平台性。用于开发小工具

> 下载地址：https://www.python.org/downloads/





## 数据类型

### int

整型，不区分长整型和短整型

```python
# 十进制
a = 10

# 十六进制 16
b = 0x10

# 八进制 8
c = 0o10

# 二进制 2
d = 0b10

print(a, b, c, d)
```



### float

浮点型，python中只有一个浮点类型float

```python
# 1.十进制形式
num = 3.1415926

# 2.指数形式 固定写法 aEn  a尾数 E固定 n指数

# 其中 2.1 是尾数，5 是指数。 = 2.1 * 10^5
num1 = 2.1E5
# 其中 3.7 是尾数，-2 是指数。 = 3.7 * 10^-2
num2 = 3.7E-2
# 其中 0.5 是尾数，7 是指数。 = 0.5 * 10^7
num3 = 0.5E7

print(num)
print(num1, num2, num3)

```



### complex

复数类型，python中的内置类型，以`j` 或`J`结尾 格式为：`a+bj`

```python
"""
    complex 复数使用
"""

area = 1.2 * 5j

print(area)
print(type(area))
```





### bool

布尔类型

```python
"""
    bool 布尔类型使用
    ⚠️首字母必须大写，布尔类型可用于整数来表示 True=1 False=0
"""
a = True
b = False

print(a)
print(b)
print(12 > 3)
```







## 内置函数

| 函数名                            | 说明                                    |
| --------------------------------- | --------------------------------------- |
| print()                           | 输出对象到控制台                        |
| len(s)                            | 返回字符串、列表、数组长度              |
| type(obj)                         | 返回对象数据类型                        |
| list(iterable)                    | 将可迭代的对象转化为列表                |
| set(iterable)                     | 将 可迭代的对象转换为集合，去除重复值   |
| dict(**kwargs)                    | 创建字典，可使用关键字参数              |
| range( start, stop [, step])      | 返回整数序列，用于循环                  |
| sum( iterable, start = 0)         | 返回迭代对象中元素总和，start为起始位置 |
| max( iterable, *[, key, default]) | 返回迭代对象中最大值                    |
| min( iterable, *[, key, default]) | 返回迭代对象中最小值                    |
| abs(x)                            | 返回数字的绝对值                        |
|                                   |                                         |
|                                   |                                         |
| int(x, base=10)                   | 将字符串或数字转换为整型，base指定进制  |
| float(x)                          | 将字符串或数字转换为浮点型              |
| complex(real [, imag])            | 创建一个复数                            |
| str(obj)                          | 对象转换为字符串类型                    |
| chr(x)                            | 将整数转换为一个字符                    |
| ord(s)                            | 将字符转换为对应整数                    |
|                                   |                                         |
|                                   |                                         |







## 算数运算符

```python
"""
    运算符号使用
    +       加法
    -       减法
    *       乘法
    /       除法
    //      整除（只保留商）
    %       取余（除数余数部分）
    **      次方运算（x 的 y 次方）
"""
# 1.加法运算
a = 2
b = 3
c = "加法运算"
print(str(a) + str(b) + c)
# 输出 23加法运算
print(a + b, "%s" % c, sep="")
# 输出 5加法运算


# 2.减法运算
a = 2
b = 3
print(a - b, c)
# 输出 -1
print(-a)
# 输出 -2


# 3.乘法运算
a = 2
b = 3
print(a * b)
# 输出 6


# 4.除法运算
a = 2
b = 3
print(a / b)
# 输出 0.6666666666666666


# 5.整除运算
a = 2
b = 3
print(a // b)
# 输出 0


# 6.取余运算
a = 2
b = 3
print(a % b)
# 输出 2


# 7.次方运算
a = 2
b = 3
print(a ** b)
```





## 序列

```python
"""
    序列使用
"""

str = "我是python语言"
# 索引获取字符串 首部从0开始 尾部取值-1开始
print(str[0])
print(str[-1])

# 切片获取字符串
# 指定起始位置和结束位置
print(str[2:8])  
# 输出 python


# 只指定结束位置
print(str[:8])  
# 输出 python

# 字符串反转
print(str[::-1])
# 输出 言语nohtyp是我


# 检查元素是否包含在序列中
print("python" in str)
print("java" not in str)
# 输出 True False
```







## 列表使用

```python
"""
    python list使用
    [element1, element2, element3, ..., elementN]
"""
# 1.创建列表
print("创建列表")
list1 = [1, 2, 3, 4, 5]
list2 = ["a", "b", "c", "d", "e"]

# 元组创建列表
tuple1 = (1, 2, 3, 4, 5)
list3 = list(tuple1)

# 区间创建列表
range1 = range(1, 6)
list4 = list(range1)

# 字典创建列表
dict1 = {"a": 1, "b": 2, "c": 3, "d": 4, "e": 5}
list5 = list(dict1)

print(list1, list2, list3, list4, list5, sep="\n")
''' 输出结果
    [1, 2, 3, 4, 5]
    ['a', 'b', 'c', 'd', 'e']
    [1, 2, 3, 4, 5]
    [1, 2, 3, 4, 5]
    ['a', 'b', 'c', 'd', 'e']
'''

# 2.列表添加元素操作
print("列表添加元素操作")
addList = [1, 2, 3, 4, 5]

# 列表末尾添加元素，若添加元素为列表 则作为一个整体添加
addList.append([6, 7])
print(addList)

# 列表末尾添加元素，若添加元素为列表 则逐个数据进行添加
addList.extend([7, 8, 9])
print(addList)

# 列表指定位置添加元素
addList.insert(3, 333)
print(addList)
''' 输出结果
    [1, 2, 3, 4, 5, [6, 7]]
    [1, 2, 3, 4, 5, [6, 7], 7, 8, 9]
    [1, 2, 3, 333, 4, 5, [6, 7], 7, 8, 9]
'''

# 3.列表删除元素操作 del()  pop() remove() clear()
print("列表删除元素操作")
delList = [1, 2, 3, 4, 5, 6, 7, 8, 9]

# 删除指定位置或范围的元素
del delList[0: 3]
print(delList)

# 删除指定下标的元素
delList.pop(0)
# 删除末尾的元素
delList.pop()
print(delList)

# 删除指定值的元素
delList.remove(7)
print(delList)

# 清空列表
delList.clear()
print(delList)
''' 输出结果
    [4, 5, 6, 7, 8, 9]
    [5, 6, 7, 8]
    [5, 6, 8]
    []
'''

```

