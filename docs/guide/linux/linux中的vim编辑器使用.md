---
title: linux中的vim编辑器使用
categories: linux
tags:
  - linux
  - vim
---





## 查找

使用`/`或者`:$/`来查找，前者代表在首个出现的位置开始查找，后者代表从上一次查找结束的位置开始查找

进入vim编辑器输入`/search`后敲回车键，使用N键跳转到下一个位置



## 替换

全局替换`%s/oldText/newText/g`

```shell
#输入 :%s/oldText/newText/g 按回车进行替换，表示将文件中的oldText全部替换为newText
```



