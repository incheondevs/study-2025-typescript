# 3. 객체와 타입

## 3-1. 타입스크립트 변수 선언문

### 기본 제공 타입

- 숫자형: number
- 논리형: boolean
- 문자열: string
- 객체 : object

### let과 const 키워드

var는 미사용 강력 권고
let은 변수, const는 상수

### Type Annotation

변수 선언을 확장해 명시적으로 타입을 지정하는 문법
```ts
let 변수명: 타입 [=초기값]
const 변수명: 타입 = 초기값 
```

### 타입 추론

JS와 호환을 위해 타입 주석을 생략 가능, TSC가 초기값으로 변수타입 추론
(당연히 사용 자제하는게...)

### any 타입

JS와 호환을 위해 모든 타입의 값이 올수 있는 타입
(역시 사용 자제..)

### undefined 타입

null과는 달리 메모리 주소(ref)도 지정되지 않은? 값이자 JS의 타입중 기본자료형 중 하나
모든 타입에 최하위 타입 (반면 any는 최상위 타입)

### 템플릿 문자열

백틱을 사용한 문자열 표현법, 중간에 ${} 문법을 이용해 변수나 간단한 구문 사용 가능

<br/>

## 3-2. 객체와 인터페이스

object 타입은 그냥 사용하면 any 처럼 자유롭게 사용 가능

### 인터페이스 선언문

객체 타입을 정의할 수 있도록 interface 키워드 제공
```ts
interface 이름 {
  속성명[?]: 속성타입, [...반복...]
}
```

예제 
```ts
interface IPerson {
  name: string,
  age: number,
}

let good: IPerson = { name: "잭", age: 32 };
// 오류 예
let bad1: IPerson = { name: "잭" };
let bad2: IPerson = { age: 32 };
let bad3: IPerson = {  };
let bad4: IPerson = { name: "잭", age: 32, etc: true };
```

### 선택 속성 구문

있어도 되고 없어도 되는 속성에 관한 설정, 속성명 뒤에 ?키워드를 붙임
```ts
interface IPerson {
  name: string,
  age: number,
  etc?: boolean, // 선택 속성
}

let good1: IPerson = { name: "잭", age: 32 };
let good2: IPerson = { name: "잭", age: 32, etc: true };
```

### 익명 인터페이스 (anonymous interface)

interface 키워드를 사용하지 않고 인터페이스를 정의 하는 방법

```ts
let ai: {
  name: string,
  age: number,
  etc?: boolean, // 선택 속성
} = { name: "잭", age: 32 };
```

주로 함수 파라미터 정의시 사용

```ts
function prme(me: {name: string, age: number } ) {
  // ... 내용 생략... me 파라미터는 익명으로 인터페이스가 선언됨
}
```

<br/>

## 3-3 객체와 클래스

### 클래스 선언문

다른 객체 지향 언어의 클래스 선언 문법과 유사

```ts
class 클래스명 {
  [ private | protected | public ] 속성명[?]: 타입, [..반복..]
}
```

### 접근 제한자

`private | protected | public` 의 접근 제한자를 가질수 있으며 생략하면 public

### 생성자

클래승의 인스턴스를 생성할때 수행하는 메소드...
생성자에는 접근제한자를 붙이지 않아야함!

### 인터페이스의 구현

implements 키워드를 사용해 클래스에서 인터페이스를 구현

```ts
class 클래스명 implements 인터페이스명 {
  // 내용
}
```

ts의 인터페이스는 속성이 있어야 한다는 규약(spec)에 불과함
```ts
interface IPerson {
  name: string,
  age: number,
}

class Person implements IPerson {
  name: string,
  age: number,
  constructor(name: string, age?: number) {
    this.name = name;
    this.age = age;
  }
}
```


### 추상 클래스

abstract 키워드를 사용해 추상 클래스 정의 가능

```ts
abstract class 클래스명 {
  abstract 속성명: 타입,
  abstract 메소드명() {}
}
```

new 키워드로 인스턴스 생성 불가능함!

### 클래스의 상속

extends 키워드를 이용해 상속 받을 수 있음
자식 클래스는 부모의 모든 속성과 메소드를 물려받음

```ts
abstract class AbsPerson {
  abstract name: string,
  constructor(public age?: number) {}
}

class Person extends AbsPerson {
  constructor(public name: string, age?: number) {
    super(age);
  }
}
let jack: Person = new Person("잭", 32);
```

부모 클래스의 생성자를 super 키워드로 호출 가능


### static 속성

클래스의 인스턴스가 아닌 클래스에 지정되는 속성

```ts
class 클래스명 {
  static 정적속성명: 타입
} 
```

<br/>

## 3-4 객체의 비구조화 할당문

### 비구조화란?

구조화된 데이터를 분해하는 것

### 비구조화 할당

ESNext 에도 있는 문법

```ts
let {name, age} = jack;
// let name = jack.name;
// let age = jack.age;
```

객체나 배열에서 사용 가능

### 잔여 연산자 (rest operator)

구조 분해시 지정한 키 이외의 (나머지)키를 가지게 하는 문법

```ts
let address: any = {
  country: "한국",
  city: "인천",
  addr1: "연수구",
  addr2: "용담로 111",
  addr3: "아이스타워 6층",
}
const { conuntry, city, ...detail } = address;
console.log(detail); // == { addr1, addr2, addr3 }
```

### 전개 연산자 (spread operator)

객체나 배열을 각 속성이나 값으로 분해할때 사용하는 문법

```ts
let part1 = { country: "한국" };
let part2 = { city: "인천" };
let part3 = { addr1: "연수구", addr2: "용담로 111", addr3: "아이스타워 6층" };
let address = { ...part1, ...part2, ...part3 };
// 위 예제의 address와 동일한 속성을 가짐
```

<br/>

## 3-5 객체의 타입 변환

### 타입 변환 (type conversion)

특정 타입이 다른 타임으로 변환
명시적(casting) + 암묵적(coercion) 변환을 모두 포함하는 개념

### 타입 단언 (type assertion)

타입스크립트에서는 타입을 변환하는 문법을 의미 (2가지)

```ts
(<타입>객체)
(객체 as 타입)
```

타입스크립트에만 존재하는 문법

```ts
interface IName {
  name: string;
}
let obj: object = { name: "잭" };

let name1 = (<IName>obj).name;
let name2 = (obj as IName).name;
console.log(name1, name2);
```

