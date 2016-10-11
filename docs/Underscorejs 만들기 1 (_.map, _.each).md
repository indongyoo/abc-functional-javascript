# Underscorejs 만들기 1

### 이전에 읽으면 좋은 글
 - [함수형 자바스크립트의 실용성 1](https://github.com/marpple/abc-functional-javascript/blob/master/docs/%ED%95%A8%EC%88%98%ED%98%95%20%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EC%9D%98%20%EC%8B%A4%EC%9A%A9%EC%84%B1%201.md)
 - [함수형 자바스크립트의 실용성 2](https://github.com/marpple/abc-functional-javascript/blob/master/docs/%ED%95%A8%EC%88%98%ED%98%95%20%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EC%9D%98%20%EC%8B%A4%EC%9A%A9%EC%84%B1%202.md)

### Underscorejs 소개

Underscorejs는 작고 놀라운 함수형 자바스크립트 라이브러리다. 나는 Underscorejs의 내부 코드와 마이클 포거스의 함수형 자바스크립트라는 책을 통해 많은 것을 배웠다. 이 글에서는 Underscorejs 주요 함수들을 구현하고 그 함수를 사용할 유용한 상황을 만나면서 그 속에 담긴 컨셉과 함수형 자바스크립트의 매력을 찾아보고자 한다.

우선 왜 Underscorejs 일까. `_`를 네임스페이스로 가진다. javascript에서 `$`와 `_`는 에러 없이 사용 가능한 단 두 개의 특수 문자인데 jQuery와 Underscorejs가 모두 차지했다. 그래도 jQuery는 `$`를 Underscorejs는 `_`를 가질 자격이 충분하다고 생각한다. 두 라이브러리는 분명 특별하다.

### _.map, _.each

Underscorejs의 `_.map, _.each` 등을 구현할 것인데 먼저 Underscorejs에 대해 좀 더 들여다보자. 우선 이 함수들은 첫 번째 인자로 약 2-4가지 정도의 타입을 받을 수 있다. 사실은 2가지라고 해야 할지 3가지라고 해야 할지 4가지라고 해야 할지 애매하다. 실용적으로 보면 4가지라고 할 수 있다. 이를 이야기하기 전에 다음을 먼저 보자.

```javascript
  log( list1[0] == 1 && list1[1] == 2 && list1[2] == 3 && list1.length == 3 );
  // true
  list1.pop();
  log( list1.length );
  // 2
  for (var i = 0; i < list1.length; i++) log(list1[i]);
  // 1
  // 2
```

`list1`은 `Array`일까? 답부터 이야기하면 "알 수 없다." 혹은 "위 상황만 놓고는 알 수 없다."이다. javascript에서는 위와 같이 사용 가능한 객체가 `Array`만 있지 않다. 위와 같이 동작한다고 하더라도 얼마든지 다음과 같은 결과가 나올 수 있다.

```javascript
  log( list1.constructor == Array );
  // false
```

그렇다면 `list1`의 정체는 무엇일까. `list1`은 일단 `Array`가 아니라고 판명 났으므로 `Array`는 아니다. 그렇다면 혹시 `arguments`는 아닐까? `arguments` 일수도 있다. 그런데 `arguments`에는 `pop`이 없는데? 그럼에도 불구하고 `arguments` 일수도 있다. 물론 아닐 수도 있다. `list1`은 무엇이었을까. 어쩌면 아래와 같았을지도 모른다.

```javascript
  var list1 = {};
  list1[0] = 1, list1[1] = 2, list1[2] = 3, list1.length = 3;
  list1.pop = function () {
    delete this[this.length-1];
    this.length = this.length-1;
  };
```

### ArrayLike와 Underscorejs의 컨셉

다시 Underscorejs로 돌아오자. `_.each, _.map` 등에서 사용하는 객체가 4가지 정도라고 했다. 바로 `{}, [], arguments, arrayLike` 다.

```javascript
  // 1. {}
  var d1 = { name: 'PJ', age: 25 };

  // 2. []
  var d2 = [1, 2, 3];

  // 3. arguments
  var d3 = (function() { return arguments; })(1, 2, 3);

  // 4. arrayLike
  var d4 = $('div');
  var d5 = { length: 3 };
  d5[0] = 1, d5[1] = 2, d5[2] = 3;
  var d6 = "hi";

```

jQuery 객체를 사용할 때 `$('div')[0], $('div')[1]` 이렇게 사용하지만 `$('div').constructor == Array`의 결과는 `false`다. `Array`가 아니라는 것이다. d5도 당연히 `Array`가 아니다. `d3`도 `d3[1] == 2`이지만 `Array`가 아니라 즉시 실행된 익명 함수의 `arguments` 객체이다.

`d1`은 완전히 `Array`가 아니다. `d2, d3, d4, d5, d6` 완전한 `Array`거나 `Array` 같은 애들이다. `Array`라고 했다가 `Array`가 아니라고 했다가 `Array` 같다고 하니 대체 뭐란 말인가.

javascript는 객체를 자유롭게 만들 수 있고 객체의 `key`도 자유롭게 설정할 수 있다. 문자열과 숫자 심지어는 특수문자도 `key`로 마음껏 사용할 수 있다.

```javascript
  var d7 = {};
  d7["%@---<M<>>#"] = 'hi';
  log( d7["%@---<M<>>#"] );
  // hi
```

`d2, d3, d4, d5, d6`은 Underscorejs의 `_.each` 등의 함수에게 그저 `arrayLike`다. 다음 `isArrayLike`의 값이 `true`면 `_.each`등은 `i++`을 이용한 `for` 문을 돌린다. `d1`이 들어오면 `Array`가 아닐 것이라고 생각하고 모든 `keys`를 뽑아낸 뒤에 `keys`를 이용해 `for` 문을 돌린다.

```javascript
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var isArrayLike = function (list) {
    var length = list && list.length;
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };
```

약간 무책임해 보이지 않는가? "Array가 맞나?"라는 판단을 겨우 `.length`가 숫자 정도인지만 가지고 한다니. `_.each`등의 함수에서는 `arrayLike`가 아니더라도, 어떤 에러 조차 뱉지 않고 `catch`도 안한다. 혹시 그동안 Underscorejs를 사용했던 사람이라면 혹시 불안감이 들거나 갑자기 내 코드에 에러가 있지 않을까 걱정이 되진 않는가? 걱정할 필요 없다. 아마 에러가 나지도 않았을 것이고 `try catch`를 할 필요도 없을 것이다. Underscorejs는 굉장히 쿨하다. 마치 이렇게 말하는 것 같다.

"네가 잘 줄 거잖아."

Underscorejs를 보면 `try catch`가 단 한번 나온다. 심지어 그 `try catch`도 `eval`과 비슷한 코드를 돌리는 곳에서 딱 한 번이다. 나는 사실 유명한 라이브러리들 중에 이토록 쿨한 라이브러리를 별로 본 적이 없었다. 심지어 Underscorejs는 다름 아닌 Data를 주로 다루는 라이브러리다. 또 Data를 다루는 많은 유명 라이브러리(Backbone, ORM 등)안에서 많이 사용되어지고 있다. 근데 어떻게 이렇게 데이터 형에 대해 관대하고 쿨하다니. 아무거나 막 받고 에러를 처리해주지도 않고 그냥 돌아간다.

잘 죽지도 않는다. 어떻게 그럴까. 데이터 형을 체크하지 않고도 데이터를 잘 다루고 있기 때문이다. 내부에서 사용하고 있는 Native Helpers나 자신들이 만든 함수들의 동작에 대해 아주 정확히 아는 것을 바탕으로 그것들 간의 합을 너무나 잘 맞추고 있다.

```javascript
  _.each({a: 2, length: 4}, function() { console.log(arguments) });
  // [undefined, 0, Object]
  // [undefined, 1, Object]
  // [undefined, 2, Object]
  // [undefined, 3, Object]
  _.keys(10);
  // []
  _.each({a: 2, length: 4});
  // Uncaught TypeError: iteratee is not a function(…) underscore.js:153
```

나는 이러한 Underscorejs를 보며, 그동안 얼마나 지레 겁먹고 에러 처리를 했었는지, 혹은 필요 없는 `if`문을 추가했었는지 알게 되었다. 주어진 데이터나 API들에 대한 잘 알고 있지 못했기 때문이다. Underscorejs는 체크는 안 하지만 절대 모르쇠로 일관하지 않는다. 개발자가 '목적에 의해' 웬만해선 절대 실수하지 않을 영역에 대해서는 그냥 쿨해버린다. 그렇지 않은 곳은 다형성을 잘 지원하는 것 이상의 감각으로 에러를 내지 않고 있다. 언어에 대한 감각, javascript 데이터형에 대한 이해, Native Helpers, Methods에 대한 높은 이해를 바탕으로 이 풍성한 라이브러리를 짧고 간결하게 만들었다. 그들은 그런 실력을 바탕으로 Underscorejs, CoffeeScript, Backbone 등을 만들며 javascript 진영에 큰 영향력을 끼쳤을 것이다.

### _.map 만들기

이야기가 길었지만 Underscorejs에 담긴 컨셉과 생각을 이해하려면 꼭 필요한 검토였다고 생각한다. 자 이제 `_.map`을 구현해보자. `_.map`을 구현하기에 앞서 얘기해두자면 Underscorejs처럼 오래된 브라우저까지 지원하지는 않겠다. 본 글은 함수형 자바스크립트에 대해 알아보기 위한 글이고 예제이므로 이해를 위해 최신 Native Helpers를 사용하기도 하고 안 하기도 하겠고 Chrome과 Nodejs에서만 테스트를 하겠다.

```javascript
  _.map = function(list, iteratee) {
    var new_list = [];
    for (var i = 0, len = list.length; i < len; i++) {
      new_list.push(iteratee(list[i], i, list));
    }
    return new_list;
  };
```

위 코드가 앞서 만들었던 `_.map`이다. Underscorejs는 _.map의 첫 번째 인자로 `{}, [], arguments, arrayLike` 등을 받는다고 했다. 우선 `.length` 검사를 통해 `i++`에 의존하여 `for`를 돌릴지 여부를 결정하고 아니라면 `for in` 문을 활용해보자.

```javascript
  _.map = function(list, iteratee) {
    var new_list = [];
    if (isArrayLike(list))
      for (var i = 0, len = list.length; i < len; i++)
        new_list.push(iteratee(list[i], i, list));
    else
      for (var key in list)
        new_list.push(iteratee(list[key], key, list));
    return new_list;
  };

  log( _.map([1, 2, 3], function(v) { return v * 2 }) );
  // [2, 4, 6]
  log( _.map({ a: 3, b: 2, c: 1 }, function(v) { return v * 2 }) );
  // [6, 4, 2]
```

제법 그럴싸해졌다. Underscorejs의 `_.map`은 세 번째 인자로 `iteratee`에서 사용할 `this` 도 전달할 수 있다. 코드는 조금만 손대면 되지만 설명은 하지 않겠다. 좀 더 함수적인 아이디어에만 집중하자.

```javascript
  var _ = {};

  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var isArrayLike = function (list) {
    var length = list && list.length;
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  _.map = function(list, iteratee, context) {
    iteratee = iteratee.bind(context);
    var new_list = [];
    if (isArrayLike(list))
      for (var i = 0, len = list.length; i < len; i++)
        new_list.push(iteratee(list[i], i, list));
    else
      for (var key in list)
        new_list.push(iteratee(list[key], key, list));
    return new_list;
  };

  log(
    _.map([1, 2, 3], function(v, i) {
      return v * this[i]
    }, [3, 2, 1])
  );
  // [3, 4, 3]
```

이제 `_.map` 하나가 완성되었다. 이 `_.map` 하나 말고는 아직 가진 것이 아무것도 없다. `_.map`이 그럴싸해졌으니 '쓸모없는' 함수 `_.idenetity`등과 함께 사용하여 재밌는 함수를 만들어보자.

```javascript
  _.identity = function(v) {
    return v;
  };
  _.values = function(list) {
    return _.map(list, _.identity);
  };

  log( _.values([3, 2, 1]) );
  // [3, 2, 1]
  log( _.values({ id: 5, name: "JE", age: 27 }) );
  // [5, "JE", 27]

  _.a2 = function(a, b) { return b; };
  _.keys = function(list) {
    return _.map(list, _.a2)
  };

  log( _.keys([3, 2, 1]) );
  // [0, 1, 2]
  log( _.keys({ id: 5, name: "JE", age: 27 }) );
  // ["id", "name", "age"]
```

`_.identity, _.values, _.keys` 모두 Underscorejs에 있는 함수지만 Underscorejs와는 다른 순서로 다른 코드로 Underscorejs를 만들고 있다. `_.a2`는 아마 없을 것 같다. 재미있는 함수다.

### _.each 만들기

몇 개 함수가 생겼으니 `_.each`도 쉽게 만들 수 있을 것 같다. 하지만 내부에서 `_.map`을 쓰진 않겠다. 왜냐면 `_.each`와 `_.map`은 로직이 완전히 다른 함수이기 때문이다. `_.map`을 쓰진 않지만 `_.map`으로 만든 `_.keys`를 사용하여 쉽게 다형성을 만들었다.

```javascript
  function bcurrentKey(keys) {
    return keys ? function(i) { return keys[i]; } : _.identity;
  }

  _.each = function(list, iteratee, context) {
    iteratee = iteratee.bind(context);
    var keys = !isArrayLike(list) && _.keys(list),
        len = (keys || list).length;

    for (var currentKey = bcurrentKey(keys), key, i = 0; i < len; i++)
      iteratee(list[key = currentKey(i)], key, list)
    return list;
  };

  _.each([1, 2, 3], log);
  // 1 0 [1, 2, 3]
  // 2 1 [1, 2, 3]
  // 3 2 [1, 2, 3]

  _.each({ id: 5, name: "JE", age: 27 }, log);
  // 5 "id" { id: 5, name: "JE", age: 27 }
  // "JE" "name" { id: 5, name: "JE", age: 27 }
  // 27 "age" { id: 5, name: "JE", age: 27 }
```

`bcurrentKey`는 앞서 보였던 `badd` 등과 동일한 패턴이다. Underscorejs의 `_.map, _.some, _.mapObject, _.every` 등은 위의 `bcurrentKey` 같은 방식으로 구현되어 있지는 않고 아래처럼 되어있다.

```javascript
  for (var index = 0; index < length; index++) {
    var currentKey = keys ? keys[index] : index;
    // ...
  }
```

차이를 발견했는가? 우리가 만든 `_.map`은 `keys`가 있는지 없는지를 한 번만 비교하고서는 그 이후는 무조건 동일한 함수 실행으로 인해 결과만 뱉기에 삼항 연산자가 한 번만 돌고 그 이후는 결과만 만든다. Underscorejs의 구현은 삼항 연산자가 `length` 만큼 동작할 것이다.

### 함수형 패러다임

함수형 패러다임을 잘 활용하면 다형성을 지키면서도 성능을 놓치지 않는 아이디어를 만들 수 있다. 위 상황만 놓고 보면 무엇이 더 성능이 좋을지 잘 모르겠다. 하지만 논리적으로 놓고 보면 두 코드는 큰 차이를 가지고 있다. 한 번만 비교하느냐 100번이고 1,000번이고 비교하느냐의 차이를 가지고 있다. 위와 같이 간단한 연산에서는 두 코드의 패턴이 성능 차이를 많이 내진 않을 것이다. 하지만 나는 저 코드 패턴 자체를 소개하고 싶다. 만일 조건식 안에서만 또 loop를 1,000번 돌아야 한다던지, 데이터베이스에 다녀와야 한다던지 한다면 두 패턴은 완전히 다른 성능을 낼 것이다.

아무것도 없는 상태로 돌아가 `_.map, _.identity, _.values, _.a2, _.keys, _.each` 순으로 구현했다. 모든 함수는 서로를 사용할지라도 의존성이 없다. 인자와 결과 외에는 서로의 내부에서 무슨 일을 하는지에 대해 관심이 없다. 인자와 결과만 같다면 다른 함수로 대체돼도 아무 상관이 없다. 서로의 데이터를 변경하고 있지 않다. 서로가 사용하는 데이터가 어떻게 생겼는지 관심도 없다. 모든 함수가 같은 인자를 주면 항상 같은 값을 뱉는 순수 함수로만 이루어졌다. 동작 외적인 '준비를 위한 코드'도 없다. 모두 선언 즉시 사용이 가능한 함수다. 클래스도 없고 상속도 없다. 설정값도 없다. 새로운 객체가 initialize 돼야 하거나 되어있지 않다. 사용을 위한 별도의 loading이나 타이밍이 필요하지 않다. 기록되는 상태가 없어 부수 효과도 메모리 릭도 있을 수 없다. 상황과 상태의 의존하지 않으므로 전역에 선언되어도 상관이 없다. 앞으로 어떻게 발전할지에 대한 준비도 설계도 딱히 없다. 지금 만들고 싶은 함수와 필요한 함수들만 만들었다. 함수형 자바스크립트는 어쩌면 극 실용주의인지도 모르겠다. Underscorejs의 쿨함처럼.

### 한가지 더
`bcurrentKey`가 실행되는 환경에서 `keys`가 없다면 `function(i) { return keys[i]; }` 이 익명함수는 정의되지 않으므로 클로저가 되지 않는다.

--------------

- [함수형 자바스크립트의 실용성 1](https://github.com/marpple/abc-functional-javascript/blob/master/docs/%ED%95%A8%EC%88%98%ED%98%95%20%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EC%9D%98%20%EC%8B%A4%EC%9A%A9%EC%84%B1%201.md)
- [함수형 자바스크립트의 실용성 2](https://github.com/marpple/abc-functional-javascript/blob/master/docs/%ED%95%A8%EC%88%98%ED%98%95%20%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EC%9D%98%20%EC%8B%A4%EC%9A%A9%EC%84%B1%202.md)

[다른 글 모두 보기] (https://github.com/marpple/abc-functional-javascript/tree/master/docs)
