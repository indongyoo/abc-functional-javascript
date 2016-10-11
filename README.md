# abcjs
_abcjs는 함수형 자바스크립트(functional javascript) 라이브러리입니다._

## 특징
  - Web browser와 NodeJS에서 사용할 수 있습니다.
  - Promise, jQuery Deferred Object, Future 등의 모나드식 해법 보다 간결하고 편리한 비동기 제어를 지원합니다.
  - 비동기 함수일지라도 동기 함수를 작성하듯이 논리 구조를 만들 수 있습니다.
  - 비동기 제어 기능을 더한 `each`, `map`, `reduce`, `filter`, `reject`, `find`, `findIndex`, `some`, `every`, `uniq` 함수가 있습니다.
  - Jade와 비슷한 HTML Template 함수가 있습니다. 함수 사용과 비동기 함수를 지원합니다.
  - sql 등을 작성하기 편한 함수가 있습니다.
  - 다른 자바스크립트 라이브러리에 대한 의존성이 없는 작은 라이브러리입니다.
  - _Respect Underscorejs!_

## 함수형 자바스크립트 관련글
  1. [함수형 자바스크립트의 실용성 1](https://github.com/marpple/abc-functional-javascript/wiki/%ED%95%A8%EC%88%98%ED%98%95-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EC%9D%98-%EC%8B%A4%EC%9A%A9%EC%84%B1-1)
  2. [함수형 자바스크립트의 실용성 2](https://github.com/marpple/abc-functional-javascript/wiki/%ED%95%A8%EC%88%98%ED%98%95-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EC%9D%98-%EC%8B%A4%EC%9A%A9%EC%84%B1-2)
  3. [Underscorejs 만들기 1](https://github.com/marpple/abc-functional-javascript/wiki/Underscorejs-%EB%A7%8C%EB%93%A4%EA%B8%B0-1-(_.map,-_.each))
  4. [Promise와 abcjs의 비동기 프로그래밍 비교](https://github.com/marpple/abc-functional-javascript/wiki/Promise%EC%99%80-abcjs%EC%9D%98-%EB%B9%84%EB%8F%99%EA%B8%B0-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D-%EB%B9%84%EA%B5%90)

## 시작하기
__abcjs와 함께 함수형 프로그래밍을 즐겨보세요.__

## 목차
 - [A (apply)](https://github.com/marpple/abc-functional-javascript/blob/master/README.md#01-a)
 - [B (bind)](https://github.com/marpple/abc-functional-javascript/blob/master/README.md#02-b)
 - [C (call)](https://github.com/marpple/abc-functional-javascript/blob/master/README.md#03-c)
 - [Pipeline with ABC](https://github.com/marpple/abc-functional-javascript/blob/master/README.md#04-pipeline-with-abc)
 - [Async (callback)](https://github.com/marpple/abc-functional-javascript/blob/master/README.md#05-asynccallback)
 - [Async-2 (Promise)](https://github.com/marpple/abc-functional-javascript/blob/master/README.md#06-async-2promise)
 - [each, map, find, ...](https://github.com/marpple/abc-functional-javascript/blob/master/README.md#07-eachmapfind)
 - [HTML Template](https://github.com/marpple/abc-functional-javascript/blob/master/README.md#08-html-template)
 - [IF ELSEIF ELSE](https://github.com/marpple/abc-functional-javascript/blob/master/README.md#09-if-elseif-else)
 - [B.all B.spread](https://github.com/marpple/abc-functional-javascript/blob/master/README.md#10-ball-bspread)
 - [this](https://github.com/marpple/abc-functional-javascript/blob/master/README.md#11-this)
 - [ETC](https://github.com/marpple/abc-functional-javascript/blob/master/README.md#12-etc)
 - [throw, ERR, CATCH](https://github.com/marpple/abc-functional-javascript/blob/master/README.md#13-throw-err-catch)

### 01. [A](https://github.com/marpple/abc-functional-javascript/blob/master/README.md/blob/master/example/01.%20A.html)

`A`는 `apply`와 비슷합니다.

```javascript
function add(a, b) {
    return a + b;
}

var r1 = A([20, 2], add); // add.apply(undefined, [20, 2]);
console.log(r1);
// 22
```



왼쪽에서 오른쪽, 위에서 아래로 읽는게 편안합니다. 그래서 `A`는 인자와 함수사용에 대한 방향을 바꾸었습니다.
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
배열이나 arguments객체를 사용하면 됩니다.


### 02. [B](https://github.com/marpple/abc-functional-javascript/blob/master/example/02.%20B.html)
`B`는 `this`를 제외한 `bind`라고 생각하면 쉽습니다.
혹은 underscore의 `_.partial`과 유사합니다.
```javascript
function minus(a, b) {
    return a - b;
}

var f1 = B(10, minus);
var r1 = f1(20);
console.log(r1);
// -10
```


`B`를 `X`와 함께 사용해보세요.
`X`를 통해 이후 실행시에 받게될 인자의 자리를 지정해둘 수 있습니다.
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
`C`는 `this`를 제외한 `call`이라고 생각하면 쉽습니다.
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
abcjs는 underscore의 `_.compose`나 jQuery의 chain과 유사한 코드 패턴을 지원합니다.
객체지향적인 체인방식은 연속적으로 값을 변경해나갈 수 있지만 자신이 가진 값을 바꾸는 방법이기 때문에 사용은 쉽지만 구현이 어렵습니다.
또한 자신이 가진 메소드와 자신의 값만을 사용하기 때문에 제약이 있습니다. 파이프라인과 같은 연속적인 함수 실행 방식은 체인방식보다 유연하고 순수 함수들을 만들 수 있어 좋습니다.

abcjs에서는 별도의 파이프라인 함수를 만들지 않고 기본 함수 실행 함수인 ABC에서 파이프라인 패턴을 바로 사용할수 있도록 했습니다.
또한 `_.compose`와 달리 읽기 쉬운 방향으로 순서를 바꿨습니다. 쉽습니다. 마지막 인자 자리에 함수 대신 배열로 함수들을 나열하기만 하면 됩니다.
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


`1, 2` 인자는 `sum`에게 `sum`의 결과는 `square`에게 그리고 그 함수의 결과는 계속 다음 함수의 인자로 넘어갑니다. 그리고 마지막 함수의 return 값은 `C`의 실행 결과가 됩니다.

`A`를 이용하면 배열과 arguments객체로 파이프라인 패턴을 사용할 수 있습니다.
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


`B` 함수를 이용하면 작은 함수를 모아 큰 함수를 만들 수 있습니다. 혹은 큰 함수를 작은 단위로 쪼갤 수 있습니다. 작은 함수가 많아지면 코드 재활용률을 높일 수 있습니다.
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


함수 조합에서도 `X`와 함께 사용하여 인자를 미리 적용 해둘 수 있습니다.
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


chain 패턴이나 `_.compose`, `Promise` 등의 일종의 파이프라인 혹은 모나드 등에서 아쉬운점은 함수 모음의 첫번째 함수를 제외하고는 인자를 하나만 받을 수 있다는 점 입니다.

`B(X, 11, minus)` 를 통해 두개의 인자가 사용되도록 했지만 여전히 사실은 위에서 부터 내려오는 인자는 하나입니다.

인자를 하나만 받는 함수만 조립할 수 있다면 실용성이 떨어지고 인자가 두개 이상 필요한 함수를 사용하기 위해선 항상 wrapper 함수가 있어야합니다.
이를 위해 `MR`이 있습니다. `MR`을 이용하면 다음 함수가 여러개의 결과를 인자로 받을 수 있습니다.
`MR` 사용은 아래와 같은 두가지 사용법이 있습니다.
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


`B`를 통해 함수를 정의하면 ABC를 이용하지 않고도 `MR()`을 동작 시킬 수 있습니다.
```javascript
var minus = B(function(a, b) {
    console.log(a, b); // 20, 10
    return a - b;
});

var r5 = minus(10, 20);
console.log(r5); // -10

/* swap 함수의 multiple results를 바로 minus에게 넘김 */
var swap = function(a, b) {
    return MR(b, a);
};
var r6 = minus(swap(10, 20));
console.log(r6);
// 10
```
`MR`은 Go언어의 Multiple Results와 비슷합니다.
[GO Lang - Multiple Results](https://tour.golang.org/basics/6)


함수 조립의 즐거움을 맛보세요.
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



abcjs의 다른 함수를 활용하면  `difference`를 아래와 같이 구현할 수도 있습니다.
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
abcjs에서는 비동기 제어와 관련된 다양한 기능을 제공합니다.
파이프라인에서 사용할 콜백 패턴의 함수를 `CB` 함수로 한번 넘겨 두기만 하면 됩니다.
`CB`가 감싸졌던 `f1`이라는 함수를 파이프라인에 넣어두면 `C`함수 안에서 `f1`에게 필요한 callback 함수를 생성하여 마지막 인자로 넣어줍니다.
생성된 callback 함수로 값을 꺼낸 후 파이프라인의 다음 함수에게 결과를 전달합니다.
`CB`로 감싼 후 callback 함수 인자의 자리만 제외하고 실행하거나 `CB(익명함수)`를 통해 `C`에게 받은 callback 함수를 사용하여 결과를 다음 함수로 전달할 수 있습니다.
Promise와 달리 여러개의 인자를 다음 함수로 주고 있던 함수이더라도 여러개의 인자로 받을 수 있습니다.
이런 콜백 함수와 사용할때 유용합니다. `function(err, data) { ... }`

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

`CB`를 감싸두기만 하면 됩니다. 파이프라인이 넘겨준 `CB` 함수를 이용하여 값을 넘기면 다음 함수로 전달됩니다.
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

`B`를 활용하여 좀더 간략하게 만들 수 있습니다.
```javascript
C(5, 9, [
    sum,
    B(X, 5, minus),
    square,
    function(r) {
        console.log(r); // 81
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

이 방법은 일반 콜백함수를 Promise로 제어하는 것보다 간단합니다. 또한 새로운 함수를 만들지 않으며 `CB`를 감싼 뒤라도 콜백 패턴의 함수를 원래 사용하던대로 사용할 수도 있습니다.
유사한 개념이지만 새로운 함수를 뱉는 `Promise.promisify` 보다 단순하고 새로운 개념을 알 필요가 없습니다.
`.then()`과 달리 multiple results도 가능합니다.
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
`$.get`, `$.post` 등과 유사한 위와 같은 함수가 있다고 가정할때 아래와 같이 활용할 수 있습니다.
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

`B`를 활용하면 더욱 깔끔하게 만들 수 있습니다.
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

`J`와 `MR`을 활용하면 다음과 같이 사용할 수 있습니다.
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
_*참고 - 실제 jQuery의 `$.get` 함수등은 `{ then: func.. }` 를 리턴하기 때문에 `CB`로 감싸는 방식으로 구현할 필요 없습니다._

```javascript
/* B를 감싸서 함수를 만들어두면 아래와 같이도 사용할 수 있습니다. 비동기 함수를 아래와 같이도 사용할 수 있습니다. */
CB(sum, minus, square);
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
abcjs는 Promise가 필요 없지만 `.then`을 리턴하는 함수의 비동기 제어를 지원합니다.
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


아래와 같이 마지막 결과를 `then`으로 받을 수 있어 Promise와 함께 사용이 가능합니다.
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

// B를 사용하면 더욱 간단하게 만들 수 있습니다.
sum(2, 4)
    .then(B(X, 2, [
        sum,
        square
    ])).then(function(r) {
        console.log(r); // 64
    });

// CB와 함께 사용 가능합니다.
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
만일 es6 Promise나 Promise Library가 있다면 `C()`는 Promise 객체를 리턴합니다.
그렇지 않다면 `C()`의 리턴 값이 `{}.then()`의 형태를 띄지만 Promise 객체는 아닙니다.
`function has_promise() { (window || global).Promise.prototype.then; }`
`has_promise() ? new Promise(function(rs) { resolve = rs; }) : { then: function(rs) { resolve = rs; } })`



### 07. [each...map...find...](https://github.com/marpple/abc-functional-javascript/blob/master/example/07.%20each...map...find....html)
underscorejs의 `each`, `map`, `find` 등의 함수보다 편의성을 높였습니다.
  1. this는 사용하지 않으며 대신 iteratee 함수에게 인자를 여러개를 넘길 수 있습니다.
    - ex) [1, 2, 3], arg1, arg2, arg3 => value, key, list, arg1, arg2, arg3 ...
  2. 비동기 제어가 됩니다.
  3. iteratee나 predicate 함수를 파이프라인으로 만들 수 있습니다.
  4. 즉시 실행인 `C.map`과 부분 실행 컨셉의 `B.map`이 있어 파이프라인에서 편하게 사용할 수 있습니다.

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

/* iteratee 함수를 파이프라인으로 만들 수 있습니다. */
var r2 = C.map({ a: 1, b: 2, c: 3 }, [I, square]);
console.log(r2); // [1, 4, 9]

var r3 = C.map([1, 2, 3], 5, function(v, i, l, a) { //val, idx, list, 5
    return sum(v, a);
});
console.log(r3); // [6, 7, 8]

/* B.args는 들어온 인자중 원하는 번째의 인자를 선택하여 Multiple Results로 만듭니다. */
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
    B.reduce([B.args(0, 1), minus]), // 동기
    function(r7) {
        console.log(r7); // -14
    }]);

var minus2 = CB(function(a, b, cb) {
    delay(function() {
        cb(a - b);
    });
});
```


비동기 함수가 있어도 코딩 패턴을 바꾸지 않고 편하게 코딩할 수 있습니다.
```javascript
C({ a: 1, b: 2, c: 3 }, [
    B.map(I), // [1, 2, 3]
    B.map(square), // [1, 4, 9]
    function(v) { return MR(v, 0); },
    B.reduce([B.args(0, 1), minus2]), // 비동기
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

array, object, [object, object, object] 등을 편하게 다룰 수 있는 유용한 함수들입니다.
`C.each`, `C.map`, `C.reduce`, `C.filter`, `C.reject`, `C.find`, `C.find_index`, `C.some`, `C.every`, `C.uniq`,
`B.each`, `map`, `B.reduce`, `B.filter`, `B.reject`, `B.find`, `B.find_index`, `B.some`, `B.every`, `B.uniq`



### 08. [HTML Template](https://github.com/marpple/abc-functional-javascript/blob/master/example/08.%20HTML%20Template.html)
abcjs에는 html을 효율적으로 만들 수 있는 template 함수인 `H`, `H.each`, 일반 문자열을 효율적으로 만들 수 있는 `S`, `S.each`가 있습니다.
`H`, `H.each`, `S`, `S.each`는 모두 비동기 제어를 지원하고 abcjs의 다른 함수들과 함께 사용하기 좋습니다.
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
/*          br\
        br*/\
//            p hi\
        p hello\
//            br\
        textarea\
            | foo bar\
            | hello world'),
    $,
    B.M('appendTo', 'body')]);


hr();
```
**참고 - 주석은 반드시 맨 앞줄에서 시작되어야합니다.**


H-S의 특징
  1. H-S는 js내에서 사용하기위해 만들어졌습니다. 짧게 작성할 수 있게 하기 위해 jade의 문법과 닮았습니다.
  2. jade보다 더욱 css 문법과 동일합니다.
  3. javascript 함수 사용이 편리합니다.
  4. `""`,`''` 등을 생략할 수 있어 문자열을 다루는데 좀더 편리합니다.
  5. handlebars 등의 helper 보다 더욱 편리하게 template을 위한 함수를 만들 수 있습니다.


데이터 치환
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
        .name 글쓴이: {{post.name}}\
        .body 내용: {{post.body}}\
        .created_at 시간: {{post.created_at}}'),
    $,
    B.M('appendTo', 'body')]);

hr();

delete post.name;

window.moment_lll = B([moment, B.M('format', 'lll')]);

C(post, [
    H('post', '\
        .name 글쓴이: {{post.name || "익명"}}\
        .body 내용: {{{post.body}}}\
        .created_at 시간: {{moment_lll(post.created_at)}}'),
    $,
    B.M('appendTo', 'body')]);

hr();
```


`H`의 인자를 여러개를 넘기면 template 문자열을 합치는데 그중 함수를 넣어 함수를 실행 시킬 수 있습니다.
복잡한 로직은 함수로 빼서 구현 할 수 있습니다.
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
위와 같이 익명함수를 선언하여 사용할수도 있습니다. 쉼표가 중요합니다. `{{C(a, ', function() {},')}}`

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


템플릿 동작 순서
  1. `!{}!` 실행 및 데이터 치환, 리턴 값을 H 문법으로 하고 싶을때
  2. H to HTML
  3. `{{{}}}` 실행 및 데이터 치환, 리턴 값을 HTML로 만들고 싶을때
  4. `{{}}` 실행 및 데이터 치환, 리턴 값이 일반 문자열이어야 함
    `!{}!`, `{{}}`, `{{{}}}` 의 실행결과가 `.then` 인 경우 비동기를 기다렸다가 완성합니다.
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
    B.M('appendTo', 'body'), // 2초 뒤 렌더링
    function() {
        $("html, body").animate({ scrollTop: $(window).scrollTop() + $(window).height() });
    }]);
```


`S`는 일반 문자열을 만들때 사용합니다. `S`와 `S.each`가 있습니다.
`H`, `H.each`는 HTML로 변환하여 리턴하고 `S`, `S.each`는 데이터 치환만한 문자열을 리턴합니다.
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
자바스크립트에서 조건문을 작성할때 함수를 실행할 수 있는데 만일 그 함수가 비동기 함수라면 그렇게 할 수 없고 굉장히 로직이 복잡해지고 코딩하기 어려워집니다.
자바스크립트는 아래와 같이 코딩할 수 없어 이것을 자바스크립트의 단점으로 생각하기도 합니다.
하지만 이것에는 목적이 있습니다. 자바스크립트는 이벤트 루프를 이용하여 Non-Blocking IO을 지원하기 위해 아래 같은 상황에서 비동기가 일어납니다.

```javascript
if (long_time(1)) {
   long_time(2);
 } else if (long_time(3)) {
   long_time(4);
 } else {
   long_time(5);
 }
```
`long_time()` 함수의 return 값이 undefined 라면 위 코드는 long_time의 내부 구현과 관련 없이 무조건 `long_time(1)`과 `long_time(5)`만 실행될겁니다.


abcjs는 비동기가 일어나는 상황에서도 위와 닮은 코딩을 할 수 있도록 `IF().ELSEIF().ELSE()` 를 지원합니다.

```javascript
IF(
   조건부 함수,
   실행부 함수
)
```
`IF`와 `ELSEIF`는 첫번째 인자로 조건부 함수를 넘기고, 두번째 인자로 실행부 함수를 넘깁니다.


```javascript
IF(
   실행부 함수
)
```
만약 위와 같이 실행부 함수만 넘길 경우 내부적으로 조건부 함수를 `function I(v) { return v; }` 로 채웁니다.

`ELSE`는 실행부 함수만 넘깁니다.

조건부 함수와 실행부 함수 모두 []로 파이프라인을 만들 수 있습니다.
```javascript
IF([p1, p2, p3], [f1, f2, f3])
```

`IF().ELSEIF().ELSE()`는 chain 방식으로 function 하나를 리턴합니다. 조건부와 실행부 함수에게 최초 받은 인자들을 넘겨줍니다.


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


비동기 조건문
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

실행부 역시 비동기제어가 가능하고 배열을 통해 파이프라인으로 만들 수 있습니다.
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


abcjs를 이용하여 함수형 프로그래밍을 하면 비동기가 지원되는 `IF().ELSEIF().ELSE()` 같은 함수도 아래와 같이 쉽게 만들 수 있습니다.
  1. 최초 `IF`를 실행하면 `store`를 클로저로 생성하고
  2. chain 방식으로 이후에 `ELSEIF`와 `ELSE`가 실행 될때 마다 function set를 `store`에 모아놓고
  3. 리턴된 `IF`가 실행될때 `B.find`를 통해 실행해야하는 function set를 찾아 받아둔 `args`를 넘기며 실행합니다.

이미 `C`나 `B.find` 등이 이미 비동기를 잘 제어해주기 때문에 아래와 같이 callback 패턴 없이 동기 함수를 만들때와 완전히 똑같은 코딩을 할 수 있습니다.
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
`B.all` 함수는 같은 인자를 모든 파이프라인 혹은 함수에게 넘겨서 multiple results로 결과를 만드는 함수를 리턴합니다.
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


`B.spread` 함수는 인자를 하나씩 모든 파이프라인 혹은 함수에게 나눠주고 multiple results로 결과를 만드는 함수를 리턴합니다.
```javascript
C(1, 2, 3, 4, [
    B.spread(
        function(a) { return a + a; }, // a

        [function(a) { return a + a; },
        function(a) { return a * a; }], // b

        function(a) { return MR(a, a - a); }  // c, d (multiple results)

        // e ** 인자수보다 function의 갯수가 적을 경우 I로 채웁니다. function I(v) { return v }
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
        I  // f  ** 인자수보다 function의 갯수가 많을 경우 인자는 undefined로 들어옵니다.
    ),
    function(a, b, c, d, e, f) {
        console.log(a, b, c, d, e, f); // 2, 16, 3, 0, 4, undefined
    }]);
```


결과를 배열로 받고 싶다면
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
Pipeline 패턴으로 코딩을 하다보면 `B.all`과 `B.spread` 같은 일을 하고 싶을때가 많습니다.
`B.all`과 `B.spread`에게 넘겨진 함수 혹은 Pipeline들은 하나씩 차례대로 실행됩니다.
비동기가 일어나더라도 위에서 부터 하나씩 차례대로 실행됩니다.

### 11. [this](https://github.com/marpple/abc-functional-javascript/blob/master/example/11.%20this.html)
A, B, C 모두 this가 주어진다면 파이프라인안의 모든 함수에서 this를 이어줍니다.


#### A 함수로 this 전달하기
A 함수에서는 마지막 인자로 this를 받을 수 있습니다.
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


#### B 함수로 this 전달하기
B 함수는 함수를 리턴하는 함수입니다. B를 실행하여 리턴된 함수에 context를 넘겨주셔야합니다.
_.bind나 Function.prototype.bind 처럼 미리 this를 bind하는 기능은 없습니다.
코어 자바스크립트에서의 this를 잘 이해하고 있다면 전혀 어렵지 않습니다.
아래와 같은 케이스가 가능하겠습니다. 메소드 정의를 할때 유용합니다.
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


#### C 함수로 this 전달하기
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



### 12. ETC
이 외에도 abcjs에는 B.args, B.m, C.val, F, G, C.u, C.val 등의 유용한 함수들이 있습니다.
  - `B.args(n[,n,n...])` index가 n인 인자들 받기
  - `B.m('method', 'args1', 'args2')` 객체의 메소드 실행하는 함수 뱉기
  - `F('function.name') => G['function']['name']` 안전하게 function 찾기
  - `F.A`, `F.B`, `F.C`, ... F 네임스페이스에 모든 함수 재추가
  - `G = global || window`
  - `C.u = function() {};`
  - `C.val(user, 'friend.friends.0.name')` 안전하게 value 꺼내기


### 13. [throw, ERR, CATCH](https://github.com/marpple/abc-functional-javascript/blob/master/example/13.%20CATCH.html)
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

__이제 재밌는 함수 조립을 즐겨보세요! :smile:__
