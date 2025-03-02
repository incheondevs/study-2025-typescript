# 타입 호환

타입 호환이란 서로 다른 타입이 2개 있을 때 특정 타입이 다른 타입에 포함되는지를 의미한다.

```typescript
var a: string = "hi";
var b: number = 10;

b = a;
```

이 코드에서 a 변수는 문자열 타입이고 b 변수는 숫자 타입이다. 각 타입에 맞는 초깃값인 hi 와 10 을 넣어주었는데, 이렇게 선언된 변수들을 이용하여 b = a 라는 코드를 작성하면 다음과 같은 에러가 발생한다.

```shell
var b: number;

> 'string' 형식은 'number' 형식에 할당할 수 없습니다.
```

만약 자바스크립트였다면 이런 에러는 발생하지 않을 것이다.

자바스크립트는 미리 변수 타입을 지정하지 않아도 실행하는 시점에 적절한 타입으로 변환해주기 때문임.

이를 타입 캐스팅이라고 함.

```shell
var a: string = 'hi';
var b: 'hi' = 'hi';

a = b;
```

이렇게해도 타입 에러는 발생하지 않음. 이때 a 와 b 이 타입은 서로 호환된다고 볼 수 있음.

타입 에러가 발생하지 않는 이유는 string 타입이 hi 타입보다 더 큰 타입이고 string 타입이 hi 를 포함할 수 있기 때문임. 만약 반대로 포함 관계를 뒤집는다면 위 타입 에러가 났을 것임.

# 다른 언어와 차이점

```typescript
interface 아이언맨 {
  이름: string;
}

class 어벤져스 {
  name: string;
}

let i: 아이언맨;
i = new 어벤져스();
```

이렇게 하면 아무 에러가 발생하지 않음. 어벤져스가 인터페이스를 상속받지 않았음에도 어떻게 이게 가능할까?

그 이유는 구조적 타이핑 때문임.

### 구조적 타이핑

구조적 타이핑이란 건 타입 유형보다는 타입 구조로 호환 여부를 판별하는 언어적 특성임.

```typescript
type 캡틴아메리카 = {
  name: string
}

interface 앤트맨 {
  name: string;
}

var a: 캡틴아메리카 = { name: "캡틴 아메리카" }
var b: 앤트맨 = { name: "앤트맨" }

b = a;
```

이게 가능한 이유는 인터페이스의 타입보다는 해당 타입이 어떤 구조로 되어 있느냐를 '우선시' 보기 때문임. 둘다 name 을 가지고 있으니 구조적으론 동일한 타입이다라고 볼 수 있음.

# 객체 타입의 호환

이번에는 가장 흔한 유형인 객체 타입의 호환성을 알아보도록 하자.

앞서 구조적 타이핑 설명과 같이 객체 타입은 타입 유형에 관계 없이 동일한 이름의 속성을 가지고 있고 해당 속성의 타입이 같으면 호환이 가능하다.

```typescript
type Person = {
  name: string;
}

interface Developer {
  name: string;
}

var joo: Person = {
  name: string
}

var joo: Person = {
  name: '형주'
}

var capt: Developer = {
  name: '캡틴'
}

capt = joo;
joo = capt;
```

일단 무엇을 살펴봐도 이 코드는 문제가 없다. 동일한 속성을 가지고 있고 속성 자체의 타입이 같기 때문이다.

만약 Developer 의 스킬이 하나라도 더 추가된다면, 즉 skill 이라는 코드가 추가된다고 하더라도 같은 속성이 포함되어 있기 때문에 호환이 가능하다.

근데 다음 코드는 해결이 되지 않는다:

```typescript
joo = capt;
capt = joo;
```


에러 내용:

```typescript
var capt: Developer
```

```shell
> 'skill' 속성이 'Person' 형식에 없지만 'Developer' 형식에서 필수 입니다.
```

만약 이 에러를 해결하고 싶다면 Person 타입에 다음과 같이 Developer 타입의 'skill' 속성을 추가하거나 Developer 타입의 Skill 속성을 옵셔널로 바꾼다.

```typescript
type Person = {
  name: string;
  skill: string;
}

interface Developer {
  name: string;
  skill: string;
}

var joo: Person = {
  name: '형주',
  skill: '웹 개발'
}

var capt: Developer = {
  name: "캡틴",
  skill: "방패 던지기"
}

joo = capt;
capt = joo;
```

물론 Developer 타입의 skill 속성을 Optioanl 로 변경해서 타입 에러를 해결할 수 있다.

```typescript
type Person = {
  name: string;
}

interface Developer {
  name: string;
  skill?: string;
}

var joo: Person = {
  name: "형주",
}

var capt: Developer = {
 name: '캡틴',
 skill: '방패던지기'
};

joo = capt; 
capt = joo;
```

따라서 객체 타입은 인터페이스, 타입 별칭 등 타입 유형이 아니라 최소한의 타입 조건을 만족했는지에 따라 호환 여부가 판별된다.

# 함수 타입의 호환

함수 타입의 호환을 알아보겠다. 다음과 같이 함수가 2개 있다고 하자.

```typescript
var add = function(a: number, b: number) {
  return a + b;
}

var sum = function(x: number, y: number) {
  return x + y;
}
```

이 함수는 모두 함수 표현식으로 작성되었다. 함수를 선언하는 방식에는 함수 선언문과 함수 표현식이 있는데 여기에서는 함수의 타입 호환을 설명하려고 함수 표현식으로 정의했다.

다음과 같이 할당에 문제가 없음을 알수 있다.

```typescript
add = sum; 
sum = add;
```

함수 또한 구조가 같으면 타입 에러가 발생하지 않는다는 것을 알 수 있다.

```typescript
var getNumber = function(num: number) {
  return num;
}

var sum = function(x: number, y: number) {
  return x + y;
}
```

이렇게 할당하면 문제가 없을까?

```typescript
getNumber = sum;
```

```shell
> (x: number, y: number) => number 형식은 '(num: number) => number' 형식에 할당할 수 없다.
```

함수의 파라미터가 2개인 sum() 함수를 함수의 파라미터가 1개인 getNumber() 함수에 할당하면 에러가 발생하는데 그 이유는 다음과 같이 함수 역할이 달라져 버리기 때문이다.

```typescript
var getNumber = function(num) {
  return num;
}

var sum = function(x, y) {
  return x + y;
}

console.log(getNumber(10)); // 10
getNumber = sum; 
console.log(getNumber(10)); // NaN
```

함수의 역할이 다르니, NaN 이 나오는 것을 알 수 있다.

하지만 반대로 할당한다면?:

```typescript
sum = getNumber;
```

타입에러가 발생하지 않는다. 

```typescript
var getNumber = function(num) {
  return num;
}

var sum = function(x, y) {
  return x + y;
}

console.log(getNumber(10)); // 30
sum = getNumber;
console.log(getNumber(10)); // 10
```

# 이넘 타입의 호환

```typescript
var a: number = 10;
a = Language.C;
```

```typescript
enum Language {
  C,
  Java,
  Typescript,
}

enum Programming {
  C,
  Java,
  Typescript,
}

```

이 코드는 속성은 같고 이름만 다르다. 과연 할당이 가능할까?

```typescript
var langC: Language.C;
langC = Programming.C;
```

어? 이건 안되네? 할당 에러가 발생하네. 아! 이넘 타입은 이런 캐스팅(구조적 타이핑)은 허용되지 않는구나.

# 제네릭 타입의 호환

제네릭의 타입 호환은 제네릭으로 받은 타입이 해당 타입 구조에서 사용되었는지에 따라 결정된다.

```typescript
interface Empty<T> {
  
}

var empty1: Empty<string> = '';
var empty2: Empty<number> = 0;
```

호환되지 않을 것 같지만 호환된다.

```typescript
empty2 = empty1
empty1 = empty2
```

타입 에러가 발생하지 않음:

여기서 알 수 있는 사실:

- 제네릭으로 받은 타입이 해당 타입 구조에서 사용되지 않는다면 타입 호환에 영향 X

이와는 반대로 제네릭으로 받은 타입을 타입 구조 안에서 사용한 경우:

```typescript
interface NotEmpty<T> {
  data: T;
}

var notEmpty1: NotEmpty<string>;
var notEmpty2: NotEmpty<number>;
```

앞 코드에서 인터페이스 타입 정의만 바꾼 에제.

이 코드는 에러 발생함:

```typescript
notEmpty1 = notEmpty2
notEmpty2 = notEmpty1
```

변수의 타입이 서로 호환되지 않아서 발생하는 에러임. 각각 제네릭에 해당 타입을 넘기게 되면

인터페이스의 구조가 달라짐.


```typescript
interface NotEmpty<string> {
  data: string;
}

interface NotEmpty<number> {
  data: number;
}
```