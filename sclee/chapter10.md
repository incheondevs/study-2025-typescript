# 제네릭
## 제네릭이란
`제네릭`은 타입을 미리 정의하지않고 사용하는 시점에 원하는 타입을 정의해서 쓸 수 있는 문법이다.

= 타입을 매개변수처럼 받아서 나중에 지정할 수 있도록 하는 것



**제네릭의 기본 문법**
```ts
function getText<T>(text: T): T {
return text;
}

function getText<string>(text: string): string {
return text;
} 
```

**제네릭 사용시 이점**
- 코드 재사용성 증가 → 다양한 타입에서 동일한 코드 사용 가능 ( 중복코드를 줄일 수 있다. = 애니타입 사용 X )
- 타입 안정성 보장 → 잘못된 타입 사용을 방지 ( 타입스크립트의 이점 )
- 유연성 제공 → 타입을 나중에 결정할 수 있어 확장성이 뛰어남

## 인터페이스에 제네릭 사용하기
```TS

// 드롭다운 유형별로 각각의 인터페이스를 연결
var product: ProductDropdown;
var stock: StockDropdown;
var address: AddressDropdown;
 

// 드롭다운 유형별로 하나의 제네릭 인터페이스를 연결
interface Dropdown<T> {
value: T;
selected: boolean;
} 

var product: Dropdown<string>;
var stock: Dropdown<number>;
var address: Dropdown<{ city: string; zipCode: string }>;
```

## 제네릭의 타입 제약
제네릭은 `타입 제약` 이라는 문법을 통해 타입에 제한을 걸 수 있다.

```ts
// length 속성을 가진 타입만 취급하겠다고 제한.
function lengthOnly<T extends { length: number }>(value: T) {
return value, length;
} 

// 특정 인터페이스를 구현한 객체만을 취급하겠다고 제한 
interface HasId {
  id: number;
}

function getId<T extends HasId>(obj: T): number {
  return obj.id;
}
```

###  keyof를사용한타입제약 

 keyof는 특정 타입의 키 값을 추출해서 문자열 유니언 타입으로 변환
 

```ts
// 객체(obj)와 객체의 키(key)를 받아서 해당 키의 값을 반환하는 함수
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Alice", age: 25 };
console.log(getValue(user, "name")); // "Alice"
```

