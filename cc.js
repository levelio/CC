/**

 */

(function () {
    for (var i = 0, type; type = ["Array", "String", "Object", "Function"][i++];) {
        (function (type) {
            Object.prototype["is" + type] = function () {
                return {}.toString.call(this).slice(8, -1) === type;
            }
        })(type);
    }

    var Function = this.Function;

    Function.prototype.setter = function () {
        var self = this;
        return function (key, value) {
            if (value && key.isString()) self.call(this, key, value);
            if (key.isObject()) {
                for (var p in key) {
                    if (key.hasOwnProperty(p)) self.call(this, p, key[p]);
                }
            }
        }
    };

    Function.prototype.proto = function (key, value) {
        this.prototype[key] = value;
    }.setter();

    Function.prototype.static = function (key, value) {
        this[key] = value;
    }.setter();

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

    var objCreate = function(prototype, construct){
        var F = function(){};
        F.prototype = prototype;
        var obj = new F;
        obj.constructor = construct;
        return obj;
    }

    var mixin = function(a, b){
        for(var prop in b){
            if(b.hasOwnProperty(prop)){
                a[prop] = b[prop];
            }
        }
    };

    var strategies = {
        "init": function (fn) { //构造函数
            this["init"] = fn;
        },
        "proto": function (obj) { //原型上的方法
            this.proto(obj);
        },
        "static": function(obj){ //构造函数上的方法
            this.static(obj);
        }
    };

    this.CC = function () {};


    CC.extend = function _extend(prop){
        var sp = this.prototype,
            rp;
        var Class = function(){
            if(this.init){
                this.init.apply(this, arguments);
            }
        };
        Class._supper = objCreate(sp,this);
        rp = Class.prototype;
        



        rp = mixin(Class.prototype, this.prototype);

        for(var p in prop){
            if(strategies.hasOwnProperty(p)){
                strategies[p].apply(Class, prop[p]);
            }
        }
    }


})();
