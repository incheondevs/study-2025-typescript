# 10. 제네릭 프로그래밍

## 10-1. 제네릭 타입 이해하기

심벌에 타입을 미리 지정하지 않고 다양한 타입에 대응하려고 할 때 사용

인터페이스나 클래스, 함수, 타입 별칭 등에 사용할 수 있음

```ts
// 인터페이스에서
interface IVal<T> {
  value: Tp
}
// 함수에서
function func<T>(arg: T): T {
  return arg;
}
// 타입별칭에서
type GType<T> = { prop: T }
// 클래스 선언에서
class GObj<T> {
  constructor(public value: T) {}
}
```

### 제네릭 사용하기

- 인터페이스

```ts
interface IValuable<T> {
  value: T;
}

const numVal: IValuable<number> = { value: 1 }
const strVal: IValuable<number> = { value: "문자열" }
```

<br/> 

## 10-2. 제네릭 타입 제약

### extends 

제네릭의 타입을 한정하고 싶을때 사용

```ts
// 인터페이스 정의
interface Lengthwise {
    length: number;
}

// T 타입은 Lengthwise 인터페이스를 확장해야 합니다.
function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length); // 이제 arg는 length 속성을 가진다고 확신할 수 있습니다.
    return arg;
}

// 올바른 사용 - 배열은 length 속성을 가집니다.
loggingIdentity([1, 2, 3]);

// 오류 - number는 length 속성을 가지지 않습니다.
// loggingIdentity(10);
```

### new 타입 제약

팩토리 함수에서 new 연산자를 사용해 인스턴스를 생성할때 제네릭을 사용 불가능

```ts
const create = <T>(type: T): T => new type() ; // error
```

다음과 같이 사용

```ts
// const create = <T extends {new(): T}>(type: T): T => new type() ;
// 간결한 표현
const create = <T>(type: new() => T): T => new type() ;
const now = create(Date);
console.log(now);
// 생성자 파라미터가 있을때
const create2 = <T>(type: {new(...args): T}, ...args): T => new type(args) ;
class Point {
  constructor(pulbic x: number, public y: number) {}
}
const zerozeroPoint = create(Point, 0, 0);
console.log(zerozeroPoint);
```

### 인덱스 타입 제약 (keyof)

객체 내에서 일부 속성들만 추려서 단순한 객체를 만들 때 사용할 수있는 인덱스 타입 제약

keyof 키워드를 이용하면 객체의 key 값으로 이루어진 유니온 타입을 구할 수 있다.

```ts
interface Person {
    name: string;
    age: number;
    address: string;
}

type PersonKeys = keyof Person; // "name" | "age" | "address" 의 유니온 타입
```

이를 제네릭의 인덱스 타입 제약으로 활용하면

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const person: Person = {
    name: "Alice",
    age: 30,
    address: "123 Main St"
};

let name = getProperty(person, "name");  // 올바름
let age = getProperty(person, "age");    // 올바름
// let invalid = getProperty(person, "height"); // 오류 - 'height'는 'Person' 타입에 존재하지 않음
```

<br/>

## 10-3. 대수의 데이터 타입

함수형 언어에서 ADT는 algebric data type(대수 자료형) 을 의미.

크게 합집합 타입(union type)과 교집합 타입(intersection type)이 두 종류

### 합집합 타입

or 의미를 가진 | 기호를 이용해 연결해 만드는 타입

```ts
type NumOrStr = number | string ;
let ns: NumOrStr = 1;
ns = "문자열";
```

### 교집합 타입

and 의미를 가진 & 기호로 연결해서 만드는 타입

```ts
const mergeObjs = <T, U>(a: T, b: U): T & U => ({...a, ...b});

type NameableObj = {name: string} ;
type AgeableObj = {age: number} ;

const nameAndAge: NameableObj & AgeableObj = mergeObjs({name: "잭", age: 32});
console.log(nameAndAge);
```

### 합집합 타입 구분하기 ~ 식별 합집합 구문

유니온 타입을 보다 안전하고 명확하게 사용할 수 있도록 도와주는 패턴

```ts
interface ISquare { tag: 'square', size: number };
interface IRectangle { tag: 'rect', width: number, height: number };
interface ICircle { tag: 'circle', radius: number };

type IShape = ISquare | IRectangle | ICircle ;

function calcArea(shape: IShape) {
  switch (shape.tag) {
    case 'square':
      return shape.size * shape.size;
    case 'rect':
      return shape.width * shape.height;
    case 'circle':
      return Math.PI * shape.radius * shape.radius;
    default:
      return 0;
  }
}
```

- 공통 속성: 모든 멤버가 동일한 이름의 리터럴 타입 속성을 가집니다.

- 타입 안정성: 이 속성을 통해 타입스크립트 컴파일러가 유니온 타입의 정확한 멤버를 추론할 수 있습니다.

- 가독성: 코드에서 각 타입을 명확하게 구분할 수 있어 가독성이 좋습니다.

<br/>

## 10-4. 타입 가드

(여기부터)