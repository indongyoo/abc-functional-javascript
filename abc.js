// ABC project
//  - https://github.com/marpple/abc-functional-javascript
//  - https://github.com/marpple/abc-box
// Project Lead - Indong Yoo
// Maintainers - Piljung Park, Hanah Choi
// Contributors - Byeongjin Kim, Joeun Ha, Hoonil Kim

// abc.js, abc.box.js
// (c) 2015-2016 Marpple. MIT Licensed.

//-------------------- abc.js ------------------------
!function(G) {
  var _ = respect_underscore({}), window = typeof window != 'object' ? G : window;

  F.A = window.A = A; // similar to apply
  F.B = window.B = B; // thisless bind, similar to _.partial
  F.B2 = window.B2 = B2; // only pipeline
  F.C = window.C = C; // thisless call
  F.C = window.C2 = C2; // only pipeline
  F.F = window.F = F; // find function
  F.G = window.G = G; // window or global
  F.H = window.H = H; // HTML Template Engine
  F.I = window.I = I; // _.identity
  F.J = window.J = J; // _.always
  F.MR = window.MR = MR; // like multiple return in Go Lang. return x, y; => return R(x, y)
  F.S = window.S = S; // String Template Engine
  F.X = window.X = new Object();

  try { var has_lambda = true; eval('a=>a'); } catch (err) { var has_lambda = false; }
  C.lambda = function (str) {
    if (typeof str !== 'string') return str;
    if (!str.match(/=>/)) return new Function('$', 'return (' + str + ')');
    if (has_lambda) return eval(str); // es6 lambda
    var ex_par = str.split(/\s*=>\s*/);
    return new Function(
      ex_par[0].replace(/(?:\b[A-Z]|\.[a-zA-Z_$])[a-zA-Z_$\d]*|[a-zA-Z_$][a-zA-Z_$\d]*\s*:|this|arguments|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g, '').match(/([a-z_$][a-z_$\d]*)/gi) || [],
      'return (' + ex_par[1] + ')');
  };

  C.is_string = C.isString = _.isString;
  C.is_array = C.isArray = Array.isArray || function(obj) { return toString.call(obj) === '[object Array]'; };
  C.is_object = C.isObject = _.isObject;
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  C.is_array_like = C.isArrayLike = function(collection) {
    var length = collection.length;
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };
  C.wrapArray = C.wrap_arr = function(v) { return C.isArray(v) ? v : [v]; };
  var slice = Array.prototype.slice;
  C.rest = function(array, n, guard) { return slice.call(array, n == null || guard ? 1 : n); };
  C.values = function(obj) {
    var keys = _.keys(obj), length = keys.length, values = Array(length);
    for (var i = 0; i < length; i++) values[i] = obj[keys[i]];
    return values;
  };
  C.toArray = C.to_array = C.toArray = function(obj) {
    if (!obj) return [];
    if (C.isArray(obj)) return slice.call(obj);
    return C.values(obj);
  };
  C.object = function(list, values) {
    for (var result = {}, i = 0, length = list.length; i < length; i++) {
      if (values) result[list[i]] = values[i];
      else result[list[i][0]] = list[i][1];
    }
    return result;
  };

  function base_ex_de(is_de, obj1/* objs... */) {
    if (obj1) return function ex_de_recursive(result, args, i) {
      var shift = args[i];
      if (!shift) return result;
      if (!is_de) for (var key in shift) result[key] = shift[key];
      else for (var key in shift) if (!result.hasOwnProperty(key)) result[key] = shift[key];
      return ex_de_recursive(result, args, i+1);
    }(obj1, arguments, 2);
  }
  C.extend = function() { return base_ex_de.apply(null, [false].concat(C.toArray(arguments))); };
  C.defaults = function() { return base_ex_de.apply(null, [true].concat(C.toArray(arguments))); };
  C.clone = function(obj) {
    return !C.isObject(obj) ? obj : C.isArray(obj) ? obj.slice() : C.extend({}, obj);
  };

  C.method = C.m = method; // for method
  C.args = function() { return arguments; };
  C.arr_or_args_to_arr = IF(C.isArray, I).ELSE([C.args, C.toArray]);
  C.val = C.v = getValue; // get value with string
  C.args.trim = function(args) { return args.length == 1 && args[0] === undefined ? [] : args; };
  B.args = function(idx) {
    if (arguments.length == 1) return function() { return arguments[idx]; };
    var idxs = arguments;
    return function() { return toMR(C.map(idxs, arguments, function(v, i, l, args) { return args[v]; })); };
  };
  C.args0 = I, C.args1 = B.args(1), C.args2 = B.args(2), C.args3 = B.args(3), C.args4 = B.args(4);
  C.set = function(obj, key, valueOrFunc) {
    if (!_.isFunction(valueOrFunc)) return MR(obj[key] = valueOrFunc, key, obj);
    return C(obj, key, [ valueOrFunc, function(_value) { return MR(obj[key] = _value, key, obj) }]);
  };
  C.unset = function(obj, key) { var val = obj[key]; delete obj[key]; return MR(val, key, obj); };
  C.remove = function(arr, remove) { return MR(remove, removeByIndex(arr, arr.indexOf(remove)), arr); };
  C.pop = function(arr) { return MR(arr.pop(), arr.length, arr); };
  C.shift = function(arr) { return MR(arr.shift(), 0, arr); };
  C.push = function(arr, itemOrFunc) {
    if (!_.isFunction(itemOrFunc)) return MR(itemOrFunc, arr.push(itemOrFunc), arr);
    return C(arr, [itemOrFunc, function(_item) { return MR(_item, arr.push(_item), arr); }]);
  };
  C.unshift = function(arr, itemOrFunc) {
    if (!_.isFunction(itemOrFunc)) return MR(itemOrFunc, arr.unshift(itemOrFunc), arr);
    return C(arr, [itemOrFunc, function(_item) { return MR(_item, arr.unshift(_item), arr); }]);
  };
  C.sel = C.select = C.extend(function(start, selector) {
    return C.reduce(selector.split(/\s*->\s*/), start, function (mem, key) {
      return !key.match(/^\((.+)\)/) ? !key.match(/\[(.*)\]/) ? mem[key] : function(mem, numbers) {
        if (numbers.length > 2 || numbers.length < 1 || C.filter(numbers, [I, isNaN]).length) return ERR('[] selector in [num] or [num ~ num]');
        var s = numbers[0], e = numbers[1]; return !e ? mem[s<0 ? mem.length+s : s] : slice.call(mem, s<0 ? mem.length+s : s, e<0 ? mem.length+e : e + 1);
      }(mem, C.map(RegExp.$1.replace(/\s/g, '').split('~'), [I, parseInt])) : C.find(mem, C.lambda(RegExp.$1));
    });
  }, {
    set: function(start, selector, value) {
      var _arr = selector.split(/\s*->\s*/), last = _arr.length - 1;
      return toMR([start].concat(C.set(_arr.length == 1 ? start : C.sel(start, _arr.slice(0, last).join('->')), _arr[last], value)));
    },
    unset: function(start, selector) {
      var _arr = selector.split(/\s*->\s*/), last = _arr.length - 1;
      return toMR([start].concat(C.unset(_arr.length == 1 ? start : C.sel(start, _arr.slice(0, last).join('->')), _arr[last])));
    },
    remove: function(start, selector, remove) {
      if (remove) return toMR([start].concat(C.remove(C.sel(start, selector), remove)));
      var _arr = selector.split(/\s*->\s*/);
      return toMR([start].concat(C.remove(C.sel(start, _arr.slice(0, _arr.length - 1).join('->')), C.sel(start, selector))));
    },
    extend: function(start, selector/*, objs*/) {
      return toMR([start].concat(C.extend.apply(null, [C.sel(start, selector)].concat(C.toArray(arguments).slice(2, arguments.length)))));
    },
    defaults: function(start, selector/*, objs*/) {
      return toMR([start].concat(C.defaults.apply(null, [C.sel(start, selector)].concat(C.toArray(arguments).slice(2, arguments.length)))));
    },
    pop: function(start, selector) { return toMR([start].concat(C.pop(C.sel(start, selector)))); },
    shift: function(start, selector) { return toMR([start].concat(C.shift(C.sel(start, selector)))); },
    push: function (start, selector, item) { return toMR([start].concat(C.push(C.sel(start, selector), item))); },
    unshift: function (start, selector, item) { return toMR([start].concat(C.unshift(C.sel(start, selector), item))); },
    im: C.extend(function (start, selector) {
      var im_start = C.clone(start);
      return {
        start: im_start,
        selected: C.reduce(selector.split(/\s*->\s*/), im_start, function(clone, key) {
          return !key.match(/^\((.+)\)/) ? /*start*/(!key.match(/\[(.*)\]/) ? clone[key] = C.clone(clone[key]) : function(clone, numbers) {
            if (numbers.length > 2 || numbers.length < 1 || C.filter(numbers, [I, isNaN]).length) return ERR('[] selector in [num] or [num ~ num]');
            var s = numbers[0], e = numbers[1]; return !e ? clone[s] = C.clone(clone[s<0 ? clone.length+s : s]) : function(clone, oris) {
              return _.each(oris, function(ori) { clone[clone.indexOf(ori)] = C.clone(ori); });
            }(clone, slice.call(clone, s<0 ? clone.length+s : s, e<0 ? clone.length+e : e + 1));
          }(clone, C.map(RegExp.$1.replace(/\s/g, '').split('~'), [I, parseInt])))/*end*/ :
            function(clone, ori) { return clone[clone.indexOf(ori)] = C.clone(ori); } (clone, C.find(clone, C.lambda(RegExp.$1)))
        })
      };
    }, {
      set: function(start, selector, value) {
        var _arr = selector.split(/\s*->\s*/), last = _arr.length - 1, im = C.sel.im(start, _arr.slice(0, _arr.length == 1 ? void 0 : last).join('->'));
        return toMR([im.start].concat(C.set(_arr.length == 1 ? im.start : im.selected, _arr[last], value)));
      },
      unset: function(start, selector) {
        var _arr = selector.split(/\s*->\s*/), last = _arr.length - 1, im = C.sel.im(start, _arr.slice(0, last).join('->'));
        return toMR([im.start].concat(C.unset(_arr.length == 1 ? im.start : im.selected, _arr[last])));
      },
      remove: function(start, selector, remove) {
        var _arr = selector.split(/\s*->\s*/), im = C.sel.im(start, selector);
        if (remove) return toMR([start].concat(C.remove(im.selected, remove)));
        return toMR([im.start].concat(C.remove(C.sel(im.start, _arr.slice(0, _arr.length - 1).join('->')), im.selected)));
      },
      extend: function(start, selector/*, objs*/) {
        var im = C.sel.im(start, selector);
        return toMR([im.start].concat(C.extend.apply(null, [im.selected].concat(C.toArray(arguments).slice(2, arguments.length)))));
      },
      defaults: function(start, selector/*, objs*/) {
        var im = C.sel.im(start, selector);
        return toMR([im.start].concat(C.defaults.apply(null, [im.selected].concat(C.toArray(arguments).slice(2, arguments.length)))));
      },
      pop: function(start, selector) {
        var im = C.sel.im(start, selector);
        return toMR([im.start].concat(C.pop(im.selected)));
      },
      shift: function(start, selector) {
        var im = C.sel.im(start, selector);
        return toMR([im.start].concat(C.shift(im.selected)));
      },
      push: function (start, selector, item) {
        var im = C.sel.im(start, selector);
        return toMR([im.start].concat(C.push(im.selected, item)));
      },
      unshift: function (start, selector, item) {
        var im = C.sel.im(start, selector);
        return toMR([im.start].concat(C.unshift(im.selected, item)));
      }
    })
  });

  B.remove = function(remove) { return B(X, remove, C.remove); };
  B.unset = function(key) { return B(X, key, C.unset); };
  B.set = function(key, value) { return B(X, key, value, C.set); };
  B.extend = function() { var args = C.toArray(arguments); return B.apply(null, [X].concat(args).concat(C.extend)); };
  B.defaults = function() { var args = C.toArray(arguments); return B.apply(null, [X].concat(args).concat(C.defaults)); };

  B.sel = B.select = function(selector) { return B(X, selector, C.sel) };
  B.sel.set = B('set', B_sel_func);
  B.sel.unset = B('unset', B_sel_func);
  B.sel.remove = B('remove', B_sel_func);
  B.sel.extend = B('extend', B_sel_func);
  B.sel.defaults = B('defaults', B_sel_func);

  B.sel.im = B.select.im = function(selector) { return B(X, selector, C.sel.im) };
  B.sel.im.set = B('im.set', B_sel_func);
  B.sel.im.unset = B('im.unset', B_sel_func);
  B.sel.im.remove = B('im.remove', B_sel_func);
  B.sel.im.extend = B('im.extend', B_sel_func);
  B.sel.im.defaults = B('im.defaults', B_sel_func);

  function B_sel_func(what, selector) { var args = C.rest(arguments); return B.apply(null, [X].concat(args).concat(C.val(C.sel, what))); }

  function A(args, func) { return C.apply(arguments[2] || this, C.toArray(args).concat([func])); }

  function each(list, iter) {
    for (var i = 0, length = list.length; i < length ;i++) iter(list[i], i, list);
    return list;
  }
  function map(list, iter) {
    for (var l2 = [], i = 0, length = list.length; i < length ;i++) l2.push(iter(list[i], i, list));
    return l2;
  }

  function base_B(args, is_bp2) {
    args = C.toArray(args);
    var fns = C.lambda == I ? args.pop() : map(C.wrap_arr(args.pop()), C.lambda);
    return function() {
      var args3 = C.clone(args);
      for (var i = 0, length = arguments.length; i < length; i++) {
        var arg2 = arguments[i];
        var idx = args3.indexOf(X);
        args3[idx == -1 ? args3.length : idx] = arg2;
      }
      return A(args3, fns, is_bp2 ? {args: args3, parent: this} : this);
    };
  }

  function B() { return base_B(arguments); }

  function B2() { return base_B([C.toArray(arguments)]); }

  B.indent = function() { return base_B(arguments, true); };
  B2.indent = function() { return base_B([C.toArray(arguments)], true); };
  B.args_pass = function(fn) { return B2(C.args, B.all(I, [toMR].concat(fn)), C.args, B.v('0'), toMR); };
  B.val = B.v = B.V = function(key) { return B(X, key, getValue); };
  B.method = B.m = B.M = function() { return B.apply(void 0, [X].concat(C.toArray(arguments)).concat(method)); };
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
  var spread_map = B.map(function(v, k, l, fns) { return A([v], fns[k] || I, this); });
  B.all = function() {
    var fns = C.toArray(arguments);
    return function() {
      return A([fns, C.toArray(arguments)], [all_map, arg_add_arr, spread_args, toMR], this);
    };
  };
  B.spread = function() {
    var fns = C.toArray(arguments);
    return function() {
      var args = C.toArray(arguments);
      while (args.length < fns.length) args.push(void 0);
      return A([args, fns], [spread_map, arg_add_arr, spread_args, toMR], this);
    };
  };
  var c_if = IF(function() { return arguments.length > 2; }, MR).ELSE(B.all([I, C.rest], B.v('0'), C.args1));
  var b_if = IF(function() { return arguments.length > 1; }, MR).ELSE(B.all([I, C.rest], B.v('0')));
  B.reduce = function(iter) {
    return B([iter == null ? c_if : b_if,
      B(function(result, list, keys, i, res, tmp, args) {
          return i == 0 ? args[0] : res;
        }, //body
        JU, // end_q
        void 0, // end
        C.args2, // complete
        C.lambda(iter),   // iter_or_predi
        function(list, keys, i, res, args) { // params
          var key = keys ? keys[i] : i;
          return [res, list[key], key, list].concat(C.rest(args));
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
      C.lambda(iter),
      base_loop_fn_base_args,
      base_loop_fn);
  };
  B.tap = function() {
    var fns = C.toArray(arguments);
    return function() { return A(arguments, fns.concat([J(arguments), toMR]), this); };
  };
  B.boomerang = function() { // fork
    var fns = arguments;
    return JCB(function(res, cb) {
      cb(res);
      A([res], fns, this);
    });
  };
  B.is = function(a) { return B2(C.arr_or_args_to_arr, B.find_i(function(v) { return a !== v;}), function(v) { return v === -1; }); };
  B.isnt = function(a) { return B2(C.arr_or_args_to_arr, B.find_i([I, B.is(a)]), B.is(-1)); };
  B.delay = function(time) {
    return CB(function() {
      var args = arguments, cb = args[args.length-1];
      args.length = args.length - 1;
      setTimeout(function() { cb.apply(null, args); }, time || 0);
    });
  };
  function base_loop_fn_base_args(list, keys, i, res, args) {
    var key = keys ? keys[i] : i;
    return [list[key], key, list].concat(args);
  }
  function base_loop_fn(body, end_q, end, complete, iter_or_predi, params) {
    var context = this;
    var args = C.rest(arguments, 6);
    var list = args.shift();
    var keys = C.isArray(list) ? null : _.keys(list);
    iter_or_predi = iter_or_predi || C.lambda(args.pop());
    var length = (keys || list).length;
    var result = [], tmp = [];
    var resolve = I, async = false;
    return (function f(i, res) {
      do {
        if (end_q(res = body(result, list, keys, i, res, tmp, args))) return resolve(end(list, keys, i));
        if (i == length) return resolve(complete(result, list, res));
        res = A(params(list, keys, i++, res, args), iter_or_predi, context);
      } while (!maybe_promise(res));
      res.then(function(res) { f(i, res); });
      return async || C(CB(function(cb) { resolve = cb, async = true; }));
    })(0);
  }

  F.CB = window.CB = B2(C.arr_or_args_to_arr, B.map([I, B(X, {_ABC_is_cb: true}, C.extend)]), B);
  F.JCB = window.JCB = B(X, {_ABC_just_cb: true}, C.extend);

  function isMR(arg) { return C.isArray(arg) && arg._ABC_is_returns; }
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
    var args = C.toArray(arguments);
    if (!C.isArray(args[args.length - 1])) args[args.length - 1] = [args[args.length - 1]];
    var fns = args.pop();
    if (args.length == 1 && isMR(args[0])) args = args[0];

    var i = 0, promise = null, resolve = null, fns_len = fns.length;
    function cp() { return hasPromise() ? new Promise(function(rs) { resolve = rs; }) : { then: function(rs) { resolve = rs; } } }
    return (function c(res) {
      do {
        if (i === fns_len) return !promise ? res : resolve ? C.lambda(resolve)(res) : setTimeout(function() { resolve && C.lambda(resolve)(res); }, 0);
        if (fns[i] && ((isERR(res) && !fns[i]._ABC_is_catch) || (!isERR(res) && fns[i]._ABC_is_catch)) && i++) continue;
        if (unpack_promise(res, c)) return promise || (promise = cp());
        try {
          if (!fns[i]._ABC_is_cb && !fns[i]._ABC_just_cb) res = C.lambda(fns[i++]).apply(context, C.args.trim(MRI(res)));
          else if (!fns[i]._ABC_is_cb) C.lambda(fns[i++]).apply(context, C.args.trim(MRI(res)).concat(function() { res = toMR(arguments); }));
        } catch (e) { res = ERR(e); }
      } while (i == fns_len || i < fns_len && !fns[i]._ABC_is_cb);

      if ((promise || (promise = cp())) && unpack_promise(res, c)) return promise;
      try { C.lambda(fns[i++]).apply(context, C.args.trim(MRI(res)).concat(function() { arguments.length <= 1 ? c.apply(null, arguments) : c(toMR(arguments)); })); }
      catch (e) { c(ERR(e)); }
      return promise;
    })(toMR(args));
  }
  function C2() { return C(C.toArray(arguments)); }

  function MRI(res) { return isMR(res) ? res : [res]; }
  function ERR(err, data) {
    setTimeout(function() { err._ABC_caught || C.error(err); }, 500);
    return err = C.extend(err.constructor == Error ? err : new Error(err), data, {_ABC_is_err: true});
  }
  F.ERR = window.ERR = ERR;
  F.CATCH = window.CATCH = function(f) {
    return C.extend(function(err) { return (err._ABC_caught = true) && f.apply(this, arguments); },
      {_ABC_is_catch: true, _ABC_is_cb: f._ABC_is_cb, _ABC_just_cb: f._ABC_just_cb});
  };

  C.each = B.each(null);
  C.map = B.map(null);
  C.reduce = B.reduce(null);
  C.filter = B.filter(null);
  C.reject = B.reject(null);
  C.find = B.find(null);
  C.find_key = C.findKey = B.find_key(null);
  C.findIndex = C.find_index = C.find_i = B.find_index(null);
  C.some = B.some(null);
  C.every = B.every(null);
  C.uniq = B.uniq(null);

  C.add = B2(C.arr_or_args_to_arr, B.reduce('(a, b) => a + b'));
  C.sub = B2(C.arr_or_args_to_arr, B.reduce('(a, b) => a - b'));
  C.mod = B2(C.arr_or_args_to_arr, B.reduce('(a, b) => a % b'));
  C.mul = B2(C.arr_or_args_to_arr, B.reduce('(a, b) => a * b'));
  C.div = B2(C.arr_or_args_to_arr, B.reduce('(a, b) => a / b'));

  C.parseInt = C.parse_int = function(v) { return parseInt(v, 10); };
  C.parseIntAll = C.parse_int_all = B2(C.arr_or_args_to_arr, B.map(C.parse_int));
  C.iadd = B2(C.parse_int_all, C.add);
  C.isub = B2(C.parse_int_all, C.sub);

  C.not = function(v) { return !v; };
  C.nnot = function(v) { return !!v; };

  C.and = B2(C.arr_or_args_to_arr, B.find_i(C.not), B.is(-1));
  C.or = B2(C.arr_or_args_to_arr, B.find(I), C.nnot);

  C.eq = B2(C.arr_or_args_to_arr, B.find_i(function(v, i, l) { return l[0] != v; }), B.is(-1));
  C.seq = B2(C.arr_or_args_to_arr, B.find_i(function(v, i, l) { return l[0] !== v; }), B.is(-1));
  C.neq = B2(C.eq, C.not);
  C.sneq = B2(C.seq, C.not);

  C.log = window.console && window.console.log ? console.log.bind ? console.log.bind(console) : function() { console.log.apply(console, arguments); } : I;
  C.error = window.console && window.console.error ? console.error.bind ? console.error.bind(console) : function() { console.error.apply(console, arguments); } : I;
  C.hi = B.args_pass(C.log);

  !function(B, C, notices) {
    C.noti = C.Noti = C.notice =  {
      on: on,
      once: B(X,X,X, true, on),
      off: off,
      emit: emit,
      emitAll: emitAll
    };

    B.noti = B.Noti = B.notice = {
      on: function() {
        var args = arguments;
        return function(func) { return A(args.length === 3 ? args :  _.isFunction(func) ? C.toArray(args).concat(func) : args, on); };
      },
      once: function(func) {
        var args = arguments;
        return function(func) { return A(C.toArray(args.length === 3 ? args :  _.isFunction(func) ? C.toArray(args).concat(func) : args).concat([true]), on) };
      },
      off: function() { return B.apply(null, C.toArray(arguments).concat(off)); },
      emit: function() {
        var args = arguments;
        return function(args2) { return A(args.length == 3 ? args : C.isArray(args2) ? C.toArray(args).concat([args2]) : args, emit) };
      },
      emitAll: function() {
        var args = arguments;
        return function(args2) { return A(args.length == 2 ? args : C.isArray(args2) ? C.toArray(args).concat([args2]) : args, emitAll) };
      }
    }; B.noti.emit_all = emitAll;

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
      else if (_notice && arguments.length == 2) each(_.isString(n2_or_n2s) ? [n2_or_n2s] : n2_or_n2s, B(_notice, C.unset));
    }

    function emitAll(name1, emit_args) {
      var key, _notice = notices[name1];
      if (_notice) for(key in _notice) C(_notice, key, emit_loop(emit_args));
    }

    function emit(name1, name2, emit_args) {
      var _notice = notices[name1];
      if (_notice) C(name2, [
        IF(_.isFunction, [J(void 0), name2, function(name2) { return _.isString(name2) ? [name2] : name2; }]).ELSEIF(_.isString, J([name2])).ELSE(I),
        B(X, B([B.all(J(_notice), I), IF([C.val, function(arr) { return arr && arr.length }], emit_loop(emit_args))]), each)
      ]);
    }

    function emit_loop(args) { return [B.tap(C.val, B(X, B([I, B(args, X, A)]), each)), function (_n, k) { _n[k] = C.reject(_n[k], B.val('is_once')); }];}
  }(B, C, {});

  C.remove_by_index = C.removeByIndex = removeByIndex;

  function removeByIndex(arr, from) {
    if (from !== -1) {
      var rest = arr.slice(from + 1 || arr.length);
      arr.length = from;
      arr.push.apply(arr, rest);
    }
    return from;
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
    return f || setTimeout(function() { (f = f || getValue(G, nodes)) || C.error(err) }, 500)
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

  function H() { return s.apply(null, [H, 'H', convert_to_html].concat(C.toArray(arguments))); }
  H.each = function() { return s_each.apply(null, [H].concat(C.toArray(arguments))); };
  H._ABC_func_storage = {};

  function s(func, obj_name, option, var_names/*, source...*/) {      // used by H and S
    var args = C.toArray(arguments);
    if (args.length == 4) (args[4] = args[3]) && (var_names = args[3] = '$');
    var source = C.map(C.rest(args, 4), function(str_or_func) {
      if (_.isString(str_or_func)) return str_or_func;

      var key = _.uniqueId("_ABC_func_storage");
      func._ABC_func_storage[key] = str_or_func;
      return obj_name + "._ABC_func_storage." + key;
    }).join("");

    return function() {
      var data = var_names ? C.object(var_names.match(/[\w\$]+/g), C.toArray(arguments)) : void 0;
      return C(source, data, [remove_comment, unescaped_exec, option, insert_datas1, insert_datas2, I]);
    };
  }

  function s_each(func, var_names/*, source...*/) {     // used by H.each and S.each
    var map = B.map(func.apply(null, C.rest(arguments)));
    return function(ary /*, args...*/) {
      return A([ary].concat(C.rest(arguments)), [map, function(res) { return res.join(""); }]);
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
    source = source.replace(new RegExp("^" + TABS() + "\\|"), "\n").replace(/^ */, "");
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

  function return_check(val) { return (val == null || val == void 0) ? '' : val; }
  /* H end */

  function I(v) { return v; }

  function IF(predicate, fn) {
    var store = [fn ? [predicate, fn] : [I, predicate]];
    return C.extend(IF, {
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

  function method(obj, method) { return obj[method].apply(obj, C.rest(arguments, 2)); }

  function MR(arg) {
    if (arguments.length <= 1) return arg;
    if (C.isArray(arg) && arg._ABC_is_returns) return arg;
    return C.extend(C.toArray(arguments), {_ABC_is_returns: true});
  }
  function toMR(arg) {
    if (C.isArray(arg) && arg._ABC_is_returns) return arg;
    return C.extend(C.values(arg), {_ABC_is_returns: true});
  }
  C.toMR = window.toMR = toMR;

  function S() { return s.apply(null, [S, 'S', function(s, d) { return MR(s, d); }].concat(C.toArray(arguments))); }
  S.each = function() { return s_each.apply(null, [S].concat(C.toArray(arguments))); };
  S._ABC_func_storage = {};

  function getValue(obj, key, keys) {
    return (function v(obj, i, keys, li) {
      return (obj = obj[keys[i]]) ? li == i ? obj : v(obj, i + 1, keys, li) : li == i ? obj : void 0;
    })(obj, 0, keys = key.split('.'), keys.length - 1);
  }

  X.context = X.this = function() { return this; };

  function hasPromise() { return hasPromise.__cache || (hasPromise.__cache = !!getValue(window, 'Promise.prototype.then')); }
}(typeof global == 'object' && global.global == global && (global.G = global) || window);

// Underscore.js 1.8. http://underscorejs.org
// (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
// Underscore may be freely distributed under the MIT license.
function respect_underscore(_) {
  var nativeKeys = Object.keys, toString = Object.prototype.toString, hasOwnProperty = Object.prototype.hasOwnProperty;

  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  var fn_names = ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'];
  for (var i = 0; i < fn_names.length; i++)
    (function(name) { _['is' + name] = function(obj) { return toString.call(obj) === '[object ' + name + ']'; }; })(fn_names[i]);
  if (!_.isArguments(arguments)) _.isArguments = function(obj) { return _.has(obj, 'callee'); };
  if (typeof /./ != 'function' && typeof Int8Array != 'object') _.isFunction = function(obj) { return typeof obj == 'function' || false; };

  _.has = function(obj, key) { return obj != null && hasOwnProperty.call(obj, key); };
  _.escape = (function(map) {
    var escaper = function(match) { return map[match]; };
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source), replaceRegexp = RegExp(source, 'g');
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