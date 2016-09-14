// abc.js
// https://github.com/marpple/abc-functional-javascript
// (c) 2016 Marpple
// abcjs may be freely distributed under the MIT license.

!function(G) {
    var _ = respect_underscore();

    if (typeof window != 'object') var window = G;

    F.A = window.A = A; // thisless apply
    F.B = window.B = B; // thisless bind, like underscore partial
    F.C = window.C = C; // thisless call
    F.D = window.D = D; // Data
    F.E = window.E = _.extend;
    F.F = window.F = F; // find function
    F.H = window.H = H; // HTML Template Engine
    F.G = window.G = G; // window or global
    F.I = window.I = I; // _.identity
    F.J = window.J = J; // _.always
    F.M = window.M = M; // for method
    F.N = window.N; // _.always(null),
    F.P = window.P = P; // parameters, arguments
    F.R = window.R = R; // like multiple return in Go Lang. return x, y; => return R(x, y)
    F.S = window.S = S; // String Template Engine
    F.TODO = window.TODO;
    F.U = window.U = U; // _.noop, return undefined
    F.V = window.V = V; // get value by string
    F.X = window.X = new Object();

    B.P = B(I, base_bp);

    F.P0 = window.P0 = I;
    F.P1 = window.P1 = B.P(1);
    F.P2 = window.P2 = B.P(2);
    F.P3 = window.P3 = B.P(3);
    F.P4 = window.P4 = B.P(4);

    function A(args, func) { return C.apply(null, _.toArray(args).concat([func])); }

    function B() {
        var args = _.toArray(arguments);
        if (!_.isArray(args[args.length-1])) args[args.length-1] = [args[args.length-1]];
        var fns = args.pop();
        return function() {
            var args3 = _.clone(args);
            for (var i = 0, length = arguments.length; i < length; i++) {
                var arg2 = arguments[i];
                var idx = args3.indexOf(X);
                args3[idx == -1 ? args3.length : idx] = arg2;
            }
            return A(args3, fns);
        };
    }

    function base_bp(next, idx) {
        if (arguments.length == 2) return function () { return arguments[idx] };
        var idxs = _.rest(arguments);
        return function() {
            return next(C.map(idxs, arguments, function(v, i, l, args) { return args[v]; }));
        };
    }

    B.PR = B(TO_R, base_bp);

    B.V = function(key) { return B(X, key, V); };

    B.M = function() { return B.apply(void 0, [X].concat(_.toArray(arguments)).concat(M)); };

    B.each = function(iter) {
        return B(
            P4, // body
            U, // end_q
            void 0, // end
            P1,
            iter, // iter_or_predi
            base_loop_fn_base_args,
            base_loop_fn);
    };

    B.map = function(iter) {
        return B(
            function(result, list, keys, i, res) {  // body
                if (i) result.push(res);
                return res;
            },
            U, // end_q
            void 0, // end
            I, // complete
            iter,       // iter_or_predi
            base_loop_fn_base_args,
            base_loop_fn);
    };

    B.reduce = function(iter) {
        return B(
            function(result, list, keys, i, res, tmp, args) {     // body
                return i == 0 ? args[0] : res;
            },
            U, // end_q
            void 0, // end
            P2, // complete
            iter,   // iter_or_predi
            function(list, keys, i, res) { // params
                var key = keys ? keys[i] : i;
                return [res, list[key], key, list];
            },
            base_loop_fn);
    };

    B.filter = function(iter) {
        return B(
            function(result, list, keys, i, res) {  // body
                var key = keys ? keys[i-1] : i-1;
                if (res) result.push(list[key]);
                return res;
            },
            U, // end_q
            void 0, // end
            I, // complete
            iter,   // iter_or_predi
            base_loop_fn_base_args,
            base_loop_fn);
    };

    B.reject = function(iter) {
        return B(
            function(result, list, keys, i, res) {   // body
                var key = keys ? keys[i-1] : i-1;
                if (res == false) result.push(list[key]);
                return res;
            },
            U, // end_q
            void 0, // end
            I, // complete
            iter,
            base_loop_fn_base_args,
            base_loop_fn);
    };

    B.find = function(iter) {
        return B(
            P4,
            I, // end_q
            function(list, keys, i) {
                return list[keys ? keys[i-1] : i-1];
            }, // end
            U, // complete
            iter,   // iter_or_predi
            base_loop_fn_base_args,
            base_loop_fn);
    };

    B.some = function(iter) {
        return B(
            P4,
            I, // end_q
            J(true), // end
            J(false), // complete
            iter,
            base_loop_fn_base_args,
            base_loop_fn);
    };

    B.every = function(iter) {
        return B(
            function(result, list, keys, i, res) { return i == 0 ? true : res; },   // body
            function(v) { return !v }, // end_q
            J(false), // end
            J(true), // complete
            iter,
            base_loop_fn_base_args,
            base_loop_fn);
    };


    B.uniq = function(iter) {
        iter = iter || I;

        if (_.isString(iter)) iter = (function(key) { return function(val) { return val[key]; } })(iter);
        return B(
            function(result, list, keys, i, res, tmp) { // body
                if (i == 0) return;
                if (tmp.indexOf(res) == -1) {
                    tmp.push(res);
                    result.push(list[i-1]);
                }
            },
            U,   // end_q
            void 0,   // end
            I, // complete
            iter,
            base_loop_fn_base_args,
            base_loop_fn);
    };

    var spread_args = B.reduce(function(memo, arg) { return memo.concat(IS_R(arg) ? arg : [arg]); });
    var arg_add_arr = function(list) { return R(list, []); };

    var all_map = B.map(function(val_fn, key, list, args) { return A(args, val_fn); });
    B.all = function() {
        var fns = _.toArray(arguments);
        return function() {
            return A([fns, _.toArray(arguments)], [all_map, arg_add_arr, spread_args, TO_R]);
        };
    };

    var div_map = B.map(function(val, key, list, funcs) { return C(val, funcs[key] || I); });
    B.div = function() {
        var fns = _.toArray(arguments);
        return function() {
            var args = _.toArray(arguments);
            while(args.length < fns.length) args.push(void 0);
            return A([args, fns], [div_map, arg_add_arr, spread_args, TO_R]);
        };
    };

    B.branch = function() { // fork
        var fns = arguments;
        return JCB(function(res, cb) {
            cb(res);
            C(res, fns);
        });
    };

    function base_loop_fn_base_args(list, keys, i) {
        var key = keys ? keys[i] : i;
        return [list[key], key, list];
    }

    function maybe_promise(res) { return _.isObject(res) && res.then && _.isFunction(res.then); }

    function base_loop_fn(body, end_q, end, complete, iter_or_predi, params) {
        var args = _.rest(arguments, 6);
        var list = args.shift();
        if (!iter_or_predi) iter_or_predi = args.pop();
        var keys = _.isArray(list) ? null : _.keys(list);
        var length = (keys || list).length;
        var i = 0;
        var result = [];
        var tmp = [];

        return (function f(res) {
            res = body(result, list, keys, i, res, tmp, args);

            if (end_q(res)) return end(list, keys, i);
            if (i == length) return complete(result, list, res);

            return A(params(list, keys, i++, res).concat(args), [iter_or_predi, function() {
                return f(arguments.length == 1 ? arguments[0] : TO_R(arguments));
            }]);
        })();
    }

    F.CB = window.CB = B([P, B.map([I, B(X, { _A_is_cb: true }, E)])]);
    F.JCB = window.JCB = B(X, { _A_just_cb: true }, E);

    function IS_R(arg) { return _.isArray(arg) && arg._A_is_returns; }

    function C() {
        var args = _.toArray(arguments);
        if (!_.isArray(args[args.length-1])) args[args.length-1] = [args[args.length-1]];
        var fns = _.flatten(args.pop());
        if (args.length == 1 && IS_R(args[0])) args = args[0];

        var then_cb = null, then_obj_returned = false;
        var then_obj = { then: function(cb) { then_cb = cb; } };

        var i = 0;
        return (function c(res) {
            if (maybe_promise(res)) {
                then_obj_returned = true;
                res.then(function(r) { c(r) });
                return then_obj;
            }

            if (i == fns.length) {
                if (!then_obj_returned) return res;
                if (!IS_R(res)) res = [res];
                // 혹시 모두 동기로 끝나버려 then_cb가 아직 안들어온 경우 안전하게 한번 기다려주고
                return then_cb ? then_cb.apply(void 0, res) : setTimeout(function() { then_cb && then_cb.apply(void 0, res); });
            }

            if (!IS_R(res)) res = [res];

            // 동기 경우
            if (!fns[i]._A_is_cb && !fns[i]._A_just_cb) return c(fns[i++].apply(void 0, res));

            // 동기이고 그냥 callback, 혹시 생길 수 있는 비동기를 미리 잡기 위해서도 사용
            if (!fns[i]._A_is_cb) return fns[i++].apply(void 0, res.concat(function() { return c(TO_R(arguments)); }));

            // 비동기일 경우
            then_obj_returned = true;
            fns[i++].apply(void 0, res.concat(function() { return c(TO_R(arguments)); }));
            return then_obj;
        })(TO_R(args));
    }

    C.each = B.each(null);
    C.map = B.map(null);
    C.reduce = B.reduce(null);
    C.filter = B.filter(null);
    C.reject = B.reject(null);
    C.find = B.find(null);
    C.some = B.some(null);
    C.every = B.every(null);
    C.uniq = B.uniq(null);
    C.all = F("TODO");
    C.div = F("TODO");

    function D() {}
    D.to_array = function(obj) { return _.toArray(arguments.length > 1 ? arguments : obj); };

    function F(nodes) {
        var f = V(G, nodes);
        var err = Error('warning: ' + nodes + ' is not defined').stack;
        return f || setTimeout(function() {
                if (f = f || V(G, nodes)) return;
                console.error(err);
            }) && function() { return A(arguments, f || (f = V(G, nodes))); }
    }

    /* H start */
    var TAB_SIZE = 4;
    var TAB = "( {"+TAB_SIZE+"}|\\t)"; // "( {4}|\\t)"
    var TABS = TAB + "+";
    var number_of_tab = function(a) { return a.match(new RegExp("^"+TAB+"+"))[0].length/TAB_SIZE };

    function H(var_names/*, source...*/) {
        return s.apply(null, [H, 'H', convert_to_html].concat(_.toArray(arguments)));
    }

    H.each = function(var_names/*, source...*/) {
        return s_each.apply(null, [H].concat(_.toArray(arguments)));
    };

    H._A_func_storage = {};

    function s(func, obj_name, option, var_names/*, source...*/) {      // used by H and S
        var source = C.map(_.rest(arguments, 4), function(str_or_func) {
            if (_.isString(str_or_func)) return str_or_func;

            var key = _.uniqueId("_A_func_storage");
            func._A_func_storage[key] = str_or_func;
            return obj_name + "._A_func_storage." + key;
        }).join("");

        return function() {
            var data = var_names ? _.object(var_names.match(/\w+/g), _.toArray(arguments)) : void 0;
            return C(source, data, [remove_comment, unescaped_exec, option, insert_datas1, insert_datas2, I]);
        };
    }

    function s_each(func, var_names/*, source...*/) {     // used by H.each and S.each
        var map = B.map(func.apply(null, _.rest(arguments)));
        return function(ary /*, args...*/) {
            return A([ary].concat(_.rest(arguments)), [map, function(res) { return res.join(""); }]);
        };
    }

    function remove_comment(source, data) {
        return R(source.replace(/\/\*(.*?)\*\//g, "").replace(
            new RegExp("\/\/"+TABS+".*?(?=((\/\/)?"+TABS+"))|\/\/"+TABS+".*", "g"), ""), data);
    }

    var unescaped_exec = B(/!\{(.*?)\}!/, I, s_exec); //!{}!
    var insert_datas1 = B(/\{\{\{(.*?)\}\}\}/, I, s_exec); // {{{}}}
    var insert_datas2 = B(/\{\{(.*?)\}\}/, _.escape, s_exec); // {{}}

    function s_exec(re, wrap, source, data) {
        return !source.match(re) ? R(source, data) :
            C(data, [new Function("data", "with(data||{}) { return " + RegExp.$1 + "; }"),
                wrap, return_check,
                function(res) {
                    return s_exec(re, wrap, source.replace(re, res), data);
                }]);
    }

    function convert_to_html(source, data) {
        var tag_stack = [];
        var ary = source.match(new RegExp(TABS+"\\S.*?(?="+TABS+"\\S)|"+TABS+"\\S.*", "g"));
        var base_tab =  number_of_tab(ary[0]);
        ary[ary.length-1] = ary[ary.length-1].replace(new RegExp(TAB+"{"+base_tab+"}$"), "");

        var is_paragraph = 0;
        for (var i = 0; i < ary.length; i++) {
            while (number_of_tab(ary[i])-base_tab < tag_stack.length) { //이전 태그 닫기
                is_paragraph = 0;
                if (tag_stack.length == 0) break;
                ary[i-1] += end_tag(tag_stack.pop());
            }

            var tmp = ary[i];

            if (!is_paragraph) {
                ary[i] = line(ary[i], tag_stack);
                if (tmp.match(new RegExp("^("+TABS+")(\\[.*?\\]|\\{.*?\\}|\\S)+\\.(?!\\S)"))) is_paragraph = number_of_tab(RegExp.$1) + 1;
                continue;
            }

            ary[i] = ary[i].replace(new RegExp("("+TAB+"{"+is_paragraph+"})", "g"), "\n");
            if (ary[i] !== (ary[i] = ary[i].replace(new RegExp("\\n("+TABS+"[\\s\\S]*)"), "\n"))) ary = push_in(ary, i+1, RegExp.$1);
        }

        while(tag_stack.length) ary[ary.length-1] += end_tag(tag_stack.pop()); // 마지막 태그

        return R(ary.join(""), data);
    }

    function line(source, tag_stack) {
        source = source.replace(new RegExp("^"+TABS+"\\|"), "\n").replace(/^ */, "");
        return source.match(/^[\[.#\w\-]/) ? source.replace(/^(\[.*\]|\{.*?\}|\S)+ ?/, function(str) {
            return start_tag(str, tag_stack);
        }) : source;
    }

    function push_in(ary, index, data) {
        var rest_ary = ary.splice(index);
        ary.push(data);
        return ary.concat(rest_ary);
    }

    function start_tag(str, tag_stack, attrs, name, cls) {
        attrs = '';
        name = str.match(/^\w+/);

        // name
        name = (!name || name == 'd') ? 'div' : name == 'sp' ? 'span' : name;
        if (name != 'input') tag_stack.push(name);

        // attrs
        str = str.replace(/\[(.*)\]/, function(match, inner) { return (attrs += ' ' + inner) && ''; });

        // attrs = class + attrs
        (cls = C.map(str.match(/\.(\{\{\{.*?\}\}\}|\{\{.*?\}\}|[\w\-]+)/g), function(v) { return v.slice(1); }).join(' '))
        && attrs == (attrs = attrs.replace(/class\s*=\s*((\").*?\"|(\{.*?\}|\S)+)/,
            function(match, tmp, q) { return ' class=' + '"' + cls + ' ' + (q ? tmp.slice(1,-1) : tmp)  + '"'; }))
        && (attrs = ' class="' + cls + '"' + attrs);

        // attrs = id + attrs
        attrs = [''].concat(C.map(str.match(/#(\{\{\{.*?\}\}\}|\{\{.*?\}\}|[\w\-]+)/g), function(v) { return v.slice(1); })).join(' id=') + attrs;

        return '<' + name + attrs + ' >'; // 띄어쓰기 <a href=www.marpple.com/> 를 위해
    }

    function end_tag(tag) { return '</'+tag+'>'; }

    function return_check(val) {
        return (val == null || val == void 0) ? '' : val;
    }
    /* H end */

    function I(v) { return v; }

    function IF(predicate, fn) {
        var store = [fn ? [predicate, fn] : [I, predicate]];
        return _.extend(IF, {
            ELSEIF: function (predicate, fn) {
                return store.push(fn ? [predicate, fn] : [I, predicate]) && IF;
            },
            ELSE: function (fn) { return store.push([J(true), fn]) && IF; } });

        function IF() {
            var args = arguments;
            return C(store, args, [
                B.find(function(fnset, i, l, args) { return A(args, fnset[0]); }),
                function(fnset) { return fnset ? A(args, fnset[1]) : void 0; }
            ]);
        }
    }
    F.IF = window.IF = IF;

    function J(v) { return function() { return v; } }

    function M(obj, method) {
        return obj[method].apply(obj, _.rest(arguments, 2));
    }

    F.N = window.N = J(null);

    function P() { return arguments; }

    function R(arg) {
        if (arguments.length <= 1) return arg;
        if (_.isArray(arg) && arg._A_is_returns) return arg;
        return _.extend(_.toArray(arguments), { _A_is_returns: true });
    }

    function TO_R(arg) {
        if (_.isArray(arg) && arg._A_is_returns) return arg;
        return _.extend(_.values(arg), { _A_is_returns: true });
    }
    F.TO_R = window.TO_R = TO_R;

    function S(var_names/*, source...*/) {
        return s.apply(null, [S, 'S', function(s, d) { return R(s, d); }].concat(_.toArray(arguments)));
    }

    S.each = function(var_names/*, source...*/) {
        return s_each.apply(null, [S].concat(_.toArray(arguments)));
    };

    S._A_func_storage = {};

    F.TO = window.TO = {};

    F.TODO = window.TODO = J("TODO");

    function U() {}

    function V(obj, key) {
        return (function v(obj, idx, keys) {
            return (obj = obj[keys[idx]]) ? keys.length-1 == idx ? obj : v(obj, idx+1, keys) : void 0;
        })(obj, 0, key.split('.'));
    }
}(typeof global == 'object' && global.global == global && (global.G = global) || window);

// Underscore.js 1.8.
// http://underscorejs.org
// (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
// Underscore may be freely distributed under the MIT license.
function respect_underscore() {
    var _ = {};
    var ArrayProto = Array.prototype, ObjProto = Object.prototype;
    var slice = ArrayProto.slice, toString = ObjProto.toString, hasOwnProperty = ObjProto.hasOwnProperty;
    var nativeIsArray = Array.isArray, nativeKeys = Object.keys;

    var optimizeCb = function(func, context, argCount) {
        if (context === void 0) return func;
        switch (argCount == null ? 3 : argCount) {
            case 1: return function(value) {
                return func.call(context, value);
            };
            case 2: return function(value, other) {
                return func.call(context, value, other);
            };
            case 3: return function(value, index, collection) {
                return func.call(context, value, index, collection);
            };
            case 4: return function(accumulator, value, index, collection) {
                return func.call(context, accumulator, value, index, collection);
            };
        }
        return function() {
            return func.apply(context, arguments);
        };
    };

    var cb = function(value, context, argCount) {
        if (value == null) return I;
        if (_.isFunction(value)) return optimizeCb(value, context, argCount);
        if (_.isObject(value)) return _.matcher(value);
        return B.V(value);
    };

    // An internal function for creating assigner functions.
    var createAssigner = function(keysFunc, undefinedOnly) {
        return function(obj) {
            var length = arguments.length;
            if (length < 2 || obj == null) return obj;
            for (var index = 1; index < length; index++) {
                var source = arguments[index],
                    keys = keysFunc(source),
                    l = keys.length;
                for (var i = 0; i < l; i++) {
                    var key = keys[i];
                    if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
                }
            }
            return obj;
        };
    };

    _.property = function(key) { return function(obj) { return obj == null ? void 0 : obj[key]; }; };

    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    var getLength = function(obj) { return obj.length };
    var isArrayLike = function(collection) {
        var length = getLength(collection);
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };

    _.contains = function(obj, item, fromIndex, guard) {
        if (!isArrayLike(obj)) obj = _.values(obj);
        if (typeof fromIndex != 'number' || guard) fromIndex = 0;
        return _.indexOf(obj, item, fromIndex) >= 0;
    };

    _.toArray = function(obj) {
        if (!obj) return [];
        if (_.isArray(obj)) return slice.call(obj);
        return _.values(obj);
    };

    _.rest = function(array, n, guard) {
        return slice.call(array, n == null || guard ? 1 : n);
    };

    var flatten = function(input, shallow, strict, startIndex) {
        var output = [], idx = 0;
        for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
            var value = input[i];
            if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
                if (!shallow) value = flatten(value, shallow, strict);
                var j = 0, len = value.length;
                output.length += len;
                while (j < len) output[idx++] = value[j++];
            } else if (!strict) output[idx++] = value;
        }
        return output;
    };

    _.flatten = function(array, shallow) { return flatten(array, shallow, false); };

    _.object = function(list, values) {
        var result = {};
        for (var i = 0, length = getLength(list); i < length; i++) {
            if (values) result[list[i]] = values[i];
            else result[list[i][0]] = list[i][1];
        }
        return result;
    };

    _.findIndex = function(array, predicate, context) {
        for (var i = 0, predicate = cb(predicate, context), length = getLength(array); i >= 0 && i < length; i += 1)
            if (predicate(array[i], i, array)) return i;
        return -1;
    };

    _.indexOf = (function (dir, predicateFind, sortedIndex) {
        return function(array, item, idx) {
            var i = 0, length = getLength(array);
            if (typeof idx == 'number') {
                if (dir > 0) i = idx >= 0 ? idx : Math.max(idx + length, i);
                else length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
            } else if (sortedIndex && idx && length) {
                idx = sortedIndex(array, item);
                return array[idx] === item ? idx : -1;
            }
            if (item !== item) {
                idx = predicateFind(slice.call(array, i, length), _.isNaN);
                return idx >= 0 ? idx + i : -1;
            }
            for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) if (array[idx] === item) return idx;
            return -1;
        };
    })(1, _.findIndex, _.sortedIndex);

    var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
    var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
        'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

    function collectNonEnumProps(obj, keys) {
        var nonEnumIdx = nonEnumerableProps.length;
        var constructor = obj.constructor;
        var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

        // Constructor is a special case.
        var prop = 'constructor';
        if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

        while (nonEnumIdx--) {
            prop = nonEnumerableProps[nonEnumIdx];
            if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
                keys.push(prop);
            }
        }
    }

    _.keys = function(obj) {
        if (!_.isObject(obj)) return [];
        if (nativeKeys) return nativeKeys(obj);
        var keys = [];
        for (var key in obj) if (_.has(obj, key)) keys.push(key);
        // Ahem, IE < 9.
        if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
    };

    _.values = function(obj) {
        var keys = _.keys(obj), length = keys.length, values = Array(length);
        for (var i = 0; i < length; i++) values[i] = obj[keys[i]];
        return values;
    };

    _.extend = createAssigner(function(obj) {
        if (!_.isObject(obj)) return [];
        var keys = [];
        for (var key in obj) keys.push(key);
        // Ahem, IE < 9.
        if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
    });

    _.clone = function(obj) {
        if (!_.isObject(obj)) return obj;
        return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
    };

    _.isArray = nativeIsArray || function(obj) { return toString.call(obj) === '[object Array]'; };

    _.isObject = function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    var fn_names = ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'];
    for (var i = 0; i < fn_names.length; i++)
        (function(name) { _['is' + name] = function(obj) { return toString.call(obj) === '[object ' + name + ']'; }; })(fn_names[i]);

    if (!_.isArguments(arguments)) _.isArguments = function(obj) { return _.has(obj, 'callee'); };

    if (typeof /./ != 'function' && typeof Int8Array != 'object')
        _.isFunction = function(obj) { return typeof obj == 'function' || false; };

    _.has = function(obj, key) { return obj != null && hasOwnProperty.call(obj, key); };

    _.escape = (function(map) {
        var escaper = function(match) { return map[match]; };
        var source = '(?:' + _.keys(map).join('|') + ')';
        var testRegexp = RegExp(source);
        var replaceRegexp = RegExp(source, 'g');
        return function(string) {
            string = string == null ? '' : '' + string;
            return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
        };
    })({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '`': '&#x60;' });

    var idCounter = 0;
    _.uniqueId = function(prefix) {
        var id = ++idCounter + '';
        return prefix ? prefix + id : id;
    };

    return _;
}
