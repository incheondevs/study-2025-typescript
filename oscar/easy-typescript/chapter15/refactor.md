# 타입 호환

타입 호환이란 서로 다른 타입이 2개 있을 때 특정 타입이 다른 타입에 포함되는지를 의미한다.

```typescript
var a: string = "hi";
var b: number = 10;

b = a; // 오류 발생
```

이 코드에서 a 변수는 문자열 타입이고 b 변수는 숫자 타입이다. 각 타입에 맞는 초깃값인 hi 와 10 을 넣어주었는데, 이렇게 선언된 변수들을 이용하여 b = a 라는 코드를 작성하면 다음과 같은 에러가 발생한다.

```shell
var b: number;

> 'string' 형식은 'number' 형식에 할당할 수 없습니다.
```

만약 자바스크립트였다면 이런 에러는 발생하지 않을 것이다.

자바스크립트는 미리 변수 타입을 지정하지 않아도 실행하는 시점에 적절한 타입으로 변환해주기 때문이다. 이를 타입 캐스팅이라고 한다.

```typescript
var a: string = 'hi';
var b: 'hi' = 'hi';

a = b; // 오류 발생하지 않음
```

이렇게 해도 타입 에러는 발생하지 않는다. 이때 a 와 b 의 타입은 서로 호환된다고 볼 수 있다.

타입 에러가 발생하지 않는 이유는 string 타입이 'hi' 타입(리터럴 타입)보다 더 큰 타입이고 string 타입이 'hi'를 포함할 수 있기 때문이다. 만약 반대로 포함 관계를 뒤집으면 타입 에러가 발생할 것이다:

```typescript
var a: string = 'hi';
var b: 'hi' = 'hi';

b = a; // 오류 발생: 'string' 형식은 '"hi"' 형식에 할당할 수 없습니다.
```

# 다른 언어와 차이점

```typescript
interface 아이언맨 {
  이름: string;
}

class 어벤져스 {
  이름: string;
  
  constructor(이름: string) {
    this.이름 = 이름;
  }
}

let i: 아이언맨;
i = new 어벤져스("토니 스타크"); // 오류 발생하지 않음
```

이렇게 하면 아무 에러가 발생하지 않는다. 어벤져스가 인터페이스를 명시적으로 상속받지 않았음에도 어떻게 이게 가능할까?

그 이유는 구조적 타이핑 때문이다.

### 구조적 타이핑

구조적 타이핑이란 타입 유형보다는 타입 구조로 호환 여부를 판별하는 언어적 특성이다.

```typescript
type 캡틴아메리카 = {
  name: string
}

interface 앤트맨 {
  name: string;
}

var a: 캡틴아메리카 = { name: "캡틴 아메리카" }
var b: 앤트맨 = { name: "앤트맨" }

b = a; // 오류 발생하지 않음
```

이게 가능한 이유는 인터페이스의 타입보다는 해당 타입이 어떤 구조로 되어 있느냐를 '우선시' 보기 때문이다. 둘 다 name 을 가지고 있으니 구조적으로는 동일한 타입이라고 볼 수 있다.

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
  name: '형주'
}

var capt: Developer = {
  name: '캡틴'
}

capt = joo; // 오류 발생하지 않음
joo = capt; // 오류 발생하지 않음
```

이 코드는 문제가 없다. 동일한 속성을 가지고 있고 속성 자체의 타입이 같기 때문이다.

이제 속성을 추가해보자:

```typescript
type Person = {
  name: string;
}

interface Developer {
  name: string;
  skill: string;
}

var joo: Person = {
  name: '형주'
}

var capt: Developer = {
  name: '캡틴',
  skill: '방패던지기'
}

joo = capt; // 오류 발생하지 않음
capt = joo; // 오류 발생
```

`joo = capt`는 문제없이 동작한다. Developer 타입이 Person 타입의 모든 속성을 포함하고 있기 때문이다.

그러나 `capt = joo`에서는 에러가 발생한다:

```shell
> 'skill' 속성이 'Person' 형식에 없지만 'Developer' 형식에서 필수입니다.
```

이 에러를 해결하려면 Person 타입에 Developer 타입의 'skill' 속성을 추가하거나 Developer 타입의 skill 속성을 옵셔널로 바꿀 수 있다:

```typescript
type Person = {
  name: string;
}

interface Developer {
  name: string;
  skill?: string; // 옵셔널 속성으로 변경
}

var joo: Person = {
  name: "형주",
}

var capt: Developer = {
 name: '캡틴',
 skill: '방패던지기'
};

joo = capt; // 오류 발생하지 않음
capt = joo; // 이제 오류 발생하지 않음
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

다음과 같이 할당에는 문제가 없다:

```typescript
add = sum; // 오류 발생하지 않음
sum = add; // 오류 발생하지 않음
```

함수 또한 구조가 같으면 타입 에러가 발생하지 않는다는 것을 알 수 있다.

파라미터 수가 다른 함수의 경우:

```typescript
var getNumber = function(num: number) {
  return num;
}

var sum = function(x: number, y: number) {
  return x + y;
}
```

이렇게 할당하면 문제가 발생한다:

```typescript
getNumber = sum; // 오류 발생
```

```shell
> (x: number, y: number) => number 형식은 '(num: number) => number' 형식에 할당할 수 없다.
```

함수의 파라미터가 2개인 sum() 함수를 함수의 파라미터가 1개인 getNumber() 함수에 할당하면 에러가 발생하는데 그 이유는 다음과 같이 함수 역할이 달라져 버리기 때문이다.

```typescript
var getNumber = function(num: number) {
  return num;
}

var sum = function(x: number, y: number) {
  return x + y;
}

console.log(getNumber(10)); // 10
getNumber = sum; // 타입스크립트에서 오류 발생
console.log(getNumber(10)); // 자바스크립트라면 NaN 출력 (y가 undefined)
```

하지만 반대로 할당하면:

```typescript
sum = getNumber; // 오류 발생하지 않음
```

타입 에러가 발생하지 않는다. 이는 타입스크립트의 함수 타입 호환성 규칙 때문이다:

1. 파라미터가 더 적은 함수는 파라미터가 더 많은 함수에 할당할 수 있다
2. 리턴 타입은 호환 가능해야 한다

```typescript
var getNumber = function(num: number) {
  return num;
}

var sum = function(x: number, y: number) {
  return x + y;
}

sum = getNumber;
console.log(sum(10, 20)); // 10 (두 번째 파라미터 무시됨)
```

# 이넘 타입의 호환

이넘과 숫자는 서로 호환 가능하다:

```typescript
enum Language {
  C,         // 0
  Java,      // 1
  Typescript // 2
}

var a: number = 10;
a = Language.C; // 오류 발생하지 않음 (Language.C는 0)
```

하지만 서로 다른 이넘 타입끼리는 호환되지 않는다:

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

var langC: Language.C;
langC = Programming.C; // 오류 발생: 'Programming.C' 형식은 'Language.C' 형식에 할당할 수 없습니다.
```

이넘 타입은 구조적 타이핑(structural typing)이 아닌 명목적 타이핑(nominal typing)을 따른다. 비록 같은 구조를 가지더라도 이름이 다르면 다른 타입으로 간주된다.

# 제네릭 타입의 호환

제네릭의 타입 호환은 제네릭으로 받은 타입이 해당 타입 구조에서 사용되었는지에 따라 결정된다.

```typescript
interface Empty<T> {
  // T를 사용하지 않음
}

var empty1: Empty<string> = {};
var empty2: Empty<number> = {};

empty1 = empty2; // 오류 발생하지 않음
empty2 = empty1; // 오류 발생하지 않음
```

호환되지 않을 것 같지만 실제로는 호환된다. 그 이유는:

- 제네릭으로 받은 타입이 해당 타입 구조에서 사용되지 않는다면 타입 호환에 영향을 주지 않는다

이와는 반대로 제네릭으로 받은 타입을 타입 구조 안에서 사용한 경우:

```typescript
interface NotEmpty<T> {
  data: T;
}

var notEmpty1: NotEmpty<string> = { data: "hello" };
var notEmpty2: NotEmpty<number> = { data: 123 };

notEmpty1 = notEmpty2; // 오류 발생: 'number' 형식은 'string' 형식에 할당할 수 없습니다.
notEmpty2 = notEmpty1; // 오류 발생: 'string' 형식은 'number' 형식에 할당할 수 없습니다.
```

이 코드는 에러가 발생한다. 변수의 타입이 서로 호환되지 않기 때문이다. 각각 제네릭에 해당 타입을 넘기게 되면 인터페이스의 구조가 달라진다:

```typescript
// 실제로는 이렇게 변환됨
interface NotEmpty<string> {
  data: string;
}

interface NotEmpty<number> {
  data: number;
}
```

# 타입 호환성의 실제 응용

타입 호환성을 이해하면 코드를 더 유연하게 작성할 수 있다. 예를 들어:

```typescript
// 콜백 함수 정의
interface Callback {
  (error: Error | null, result: any): void;
}

// 더 구체적인 콜백 함수
function fetchData(callback: (error: Error | null, data: string[]) => void) {
  // 데이터 가져오기...
  callback(null, ["데이터1", "데이터2"]);
}

// 일반적인 콜백 사용
const handleResponse: Callback = (err, result) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(result);
};

// 구조적 타이핑 덕분에 호환 가능
fetchData(handleResponse); // 오류 발생하지 않음
```

이처럼 타입스크립트의 구조적 타이핑은 재사용성이 높은 유연한 코드를 작성하는 데 도움이 된다.