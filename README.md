CC 
======

一个实现javascript 继承的小库.

##简介

1、可以设置静态方法和动态方法
2、可以像C#中 base 一样,调用父类的函数

##使用
普通使用
```
<script src="dist/cc.js"></script>
```
同时支持 AMD 的引用方式.

### 创建对象
#### API
`CC.extend(obj)`, `obj`参数中可以选填三个属性对象,分别是`_init`表示对象的构造函数, `_proto`表示要添加到对象原型上的方法, `_static`表示要添加到构造函数上的方法,也就是静态方法.

```
var Person = CC.extend({
        _init: function (name, age) {
            this.name = name;
            this.age = age;
        },
        _proto: {
            getName: function () {
                return this.name;
            },
            getAge: function () {
                return this.age;
            }
        },
        _static: {
            getConstructorName: function () {
                return "Person";
            }
        }
    });

```

### 继承对象
#### API
`Object.extend(obj)`,`obj`参数的属性和创建对象时一样,只是在定义函数过程中可以使用 `this.$base` 来调用父类的函数. `this.$base(name,[arg,[arg,..]])`的第一个参数表示父类函数的名称,当name为`_init`的时候,表示要调用构造函数,后面的参数为对应父类函数的参数.
```
var SuperMan = Person.extend({
        _init: function (name, age, flyable) {
            this.$base("_init", name, age); //调用父类构造函数
            this.flyable = flyable;
        },
        _proto: {
            canFly: function () {
                return this.flyable ? "我会飞" : "我不会飞";
            }
        },
        _static: {
            getConstructorName: function () {
                return "SuperMan";
            }
        }
    });
```
#### 测试
```
var p = new Person("普通人", 18);
    p.getName();    //=> 普通人
    p.getAge();     //=> 18
    Person.getConstructorName();    //=> Person

var sp = new SuperMan("克拉克", 25, true);
    /* 调用继承来的父类函数 */
    sp.getName();   //=> 克拉克
    sp.getAge();     //=> 25
    /* 调用自身的函数 */
    sp.canFly();     //=> 我会飞
    /* 静态方法 */
    SuperMan.getConstructorName();  //=> SuperMan
```
