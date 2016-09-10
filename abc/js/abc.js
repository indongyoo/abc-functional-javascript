!function(G) {
    window.A = A; // thisless apply
    window.B = B; // thisless bind, like underscore partial
    window.C = C; // thisless call

    window.E = _.extend;
    window.F = F; // function
    window.H = H;
    window.G = G;
    window.I = I; // I
    window.J = B(I, B);// always
    window.M = M;
    window.N;
    window.P = P;
    window.R = R;
    window.S = S;
    window.TODO;
    window.U = U; // U
    window.V = V;
    window.X = new Object();


    window.CB = B(X, { _A_is_cb: true }, E);
    B.P = B(I, base_bp);
    P[0] = I;
    P[1] = B.P(1);
    P[2] = B.P(2);
    P[3] = B.P(3);
    P[4] = B.P(4);

    var JCB = B(X, { _A_just_cb: true }, E);


    function A(args, func) { return C.apply(null, _.toArray(args).concat([func])); }


    function B() {
        var args = _.toArray(arguments);
        if (!_.isArray(_.last(args))) args[args.length-1] = [args[args.length-1]];
        var fns = args.pop();
        return function() {
            var args3 = _.clone(args);
            _.each(arguments, function(arg2) {
                var idx = _.findIndex(args3, function(arg3) { return arg3 === X; });
                args3[idx == -1 ? args3.length : idx] = arg2;
            });
            return A(args3, fns);
        };
    }

    function base_bp(next, idx) {
        if (arguments.length == 2) return function () { return arguments[idx] };
        var idxs = _.rest(arguments);
        return next(function() {
            return C.map(idxs, arguments, function(v, i, l, args) { return args[i]; });
        });
    }

    B.PR = B(R, base_bp);

    B.V = function(key) { return B(X, key, V); };

    B.M = function() {
        return B.apply(undefined, [X].concat(_.toArray(arguments)).concat(M));
    };

    B.each = function(iter) {
        return B(
            P[4], // body
            U, // naganya
            undefined, // naga
            P[1],
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
            U, // naganya
            undefined, // naga
            I, // footer
            iter,       // iter_or_predi
            base_loop_fn_base_args,
                base_loop_fn);
    };

    B.reduce = function(iter) {
        return B(
            function(result, list, keys, i, res, tmp, args) {     // body
                return i == 0 ? args[0] : res;
            },
            U, // naganya
            undefined, // naga
            P[2], // footer
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
            U, // naganya
            undefined, // naga
            I, // footer
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
            U, // naganya
            undefined, // naga
            I, // footer
            iter,
            base_loop_fn_base_args,
                base_loop_fn);
    };

    B.find = function(iter) {
        return B(
            P[4],
            I, // naganya
            function(list, keys, i) {
                return list[keys ? keys[i-1] : i-1];
            }, // naga
            U, // footer
            iter,   // iter_or_predi
            base_loop_fn_base_args,
                base_loop_fn);
    };

    B.some = function(iter) {
        return B(
            P[4],
            I, // naganya
            J(true), // naga
            J(false), // footer
            iter,
            base_loop_fn_base_args,
                base_loop_fn);
    };

    B.every = function(iter) {
        return B(
            function(result, list, keys, i, res) { return i == 0 ? true : res; },   // body
            _.negate(I), // naganya
            J(false), // naga
            J(true), // footer
            iter,
            base_loop_fn_base_args,
                base_loop_fn);
    };

    B.uniq = function(iter) {
        iter = iter || I;
        if (_.isString(iter)) iter = _.partial(function(key, list) { return list[key]; }, iter);
        return B(
            function(result, list, keys, i, res, tmp) { // body
                if (i == 0) return;
                if (!_.contains(tmp, res)) {
                    tmp.push(res);
                    result.push(list[i-1]);
                }
            },
            U,   // naganya
            undefined,   // naga
            I, // footer
            iter,
            base_loop_fn_base_args,
                base_loop_fn);
    };

    var _all_map = B.map(function(val_fn, key, list, args) {
        return A(args, val_fn);
    });

    B.all = function() {
        var funcs = _.toArray(arguments);

        return function() {
            var args = _.toArray(arguments);
            return A([funcs, args], _all_map);
        };
    };

    var _div_map = B.map(function(val, key, list, funcs) {
        return C(val, funcs[key] || I);
    });

    B.div = function() {
        var funcs = _.toArray(arguments);

        return function() {
            var args = _.toArray(arguments);
            //args.length = Math.max(funcs.length, args.length); // 왜 undefined로 안채워지지!?? - 밖에서 테스트할때만 undefined 채워짐. 왜 다르지?
            if (args.length < funcs.length) while(args.length < funcs.length) args.push(undefined);
            return A([args, funcs], _div_map);
        };
    };

    B.branch = function() { // fork
        var fns = arguments;
        return JCB(function(res, cb) {
            cb(res);
            C(res, fns);
        });
    };

    B.spread = function(func) {
        return B(X, func, A);
    };



    function base_loop_fn_base_args(list, keys, i) {
        var key = keys ? keys[i] : i
        return [list[key], key, list];
    }

    function maybe_promise(res) {
        return _.isObject(res) && res.then && _.isFunction(res.then);
    }

    function base_loop_fn(body, naganya, naga, footer, iter_or_predi, params) {
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

            if (naganya(res)) {
                var r = naga(list, keys, i);
                result, list, keys, i, tmp, args = null;
                return r;
            }

            if (i == length) {
                var r = footer(result, list, res);
                result, list, keys, i, tmp, args = null;
                return r;
            }

            return A(params(list, keys, i++, res).concat(args), [iter_or_predi, f]);
        })();
    }


    function C() {
        var args = _.toArray(arguments);
        if (!_.isArray(_.last(args))) args[args.length-1] = [args[args.length-1]];
        var fns = _.flatten(args.pop());

        var then_cb = null;
        var then_obj_returned = false;
        var then_obj = { then: function(cb) {
            then_cb = cb;
        } };

        var i = 0;

        return (function c(res) {
            if (maybe_promise(res)) {
                then_obj_returned = true;
                res.then(c);
                // then_obj_returned = true;
                return then_obj;
            }

            if (i == fns.length) {
                i = fns = null;
                // 혹시 모두 동기로 끝나버려 then_cb가 아직 안들어온 경우 안전하게 한번 기다려주고
                return !then_obj_returned ? res : (then_cb ? then_cb(res) : setTimeout(function() { if (then_cb) then_cb(res); }));
            }

            // returns가 아닌 경우
            if (!_.isArray(res) || !res._A_is_returns) res = [res];

            // 동기 경우
            if (!fns[i]._A_is_cb && !fns[i]._A_just_cb) return c(fns[i++].apply(undefined, res));

            // 동기이고 그냥 callback, 혹시 생길 수 있는 비동기를 미리 잡기 위해서도 사용
            if (!fns[i]._A_is_cb) return fns[i++].apply(undefined, res.concat(c));

            // 비동기일 경우
            then_obj_returned = true;
            fns[i++].apply(undefined, res.concat(c));
            return then_obj;
        })(R.apply(undefined, args));
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

    C.all = J("TODO");

    C.div = J("TODO");


    function F(nodes) {
        var f = V(G, nodes);
        setTimeout(function() {
            f = V(G, nodes);
            console.log('-------------------------------------------');
            console.log('warning: ' + nodes + ' is not defined');
            console.log('-------------------------------------------');
        });
        return f || function() {
            return A(arguments, f || (f = V(G, nodes)));
        }
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
        var source = _.map(_.rest(arguments, 4), function(str_or_func) {
            if (_.isString(str_or_func)) return str_or_func;

            var key = _.uniqueId("_A_func_storage");
            func._A_func_storage[key] = str_or_func;
            return obj_name + "._A_func_storage." + key;
        }).join("");

        return function() {
            var args = _.toArray(arguments);
            var data = var_names ? _.object(var_names.match(/\w+/g), args) : undefined;

            return C(source, data, [
                remove_comment,
                unescaped_exec,
                option,
                insert_datas1,
                insert_datas2,
                j_exec
            ]);
        };
    }

    function s_each(func, var_names/*, source...*/) {     // used by H.each and S.each
        var map = B.map(func.apply(null, _.rest(arguments)));
        return function(ary /*, args...*/) {
            return A([ary].concat(_.rest(arguments)), [map, function(res) { return res.join(""); }]);
        };
    }

    function remove_comment(source, data) {
        return R([source.replace(/\/\*(.*?)\*\//g, "").replace(
            new RegExp("\/\/"+TABS+".*?(?=((\/\/)?"+TABS+"))|\/\/"+TABS+".*", "g"), ""), data]);
    }

    var unescaped_exec = B(/!\{(.*?)\}!/, I, s_exec); //!{}!
    var insert_datas1 = B(/\{\{\{(.*?)\}\}\}/, I, s_exec); // {{{}}}
    var insert_datas2 = B(/\{\{(.*?)\}\}/, _.escape, s_exec); // {{}}

    function s_exec(re, wrap, source, data) {
        if (!source.match(re)) return R([source, data]);

        return C(data,
            [new Function("data", "with(data||{}) { return " + RegExp.$1 + "; }"),
            wrap,
            return_check,
            function(res) {
                return s_exec(re, wrap, source.replace(re, res), data);
            }]);
    }

    function j_exec(source, data) { // ${}$
        var re = /\$\{(.+?\(.*?\))(, *(.+?))?\}\$/; //${}$ 매칭시키고 매치된 내용 안전하게 다시 매치 시킬 지.
        if (!source.match(re)) return source;
        var func = RegExp.$1;
        var ready_func = RegExp.$3;
        var res = (new Function("data", "with(data||{}) { return " + func + "; }"))(data);

        if (res && res.then) {
            var id = _.uniqueId('replaced');
            res.then(function(res) { return $('#'+id).replaceWith(res); });
            res = '<span id =' + id + ' lhtml=placeholder>' + ((new Function('data', 'with(data||{}) { return ' + ready_func + '}'))(data) || "") + '</span>';
        }
        return j_exec(source.replace(re, res), data);
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

        return R([ary.join(""), data]);
    }

    function line(source, tag_stack) {
        source = source.replace(new RegExp("^"+TABS+"\\|"), "\n").replace(/^ */, "");
        if (source.match(/^[\[.#\w\-]/)) source = source.replace(/^(\[.*\]|\{.*?\}|\S)+ ?/, _.partial(start_tag, _, tag_stack));
        return source;
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

        // attrs += id
        attrs += [''].concat(_.map(str.match(/#($\{.*?\}$|\{\{\{.*?\}\}\}|\{\{.*?\}\}|[\w\-]+)/g), function(v) { return v.slice(1); })).join(' id=');

        // attrs += class
        (cls = _.map(str.match(/\.($\{.*?\}$|\{\{\{.*?\}\}\}|\{\{.*?\}\}|[\w\-]+)/g), function(v) { return v.slice(1); }).join(' '))
        && attrs == (attrs = attrs.replace(/class\s*=\s*((\").*?\"|(\{.*?\}|\S)+)/,
            function(match, tmp, q) { return ' class=' + '"' + cls + ' ' + (q ? tmp.slice(1,-1) : tmp)  + '"'; }))
        && (attrs += ' class="' + cls + '"');

        return '<' + name + attrs + ' >'; // 띄어쓰기 <a href=www.marpple.com/> 를 위해
    }

    function end_tag(tag) {
        return '</'+tag+'>';
    }

    function return_check(val) {
        return (_.isNull(val) || _.isUndefined(val)) ? '' : val;
    }

    /* H end */


    function I(v) { return v; }


    function M(obj, method) {
        return obj[method].apply(obj, _.rest(arguments, 2));
    }


    window.N = J(null);


    function P() { return arguments; }


    function R(args) {
        if (_.isArray(args) && args._A_is_returns) return args;
        if (arguments.length != 1) args = _.toArray(arguments);
        return _.extend(_.clone(_.toArray(args)), { _A_is_returns: true });
    }


    function S(var_names/*, source...*/) {
        return s.apply(null, [S, 'S', function(s, d) { return R([s, d]); }].concat(_.toArray(arguments)));
    }

    S.each = function(var_names/*, source...*/) {
        return s_each.apply(null, [S].concat(_.toArray(arguments)));
    };

    S._A_func_storage = {};


    window.TODO = J("TODO");


    function U() {}


    function V(obj, key) {
        return (function v(obj, idx, keys) {
            return (obj = obj[keys[idx]]) ? keys.length-1 == idx ? obj : v(obj, idx+1, keys) : undefined;
        })(obj, 0, key.split('.'));
    }

}(typeof global == 'object' && global.global == global && (G.window = G = global) || (G = window));