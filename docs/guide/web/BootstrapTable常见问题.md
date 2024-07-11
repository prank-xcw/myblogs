---
title: BootstrapTable常见问题
categories: web
tags:
  - web
  - BootstrapTable
---







## 隐藏显示列



### 1.使用字段属性visible 设置



visible：true 展示 false 隐藏

```javascript
//1.方案一 直接返回布尔值
{
    field: "name",
    title: "名称",
    visible: false
}

//2.方案二 调用自定义函数返回布尔值
{
    field: "name",
    title: "名称",
    visible: visibleFun()
}
function visibleFun(){
   return false;
}


```





### 2.使用API方法hideColumn控制隐藏

```javascript
//隐藏id列
$('#example').bootstrapTable('hideColumn', 'id');

//展示id列
$('#example').bootstrapTable('showColumn', 'id');
```











## 多选回显



```javascript
//表格选中的数据
var selectList = [];

$('#table').bootstrapTable({
    // 其他配置项
    columns:[
        {
          field:'state',
          checkBox: true
        }
    ]
    ,responseHandler: function(res) {
		//循环接口数据，判断是否已经选中  
        $.each(res.rows, function (i, row) {
        	row.state = $.inArray(row.id, selectList) !== -1;
        });
        return res;
    }
});




$('#table').on('check.bs.table check-all.bs.table uncheck.bs.table uncheck-all.bs.table', function (e, rows) {
    var ids = $.map($.makeArray(rows), function (row) {
        return row.id;
    });
    console.log(e.type);
    
    //判断是否是选中 全部选中事件
    if($.inArray(e.type, ['check', 'check-all'])){
        selectList = union(selectList, ids);
    }else{
        selectList = difference(selectList, ids);
    }
});

/**
 * 数组合并
 * 例:  a=[1,2,3] b=[3,4,5]
 * union(a,b);
 * 结果：[1, 2, 3, 4, 5]
 *
 * @returns {*[]}
 */
function union() {
    let arrays = $.makeArray(arguments); // 将参数转换为数组
    let result = [];
    $.each(arrays, function (index, array) {
        $.each(array, function (i, value) {
            if ($.inArray(value, result) === -1) {
                result.push(value);
            }
        });
    });
    return result;
}

/**
 * 数组差值
 * 例:  a=[1, 2, 3, 4, 5]  b=[2, 4]
 * difference(a,b);
 * 结果：[1, 3, 5]
 *
 * @returns {*[]}
 */
function difference(array1, array2) {
    let result = [];
    $.each(array1, function (index, value) {
        if ($.inArray(value, array2) === -1) {
            result.push(value);
        }
    });
    return result;
}
```