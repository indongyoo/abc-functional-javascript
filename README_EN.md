# abcjs
_abcjs is functional javascript library._


## Summary
 - It can be used in Web browser and NodeJS.
 - It supports asynchronous control simpler and handier than ‘Promise’ or ‘Monad’.
 - Even if the function is ‘asynchronous’, abc.js can make a logic structure as we make a ‘synchronous’ function.
 - There are functions which added the ‘asynchronous control’ feature : each, map, reduce, filter, reject, find, some, every, uniq
 - abc.js provides a HTML template engine of which grammar and function is similar to Jade.
 - abc.js provides functions which write SQL query easier.
 - The line of script file of abc.js is just 808 lines. Moreover, it doesn’t have a dependency to another javascript library.
 - abc.js respect underscore.js concept!

## Table of Contents
 - [A (apply)](https://github.com/marpple/abc-functional-javascript/blob/master/README_EN.md#01-a)
 - [B (bind)](https://github.com/marpple/abc-functional-javascript/blob/master/README_EN.md#02-b)
 - [C (call)](https://github.com/marpple/abc-functional-javascript/blob/master/README_EN.md#03-c)
 - [Pipeline with ABC](https://github.com/marpple/abc-functional-javascript/blob/master/README_EN.md#04-pipeline-with-abc)
 - [Async (callback)](https://github.com/marpple/abc-functional-javascript/blob/master/README_EN.md#05-asynccallback)
 - [Async-2 (Promise)](https://github.com/marpple/abc-functional-javascript/blob/master/README_EN.md#06-async-2promise)
 - [each, map, find, ...](https://github.com/marpple/abc-functional-javascript/blob/master/README_EN.md#07-eachmapfind)
 - [HTML Template](https://github.com/marpple/abc-functional-javascript/blob/master/README_EN.md#08-html-template)
 - [IF ELSEIF ELSE](https://github.com/marpple/abc-functional-javascript/blob/master/README_EN.md#09-if-elseif-else)
 - [B.all B.spread](https://github.com/marpple/abc-functional-javascript/blob/master/README_EN.md#10-ball-bdiv)
 - [this](https://github.com/marpple/abc-functional-javascript/blob/master/README_EN.md#11-this)
 - [ETC](https://github.com/marpple/abc-functional-javascript/blob/master/README_EN.md#12-etc)
 - [throw, ERR, CATCH](https://github.com/marpple/abc-functional-javascript/blob/master/README_EN.md#13-throw-err-catch)

### 01. [A](https://github.com/marpple/abc-functional-javascript/blob/master/README_EN.md/blob/master/example/01.%20A.html)
`A` is similar to `apply`.

```javascript
function add(a, b) {
    return a + b;
}

var r1 = A([20, 2], add); // add.apply(undefined, [20, 2]);
console.log(r1);
// 22
```
When reading a code, It is easy to read from left to right in general.

So, `A` changed the direction
 `data argument`, `function arguments`... :

In `A` function, argument which is not a function appears first, argument which is a function appears later.
```javascript
function minus(a, b) {
    return a - b;
}

var r2 = A([20, 5], function() {
    return A(arguments, minus);
});
console.log(r2);
// 15
```


### 02. [B](https://github.com/marpple/abc-functional-javascript/blob/master/example/02.%20B.html)
`B` is similar to `bind` and `_.partial` of underscore, but it is thisless.

```javascript
function minus(a, b) {
    return a - b;
}

var f1 = B(10, minus);
var r1 = f1(20);
console.log(r1);
// -10
```


Use `X` with `B`.

Through `X`, it can be possible to set a position of argument that will be populated after an execution.
```javascript
var f2 = B(X, 10, minus);
var r2 = f2(20);
console.log(r2);
// 10

function minus2(a, b, c, d) {
    return a - b - c - d;
}

var f3 = B(4, X, X, 1, minus2);
var r3 = f3(3, 2);
console.log(r3);
// -2
```



### 03. [C](https://github.com/marpple/abc-functional-javascript/blob/master/example/03.%20C.html)
`C` is similar to `call` without `this`.
```javascript
function minus(a, b) {
    return a - b;
}

var r1 = C(10, 20, minus);
console.log(r1);
// -10

var r2 = C(20, 10, minus);
console.log(r2);
// 10
```



### 04. [Pipeline with ABC](https://github.com/marpple/abc-functional-javascript/blob/master/example/04.%20Pipeline%20with%20ABC.html)
abcjs supports code pattern that looks like underscore’s `_.compose`, Jquery’s chain.

Object Oriented Chaining could change a value sequentially.

However, since it changes the value of the object itself, implementation is hard, although the use is easy.

Moreover, it has some restriction , because it only uses the method and the value of object itself.

Instead, abcjs uses `Pipeline-like` sequential function execution.

This `Pipeline-like` approach has advantages :
- more flexible
- can make a `pure function`.

abc.js didn’t make a special pipeline function.

You can use instantly pipeline pattern with `A`, `B`, and `C` function.

Furthermore, unlike `_.compose` , we changed the order which is easy to read.

It is easy : Put the array which has the functions as a last argument.

```javascript
function sum(a, b) {
    return a + b;
}

function square(a) {
    return a * a;
}

var r1 = C(1, 2, [
    sum,
    square,
    square,
    function(a) {
        console.log(a); // 81
        return a - 20;
    }]);

console.log(r1);
// 61
```
arguments `1,2` is passed into `sum`.

And the result of `sum` is passed to `square`, and so on ;

The result of function is passed as an arugument of next function.

Finally, the returned value of the last function will be the result of `C` execution.

Through `A`, You can use Pipeline pattern with array and arguments object.
```javascript
A([1, 2], [
    sum,
    square,
    square,
    function(a) {
        return a - 20;
    },
    function(r1) {
        console.log(r1);
        // 61
    }]);
```
Through `B`, you can build ‘big’ function by gathering ‘small’ functions.

Or, you can split ‘big’ function into small unit.

By assembling with small functions, code reusability increases.

```javascript
var f1 = B([
    sum,
    square,
    square,
    function(a) {
        console.log(a); // 81
        return a - 20;
    }]);

var r3 = f1(1, 2);
console.log(r3);
// 61
```
In the combination of functions,

with `X`, it can be possible to set a position of argument that will be populated after an execution.

```javascript
function minus(a, b) {
    return a - b;
}

var f2 = B(X, 10, [
    f1,
    B(X, 11, minus)
]);

var r4 = f2(-7);
console.log(r4);
// 50
```


This Supports Multiple results by `MR`.

```javascript
C(3, 2, [
    function(a, b) {
        return MR(a + b, a - b, a * b); // multiple results
    },
    function(a, b, c) {
        console.log(a, b, c);
        return MR(a, c); // multiple results
    },
    function(a, c) {
        console.log(a, c);
        return arguments;
    },
    C.toMR, // arguments to multiple results
    function(a, c) {
        console.log(a, c); // 5, 6
    }]);
```

```javascript
var minus = B(function(a, b) {
    console.log(a, b); // 20, 10
    return a - b;
});

var r5 = minus(10, 20);
console.log(r5); // -10

var swap = function(a, b) {
    return MR(b, a);
};
var r6 = minus(swap(10, 20));
console.log(r6);
// 10
```

`MR` is similar to `return` of Go.
[Go Lang - Multiple Results](https://tour.golang.org/basics/6)


```javascript
var difference = B([
    function(a, b) {
        return MR(Math.max(a, b), Math.min(a, b));
    },
    minus
]);

var r7 = difference(10, 20);
console.log(r7);
// 10

var r8 = difference(30, 10);
console.log(r8);
// 20
```


```javascript
var difference2 = B([
    C.args, // function() { return arguments },
    _.toArray,
    B.M('sort'), // function(a) { return a.sort(); },
    B.M('reverse'),  // function(a) { return a.reverse(); },
    C.toMR, // array to multiple results
    minus]);

var r9 = difference2(10, 20);
console.log(r9);
// 10

var r10 = difference2(30, 10);
console.log(r10);
// 20

var difference3 = B([minus, Math.abs]);

var r11 = difference3(10, 20);
console.log(r11);
// 10

var r12 = difference3(30, 10);
console.log(r12);
// 20
```



### 05. [Async(callback)](https://github.com/marpple/abc-functional-javascript/blob/master/example/05.%20Async%20(callback).html)
'A' offers a variety of features related to asynchronous.

Async with Pipeline.

```javascript
function delay(func) {
    setTimeout(function() {
        func();
    }, 1000);
}

function sum(a, b, cb) {
    delay(function() {
        cb(a + b);
    });
}

function minus(a, b, cb) {
    delay(function() {
        cb(a - b);
    });
}

function square(a, cb) {
    delay(function() {
        cb(a * a);
    });
}

sum(10, 20, function (r) {
    console.log(r); // 30
});

minus(10, 7, function(r) {
    console.log(r); // 3
});

sum(5, 7, function(r) {
    minus(r, 5, function(r) {
        square(r, function(r) {
            console.log(r); // 49
        });
    });
});
```

```javascript
CB(sum, minus, square);

C(5, 10, [
    sum,
    CB(function(r, cb) {
        minus(r, 5, cb);
    }),
    square,
    function(r) {
        console.log(r); // 100
    }
]);
```

```javascript
.then(function() {
  return new Promise(function(rs) {
      sum(5, 10, rs)
  });
}).then(function() {
  return new Promise(function(rs) {
      minus(5, 10, rs)
  });
});
```

So Simple!!

Multiple results
```javascript
C(5, 9, [
    sum,
    CB(function(a, cb) {
        delay(function() {
            cb(a, 10); // auto multiple results
        });
    }),
    minus,
    function(r) {
        console.log(r); // 4
    }
]);
```


```javascript
var $ = {};

$.get = function(url, cb) {
    delay(function() {
        cb({
            a: 5,
            b: 3
        });
    });
};

$.post = function(url, data, cb) {
    delay(function() {
        cb(_.extend(data, { created_at: new Date() }));
    });
};

$.put = function(url, data, cb) {
    delay(function() {
        cb(_.extend(data, { updated_at: new Date() }));
    });
};
```
`$.get`, `$.post`.
```javascript
C([
    CB(function(cb) {
        $.get("/get_data", cb);
    },
    function(data, cb) {
        console.log(_.clone(data)); // {a: 5, b: 3}
        $.post("/post_data", _.extend(data, { c: 10 }), cb);
    },
    function(data, cb) {
        console.log(_.clone(data)); // {a: 5, b: 3, c: 10, created_at: Tue Sep 13 2016 04:01:19 GMT+0900 (KST)}
        $.put("/put_data", _.extend(data, { c: 5 }), cb);
    }),
    function(r) {
        console.log(r);
        // {a: 5, b: 3, c: 5, created_at: Tue Sep 13 2016 04:03:58 GMT+0900 (KST), updated_at: Tue Sep 13 2016 04:03:59 GMT+0900 (KST)}
    }
]);
```

`B` is similar to `_.partial`. Function is last argument.
```javascript
CB($.get, $.post, $.put);

C([
    B("/get_data", $.get),
    B({ c: 20 }, _.extend),
    B("/post_data", $.post),
    B({ c: 30 }, _.extend),
    B("/put_data", $.put),
    function(r) {
        console.log(r);
        // {c: 20, a: 5, b: 3, created_at: Tue Sep 13 2016 04:01:19 GMT+0900 (KST), updated_at: Tue Sep 13 2016 04:01:20 GMT+0900 (KST)}
    }
]);
```

```javascript
function J(v) {
 return function() {
     return v;
 }
}
```

```javascript
C([
    J(MR("/post_data", { aka: 'Cojamm' })),
    $.post,
    function(r) {
        console.log(r); // {aka: "Cojamm", created_at: Tue Sep 13 2016 04:01:18 GMT+0900 (KST)}
    }
]);
```

```javascript
function sum(a, b, cb) {
    delay(function() {
        cb(a + b);
    });
}
function minus(a, b, cb) {
    delay(function() {
        cb(a - b);
    });
}
function square(a, cb) {
    delay(function() {
        cb(a * a);
    });
}
var sq = B(square);
var m5 = B(X, 5, minus);
var s = B(sum);
var log = B(function() {
    console.log.apply(console, arguments);
});
log(sq(m5(s(10, 10))));
console.log('216 line');
```


### 06. [Async-2(Promise)](https://github.com/marpple/abc-functional-javascript/blob/master/example/06.%20Async-2%20(Promise).html)
abcjs supports Promise.

```javascript
function delay() {
    return new Promise(function(rs) {
        setTimeout(function() {
            rs();
        }, 1000);
    })
}

function sum(a, b) {
    return delay().then(function() {
        return a + b;
    });
}

function minus(a, b) {
    return delay().then(function() {
        return a - b;
    });
}

function square(a) {
    return delay().then(function() {
        return a * a;
    });
}

// Promise
sum(2, 4)
    .then(function(r) {
        return minus(r, 4);
    }).then(function(r) {
        return square(r);
    }).then(function(r) {
        console.log(r); // 4
    });

// ABC
C(3, 6, [
    sum,
    function(r) {
        return minus(r, 5);
    },
    square,
    function(r) {
        console.log(r); // 16
    }]);
```

```javascript
C(5, 5, [
    sum,
    square
]).then(function(r) {
    console.log(r); // 100
});

sum(2, 4)
    .then(function(r) {
        return C(r, 2, [
            sum,
            square
        ]);
    }).then(function(r) {
        console.log(r); // 64
    });

sum(2, 4)
    .then(B(X, 2, [
        sum,
        square
    ])).then(function(r) {
        console.log(r); // 64
    });

C(5, 5, [
    sum,
    square,
    CB(function(r, cb) {
        cb(r / 2)
    })
]).then(function(r) {
    console.log(r); // 50
});
```
`function hasPromise() { (window || global).Promise.prototype.then; }`
`hasPromise() ? new Promise(function(rs) { resolve = rs; }) : { then: function(rs) { resolve = rs; } })`



### 07. [each...map...find...](https://github.com/marpple/abc-functional-javascript/blob/master/example/07.%20each...map...find....html)
  1. Possible to put more arguments in addition to the array or object.
    - ex) [1, 2, 3], arg1, arg2, arg3 => value, key, list, arg1, arg2, arg3 ...
  2. Async.
  3. Pipeline iteratee, Pipeline predicate.
  4. `C.map` is general. `B.map` concept is _.partial.
  5. thisless.

```javascript
function delay(func) {
    setTimeout(function() {
        func();
    }, 1000);
}

function sum(a, b) {
    return a + b;
}

function square(a) {
    return a * a;
}

C.each([1, 2, 3], function(v) {
    console.log(v);
});
// 1
// 2
// 3

var r1 = C.map([1, 2, 3], square);
console.log(r1); // [1, 4, 9]

/* Pipeline iteratee */
var r2 = C.map({ a: 1, b: 2, c: 3 }, [I, square]);
console.log(r2); // [1, 4, 9]

var r3 = C.map([1, 2, 3], 5, function(v, i, l, a) { //val, idx, list, 5
    return sum(v, a);
});
console.log(r3); // [6, 7, 8]

/* B.args(0, 3) => value, 5 */
var r4 = C.map([1, 2, 3], 5, [B.args(0, 3), sum]);
console.log(r4); // [6, 7, 8]


var r6 =
    C({ a: 1, b: 2, c: 3 }, [
        B.map(I), // [1, 2, 3] // function I(v) { return v; }
        B.map(square), // [1, 4, 9]
        function(v) { return MR(v, 0); },
        B.reduce(function(memo, v) {
            return memo + v;
        })]);
console.log(r6); // 14

var minus = function(a, b) {
    return a - b;
};

C({ a: 1, b: 2, c: 3 }, [
    B.map(I), // [1, 2, 3]
    B.map(square), // [1, 4, 9]
    function(v) { return MR(v, 0); },
    B.reduce([B.args(0, 1), minus]),
    function(r7) {
        console.log(r7); // -14
    }]);

var minus2 = CB(function(a, b, cb) {
    delay(function() {
        cb(a - b);
    });
});
```


No need to modify the code for asynchronous.
```javascript
C({ a: 1, b: 2, c: 3 }, [
    B.map(I), // [1, 2, 3]
    B.map(square), // [1, 4, 9]
    function(v) { return MR(v, 0); },
    B.reduce([B.args(0, 1), minus2]), // Async
    function(r7) {
        console.log(r7); // -14
    }]);

var users = [
    { id: 1, age: 20, activated: true  },
    { id: 2, age: 20, activated: false },
    { id: 3, age: 31, activated: false },
    { id: 4, age: 32, activated: true },
    { id: 5, age: 17, activated: true },
    { id: 6, age: 32, activated: true }
];

C(users, [
    B.filter(B.v('activated')),
    B.reject(function(user) {
        return user.age > 30;
    }),
    B.map(B.v('age')),
    function(r8) {
        console.log(r8); // [20, 17]
    }]);

C(users, [
    B.uniq('$.age'),
    B.map(B.v('id')),
    function(r9) {
        console.log(r9); // [1, 3, 4, 5]
    }]);

C(users, [
    G[":reject :age > 30"] = B.reject(function(user) {
        return user.age > 30;
    }),
    B.every(B.v('activated')),
    function(r10) {
        console.log(r10); // false
    }]);

C(users, [
    G[":reject :age > 30"],
    B.some(B.v('activated')),
    function(r11) {
        console.log(r11); // true
    }]);
```

Functions for Array and Object.
`C.each`, `C.map`, `C.reduce`, `C.filter`, `C.reject`, `C.find`, `C.find_index`, `C.some`, `C.every`, `C.uniq`,
`B.each`, `map`, `B.reduce`, `B.filter`, `B.reject`, `B.find`, `B.find_index`, `B.some`, `B.every`, `B.uniq`



### 08. [HTML Template](https://github.com/marpple/abc-functional-javascript/blob/master/example/08.%20HTML%20Template.html)

Support Async.

```javascript
C([
    H('', '\
        .member[style="border: 1px solid #000; padding: 20px;"]\
            h3 People\
            ul\
                li Cojamm\
                li BJ\
                li JM\
                li PJ\
                li HA\
                li JE\
        #id1.class1.class2[class=class3] hi\
        .service\
            a[href=http://www.marpple.com target=_blank] http://www.marpple.com\
        textarea[rows=10].\
            Custom T-Shirts\
            \
            \
            Design Platform\
            Artwork\
        br\
        p hello\
        textarea\
            | foo bar\
            | hello world'),
    $,
    B.M('appendTo', 'body')]);


hr();
```


```javascript
C({ name: 'Cojamm', age: 32 }, [
  H('user', '\
      .person\
          .name {{user.name}}\
          .age {{user.age}}'),
  $,
  B.M('appendTo', 'body')]);

hr();

var post = {
    body: '<em>하이</em> <a href="https://www.youtube.com/watch?v=4tdOzlB6I7w" target="_blank">랩이나 잘하라고</a>',
    name: 'Cojamm',
    created_at: new Date()
};

C(post, [
    H('post', '\
        .name name: {{post.name}}\
        .body body: {{post.body}}\
        .created_at created at: {{post.created_at}}'),
    $,
    B.M('appendTo', 'body')]);

hr();

delete post.name;

window.moment_lll = B([moment, B.M('format', 'lll')]);

C(post, [
    H('post', '\
        .name name: {{post.name || "anonymous"}}\
        .body body: {{{post.body}}}\
        .created_at created at: {{moment_lll(post.created_at)}}'),
    $,
    B.M('appendTo', 'body')]);

hr();
```


You can use function.
```javascript
var songs = [
    'The Riddle Of The Model',
    'Up',
    'To Find You',
    'A Beautiful Sea',
    'Drive It Like You Stole It',
    'Up (Bedroom Mix)',
    'Girls',
    'Brown Shoes'];

C(songs, [
    H('songs', '\
        h3 Sing Street OST\
        ul\
            {{{C(songs, ', function(songs) {
                return _.map(songs, function(song, i) {
                    return '<li>' + (i+1) + '. ' + song + '</li>';
                }).join("");
            },')}}}'),
    $,
    B.M('appendTo', 'body')]);

hr();
```
`{{C(a, ', function() {},')}}`

`H.each`, `S.each`
```javascript
C(songs, [
    H('songs', '\
        h3 Sing Street OST\
        ul\
            !{C(songs, ', S.each('song, i', '\
                li {{i+1}}. {{song}}'),
            ')}!'),
    $,
    B.M('appendTo', 'body')]);


hr();
```


Process
  1. `!{}!`
  2. H to HTML
  3. `{{{}}}`
  4. `{{}}`

```javascript
var sum = CB(function (a, b, cb) {
    delay(function() {
        console.log(a + b);
        cb(a + b);
    });
});

C(songs, [
    H('songs', '\
        h3 Sing Street OST\
        ul\
            {{{C(songs, ', H.each('song, i', '\
                li {{C(i, 1, sum)}}. {{song}}'), // delay
            ')}}}'),
    $,
    B.M('appendTo', 'body'),
    function() {
        $("html, body").animate({ scrollTop: $(window).scrollTop() + $(window).height() });
    }]);
```


SQL
```javascript
C({ id: 5, body: "foo bar" }, [
    _.values,
    C.toMR,
    S('id, body', "update posts set body = '{{body}}' where id = {{id}};"),
    function(query) {
        console.log(query);
    }]);
```



### 09. [IF ELSEIF ELSE](https://github.com/marpple/abc-functional-javascript/blob/master/example/09.%20IF%20ELSEIF%20ELSE.html)

If long_time is async function, it is difficult to write the following code:

```javascript
if (long_time(1)) {
   long_time(2);
 } else if (long_time(3)) {
   long_time(4);
 } else {
   long_time(5);
 }
```
If `long_time(1)` result is undefined, it operates only `long_time(1)` and `long_time(5)`.

`IF().ELSEIF().ELSE()` works well in an asynchronous.

```javascript
IF(
   predicate,
   body
)
```


```javascript
IF(
   body
)

// same IF(_.identity, body)

```

argument of `ELSE` is only body.

Supports pipeline.
```javascript
IF([p1, p2, p3], [f1, f2, f3])
```

```javascript
function f1() {
        console.log('f1')
    }

    function f2() {
        console.log('f2')
    }

    C(true, IF(f1).ELSE(f2));
    // f1

    C(false, IF(f1).ELSE(f2));
    // f2

    C(0,
        IF(f1)
        .ELSEIF(function(v) { return v === 0 },
            function(v) {
                console.log(v);
            })
        .ELSE(f2));
    // 0

    C(5, 0,
        IF(I, f1 // function I(v) { return v };
        ).ELSEIF(function(a, b) { return a < b },
            function(a, b) { console.log(a); }
        ).ELSE(f2));
    // f1

    C(0, 5,
        IF(I, f1
        ).ELSEIF(function(a, b) { return a > b },
            function(a, b) { console.log(a); }
        ).ELSE(f2));
    // f2

    C(0, 5,
        IF(I, f1
        ).ELSEIF(_.negate(function(a, b) { return a > b }),
            function(a, b) { console.log(a+b); }
        ).ELSE(f2));
    // 5
```


Async
```javascript
G["a < b long time"] = CB(function(a, b, cb) {
    setTimeout(function() {
        console.log('1 sec');
        setTimeout(function() {
            console.log('2 sec');
            cb(a < b);
        }, 1000)
    }, 1000);
});

C(0, 5,
    IF(I, f1
    ).ELSEIF(G["a < b long time"],
        function(a, b) { console.log(a+b); }
    ).ELSE(f2));
// 5
```

```javascript
var square_long_time = CB(function(a, cb) {
    setTimeout(function() {
        cb(a * a);
    }, 1000);
});

C(0, 5, [
    IF(I, f1
    ).ELSEIF(G["a < b long time"],
        [function(a, b) { return a + b; },
        square_long_time]
    ).ELSE(f2),
    function(a) {
        return a + 10;
    },
    function(r) {
        console.log(r);
        // 35
    }]);
```


In order to implement the `IF().ELSEIF().ELSE()`, a separate code for asynchronous was not necessary at all.

```javascript
 // abc.js 459 line
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
```



### 10. [B.all B.spread](https://github.com/marpple/abc-functional-javascript/blob/master/example/09.%20IF%20ELSEIF%20ELSE.html)
`B.all`
```javascript
C(1, 5, [
    B.all(
        function(a, b) { return a + b; }, // a

        [function(a, b) { return a - b; },
        function(a) { return a * a; }],  // b

        function(a, b) { return MR(a, b); }  // c, d (multiple results)
    ),
    function(a, b, c, d) {
        console.log(a, b, c, d); // 6, 16, 1, 5
    }]);
```


`B.spread`
```javascript
C(1, 2, 3, 4, [
    B.spread(
        function(a) { return a + a; }, // a

        [function(a) { return a + a; },
        function(a) { return a * a; }], // b

        function(a) { return MR(a, a - a); }  // c, d (multiple results)
    ),
    function(a, b, c, d, e) {
        console.log(a, b, c, d, e); // 2, 16, 3, 0, 4
    }]);

C(1, 2, 3, 4, [
    B.spread(
        function(a) { return a + a; }, // a

        [function(a) { return a + a; },
        function(a) { return a * a; }], // b

        function(a) { return MR(a, a - a); }, // c, d

        I, // e
        I  // f  ** argument is undefined.
    ),
    function(a, b, c, d, e, f) {
        console.log(a, b, c, d, e, f); // 2, 16, 3, 0, 4, undefined
    }]);
```


```javascript
C(1, 5, [
    B.all(
        function(a, b) { return a + b; }, // a

        [function(a, b) { return a - b; },
        function(a) { return a * a; }],  // b

        function(a, b) { return MR(a, b); }  // c, d (multiple results)
    ),
    C.args,
    C.toArray,
    function(a) {
        console.log(a); // [6, 16, 1, 5]
    }]);
```

### 11. [this](https://github.com/marpple/abc-functional-javascript/blob/master/example/11.%20this.html)


#### A

```javascript
var r1 = A([1, 2], [
    function(a, b) {
        return a + b + this.c;
    },
    function(a) {
        return a * this.c;
    }
], { c: 5 });
console.log(r1); // 40
````


#### B

```javascript
var user1 = {
    firstName: "jamm",
    lastName: "Co",
    getName1: B(function() {
        return this.lastName + ' ' + this.firstName;
    }),
    getName2: B([
        B.all(function() {
            return this.firstName;
        }, function() {
            return this.lastName;
        }),
        function(a, b) {
            return a + ' ' + b;
        }
    ])
};

console.log(user1.getName1()); // Co jamm
console.log(user1.getName2()); // jamm Co

var same_age_friends = B([
    function() {
        return this.friends;
    },
    B.filter(function(friend) { return friend.age == this.me.age })
]);

var r2 = same_age_friends.call({
    friends: [
        { id: 1, name: "a", age: 10 },
        { id: 2, name: "b", age: 12 },
        { id: 3, name: "c", age: 12 },
        { id: 4, name: "d", age: 13 }
    ],
    me: { id: 5, name: "e", age: 12 }
});

console.log(JSON.stringify(r2)); // [{"id":2,"name":"b","age":12},{"id":3,"name":"c","age":12}]
```


#### C
```javascript
var r3 = C.call({ c: 5 }, 1, 2, [
    function(a, b) {
        return a + b + this.c;
    },
    function(a) {
        return a * this.c;
    }
]);
console.log(r3); // 40
```


#### with jQuery
```html
<button type="button">go</button>
```
```javascript
$(function() {
    $('button').click(B([
        CB(function(e, next) {
            return $(this).animate({
                'margin-left': 300
            }, 1000, next);
        }),
        function() {
            $(this).text('finish');
        }
    ]));
});
// go --------------> finish
```

The `this` keyword is very important in Object Oriented Programming. Since it has to change the state of the object and refer of it.

However, it’s difficult to handle abstract `this` keyword.

A state to manage through ‘this’ is value. There is no need to deal with the value through 'Class'.

Our strategy In abc.js to deal with the state :

Deal with the value by making a new value through `function`.



### 12. [throw, ERR, CATCH](https://github.com/marpple/abc-functional-javascript/blob/master/example/13.%20CATCH.html)
```javascript
C([
    function() {
        console.log(1);
    },
    function() {
        console.log(2);
        throw 2;
    },
    function() {
        console.log(3);
    },
    CATCH(function(e) {
        console.log(4, e);
    })]);
// 1
// 2
// 4, Error: 2(…)
console.log('-------------------------');

C([
    function() {
        console.log(1);
    },
    function() {
        console.log(2);
        return ERR(2);
    },
    function() {
        console.log(3);
    },
    CATCH(function(e) {
        console.log(4, e);
    }),
    function() {
        console.log(5);
    }]);
// 1
// 2
// 4, Error: 2(…)
// 5
console.log('-------------------------');

C([
    function() {
        console.log(1);
        return ERR('custom data', {
            type: 1,
            msg: 'hi'
        });
    },
    CATCH(function(e) {
        if (e.type == 1) {
            console.log(e.msg, e);
        } else {
            console.log('else');
        }
    })]);
// 1
// hi Error: custom data(…)
console.log('-------------------------');

C([
    function() {
        console.log(1);
    },
    function() {
        console.log(2);
    },
    function() {
        console.log(3);
    },
    CATCH(function(e) {
        console.log(4, e);
    }),
    function() {
        console.log(5);
    }]);

// 1
// 2
// 3
// 5
console.log('-------------------------');

C([
    function() {
        console.log(1);
    },
    function() {
        return C([
            function() {
                console.log(2);
            },
            function() {
                console.log(3);
                throw 3
            },
            function() {
                console.log(4);
            },
            CATCH(function(e) {
                console.log(5, e);
            }),
            function() {
                console.log(6);
            },
            function() {
                console.log(7);
                return ERR(7);
            }
        ])
    },
    function() {
        console.log(8);
    },
    CATCH(function(e) {
        console.log(9, e);
        return 'hi'
    }),
    function(a) {
        console.log(10, a);
    }
]);
// 1
// 2
// 3
// 5 Error: 3(…)
// 6
// 7
// 9 Error: 7(…)
// 10 'hi'

console.log('-------------------------');

// for async
var go = B([
    function(a) {
        console.log(1);
        return a;
    },
    CB(function(a, next) {
        console.log(2);
        setTimeout(function() {
            next(a == 1 ? 2 : ERR(2));
        }, 500)
    }),
    function() {
        console.log(3);
    },
    function() {
        console.log(4);
        return 'complete';
    },
    CB(CATCH(function(e, next) {
        console.log(5, e);
        setTimeout(function() {
            // rollback
            next('fail');
        }, 1000);
    })),
    function(a) {
        console.log(a);
        console.log('------------------')
    }
]);

go(1).then(function() {
    // 1
    // 2
    // 3
    // 4
    // complete

    go(2);
    // 1
    // 2
    // 5 Error: 2(…)
    // fail
});
```
