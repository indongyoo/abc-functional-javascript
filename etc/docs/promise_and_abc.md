# Promise와 abcjs 비교

Promise는 비동기 상황에서 동기적으로 코드를 작성할 수 있게 하는 해결책 중 하나이며 ES6에 채택되었다. Promise는 "값이 만들어지기로 약속된 Promise 객체를 즉시 리턴하는 함수"들을 만들고 이것들을 내부에서 순차적으로 실행하며 비동기 상황을 제어한다. 결과 값은 아니지만 Promise 객체를 즉시 리턴한다는 특징 덕분에 비동기 상황을 if, else, for 등으로 어느 정도 제어할 수 있게 된다. 그리고 try catch와 유사한 에러 핸들링이 가능해진다. 콜백 지옥 해결을 넘어 동기적인 코드 작성을 할 수 있게 하고 ES7의 async await 키워드의 사용을 가능하게 한다. 이러한 이유로 Promise는 더 많은 javascript 개발자들에게 선택되어지고 있다.

Promise는 충분한 해결책이지만 다음과 같은 작은 단점들이 있다고 생각한다.

1. 반드시 비동기가 일어난다.
2. Promise로 감싸진 의미 없는 익명 함수가 많아진다.
3. 익명 함수에서 인자를 2개 이상 받을 수 없어 일반 함수나 타 라이브러리 등과 조합하기 어렵다.
4. resolve가 값을 1개만 전달하므로 결과가 2개 이상인 콜백 패턴의 함수와 조합하기 어렵다.
5. Promise 객체를 리턴하는 함수를 사용하는건 쉽지만 직접 만드는 것은 약간 어렵다.
6. 콜백 함수를 받는 고차 함수를 Promise로 제어하려면 제법 많은 Promise 관련 코드가 필요하다.

다음 예제들은 abcjs의 Pipeline과 Promise와의 차이점을 보여준다.

```javascript

  function add(a, b, next) {
    setTimeout(function() {
      next(a + b);
    }, 1000);
  }

  function sub(a, b, next) {
    setTimeout(function() {
      next(a - b);
    }, 1000);
  }

  function mul(a, b, next) {
    setTimeout(function() {
      next(a * b);
    }, 1000);
  }

  function log(msg, next) {
    setTimeout(function() {
      console.log(msg);
      next(msg);
    }, 1000);
  }

  /* Promise 1 */
  new Promise(
    function(resolve) {
      add(5, 10, resolve);
    })
    .then(function(result) {
      return new Promise(function(resolve) {
        sub(result, 10, resolve);
      });
    })
    .then(function(result) {
      return new Promise(function(resolve) {
        mul(result, 1, resolve);
      });
    })
    .then(function(result) {
      return new Promise(function(resolve) {
        log(result, resolve);
      });
    });
  // 5

  /* abcjs 1 */
  C(5, 10, CB(
    function(a, b, next) {
      add(a, b, next);
    },
    function(result, next) {
      sub(result, 10, next);
    },
    function(result, next) {
      mul(result, 10, next);
    },
    function(result, next) {
      log(result, next);
    }));
  // 50

```

Promise는 다음 .then에게 결과를 넘겨주기 위해 새로운 Promise 객체를 생성해야 한다. 이와 달리 abcjs의 Pipeline은 next를 받을 함수들에 CB를 감싸주기만 하면 된다.

Promise는 wrapper 역할을 하고 있는 익명 함수가 반드시 하나의 인자만 받을 수 있다. resolve 함수에게도 여러개의 인자를 넘길 수 없다. 문제점이라기보단 그렇게 의도된 것이다. Promise의 최종 값은 마지막 익명 함수의 return으로 결정 될 수 있기 때문에 일관성을 위해 그렇게 선택했을 것이다.

```javascript

  /* not working */
  new Promise(
    function(resolve) {
      add(5, 10, function(result) {
        resolve(result, 10);
      });
    })
    .then(function(a, b) { // b is undefined
      return new Promise(function(resolve) {
        sub(a, b, resolve);
      });
    });

  // ES6 Promise에는 없지만 bluebirdjs에서는 array로 값을 넘긴 후 spread로 인자로 나눠 받을 수 있다.
  // resolve([result, 10]); -> .spread(function(a, b) {})

```

abcjs에서 wrapper 역할을 하는 함수는 여러 개의 인자를 받을 수 있으며 next는 마지막 인자로 들어온다. 그 역시 일반적인 콜백 패턴의 함수가 된다. 이 덕분에 wrapper 함수를 선언하는 부분에서 일반적인 함수 선언이나 함수 참조가 가능해진다. 이와 같은 특징과 대부분의 콜백 패턴이 콜백 함수를 마지막 인자로 받는다는 점등을 활용하면 next, _.partial, abcjs의 B 등을 통해 다음과 같은 코드를 작성할 수 있다.

```javascript
  /* abcjs 2 */
    C(5, 10, CB(
      add,
      function(result, next) {
        sub(result, 10, function(result) {
            next(result, 20);  // multiple results
        });
      },
      mul,
      log));
  // 100

  /* abcjs 3 */
  C(5, 10, CB(
    add,
    _.partial(sub, _, 10),
    _.partial(mul, 30),
    log));
  // 150

  /* abcjs 4 */
  C(5, 10, CB(
    add, B(X, 10, sub), B(40, mul), log));
  // 200
```

물론 Promise를 이용하더라도 아래의 promisify 같은 함수 구현을 통해 비슷한 코드셋을 만들 수 있다. 하지만 then까지 제거되진 않는다. then을 내부에서 풀어주는 함수를 만들면 then도 숨길 수 있겠지만 abcjs와 같은 코드모양이 되어야한다. abcjs와 같은 모양이 되면 Promise처럼 모나드 패턴으로 비동기를 제어하지 않아도 되므로 함수마다 Promise 객체를 품도록 구현 되는건 오버스펙이 되는게 아닐까 생각된다.

```javascript

  function promisify(func) {
    return function() {
      var args = _.toArray(arguments);
      var self = this;
      return new Promise(function(resolve) {
        func.apply(self, args.concat(resolve));
      });
    }
  }

  /* Promise 2 */
  promisify(add)(5, 10)
    .then(_.partial(promisify(sub), _, 10))
    .then(_.partial(promisify(mul), 50))
    .then(promisify(log));
  // 250

  /* Promise 3 */
  promisify(add)(5, 10)
    .then(B(X, 10, promisify(sub)))
    .then(B(60, promisify(mul)))
    .then(promisify(log));
  // 300

```

코드를 줄이는게 목적이라면 Promise도 promisify와 같은 일을 미리 해두면 되지 않겠는가라고 생각할 수 있다. 하지만 모든 콜백 함수를 각 함수에 맞게 미리 promisify 해두는 일은 쉽지 않으며 기존 레퍼런스를 덮어버릴 경우 callback 함수를 동적(arguments.length[arguments.length-1])으로 받는 함수가 있다면 그 함수의 라이브러리 내부에서 오류가 나는 문제가 생길 수 있다.

반면에 abcjs는 함수를 감싼 새로운 함수를 뱉지 않는다. 함수에게 callback 패턴의 함수라는 단서만 남겨 놓는다. 함수 자체는 바꾸지 않기 때문에 다른 변수에 정의해야할 필요가 없다. 기존의 콜백 방식 그대로도 사용 할 수 있기에 원래의 사용처에서 오류가 날 이유도 없다. abcjs도 미리 CB로 감싸둔다면 이후 Pipeline 사용시 더욱 간단하게 사용 가능하다.

```javascript

  /* Promise 4 (with promisify) */
  var add2 = promisify(add);
  var sub2 = promisify(sub);
  var mul2 = promisify(mul);
  var log2 = promisify(log);

  add2(5, 10).then(B(X, 10, sub2)).then(B(X, 70, mul2)).then(log2);
  // 350

  /* abcjs 5 */
  CB(add, sub, mul);
  C(5, 10, [add, B(X, 10, sub), B(80, mul), log]);
  // 400

  /* abcjs 6 (with promisify) */
  C(5, 10, [add2, B(X, 10, sub2), B(90, mul2), log2]);
  // 500

  /* abcjs 7 (with Promise)*/
  C([
    function() {
      return new Promise(function(resolve) {
        add(5, 10, resolve);
      });
    },
    function(result) {
      return new Promise(function(resolve) {
        sub(result, 10, resolve);
      });
    },
    function(result) {
      return new Promise(function(resolve) {
        mul(result, 100, resolve);
      });
    },
    function(result) {
      return new Promise(function(resolve) {
        log(result, resolve);
      });
    }]);
  // 550

```

abcjs는 Promise에 대한 의존성이 없지만 Promise와 함께 사용이 가능하다. Pipeline 내부의 함수 결과가 Promise나 jQuery Deferred Object 와 같은 then 메소드를 가진 객체일 경우 결과를 꺼내 Pipeline의 다음 함수에게 전달한다.

abcjs의 Pipeline은 Promise와 달리 함수들을 실행하다 비동기 상황을 만났을때만 then 메소드를 가진 약식 Promise 객체를 생성하여 즉시 리턴하고 재귀를 통해서만 비동기를 제어한다. 이 약식 Promise는 중첩 Pipeline 등을 위해 사용된다. ES6 이상이거나 Promise 생성자가 있을 경우에는 약식 Promise가 아닌 정식 Promise를 리턴하기 때문에 Promise나 ES7의 async await 등과도 연동 된다.

잠깐 쉬어가는 의미로 아래 코드를 보자. 내가 실무에서 사용하지는 않지만 재밌는 코드가 있다.
B로 감싸주기만 하면 add, sub, mul 모두 비동기 함수임에도 아래와 같은 코드가 동작한다.

```javascript
  /* abcjs 8 (bfy) */
  var badd = B(add);
  var bsub10 = B(X, 10, sub);
  var bmul110 = B(110, mul);
  var blog = B(log);

  blog(bmul110(bsub10(badd(5, 10))));
  // 550
```

물론 Promise를 이용해서도 B, C, CB와 같은 함수들을 모두 구현할 수 있다. 그렇지만 abcjs는 Promise 없이 구현되었으며 재귀만으로 비동기를 제어한다. Promise는 현재 모든 브라우저에서 동작하지 않아 bluebirdjs 등의 라이브러리가 필요하다. ES6의 Promise보다 bluebirdjs가 기능적으로 좀더 풍성하여 ES6이 지원되는 NodeJS 환경에서도 bluebirdjs를 많이 사용한다. abcjs는 bluebirdjs 보다 좀 더 많은 비동기 제어 기능을 가지고 있다. 비동기 관련 기능 외에도 HTML 템플릿 엔진, 깊은 값 변경 등의 다양한 기능이 있다. 다음은 bluebirdjs와 abcjs의 비동기 제어와 관련된 API 비교 표다.


|                      | bluebirdjs                                                   | abcjs                                                                          |
|----------------------|--------------------------------------------------------------|--------------------------------------------------------------------------------|
| Multiple Results     | all, spread                                                  | MR, spread, all, auto multiple results(callback)                          |
| Functional, Control Statement | race, props, any, some, map, reduce, filter, each, mapSeries | each, map, reduce, filter, reject, find, findIndex, findKey, some, every, uniq, IF, ELSEIF, ELSE |
| Error Handling       | throw, catch, reject                                         | throw, CATCH, ERR                                                              |
| etc                  | tap, delay, promisify, promisifyAll ...                      | tap, delay, bfy, CB, async jade template, async string template ...            |
| Line                 | 5,598                                                        | 961                                                                            |

abcjs는 실행될 모든 함수를 미리 받아 재귀만으로 함수들을 제어한다. 이 특징을 활용하여 abcjs의 모든 함수들은 동기와 비동기 지원 함수를 별도로 나누지 않을 수 있었다. C, B, C.map, C.each 등의 모든 함수들은 동기로도 동작하고 비동기로도 동작한다. 그러므로 _.map 처럼 즉시 값을 리턴할 수도 있고 Promise.map 처럼 비동기를 제어할 수도 있다. 이 특징은 타 라이브러리와의 편리한 조합을 가능하게 한다.

Promise와 abcjs의 대표적인 부분들을 비교해보았다. abcjs는 Promise를 대체하기 위해 만들어진 라이브러리가 아니다. abcjs는 앞서 설명한 것처럼 Promise를 파이프라인 내부에서도 지원하고 결과 값으로 약식 then을, 정식 Promise가 있다면 정식 then을 리턴한다. 나는 abcjs가 Browser, NodeJS 등 안에서 때로는 즉시, 때로는 Promise, 때로는 Deferred Object, callback, iteratee, predicate, Event, Notification 등의 각기 다른 API를 가진 수많은 기술(gm, AWS, jQuery, React, Angular, Backbone, underscore, pg, async, await)들을 연결하고 제어하는데 효과적일 것이라 생각한다. 필요하다면 사용을 검토해보길 추천한다.


참고 링크
- [자바스크립트의 약속(Promise): 1부 의문점] (https://gamecodingschool.org/2015/05/23/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EC%9D%98-%EC%95%BD%EC%86%8Dpromise-1%EB%B6%80-%EC%9D%98%EB%AC%B8%EC%A0%90/)
- [자바스크립트의 약속(Promise): 2부 비교] (https://gamecodingschool.org/2015/05/28/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EC%9D%98-%EC%95%BD%EC%86%8Dpromise-2%EB%B6%80-%EB%B9%84%EA%B5%90/)
- [JavaScript 모나드] (http://www.haruair.com/blog/2986)
- [abcjs 콜백] (https://github.com/marpple/abc-functional-javascript/blob/master/example/05.%20Async%20(callback).html)
- [abcjs Promise] (https://github.com/marpple/abc-functional-javascript/blob/master/example/06.%20Async-2%20(Promise).html)
- [bluebirdjs] (http://bluebirdjs.com/docs/getting-started.html)


--------------

[다른 글 보기] (https://github.com/marpple/abc-functional-javascript/tree/master/docs)