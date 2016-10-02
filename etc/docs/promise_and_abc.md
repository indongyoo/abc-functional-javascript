# Promise와 abcjs 비교

Promise는 비동기 상황에서 동기적으로 코드를 작성할 수 있게 하는 해결책 중 하나이며 ES6에 채택되었다. Promise는 "값이 만들어지기로 약속된 Promise 객체를 즉시 리턴하는 함수"를 만들고 이것들을 내부에서 순차적으로 실행하며 비동기 상황을 제어한다. 결과 값은 아니지만 실행 즉시 promise를 리턴한다는 특징 덕분에 비동기 상황을 if, else, for 등으로 어느정도 제어 가능하게 하고 try catch와 유사한 에러 핸들링이 가능해진다. 이처럼 콜백 지옥문제를 해결하는 문제를 넘어 동기적인 코드 작성을 할 수 있게 하고 ES7의 async await 키워드의 사용을 가능하게 한다. 이러한 이유로 Promise는 더 많은 javascript 개발자들에게 선택되어지고 있다.

Promise는 충분한 해결책이고 아름답지만 다음과 같은 작은 단점들이 있다고 생각한다.

1. Promise는 반드시 비동기가 일어난다.
2. Promise method는 즉시 Promise 객체를 리턴해야하므로 Promise 객체가 아닌 리턴 값을 만들 수 없다.
3. 1번과 2번 때문에 동기로 동작하는 일반적인 함수나 고차 함수 등과 함께 사용하기 어렵다.
4. Promise로 감싸진 의미 없는 익명 함수가 많아진다.
5. 인자를 2개 이상 받는 함수와 함께 사용하기 어렵다.
6. Promise 객체를 리턴하는 함수를 사용하는건 쉽지만 만드는 것은 약간 어렵다.
7. 콜백 함수를 필요로 하는 고차 함수를 Promise로 제어하려면 제법 많은 Promise 관련 코드가 필요하다.

다음 예제들은 abcjs의 Pipeline과 Promise와의 차이점을 보여준다.

```javascript

  function add(a, b, next) {
    setTimeout(function () {
      next(a + b);
    }, 1000);
  }

  function sub(a, b, next) {
    setTimeout(function () {
      next(a - b);
    }, 1000);
  }

  function mul(a, b, next) {
    setTimeout(function () {
      next(a * b);
    }, 1000);
  }

  function log(msg) {
    console.log(msg);
  }

  /* Promise */
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
        mul(result, 10, resolve);
      });
    })
    .then(log);

  /* abcjs 1 */
  C(5, 10, CB(
    function(a, b, next) {
      add(a, b, next);
    },
    function(result, next) {
      sub(result, 10, next);
    },
    function(result, next) {
      mul(result, 20, next);
    },
    log));

```

Promise는 다음 .then에게 결과를 넘겨주기 위해 새로운 Promise 객체를 생성해야한다. 이와 달리 abcjs의 Pipeline은 next를 받을 함수들을 CB로 감싸주기만 하면 된다.

Promise는 wrapper 역할을 하고 있는 익명 함수가 반드시 하나의 인자만 받을 수 있지만 abcjs의 Pipeline은 인자를 여러개 받을 수 있으며 마지막 인자로 next가 들어온다. 그러므로 wrapper 함수 선언 부분에서도 일반적인 함수 선언이나 함수 참조가 가능하다.

이런 특징과 대부분의 콜백 패턴이 마지막 인자로 콜백 함수를 받는다는 점을 이용하면 _.partial이나 abcjs의 B 등을 통해 다음과 같은 코드도 작성할 수도 있다.

```javascript
  /* abcjs 2 */
  C(5, 10, CB(
    add,
    _.partial(sub, _, 10),
    _.partial(mul, 30),
    log));

  /* abcjs 3 */
  C(5, 10, CB(
    add, B(X, 10, sub), B(40, mul), log));
```

물론 Promise를 이용하더라도 아래의 promisify 같은 함수 구현을 통해 비슷한 코드셋을 만들 수 있다. 하지만 .then을 제거할 수 없다. 물론 .then을 내부에서 풀어주는 함수를 만들면 .then도 제거할 수 있겠지만 그렇게 되면 then이 드러나지 않게 되므로 pipeline과 같아 진다.

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
    .then(log);

  /* Promise 3 */
  promisify(add)(5, 10)
    .then(B(X, 10, promisify(sub)))
    .then(B(60, promisify(mul)))
    .then(log);

```

promisify와 같은 일을 미리 해두면 되지 않겠는가라고 생각할 수 있다. 하지만 모든 콜백 함수를 각 함수에 맞게 미리 promisify 해두는 것도 쉽지 않으며 기존 레퍼런스를 덮어버릴 경우 callback 함수를 arguments.length[arguments.length-1] 과 같이 받는 함수 등이 있을 경우에 그 함수의 라이브러리 내부에서 사용하다가 문제가 생길 수 있는 등의 위험이 있다.

반면에 abcjs는 함수를 감싸서 새로운 함수를 뱉는 것이 아니라 함수에게 callback 패턴의 함수라는 단서를 남겨 놓고 함수 자체는 바꾸지 않기 때문에 새로 다른 변수에 정의할 필요도 없고 기존의 콜백 방식으로도 동일하게 사용 할 수 있게 한다. abcjs도 미리 CB로 감싸둔다면 이후 Pipeline 사용시 더욱 간단하게 사용 가능하다.

```javascript

  /* Promise 4 (with promisify) */
  var add2 = promisify(add);
  var sub2 = promisify(sub);
  var mul2 = promisify(mul);

  add2(5, 10).then(B(X, 10, sub2)).then(B(X, 70, mul2)).then(log);

  /* abcjs 4 */
  CB(add, sub, mul);
  C(5, 10, [add, B(X, 10, sub), B(90, mul), log]);

  /* abcjs 5 (with promisify) */
  C(5, 10, [add2, B(X, 10, sub2), B(100, mul2), log]);

  /* abcjs 6 (with Promise)*/
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
        mul(result, 110, resolve);
      });
    },
    log]);

```

abcjs는 Promise에 대한 의존성이 없지만 Promise를 지원한다. Pipeline 내부의 함수 결과가 Promise나 jQuery Deffered Object 와 같은 then 메소드를 가진 객체일 경우 결과를 꺼내 Pipeline의 다음 함수에게 전달한다.

abcjs의 Pipeline은 Promise와 달리 함수들을 실행하다 비동기 상황을 만났을때만 then 메소드를 가진 약식 Promise 객체를 생성하여 즉시 리턴하고 재귀를 통해서만 비동기를 제어한다. 이 약식 Promise는 중첩 Pipeline 등을 위해 사용된다. ES6 이상이거나 Promise 생성자가 있을 경우에는 약식 Promise가 아닌 정식 Promise를 리턴하기 때문에 Promise나 ES7의 async await 등과도 연동 된다.

잠깐 쉬어가는 의미로 아래 코드를 보자. 필자가 실무에서 사용하지는 않지만 재밌는 코드가 있다.
bfy를 하면 비동기 함수임에도 불구하고 아래와 같은 코드가 동작한다.

```javascript
  /* abcjs 7 (bfy)*/
  var badd = B(add);
  var bsub = B(X, 10, sub);
  var bmul = B(120, mul);
  var blog = B(log);

  blog(bmul(bsub(badd(5, 10))));
```

Promise와 abcjs를 비교해보았다. 물론 Promise를 이용해서도 B, C, CB와 같은 함수들을 모두 구현할 수 있다. 그렇지만 abcjs는 Promise 없이 구현 되었으며 재귀만으로 비동기를 제어한다. Promise는 현재 모든 브라우저에서 동작하지 않는다. ES6의 Promise 역시 bluebirdjs 등과 비교하면 스펙이 빈약하다. bluebirdjs는 6,000 줄이지만 abcjs는 1,000 줄이며 비동기 제어외에도 HTML 템플릿 엔진, 깊은 값 변경 등 많은 기능을 지원한다. 비동기 제어와 관련 기능만 놓고 비교해도 abcjs가 더욱 많은 기능을 제공한다. 다음은 비동기 제어와 관련한 API 비교표.


|                      | bluebirdjs                                                   | abcjs                                                                          |
|----------------------|--------------------------------------------------------------|--------------------------------------------------------------------------------|
| multiple results     | all, spread                                                  | MR, spread, div, all, auto multiple results(callback)                          |
| functional, control statement | race, props, any, some, map, reduce, filter, each, mapSeries | each, map, reduce, filter, reject, find, findIndex, findKey, some, every, uniq |
| error handling       | throw, catch, reject                                         | throw, CATCH, ERR                                                              |
| etc                  | tap, delay, promisify, promisifyAll ...                      | tap, delay, bfy, CB, async jade template, async string template ...            |
| line                 | 5,598                                                        | 976                                                                            |


참고 링크
- [자바스크립트의 약속(Promise): 1부 의문점] (https://gamecodingschool.org/2015/05/23/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EC%9D%98-%EC%95%BD%EC%86%8Dpromise-1%EB%B6%80-%EC%9D%98%EB%AC%B8%EC%A0%90/)
- [자바스크립트의 약속(Promise): 2부 비교] (https://gamecodingschool.org/2015/05/28/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EC%9D%98-%EC%95%BD%EC%86%8Dpromise-2%EB%B6%80-%EB%B9%84%EA%B5%90/)
- [JavaScript 모나드] (http://www.haruair.com/blog/2986)
- [abcjs 콜백] (https://github.com/marpple/abc-functional-javascript/blob/master/example/05.%20Async%20(callback).html)
- [abcjs Promise] (https://github.com/marpple/abc-functional-javascript/blob/master/example/06.%20Async-2%20(Promise).html)
- [bluebirdjs] (http://bluebirdjs.com/docs/getting-started.html)
