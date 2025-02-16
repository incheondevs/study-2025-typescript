# 이넘(Enum)

> 이 챕터를 보시기 전에 [TypeScript enum 을 사용하지 않는 게 좋은 이유를 Tree-shaking 관점에서 소개합니다.](https://engineering.linecorp.com/ko/blog/typescript-enum-tree-shaking) 를 참고하시는 편이 조금 더 학습에 도움이 됩니다.

# SECTION 1: 이넘이란?  

Enum 은 특정 값의 집합을 의미하는 데이터 타입. 상수 집합이라고도 함.

```typescript
function getDinnerPrice() {
  const RICE = 10000;
  const COKE = 2000;
  return RICE + COKE;
}
```

**Enum 은 여러개의 상수를 하나의 단위로 묶은 것과 같음. 비슷한 성격이나 같은 범주에 있는 상수를 하나로 묶어 더 큰 단위의 상수로 만드는 것을 의미함.**

```typescript
enum ShoesBrand {
  NIKE,
  ADIDAS,
  PUMA,
}

console.log(ShoesBrand.NIKE); // 0
console.log(ShoesBrand.ADIDAS); // 1
```


# SECTION 2: 숫자형 이넘

Enum 에 선언된 속성은 기본적으로 숫자 값을 가짐. enum 을 선언하면 첫번째 속성부터 0, 1, 2, 3, ... 순으로 할당됨.

```typescript
enum Direction {
  Up,
  Down,
  Left,
  Right,
}
```

그 이유는 자바스크립트로 컴파일되면 아래의 코드와 같아지기 때문임.

```javascript
"use strict";
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
```

> 리버스 매핑(Reverse Mapping) 규칙
> **타입스크립트의 Enum 은 리버스 매핑 규칙을 따름:** Enum 의 속성 값으로 속성 이름을 참조할 수 있음.

```typescript
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

console.log(Direction.Up); // 0
console.log(Direction[0]); // Up
```

### 만약 초깃값을 변경하고 싶다면

```typescript
enum Direction {
  Up = 10,
  Down,    // 11
  Left,    // 12
  Right,   // 13
}
```

> 1씩 증가하는데 2씩 증가하도록 변경할 순 없나?
> 
> TypeScript 는 enum 의 이전 값을 기준으로 다음 값을 계산할 때 항상 1을 더하기 때문에, 2씩 자동 증가하게 하려면 위와 같이 직접 값을 지정해야 합니다. 자동 증가 간격을 변경하는 기능은 제공되지 않는다.
> Go 언어는 이를 지원한다.

```text
const (
    Up = iota * 2    // 0
    Down             // 2
    Left             // 4
    Right            // 6
)
```


# SECTION 3: 문자형 이넘

문자형 이넘이란 이넘의 속성 값에 문자열을 연결한 이넘을 의미함. 

특징:

- 모든 속성 값을 문자열로 다 지정해주어야 하고
- 선언된 속성 순서대로 값이 증가하는 규칙이 없음

```typescript
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT'
}
```

> 실무에서는 숫자형보다는 문자형 이넘으로 관리하는 경우가 더 많음. 명시성 때문임. 관례로는 언더스코어도 사용 가능함

# SECTION 4: 알아 두면 좋은 이넘이 특징

### 혼합 이넘

이넘을 문자형과 숫자형을 혼합해서 사용할 수 있음.

```typescript
enum Direction {
  Yes = "YES",
  No = 0,
}
```

### 다양한 이넘 속성 값 정의 방식

이넘의 속성값은 고정 값 뿐 아니라 다양한 형태로도 값을 할당 가능

```typescript
enum Authorization {
    User,                          // 0
    Admin,                         // 1
    SuperAdmin = User + Admin,     // 1 = 1 + 0
    God = "abc".length             // 3
```

> 가능하긴 하지만 이넘을 활용하는 목적으로는 좋은 방법은 아님.

### const 이넘

const enum 은 컴파일 시점에 이넘을 제거하는 방식으로 사용함. 이넘을 사용하는 코드를 컴파일하면 이넘 속성 값이 모두 제거되어 최적화된 코드가 생성됨.

```typescript
const enum logLevel {
  Debug = 'Debug',
  Info = 'Info',
  Warn = 'Warn',
  Error = 'Error',
}

var appLevel = logLevel.Debug;
```

```typescript
enum logLevel {
  Debug = 'Debug',
  Warn = 'Warn',
  Info = 'Info',
  Error = 'Error',
}
```

> 두 방식을 직접 트랜스 파일링해서 변화되는 값 함께 살펴보기

# Appendix: Enum 의 Tree Shaking Problem

### Tree Shaking 이란?
```typescript
enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT"
}

// 컴파일된 JavaScript
var Direction = {
    "Up": "UP",
    "Down": "DOWN", 
    "Left": "LEFT",
    "Right": "RIGHT",
    "UP": "Up",
    "DOWN": "Down",
    "LEFT": "Left",
    "RIGHT": "Right"
};
```

이 코드는 다음과 같은 문제가 있습니다:

양방향 매핑으로 인해 불필요한 코드가 생성됨
번들 크기가 커짐
사용하지 않는 enum 값도 제거되지 않음

const enum의 해결책:

```typescript
const enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT"
}

const dir = Direction.Up;

// 컴파일된 JavaScript
const dir = "UP";  // enum 객체가 생성되지 않고 값이 직접 인라인됨
```

결론적으로 const enum은 트리쉐이킹을 위한 해결책이 맞습니다. const enum은:

런타임에 enum 객체를 생성하지 않음
컴파일 시점에 값을 직접 대체함
번들 크기를 효과적으로 줄일 수 있음

다만 const enum의 제한사항도 있습니다:

동적으로 enum 값에 접근할 수 없음 (예: Direction["Up"])
isolatedModules 옵션 사용 시 const enum 사용 불가
일부 도구나 환경에서 지원되지 않을 수 있음

