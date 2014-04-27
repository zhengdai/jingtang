// Copyright (c) 2013, Baidu Inc. All rights reserved.
//
// Licensed under the BSD License
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://gmu.baidu.com/license.html
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @file 声明gmu命名空间
 * @namespace gmu
 * @import zepto.js
 */

/**
 * GMU是基于zepto的轻量级mobile UI组件库，符合jquery ui使用规范，提供webapp、pad端简单易用的UI组件。为了减小代码量，提高性能，组件再插件化，兼容iOS3+ / android2.1+，支持国内主流移动端浏览器，如safari, chrome, UC, qq等。
 * GMU由百度GMU小组开发，基于开源BSD协议，支持商业和非商业用户的免费使用和任意修改，您可以通过[get started](http://gmu.baidu.com/getstarted)快速了解。
 *
 * ###Quick Start###
 * + **官网：**http://gmu.baidu.com/
 * + **API：**http://gmu.baidu.com/doc
 *
 * ###历史版本###
 *
 * ### 2.0.5 ###
 * + **DEMO: ** http://gmu.baidu.com/demo/2.0.5
 * + **API：** http://gmu.baidu.com/doc/2.0.5
 * + **下载：** http://gmu.baidu.com/download/2.0.5
 *
 * @module GMU
 * @title GMU API 文档
 */
var gmu = gmu || {
    version: '@version',
    $: window.Zepto,

    /**
     * 调用此方法，可以减小重复实例化Zepto的开销。所有通过此方法调用的，都将公用一个Zepto实例，
     * 如果想减少Zepto实例创建的开销，就用此方法。
     * @method staticCall
     * @grammar gmu.staticCall( dom, fnName, args... )
     * @param  {DOM} elem Dom对象
     * @param  {String} fn Zepto方法名。
     * @param {*} * zepto中对应的方法参数。
     * @example
     * // 复制dom的className给dom2, 调用的是zepto的方法，但是只会实例化一次Zepto类。
     * var dom = document.getElementById( '#test' );
     *
     * var className = gmu.staticCall( dom, 'attr', 'class' );
     * console.log( className );
     *
     * var dom2 = document.getElementById( '#test2' );
     * gmu.staticCall( dom, 'addClass', className );
     */
    staticCall: (function( $ ) {
        var proto = $.fn,
            slice = [].slice,

        // 公用此zepto实例
            instance = $();

        instance.length = 1;

        return function( item, fn ) {
            instance[ 0 ] = item;
            return proto[ fn ].apply( instance, slice.call( arguments, 2 ) );
        };
    })( Zepto )
};
/**
 * @file Event相关, 给widget提供事件行为。也可以给其他对象提供事件行为。
 * @import core/gmu.js
 * @module GMU
 */
(function( gmu, $ ) {
    var slice = [].slice,
        separator = /\s+/,

        returnFalse = function() {
            return false;
        },

        returnTrue = function() {
            return true;
        };

    function eachEvent( events, callback, iterator ) {

        // 不支持对象，只支持多个event用空格隔开
        (events || '').split( separator ).forEach(function( type ) {
            iterator( type, callback );
        });
    }

    // 生成匹配namespace正则
    function matcherFor( ns ) {
        return new RegExp( '(?:^| )' + ns.replace( ' ', ' .* ?' ) + '(?: |$)' );
    }

    // 分离event name和event namespace
    function parse( name ) {
        var parts = ('' + name).split( '.' );

        return {
            e: parts[ 0 ],
            ns: parts.slice( 1 ).sort().join( ' ' )
        };
    }

    function findHandlers( arr, name, callback, context ) {
        var matcher,
            obj;

        obj = parse( name );
        obj.ns && (matcher = matcherFor( obj.ns ));
        return arr.filter(function( handler ) {
            return handler &&
                (!obj.e || handler.e === obj.e) &&
                (!obj.ns || matcher.test( handler.ns )) &&
                (!callback || handler.cb === callback ||
                    handler.cb._cb === callback) &&
                (!context || handler.ctx === context);
        });
    }

    /**
     * Event类，结合gmu.event一起使用, 可以使任何对象具有事件行为。包含基本`preventDefault()`, `stopPropagation()`方法。
     * 考虑到此事件没有Dom冒泡概念，所以没有`stopImmediatePropagation()`方法。而`stopProgapation()`的作用就是
     * 让之后的handler都不执行。
     *
     * @class Event
     * @constructor
     * ```javascript
     * var obj = {};
     *
     * $.extend( obj, gmu.event );
     *
     * var etv = gmu.Event( 'beforeshow' );
     * obj.trigger( etv );
     *
     * if ( etv.isDefaultPrevented() ) {
     *     console.log( 'before show has been prevented!' );
     * }
     * ```
     * @grammar new gmu.Event( name[, props]) => instance
     * @param {String} type 事件名字
     * @param {Object} [props] 属性对象，将被复制进event对象。
     */
    function Event( type, props ) {
        if ( !(this instanceof Event) ) {
            return new Event( type, props );
        }

        props && $.extend( this, props );
        this.type = type;

        return this;
    }

    Event.prototype = {

        /**
         * @method isDefaultPrevented
         * @grammar e.isDefaultPrevented() => Boolean
         * @desc 判断此事件是否被阻止
         */
        isDefaultPrevented: returnFalse,

        /**
         * @method isPropagationStopped
         * @grammar e.isPropagationStopped() => Boolean
         * @desc 判断此事件是否被停止蔓延
         */
        isPropagationStopped: returnFalse,

        /**
         * @method preventDefault
         * @grammar e.preventDefault() => undefined
         * @desc 阻止事件默认行为
         */
        preventDefault: function() {
            this.isDefaultPrevented = returnTrue;
        },

        /**
         * @method stopPropagation
         * @grammar e.stopPropagation() => undefined
         * @desc 阻止事件蔓延
         */
        stopPropagation: function() {
            this.isPropagationStopped = returnTrue;
        }
    };

    /**
     * @class event
     * @static
     * @description event对象，包含一套event操作方法。可以将此对象扩张到任意对象，来增加事件行为。
     *
     * ```javascript
     * var myobj = {};
     *
     * $.extend( myobj, gmu.event );
     *
     * myobj.on( 'eventname', function( e, var1, var2, var3 ) {
     *     console.log( 'event handler' );
     *     console.log( var1, var2, var3 );    // =>1 2 3
     * } );
     *
     * myobj.trigger( 'eventname', 1, 2, 3 );
     * ```
     */
    gmu.event = {

        /**
         * 绑定事件。
         * @method on
         * @grammar on( name, fn[, context] ) => self
         * @param  {String}   name     事件名
         * @param  {Function} callback 事件处理器
         * @param  {Object}   context  事件处理器的上下文。
         * @return {self} 返回自身，方便链式
         * @chainable
         */
        on: function( name, callback, context ) {
            var me = this,
                set;

            if ( !callback ) {
                return this;
            }

            set = this._events || (this._events = []);

            eachEvent( name, callback, function( name, callback ) {
                var handler = parse( name );

                handler.cb = callback;
                handler.ctx = context;
                handler.ctx2 = context || me;
                handler.id = set.length;
                set.push( handler );
            } );

            return this;
        },

        /**
         * 绑定事件，且当handler执行完后，自动解除绑定。
         * @method one
         * @grammar one( name, fn[, context] ) => self
         * @param  {String}   name     事件名
         * @param  {Function} callback 事件处理器
         * @param  {Object}   context  事件处理器的上下文。
         * @return {self} 返回自身，方便链式
         * @chainable
         */
        one: function( name, callback, context ) {
            var me = this;

            if ( !callback ) {
                return this;
            }

            eachEvent( name, callback, function( name, callback ) {
                var once = function() {
                    me.off( name, once );
                    return callback.apply( context || me, arguments );
                };

                once._cb = callback;
                me.on( name, once, context );
            } );

            return this;
        },

        /**
         * 解除事件绑定
         * @method off
         * @grammar off( name[, fn[, context] ] ) => self
         * @param  {String}   name     事件名
         * @param  {Function} callback 事件处理器
         * @param  {Object}   context  事件处理器的上下文。
         * @return {self} 返回自身，方便链式
         * @chainable
         */
        off: function( name, callback, context ) {
            var events = this._events;

            if ( !events ) {
                return this;
            }

            if ( !name && !callback && !context ) {
                this._events = [];
                return this;
            }

            eachEvent( name, callback, function( name, callback ) {
                findHandlers( events, name, callback, context )
                    .forEach(function( handler ) {
                        delete events[ handler.id ];
                    });
            } );

            return this;
        },

        /**
         * 触发事件
         * @method trigger
         * @grammar trigger( name[, ...] ) => self
         * @param  {String | Event }   evt     事件名或gmu.Event对象实例
         * @param  {*} * 任意参数
         * @return {self} 返回自身，方便链式
         * @chainable
         */
        trigger: function( evt ) {
            var i = -1,
                args,
                events,
                stoped,
                len,
                ev;

            if ( !this._events || !evt ) {
                return this;
            }

            typeof evt === 'string' && (evt = new Event( evt ));

            args = slice.call( arguments, 1 );
            evt.args = args;    // handler中可以直接通过e.args获取trigger数据
            args.unshift( evt );

            events = findHandlers( this._events, evt.type );

            if ( events ) {
                len = events.length;

                while ( ++i < len ) {
                    if ( (stoped = evt.isPropagationStopped()) ||  false ===
                        (ev = events[ i ]).cb.apply( ev.ctx2, args )
                        ) {

                        // 如果return false则相当于stopPropagation()和preventDefault();
                        stoped || (evt.stopPropagation(), evt.preventDefault());
                        break;
                    }
                }
            }

            return this;
        }
    };

    // expose
    gmu.Event = Event;
})( gmu, gmu.$ );
/**
 * @file 模板解析
 * @import zepto.js
 * @module GMU
 */
(function( $, undefined ) {

    /**
     * 解析模版tpl。当data未传入时返回编译结果函数；当某个template需要多次解析时，建议保存编译结果函数，然后调用此函数来得到结果。
     *
     * @method $.parseTpl
     * @grammar $.parseTpl(str, data)  ⇒ string
     * @grammar $.parseTpl(str)  ⇒ Function
     * @param {String} str 模板
     * @param {Object} data 数据
     * @example var str = "<p><%=name%></p>",
     * obj = {name: 'ajean'};
     * console.log($.parseTpl(str, data)); // => <p>ajean</p>
     */
    $.parseTpl = function( str, data ) {
        var tmpl = 'var __p=[];' + 'with(obj||{}){__p.push(\'' +
                str.replace( /\\/g, '\\\\' )
                    .replace( /'/g, '\\\'' )
                    .replace( /<%=([\s\S]+?)%>/g, function( match, code ) {
                        return '\',' + code.replace( /\\'/, '\'' ) + ',\'';
                    } )
                    .replace( /<%([\s\S]+?)%>/g, function( match, code ) {
                        return '\');' + code.replace( /\\'/, '\'' )
                            .replace( /[\r\n\t]/g, ' ' ) + '__p.push(\'';
                    } )
                    .replace( /\r/g, '\\r' )
                    .replace( /\n/g, '\\n' )
                    .replace( /\t/g, '\\t' ) +
                '\');}return __p.join("");',

        /* jsbint evil:true */
            func = new Function( 'obj', tmpl );

        return data ? func( data ) : func;
    };
})( Zepto );
/**
 * @file gmu底层，定义了创建gmu组件的方法
 * @import core/gmu.js, core/event.js, extend/parseTpl.js
 * @module GMU
 */

(function( gmu, $, undefined ) {
    var slice = [].slice,
        toString = Object.prototype.toString,
        blankFn = function() {},

    // 挂到组件类上的属性、方法
        staticlist = [ 'options', 'template', 'tpl2html' ],

    // 存储和读取数据到指定对象，任何对象包括dom对象
    // 注意：数据不直接存储在object上，而是存在内部闭包中，通过_gid关联
    // record( object, key ) 获取object对应的key值
    // record( object, key, value ) 设置object对应的key值
    // record( object, key, null ) 删除数据
        record = (function() {
            var data = {},
                id = 0,
                ikey = '_gid';    // internal key.

            return function( obj, key, val ) {
                var dkey = obj[ ikey ] || (obj[ ikey ] = ++id),
                    store = data[ dkey ] || (data[ dkey ] = {});

                val !== undefined && (store[ key ] = val);
                val === null && delete store[ key ];

                return store[ key ];
            };
        })(),

        event = gmu.event;

    function isPlainObject( obj ) {
        return toString.call( obj ) === '[object Object]';
    }

    // 遍历对象
    function eachObject( obj, iterator ) {
        obj && Object.keys( obj ).forEach(function( key ) {
            iterator( key, obj[ key ] );
        });
    }

    // 从某个元素上读取某个属性。
    function parseData( data ) {
        try {    // JSON.parse可能报错

            // 当data===null表示，没有此属性
            data = data === 'true' ? true :
                    data === 'false' ? false : data === 'null' ? null :

                // 如果是数字类型，则将字符串类型转成数字类型
                    +data + '' === data ? +data :
                /(?:\{[\s\S]*\}|\[[\s\S]*\])$/.test( data ) ?
                    JSON.parse( data ) : data;
        } catch ( ex ) {
            data = undefined;
        }

        return data;
    }

    // 从DOM节点上获取配置项
    function getDomOptions( el ) {
        var ret = {},
            attrs = el && el.attributes,
            len = attrs && attrs.length,
            key,
            data;

        while ( len-- ) {
            data = attrs[ len ];
            key = data.name;

            if ( key.substring(0, 5) !== 'data-' ) {
                continue;
            }

            key = key.substring( 5 );
            data = parseData( data.value );

            data === undefined || (ret[ key ] = data);
        }

        return ret;
    }

    // 在$.fn上挂对应的组件方法呢
    // $('#btn').button( options );实例化组件
    // $('#btn').button( 'select' ); 调用实例方法
    // $('#btn').button( 'this' ); 取组件实例
    // 此方法遵循get first set all原则
    function zeptolize( name ) {
        var key = name.substring( 0, 1 ).toLowerCase() + name.substring( 1 ),
            old = $.fn[ key ];

        $.fn[ key ] = function( opts ) {
            var args = slice.call( arguments, 1 ),
                method = typeof opts === 'string' && opts,
                ret,
                obj;

            $.each( this, function( i, el ) {

                // 从缓存中取，没有则创建一个
                obj = record( el, name ) || new gmu[ name ]( el,
                    isPlainObject( opts ) ? opts : undefined );

                // 取实例
                if ( method === 'this' ) {
                    ret = obj;
                    return false;    // 断开each循环
                } else if ( method ) {

                    // 当取的方法不存在时，抛出错误信息
                    if ( !$.isFunction( obj[ method ] ) ) {
                        throw new Error( '组件没有此方法：' + method );
                    }

                    ret = obj[ method ].apply( obj, args );

                    // 断定它是getter性质的方法，所以需要断开each循环，把结果返回
                    if ( ret !== undefined && ret !== obj ) {
                        return false;
                    }

                    // ret为obj时为无效值，为了不影响后面的返回
                    ret = undefined;
                }
            } );

            return ret !== undefined ? ret : this;
        };

        /*
         * NO CONFLICT
         * var gmuPanel = $.fn.panel.noConflict();
         * gmuPanel.call(test, 'fnname');
         */
        $.fn[ key ].noConflict = function() {
            $.fn[ key ] = old;
            return this;
        };
    }

    // 加载注册的option
    function loadOption( klass, opts ) {
        var me = this;

        // 先加载父级的
        if ( klass.superClass ) {
            loadOption.call( me, klass.superClass, opts );
        }

        eachObject( record( klass, 'options' ), function( key, option ) {
            option.forEach(function( item ) {
                var condition = item[ 0 ],
                    fn = item[ 1 ];

                if ( condition === '*' ||
                    ($.isFunction( condition ) &&
                        condition.call( me, opts[ key ] )) ||
                    condition === opts[ key ] ) {

                    fn.call( me );
                }
            });
        } );
    }

    // 加载注册的插件
    function loadPlugins( klass, opts ) {
        var me = this;

        // 先加载父级的
        if ( klass.superClass ) {
            loadPlugins.call( me, klass.superClass, opts );
        }

        eachObject( record( klass, 'plugins' ), function( opt, plugin ) {

            // 如果配置项关闭了，则不启用此插件
            if ( opts[ opt ] === false ) {
                return;
            }

            eachObject( plugin, function( key, val ) {
                var oringFn;

                if ( $.isFunction( val ) && (oringFn = me[ key ]) ) {
                    me[ key ] = function() {
                        var origin = me.origin,
                            ret;

                        me.origin = oringFn;
                        ret = val.apply( me, arguments );
                        origin === undefined ? delete me.origin :
                            (me.origin = origin);

                        return ret;
                    };
                } else {
                    me[ key ] = val;
                }
            } );

            plugin._init.call( me );
        } );
    }

    // 合并对象
    function mergeObj() {
        var args = slice.call( arguments ),
            i = args.length,
            last;

        while ( i-- ) {
            last = last || args[ i ];
            isPlainObject( args[ i ] ) || args.splice( i, 1 );
        }

        return args.length ?
            $.extend.apply( null, [ true, {} ].concat( args ) ) : last; // 深拷贝，options中某项为object时，用例中不能用==判断
    }

    // 初始化widget. 隐藏具体细节，因为如果放在构造器中的话，是可以看到方法体内容的
    // 同时此方法可以公用。
    function bootstrap( name, klass, uid, el, options ) {
        var me = this,
            opts;

        if ( isPlainObject( el ) ) {
            options = el;
            el = undefined;
        }

        // options中存在el时，覆盖el
        options && options.el && (el = $( options.el ));
        el && (me.$el = $( el ), el = me.$el[ 0 ]);

        opts = me._options = mergeObj( klass.options,
            getDomOptions( el ), options );

        me.template = mergeObj( klass.template, opts.template );

        me.tpl2html = mergeObj( klass.tpl2html, opts.tpl2html );

        // 生成eventNs widgetName
        me.widgetName = name.toLowerCase();
        me.eventNs = '.' + me.widgetName + uid;

        me._init( opts );

        // 设置setup参数，只有传入的$el在DOM中，才认为是setup模式
        me._options.setup = (me.$el && me.$el.parent()[ 0 ]) ? true: false;

        loadOption.call( me, klass, opts );
        loadPlugins.call( me, klass, opts );

        // 进行创建DOM等操作
        me._create();
        me.trigger( 'ready' );

        el && record( el, name, me ) && me.on( 'destroy', function() {
            record( el, name, null );
        } );

        return me;
    }

    /**
     * @desc 创建一个类，构造函数默认为init方法, superClass默认为Base
     * @name createClass
     * @grammar createClass(object[, superClass]) => fn
     */
    function createClass( name, object, superClass ) {
        if ( typeof superClass !== 'function' ) {
            superClass = gmu.Base;
        }

        var uuid = 1,
            suid = 1;

        function klass( el, options ) {
            if ( name === 'Base' ) {
                throw new Error( 'Base类不能直接实例化' );
            }

            if ( !(this instanceof klass) ) {
                return new klass( el, options );
            }

            return bootstrap.call( this, name, klass, uuid++, el, options );
        }

        $.extend( klass, {

            /**
             * @name register
             * @grammar klass.register({})
             * @desc 注册插件
             */
            register: function( name, obj ) {
                var plugins = record( klass, 'plugins' ) ||
                    record( klass, 'plugins', {} );

                obj._init = obj._init || blankFn;

                plugins[ name ] = obj;
                return klass;
            },

            /**
             * @name option
             * @grammar klass.option(option, value, method)
             * @desc 扩充组件的配置项
             */
            option: function( option, value, method ) {
                var options = record( klass, 'options' ) ||
                    record( klass, 'options', {} );

                options[ option ] || (options[ option ] = []);
                options[ option ].push([ value, method ]);

                return klass;
            },

            /**
             * @name inherits
             * @grammar klass.inherits({})
             * @desc 从该类继承出一个子类，不会被挂到gmu命名空间
             */
            inherits: function( obj ) {

                // 生成 Sub class
                return createClass( name + 'Sub' + suid++, obj, klass );
            },

            /**
             * @name extend
             * @grammar klass.extend({})
             * @desc 扩充现有组件
             */
            extend: function( obj ) {
                var proto = klass.prototype,
                    superProto = superClass.prototype;

                staticlist.forEach(function( item ) {
                    obj[ item ] = mergeObj( superClass[ item ], obj[ item ] );
                    obj[ item ] && (klass[ item ] = obj[ item ]);
                    delete obj[ item ];
                });

                // todo 跟plugin的origin逻辑，公用一下
                eachObject( obj, function( key, val ) {
                    if ( typeof val === 'function' && superProto[ key ] ) {
                        proto[ key ] = function() {
                            var $super = this.$super,
                                ret;

                            // todo 直接让this.$super = superProto[ key ];
                            this.$super = function() {
                                var args = slice.call( arguments, 1 );
                                return superProto[ key ].apply( this, args );
                            };

                            ret = val.apply( this, arguments );

                            $super === undefined ? (delete this.$super) :
                                (this.$super = $super);
                            return ret;
                        };
                    } else {
                        proto[ key ] = val;
                    }
                } );
            }
        } );

        klass.superClass = superClass;
        klass.prototype = Object.create( superClass.prototype );


        /*// 可以在方法中通过this.$super(name)方法调用父级方法。如：this.$super('enable');
         object.$super = function( name ) {
         var fn = superClass.prototype[ name ];
         return $.isFunction( fn ) && fn.apply( this,
         slice.call( arguments, 1 ) );
         };*/

        klass.extend( object );

        return klass;
    }

    /**
     * @method define
     * @grammar gmu.define( name, object[, superClass] )
     * @class
     * @param {String} name 组件名字标识符。
     * @param {Object} object
     * @desc 定义一个gmu组件
     * @example
     * ####组件定义
     * ```javascript
     * gmu.define( 'Button', {
     *     _create: function() {
     *         var $el = this.getEl();
     *
     *         $el.addClass( 'ui-btn' );
     *     },
     *
     *     show: function() {
     *         console.log( 'show' );
     *     }
     * } );
     * ```
     *
     * ####组件使用
     * html部分
     * ```html
     * <a id='btn'>按钮</a>
     * ```
     *
     * javascript部分
     * ```javascript
     * var btn = $('#btn').button();
     *
     * btn.show();    // => show
     * ```
     *
     */
    gmu.define = function( name, object, superClass ) {
        gmu[ name ] = createClass( name, object, superClass );
        zeptolize( name );
    };

    /**
     * @desc 判断object是不是 widget实例, klass不传时，默认为Base基类
     * @method isWidget
     * @grammar gmu.isWidget( anything[, klass] ) => Boolean
     * @param {*} anything 需要判断的对象
     * @param {String|Class} klass 字符串或者类。
     * @example
     * var a = new gmu.Button();
     *
     * console.log( gmu.isWidget( a ) );    // => true
     * console.log( gmu.isWidget( a, 'Dropmenu' ) );    // => false
     */
    gmu.isWidget = function( obj, klass ) {

        // 处理字符串的case
        klass = typeof klass === 'string' ? gmu[ klass ] || blankFn : klass;
        klass = klass || gmu.Base;
        return obj instanceof klass;
    };

    /**
     * @class Base
     * @description widget基类。不能直接使用。
     */
    gmu.Base = createClass( 'Base', {

        /**
         * @method _init
         * @grammar instance._init() => instance
         * @desc 组件的初始化方法，子类需要重写该方法
         */
        _init: blankFn,

        /**
         * @override
         * @method _create
         * @grammar instance._create() => instance
         * @desc 组件创建DOM的方法，子类需要重写该方法
         */
        _create: blankFn,


        /**
         * @method getEl
         * @grammar instance.getEl() => $el
         * @desc 返回组件的$el
         */
        getEl: function() {
            return this.$el;
        },

        /**
         * @method on
         * @grammar instance.on(name, callback, context) => self
         * @desc 订阅事件
         */
        on: event.on,

        /**
         * @method one
         * @grammar instance.one(name, callback, context) => self
         * @desc 订阅事件（只执行一次）
         */
        one: event.one,

        /**
         * @method off
         * @grammar instance.off(name, callback, context) => self
         * @desc 解除订阅事件
         */
        off: event.off,

        /**
         * @method trigger
         * @grammar instance.trigger( name ) => self
         * @desc 派发事件, 此trigger会优先把options上的事件回调函数先执行
         * options上回调函数可以通过调用event.stopPropagation()来阻止事件系统继续派发,
         * 或者调用event.preventDefault()阻止后续事件执行
         */
        trigger: function( name ) {
            var evt = typeof name === 'string' ? new gmu.Event( name ) : name,
                args = [ evt ].concat( slice.call( arguments, 1 ) ),
                opEvent = this._options[ evt.type ],

            // 先存起来，否则在下面使用的时候，可能已经被destory给删除了。
                $el = this.getEl();

            if ( opEvent && $.isFunction( opEvent ) ) {

                // 如果返回值是false,相当于执行stopPropagation()和preventDefault();
                false === opEvent.apply( this, args ) &&
                (evt.stopPropagation(), evt.preventDefault());
            }

            event.trigger.apply( this, args );

            // triggerHandler不冒泡
            $el && $el.triggerHandler( evt, (args.shift(), args) );

            return this;
        },

        /**
         * @method tpl2html
         * @grammar instance.tpl2html() => String
         * @grammar instance.tpl2html( data ) => String
         * @grammar instance.tpl2html( subpart, data ) => String
         * @desc 将template输出成html字符串，当传入 data 时，html将通过$.parseTpl渲染。
         * template支持指定subpart, 当无subpart时，template本身将为模板，当有subpart时，
         * template[subpart]将作为模板输出。
         */
        tpl2html: function( subpart, data ) {
            var tpl = this.template;

            tpl =  typeof subpart === 'string' ? tpl[ subpart ] :
                ((data = subpart), tpl);

            return data || ~tpl.indexOf( '<%' ) ? $.parseTpl( tpl, data ) : tpl;
        },

        /**
         * @method destroy
         * @grammar instance.destroy()
         * @desc 注销组件
         */
        destroy: function() {

            // 解绑element上的事件
            this.$el && this.$el.off( this.eventNs );

            this.trigger( 'destroy' );
            // 解绑所有自定义事件
            this.off();


            this.destroyed = true;
        }

    }, Object );

    // 向下兼容
    $.ui = gmu;
})( gmu, gmu.$ );
/**
 * @file 减少对方法、事件的执行频率，多次调用，在指定的时间内只会执行一次
 * @import zepto.js
 * @module GMU
 */

(function ($) {
    /**
     * 减少执行频率, 多次调用，在指定的时间内，只会执行一次。
     * ```
     * ||||||||||||||||||||||||| (空闲) |||||||||||||||||||||||||
     * X    X    X    X    X    X      X    X    X    X    X    X
     * ```
     *
     * @method $.throttle
     * @grammar $.throttle(delay, fn) ⇒ function
     * @param {Number} [delay=250] 延时时间
     * @param {Function} fn 被稀释的方法
     * @param {Boolean} [debounce_mode=false] 是否开启防震动模式, true:start, false:end
     * @example var touchmoveHander = function(){
     *     //....
     * }
     * //绑定事件
     * $(document).bind('touchmove', $.throttle(250, touchmoveHander));//频繁滚动，每250ms，执行一次touchmoveHandler
     *
     * //解绑事件
     * $(document).unbind('touchmove', touchmoveHander);//注意这里面unbind还是touchmoveHander,而不是$.throttle返回的function, 当然unbind那个也是一样的效果
     *
     */
    $.extend($, {
        throttle: function(delay, fn, debounce_mode) {
            var last = 0,
                timeId;

            if (typeof fn !== 'function') {
                debounce_mode = fn;
                fn = delay;
                delay = 250;
            }

            function wrapper() {
                var that = this,
                    period = Date.now() - last,
                    args = arguments;

                function exec() {
                    last = Date.now();
                    fn.apply(that, args);
                };

                function clear() {
                    timeId = undefined;
                };

                if (debounce_mode && !timeId) {
                    // debounce模式 && 第一次调用
                    exec();
                }

                timeId && clearTimeout(timeId);
                if (debounce_mode === undefined && period > delay) {
                    // throttle, 执行到了delay时间
                    exec();
                } else {
                    // debounce, 如果是start就clearTimeout
                    timeId = setTimeout(debounce_mode ? clear : exec, debounce_mode === undefined ? delay - period : delay);
                }
            };
            // for event bind | unbind
            wrapper._zid = fn._zid = fn._zid || $.proxy(fn)._zid;
            return wrapper;
        },

        /**
         * @desc 减少执行频率, 在指定的时间内, 多次调用，只会执行一次。
         * **options:**
         * - ***delay***: 延时时间
         * - ***fn***: 被稀释的方法
         * - ***t***: 指定是在开始处执行，还是结束是执行, true:start, false:end
         *
         * 非at_begin模式
         * <code type="text">||||||||||||||||||||||||| (空闲) |||||||||||||||||||||||||
         *                         X                                X</code>
         * at_begin模式
         * <code type="text">||||||||||||||||||||||||| (空闲) |||||||||||||||||||||||||
         * X                                X                        </code>
         *
         * @grammar $.debounce(delay, fn[, at_begin]) ⇒ function
         * @name $.debounce
         * @example var touchmoveHander = function(){
         *     //....
         * }
         * //绑定事件
         * $(document).bind('touchmove', $.debounce(250, touchmoveHander));//频繁滚动，只要间隔时间不大于250ms, 在一系列移动后，只会执行一次
         *
         * //解绑事件
         * $(document).unbind('touchmove', touchmoveHander);//注意这里面unbind还是touchmoveHander,而不是$.debounce返回的function, 当然unbind那个也是一样的效果
         */
        debounce: function(delay, fn, t) {
            return fn === undefined ? $.throttle(250, delay, false) : $.throttle(delay, fn, t === undefined ? false : t !== false);
        }
    });
})(Zepto);
/**
 * @file 滚动停止事件
 * @name scrollStop
 * @short scrollStop
 * @desc 滚动停止事件
 * @import zepto.js, extend/throttle.js
 */
(function ($, win) {
    /**
     * @name scrollStop
     * @desc 扩展的事件，滚动停止事件
     * - ***scrollStop*** : 在document上派生的scrollStop事件上，scroll停下来时触发, 考虑前进或者后退后scroll事件不触发情况。
     * @example $(document).on('scrollStop', function () {        //scroll停下来时显示scrollStop
     *     console.log('scrollStop');
     * });
     */

    function registerScrollStop() {
        $(win).on('scroll', $.debounce(80, function () {
            $(win).trigger('scrollStop');
        }, false));
    }

    function backEventOffHandler() {
        //在离开页面，前进或后退回到页面后，重新绑定scroll, 需要off掉所有的scroll，否则scroll时间不触发
        $(win).off('scroll');
        registerScrollStop();
    }
    registerScrollStop();

    //todo 待统一解决后退事件触发问题
    $(win).on('pageshow', function (e) {
        //如果是从bfcache中加载页面，为了防止多次注册，需要先off掉
        e.persisted && $(win).off('touchstart', backEventOffHandler).one('touchstart', backEventOffHandler);
    });

})(Zepto, window);
/**
 * @file 媒体查询
 * @import zepto.js
 * @module GMU
 */

(function ($) {

    /**
     * 是原生的window.matchMedia方法的polyfill，对于不支持matchMedia的方法系统和浏览器，按照[w3c window.matchMedia](http://www.w3.org/TR/cssom-view/#dom-window-matchmedia)的接口
     * 定义，对matchMedia方法进行了封装。原理是用css media query及transitionEnd事件来完成的。在页面中插入media query样式及元素，当query条件满足时改变该元素样式，同时这个样式是transition作用的属性，
     * 满足条件后即会触发transitionEnd，由此创建MediaQueryList的事件监听。由于transition的duration time为0.001ms，故若直接使用MediaQueryList对象的matches去判断当前是否与query匹配，会有部分延迟，
     * 建议注册addListener的方式去监听query的改变。$.matchMedia的详细实现原理及采用该方法实现的转屏统一解决方案详见
     * [GMU Pages: 转屏解决方案($.matchMedia)](https://github.com/gmuteam/GMU/wiki/%E8%BD%AC%E5%B1%8F%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88$.matchMedia)
     *
     * 返回值MediaQueryList对象包含的属性<br />
     * - ***matches*** 是否满足query<br />
     * - ***query*** 查询的css query，类似\'screen and (orientation: portrait)\'<br />
     * - ***addListener*** 添加MediaQueryList对象监听器，接收回调函数，回调参数为MediaQueryList对象<br />
     * - ***removeListener*** 移除MediaQueryList对象监听器<br />
     *
     *
     * @method $.matchMedia
     * @grammar $.matchMedia(query)  ⇒ MediaQueryList
     * @param {String} query 查询的css query，类似\'screen and (orientation: portrait)\'
     * @return {Object} MediaQueryList
     * @example
     * $.matchMedia('screen and (orientation: portrait)').addListener(fn);
     */
    $.matchMedia = (function() {
        var mediaId = 0,
            cls = 'gmu-media-detect',
            transitionEnd = $.fx.transitionEnd,
            cssPrefix = $.fx.cssPrefix,
            $style = $('<style></style>').append('.' + cls + '{' + cssPrefix + 'transition: width 0.001ms; width: 0; position: absolute; clip: rect(1px, 1px, 1px, 1px);}\n').appendTo('head');

        return function (query) {
            var id = cls + mediaId++,
                $mediaElem,
                listeners = [],
                ret;

            $style.append('@media ' + query + ' { #' + id + ' { width: 1px; } }\n') ;   //原生matchMedia也需要添加对应的@media才能生效

            // 统一用模拟的，时机更好。
            // if ('matchMedia' in window) {
            //     return window.matchMedia(query);
            // }

            $mediaElem = $('<div class="' + cls + '" id="' + id + '"></div>')
                .appendTo('body')
                .on(transitionEnd, function() {
                    ret.matches = $mediaElem.width() === 1;
                    $.each(listeners, function (i,fn) {
                        $.isFunction(fn) && fn.call(ret, ret);
                    });
                });

            ret = {
                matches: $mediaElem.width() === 1 ,
                media: query,
                addListener: function (callback) {
                    listeners.push(callback);
                    return this;
                },
                removeListener: function (callback) {
                    var index = listeners.indexOf(callback);
                    ~index && listeners.splice(index, 1);
                    return this;
                }
            };

            return ret;
        };
    }());
})(Zepto);
/**
 * @file 扩展转屏事件
 * @name ortchange
 * @short ortchange
 * @desc 扩展转屏事件orientation，解决原生转屏事件的兼容性问题
 * @import zepto.js, extend/matchMedia.js
 */

$(function () {
    /**
     * @name ortchange
     * @desc 扩展转屏事件orientation，解决原生转屏事件的兼容性问题
     * - ***ortchange*** : 当转屏的时候触发，兼容uc和其他不支持orientationchange的设备，利用css media query实现，解决了转屏延时及orientation事件的兼容性问题
     * $(window).on('ortchange', function () {        //当转屏的时候触发
     *     console.log('ortchange');
     * });
     */
        //扩展常用media query
    $.mediaQuery = {
        ortchange: 'screen and (width: ' + window.innerWidth + 'px)'
    };
    //通过matchMedia派生转屏事件
    $.matchMedia($.mediaQuery.ortchange).addListener(function () {
        $(window).trigger('ortchange');
    });
});
/**
 * @file 实现了通用fix方法。
 * @name Fix
 * @import zepto.js, extend/event.scrollStop.js, extend/event.ortchange.js
 */

/**
 * @name fix
 * @grammar fix(options) => self
 * @desc 固顶fix方法，对不支持position:fixed的设备上将元素position设为absolute，
 * 在每次scrollstop时根据opts参数设置当前显示的位置，类似fix效果。
 *
 * Options:
 * - ''top'' {Number}: 距离顶部的px值
 * - ''left'' {Number}: 距离左侧的px值
 * - ''bottom'' {Number}: 距离底部的px值
 * - ''right'' {Number}: 距离右侧的px值
 * @example
 * var div = $('div');
 * div.fix({top:0, left:0}); //将div固顶在左上角
 * div.fix({top:0, right:0}); //将div固顶在右上角
 * div.fix({bottom:0, left:0}); //将div固顶在左下角
 * div.fix({bottom:0, right:0}); //将div固顶在右下角
 *
 */

(function ($, undefined) {
    $.extend($.fn, {
        fix: function(opts) {
            var me = this;                      //如果一个集合中的第一元素已fix，则认为这个集合的所有元素已fix，
            if(me.attr('isFixed')) return me;   //这样在操作时就可以针对集合进行操作，不必单独绑事件去操作
            me.css(opts).css('position', 'fixed').attr('isFixed', true);
            var buff = $('<div style="position:fixed;top:10px;"></div>').appendTo('body'),
                top = buff[0].getBoundingClientRect().top,
                checkFixed = function() {
                    if(window.pageYOffset > 0) {
                        if(buff[0].getBoundingClientRect().top !== top) {
                            me.css('position', 'absolute');
                            doFixed();
                            $(window).on('scrollStop', doFixed);
                            $(window).on('ortchange', doFixed);
                        }
                        $(window).off('scrollStop', checkFixed);
                        buff.remove();
                    }
                },
                doFixed = function() {
                    me.css({
                        top: window.pageYOffset + (opts.bottom !== undefined ? window.innerHeight - me.height() - opts.bottom : (opts.top ||0)),
                        left: opts.right !== undefined ? document.body.offsetWidth - me.width() - opts.right : (opts.left || 0)
                    });
                    opts.width == '100%' && me.css('width', document.body.offsetWidth);
                };

            $(window).on('scrollStop', checkFixed);

            return me;
        }
    });
}(Zepto));
/**
 * @file 在iOS中将页面添加为桌面图标(不支持Android系统)
 * @import core/widget.js, extend/fix.js
 * @module GMU
 */
(function( gmu, $, undefined ) {
    /**
     * 在iOS中将页面添加为桌面图标(不支持Android系统)
     * @class Add2desktop
     * @constructor Html部分
     *
     * javascript部分
     * ```javascript
     * gmu.Add2desktop({icon:'../../../examples/assets/icon.png'});
     * ```
     * @param {dom | zepto | selector} [el] 用来初始化工具栏的元素
     * @param {Object} [options] 组件配置项。具体参数请查看[Options](#GMU:Toolbar:options)
     * @grammar  gmu.Add2desktop([el [,options]]) =>instance
     * @grammar  $(el).add2desktop(options) => zepto
     */
    gmu.define('Add2desktop', {
        options: {
            /**
             * @property {String} icon 产品线ICON的URL
             * @namespace options
             */
            icon: '',
            /**
             * @property {selector} [container=document.body] 组件容器
             * @namespace options
             */
            container:  '',
            /**
             * @property {String} [key='_gmu_adddesktop_key'] LocalStorage的key值
             * @namespace options
             */
            key:'_gmu_adddesktop_key',
            /**
             * @property {Boolean} [useFix=true] 是否使用fix固顶效果
             * @namespace options
             */
            useFix: true,
            /**
             * @property {Object} [position={bottom:12,left:50%}] 固顶时使用的位置参数
             * @namespace options
             */
            position: {
                bottom: 12,
                left: '50%'
            },
            /**
             * @property {Function} [beforeshow=fn}] 显示前触发的事件，调用e.preventDefault()可以阻止显示
             * @namespace options
             */
            beforeshow : function(e){
                this.key() && e.preventDefault()
            },
            /**
             * @property {Function} [afterhide=fn}] 隐藏后触发的事件，可以在这里写LocalStorage的值
             * @namespace options
             */
            afterhide : function(){
                this.key(1)
            },
            _isShow:false
        },

        _init: function() {
            var me = this;

            me.on( 'ready', function(){
                me.$el.find('.ui-add2desktop-close').on('click',function () {
                    me.hide();
                });
                me._options['useFix'] && me.$el.fix(me._options['position']);

                me.show();
            } );

            me.on( 'destroy', function(){
                me.$el.remove();
            } );
        },

        _create: function() {
            var me = this,
                $el,
                version = ($.os.version && $.os.version.substr(0, 3) > 4.1 ? 'new' :'old');

            if($.os.version && $.os.version.substr(0, 3) >= 7.0) {
                version = 'iOS7';
            }

            if( me._options.setup ) {
                var src = me.$el.children('img').attr('src');
                src && (me._options['icon'] = src);
            }
            $el = me.$el || (me.$el = $('<div></div>'));
            $el.addClass('ui-add2desktop').appendTo(me._options['container'] || (me.$el.parent().length ? '' : document.body)),

                $el.html('<img src="' + me._options['icon'] + '"/><p>先点击<span class="ui-add2desktop-icon-' + version +'"></span>，<br />再"添加到主屏幕"</p><span class="ui-add2desktop-close"><b></b></span><div class="ui-add2desktop-arrow"><b></b></div>');
        },

        /**
         * 存储/获取LocalStorage的键值
         * @method key
         * @param {String} [value] LocalStorage的键值，不传表示取值
         * @return {self} LocalStorage的值
         */
        key : function(value){
            var ls = window.localStorage;
            return value !== undefined ? ls.setItem(this._options['key'], value) : ls.getItem(this._options['key']);
        },

        /**
         * 显示add2desktop
         * @method show
         * @return {self} 返回本身。
         */

        /**
         * @event beforeshow
         * @param {Event} e gmu.Event对象
         * @description add2desktop显示前触发
         */
        show: function() {
            var me = this;

            if( !me._options['_isShow'] ) {
                if(!$.os.ios || $.browser.uc || $.browser.qq || $.browser.chrome) return me; //todo 添加iOS原生浏览器的判断
                var event = new gmu.Event('beforeshow');
                me.trigger(event);
                if(event.isDefaultPrevented()) return me;
                me.$el.css('display', 'block');
                me._options['_isShow'] = true;
            }

            return me;
        },

        /**
         * 隐藏add2desktop
         * @method hide
         * @return {self} 返回本身。
         */

        /**
         * @event afterhide
         * @param {Event} e gmu.Event对象
         * @description add2desktop显示后触发
         */
        hide: function() {
            var me = this;

            if(me._options['_isShow']) {
                me.$el.css('display', 'none');
                me._options['_isShow'] = false;
                me.trigger('afterhide');
            }

            return me;
        }

        /**
         * @event ready
         * @param {Event} e gmu.Event对象
         * @description 当组件初始化完后触发。
         */

        /**
         * @event destroy
         * @param {Event} e gmu.Event对象
         * @description 组件在销毁的时候触发
         */
    });

})( gmu, gmu.$ );
/**
 *  @file 实现了通用highlight方法。
 *  @name Highlight
 *  @desc 点击高亮效果
 *  @import zepto.js
 */
(function( $ ) {
    var $doc = $( document ),
        $el,    // 当前按下的元素
        timer;    // 考虑到滚动操作时不能高亮，所以用到了100ms延时

    // 负责移除className.
    function dismiss() {
        var cls = $el.attr( 'hl-cls' );

        clearTimeout( timer );
        $el.removeClass( cls ).removeAttr( 'hl-cls' );
        $el = null;
        $doc.off( 'touchend touchmove touchcancel', dismiss );
    }

    /**
     * @name highlight
     * @desc 禁用掉系统的高亮，当手指移动到元素上时添加指定class，手指移开时，移除该class.
     * 当不传入className是，此操作将解除事件绑定。
     *
     * 此方法支持传入selector, 此方式将用到事件代理，允许dom后加载。
     * @grammar  highlight(className, selector )   ⇒ self
     * @grammar  highlight(className )   ⇒ self
     * @grammar  highlight()   ⇒ self
     * @example var div = $('div');
     * div.highlight('div-hover');
     *
     * $('a').highlight();// 把所有a的自带的高亮效果去掉。
     */
    $.fn.highlight = function( className, selector ) {
        return this.each(function() {
            var $this = $( this );

            $this.css( '-webkit-tap-highlight-color', 'rgba(255,255,255,0)' )
                .off( 'touchstart.hl' );

            className && $this.on( 'touchstart.hl', function( e ) {
                var match;

                $el = selector ? (match = $( e.target ).closest( selector,
                    this )) && match.length && match : $this;

                // selctor可能找不到元素。
                if ( $el ) {
                    $el.attr( 'hl-cls', className );
                    timer = setTimeout( function() {
                        $el.addClass( className );
                    }, 100 );
                    $doc.on( 'touchend touchmove touchcancel', dismiss );
                }
            } );
        });
    };
})( Zepto );
/**
 * @file Button组件。
 * @module GMU
 * @import core/widget.js, extend/highlight.js
 * @importCss icons.css
 */
(function( gmu, $, undefined ) {

    /**
     * Button组件。支持icon, icon位置设置。
     *
     * [![Live Demo](qrcode:http://gmu.baidu.com/demo/widget/button/button.html)](http://gmu.baidu.com/demo/widget/button/button.html "Live Demo")
     *
     * @class Button
     * @constructor
     * html部分, 可以是以下任意dom实例化button
     * ```html
     * <a class="btn">按钮</a>
     * <span class="btn">按钮</span>
     * <button class="btn">按钮</button>
     * <input class="btn" type="button" value="按钮" />
     * <input class="btn" type="reset" value="按钮" />
     * <input class="btn" type="button" value="按钮" />
     * ```
     *
     * Javascript部分
     * ```javascript
     * $( '.btn' ).button();
     * ```
     *
     * 如果希望支持checkbox radio按钮，请查看[input插件](#GMU:Button.input)。
     * @grammar new gmu.Button( el[, options]) => instance
     * @grammar $( el ).button([ options ]) => zepto
     */
    gmu.define( 'Button', {
        options: {

            /**
             * @property {String} [label] 按钮文字。
             * @namespace options
             */

            /**
             * @property {String} [icon] 图标名称。系统提供以下图标。home, delete, plus, arrow-u, arrow-d, check, gear, grid, star, arrow-r, arrow-l, minus, refresh, forward, back, alert, info, search,
             * @namespace options
             */

            /**
             * @property {String} [iconpos] 图片位置。支持：left, right, top, bottom, notext.
             * @namespace options
             */
            iconpos: 'left'

            /**
             * @property {String} [state]
             * @description 设置初始状态。如果状态值为`disbaled`，按钮将不可点击。
             * @namespace options
             */

            /**
             * @property {String} [{$state}Text]
             * @description 设置对应状态文字，当button进入此状态时，按钮将显示对应的文字。
             * @namespace options
             */
        },

        template: {
            icon: '<span class="ui-icon ui-icon-<%= name %>"></span>',
            text: '<span class="ui-btn-text"><%= text %></span>'
        },

        _getWrap: function( $el ) {
            return $el;
        },

        _init: function(){
            var me = this;

            me.$el = me.$el === undefined ? $('<span/>').appendTo( document.body ) : me.$el;
        },

        _create: function() {
            var me = this,
                opts = me._options,
                $wrap = me.$wrap = me._getWrap( me.getEl() ),
                input = $wrap.is( 'input' ),
                $label = $wrap.find( '.ui-btn-text' ),
                $icon = $wrap.find( '.ui-icon' );

            // 处理label
            // 如果是空字符串，则表示dom中写了data-label=""
            opts.label = opts.label === undefined ? $wrap[ input ? 'val' : 'text' ]() : opts.label;
            input || opts.label === undefined || !$label.length && ($label = $( me.tpl2html( 'text', {
                text: opts.label
            } ) )).appendTo( $wrap.empty() );
            me.$label = $label.length && $label;
            opts.resetText = opts.resetText || opts.label;

            // 如果传入了icon而dom中没有，则创建
            input || opts.icon && !$icon.length && ($icon = $( me.tpl2html( 'icon', {
                name: opts.icon
            } ) )).appendTo( $wrap );
            me.$icon = $icon.length && $icon;

            $wrap.addClass( 'ui-btn ' + (opts.label && opts.icon ?
                'ui-btn-icon-' + opts.iconpos : opts.label ?
                'ui-btn-text-only' : 'ui-btn-icon-only') );

            opts.state && setTimeout( function(){
                me.state( opts.state );
            }, 0 );
        },

        /**
         * 设置或者获取按钮状态值。
         *
         * 如果传入的state为"disabled", 此按钮将变成不可点击状态。
         *
         * ```javascript
         * // 初始化的时候可以给diabled状态设置Text
         * var btn = $( '#btn' ).button({
         *     disabledText: '不可点'
         * });
         *
         * // 按钮将变成不可点击状态。同时文字也变成了”不可点“
         * btn.button( 'state', 'disabled' );
         *
         * // 还原按钮状态
         * // 文字也还原。
         * btn.button( 'state', 'reset' );
         *
         * ```
         * @method state
         * @grammar state( value ) => self
         * @grammar state() => String
         * @param  {String} [state] 状态值。
         * @return {String} 当没有传入state值时，此方法行为为getter, 返回当前state值。
         * @return {self} 当传入了state值时，此方法行为为setter, 返回实例本身，方便链式调用。
         */
        state: function( state ) {

            // getter
            if ( state === undefined ) {
                return this._state;
            }

            // setter
            var me = this,
                $wrap = me.$wrap,
                input = $wrap.is( 'input' ),
                text = me._options[ state + 'Text' ];

            me.$wrap.removeClass( 'ui-state-' + me._state )
                .addClass( 'ui-state-' + state );

            text === undefined || (input ? $wrap : me.$label)[ input ?
                'val' : 'text' ]( text );

            me._state !== state && me.trigger( 'statechange', state, me._state );
            me._state = state;
            return me;
        },

        /**
         * 切换按钮选中状态
         * @method toggle
         * @grammar toggle() => self
         * @example
         * var btn = $( '#btn' );
         *
         * btn.on( 'click', function() {
         *     btn.button( 'toggle' );
         * } );
         */
        toggle: function() {
            this.state( this._state === 'active' ? 'reset' : 'active' );
            return this;
        }

        /**
         * @event ready
         * @param {Event} e gmu.Event对象
         * @description 当组件初始化完后触发。
         */

        /**
         * @event statechange
         * @param {Event} e gmu.Event对象
         * @param {String} state 当前state值
         * @param {String} preState 前一次state的值
         * @description 当组件状态变化时触发。
         */

        /**
         * @event destroy
         * @param {Event} e gmu.Event对象
         * @description 当组件被销毁的时候触发。
         */
    } );

    // dom ready
    $(function() {

        // 按下态。
        $( document.body ).highlight( 'ui-state-hover', '.ui-btn:not(.ui-state-disabled)' );
    });
})( gmu, gmu.$ );
// Zepto.js
// (c) 2010-2014 Thomas Fuchs
// Zepto.js may be freely distributed under the MIT license.

;(function($){
    var touch = {},
        touchTimeout, tapTimeout, swipeTimeout, longTapTimeout,
        longTapDelay = 750,
        gesture

    function swipeDirection(x1, x2, y1, y2) {
        return Math.abs(x1 - x2) >=
            Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
    }

    function longTap() {
        longTapTimeout = null
        if (touch.last) {
            touch.el.trigger('longTap')
            touch = {}
        }
    }

    function cancelLongTap() {
        if (longTapTimeout) clearTimeout(longTapTimeout)
        longTapTimeout = null
    }

    function cancelAll() {
        if (touchTimeout) clearTimeout(touchTimeout)
        if (tapTimeout) clearTimeout(tapTimeout)
        if (swipeTimeout) clearTimeout(swipeTimeout)
        if (longTapTimeout) clearTimeout(longTapTimeout)
        touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null
        touch = {}
    }

    function isPrimaryTouch(event){
        return (event.pointerType == 'touch' ||
            event.pointerType == event.MSPOINTER_TYPE_TOUCH)
            && event.isPrimary
    }

    function isPointerEventType(e, type){
        return (e.type == 'pointer'+type ||
            e.type.toLowerCase() == 'mspointer'+type)
    }

    $(document).ready(function(){
        var now, delta, deltaX = 0, deltaY = 0, firstTouch, _isPointerType

        if ('MSGesture' in window) {
            gesture = new MSGesture()
            gesture.target = document.body
        }

        $(document)
            .bind('MSGestureEnd', function(e){
                var swipeDirectionFromVelocity =
                        e.velocityX > 1 ? 'Right' : e.velocityX < -1 ? 'Left' : e.velocityY > 1 ? 'Down' : e.velocityY < -1 ? 'Up' : null;
                if (swipeDirectionFromVelocity) {
                    touch.el.trigger('swipe')
                    touch.el.trigger('swipe'+ swipeDirectionFromVelocity)
                }
            })
            .on('touchstart MSPointerDown pointerdown', function(e){
                if((_isPointerType = isPointerEventType(e, 'down')) &&
                    !isPrimaryTouch(e)) return
                firstTouch = _isPointerType ? e : e.touches[0]
                if (e.touches && e.touches.length === 1 && touch.x2) {
                    // Clear out touch movement data if we have it sticking around
                    // This can occur if touchcancel doesn't fire due to preventDefault, etc.
                    touch.x2 = undefined
                    touch.y2 = undefined
                }
                now = Date.now()
                delta = now - (touch.last || now)
                touch.el = $('tagName' in firstTouch.target ?
                    firstTouch.target : firstTouch.target.parentNode)
                touchTimeout && clearTimeout(touchTimeout)
                touch.x1 = firstTouch.pageX
                touch.y1 = firstTouch.pageY
                if (delta > 0 && delta <= 250) touch.isDoubleTap = true
                touch.last = now
                longTapTimeout = setTimeout(longTap, longTapDelay)
                // adds the current touch contact for IE gesture recognition
                if (gesture && _isPointerType) gesture.addPointer(e.pointerId);
            })
            .on('touchmove MSPointerMove pointermove', function(e){
                if((_isPointerType = isPointerEventType(e, 'move')) &&
                    !isPrimaryTouch(e)) return
                firstTouch = _isPointerType ? e : e.touches[0]
                cancelLongTap()
                touch.x2 = firstTouch.pageX
                touch.y2 = firstTouch.pageY

                deltaX += Math.abs(touch.x1 - touch.x2)
                deltaY += Math.abs(touch.y1 - touch.y2)
            })
            .on('touchend MSPointerUp pointerup', function(e){
                if((_isPointerType = isPointerEventType(e, 'up')) &&
                    !isPrimaryTouch(e)) return
                cancelLongTap()

                // swipe
                if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
                    (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))

                    swipeTimeout = setTimeout(function() {
                        touch.el.trigger('swipe')
                        touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
                        touch = {}
                    }, 0)

                // normal tap
                else if ('last' in touch)
                // don't fire tap when delta position changed by more than 30 pixels,
                // for instance when moving to a point and back to origin
                    if (deltaX < 30 && deltaY < 30) {
                        // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
                        // ('tap' fires before 'scroll')
                        tapTimeout = setTimeout(function() {

                            // trigger universal 'tap' with the option to cancelTouch()
                            // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
                            var event = $.Event('tap')
                            event.cancelTouch = cancelAll
                            touch.el.trigger(event)

                            // trigger double tap immediately
                            if (touch.isDoubleTap) {
                                if (touch.el) touch.el.trigger('doubleTap')
                                touch = {}
                            }

                            // trigger single tap after 250ms of inactivity
                            else {
                                touchTimeout = setTimeout(function(){
                                    touchTimeout = null
                                    if (touch.el) touch.el.trigger('singleTap')
                                    touch = {}
                                }, 250)
                            }
                        }, 0)
                    } else {
                        touch = {}
                    }
                deltaX = deltaY = 0

            })
            // when the browser window loses focus,
            // for example when a modal dialog is shown,
            // cancel all ongoing events
            .on('touchcancel MSPointerCancel pointercancel', cancelAll)

        // scrolling the window indicates intention of the user
        // to scroll, not tap or swipe, so cancel all ongoing events
        $(window).on('scroll', cancelAll)
    })

    ;['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown',
        'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(eventName){
            $.fn[eventName] = function(callback){ return this.on(eventName, callback) }
        })
})(Zepto);

