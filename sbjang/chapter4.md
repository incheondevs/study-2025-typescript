# 4. 함수와 메소드

## 4-1. 함수 선언문

function 키워드와 화살표(=>) 키워드로 만드는 함수

### 매개변수와 반환값의 타입 주석 생략

생략은 가능하지만 권장하지 않음

### void 타입

함수가 반환값을 가지지 않을 때 사용

```ts
function printMe(name: string, age: number): viod {
  console.log(`이름: ${ name }, 나이: ${ age }`);
}
```

### 함수 시그니처
(== 함수의 타입)

위의 printMe 함수의 경우 `(string, number) => void`

매개변수가 없는 경우 ()만 사용, ex> `() => void` 

### type 키워드로 타입 별칭 만들기

`type` 키워드 : 타입의 별칭을 만들수 있음

```ts
type 새로운타입명 = 기존타입

type strNumFunc = (string, number) => void;
let func1: strNumFunc = function(a: string, b: number): void {}
```

### undefined 관련 주의 사항

undefined는 모든 타입의 최하위 속한(모튼 타입이 가지고 있는..)값이기 때문에 파라미터 등에 사용해도 오류가 나지 않지만 작업을 수행하는 경우에 (런타임) 오류를 발생시킬 수 있으니 반드시 처리하는 것이 좋다.

```ts
interface INameable {
  name: string
}
function getName(o: INameable) {
  return o == undefined ? "이름없음" : o ;
}

let name = getName(undefined);
console.log(name);
```

### 선택적 매개변수

생략 가능한 매개변수 지정법, ?를 사용한다

```ts
function fn(arg1: string, arg?: number): void {
  console.log(`arg:${ arg }`);
}

fn("선택 매개변수 있음", 1111);
fn("선택 매개변수 없음");
```

함수 시그니처에도 ?를 사용

<br/>

## 4-2. 함수 표현식

### 함수는 객체다

(MEMO) JS는 prototype 기반의 객체 지향을 구현한 언어
함수형 언어와 객체지향 언어의 특징을 모두 가짐

JS에서 함수는 Function 클래스의 instance

```js
let addFunc = new Function("a", "b", "return a + b");
console.log( addFunc(1, 2) );
```

우리가 일반적으로 사용하는 function 키워드를 사용하는 방법은 `함수 표현식`이라고 함

### 일등 함수 (first-class function)

함수를 변수처럼 사용할수 있다는 의미.. (메모리상 ref)

함수형 프로그래밍 언어의 기본 요건 중 하나. JS의 함수는 일등 함수다.

```js
let func = function(a,b) {return a+b}
console.log(func)
```


<details>
<summary>함수형 프로그래밍의 특징 & 일급 함수와 일급 시민 from 코파일럿 </summary>

`Q. 함수형 프로그래밍의 특징`

> 함수형 프로그래밍(Functional Programming)은 프로그래밍 패러다임 중 하나로, 수학적 함수의 개념을 바탕으로 작성되는 것을 목표로 합니다. 몇 가지 주요 특징은 다음과 같습니다:
> 
> 순수 함수 (Pure Functions): 동일한 입력에 대해 항상 동일한 출력을 반환하며, 함수 외부 상태에 의존하지 않습니다. 부작용(Side Effects)이 없습니다.
> 
> 불변성 (Immutability): 데이터는 변경되지 않고, 상태를 변경하는 대신 새로운 데이터를 생성하여 작업을 수행합니다.
> 
> 고차 함수 (Higher-Order Functions): 함수를 인자로 받거나, 함수를 반환하는 함수입니다. 함수형 프로그래밍의 핵심 요소 중 하나입니다.
> 
> 일급 함수 (First-Class Functions): 함수가 일급 시민(First-Class Citizen)으로 간주되어 변수에 할당될 수 있고, 다른 함수의 인자로 전달되거나 반환될 수 있습니다.
> 
> 지연 평가 (Lazy Evaluation): 필요할 때까지 표현식의 평가를 미루는 방식으로, 성능 최적화에 유리합니다.
> 
> 함수 조합 (Function Composition): 작은 함수들을 조합하여 더 복잡한 함수를 만드는 방식입니다. 프로그램의 모듈화와 재사용성을 높입니다.
> 
> 함수형 프로그래밍은 코드의 가독성을 높이고, 디버깅을 용이하게 하며, 병렬 처리를 쉽게 할 수 있는 장점이 있습니다. 어떤 점이 가장 궁금한지 말해주시면 더 자세히 설명드릴게요. 😊
>

`Q.일급 함수와 일급 시민에 관해 쉽게 설명해줘`
> 일급 함수(First-Class Functions)는 프로그래밍 언어에서 함수가 다른 데이터 타입들처럼 다뤄질 수 있는 개념입니다. 이는 일급 시민(First-Class Citizen)으로서 함수가 다음과 같은 특징을 가질 때 발생합니다:
> 
> 변수에 할당 가능: 함수를 변수에 할당할 수 있습니다.
> 
> ```python
> def greet(name):
>     return f"Hello, {name}!"
>
> 
> hello = greet
> print(hello("World"))  # Output: Hello, World!
> ```
> 함수의 인자로 전달 가능: 함수를 다른 함수의 인자로 전달할 수 있습니다.
> 
> ```python
> def add(x, y):
>     return x + y
> 
> def operate(func, a, b):
>     return func(a, b)
> 
> print(operate(add, 5, 3))  # Output: 8
> ```
> 함수의 반환값으로 사용 가능: 함수를 다른 함수의 반환값으로 사용할 수 있습니다.
> 
> ```python
> def outer_function():
>     def inner_function():
>         return "I'm the inner function!"
>     return inner_function
> 
> inner = outer_function()
> print(inner())  # Output: I'm the inner function!
> ```
> 이처럼 함수가 일급 시민이 되면, 변수를 다루듯이 함수를 다룰 수 있어 코드의 유연성이 > 높아지고 재사용이 용이해집니다. 이해가 좀 더 쉽게 되었기를 바라요! 😊
</details>

### 표현식 (expression)

literal, 연산자, 변수, 함수호출 등이 복함적으로 구성된 코드 형태를 의미

### 함수 표현식

function 키워드로 변수를 선언하는 방법

```js
function [함수명](파라미터) {
  함수내용
}
```

### 계산법 (evaluation)

컴파일러가 표현식을 해석해서 값을 만드는 과정. 
- 조급한 계산법 (eager evaluation)
- 느긋한 계산법 (lazy evaluation)

### 함수 호출 연산자

함수를 호출시 사용하는 괄호와 파라미터 부분을 의미

```js
let funcExp = function(a, b) { return a + b }
let value = funcExp(1, 2);
```

컴파일러는 함수 호출문을 만나면 조급한 계산법을 적용함 (== 함수의 내용을 수행함)

### 익명함수 (anonymous function)

쉽게 말하면 이름없는 함수.... ??

### const 키워드와 함수 표현식

함수 표현식을 담는 변수는 대체로 바뀔일이 없으니 const로 선언하는 것이 좋다.

<br/>

## 4-3 화살표 함수와 표현식 문

ESNext와 TS는 화살표 함수를 제공

```ts
const 함수명 = (매개변수: 타입[, 반복]) : 반환타입 => 함수내용
```

내용이 한줄일 때는 {} 생략 가능, 한줄이 바로 반환값이면 return 생략 가능

### 실행문과 표현식문

- 실행문 지향 언어 (execution-oriented language) : c언어 계열
- 표현식 지향 언어 (expression-oriented language) : 스칼라

JS는 두가지 특징을 다 가지고 있어 동시에 지원 = 다중 패러다임 언어

### 복함 실행문

중괄호를 사용하여 여러줄의 실행문을 실행하는 방법

```js
if (조건식) {
  실행문1
  실행문2
}
```

### 함수 몸통(내용)과 복합 실행문

함수에서도 {}를 사용하여 여러 실행문 실행 가능.. <strike>(이딴걸 왜 설명하니?)</strike>

### return 키워드

함수 호출시 실행 결과의 값을 돌려주는 키워드

### 표현식 문 스타일의 화살표 함수 구현

...생략...

### 표현식(expression)과 표현식 문(expression statement)의 차이

...???...

### 실행문을 만드는 세미콜론

JS는 생략 가능

<br/>

## 4-4. 일등 함수 살펴보기

### 콜백 함수

일등 함수는 변수처럼 사용할 수 있으며, 함수 매개변수 등으로 사용할 수 있다

함수의 매개변수로 동작하는 함수를 `콜백함수`라고 지칭

```ts
const func = (callbakcFn: () => void): void => {
  console.log("func 함수 시작.");
  callbackFn();
  console.log("func 함수 끝.");
}
func( () => console.log("콜백함수") );
```

### 중첩 함수

함수 표현식 안에서 다른 함수 정의 가능

### 고차 함수와 클로저, 그리고 부분 함수

함수를 수행후 다른 함수를 반환하는 함수를 고차 함수 (high-order function) 함수형 프로그래밍의 핵심 기능임

```ts
type NumToNumFn = (number) => number ;
const add = (a: number): NumToNumFn => {
  const _add: NumToNumFn = (b: number) => {
    // 
  }
  return _add;
}
```

3차이상의 고차함수에서 전체가 아닌 파라미터로 사용된 부분을 떼어낸 함수는 부분 적용 함수(partially applied function)라 함

```ts
const multiply = a => b => c => a * b * c;
// 위에서 multiply(1) / multiply(1)(2) 처럼 적용하면 부분 적용 함수
```

<br/>

## 4-5. 함수 구현 기법

### 매개변수 기본값 지정하기

선택적 매개변수는 전달하지 않을시 해당 값은 undefined 가 됨

함수 표현식에서 기본값을 설정할수 있으며 이를 default parameter라 함

```ts
function(매개변수: 타입 = 매개변수 기본값) {
  // 함수 내용
}
```

### 객체 생성 시 값 부분을 생략할 수 있는 타입스크립트 구문

타입 스크립트에서는 매개별수의 이름과 동일한 키와 타입값을 가진객체를 쉼게 만들 수 있다.

```ts
const makePersion = (name: string, age: number = 10) => {
  const person = { name, age } // name과 age를 가진 객체
  return person;
}
```

### 객체를 반환하는 화살표 함수

화살표 함수에서 한줄로 객체를 반환하려면 {} 괄호를 다중 실행문 기호로 인식

()괄호를 사용해주면 객체를 한줄 반환 할 수 있음


### 매개변수에 비구조화 할당문 사용

```ts
type Person = {name: string, age: number }

const printPerson = ({name, age}: Person): void => {
  console.log(`이름: ${ name }, 나이: ${ age }`);
}
```

### 색인 키와 값으로 객체 만들기

ESNext에서는 객체의 키를 []기호를 사용하여 동적으로 생성 가능

TS에서는 동적인 키의 타입을 지정하는 것을 색인 가능한 타입(indexable type)이라 함

```ts
type KeyValueType = {
  [key: string]: string
}

const makeObject = (key: string, value: string): KeyValueType => {
  return { [key]: value };
}
```

<br/>

## 4-6 클래스 메소드

### function 함수와 this 키워드

function 키워드로 만든 함수는 Function 객체이고, this를 다시 바인딩한다.

객체 지향의 this와는 조금 다르다.

화살표 함수는 this를 다시 바인딩하지 않아 상위 this를 따라간다.

### 메소드란?

객체의 프로퍼티로 가지고 있는 함수

### 클래스 메소드의 구문

TS(JSNext)에서는 function 키워드를 생략하고 메소드를 구현 가능

```ts
class A {
  num: number = 1;
  method(): void { // ==  method: () => void = function(): void {
    // 메소드 내용
  }  
}
```

### 정적 메소드

클래스의 정적 메소드는 static 키워드를 사용할수 있음. `Math.random()`

### 메소드 체인

메소드의 return 값이 this여서 메소드를 연속으로 사용한 형태

```ts
class Calc {
  constructor(public val: number = 0) {}
  add(val: number) {
    this.val += val;
    return this;
  }
  multiply(val: number) {
    this.val *= val;
    return this;
  }
}

const calc = new Calc;
console.log( calc.add(1).multiply(2).add(3).multiply(4).val );
```

