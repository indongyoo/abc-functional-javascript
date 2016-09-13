# abcjs
_abcjs는 함수형 자바스크립트(functional javascript) 라이브러리입니다._


## 특징
  - Web browser와 NodeJS에서 사용할 수 있습니다.
  - Promise나 모나드보다 간결하고 더욱 편리한 비동기 제어를 지원합니다.
  - 비동기 함수일지라도 동기 함수를 작성하듯이 논리 구조를 만들 수 있습니다.
  - 비동기 제어가 지원되는 each, map, reduce, filter, reject, find, some, every, uniq 함수가 있습니다.
  - Jade와 비슷한 HTML Template 함수가 있습니다.
  - sql 등을 작성하기 편한 함수가 있습니다.
  - 다른 자바스크립트 라이브러리에 대한 의존성이 없는 750줄의 작은 라이브러리입니다.
  - Respect Underscorejs!


 __abcjs와 함께 함수형 프로그래밍을 즐겨보세요. :simple_smile:__



## 시작하기

#### 01. [A](https://github.com/marpple/abc-functional-javascript/blob/master/example/01.%20A.html)
A는 this를 제외한 apply라고 생각하면 쉽습니다.

객체지향에서 this 키워드는 매우 중요합니다. 자신이 가진 메소드를 실행하거나 자신이 가진 상태를 참조하거나 변경해야하기 때문입니다.

하지만 this를 다루는 것은 어렵습니다. 추상적이기 때문입니다.
this를 통해 다루는 상태는 결국 값입니다. 반드시 클래스를 통해서만 값을 다룰 필요는 없습니다.

메서드를 통해 클래스 내부에서만 값을 참조하는 것보다 훨씬 쉽고 유연하고 추상적이지 않은 방법이 있습니다.
함수를 통해 값을 새로운 값으로 만드는 식으로 다루는 것입니다.
```javascript
function add(a, b) {
    return a + b;
}

var r1 = A([20, 2], add); // add.apply(undefined, [20, 2]);
console.log(r1);
// 22
```


대부분 왼쪽에서 오른쪽, 위에서 아래로 읽는데 익숙합니다. 그래서 A는 인자와 함수사용에 대한 방향을 바꾸었습니다.
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
Array나 arguments를 사용하면 됩니다.



#### 02. [B](https://github.com/marpple/abc-functional-javascript/blob/master/example/02.%20B.html)
B는 this를 제외한 bind라고 생각하면 쉽습니다.
혹은 underscore의 \_.partial과 유사합니다.
```javascript
function minus(a, b) {
    return a - b;
}

var f1 = B(10, minus);
var r1 = f1(20);
console.log(r1);
// -10
```


B를 X와 함께 사용해보세요.
X를 통해 이후 실행시에 인자를 받을 자리를 지정할 수 있습니다.
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



#### 03. [C](https://github.com/marpple/abc-functional-javascript/blob/master/example/03.%20C.html)
C는 this를 제외한 call이라고 생각하면 쉽습니다.
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



#### 04. [Pipeline with ABC](https://github.com/marpple/abc-functional-javascript/blob/master/example/04.%20Pipeline%20with%20ABC.html)
abcjs는 underscore의 \_.compose나 jQuery의 chain과 유사한 코드 패턴을 지원합니다.
객체지향적인 체인방식은 연속적으로 값을 변경해나갈 수 있지만 자신이 가진 값을 바꾸는 방법이기 때문에 사용은 쉽지만 구현이 어렵습니다.
또한 자신이 가진 메서드만 사용 가능하며 자신의 값만을 변경 할수있기 때문에 제약이 있습니다.
파이프라인과 같은 연속적인 함수 실행 방식은 객체지향적인 체인방식보다 유연하고 순수 함수들을 만들 수 있어 좋습니다.

abcjs에서는 별도의 파이프라인 함수를 만들지 않고 기본 함수 실행 함수인 ABC에서 파이프라인 패턴을 바로 사용할수 있도록 했습니다.
또한 \_.compose와 달리 읽기 쉬운 방향으로 순서를 바꿨습니다. 쉽습니다. 마지막 인자 자리에 함수 대신 배열로 함수들을 나열하기만 하면 됩니다.
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


1, 2 인자는 sum에게 sum의 결과는 square에게 그리고 그 함수의 결과는 계속 다음 함수의 인자로 넘어갑니다. 그리고 마지막 함수의 return 값은 C의 실행 결과가 됩니다.

A를 이용하면 Array나 arguments로 파이프라인 패턴을 사용할 수 있습니다.
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


B 함수를 이용하면 작은 함수를 모아 큰 함수를 만들 수 있습니다. 혹은 큰 함수를 작은 단위로 쪼갤 수 있습니다. 작은 함수가 많아지면 코드 재활용률을 높일 수 있습니다.
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


함수 조합에서도 X와 함께 인자를 미리 적용 해둘 수 있습니다.
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


chain 패턴이나 \_.compose, Promise 등의 일종의 파이프라인 혹은 모나드 등에서 아쉬운점은 함수 모음의 첫번째 함수를 제외하고는 인자를 하나만 받을 수 있다는 점 입니다.

B(X, 11, minus) 를 통해 두개의 인자가 사용되도록 했지만 여전히 사실은 위에서 부터 내려오는 인자는 하나입니다.
인자를 하나만 받는 함수만 조립할 수 있다면 실용성이 떨어집니다.
이를 위해 R이 있습니다. R을 이용하면 다음 함수가 여러개의 결과를 인자로 받을 수 있습니다.
R 사용은 아래와 같은 두가지 사용법이 있습니다.
```javascript
C(3, 2, [
    function(a, b) {
        return R(a + b, a - b, a * b); // multiple results
    },
    function(a, b, c) {
        console.log(a, b, c);
        return R(a, c); // multiple results
    },
    function(a, c) {
        console.log(a, c);
        return arguments;
    },
    TO_R, // arguments to multiple results
    function(a, c) {
        console.log(a, c); // 5, 6
    }]);
```


B를 통해 함수를 정의하면 ABC를 이용하지 않고도 R(returns)을 동작 시킬 수 있습니다.
```javascript
var minus = B(function(a, b) {
    console.log(a, b); // 20, 10
    return a - b;
});

var r5 = minus(10, 20);
console.log(r5); // -10

/* swap 함수의 multiple results를 바로 minus에게 넘김 */
var swap = function(a, b) {
    return R(b, a);
};
var r6 = minus(swap(10, 20));
console.log(r6);
// 10
```
R은 Go언어의 Multiple Results와 비슷합니다.
[GO Lang - Multiple Results](https://tour.golang.org/basics/6)


함수 조립의 즐거움
```javascript
var difference = B([
    function(a, b) {
        return R(Math.max(a, b), Math.min(a, b));
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


abc의 다른 함수를 활용하면  difference를 아래와 같이 구현해볼수도 있겠습니다.
```javascript
var difference2 = B([
    P, // function() { return arguments },
    _.toArray,
    B.M('sort'), // function(a) { return a.sort(); },
    B.M('reverse'),  // function(a) { return a.reverse(); },
    TO_R, // array to multiple results
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



#### 05. [Async(callback)](https://github.com/marpple/abc-functional-javascript/blob/master/example/05.%20Async%20(callback).html)
abcjs에서는 비동기 제어와 관련된 많은 기능을 제공합니다.
파이프라인에서 사용할 콜백 패턴의 함수를 CB 함수로 한번 넘겨 두기만 하면 됩니다.
CB가 감싸졌던 f1이라는 함수를 파이프라인에 넣어두면 C함수 안에서 f1에게 필요한 callback 함수를 생성하여 마지막 인자로 넣어줍니다.
생성된 callback 함수로 값을 꺼낸 후 파이프라인의 다음 함수에게 결과를 전달합니다.
CB로 감싼 후 callback 함수 인자의 자리만 제외하고 실행하거나 CB(익명함수)를 통해 C에게 받은 callback 함수를 사용하여 결과를 다음 함수로 넘기면 됩니다.
Promise와 달리 여러개의 인자를 다음 함수로 주고 있던 함수이더라도 여러개의 인자로 받을 수 있습니다.

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


callback 형태로 결과를 기다리는 함수를 사용할때는 CB를 감싸두기만 하면 됩니다.
CB로 감싸진 function을 만나면 C안에서 callback 함수를 생성하여 마지막 인자로 넘긴 후 값을 받으면 다음 함수로 전달합니다.
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

연속으로 callback 패턴의 함수들이 나온다면 CB를 함께 싸도 됩니다.
```javascript
C(5, 9, [
    sum,
    B(X, 5, minus), // B를 활용하여 좀더 간략하게 만들 수 있습니다.
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
일반 콜백함수를 Promise로 제어하는 것보다 간단하고 새로운 함수를 만들지 않으며 CB를 감싼뒤라도 콜백함수를 콜백함수 그대로 사용할 수 있습니다.
Promise.promisify 보다도 단순하고 새로운 개념을 알 필요가 없습니다.
.then()과 달리 multiple results도 가능합니다.
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
        $.post("/post_data", E(data, { c: 10 }), cb);
    },
    function(data, cb) {
        console.log(_.clone(data)); // {a: 5, b: 3, c: 10, created_at: Tue Sep 13 2016 04:01:19 GMT+0900 (KST)}
        $.put("/put_data", E(data, { c: 5 }), cb);
    }),
    function(r) {
        console.log(r);
        // {a: 5, b: 3, c: 5, created_at: Tue Sep 13 2016 04:03:58 GMT+0900 (KST), updated_at: Tue Sep 13 2016 04:03:59 GMT+0900 (KST)}
    }
]);
```

B를 활용하면 더욱 깔끔하게 만들 수 있습니다.
```javascript
CB($.get, $.post, $.put);

C([
    B("/get_data", $.get),
    B({ c: 20 }, E),
    B("/post_data", $.post),
    B({ c: 30 }, E),
    B("/put_data", $.put),
    function(r) {
        console.log(r);
        // {c: 20, a: 5, b: 3, created_at: Tue Sep 13 2016 04:01:19 GMT+0900 (KST), updated_at: Tue Sep 13 2016 04:01:20 GMT+0900 (KST)}
    }
]);
```

J와 R을 활용하면 다음과 같이 사용할 수 있습니다.
```javascript
function J(v) {
 return function() {
     return v;
 }
}
```

```javascript
C([
    J(R("/post_data", { aka: 'Cojamm' })),
    $.post,
    function(r) {
        console.log(r); // {aka: "Cojamm", created_at: Tue Sep 13 2016 04:01:18 GMT+0900 (KST)}
    }
]);
```
_*참고 - 실제 jQuery의 `$.get` 함수등은 { then: func.. } 를 리턴하기 때문에 CB로 감싸는 방식으로 구현할 필요 없습니다._



#### 06. [Async-2(Promise)](https://github.com/marpple/abc-functional-javascript/blob/master/example/06.%20Async-2%20(Promise).html)
abcjs는 Promise가 필요 없지만 .then을 리턴하는 함수의 비동기 제어를 지원합니다.
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


아래와 같이 마지막 결과를 then으로 받을 수 있어 Promise와 함께 사용이 가능합니다.
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
```


CB와 함께 사용 가능합니다.
```javascript
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
Promise를 지원하지만 C().then()이 Promise 객체는 아닙니다.



#### 07. [each...map...find...](https://github.com/marpple/abc-functional-javascript/blob/master/example/07.%20each...map...find....html)
underscorejs의 each, map, find 등의 함수보다 편의성을 높였습니다.
  1. this는 사용하지 않으며 대신 iteratee 함수에게 인자를 여러개를 넘길 수 있습니다.
    - ex) [1, 2, 3], arg1, arg2, arg3 => value, key, list, arg1, arg2, arg3 ...
  2. 비동기 제어가 됩니다.
  3. iteratee나 predicate 함수를 파이프라인으로 만들 수 있습니다.
  4. 즉시 실행인 C.map과 부분 실행 컨셉의 B.map이 있어 파이프라인에서 편하게 사용할 수 있습니다.

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

/* B.P는 들어온 인자중 원하는 번째의 인자를 모아 array로 바꿔주는 기능입니다. */
var r4 = C.map([1, 2, 3], 5, [B.P(0, 3), TO_R, sum]);
console.log(r4); // [6, 7, 8]

/* B.PR은 R(B.P()) 입니다. */
var r5 = C.map([1, 2, 3], 5, [B.PR(0, 3), sum]);
console.log(r5); // [6, 7, 8]


var r6 =
    C({ a: 1, b: 2, c: 3 }, [
        B.map(I), // [1, 2, 3] // function I(v) { return v; }
        B.map(square), // [1, 4, 9]
        function(v) { return R(v, 0); },
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
    function(v) { return R(v, 0); },
    B.reduce([B.PR(0, 1), minus]), // 동기
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
    function(v) { return R(v, 0); },
    B.reduce([B.PR(0, 1), minus2]), // 비동기
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
    B.filter(B.V('activated')),
    B.reject(function(user) {
        return user.age > 30;
    }),
    B.map(B.V('age')),
    function(r8) {
        console.log(r8); // [20, 17]
    }]);

C(users, [
    B.uniq(B.V('age')),
    B.map(B.V('id')),
    function(r9) {
        console.log(r9); // [1, 3, 4, 5]
    }]);

C(users, [
    G[":reject :age > 30"] = B.reject(function(user) {
        return user.age > 30;
    }),
    B.every(B.V('activated')),
    function(r10) {
        console.log(r10); // false
    }]);

C(users, [
    G[":reject :age > 30"],
    B.some(B.V('activated')),
    function(r11) {
        console.log(r11); // true
    }]);
```

array, object, [obj, obj, obj] 등을 편리하게 다룰 수 있는 유용한 함수들입니다.
`C.each`, `C.map`, `C.reduce`, `C.filter`, `C.reject`, `C.find`, `C.some`, `C.every`, `C.uniq`,
`B.each`, `map`, `B.reduce`, `B.filter`, `B.reject`, `B.find`, `B.some`, `B.every`, `B.uniq`



#### 08. [HTML Template](https://github.com/marpple/abc-functional-javascript/blob/master/example/08.%20HTML%20Template.html)
abcjs에는 html을 효율적으로 만들 수 있는 template 함수인 H, H.each, 일반 문자열을 효율적으로 만들 수 있는 S, S.each가 있습니다.
H, H.each, S, S.each는 모두 비동기 제어를 지원하고 abcjs의 다른 함수들과 함께 사용하기 좋습니다.
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

H-S의 특징
  1. H-S는 js내에서 사용하기위해 만들어졌습니다. 짧게 작성할 수 있게 하기 위해 jade의 문법과 닮았습니다.
  2. jade보다 더욱 css 문법과 동일합니다.
  3. javascript 함수 사용이 편리합니다.
  4. " 등을 생략할 수 있어 문자열을 다루는데 좀더 편리합니다.
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


H의 인자를 여러개를 넘기면 template 문자열을 합치는데 그중 함수를 넣어 함수를 실행 시킬 수 있습니다.
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

H.each, S.each
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
  1. !{}! 실행 및 데이터 치환, 리턴 값을 H 문법으로 하고 싶을때
  2. H to HTML
  3. {{{}}} 실행 및 데이터 치환, 리턴 값을 HTML로 만들고 싶을때
  4. {{}} 실행 및 데이터 치환, 리턴 값이 일반 문자열이어야 함
    !{}!, {{}} {{{}}} 의 실행결과가 .then 인 경우 비동기를 기다렸다가 완성함
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


S는 일반 문자열을 만들때 사용합니다. S와 S.each가 있습니다.
H, H.each는 HTML로 변환하여 리턴하고 S, S.each는 데이터 치환만한 문자열을 리턴합니다.
```javascript
C({ id: 5, body: "foo bar" }, [
    _.values,
    TO_R,
    S('id, body', "update posts set body = '{{body}}' where id = {{id}};"),
    function(query) {
        console.log(query);
    }]);
```



#### 09. [IF ELSEIF ELSE](https://github.com/marpple/abc-functional-javascript/blob/master/example/09.%20IF%20ELSEIF%20ELSE.html)
자바스크립트에서 조건문을 작성할때는 함수를 실행할 수 있는데 만일 그 함수가 비동기 함수라면 굉장히 로직이 복잡해지고 코딩하기 어려워집니다.
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
IF와 ELSEIF는 첫번째 인자로 조건부 함수를 넘기고, 두번째 인자로 실행부 함수를 넘깁니다.


```javascript
IF(
   실행부 함수
)
```
만약 위와 같이 실행부 함수만 넘길 경우 내부적으로 조건부 함수를 `function I(v) { return v; }` 로 채웁니다.

ELSE는 실행부 함수만 넘깁니다.

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

실행부 역시 비동기제어가 가능하고 [] 를 통해 파이프라인으로 만들 수 있습니다.
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


abcjs를 이용하여 함수형 프로그래밍을 하면 비동기가 지원되는 IF().ELSEIF().ELSE() 같은 함수도 아래와 같이 쉽게 만들 수 있습니다.
  1. 최초 IF를 실행하면 store를 클로저로 생성하고
  2. chain 방식으로 이후에 ELSEIF와 ELSE가 실행 될때 마다 function set를 store에 모아놓고
  3. 리턴된 IF가 실행될때 B.find를 통해 실행해야하는 function set를 찾아 받아둔 args를 넘기며 실행합니다.

  이미 C나 B.find 등이 이미 비동기를 잘 제어해주기 때문에 아래와 같이 callback 패턴 없이 동기 함수를 만들때와 완전히 똑같은 코딩을 할 수 있습니다.
```javascript
 (function() {

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

})();
```



#### 10. [B.all B.div](https://github.com/marpple/abc-functional-javascript/blob/master/example/09.%20IF%20ELSEIF%20ELSE.html)
B.all 함수는 같은 인자를 모든 파이프라인 or 함수에게 넘겨서 multiple results로 결과를 만드는 함수를 리턴합니다.
```javascript
C(1, 5, [
    B.all(
        function(a, b) { return a + b; }, // a

        [function(a, b) { return a - b; },
        function(a) { return a * a; }],  // b

        function(a, b) { return R(a, b); }  // c, d (multiple results)
    ),
    function(a, b, c, d) {
        console.log(a, b, c, d); // 6, 16, 1, 5
    }]);
```


B.div 함수는 인자를 하나씩 모든 파이프라인 or 함수에게 나눠주고 array로 결과를 만드는 함수를 리턴합니다.
```javascript
C(1, 2, 3, 4, [
    B.div(
        function(a) { return a + a; }, // a

        [function(a) { return a + a; },
        function(a) { return a * a; }], // b

        function(a) { return R(a, a - a); }  // c, d (multiple results)

        // e ** 인자수보다 function의 갯수가 적을 경우 I로 채웁니다. function I(v) { return v }
    ),
    function(a, b, c, d, e) {
        console.log(a, b, c, d, e); // 2, 16, 3, 0, 4
    }]);

C(1, 2, 3, 4, [
    B.div(
        function(a) { return a + a; }, // a

        [function(a) { return a + a; },
        function(a) { return a * a; }], // b

        function(a) { return R(a, a - a); }, // c, d

        I, // e
        I  // f  ** 인자수보다 function의 갯수가 많을 경우 인자는 undefined로 들어옵니다.
    ),
    function(a, b, c, d, e, f) {
        console.log(a, b, c, d, e, f); // 2, 16, 3, 0, 4, undefined
    }]);
```


결과를 Array로 받고 싶다면
```javascript
C(1, 5, [
    B.all(
        function(a, b) { return a + b; }, // a

        [function(a, b) { return a - b; },
        function(a) { return a * a; }],  // b

        function(a, b) { return R(a, b); }  // c, d (multiple results)
    ),
    D.to_array,
    function(a) {
        console.log(a); // [6, 16, 1, 5]
    }]);


console.log(D.to_array(1, 2, 3, 4)); // [1, 2, 3, 4]
console.log(D.to_array({"0": 1, "1": 2})); // [1, 2]
(function() {
    console.log(D.to_array(arguments)); // [1, 2, 3]
}) (1, 2, 3)
```
Pipeline 패턴으로 코딩을 하다보면 B.all과 B.div 같은 일을 하고 싶을때가 있습니다.
B.all과 B.div에게 넘겨진 함수 or Pipeline들은 하나씩 차례대로 실행됩니다.
비동기가 일어나더라도 위에서 부터 하나씩 차례대로 실행됩니다.



#### 11. ETC
이 외에도 abcjs에는 `B.P`, `B.M`, `B.V`, `F`, `G`, `M`, `U`, `V` 등의 유용한 함수들이 있습니다.
  - `B.P(n)` n번째 인자 받기
  - `B.M('method', 'args1', 'args2')` 객체의 메소드 실행하기
  - `F('function.name') => G['function']['name']` 안전하게 function 찾기
  - `F.A`, `F.B`, `F.C`, ... F 네임스페이스에 모든 함수 재추가
  - `G = global || window`
  - `U = function() {};`
  - `V(user, 'friend.friends.0.name')` 안전하게 value 꺼내기


__이제 재밌는 함수 조립을 즐겨보세요! :smile:__
