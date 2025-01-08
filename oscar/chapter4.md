> Author: 윤정기(Oscar)
> 
> 스터디 2회차 정리 자료

# 🌟 함수와 메서드

### 🌳 함수란?

함수는 특정한 작업을 수행하기 위해 독립적으로 설계된 코드의 집합이다.

- 반환값이 있으면 '함수' 가 되고
- 반환값이 없으면 '프로시저' 로 분류된다.

### 🌳 함수형 프로그래밍에서는 왜 프로시저를 지양할까?

그 이유는 바로 부수 효과(side effect) 때문이다. 프로시저는 값을 반환하지 않기 때문에 외부 상태를 변경할 소지가 많기 때문이다.

```typescript
let total = 0;
const addToTotal = (num: number) => {
  total += num; // side effect; 프로시저를 사용했더니, 외부 상태가 변경됨
}

addToTotal(10);
console.log(total); // 10
```

반면 함수형 프로그래밍에서는 순수 함수를 지향한다.

```typescript
const add = (num1: number, num2: number): number => {
  return num1 + num2;
}

const result = add(total, 10)
console.log(result); // 10
```

### 🌳 함수와 메서드의 차이점

| 구분 | 함수 (Function) | 메서드 (Method) |
|---|---|---|
| 소속 관계 | 독립적으로 존재 | 객체에 종속됨 |
| this 바인딩 | 전역 객체 또는 undefined 참조 | 자신이 속한 객체를 this로 참조 |
| 호출 방식 | 직접 호출 (예: `sayHello()`) | 객체를 통해 호출 (예: `person.greet()`) |
| 목적 | 독립적인 기능을 수행하는 코드 블록 | 객체의 동작을 정의하는 코드 블록 |
| 접근 범위 | 전역 또는 지역 스코프에서 접근 가능 | 해당 객체의 스코프 내에서만 접근 가능 |

### 🌳 함수의 선언부

자바스크립트는 함수를 선언하는 방식이 몇 가지가 있을까?

- **함수 선언문(Function Declaration)**

```typescript
function add(num1: number, num2: number): number {
  return num1 + num2;
}
```

- **함수 표현식(Function Expression)**

```typescript
const add = function(num1: number, num2: number): number {
  return num1 + num2;
}
```

- **화살표 함수(Arrow Function)**

```typescript
const add = (num1: number, num2: number): number => {
  return num1 + num2;
}
```

- 생성자 함수(Function Constructor)

```typescript
const add = new Function('num1', 'num2', 'return num1 + num2');
```

- 즉시 실행 함수(IIFE: Immediately Invoked Function Expression)

```typescript
(function(num1: number, num2: number): number {
  return num1 + num2;
})(10, 20);
```

- 프로토타입 함수(Prototype method)

```javascript
function Person(name: string) {
  this.name = name;
}

Person.prototype.sayHello = function() {
  console.log(`Hello, ${this.name}`);
}
```

### 🌳 함수의 매개변수

함수의 매개변수에는 네 가지 종류가 있다.

- 필수 매개변수(Required Parameter)

    ```typescript
    function add(num1: number, num2: number): number {
        return num1 + num2;
    }
    ```

- 선택적 매개변숴(Optional Parameter)
  ```typescript
  // 값을 전달하지 않으면 undefiend 로 나옴.
  function add(num1: number, num2?: number): number {
      return num1 + (num2 || 0);
  }
  ```

- 기본값 할당 매개변수(Default Parameter)

    ```typescript
    function add(num1: number, num2: number = 0): number {
        return num1 + num2;
    }
    ```

- 나머지 매개변수(Rest Parameter)

    ```typescript
    function add(...nums: number[]): number {
        return nums.reduce((acc, cur) => acc + cur, 0);
    }
    ```

### 🌳 함수의 매개변수에는 어떤 타입이 올 수 있을까?

함수의 파라미터에는 다양한 타입이 올 수 있다.

##### 올 수 있는 타입들:

- Any

    ```typescript
    function process(param: any) {
      // ...
    }
    ```
- Unknown

    ```typescript
    function process(param: unknown) {
      // ...
    }
    ```
- Literal Type

    ```typescript
    function process(param: 'hello' | 'world') {
      // ...
    }
    ```
- Function Type

    ```typescript
    function process(param: (num1: number, num2: number) => number) {
      // ...
    }
    ```
- Union Type

    ```typescript
    function process(param: string | number) {
      // ...
    }
    ```
- Array Type

    ```typescript
    function process(param: number[]) {
      // ...
    }
    ```
- Primitive Type

    ```typescript
    function process(param: number) {
      // ...
    }
    ```

##### 오지 못하는 타입들:

- void 타입

    ```typescript
    // ❌ 잘못된 사용
    function process(param: void) {
    // void는 반환 타입으로만 사용 가능
    }
    
    // ✅ 올바른 사용
    function process(): void {
    // 반환값이 없음
    }
    ```

- never 타입

    ```typescript
    // ❌ 잘못된 사용
    function process(param: never) {
    // never는 매개변수 타입으로 적절하지 않음
    }
    
    // ✅ 올바른 사용
    function throwError(): never {
    throw new Error('에러 발생');
    }
    ```

- abstract class type

    ```typescript
    abstract class Animal {
      abstract makeSound(): void;
    }
    
    // ❌ 잘못된 사용
    function makeNoise(animal: Animal) {
    // 추상 클래스의 인스턴스는 직접 생성할 수 없음
    }
    
    // ✅ 올바른 사용
    function makeNoise(animal: Dog | Cat) {
    // 구체 클래스 사용
    }
    ```
- internal types(in Typescript)

    ```typescript
    // ❌ 타입스크립트 내부 타입들
    function process(
      param1: InternalType,  // 타입스크립트 내부 타입 사용 불가
      param2: ThisType       // 특수 목적 타입
    ) {
       // ...
    }
    ```

- 타입 연산자로만 구성된 타입

    ```typescript
    // ❌ 잘못된 사용
    // typeof는 단독으로 사용 불가
    function process(param: typeof) {}
    
    // ✅ 올바른 사용
    function process(param: typeof someVariable) {}
    ```

### 🌳 실행문과 표현식문 용어 정리

꽤 오래 전부터 프로그래밍 언어는 실행문 지향 언어와 표현식 지향 언어로 구분되어 왔다.

- 실행문 지향 언어: C
- 표현식 지향 언어: Scala

자바스크립트는 실행문과 표현식을 모두 지원한다. 실행문은 어떤 동작을 수행하고, 표현식은 어떤 값을 만들어 낸다.

이런 프로그래밍 언어를 다중 프로그래밍 언어라고 한다.

프로그래밍 언어에서 실행문은 CPU 에서 실행되는 코드를 의미한다. 그런데 실행문은 CPU 에서 실행만 될 뿐 결과를 알려주지 않는다.

실행문이 결과를 알려면 반드시 return 키워드를 사용해야 한다. 반면에 표현식 문은 CPU 에서 실행된 결과를 굳이 return 키워드를 사용하지 않아도 알려준다.

```typescript
let x
x = 1
```

반면에 다음과 같은 코드에서 x > 0 부분은 CPU 가 평가한 후 true 나 false 라는 값으로 결과를 알려주지 않으면 if 문이 정상적으로 동작할 수 없다.

```typescript
let x = 10
if (x > 0) 
    x = 1
```

그런데 만일 프로그래밍 문법이 다음과 같다면 코드를 작성하기가 상당히 번거로워진다.

```typescript
if(return x > 0)
  x = 1
```

즉 똑같이 CPU 에서 실행되는 구문이더라도 x > 0 처럼 return 키워드 없이 결괏값을 반환하는 실행문이 필요하다.

이를 표현식 문 이라고 구분해서 부른다.

> 실행문 지향 언어들은 if 문을 if 실행문 이라고 표현한다. 반면에 표현식 지향 언어들은 if 표현식이라고 표현한다. if 표현식은 값을 반환하므로 실행문 지향 언어에서는 불가능한 다음과 같은 구문을 작성할 수 있게 됐다.

```typescript
val x = if(a > b) a else b
```

###### **자바스크립트는 if 문은 실행문인가요? 표현식문인가요?**

자바스크립트 If 문은 실행문이다.

```typescript
// 1. 값을 반환하지 않음
let result = if (true) { 1 } else { 2 }  // 🚫 Syntax Error

// 2. 변수에 할당할 수 없음
const check = if (condition) { ... }  // 🚫 Syntax Error

// 3. 표현식이 들어갈 수 있는 위치에 사용할 수 없음
console.log(if (true) { 1 })  // 🚫 Syntax Error
```

### 🌳 실행문과 표현식문 용어 정리

꽤 오래 전부터 프로그래밍 언어는 실행문 지향 언어와 표현식 지향 언어로 구분되어 왔다.

- 실행문 지향 언어: C
- 표현식 지향 언어: Scala

자바스크립트는 실행문과 표현식을 모두 지원한다. 실행문은 어떤 동작을 수행하고, 표현식은 어떤 값을 만들어 낸다.

이런 프로그래밍 언어를 다중 프로그래밍 언어라고 한다.

프로그래밍 언어에서 실행문은 CPU 에서 실행되는 코드를 의미한다. 그런데 실행문은 CPU 에서 실행만 될 뿐 결과를 알려주지 않는다.

실행문이 결과를 알려면 반드시 return 키워드를 사용해야 한다. 반면에 표현식 문은 CPU 에서 실행된 결과를 굳이 return 키워드를 사용하지 않아도 알려준다.

```typescript
let x
x = 1
```

반면에 다음과 같은 코드에서 x > 0 부분은 CPU 가 평가한 후 true 나 false 라는 값으로 결과를 알려주지 않으면 if 문이 정상적으로 동작할 수 없다.

```typescript
let x = 10
if (x > 0) 
    x = 1
```

그런데 만일 프로그래밍 문법이 다음과 같다면 코드를 작성하기가 상당히 번거로워진다.

```typescript
if(return x > 0)
  x = 1
```

즉 똑같이 CPU 에서 실행되는 구문이더라도 x > 0 처럼 return 키워드 없이 결괏값을 반환하는 실행문이 필요하다.

이를 표현식 문 이라고 구분해서 부른다.

> 실행문 지향 언어들은 if 문을 if 실행문 이라고 표현한다. 반면에 표현식 지향 언어들은 if 표현식이라고 표현한다. if 표현식은 값을 반환하므로 실행문 지향 언어에서는 불가능한 다음과 같은 구문을 작성할 수 있게 됐다.

```typescript
val x = if(a > b) a else b
```

###### **자바스크립트는 if 문은 실행문인가요? 표현식문인가요?**

자바스크립트 If 문은 실행문이다.

```typescript
// 1. 값을 반환하지 않음
let result = if (true) { 1 } else { 2 }  // 🚫 Syntax Error

// 2. 변수에 할당할 수 없음
const check = if (condition) { ... }  // 🚫 Syntax Error

// 3. 표현식이 들어갈 수 있는 위치에 사용할 수 없음
console.log(if (true) { 1 })  // 🚫 Syntax Error
```

### 🌳 복합 실행문 용어 정리

function 키워드로 만드는 함수는 반드시 몸통을 중괄호로 감싸야 하는데, 여기서 중괄호는 앞서 설명한 복합 실행문을 의미한다.

따라서 함수 몸통은 다음처럼 여러 줄로 구현할 수 있다.

```typescript
function f() {
  let x = 1, y = 2;
  let result = x + y + 10;
}
```

> 복합 실행문에서 변수의 유효 범위
>
> 복합 실행문은 변수의 유효 범위도 지역범위로 제한한다.
> 따라서 다음처럼 두 함수의 몸통에 똑같은 이름의 변수가 있더라도 각 함수의 몸통에서만 유효하므로 서로 간섭하지 않는다.

```typescript
function f() { let x = 1 }
function g() { let x = 2 }
```

### 🌳 표현식과 표현식문 용어 정리

본문에서는 표현식과 표현식문에 대한 용어 차이를 설명해주고 있다.

- **표현식(Expression)**: 값으로 평가될 수 있는 코드 조각
- **표현식문(Expression Statement)**: 표현식을 실행하는 코드 조각

본문에서 말하고자 하는 의도를 조금 더 파악해보자.

```typescript
if (a > b) {
  console.log('a is greater than b');
}
```

이 코드는 코드 자체로 실행 할 수 없다. 왜냐하면 실행문이 아니기 때문이다.

이 코드는 `표현식` 이다.

이 코드를 실행하려면, 외부에서 이 코드를 포함하고 있는 `함수` 또는 `스크립트`를 실행해야 한다.

다시 말하면, 코드 그 자체가 실행문이 아니란 소리.

하지만 표현식문(Expression Statement)은 이와는 다르다. 위에 정리한 바와 같이, `표현식` 과 `실행문` 을 합쳐놔서 그 자체로 실행 가능한 코드 조각이 될 수 있다.

```typescript
const isGreater = (a: number, b: number): boolean => a > b;
```

##### 실행문을 만드는 세미콜론

C 언어는 모든 문장이 반드시 세미콜론 ; 으로 끝나야 한다. C 언어 구문을 참조해 만든 ES5 자바스크립트 또한 모든 문장 끝에 세미콜론이 있어야 한다.

하지만 ESNext 자바스크립트와 타입스크립트에서는 세미콜론을 생략할 수 있다.

다만 타입스크립트에서는 관습적으로 표현식문에는 세미콜론을 붙이지 않는다.

> 🌀 음? 세미콜론?
>
> 오해의 소지가 있는 타이틀: '세미콜론이 실행문을 만든다'
>
> 실행문을 만드는 세미콜론이라는 타이틀은 다소 오해의 소지가 있을 수 있겠는데요.
> C 언어에서는 세미콜론을 붙이지 않으면 컴파일 에러가 발생합니다. 또한 C 컴파일러가 세미콜론을 중심으로 문장을 끝을 해석하기 위해 필요한 구문적 요소이기 때문입니다.
> 따라서, 세미콜론이 '실행문을 만든다' 라는 구문은 잘못되지 않았나 싶습니다.
>
> 또한 타입스크립트에서나 자바스크립트에서 세미콜론을 붙이지 않아도 되는 이유는, 자바스크립트 엔진이 세미콜론을 자동으로 붙여주기 때문(ASI) 입니다.

##### Return 키워드

그런데 앞서 설명한대로 실행문은 CPU 에서 실행된 결과를 알려주지 않는다.

예를 들어 함수 몸통을 복합 실행문으로 구현한다음 함수는 true 나 false 를 반환하지 않는다.

```typescript
function isGreater(a: number, b: number): boolean {
    a > b
}
```

실행문 기반 언어는 이 문제를 해결하려고 return 이라는 키워드를 도입했다.

```typescript
function isGreater(a: number, b: number): boolean {
    return a > b
}
```

그런데 return 키워드는 반드시 함수 몸통에서만 사용할 수 있다는 제약이 있다.

이러한 제약은 문법을 잘못 이해해 다음과 같은 코드를 만드는 것을 방지하려는 의도이다.

```text
if(return x > 0) x = 1
```

> 🌀 음? return 키워드?
>
> 대부분의 프로그래밍 언어에서 return 키워드를 함수 몸통 내로 제한한 것은 코드의 실행 흐름을 명확하게 하기 위해서 입니다.
> 또한 만약 위와 같은 코드가 허용된다면, 조건문 내 표현식이 실행되어 함수가 종료되어야 하는지,
> 아니면 계속해서 다음 코드를 실행해야 하는지 애매해질 수 있습니다.
> 만약 return 키워드 없이 CPU 가 모든 실행문의 결과를 자동으로 반환하도록 설계된 경우라면,
> 어떤 실행문의 결과를 함수의 반환값으로 반환할 지 모호하며, 실행문이 여러 부수 효과를 가질 때 어떤 것을 반환할 지 불명확하기 때문입니다.

### 🌳 함수형 프로그래밍에서 let 보다는 const 를 사용하는 이유

수학에서 함수란 `f(x) = x + 1` 과 같이 함수의 인자에 1을 넣으면 결과는 2를 반환한다. 다른 값은 절대 나오지 않는다.

이것을 부수 효과(side effect) 없는 순수 함수라고 하는데, 자바스크립트도 이러한 형태로 정의할 수 있다.

```typescript
let add = (x: number, y: number) => x + y;
```

하지만 let 키워드는 변수의 값에 `재할당` 이 가능하기 때문에, 한번 선언된(declared) 변수에 다른 값을 할당할 수 없도록 const 로 정의하도록 권고하고 있다.

### 🌳 함수 표현식

표현식이란, 프로그래밍 언어에서 리터럴, 연산자, 변수, 함수 호출 등이 복합적으로 구성된 코드 형태를 의미한다.

이를테면, `1 + 2` 는 표현식이다. `1` 과 `2` 는 리터럴이고, `+` 는 연산자라고 할 수 있다.

**표현식은 항상 컴파일러에 의해 계산법이 적용되어 어떤 값이 된다**

예를 들면, `1 + 2` 는 `3` 이 되고, `true && false` 는 `false` 가 된다.

##### 🌝 그렇다면 함수 표현식은 무엇일까?

변수 f 에 함수를 할당하는 것을 의미한다.

```typescript
let f = function(x: number, y: number): number {
  return x + y;
}
```

이 코드에서 `function(x: number, y: number): number { return x + y; }` 는 함수 표현식이다.

##### 🌝 컴파일러가 함수 표현식을 어떻게 해석할까?

컴파일러는 표현식을 만나면, 즉 `1 + 2` 를 만나면 `3` 으로 계산한다(평가한다, Eager Evaluation).

반면 함수 표현식을 만나면, 즉 `function (x: number, y: number): number { return x + y; }` 를 만나면, symbol a 와 symbol b 가 어떤 값인지 알 수 없어서 Lazy Evaluation 을 적용한다.

> 🌀 본 책에서는 이 부분에서 설명이 부족한 것 같아 조금 더 찾아보았습니다.
>
> 함수의 타입 정의(Type Definition) 과 실제 평가(Real Evaluation) 은 다른 개념 입니다.
>
> 함수의 선언 시점에 타입을 매핑하더라도 실제 호출이 이루어지지 않는 한 실제 값은 알 수 없습니다.
> 따라서 실제 호출이 이루어지는 시점까지는 함수의 실제 값을 미리 추론할 수 없기 때문에 Lazy Evaluation 을 적용하는 것 입니다.

### 🌳 함수의 호출부

위에서 언급한 것처럼, 함수 표현식은 Lazy Evaluation 이 적용되어 있다가, 호출 시점에 평가된다고 말했다.

이때 컴파일러는 호출부를 만나게 되면, Lazy Evaluation 이 적용된 함수를 Eager Evaluation 으로 평가한다.

이때, 함수는 실행 호출문을 이용하여 실행되며, 위 예제의 값은 `f(1, 2)` 를 통해 `3` 이 되는 것이다.

### 🌳 즉시 실행 함수(IIFE)를 통해 분석해보기

```typescript
let f = function(x: number, y: number): number {
  return x + y;
}
```

위와 같이 선언된 함수 표현식이 있다고 하자.

컴파일러는 위 코드(Function Expression)을 만나면, Lazy Evaluation 을 적용한다. 실제로 분해해보면

```typescript
let value =

function(x: number, y: number): number {
    return x + y;
}

(1, 2); 
```

와 같이 분해할 수 있으며, 두번째 구문까지는 Lazy Evaluation 을 적용한다.

실제로 함수가 호출되는 시점인 세 번째 구문에서 즉시 평가(Eager Evaluation)로 평가된다.

### 🌳 화살표 함수

화살표 함수는 ES6에서 도입된 새로운 함수 표현식이다. 화살표 함수와 일반 함수의 차이는 this 바인딩의 차이라고 할 수 있는데,

this 키워드는 **함수가 어떻게 호출되는지에 따라** 다르게 바인딩 될 수 있다는 것을 알아야 한다.

예를 들어보자:

```typescript
const user = {
  name: 'John',
  greet: function() {
    console.log(`Hello, ${this.name}`);
  }
}
```

위 코드는 일반 함수로 구현되었고, `user.greet()` 를 호출하면 `Hello, John` 이 출력된다. 여기서 this 는 `user` 객체를 가리킨다.

일반 함수로 this 를 사용하게 되면, 함수가 호출되는 시점에 동적으로 바인딩이 되기 때문이다. 여기서 중요한 건 **호출 시점** 이다.

만약 위 코드를 아래처럼 호출 시점에 객체의 바인딩 된 메서드로 호출하는 경우에는 우리가 의도한 대로 동작할 것이다.

```typescript
console.log(user.greet()); // Hello, John
```

왜냐하면 greet 함수 내의 this 는 user 객체를 가리키기 때문이다.

하지만 아래의 코드를 가정해보자.

```typescript
var name = '현재 개발하고 있는 개발자가 절대로 닿을 수 없는 높은 곳 어딘가에 위치하는 전역 변수 `name`';

const user = {
  name: 'John',
  greet: function() {
    console.log(`Hello, ${this.name}`);
  }
}
```

만약 이러한 상황이 주어졌다고 했을 때, `user.greet()` 를 호출하면 어떻게 될까?

```typescript
console.log(user.greet()); // Hello, John
```

여전히 `Hello, John` 이 출력된다. 다만 여기서 **호출 시점** 을 다르게 가져간다면?

```typescript
const greet = user.greet;
console.log(greet()); // Hello, 현재 개발하고 있는 개발자가 절대로 닿을 수 없는 높은 곳 어딘가에 위치하는 전역 변수 `name`
```

다르게 나온다. 이유는 `user.greet` 함수가 새로운 변수 greet 에 할당되면서 this 바인딩을 잃어버리기 때문이다. 이 할당 시점에는 단순히 함수 자체만 복사된다.

따라서 `greet()` 을 호출하는 것은 일반 함수로 호출이 되는 것이다. 자바스크립트의 일반 함수 호출 규칙에서 this 는 전역 객체를 가리키게 된다.

이러한 문제를 해결하기 위해서 다양한 방법을 사용하게 된다.

- bind 메서드를 활용한다.
- 메서드 문법을 활용한다.
- 화살표 함수를 사용한다.

```typescript
// bind 내부에 들어간 user 는 this 가 가리킬 객체를 지정한다.
const greet = user.greet.bind(user);

// 메서드 문법 사용
const user = {
  name: 'John',
  greet: function() {
    console.log(`Hello, ${this.name}`);
  }
}

// 화살표 함수 사용
const user = {
  name: 'John',
  greet: () => {
    console.log(`Hello, ${this.name}`);
  }
}
```

그럼 화살표 함수는 이 문제를 어떻게 해결할 수 있는거지?

##### 🌝 화살표 함수의 this 바인딩

화살표 함수는 일반 함수와는 다르게, 자신을 감싸는 외부 스코프의 this 를 그대로 사용한다. 이것을 Lexical scope 이라고 한다.

다음 예시를 보자:

```typescript
// 일반 함수
const user = {
    name: 'John',
    greetLater: function() {
        setTimeout(function() {
            console.log(`Hello, ${this.name}`);
        }, 1000);
    }
};

user.greetLater(); // "Hello, undefined"

// 화살표 함수
const user2 = {
    name: 'John',
    greetLater: function() {
        setTimeout(() => {
            console.log(`Hello, ${this.name}`);
        }, 1000);
    }
};

user2.greetLater(); // "Hello, John"
```

일반 함수의 경우 비동기 함수인 setTimeout 의 콜백 함수는 일반 함수이므로 새로운 this 바인딩이 생성되어 전역 객체를 가리키게 된다.

반면 화살표 함수는 자신만의 this 를 만들지 않고 자신이 속한 스코프의 외부 스코프의 this 를 그대로 사용한다.

그럼 아래의 예제에서 this.name 은 무엇을 가리킬까?

```typescript
const user2 = {
    name: 'John',
    greetLater: function() {
        let name = "Oscar";
        setTimeout(() => {
            let name = "Jeffrey";
            console.log(`Hello, ${this.name}`);
        }, 1000);
    }
};

user2.greetLater(); // ?
```

이 경우에도 this 는 'Hello, John' 을 가리킨다. 그 이유는 this.name 과 name 은 서로 다른 스코프를 가지는데,

- 화살표 함수는 자신의 this 를 생성하지 않음.
- 외부 스코프(greetLater)의 this 를 그대로 사용함(greetLater 의 this 는 user2 를 가리킴)
- 지역 변수와 scope 이 다름.

만약 아래와 같이 this 키워드를 쓰지 않았다면, 가장 가까운 scope 의 name 을 참조하게 된다.

```typescript
const user2 = {
    name: 'John',
    greetLater: function() {
        let name = "Oscar";
        setTimeout(() => {
            let name = "Jeffrey";
            console.log(`Hello, ${name}`);  // "Hello, Jeffrey"
        }, 1000);
    }
};
```



### 🌳 함수형 프로그래밍에서의 함수

##### 일급 함수란?

컴퓨터 과학에서 프로그래밍 언어는 함수를 일급 객체로 취급하는 경우 일급 함수(first-class function)을 갖는다고 한다.

이는 언어가 함수를 다른 함수에 대한 인수로 전달하고, 이를 다른 함수의 값으로 반환하고, 변수에 할당하거나 자료 구조에 저장하는 것을 지원한다는 것을 의미한다.

##### 일급 시민이란?

함수를 일급 객체로 표현한다라는 의미는, 함수 또한 사용할 때 **다른 값들과 동일하게 다룰 수 있다는 것을 의미**한다.

타 언어(c, pascal, c++)에서는 함수를 일급 객체로 다루지 않기 때문에 함수를 다른 함수의 인자로 전달하거나 함수의 반환값으로 사용할 수 없다.

함수형 프로그래밍 언어에서는 **일급 시민(객체)로서의 함수**가 중요한 조건이 된다. 반대로 말하면 위 언어들로는 함수형 프로그래밍을 하기 쉽지 않다는 것이다.

> 자바는 함수형 프로그래밍을 지원하는 언어인가요?
>
> 자바는 함수형 프로그래밍을 지원하는 언어입니다. 자바 8부터 람다식을 지원하고, 함수형 인터페이스를 제공함으로써 함수형 프로그래밍을 지원합니다.

> 자바의 람다 함수는 일급 객체로 정의할 수 있을까?
>
> 일급 객체처럼 사용할 수 있다 인지 일급 객체인지가 궁금하다.

**일급 시민의 조건**

- 변수나 데이터 구조 안에 담을 수 있다.
- 파라미터로 전달할 수 있다.
- 반환값으로 사용할 수 있다.

**일급 시민으로서의 함수 예시**

- 함수를 파라미터로 전달할 수 있다.

```typescript
function say(name: string = '코난'): string {
  return `내이름은 ${name}이야.`;
}

function greet(welcomeMessage: string, name: string): string {
    return `${welcomeMessage}, ${name}`;
}

console.log(greet('안녕', say())); // 안녕, 내이름은 코난이야.
```

- 함수를 변수에 할당할 수 있다.

```typescript
const say = function(name: string = '코난'): string {
  return `내 이름은 ${name}이야.`;
}
```

- 함수를 반환값으로 사용할 수 있다.

```typescript
function say(): () => string {
  return function() {
    return `내이름은 ${name}이야.`;
  }
}

sayHello()(); // Hello!
```

##### 콜백 함수

일등 함수는 프로그래밍 언어가 제공하는 기능이다.

일등 함수 기능을 제공하는 언어에서 함수는 함수 표현식이라는 일종의 값이다.

따라서 변수에 담을 수 있다.

이 말은 함수 표현식을 매개변수로 받을 수 있다는 것을 의미한다.

이처럼 매개변수 형태로 동작하는 함수를 콜백함수라고 한다.

다음 코드에서 함수 f 는 `Callback` 이라는 매개변수가 있는데, 함수 몸통에서 함수로서 호출한다.

```typescript
const f  = (callback: () => void): void => callback();
```

조금 더 현실적인 콜백 함수 사용을 보자

```typescript
export const init = (callback: () => void): void => {
  console.log('default initialization finished');
  callback();
  console.log('all initialization finished');
}
```

다음 코드는 앞서 구현한 init 함수에 자신이 실행하려는 내용을 익명 함수로 전달한다.

```typescript
import { init } from './init';
init(() => console.log('custom initialization finished'));
```

실행 결과는 다음과 같다:

```text
default initialization finished
custom initialization finished
all initialization finished
```

실행 결과를 보면 init 함수가 자신의 몸통과 외부에서 전달 받은 함수를 호출해 각각의 출력문이 실행된 것을 알 수 있다.

> 프레임워크 API 구현에 유용한 콜백 함수
> 프로그램의 전체 구조를 쉽게 작성할 수 있게 설계된 라이브러리를 보통 프레임워크라고 한다. 프레임워크는 여러 프로그램이 공통으로 구현해야 할 함수를 API 라는 이름으로 제공한다.
> 그런데 API 는 프로그램마다 새로운 내용을 추가로 구현 할 수 있게 지원해야 하는데, 이러한 면에서 콜백 함수는 프레임워크의 API 구현에 유용하다.

##### 중첩 함수

함수형 언어에서 함수는 변수에 담긴 함수 표현식이므로 함수 안에 또 다른 함수를 중첩해서 구현할 수 있다. 다음 코드에서 calc 함수는 add 와 multiply 라는 이름의 중첩 함수를 구현하고 있다.

```typescript
const calc = (value: number, cb: (number) => void): void => {
  let add = (a, b) => a + b;
  function multiply(a, b) {
    return a * b;
  }
  let reuslt = multiply(add(1, 2), value);
  cb(result);
}

calc(30, (result: number) => console.log(`result is ${result}`));
```

##### 고차 함수

고차 함수는 또 다른 함수를 반환하는 함수를 말한다.

함수형 언어에서 함수는 단순히 함수 표현식이라는 값이므로 다른 함수를 반환할 수 있다.

고차 함수 기능이 없다면 함수형 프로그래밍이 불가능할 정도로 고차함수는 매우 중요한 기능이다.

- 일반적인 고차 함수의 형태

```typescript
// 일반 함수
const add1 = (a: number, b: number): number => a + b;

// 고차 함수
const add2 = (a: number): (number) => number => (b: number): number => a + b;
```

add2 를 조금 더 풀어서 보겠다:

```typescript
// 풀어서 쓰면:
const add2 = (a: number) => {    // 첫 번째 함수
    return (b: number) => {      // 두 번째 함수 (반환됨)
        return a + b;
    }
}

// 사용 예시
const addWith5 = add2(5);    // 5와 더하는 함수 생성
console.log(addWith5(3));    // 8 (5 + 3)
console.log(add2(2)(3));     // 5 (2 + 3)
```

이러한 형태의 고차 함수가 장점인 이유는 부분 적용에 있다.

```typescript
// 1. 부분 적용 가능
const addWith10 = add2(10);
console.log(addWith10(5));  // 15
console.log(addWith10(7));  // 17

// 2. 함수 합성에 유용
const numbers = [1, 2, 3];
const addFive = add2(5);
const result = numbers.map(addFive);  // [6, 7, 8]
```

**예제를 통한 고차 함수 구현하는 방법**

- 원본 코드

```typescript
const add = (a: number): (number) => number => (b: number): number => a + b;
const result = add(1)(2);
console.log(result); // 3
```

- 구현 코드

1. 함수 시그니처 `NumberToNumberFunc` 정의

```typescript
type NumberToNumberFunc = (number) => number;
```

2. 위에서 정의한 함수 시그니처를 반환하는 함수를 정의

```typescript
const add = (a: number): NumberToNumberFunc => {
  const _add: NumberToNumberFunc = (b: number): number => {}
  return _add;
}
```

3. 내부 함수의 몸통 구현

```typescript
const add = (a: number): NumberToNumberFunc => {
  const _add: NumberToNumberFunc = (b: number): number => a + b;
  return _add;
}
```

- 고차 함수는 반드시 클로저 기능이 필요하다.
- 내부 함수의 깊이에 따라 차수 고차 함수라고 부른다: 1차 고차 함수, 2차 고차 함수 ...

**만일 3차 고차 함수로 구현 되어있는 고차 함수에서 2차 고차 함수까지만 체이닝을 했다면 완전 적용 함수가 아닌 부분 적용 함수(partially applied function)라고 한다.

```typescript
const multiply = a => b => c => a * b * c;

multiply(1)        // 부분 적용: b, c가 적용되지 않은 함수 반환
multiply(1)(2)     // 부분 적용: c가 적용되지 않은 함수 반환
multiply(1)(2)(3)  // 완전 적용: 값(6) 반환
```

> 고차 함수 내에 있는 내부 함수의 몸통에 부수 효과(side effect)가 발생할 여지가 있는 코드는 삼가야 한다라는 규율이 있을까?

### 함수 구현 기법

함수형 프로그래밍에선, 함수를 구현하는 다양한 방법을 시도해야 하기 때문에 이번 절에서는 함수 구현 기법에 대해 알아보자.

##### 매개변수 기본값 지정하기

선택적 매개변수(optional parameter)에 undefined 로 넘어온 값 대신 기본 값을 설정하고 싶다면 default parameter 를 사용하면 된다

```typescript
const multiply = (a: number, b: number = 2): number => a * b;
```

다음 코드에서 3행의 makePerson 함수는 호출 때 매개변수 age 에 해당하는 값을 전달받지 못하면 기본으로 10이 설정된다.

```typescript
export type PErson = { name: string, age: number };

export const makePerson = (name: string, age: number = 10): PErson => {
  const person = { name: name, age: age };
  return person;
}

console.log(makePErson('Jack'));
console.log(makePerson('Jane', 33));
```

##### 객체 생성 시 값 부분을 생략할 수 있는 타입스크립트 구문

타입스크립트는 다음처럼 매개변수의 이름과 똑같은 이름의 속성을 가진 객체를 만들 수 있다.

이때 속성값 부분을 생략할 수 있는 단축구문을 제공한다.

```typescript
export type Person = { name: string, age: number };
const makePerson = (name: string, age: number): Person => {
  // const person = { name: name, age: age };
  const person = { name, age };
  return person;
}
```

##### 객체를 반환하는 화살표 함수 만들기

화살표 함수에서 객체를 반환하고자 할 때는 얼핏 다음과 같은 코드를 생각할 수 있다.

```typescript
export const makePerson = (name: string, age: number = 10): Person => { name, age };
```

그런데 이렇게 구현하면 컴파일러는 중괄호를 객체가 아닌 복합 실행문으로 해석한다. 따라서 컴파일러가 {}를 객체로 해석하게 하려면 다음처럼 객체를 소괄호로 감싸주어야 한다.

```typescript
export const makePerson = (name: string, age: number = 10): Person => ({ name, age });
```

다음은 이러한 내용을 반영해 앞에서 구현한 return-object.ts 를 조금 더 간결하게 구현한 예이다.

```typescript
export type Person = { name: string, age: number };

export const makePerson = (name: string, age: number = 10): Person => ({ name, age });

console.log(makePerson('Jack'));
console.log(makePerson('Jane', 33));
```

##### 매개변수에 비 구조화 할당문 사용하기

앞에서는 객체에 비 구조화 할당문을 적용하는 내용을 다루었다. 그런데 함수의 매개변수도 변수의 일종이므로 다음처럼 비구조화 할당문을 적용할 수 있다.

```typescript
export type Person  = { name: string, age: number };

const printPerson = ({ name, age }: Person): void => {
  console.log(`name: ${name}, age: ${age}`);
}

printPerson({ name: 'Jack', age: 10 });
```

##### 색인 키와 값으로 객체 만들기
```typescript
const makeObject = (key, value) => ({ [key]: value });
```

이 코드는 다음처럼 객체의 속성 이름을 변수로 만들려고 할 때 사용한다. 즉 [key] 부분이 'name' 이면 { name: value } 형태, firstName 이면 { firstName: value } 형태의 객체를 생성한다.

```typescript
const makeObject = (key, value) => ({[key]: value});
console.log(makeObject('name', 'Jack'));
console.log(makeObject('firstName', 'Jane'));
```

타입스크립트에서는 {[key: string]: string} 형태로 타입을 색인 가능 타입이라고 하며 다음과 같은 형태로 key 와 value 의 타입을 명시한다.

```typescript
type KeyType = { [key: string]: string };
```

다음 코드는 색인 가능 타입을 이용해 속성 이름만 다른 객체를 만드는 예이다.

```typescript
type KeyValueType = { [key: string]: string };

export const makeObject = (key: string, value: string): KeyValueType => ({ [key]: value });

console.log(makeObject('name', 'Jack'));
console.log(makeObject('firstName', 'Jane'));
```


### 클래스 메서드

##### function 함수와 this 키워드

타입스크립트의 function 키워드로 만든 함수는 Function 이란 클래스의 인스턴스, 즉 함수는 객체라고 했습니다. 객체지향 언어에서 인스턴스는 this 키워드를 사용할 수 있다.

타입스크립트에서는 function 키워드로 만든 함수에 this 키워드를 사용할 수 있다. 반면에 화살표 함수에는 this 키워드를 사용할 수 없다.

##### 메서드란?

타입스크립트에서 메서드는 function 으로 만든 함수 표현식을 담고 있는 속성이다. 다음 코드에서 클래스 A 는 value, method 라는 두 개의 속성을 가진다. value 에는 1이라는 값을 설정하지만 method 는 () => void 타입의 함수 표현식을 설정합니다.

여기서 method 구현 내용 중 특이한 부분은 4행의 this.value 부분이다.

```typescript
export class A {
  value: number = 1;
  method(): void {
    console.log(`value is ${this.value}`);
  }
}
```

##### 클래스 메서드 구문

앞에서 작성한 클래스 A 는 구현하기도 번거롭고 가독성도 떨어집니다. 타입스크립트 클래스 속성 중 함수 표현식을 담는 속성은 function 키워드를 생략할 수 있게 하는 단축 구문을 제공한다.

다음 코드에서 B 클래스는 타입스크립트답게 구현한 클래스 A 이다. A 와 B 는 똑같이 동작하지만 B 코드가 더 간결해 보인다.

```typescript
export class B {
  constructor(public value: number = 1) {}
  
  method(): void {
    console.log(`value is ${this.value}`);
  }
}
```

##### 정적 메서드

클래스의 속성은 static 수정자를 속성 앞에 붙여서 정적으로 만들 수 있었다.

메서드 또한 속성이므로 이름 앞에 static 수정자를 붙여 정적 메서드를 만들 수 있다.

다음 코드는 C 와 D 라는 두 클래스가 whoAreYou 라는 같은 이름의 정적 메서드를 구현하고 있다.

클래스 메서드는 13, 14 행에서 보듯 클래스 이름.정적 메서드 형태로 호출한다.

```typescript
export class C {
  static whoAreYou() {
    return 'I am C';
  }
}

export class D {
  static whoAreYou() {
    return 'I am D';
  }
}

console.log(C.whoAreYou());
console.log(D.whoAreYou());
```


##### 메서드 체인
제이 쿼리와 같은 라이브러리는 다음처럼 객체의 메서드를 이어서 계속 호출하는 방식의 코드를 작성할 수 있다. 이러한 방식을 메서드 체인이라고 한다.

```typescript
$("#p1").css("color", "red").slideUp(2000).slideDown(2000);
```

타입스크립트로 메서드 체인을 구현하려면 메서드가 항상 this 를 반환하게 한다.

```typescript
export class Calculator {
  constructor(public value: number = 0) {}
  add(value: number) {
    this.value += value;
    return this;
  }
  multiply(value: number) {
    this.value *= value;
    return this;
  }
}
```

이제 다음과 같은 테스트 코드에서 4행처럼 제이쿼리 스타일로 구현할 수 있다.

```typescript
import { Calculator } from './calculator';

const calc = new Calculator;
const result = calc.add(1).multiply(2).value;
console.log(result); // 2
```
