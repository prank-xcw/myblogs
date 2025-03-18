---
title: vue入门基础
sidebar: auto
categories: vue
tags:
  - vue
  - web

---



> 官网地址：https://cn.vuejs.org/



## :champagne: 项目目录

```modelica
├── node_modules 
├── public
│   ├── favicon.ico: 页签图标
│   └── index.html: 主页面
├── src
│   ├── assets: 存放静态资源
│   │   └── logo.png
│   │── component: 存放组件
│   │   └── HelloWorld.vue
│   │── App.vue: 汇总所有组件
│   │── main.js: 入口文件
├── .gitignore: git版本管制忽略的配置
├── babel.config.js: babel 的配置文件
├── package.json: 应用包配置文件 
├── README.md: 应用描述文件
├── package-lock.json：包版本控制文件
```



## 前端介绍

### CSS预处理器

​	css预处理器是一种专门的编程语言，对Web页面样式设计，通过编译器转换为css文件。

**常用的css预处理器有：SASS,LASS**

- `SASS：`基于Ruby，需要学习Ruby，上手难度高
- `LASS：`基于NodeJS，使用简单。







### Axios

​	Axios是一个通信框架，用来处理DOM元素，和jQuery中AJAX一样具有通信功能。



### UI框架

- `Ant-Design：`阿里巴巴出品，基于React框架。
- `Element-UI：`饿了么出品，基于Vue框架。
- `Bootstrap：` Twitter推出的前端开源工具包。
- `AmazeUI：`HTML5跨屏前端框架。



### WebPack

​	webPack是一个前端打包工具，用于打包JavaScript、css文件，进行压缩排序。



### VIte

​	一个前端项目构建工具



## 基本指令

### 分支语句

```html
<h2 v-if="type==1">A</h2>
<h2 v-else-if="type==2">B</h2>
<h2 v-else>C</h2>
```



### 循环语句

```html
<div id="app">
    <!-- for 使用-->
    <li v-for="(item, index) in items">
        index: {{ index }}  --- {{ item.text }}
    </li>
</div>
<script>
    var app = new Vue({
        el: '#app',
        data: {
            items: [
                {text: 'apple'},
                {text: 'banana'},
                {text: 'orange'}
            ]
        }
    })
</script>
```





## 绑定事件

**事件创建在 methods中**

`v-on`

```html

<div id="app">
    <!-- v-on使用-->
    <button v-on:click="sayHello">点击事件</button>
</div>
</body>
<script src="../static/js/vue2.7.16.js"></script>
<!--<script src="https://cdn.jsdelivr.net/npm/vue@2.7.16/dist/vue.min.js"></script>-->
<script>
    var app = new Vue({
        el: '#app',
        data: {
            msg: 'Hello World',
        },
        methods: {
            sayHello: function () {
                alert(this.msg);
            }
        }
    })
</script>
```





## 双向绑定

`v-model`指令在表单元素`<input>``<txtarea>``<select>`中创建双向绑定，监听用户输入与更新。

```html	
<div id="app">
    <!-- v-model使用-->
    姓名：<input v-model="userName">
    <br>
    输入的用户姓名：{{ userName }}


    <hr>
    性别：<input type="radio" value="男" v-model="sex">
    <input type="radio" value="女" v-model="sex">
    <br>
    选择的性别：{{ sex }}

    <hr>
    <select v-model="city">
        <option value="">请选择城市</option>
        <option value="北京">北京</option>
        <option value="上海">上海</option>
        <option value="深圳">深圳</option>
    </select>
    <br>
    选择的城市：{{ city }}
</div>
</body>
<script src="../static/js/vue2.7.16.js"></script>
<!--<script src="https://cdn.jsdelivr.net/npm/vue@2.7.16/dist/vue.min.js"></script>-->
<script>
    var app = new Vue({
        el: '#app',
        data: {
            userName: '',
            sex: '',
            city: '',
        }
    })
</script>
```







## 组件

​	vue组件就是创建可复用的模板

### 创建组件

```html
<div id="app">
    <!-- 使用组件 -->
    <my-li v-for="c in city" v-bind:c="c"></my-li>
</div>
</body>
<script src="../static/js/vue2.7.16.js"></script>
<!--<script src="https://cdn.jsdelivr.net/npm/vue@2.7.16/dist/vue.min.js"></script>-->
<script>
    // 组件创建
    Vue.component('my-li', {
        template: `<li >{{ c }}</li>`,
        // 接收父组件传递的参数
        props: ['c']
    });

    var app = new Vue({
        el: '#app',
        data: {
            city: [
                '北京', '上海', '深圳'
            ],
        }
    })
</script>
```





## Axios异步通信

​	axios是一个nodejs环境下的通信框架，vue中使用axios用于网络通信，与AJAX功能一致。

`npm install axios -s `

```javascript
var app = new Vue({
    el: '#app',
    data: {
    },
    created() {
        axios.get('https://api.github.com/users/mzlogin')
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
});
```





## 计算属性

​	计算属性定义在`computed`中，将数据进行缓存，常用于不经常变化的数据，节省系统开销。当计算属性中用到的变量有变更后，当前缓存数据也会刷新。

```javascript
var app = new Vue({
    el: '#app',
    data: {
    	flag: ''
    },
    computed:{
        currentTime: function(){
          this.flag;//flag变量变更后，当前属性会返回新的结果
          return Data.now();
        }
    }
});
```









## vue3核心语法



### ref

创建基本类型响应式变量+对象响应式变量

```vue
<template>
    <div class="person">
        <p>姓名: {{ name }}</p>
        <p>年龄: {{ age }}</p>
        <p>电话: {{ tel }}</p>

        <button @click="addAge">年龄加一</button>
    </div>
</template>
<script setup lang="ts" name="Person">
import { ref } from 'vue'
// 使用 ref 创建响应式变量，并正确标注类型
let name = ref<string>('张三')
let age = ref<number>(30)
let tel = '1234567890'


// 方法
function addAge() {
    age.value++
    console.log(age)
}
</script>
<style scoped>
</style>
```



### reative

创建响应式对象 `reative({ a:b})`

```vue	
<template>
    <div class="car">
        <p>名字: {{ car.name }}</p>
        <p>价格: {{ car.price }}</p>

        <button @click="addPrice">价格上调</button>
        <button @click="changeCar">改变汽车</button>
    </div>
</template>
<script setup lang="ts" name="car">
import { reactive } from 'vue'
// 使用 reactive 创建响应式对象，并正确标注类型
let car = reactive({name: '保时捷', price: 1000})


// 方法
function addPrice() {
    car.price += 100
}

function changeCar() {
    Object.assign(car, {name: '奔驰', price: 2000})
}

</script>
<style scoped>
.car {
    background-color: #d840b9;
    margin: 20px;
    padding: 20px;
    border-radius: 10px;
}
</style>
```





### ref与reative对比

宏观区别

> ref          用于定义：**基本数据类型**、**引用数据类型**
>
> recative 用于定义：**引用数据类型**



具体区别

> ref 创建的对象必须用 `.value`  (可以在vscode中安装`volar` 新版`official`插件自动添加`.value`)
>
> recative 重新分配一个新对象，会失去响应式，通过`Object.assign`整体替换



> 基本数据类型必须使用ref
>
> 层级不深 ref、recative 都可以
>
> 层级很深 推荐使用 recative





### toRefs 和 toRef

返回响应式对象

```vue
<script>
	import {ref,toRefs,toRef} from 'vue'
    
	let car = ref({name: '保时捷', price: 1000})
    
    // 将car中全部属性转换成响应式对象
    let {name,price} = toRefs(car);
    
    // 指定某个属性转换为响应式对象
    let name2 = toRef(car,'name');
</script>
```







### Watch

**作用：**监视数据变化



可监视数据的四种情况

> ref定义的数据
>
> recative定义的数据
>
> 函数的返回值
>
> 包含上述内容的数组



#### 情况一

监视`ref`创建的数据

```vue
 <template>
    <!-- watch监视使用 -->
    <div class="watch-test">
        <h1>情况一：监视【ref】定义的【基本数据】数据</h1>
        <p>count: {{ count }}</p>
        <button @click="count++">count++</button>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

// ref
const count = ref(0)
// watch，情况一：监视【ref】定义的【基本数据】数据
 var stopWatch =  watch(count, (newVal, oldVal) => {
    console.log('count:', newVal, oldVal)
    if (newVal > 10) {
        console.log('count大于10，停止监视')
        stopWatch()
    }
})

</script>
<style scoped>
.watch-test {
    margin: 20px;
    padding: 20px;
    background-color: #eba1c4;
    border-radius: 10px;
} 
</style>
```



#### 情况二

监视`ref`创建的对象类型数据

> 注意⚠️  
>
> - 若修改的是`ref`定义的对象中的属性， `newValue`和`oldValue`都是最新的值，因为是同一个对象
> - 若修改的是`ref`定义的对象， `newValue`是新值`oldValue`是旧值，因为不是同一个对象

```vue
 `newValue`和`oldValue`都是最新的值，因为是同一个对象<template>
    <!-- watch监视使用 -->
    <div class="watch-test">
        <h1>情况二：监视【ref】定义的【对象类型】数据</h1>
        <p>姓名: {{ person.name }}</p>
        <p>年龄: {{ person.age }}</p>
        <button @click="changeName">修改姓名</button>
        <button @click="person.age++">增加年龄</button>
        <button @click="changePerson">修改对象</button>
    </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'

const person = ref({name: '张三', age: 18})



// 修改姓名
function changeName() {
    person.value.name += '~'
}
// 修改对象
function changePerson() {
    person.value = {name: '李四', age: 20};
}

/*
watch，情况二：监视【ref】定义的【对象类型】数据，监视对象引用地址，若监视对象属性变化，需设置deep: true
参数一：监视对象
参数二：回调函数
参数三：配置项（ deep: true, immediate: true ）
*/
var stopWatch2 =  watch(person, (newVal, oldVal) => {
    console.log('person:', newVal, oldVal)
}, {deep: true})

</script>
<style scoped>
.watch-test {
    margin: 20px;
    padding: 20px;
    background-color: #eba1c4;
    border-radius: 10px;
} 
</style>
```



#### 情况三

```vue
 `newValue`和`oldValue`都是最新的值，因为是同一个对象<template>
    <!-- watch监视使用 -->
    <div class="watch-test">
        <h1>情况三：监视【reactive】定义的数据</h1>
        <p>姓名: {{ person.name }}</p>
        <p>年龄: {{ person.age }}</p>
        <button @click="changeName">修改姓名</button>
        <button @click="person.age++">增加年龄</button>
        <button @click="changePerson">修改对象</button>
    </div>
</template>
<script setup lang="ts">
import { reactive, watch } from 'vue'

const person = reactive({name: '张三', age: 18})



// 修改姓名
function changeName() {
    person.name += '~'
}
// 修改对象
function changePerson() {
    Object.assign(person, {name: '李四', age: 20})
}

// watch，情况三：监视【reactive】定义的数据，且默认开启了深度监视
var stopWatch =  watch(person, (newVal, oldVal) => {
    console.log('person:', newVal, oldVal)
})

</script>
<style scoped>
.watch-test {
    margin: 20px;
    padding: 20px;
    background-color: #eba1c4;
    border-radius: 10px;
} 
</style>
```





