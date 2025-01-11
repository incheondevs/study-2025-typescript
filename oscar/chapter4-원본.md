# 함수와 메서드

# Index

- 함수 선언문
- 함수 표현식
- 화살표 함수와 표현식 문
- 일등 함수 살펴보기
- 함수 구현 기법
- 클래스 메서드

### 함수 선언문

자바스크립트에서 함수를 만드는 방법은 두 가지가 있다.

- function 으로 만드는 함수
- 화살표 함수로 만드는 함수

```javascript
function add(a, b) {
  return a + b;
}
```

타입스크립트에서는 자바스크립트의 함수 선언문에 매개변수 타입과 반환 타입을 지정함으로 시작한다.

```typescript
function add(a: number, b: number): number {
  return a + b;
}
```

> Bad case
> 타입스크립트를 사용하면서 매개 변수와 반환값에 타입을 지정하지 않으면 함수의 구현 의도를 알기 어렵기 때문에 지정하는 것이 좋을 수 있다.

##### Void 타입

값을 반환하지 않는 함수는 반환 타입이 void 이다. void 타입은 함수 반환 타입으로만 사용할 수 있다.

```typescript
function printMe(name: string, age: number): void {
  console.log(name, age);
}
```

##### 함수 시그니처

변수에 타입이 있듯이 함수 또한 타입이 있는데, 함수의 타입을 함수 시그니처(function signature)라고 한다.

```typescript
let printMe: (string, number) => void = function (name: string, age: number): void {
  console.log(name, age);
}
```

##### type 키워드로 타입 별칭 만들기

타입스크립트는 type 이라는 키워드를 제공한다. type 키워드는 기존에 존재하는 타입을 단순히 이름만 바꿔서 사용할 수 있게 해준다.

이러한 기능을 타입 별칭이라고 한다.

```typescript
type stringNumberFunc = (string, number) => void;

let f: stringNumberFunc = function (a: string, b: number): void {
  console.log(a, b);
}
```

위와 같이 타입 별칭을 이용하면 매개변수의 개수나 반환 타입이 다른 함수를 선언하는 잘못을 미연에 방지 할 수 있다.

##### undefined 관련 주의사항

undefined 타입은 타입스크립트의 타입 계층도에서 모든 타입 중 최하위 타입이다. 다음은 undefined 타입을 고려하지 않은 예다.

```typescript
interface INameable {
  name: string;
}

function getName(o: INameable) {
  return o.name;
}

let n = getName(undefined); // 에러 발생

console.log(n);
```

위 예제는 getName 함수가 INameable 타입의 매개변수를 요구하지만, undefined 를 인자로 넣어서 호출해도 구문 오류가 발생하지 않는다.

그 이유는 undefined 가 최하위 타입이므로 INameable 을 상속하는 자식 타입으로 간주하게 된다.

따라서 코드를 실행해보면 o.name 부분이 undefined.name 이 되어 'cannot read property 'name' of undefined' 라는 에러가 발생한다.

이런 오류를 방지하려면 매개변수 값이 `undefined` 인지 판별하는 코드를 작성해야 한다. 다음 예제를 보자.

```typescript
interface INameable {
  name: string;
}

function getName(o: INameable) {
  return o != undefined ? o.name : 'unknown name';
}

let n = getName(undefined); // unknown name
console.log(n);             // jack
```

##### 선택적 매개 변수

함수의 매개변수에도 다음처럼 이름 뒤에 물음표를 붙일 수 있다. 이를 선택적 매개변수(Optional Parameter)라고 한다.

```typescript
function fn(a: number, b?: number, c: number = 0) {
  return a + (b ? b : 0) + c;
}

console.log(fn(1, 2, 3)); // 6
console.log(fn(1, 2));    // 3
console.log(fn(1));       // 1
```

> 학습자의 고민
>
> 자바에서는 이런 선택적 매개변수를 함수에 포함하기 위해 다음과 같은 방법을 사용한다.
>
> 1. 오버로딩
> 2. Optional 키워드
> 3. 빌더 패턴
>
> ###### 오버로딩
> ```java
> // 매개변수의 수에 따라 여러 메서드를 정의
> public class UserService {
>     public void processUser(String name) {
>         processUser(name, 0, "default@email.com");
>     }
> 
>     public void processUser(String name, int age) {
>         processUser(name, age, "default@email.com");
>     }
> 
>     public void processUser(String name, int age, String email) {
>         // 실제 처리 로직
>     }
> }
> ```
>
> ##### Optional 키워드
> ```java
> // Optional을 사용한 방식
> public class UserService {
>     public void processUser(String name, Optional<Integer> age) {
>         int userAge = age.orElse(0);
>         // 메서드 사용
>     }
> }
> 
> // 호출 시 매번 Optional 객체가 생성됨
> userService.processUser("John", Optional.of(20));        // Optional 객체 생성
> userService.processUser("Jane", Optional.empty());       // Optional 객체 생성
> userService.processUser("Tom", Optional.ofNullable(25)); // Optional 객체 생성
> ```
>
> ##### 빌더 패턴
> ```java
> public class User {
>     private final String name;        // 필수
>     private final Integer age;        // 선택
>     private final String email;       // 선택
> 
>     public static class Builder {
>         private final String name;    // 필수
>         private Integer age;          // 선택
>         private String email;         // 선택
> 
>         public Builder(String name) {  // 필수값은 생성자로
>             this.name = name;
>         }
> 
>         public Builder age(Integer age) {  // 선택값은 메서드로
>             this.age = age;
>             return this;
>         }
> 
>         public Builder email(String email) {
>             this.email = email;
>             return this;
>         }
> 
>         public User build() {
>             return new User(this);
>         }
>     }
> 
>     private User(Builder builder) {
>         name = builder.name;
>         age = builder.age;
>         email = builder.email;
>     }
> }
> 
> // 사용 예
> User user = new User.Builder("John")  // 필수값
>     .age(30)                         // 선택값
>     .email("john@email.com")         // 선택값
>     .build();
> ```

> 타입스크립트 버전

```typescript
interface User {
   name: string;
   age?: number;
   email?: string;
}

function createUser(name: string, age?: number, email?: string): User {
   return { name, ...(age && { age }), ...(email && { email }) };
}

 // 사용
const user1 = createUser("John", 30, "john@email.com");
const user2 = createUser("John");
const user3 = createUser("John", undefined, "john@email.com");
```

### 함수 표현식

---

자바스크립트는 함수형 언어 스킴과 프로토타입 기반 객체지향 언어 셀프를 모델로 만들어졌다. 따라서 자바스크립트는 객체지향 언어와 함수형 언어의 특징이 모두 존재한다.

타입스크립트는 당연히 자바스크립트의 이러한 특징을 모두 포함한다.

##### 일등 함수

프로그래밍 언어가 일등 함수 기능을 제공하면 함수형 프로그래밍 언어라고 한다. 자바스크립트와 타입스크립트는 일등 함수 기능이 있으므로 함수형 프로그래밍 언어라고 할 수 있다.

일등 함수란 함수와 변수를 구분하지 않는다는 의미를 말한다.

> 일등 시민이란?
>
> 프로그래밍 언어에서 일등 시민이란 다른 객체들에 일반적으로 적용 가능한 연산을 모두 지원하는 객체를 가리킨다.
> 여기서 말하는 일등 시민은 고대 로마시대의 시민을 떠올려 보면 의미를 좀 더 쉽게 이해할 수 있다.
> 로마 시민과 다른 숙주 국가의 시민은 모두 똑같은 대우를 받았다고 한다. 변수가 로마 시민이면 함수 또한 로마 시민이므로 변수와 함수를 차별하지 않는다는 의미로 해석할 수 있다.

예를 들면 다음 코드에서 f 는 let 키워드가 앞에 있으므로 변수이다. f 는 변수이므로 값을 저장할 수 있다.

이때, 변수 f 에는 a + b 형태의 함수 표현식을 저장했다.

```typescript
let f = function (a, b) {
  return a + b;
}
```

symbol f 가 사실상 변수인지 함수인지 구분할 수 없다. 이것이 변수와 함수를 차별하지 않는다는 의미를 말한다.

##### 표현식

프로그래밍 언어에서 표현식이라는 용어는 리터럴, 연산자, 변수, 함수 호출 등이 복합적으로 구성된 코드 형태를 의미한다.

예를 들어 1+2 는 1과 2라는 리터럴과 덧셈 연산자 + 로 구성된 표현식이다.

표현식은 항상 컴파일러에 의해 계산법이 적용되어 어떤 값이 된다.

이를 테면 표현식 1 + 2 는 컴파일러에 의해 3이라는 값이 된다.

##### 함수 표현식

앞에서 변수 f 에는 function(a, b) { return a + b } 를 마치 값처럼 대입하는데, 이 function(a, b) { return a + b; } 부분을 함수 표현식이라고 한다.

##### 계산법

컴파일러는 표현식을 만나면 계산법을 적용해 어떤 값을 만듭니다. 계산법에는 조급한 계산법과 느긋한(또는 lazy) 계산법 두가지가 있다.

- Eager evaluation
- Lazy evaluation

책에서 설명은, 1+2 라는 표현식은 Eager evaluation 방식이고, function(a, b) { return a + b; } 라는 표현식은 Lazy evaluation 방식이라고 한다.

##### 함수 호출 연산자

어떤 변수가 함수 표현식을 담고 있다면, 변수 이름 뒤에 함수 호출 연산자를 붙여 호출 할 수 있다. 함수 호출이란 함수 표현식의 몸통 부분을 실행한다는 뜻이다.

만약 함수가 매개변수를 요구한다면 함수 호출 연산자 () 안에 필요한 매개변수를 명시할 수 있다.

다음 코드에서 01행의 functionExpression 변수는 function(a, b) { return a + b; } 를 담고 있다. 라는 함수 표현식을 담고 있다.

functionExpression 변수는 함수 표현식을 담고 있으므로 변수 이름 뒤에 함수 호출 연산자 (1, 2)를 붙여 functionExpression(1, 2) 라는 함수 호출문을 만들 수 있다.

```typescript
let functionExpression = function (a, b) {
  return a + b;
}

let value = functionExpression(1, 2);
console.log(value); // 3
```

컴파일러는 함수 호출문을 만나면 지금까지 미뤘던 함수 표현식에 조급한 계산법을 적용해 함수 표현식을 값으로 바꾼다.

즉 functionExpression(1, 2) 형태로 함수가 호출되면, 컴파일러는 functionExpression 변수에 저장된 함수 표현식을 끄집어 낸 뒤 조급한 계산법을 적용한다.

여기서 중요한 포인트는, 함수 표현식에 조급한 계산법을 적용한다는 말의 의미는, 함수 표현식의 몸통 부분을 '실행' 한다는 의미이다.

앞 코드에서 함수 몸통은 return a + b 인데, 매개변수 a 와 b 의 값이 1과 2로 확정이 되면, 몸통은 Return 1 + 2 가 된다(최종평가)

여기서 다시 한번 조급한 계산법이 적용되어 return 3 이 된다. 그리고 최종적으로 functionExpression(1, 2)라는 표현식은 3이라는 값이 된다.

##### 익명 함수

함수 표현식은 사실 대부분 언어에서 언급되는 익명 함수의 다른 표현이다.

자바스크립트에서는 가끔 다음과 같은 형태로 작성된 코드를 만난다.

앞에서 살펴본 함수 표현식 개념이 없는 상태에서 단순히 익명함수를 이름이 없는 함수로만 이해하면 이런 형태의 코드가 어떻게 동작하는지 그 원리를 쉽게 가늠하기 어렵다.

```javascript
let value = function (a, b) {
  return a + b;
}(1, 2);
```

앞 코드를 이해하려면 먼저 연산자 우선순위를 고려해 코드를 분해해야 한다. 일반적으로 연산자들이 우선 순위가 다르면 (1 + 2) * 5 처럼 소괄호를 사용해 우선순위를 변경한다. 마찬가지로 함수 호출 연산자는 연산자의 우선순위가 매우 높으므로 함수 표현식 부분을 소괄호로 묶어서 컴파일러가 정상적으로 함수 표현식의 시작과 끝 부분을 알 수 있게 해야 한다.
다음 코드는 앞의 한 줄 짜리 코드를 쉽게 분석하고자 세 줄로 나누어 보았다.

```typescript
let value =
  
(function (a, b) {
return a + b;
})
  
(1, 2);
```

이 함수를 까보면, 컴파일러는 2행의 익명 함수 부분에 게으른 계산법을 적용해 그 상태로 놔두고, 곧바로 3행의 함수 호출 연산자를 만나므로 2행의 함수 몸통에 조급한 계산법을 적용해 최종적으로 3이라는 값을 만들어낸다.

그 다음 1행의 value 변수에 이 값을 대입한다.


- [Self-Executing Anonymous Function](https://developer.mozilla.org/ko/docs/Glossary/IIFE)

##### const 키워드와 함수 표현식

함수 표현식을 담는 변수는 let 보다는 const 키워드로 선언하는 것이 바람직하다. let 키워드는 변숫값이 변할 수 있으므로 다음처럼 코드를 작서하면 함수 f 는 언젠가 다른 내용으로 바뀔 수 있다.

- 함수의 재할당을 피하기 위해
-

```typescript
let f = () => {}
```

반면에 함수 표현식을 담는 변수를 const 키워드로 선언하면, 함수 내용이 이후에 절대로 바뀔 수 없다. 따라서 앞으로는 함수 표현식을 담는 변수는 const 로 선언하겠다.

> 학습자의 고민
>
> const 선언은 재할당을 방지해주는 키워드로 사용하는 것이지, 함수 내부의 의도치 않은 변경을 방지해주는 것은 아니다.
> 다시 말하면, 선언의 재할당을 방지해주는 것이지, 선언된 값이 변경되지 않는 것을 보장해주는 것은 아니다(불변성).

> 학습자의 고민
> 그래서 어떻게 하라는건데요
> ㅇㄴㅁㅇ

### 화살표 함수와 표현식 문

ESNext 자바스크립트와 타입스크립트는 function 키워드가 아닌 => 기호로 만드는 화살표 함수도 제공한다.

```typescript
let add = (a: number, b: number): number => {
  return a + b;
}

const add1 = (a, b) => a + b;
```

> 정확히 말하면 ESNext 로 범위를 크게 잡기 보다는, ES6 문법에서 만들어졌다.

그런데 흥미롭게도 중괄호 사용 여부에 따라 타입스크립트 문법이 동작하는 방식이 실행문 방식과 표현문 방식으로 달라진다.

##### 실행문과 표현식 문

꽤 오래전부터 프로그래밍 언어는 실행문 지향 언어와 표현식 지향 언어로 구분되어옴

- 실행문 지향 언어: C
- 표현식 지향 언어: scala

자바스크립트는 실행문과 표현식을 모두 지원한다. 실행문은 어떤 동작을 수행하고, 표현식은 어떤 값을 만들어낸다.
보통 이런 언어를 다중 프로그래밍 언어라고 함.

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

##### 복합 실행문

프로그래밍 언어에서 if 와 같은 구문은 다음 조건을 만족하면 단순히 한 줄의 실행문을 실행하는 형태로 설계한다.

이런 설계가 가능한 이유는 복합 실행문이라는 또 다른 형태를 함꼐 제공하기 때문이다.대부분 언어에서 복합 실행문은 중괄호 {} 를 사용해 다음처럼 이용한다

```typescript
if (a > b) {
  a = 1
  b = 2
}
```

복합 실행문은 컴파일러로 하여금 여러 실행문을 한 개처럼 인시하게 한다. 따라서 컴파일러는 앞의 형태로 작성된 if 문은 여전히 한줄의 실행문으로 인식한다.

##### 함수 몸통과 복합 실행문

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
> 복합 실행문은 변수의 유효 범위도 지역범위로 제한한다. 따라서 다음처럼 두 함수의 몸통에 똑같은 이름의 변수가 있더라도 각 함수의 몸통에서만 유효하므로 서로 간섭하지 않는다.

```typescript
function f() { let x = 1 }
function g() { let x = 2 }
```

##### 리턴 키워드

그런데 앞서 설명한대로 실행문은 CPU 에서 실행된 결과를 알려주지 않는다. 예를 들어 함수 몸통을 복합 실행문으로 구현한다음 함수는 true 나 false 를 반환하지 않는다.

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

그런데 return 키워드는 반드시 함수 몸통에서만 사용할 수 있다는 제약이 있다. 이러한 제약은 문법을 잘못 이해해 다음과 같은 코드를 만드는 것을 방지하려는 의도이다.

```typescript
if(return x > 0) x = 1
```

##### 표현식 문 스타일의 화살표 함수 구현

앞서 function 스타일 함수 isGreater 를 화살표 함수로 구현하면 다음과 같다

```typescript
const isGreater = (a: number, b: number): boolean => {
  return a > b;
}
```

다만 단순한 내용을 이렇게 구현하는 것은 좀 번거로워서 ESNext 와 타입스크립트는 다음처럼 구현할 수 있게 했다.

```typescript
const isGreater = (a: number, b: number): boolean => a > b;
```

> 학습자의 고민
> 함수의 반환값이 표현식으로 바로 사용되면 중괄호를 생략할 수 있다로 표현하는 것이 학습자로 하여금 학습 부담을 줄일 수 있겠다.
> 함수 몸통이 한 줄 이상이면 중괄호를 사용해야 한다고 설명해도 괜찮을 듯.

##### 표현식과 표현식 문의 차이

지금까지 이 책은 어떤 때는 표현식이란 용여를 어떤 떄는 표현식 문이란 용어를 사용했다. 둘의 차이점을 알아보자

다음 코드에서 2행에 있는 a > b 코드는 C 언어에서 표현식이라고 했기 떄문에 그 이후에 만들어진 프로그래밍 언어들도 C 언어와 같은 의미로 표현식이라고 생각한다.

따라서 C 언어 관점에서 실행문의 일부일 뿐 그 자체가 실행문인 것은 아니다. 반면에 표현식 지향 언어 관점에서 3행의 a > b 코드는 그 자체가 실행문이다.

```typescript
let a = 1, b = 2;
if(a > b) console.log('a is greater than b');
const isGreater = (a: number, b: number): boolean => a > b;
```

결론적으로 표현식이란 용어는 두 가지 형태로 사용되는데, 이 둘을 구분하고자 표현식과 표현식 문으로 구분한 것이다.

##### 실행문을 만드는 세미콜론

C 언어는 모든 문장이 반드시 세미콜론 ; 으로 끝나야 한다. C 언어 구문을 참조해 만든 ES5 자바스크립트 또한 모든 문장 끝에 세미콜론이 이썽야 한다.
하지만 ESNext 자바스크립트와 타입스크립트에서는 세미콜론을 생략할 수 있다. 다만 타입스크립트에서는 관습적으로 표현식문에는 세미콜론을 붙이지 않는다.

### 일등 함수 살펴보기

##### 콜백 함수

일등 함수는 프로그래밍 언어가 제공하는 기능이다. 일등 함수 기능을 제공하는 언어에서 함수는 함수 표현식이라는 일종의 값이다. 따라서 변수에 담을 수 있다. 이 말은 함수 표현식을 매개변수로 받을 수 있다는 것을 의미한다. 이처럼 매개변수 형태로 동작하는 함수를 콜백함수라고 한다.
다음 코드에서 함수 f 는 Callback 이라는 매개변수가 있늗네, 함수 몸통에서 함수로서 호출한다.

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

실행 결과를 보면 init 함수가 자신의 몸통과 외부에서 젇날 받은 함수를 호출해 각각의 출력문이 실행된 것을 알 수 있다.

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

##### 고차 함수와 클로저, 그리고 부분 함수

고차 함수는 또 다른 함수를 반환하는 함수를 말한다. 함수형 언어에서 함수는 단순히 함수 표현식이라는 값이므로 다른 함수를 반환할 수 있다.
고차 함수 기능이 없다면 함수형 프로그래밍이 불가능할 정도로 고차함수는 매우 중요한 기능이다.

일단 고차 함수의 일반적인 형태는 다음과 같다:

```typescript
const add1 = (a: number, b: number): number => a + b;
const add2 = (a: number): (number) => number => (b: number): number => a + b;
```

add1 은 일반적인 함수로 선언되었지만 add2 는 고차 함수로 선언된 것이다. 다음 코드에서 add 함수는 add2 함수를 이름만 바꾼것이고,
해당 코드가 흥미롭다고 한다.

```typescript
const add = (a: number): (number) => number => (b: number): number => a + b;
const result = add(1)(2);
console.log(result); // 3
```

이런 구문이 어떻게 가능한지 add 함수를 조금 더 이해하기 쉬운 형태로 다시 구현하겠다.

다음 코드는 number 타입의 매개변수를 받아 number 타입의 값을 반환하는 함수 시그니처를 NumberToNumberFunc 타입으로 정의한다.

```typescript
type NumberToNumberFunc = (number) => number;
```

이제 NumberToNumberFunc 타입의 함수를 반환하는 add 와 같은 함수를 만들 수 있다.

```typescript
const add = (a: number): NumberToNumberFunc => {
  const _add: NumberToNumberFunc = (b: number): number => a + b;
  return _add;
}
```

add 함수가 반환하는 _add 는 NumberToNumberFunc 타입이다. 고차 함수는 이처럼 중첩 함수를 반환할 수 있다.

이제 최종적으로 _add 의 몸통을 구현하면 다음처럼 add 라는 이름의 고차 함수가 완성이 된다.

```typescript
export type NumberToNumberFunc = (number) => number;
export const add = (a: number): NumberToNumberFunc => {
  const _add: NumberToNumberFunc = (b: number): number => {
    return a + b; // 클로저라고 함
  }
  return _add;
}
```

a 는 add 함수의 매개변수이고 b 는 _add 함수의 매개변수라는 사실이다. 즉 _add 함수의 관점에서만 보면 a 는 외부에 선언된 변수이다.

함수형 프로그래밍 언어에서는 4행과 같은 형태를 클로저라고 한다.

고차 함수는 이 클로저 기능이 반드시 필요하다.

이제 지금까지 구현한 고차 함수 add 를 사용하는 코드를 살펴보겠다. 앞 서 구현한 add 는 NumberToNumberFunc 타입의 값을 반환하는 함수이므로 다음과 같은 코드를 작성할 수 있다.

```typescript
import { add } from './add';
let fn: NumberToNumberFunc = add(1);
```

그런데 변수 fn 에 담긴 값은 NumberToNumberFunc 타입의 함수 표현식이므로 다음 5행 처럼 fn 뒤에 함수 호출 연산자를 붙일 수 있다.

```typescript
import { NumberToNumberFunc } from './add';
let fn: NumberToNumberFunc = add(1);
let result = fn(2);
console.log(result); // 3
console.log(add(1)(2)) // 3
```

코드를 주의 깊게 관찰하면 변수 fn 은 단순히 add(1)을 저장하는 임시 변수의 역할만 한다. 따라서 fn 과 같은 임시 변수를 사용하지 않는다면 7행과 같은 구문이 된다.

2차 고차 함수인 add 는 add(1)(2)처럼 함수 호출 연산자를 두 개 사용해야만 함수가 아닌 값을 얻을 수 있다.

만일, add 가 다음 multiply 처럼 3차 고차 함수로 구현되었다면, multiply(1)(2)(3) 처럼 함수 호출 연산자를 세 번 사용해야만 함수가 아닌 값을 얻을 수 있다.

```typescript
const multiply = a => b => c => a * b * c;
```

그리고 3차 고차 함수인 multiply 에 함수 호출 연산자를 하나나 두 개만 붙여서 multiply(1) 이나 multiply(1)(2) 처럼 사용하면 아직 값이 아닌 함수이다.

이것을 부분 애플리케이션 혹은 부분 적용 함수라고 한다.

### 함수 구현 기법

##### 매개변수 기본값 지정하기

선택적 매개변수(optional parameter)에 undefined 로 넘어온 값 대신 기본 값을 설정하고 싶다면 default parameter 를 사용하면 된다

```typescript
const multiply = (a: number, b: number = 2): number => a * b;
```

다음 코드에서 3행의 makePerson 함수는 호출 때 매개변수 age 에 해당하는 값을 전달받지 못하면 기본으로 10이 설정된다.

```typescript
export type Person = { name: string, age: number };

export const makePerson = (name: string, age: number = 10): Person => {
  const person = { name: name, age: age };
  return person;
}

console.log(makePErson('Jack'));
console.log(makePerson('Jane', 33));
```

##### 객체 생성 시 값 부분을 생략할 수 있는 타입스크립트 구문

타입스크립트는 다음처럼 매개변수의 이름과 똑같은 이름의 속성을 가진 객체를 만들 수 있다. 이때 속성값 부분을 생략할 수 있는 단축구문을 제공한다.

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

##### 매개변수에 비구조화 할당문 사용하기

앞에서는 객체에 비 구조화 할당문을 적용하는 내용을 다루었다. 그런데 함수의 매개변수도 변수의 일종이므로 다음처럼 비구조화 할당문을 적용할 수 있다.

```typescript
export type Person  = { name: string, age: number };

const printPerson = ({ name, age }: Person): void => {
  console.log(`name: ${name}, age: ${age}`);
}

printPerson({ name: 'Jack', age: 10 });
```

##### 색인 키와 값으로 객체 만들기

ESNext 자바스크립트에서는 다음과 같은 코드를 작성할 수 있다.

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

타입스크립트에서 메서드는 function 으로 만든 함수 표현식을 담고 있는 속성이다.

다음 코드에서 클래스 A 는 value, method 라는 두 개의 속성을 가진다. value 에는 1이라는 값을 설정하지만 method 는 () => void 타입의 함수 표현식을 설정합니다.

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

