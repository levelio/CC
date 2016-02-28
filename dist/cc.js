/*!
 @Name：cc
 @Author：sumizu
 @Site：https://github.com/simlesos
 @License：MIT

 */
(function(factory){
    if(typeof define === 'function' && define.amd){
        define(factory);
    }else{
        this.CC = factory();
    }
})(function () {
    var Type = {};
    for (var i = 0, type; type = ["Array", "String", "Object", "Function"][i++];) {
        (function (type) {
            Type["is" + type] = function () {
                return {}.toString.call(this).slice(8, -1) === type;
            }
        })(type);
    }

    var Function = this.Function;

    Function.prototype.cc_setter = function () {
        var self = this;
        return function (key, value) {
            if (value && Type.isString(key)) self.call(this, key, value);
            if (Type.isObject(key)) {
                for (var p in key) {
                    if (key.hasOwnProperty(p)) self.call(this, p, key[p]);
                }
            }
        }
    };

    Function.prototype.proto = function (key, value) {
        this.prototype[key] = value;
    }.cc_setter();

    Function.prototype.static = function (key, value) {
        this[key] = value;
    }.cc_setter();

    Function.proto({
        private: function () {
            this.$private = true;
            return this;
        },
        protected: function () {
            this.$protected = true;
            return this;
        }
    });

    var createProto = function (prototype, construct) {
        var F = function () {};
        F.prototype = prototype;
        var obj = new F;
        obj.constructor = construct;
        return obj;
    };

    var mixin = function (a, b) {
        for (var prop in b) {
            if (b.hasOwnProperty(prop)) {
                a[prop] = b[prop];
            }
        }
        return a;
    };

    var strategies = {
        _init: function (fn) { //构造函数
            this["_init"] = fn;
        },
        _proto: function (obj) { //原型上的方法
            this.proto(obj);
        },
        _static: function (obj) { //构造函数上的方法
            this.static(obj);
        }
    };

    var CC = function () {};

    CC.prototype.$base = function () {
        var _supper = this.constructor._supper,
            name = [].shift.call(arguments);
        if(name === "_init"){
            _supper.constructor._init.apply(this, arguments);
        }else{
            if(_supper[name]) return _supper[name].apply(this,arguments);
        }
    };

    CC.extend = function _extend(prop) {
        var sp = this.prototype, rp;
        var Class = function () {
            var constru = this.constructor;
            if (constru._init) {
                constru._init.apply(this, arguments);
            }
        };
        rp = createProto(sp, Class);
        Class._supper = createProto(sp, this);

        Class.prototype = mixin(rp, Class.prototype);

        for (var p in prop) {
            if (strategies.hasOwnProperty(p)) {
                strategies[p].call(Class, prop[p]);
            }
        }
        Class.extend = _extend;
        return Class;
    };
    return CC;
});


