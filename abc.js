// ABC project
//  - https://github.com/marpple/abc-functional-javascript
//  - https://github.com/marpple/abc-box
// Project Lead - Indong Yoo
// Maintainers - Piljung Park, Hanah Choi
// Contributors - Byeongjin Kim, Joeun Ha, Hoonil Kim

// abc.js, abc.box.js
// (c) 2015-2016 Marpple. MIT Licensed.

//-------------------- abc.js -----------------------
!function(G) {
  var _ = respect_underscore({}), window = typeof window != 'object' ? G : window;

  F.A = window.A = A; // similar to apply
  F.B = window.B = B; // thisless bind, similar to _.partial
  F.B2 = window.B2 = B2; // only pipeline
  F.C = window.C = C; // thisless call
  F.F = window.F = F; // find function
  F.G = window.G = G; // window or global
  F.H = window.H = H; // HTML Template Engine
  F.I = window.I = I; // _.identity
  F.J = window.J = J; // _.always
  F.MR = window.MR = MR; // like multiple return in Go Lang. return x, y; => return R(x, y)
  F.S = window.S = S; // String Template Engine
  F.X = window.X = new Object();

  C.lambda = I;
  C.method = C.m = method; // for method
  C.args = function() { return arguments; };
  C.val = C.v = getValue; // get value with string
  C.args.trim = function(args) { return args.length == 1 && args[0] === undefined ? [] : args; };
  B.args = function(idx) {
    if (arguments.length == 1) return function() { return arguments[idx]; };
    var idxs = arguments;
    return function() { return toMR(C.map(idxs, arguments, function(v, i, l, args) { return args[v]; })); };
  };
  C.args0 = I, C.args1 = B.args(1), C.args2 = B.args(2), C.args3 = B.args(3), C.args4 = B.args(4);

  function A(args, func) { return C.apply(arguments[2] || this, _.toArray(args).concat([func])); }

  function map(list, iter) {
    var list2 = [];
    for (var i = 0, length = list.length; i < length ;i++) list2.push(iter(list[i], i, list));
    return list2;
  }

  function wrap_arr(v) { return _.isArray(v) ? v : [v]; }

  function base_B(args, is_bp2) {
    args = _.toArray(args);
    var fns = C.lambda == I ? args.pop() : map(_.flatten(wrap_arr(args.pop())), C.lambda);

    return function() {
      var args3 = _.clone(args);
      for (var i = 0, length = arguments.length; i < length; i++) {
        var arg2 = arguments[i];
        var idx = args3.indexOf(X);
        args3[idx == -1 ? args3.length : idx] = arg2;
      }
      return A(args3, fns, is_bp2 ? {args: args3, parent: this} : this);
    };
  }

  function B() { return base_B(arguments); }

  function B2() { return base_B([C.to_array(arguments)]); }

  B.indent = function() { return base_B(arguments, true); };
  B2.indent = function() { return base_B([C.to_array(arguments)], true); };
  B.args_pass = function(fn) { return B2(C.args, B.all(I, _.flatten([toMR, fn])), C.args, B.v('0'), toMR); };

  B.val = B.v = B.V = function(key) { return B(X, key, getValue); };
  B.method = B.m = B.M = function() { return B.apply(void 0, [X].concat(_.toArray(arguments)).concat(method)); };

  B.map = function(iter) {
    return B(
      function(result, list, keys, i, res) {  // body
        if (i) result.push(res);
        return res;
      },
      JU, // end_q
      void 0, // end
      I, // complete
      C.lambda(iter), // iter_or_predi
      base_loop_fn_base_args,
      base_loop_fn);
  };

  var arg_add_arr = function(list) { return MR(list, []); };
  var all_map = B.map(function(val_fn, k, l, args) { return A(args, val_fn, this); });
  var div_map = B.map(function(v, k, l, fns) { return A([v], fns[k] || I, this); });

  B.all = function() {
    var fns = _.toArray(arguments);
    return function() {
      return A([fns, _.toArray(arguments)], [all_map, arg_add_arr, spread_args, toMR], this);
    };
  };

  B.div = function() {
    var fns = _.toArray(arguments);
    return function() {
      var args = _.toArray(arguments);
      while (args.length < fns.length) args.push(void 0);
      return A([args, fns], [div_map, arg_add_arr, spread_args, toMR], this);
    };
  };

  var c_if = IF(function() { return arguments.length == 3; }, MR).ELSE(B.all(_.rest, B.V('0'), C.args1));
  var b_if = IF(function() { return arguments.length > 1; }, MR).ELSE(B.all(_.rest, B.V('0')));

  B.reduce = function(iter) {
    return B([iter == null ? c_if : b_if,
      B(function(result, list, keys, i, res, tmp, args) {
          return i == 0 ? args[0] : res;
        }, //body
        JU, // end_q
        void 0, // end
        C.args2, // complete
        C.lambda(iter),   // iter_or_predi
        function(list, keys, i, res) { // params
          var key = keys ? keys[i] : i;
          return [res, list[key], key, list];
        },
        base_loop_fn)]);
  };

  var spread_args = B.reduce(function(memo, arg) { return memo.concat(isMR(arg) ? arg : [arg]); });

  B.each = function(iter) {
    return B(
      C.args4, // body
      JU, // end_q
      void 0, // end
      C.args1,
      C.lambda(iter), // iter_or_predi
      base_loop_fn_base_args,
      base_loop_fn);
  };

  B.filter = function(iter) {
    return B(
      function(result, list, keys, i, res) {  // body
        var key = keys ? keys[i - 1] : i - 1;
        if (i > 0 && res) result.push(list[key]);
        return res;
      },
      JU, // end_q
      void 0, // end
      I, // complete
      C.lambda(iter),   // iter_or_predi
      base_loop_fn_base_args,
      base_loop_fn);
  };

  B.reject = function(iter) {
    return B(
      function(result, list, keys, i, res) {   // body
        var key = keys ? keys[i - 1] : i - 1;
        if (i > 0 && !res) result.push(list[key]);
        return res;
      },
      JU, // end_q
      void 0, // end
      I, // complete
      C.lambda(iter),
      base_loop_fn_base_args,
      base_loop_fn);
  };

  B.find = function(iter) {
    return B(
      C.args4,
      I, // end_q
      function(list, keys, i) {
        return list[keys ? keys[i - 1] : i - 1];
      }, // end
      JU, // complete
      C.lambda(iter),
      base_loop_fn_base_args,
      base_loop_fn);
  };

  B.find_key = B.findKey = function(iter) {
    return B(
      C.args4, // body
      I, // end_q
      function(list, keys, i) {
        return keys ? keys[i - 1] : i - 1;
      }, // end
      J(undefined), // complete
      C.lambda(iter),
      base_loop_fn_base_args,
      base_loop_fn);
  };

  B.findIndex = B.find_index = B.find_i = function(iter) {
    return B(
      C.args4, // body
      I, // end_q
      function(list, keys, i) {
        return keys ? keys[i - 1] : i - 1;
      }, // end
      J(-1), // complete
      C.lambda(iter),
      base_loop_fn_base_args,
      base_loop_fn);
  };

  B.some = function(iter) {
    return B(
      C.args4,
      I, // end_q
      J(true), // end
      J(false), // complete
      C.lambda(iter),
      base_loop_fn_base_args,
      base_loop_fn);
  };

  B.every = function(iter) {
    return B(
      function(result, list, keys, i, res) {
        return i == 0 ? true : res;
      },   // body
      function(v) {
        return !v;
      }, // end_q
      J(false), // end
      J(true), // complete
      C.lambda(iter),
      base_loop_fn_base_args,
      base_loop_fn);
  };

  B.uniq = function(iter) {
    iter = C.lambda != I ? C.lambda(iter || I) : _.isString(iter) ?
      (function(k) { return function(v) { return v[k]; }; })(iter) : (iter || I);
    return B(
      function(result, list, keys, i, res, tmp) { // body
        if (i == 0) return;
        if (tmp.indexOf(res) == -1) {
          tmp.push(res);
          result.push(list[i - 1]);
        }
      },
      JU,   // end_q
      void 0,   // end
      I, // complete
      iter,
      base_loop_fn_base_args,
      base_loop_fn);
  };

  B.tap = function() {
    var fns = arguments;
    return function() { return A(arguments, [fns, J(arguments), toMR], this); };
  };

  B.boomerang = function() { // fork
    var fns = arguments;
    return JCB(function(res, cb) {
      cb(res);
      A([res], fns, this);
    });
  };

  B.is = function(a) {
    return B2(C.arr_or_args_to_arr, B.find_i(function(v) { return a !== v;}), function(v) { return v === -1; });
  };
  B.isnt = function(a) { return B2(C.arr_or_args_to_arr, B.find_i([I, B.is(a)]), B.is(-1)); };
  B.delay = function(time) {
    return CB(function() {
      var args = arguments, cb = args[args.length-1];
      args.length = args.length - 1;
      setTimeout(function() { cb.apply(null, args); }, time || 0);
    });
  };

  function base_loop_fn_base_args(list, keys, i) {
    var key = keys ? keys[i] : i;
    return [list[key], key, list];
  }

  B.remove = function(remove) { return B(X, remove, C.remove); };
  B.unset = function(key) { return B(X, key, C.unset); };

  function base_loop_fn(body, end_q, end, complete, iter_or_predi, params) {
    var context = this;
    var args = _.rest(arguments, 6);
    var list = args.shift();
    var keys = _.isArray(list) ? null : _.keys(list);
    iter_or_predi = iter_or_predi || args.pop();
    var length = (keys || list).length;
    var result = [], tmp = [];
    var resolve = I, async = false;
    return (function f(i, res) {
      res = body(result, list, keys, i, res, tmp, args);
      if (end_q(res)) return resolve(end(list, keys, i));
      if (i == length) return resolve(complete(result, list, res));

      var res2 = A(params(list, keys, i, res).concat(args), iter_or_predi, context);
      if (!maybe_promise(res2)) return f(i + 1, res2);
      res2.then(function(res3) { f(i + 1, res3); });
      return async || C(CB(function(cb) { resolve = cb; async = true; }));
    })(0);
  }

  F.CB = window.CB = B([C.args, B.map([I, B(X, {_ABC_is_cb: true}, _.extend)])]);
  F.JCB = window.JCB = B(X, {_ABC_just_cb: true}, _.extend);

  function isMR(arg) { return _.isArray(arg) && arg._ABC_is_returns; }

  function isERR(err) {
    err = isMR(err) ? err[0] : err;
    return err && err.constructor == Error && err._ABC_is_err;
  }

  function maybe_promise(res) { return _.isObject(res) && res.then && _.isFunction(res.then); }

  function unpack_promise(res, callback) {
    var is_r = isMR(res);
    return (function u(i, res, length, has_promise) {
      if (i == length) {
        has_promise && callback(is_r ? res : res[0]);
        return;
      }
      return maybe_promise(res[i]) && (has_promise = true) ? (function(i) {
        res[i].then(function(v) {
          res[i] = v;
          u(i + 1, res, length, has_promise);
        });
        return true;
      })(i) : u(i + 1, res, length, has_promise);
    })(0, (res = is_r ? res : [res]), res.length, false);
  }

  function C() {
    var context = this;
    var args = _.toArray(arguments);
    if (!_.isArray(args[args.length - 1])) args[args.length - 1] = [args[args.length - 1]];
    var fns = _.flatten(args.pop());
    if (args.length == 1 && isMR(args[0])) args = args[0];

    var i = 0, promise = null, resolve = null;
    return (function c(res) {
      if (fns[i] && ((isERR(res) && !fns[i]._ABC_is_catch) || (!isERR(res) && fns[i]._ABC_is_catch)) && i++) return c(res);
      if (unpack_promise(res, c)) return promise || (promise = hasPromise() ? new Promise(function(rs) { resolve = rs; }) : { then: function(rs) { resolve = rs; } });

      if (i == fns.length) {
        if (!promise) return res;
        // 혹시 모두 동기로 끝나버려 then_rs가 아직 안들어온 경우 안전하게 한번 기다려주고
        return resolve ? resolve(res) : setTimeout(function() { resolve && resolve(res); }, 0);
      }

      if (!isMR(res)) res = [res];
      try { // 동기 경우
        if (!fns[i]._ABC_is_cb && !fns[i]._ABC_just_cb) return c(fns[i++].apply(context, C.args.trim(res)));
        // 동기이고 그냥 callback, 혹시 생길 수 있는 비동기를 미리 잡기 위해서도 사용
        if (!fns[i]._ABC_is_cb) return fns[i++].apply(context, C.args.trim(res).concat(function() { return c(toMR(arguments)); }));
      } catch (e) { return c(ERR(e)); }

      // 비동기일 경우
      promise || (promise = hasPromise() ? new Promise(function(rs) { resolve = rs; }) : { then: function(rs) { resolve = rs; } });
      try { fns[i++].apply(context, C.args.trim(res).concat(function() { arguments.length <= 1 ? c.apply(null, arguments) : c(toMR(arguments)); })); }
      catch (e) { c(ERR(e)); }
      return promise;
    })(toMR(args));
  }

  function ERR(err, data) {
    setTimeout(function() { err._ABC_caught || C.error(err); }, 500);
    return err = _.extend(err.constructor == Error ? err : new Error(err), data, {_ABC_is_err: true});
  }

  F.ERR = window.ERR = ERR;

  F.CATCH = window.CATCH = function(f) {
    return _.extend(function(err) { return (err._ABC_caught = true) && f.apply(this, arguments); },
      {_ABC_is_catch: true, _ABC_is_cb: f._ABC_is_cb, _ABC_just_cb: f._ABC_just_cb});
  };

  C.each = B.each(null);
  C.map = B.map(null);
  var _reduce = B.reduce(null);
  C.reduce = function(arr, memo, func) { return func ? _reduce(arr, memo, func) : _reduce(arr, memo); };
  C.filter = B.filter(null);
  C.reject = B.reject(null);
  C.find = B.find(null);
  C.find_key = C.findKey = B.find_key(null);
  C.findIndex = C.find_index = C.find_i = B.find_index(null);
  C.some = B.some(null);
  C.every = B.every(null);
  C.uniq = B.uniq(null);
  C.toArray = C.to_array = _.toArray;

  C.add = B2(C.arr_or_args_to_arr = IF(_.isArray, I).ELSE([C.args, C.to_array]), B.reduce(function(a, b) { return a + b; }));
  C.sub = B2(C.arr_or_args_to_arr, B.reduce(function(a, b) { return a - b; }));
  C.mod = B2(C.arr_or_args_to_arr, B.reduce(function(a, b) { return a % b; }));
  C.mul = B2(C.arr_or_args_to_arr, B.reduce(function(a, b) { return a * b; }));
  C.div = B2(C.arr_or_args_to_arr, B.reduce(function(a, b) { return a / b; }));

  C.parseInt = C.parse_int = function(v) { return parseInt(v, 10); };
  C.parseIntAll = C.parse_int_all = B2(C.arr_or_args_to_arr, B.map(C.parse_int));
  C.iadd = B2(C.parse_int_all, C.add);
  C.isub = B2(C.parse_int_all, C.sub);

  C.not = function(v) { return !v; };
  C.nnot = function(v) { return !!v; };

  C.and = B2(C.arr_or_args_to_arr, B.find_i(C.not), B.is(-1));
  C.or = B2(C.arr_or_args_to_arr, B.find(I), C.nnot);

  C.eq = B2(C.arr_or_args_to_arr, B.find_i(function(v, i, a) { return a[0] != v; }), B.is(-1));
  C.seq = B2(C.arr_or_args_to_arr, B.find_i(function(v, i, a) { return a[0] !== v; }), B.is(-1));
  C.neq = B2(C.eq, C.not);
  C.sneq = B2(C.seq, C.not);

  C.log = window.console && window.console.log ? console.log.bind(console) : I;
  C.error = window.console && window.console.error ? console.error.bind(console) : I;
  C.hi = B.args_pass(C.log);

  C.isString = _.isString;
  C.isArray = _.isArray;
  C.isArrayLike = _.isArrayLike;

  C.remove = function(arr, remove) {
    if (C.isArray(arr)) return MR(arr, removeByIndex(arr, arr.indexOf(remove)));
    var find_key = C.find_key(arr, function(val) { return val==remove; });
    return MR(arr, find_key !== undefined ? C.unset(arr, find_key) && remove : undefined);
  };

  C.unset = function(obj, key) { delete obj[key]; return obj; };

  !function(B, C, notices) {
    C.noti = C.Noti = C.notice =  {
      on: on,
      once: B(X,X,X, true, on),
      off: off,
      emit: emit,
      emitAll: emitAll
    };

    B.noti = B.Noti = B.notice =  {
      on: function() {
        var args = arguments;
        return function(func) { return A(args.length === 3 ? args :  _.isFunction(func) ? _.toArray(args).concat(func) : args, on); };
      },
      once: function(func) {
        var args = arguments;
        return function(func) { return A(_.toArray(args.length === 3 ? args :  _.isFunction(func) ? _.toArray(args).concat(func) : args).concat([true]), on) };
      },
      off: function() { return B.apply(null, _.toArray(arguments).concat(off)); },
      emit: function() {
        var args = arguments;
        return function(args2) { return A(args.length == 3 ? args : _.isArray(args2) ? _.toArray(args).concat([args2]) : args, emit) };
      },
      emitAll: function() {
        var args = arguments;
        return function(args2) { return A(args.length == 2 ? args : _.isArray(args2) ? _.toArray(args).concat([args2]) : args, emitAll) };
      }
    };

    function on(name1, name2, func, is_once) {
      var _notice = notices[name1];
      func.is_once = !!is_once;
      if (!_notice) _notice = notices[name1] = {};
      (_notice[name2] = _notice[name2] || []).push(func);
      return func;
    }

    function off(name1, n2_or_n2s) {
      var _notice = notices[name1];
      if (arguments.length == 1) C.unset(notices, name1);
      else if (_notice && arguments.length == 2) map(_.isString(n2_or_n2s) ? [n2_or_n2s] : n2_or_n2s, B(_notice, C.unset));
    }

    function emitAll(name1, emit_args) {
      var key, _notice = notices[name1];
      if (_notice) for(key in _notice) C(_notice, key, make_map_emit(emit_args));
    }

    function emit(name1, name2, emit_args) {
      var _notice = notices[name1];
      if (_notice) C(name2, [
        IF(_.isFunction, [J(void 0), name2, function(name2) { return _.isString(name2) ? [name2] : name2; }]).ELSEIF(_.isString, J([name2])).ELSE(I),
        B(X, B([B.all(J(_notice), I), IF([C.val, function(arr) { return arr && arr.length }], make_map_emit(emit_args))]), map)
      ]);
    }

    function make_map_emit(args) { return [B.tap(C.val, B(X, B([I, B(args, X, A)]), map)), function (_n, k) { _n[k] = C.reject(_n[k], B.val('is_once')); }];}
  }(B, C, {});

  C.remove_by_index = C.removeByIndex = removeByIndex;

  function removeByIndex(arr, from) {
    if (from == -1) return arr.length;
    var rest = arr.slice(from + 1 || arr.length);
    arr.length = from;
    return arr.push.apply(arr, rest);
  }

  C.test = function(tests) {
    var fails = J([]), all = J([]), fna = J([fails(), all()]);
    return C([J('------------Start------------'), C.log, J(tests),
      B.map(function(f, k) {
        return IF([all, B.m('push', k + ' ----> success')])
          .ELSE([fna, B.map([I, B.m('push', k + ' ----> fail')])])(f());
      }),
      J('------------Fail-------------'), C.log,
      fails, B.each([I, C.error]),
      J('------------All--------------'), C.log,
      all, B.each([I, C.log]),
      J('------------End--------------'), C.log]);
  };

  function F(nodes) {
    var f = getValue(G, nodes);
    var err = Error('warning: ' + nodes + ' is not defined');
    return f || setTimeout(function() { (f = f || getValue(G, nodes)) || C.error(err) }, 0)
      && function() { return A(arguments, f || (f = getValue(G, nodes)), this); }
  }

  /* H start */
  H.TAB_SIZE = 2;
  function TAB() { return "( {" + H.TAB_SIZE + "}|\\t)"; }; // "( {4}|\\t)"
  function TABS() { return TAB() + "+"; };
  function number_of_tab(a) {
    var snt = a.match(new RegExp("^" + TABS()))[0];
    var tab_length = (snt.match(/\t/g) || []).length;
    var space_length = snt.replace(/\t/g, "").length;
    return space_length / H.TAB_SIZE + tab_length;
  }

  function H(var_names/*, source...*/) {
    return s.apply(null, [H, 'H', convert_to_html].concat(_.toArray(arguments)));
  }

  H.each = function(var_names/*, source...*/) {
    return s_each.apply(null, [H].concat(_.toArray(arguments)));
  };

  H._ABC_func_storage = {};

  function s(func, obj_name, option, var_names/*, source...*/) {      // used by H and S
    var args = _.toArray(arguments);
    if (args.length == 4) (args[4] = args[3]) && (var_names = args[3] = '$');
    var source = C.map(_.rest(args, 4), function(str_or_func) {
      if (_.isString(str_or_func)) return str_or_func;

      var key = _.uniqueId("_ABC_func_storage");
      func._ABC_func_storage[key] = str_or_func;
      return obj_name + "._ABC_func_storage." + key;
    }).join("");

    return function() {
      var data = var_names ? _.object(var_names.match(/[\w\$]+/g), _.toArray(arguments)) : void 0;
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
    return MR(source.replace(/\/\*(.*?)\*\//g, "").replace(
      new RegExp("\/\/" + TABS() + ".*?(?=((\/\/)?" + TABS() + "))|\/\/" + TABS() + ".*", "g"), ""), data);
  }

  var unescaped_exec = B(/!\{(.*?)\}!/, I, s_exec); //!{}!
  var insert_datas1 = B(/\{\{\{(.*?)\}\}\}/, I, s_exec); // {{{}}}
  var insert_datas2 = B(/\{\{(.*?)\}\}/, _.escape, s_exec); // {{}}

  function s_exec(re, wrap, source, data) {
    return !source.match(re) ? MR(source, data) :
      C(data, [new Function("data", "with(data||{}) { return " + RegExp.$1 + "; }"),
        wrap, return_check,
        function(res) {
          return s_exec(re, wrap, source.replace(re, res), data);
        }]);
  }

  function convert_to_html(source, data) {
    var tag_stack = [];
    var ary = source.match(new RegExp(TABS() + "\\S.*?(?=" + TABS() + "\\S)|" + TABS() + "\\S.*", "g"));
    var base_tab = number_of_tab(ary[0]);
    ary[ary.length - 1] = ary[ary.length - 1].replace(new RegExp(TAB() + "{" + base_tab + "}$"), "");

    var is_paragraph = 0;
    for (var i = 0; i < ary.length; i++) {
      while (number_of_tab(ary[i]) - base_tab < tag_stack.length) { //이전 태그 닫기
        is_paragraph = 0;
        if (tag_stack.length == 0) break;
        ary[i - 1] += end_tag(tag_stack.pop());
      }

      var tmp = ary[i];

      if (!is_paragraph) {
        ary[i] = line(ary[i], tag_stack);
        if (tmp.match(new RegExp("^(" + TABS() + ")(\\[.*?\\]|\\{.*?\\}|\\S)+\\.(?!\\S)"))) is_paragraph = number_of_tab(RegExp.$1) + 1;
        continue;
      }

      ary[i] = ary[i].replace(new RegExp("(" + TAB() + "{" + is_paragraph + "})", "g"), "\n");
      if (ary[i] !== (ary[i] = ary[i].replace(new RegExp("\\n(" + TABS() + "[\\s\\S]*)"), "\n"))) ary = push_in(ary, i + 1, RegExp.$1);
    }

    while (tag_stack.length) ary[ary.length - 1] += end_tag(tag_stack.pop()); // 마지막 태그

    return MR(ary.join(""), data);
  }

  function line(source, tag_stack) {
    source = source.replace(new RegExp("^" + TABS() + "\\|"), "\n").replace(/^\s*/, "");
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
    if (name != 'input' && name != 'br' ) tag_stack.push(name);

    // attrs
    str = str.replace(/\[(.*)\]/, function(match, inner) { return (attrs += ' ' + inner) && ''; });

    // attrs = class + attrs
    (cls = C.map(str.match(/\.(\{\{\{.*?\}\}\}|\{\{.*?\}\}|[\w\-]+)/g), function(v) { return v.slice(1); }).join(' '))
    && attrs == (attrs = attrs.replace(/class\s*=\s*((\").*?\"|(\{.*?\}|\S)+)/,
      function(match, tmp, q) { return ' class=' + '"' + cls + ' ' + (q ? tmp.slice(1, -1) : tmp) + '"'; }))
    && (attrs = ' class="' + cls + '"' + attrs);

    // attrs = id + attrs
    attrs = [''].concat(C.map(str.match(/#(\{\{\{.*?\}\}\}|\{\{.*?\}\}|[\w\-]+)/g),
        function(v) { return v.slice(1); })).join(' id=') + attrs;

    return '<' + name + attrs + ' >'; // 띄어쓰기 <a href=www.marpple.com/> 를 위해
  }

  function end_tag(tag) { return '</' + tag + '>'; }

  function return_check(val) {
    return (val == null || val == void 0) ? '' : val;
  }

  /* H end */

  function I(v) { return v; }

  function IF(predicate, fn) {
    var store = [fn ? [predicate, fn] : [I, predicate]];
    return _.extend(IF, {
      ELSEIF: function(predicate, fn) { return store.push(fn ? [predicate, fn] : [I, predicate]) && IF; },
      ELSE: function(fn) { return store.push([J(true), fn]) && IF; }
    });

    function IF() {
      var context = this, args = arguments;
      return C(store, args, [
        B.find(function(fnset, i, l, args) { return A(args, fnset[0], context); }),
        function(fnset) { return fnset ? A(args, fnset[1], context) : void 0; }
      ]);
    }
  }

  F.IF = window.IF = IF;

  function J(v) { return function() { return v; }; }

  J.t = J.true = J(true);
  J.f = J.false = J(false);
  function JU() {}
  J.u = J.noop = JU;

  function method(obj, method) { return obj[method].apply(obj, _.rest(arguments, 2)); }

  function MR(arg) {
    if (arguments.length <= 1) return arg;
    if (_.isArray(arg) && arg._ABC_is_returns) return arg;
    return _.extend(_.toArray(arguments), {_ABC_is_returns: true});
  }

  function toMR(arg) {
    if (_.isArray(arg) && arg._ABC_is_returns) return arg;
    return _.extend(_.values(arg), {_ABC_is_returns: true});
  }

  C.toMR = window.toMR = toMR;

  function S(var_names/*, source...*/) {
    return s.apply(null, [S, 'S', function(s, d) { return MR(s, d); }].concat(_.toArray(arguments)));
  }

  S.each = function(var_names/*, source...*/) {
    return s_each.apply(null, [S].concat(_.toArray(arguments)));
  };

  S._ABC_func_storage = {};

  function getValue(obj, key) {
    return (function v(obj, idx, keys) {
      return (obj = obj[keys[idx]]) ? keys.length - 1 == idx ? obj : v(obj, idx + 1, keys) : void 0;
    })(obj, 0, key.split('.'));
  }

  X.context = X.this = function() { return this; };

  function hasPromise() { return hasPromise.__cache || (hasPromise.__cache = !!getValue(window, 'Promise.prototype.then')); }
}(typeof global == 'object' && global.global == global && (global.G = global) || window);


// Underscore.js 1.8.
// http://underscorejs.org
// (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
// Underscore may be freely distributed under the MIT license.
function respect_underscore(_) {
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
  var getLength = function(obj) { return obj.length; };
  _.isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  _.contains = function(obj, item, fromIndex, guard) {
    if (!_.isArrayLike(obj)) obj = _.values(obj);
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

  _.initial = function(array, n, guard){
    return slice.call(array, 0 , Math.max(0, array.length-(null==n||guard?1:n)));
  };

  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (_.isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
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

  _.indexOf = (function(dir, predicateFind, sortedIndex) {
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
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) keys.push(prop);
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
  })({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '`': '&#x60;'});

  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  return _;
}