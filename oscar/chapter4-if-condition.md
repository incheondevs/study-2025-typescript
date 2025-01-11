### Expression & Statement

본 저서에서 저자는 자바스크립트의 if 조건문을 표현식문(expression statement) 라는 용어로 설명하고 있습니다.

저는 이 부분에 몇 가지 혼동이 있어서 별도로 파일을 만들어 정리하였습니다.

우선 표현식(expression)과 문(statement)에 대해 간단히 정리하겠습니다.

### 표현식(expression)과 실행문(statement)

##### 실행문 지향 언어 'C'

우선 저자가 표현하신 실행문 지향 언어인 'C' 언어의 실행문과 표현식을 기반으로 예를 들어보겠습니다.

```clang
5 * (fahr-32) / 9
```

위의 코드는 C 언어에서는 표현식입니다. 표현식은 값으로 평가될 수 있는 코드입니다. 위의 코드는 화씨를 섭씨로 변환하는 코드입니다.

따라서 **변수에 할당이 가능합니다.**

```clang
int a = 5 * (fahr-32) / 9;
```

하지만 다음과 같은 구문은 어떨까요?

```clang
for (; begin != end; ++bigin) {
    if (*begin == target) {
        break;
    }
}
```

위의 코드는 실행문입니다. 실행문은 특정한 동작을 수행하는 코드입니다. 위의 코드는 반복문을 통해 target 값을 찾는 코드입니다.

위 예시와 마찬가지로 변수에 할당 가능할까요?

```clang
int a = for (; begin != end; ++bigin) {
    if (*begin == target) {
        break;
    }
}
```

이런 코드는 C 언어에서는 허용이 되지 않습니다. for 문 자체가 특정 값을 산출하지 **않기** 때문입니다.

따라서 같은 맥락에서 C 에서는 `if` 와 `switch` 문 또한 실행문 입니다.

그 이유는

- 값을 산출하지 않고
- 표현식 중간에 쓸 수 없기 때문입니다.

```clang
int a = if (b > 0) { 1; } else { 0; }

// 또는

int a = switch (b) {
    case 1: 1;
    case 2: 2;
    default: 0;
}
```

위 코드 블럭은 C 언어에서는 허용되지 않습니다. 그 이유 역시 `if` 와 `switch` 문은 실행문이기 때문에 값을 산출하지 않습니다.

따라서 변수 a 에는 값을 할당할 수 없습니다.

##### 표현식 지향 언어 `Rust`

러스트는 모든 구문이 전부 표현식 입니다. 이는 LISP 에서 유래되었다고 하는데요.

예제를 살펴보겠습니다.

```rust
 let a = if b > 0 { 1 } else { 0 };
 
// 또는

let a = match b {
    1 => 1,
    2 => 2,
    _ => 0,
};
```

위 `match` 키워드는 `switch` 문과 유사한 역할을 합니다. 하지만 `match` 는 표현식이기 때문에 값을 산출합니다.

따라서 변수 a 에 값을 할당할 수 있습니다.

루프는 어떨까요?

```rust
let a = loop {
    if b > 0 {
        break 1;
    } else {
        break 0;
    }
}

// 하지만 애네는 실행문으로만 사용할 수 있음.
let a = while b > 0 {
    break 1;
}

// 하지만 애네는 실행문으로만 사용할 수 있음.
let a = for i in 0..10 {
    if i == b {
        break 1;
    }
}
```

위 코드는 무한 루프를 돌면서 b 가 0보다 크면 1을 반환하고, 그렇지 않으면 0을 반환합니다.

이 또한 표현식이기 때문에 변수 a 에 값을 할당할 수 있습니다.

### 자바스크립트의 실행문과 표현식

자바스크립트는 C 언어와 유사한 CLike 언어입니다. 따라서 C 언어와 유사한 문법을 가지고 있습니다.

자바스크립트의 if, switch, for 문 등을 예로, 이것이 표현식인지 실행문인지 구분해보겠습니다.

```javascript
let a = 5 * (fahr-32) / 9;
```

위 코드는 C 언어에서 표현식이었습니다. 자바스크립트에서도 표현식입니다.

따라서 변수 a 에 값을 할당할 수 있습니다.

```javascript
let a = if (b > 0) { return 1; } else { return 0; } // 번외: 리턴문은 함수 몸통 내에 존재해야 한다.
let a = if (b > 0) { 1; } else { 0; }
```

위 코드는 C 언어에서는 실행문이었습니다. 하지만 자바스크립트에서도 실행문 입니다. 변수에 값으로써 산출한 후 할당할 수 없기 때문 입니다.

따라서 위 코드는 에러가 발생합니다.

```javascript
let a = switch (b) {
    case 1: return 1;
    case 2: return 2;
    default: return 0;
}
```

위 코드도 마찬가지로 실행문이기 때문에 변수에 값을 할당할 수 없습니다.

따라서 위 코드는 에러가 발생합니다.

```javascript
let a = for (let i = 0; i < 10; i++) {
    if (i === b) {
        return 1;
    }
}
```

위 코드도 마찬가지로 실행문이기 때문에 변수에 값을 할당할 수 없습니다.

따라서 위 코드는 에러가 발생합니다.

### 결론

위 예시처럼 자바스크립트의 실행문과 표현식에 대한 설명은 명확합니다.

저자께서 표현하신 if 조건문 중괄호 안에 있는 식이 표현식이어서 **실행문(값을 반환하지 않아야하지만) 이지만 값을 반환하는** 것을 **표현식문** 이라고 표현하신 것 같습니다.

하지만 이와 같은 **실행문** 은 그저 **실행문** 이라고 표현하는 것이 올바르며,

그 구문 자체가 값을 산출하지 않는다는 점은 동일하므로 **표현식문** 이라고 표현하신 것에 대해서는 오해의 소지가 있을 수 있습니다.

if 문은 표현식을 포함하는 것이지 표현식이 문장이 된 것은 아니기 때문입니다.

```javascript
// 표현식문
myFunction();     // 표현식이 그 자체로 문장이 됨

// 제어문(if)
if (condition) {  // 표현식을 조건으로 사용하는 별도의 문법 구조
    // ...
}
```

```text
const isGreater = (a: number, b: number): boolean => a > b 는 표현식 지향 언어 관점에서 a > b 코드는 그 자체가 실행문이다.
```

위 문장에 대해 표현식 지향 언어 관점에서 a > b 코드는 그 자체가 실행문이라고 설명하고 있습니다.

하지만 자바스크립트는 명확히 표현식이라고 적혀 있으며 엄밀하게 '관계 표현식(RelationalExpression)' 이라고 정의되어 있습니다.

비교 연산자에 대한 명세

```text
RelationalExpression:
    ShiftExpression
    RelationalExpression < ShiftExpression
    RelationalExpression > ShiftExpression
    RelationalExpression <= ShiftExpression
    RelationalExpression >= ShiftExpression
    RelationalExpression instanceof ShiftExpression
    RelationalExpression in ShiftExpression
    [+In] RelationalExpression in ShiftExpression
```

화살표 함수의 표현식 본문(Expression Body)에 대한 명세

```text
ArrowFunction[In, Yield, Await]:
    ArrowParameters[?Yield, ?Await] => ConciseBody[?In]

ConciseBody[In]:
    [lookahead ≠ {] AssignmentExpression[?In, ~Yield, ~Await] >> 이 부분에서 화살표 함수의 몸통은 AssignmentExpression(할당 표현식)
    { FunctionBody[~Yield, ~Await] }
```



### References

```text
IfStatement[Yield, Await, Return] :
    if ( Expression[+In, ?Yield, ?Await] ) Statement[?Yield, ?Await, ?Return] else Statement[?Yield, ?Await, ?Return]
    if ( Expression[+In, ?Yield, ?Await] ) Statement[?Yield, ?Await, ?Return]
```

현재 최신 명세 링크:
- [ECMAScript(if statement)](https://tc39.es/ecma262/#sec-if-statement)
- [if](https://tc39.es/ecma262/#prod-IfStatement)
- [Expression](https://tc39.es/ecma262/#prod-Expression)
- [Statement](https://tc39.es/ecma262/#prod-Statement)
- [비교 연산자(>)에 대한 명세](https://tc39.es/ecma262/#sec-relational-operators)
- [화살표 함수의 표현식 본문(Expression Body)에 대한 명세](https://tc39.es/ecma262/#prod-ArrowFunction)