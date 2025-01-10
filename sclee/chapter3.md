# 객체와 타입

## 3-1 타입스크립트 변수 선언문

### 타입스크립트 기본 제공 타입

- **string**: 문자열 타입  
- **number**: 숫자 타입  
- **boolean**: 불리언 타입  
- **object**: 객체 타입  




### let 과 const 키워드

ES5의 `var` 키워드는 여러 문제점을 발생시킬 수 있기 때문에 `let`과 `const`가 도입되었다.

- **`var`의 문제점**:
  - 함수 단위 스코프
  - 재선언 가능
  - 호이스팅 시 `undefined`로 처리되어 에러가 발생하지 않음

- **`let` 키워드**:  
  - 블록 스코프를 가지며, 재할당이 가능하다.

- **`const` 키워드**:  
  - 선언과 동시에 초기값을 명시해야 하며, 값이 변경되지 않는다.  
  - 단, 객체나 배열 같은 참조 타입은 속성 변경이 가능하다.



### 타입 주석

**타입 주석(Type Annotation)**  
타입스크립트는 JavaScript의 변수 선언문을 확장하여 타입을 명시할 수 있다.

```typescript
let 변수이름: 타입 = 초기값;
```



### 타입 추론

**타입 추론(Type Inference)**  
JavaScript와의 호환성을 위해 타입 주석을 생략할 수 있으며, 초기값에 따라 타입스크립트가 타입을 추론하여 지정한다.



### any 타입

**`any` 타입**  
JavaScript와의 호환을 위해 any 타입을 제공한다.  
any 타입은 최상위 타입으로, 어떤 종류의 값도 저장할 수 있다.



### undefined 타입
TypeScript에서 undefined는 값이면서 타입이기도 하다.



### 템플릿 문자열

백틱으로 문자열을 감싸고,${변수}를 사용하여 변수를 포함시킬 수 있다.  
가독성이 좋고,좀 더 직관적이고 쉽게 사용할 수 있다.

```typescript
const name = "TypeScript";
console.log(`Hello, ${name}!`); // Hello, TypeScript!
```

--- 


# 03-2 객체와 인터페이스

`object` 타입은 `number`, `string`과 같은 타입의 값을 가질 수 없지만, 객체를 대상으로 하는 `any` 타입처럼 동작한다.



## 인터페이스 선언문

### `interface` 키워드
객체의 타입을 정의할 수 있게 합니다.

```typescript
interface 인터페이스이름 { 
  속성이름: 속성타입;
}
```
### 조건을 벗어나는 예 

```typescript
interface IPerson {
  name: string;
  age: number;
}

let good: IPerson = { name: "잭", age: 32 };

let bad1: IPerson = { name: "잭" }; // age 속성이 없음.
let bad2: IPerson = { age: 32 }; // name 속성이 없음.
let bad3: IPerson = {}; // 둘 다 없음.
let bad4: IPerson = { name: "잭", age: 32, etc: true }; // etc 속성이 있음.
```

## 선택 속성 구문
있어도 되고 없어도 되는 속성.

```typescript
interface IPerson {
  name: string 
  age: number  // 필수 
  etc?: boolean  // 선택
}
```

## 익명 인터페이스 
`interface` 키워드를 사용하지 않고 즉석에서 정의하여 사용하는 방법으로 간단하고 일회성인 경우에 적합하다.


### 예시1 : 변수에 적용

```typescript
let ai: {
  name: string;
  age: number;
  etc?: boolean;
} = { name: "jack", age: 32 };
```

### 예시 2: 함수의 매개변수에 적용

```typescript
function greet(user: { name: string; age: number }): string {
  return `Hello, ${user.name}. You are ${user.age} years old.`;
}

console.log(greet({ name: "jack", age: 32 }));
```

--- 

# 03-3 객체와 클래스

## 클래스 선언문

타입스크립트는 C++이나 자바 같은 객체 지향 언어에서의 `class`, `private`, `public` 같은 키워드를 제공한다. 약간의 문법적인 차이만 있을 뿐 의미는 같다.

```typescript
class 클래스이름 {
  [ private : protected : public ] 속성이름 : 속성타입
}
```

## 접근 제한자

`private`, `protected`, `public`의 접근 제한자를 가질 수 있으며, 생략하면 `public`으로 간주된다.

## 생성자

클래스에서의 생성자(`constructor`)는 클래스의 인스턴스가 생성될 때 자동으로 호출되는 특수한 메서드다.

생성자의 매개변수에 `public` 같은 접근 제한자를 붙이면 해당 매개변수의 이름을 가진 속성이 클래스에 선언된 것처럼 동작한다.

```typescript
class Person {
  constructor(public name: string, public age?: number) {}
}

let jack: Person = new Person('jack', 32);
console.log(jack); // Person { name: 'jack', age: 32 }
```

## 인터페이스 구현

클래스가 특정 인터페이스의 구조를 따르도록 할 때 `implements` 키워드를 사용해 구현할 수 있다.

```typescript
class 클래스이름 implements 인터페이스이름 {
  // 내용
}
```

인터페이스는 속성이 있어야 한다는 규약(spec)에 불과하며 물리적으로 해당 속성을 만들지 않는다.

```typescript
interface IPerson {
  name: string;
  age: number;
}

class Person implements IPerson {
  constructor(public name: string, public age?: number) {}
}

let jack: IPerson = new Person('jack', 32);
```

## 추상 클래스

`abstract` 키워드를 사용해 추상 클래스를 만들 수 있다. 추상 클래스는 자신의 속성이나 메서드를 상속하는 클래스에서 구현해야 한다. 추상 클래스는 `new` 키워드를 사용해 직접 인스턴스를 생성할 수 없다.

```typescript
abstract class 클래스이름 {
  abstract 속성이름: 속성타입;
  abstract 메서드이름(): void;
  // 추상 메서드는 추상 클래스 안에서 정의하며, 메서드 본문 없이 선언만 되어 있다. 
  // 이 메서드는 해당 클래스를 상속받은 서브클래스에서 반드시 구현해야 한다.
}
```

### 추상 클래스 예시

```typescript
abstract class AbstractPerson {
  abstract name: string;
  constructor(public age?: number) {}
}
```

## 클래스 상속

`extends` 키워드를 사용해 상속 클래스를 만들 수 있다. `super` 키워드로 부모 생성자를 호출할 수 있다.

```typescript
class 상속클래스 extends 부모클래스 {}
```

```typescript
class Person extends AbstractPerson {
  constructor(public name: string, age?: number) {
    super(age);
  }
}

let jack: Person = new Person('Jack', 32);
```

## static 속성

클래스에 속하지만 인스턴스가 아닌 클래스 자체에서 직접 접근할 수 있는 속성이다.

```typescript
class 클래스이름 {
  static 정적속성이름: 속성타입;
}
```

### static 속성 예시

```typescript
class Calculator {
  static PI = 3.14; // static 속성

  static add(a: number, b: number): number { // static 메서드
    return a + b;
  }
}

console.log(Calculator.PI);          // 3.14
console.log(Calculator.add(5, 3));   // 8
const calc = new Calculator();
// console.log(calc.PI);  // 오류: 인스턴스로 static 속성에 접근 불가
```

---

# 03-4 객체의 비구조화 할당문

## 구조화

구조화는 연관된 데이터를 모아 하나의 객체나 배열로 만드는 것을 의미한다.

```typescript
export interface IPerson {
  name: string;
  age: number;
}

import { IPerson } from '~~';

let jack: IPerson = { name: 'jack', age: 32 },
    jane: IPerson = { name: 'jane', age: 32 };
```

## 비구조화

구조화된 데이터를 분해하는 것을 의미한다.

```typescript
let name = jack.name, age = jack.age;
```

## 비구조화 할당

비구조화 과정을 좀 더 간단하게 제공하는 문법이다.

```typescript
let { name, age } = jack;
```

## 잔여 연산자

사용되는 위치에 따라 잔여 연산자 혹은 전개 연산자라고 불리는 `...` 연산자를 제공한다.

```typescript
let address: any = {
  city: '수원',
  address1: '권선구',
  address2: '서수원로',
  address3: '아파트',
};

const { city, ...detail } = address;
console.log(detail);

// 실행 결과
// {
//   address1: '권선구',
//   address2: '서수원로',
//   address3: '아파트',
// }
```

## 전개 연산자

비구조화 할당문이 아닌 곳에서 사용될 경우 전개 연산자라고 한다.

```typescript
const obj1 = { name: 'jack', age: 32 };
const obj2 = { job: 'FE' };
const obj3 = { ...obj1, ...obj2 };
console.log(obj3); // { name: 'jack', age: 32, job: 'FE' }
```

# 03-5 객체의 타입 변환

## 타입 변환 (type conversion)

특정 타입의 변수 값을 다른 타입의 값으로 변환하는 것을 의미한다. 명시적 변환과 암묵적 변환을 모두 포함하는 개념이다.

### 타입 변환 문법

```typescript
(<타입>객체)
(객체 as 타입)
```

### 예시

```typescript
interface Nameable {
  name: string;
}
```

```typescript
let obj: object = { name: 'jack' };

let name1 = (<Nameable>obj).name;
let name2 = (obj as Nameable).name;
console.log(name1, name2); // jack jack
```
