# 5장 배열과 튜플

## 개념 소개

- 함수형 프로그래밍(선언형 프로그래밍)
- 명령형 프로그래밍
- 순수 함수, side-effect
- 깊은 복사와 얕은 복사

## 5.1 배열의 형태

TypeScript에서 배열 타입은 두 가지 방법으로 선언할 수 있습니다:

1. 배열 요소들의 타입 뒤에 `[]`를 사용:
```typescript
let list: number[] = [1, 2, 3];
```

2. 제네릭 배열 타입을 사용:
```typescript
let list: Array<number> = [1, 2, 3];
```

### T[]와 Array\<T>의 차이점

`T[]`가 더 선호되는 이유:
1. 가독성 및 일관된 코드 스타일 
2. JavaScript/TypeScript의 관례
3. 성능이나 메모리 관점에서의 차이는 미미합니다.

#### AST 구조

**1. T[]의 경우:**
```typescript
const numbers: number[] = [1, 2];
```
```
VariableDeclaration
├── kind: "const"
├── declarations
    └── VariableDeclarator
        ├── id: Identifier ("numbers")
        ├── typeAnnotation
        │   └── ArrayType
        │       └── elementType: NumberKeyword
        └── initializer: ArrayLiteralExpression
            ├── element: NumericLiteral (1)
            └── element: NumericLiteral (2)
```

- typeAnnotation: 변수 numbers의 타입 정보를 나타냅니다.
  - ArrayType: 타입은 배열 형태임을 나타냅니다.
  - elementType: 배열의 각 요소가 number 타입임을 정의합니다.

**2. Array\<T>의 경우:**
```typescript
const numbers: Array<number> = [1, 2];
```
```
VariableDeclaration
├── kind: "const"
├── declarations
    └── VariableDeclarator
        ├── id: Identifier ("numbers")
        ├── typeAnnotation
        │   └── TypeReference
        │       ├── typeName: Identifier ("Array")
        │       └── typeArguments
        │           └── NumberKeyword
        └── initializer: ArrayLiteralExpression
            ├── element: NumericLiteral (1)
            └── element: NumericLiteral (2)
```

- TypeReference: 제네릭 타입을 참조하는 형태
  - typeName: 제네릭 타입의 이름으로 Array를 나타냅니다.
  - typeArguments: Array 타입의 인수로 NumberKeyword를 전달합니다.

> AST(Abstract Syntax Tree, 추상 구문 트리)은 소스 코드를 트리 구조로 변환한 데이터 표현으로, 컴파일러가 코드의 구조를 이해하고 분석하는 데 사용됩니다. 타입스크립트의 경우 AST는 코드 내 문법적 구성 요소를 계층적으로 표현하며, 타입 정보나 선언 구조 등 다양한 메타데이터를 포함합니다.

JavaScript 코드는 Scanner에 의해 분해되어 가장 작은 단위인 "Token"의 모음이 된 후, Parser에 의해 AST로 변환됩니다.

### TypeScript 컴파일 과정
1. 타입스크립트 소스 → 타입스크립트 AST
2. 타입 검사기가 AST를 확인
3. 타입스크립트 AST → 자바스크립트 소스

### JavaScript 실행 과정
4. 자바스크립트 소스 → 자바스크립트 AST
5. AST → 바이트코드
6. 런타임이 바이트코드를 평가

이렇게 타입스크립트는 컴파일 시점에서 AST의 분석을 통해 타입을 정적으로 추론함으로 자바스크립트의 동적 타입 변환에 의한 에러로부터 보완될 수 있다는 장점이 존재합니다.

## 5.2 배열 이해하기

JavaScript에서 배열은 객체입니다. 배열은 Array 클래스의 인스턴스인데, 클래스의 인스턴스는 객체이기 때문입니다.

- 내부적으로 해시 테이블처럼 동작합니다. 각 인덱스는 실제로는 문자열 키입니다.
- Array 프로토타입의 메서드들(push, pop, shift, unshift 등)을 상속받아 사용할 수 있습니다.
- length 속성이 자동으로 관리됩니다.
- 희소 배열(sparse array)이 가능합니다. - 연속적이지 않은 인덱스를 가질 수 있습니다.

이러한 특징 때문에 자바스크립트의 배열은 일반적인 배열의 개념보다는 '배열처럼 동작하는 객체'에 가깝습니다. 유연성을 제공하지만, 전통적인 배열보다 메모리와 성능 면에서는 덜 효율적일 수 있습니다.

## 5.3 다양한 배열 선언

### 1. 여러 타입을 허용하는 배열
```typescript
let mixed: (string | number)[] = [1, "two", 3];
```

- 유니온 타입 사용

### 2. 객체 배열의 타입 정의
```typescript
interface User {
    name: string;
    age: number;
}

let users: User[] = [
    { name: "Kim", age: 25 },
    { name: "Lee", age: 30 }
];
```

- interface User는 객체의 형태를 정의합니다.
  - name은 문자열 타입
  - age는 숫자 타입
  - 이 구조를 가진 객체만 User 타입으로 인정합니다.
- User[]는 User 타입의 객체들을 담은 배열을 의미합니다.
  - 배열의 각 요소는 User 인터페이스에 정의된 구조를 따라야 합니다.
  - 타입스크립트는 이를 컴파일 시점에 체크합니다.
- users
  - 기본적으로 Array 객체의 인스턴스
  - 동시에 각 요소로 User 형태의 객체를 가지는 배열

#### 에러 케이스
```typescript
users.push({ name: "Jin" }); // age가 없어서 에러
users.push({ name: "Jin", age: "30" }); // age가 문자열이라서 에러
users.push({ name: "Jin", age: 30, gender: "M" }); // 정의되지 않은 속성이 있어서 에러
```

#### 정상 케이스
```typescript
users.push({ name: "Jin", age: 30 });
console.log(users[0].name); // Kim 
console.log(users[0].age); // 25
users[0].age = 26;
```

#### 배열 메서드 활용과 타입 안정성 유지
```typescript
const adults = users.filter(user => user.age >= 19);
const names = users.map(user => user.name);
const totalAge = users.reduce((sum, user) => sum + user.age, 0);
```

**filter: 조건에 맞는 요소만 선택 (타입 유지)**
```typescript
// 타입을 명시적으로 작성한 경우
adults.forEach((user: User) => {
    console.log(user.name);
});

// 타입 추론
adults.forEach(user => {
    console.log(user.name); // user가 User 타입임을 알고 있습니다.
});
```

users는 User[] 타입으로 선언되어 있습니다.
filter 메서드는 원본 배열의 타입을 유지합니다.
따라서 adults도 User[] 타입이 됩니다.
forEach의 콜백 함수에서 user 파라미터는 자동으로 User 타입으로 추론됩니다.

**map: 각 요소를 변환 (새로운 타입으로 변환 가능)**
```typescript
const userSummaries = users.map(user => ({
    fullName: user.name + "님",
    isAdult: user.age >= 19
}));
// { fullName: string, isAdult: boolean; }[] 타입으로 추론됩니다.
```

map 메서드는 각 요소를 변환하여 새로운 배열을 만듭니다.
변환 함수에서 user 파라미터는 자동으로 User 타입으로 추론됩니다.
반환되는 배열의 타입은 변환 함수의 반환 타입을 따릅니다.
따라서 names는 string[] 타입이 됩니다. (user.name이 string이므로)

**reduce: 배열을 단일 값으로 축소 (어떤 타입으로든 변환 가능)**
```typescript
const usersByAge = users.reduce((acc, user) => {
    const key = user.age.toString();
    return {
        ...acc,
        [key]: [...(acc[key] || []), user.name]
    };
}, {} as Record<string, string[]>);
```

reduce 메서드는 배열을 하나의 값으로 축소합니다.
reduce의 첫 번째 파라미터 sum은 초기값의 타입(number)으로 추론됩니다.
두 번째 파라미터 user는 자동으로 User 타입으로 추론됩니다.
따라서 totalAge는 number 타입이 됩니다. (초기값이 0이고 user.age가 number이므로)

### 3. readonly 배열
```typescript
let readOnlyNumbers: readonly number[] = [1, 2, 3];

// 에러 케이스
readOnlyNumbers.push(4); // 에러: 'push' 속성이 'readonly number[]' 타입에 존재하지 않습니다
readOnlyNumbers[0] = 10; // 에러: 인덱스 서명이 읽기 전용이므로 할당할 수 없습니다
readOnlyNumbers.splice(1, 1); // 에러: 'splice' 속성이 'readonly number[]' 타입에 존재하지 않습니다

// 읽기 작업은 정상 동작
console.log(readOnlyNumbers[0]); // 정상
console.log(readOnlyNumbers.length); // 정상
readOnlyNumbers.map(x => x * 2); // [2, 4, 6] 새로운 배열을 반환
readOnlyNumbers.filter(x => x > 2); // [3] 새로운 배열을 반환
```

타입스크립트에서 불변(immutable) 배열을 만들 때 사용하는 타입 지정자입니다.
컴파일 타임에만 존재하는 특성입니다. (런타임에는 일반 배열과 동일)
배열을 수정하는 모든 메서드(push, pop, splice 등)의 사용을 막습니다.
읽기 전용 속성만 허용하므로 코드의 안정성을 높여줍니다.
함수 매개변수나 클래스 속성에서 데이터가 변경되는 것을 방지하기 위해서 사용됩니다.

```typescript
// 여러 사용법
// 1. ReadonlyArray<T> 타입 사용
let numbers: ReadonlyArray<number> = [1, 2, 3];

// 2. as const를 사용한 튜플 타입 선언
let tuple = [1, 2, 3] as const; // readonly [1, 2, 3] 타입이 됨

// 3. 객체 배열에서의 사용
interface User {
    readonly name: string;
    age: number;
}

const users: readonly User[] = [
    { name: "Kim", age: 25 },
    { name: "Lee", age: 30 }
];

// 실제 사용 예시
function processNumbers(numbers: readonly number[]) {
    // numbers 배열은 이 함수 내에서 수정될 수 없음
    const sum = numbers.reduce((acc, cur) => acc + cur, 0);
    return sum;
}

class DataProcessor {
    private readonly data: readonly number[];
    
    constructor(initialData: number[]) {
        this.data = initialData;
    }
    
    // data는 클래스 내부에서도 수정할 수 없음 
}
```

- as const는 좀 더 엄격합니다. 배열의 각 요소까지 readonly로 만들고 리터럴 타입으로 추론합니다.

```typescript
// 1. readonly array 
let readonlyArr: readonly number[] = [1, 2, 3];
readonlyArr[0] = 5; // 오류: 인덱스로 수정 불가
readonlyArr.push(4); // 오류: 배열 메서드로 수정 불가
readonlyArr = [4, 5, 6]; // 가능: 배열 자체를 새로운 배열로 교체 가능

// 2. as const
let constArr = [1, 2, 3] as const;
constArr[0] = 5; // 오류: 인덱스로 수정 불가
constArr.push(4); // 오류: 배열 메서드로 수정 불가
constArr = [4, 5, 6]; // 오류: 배열 자체를 교체할 수 없음

// 객체의 경우 더 명확합니다.
// 1. readonly
const readonlyObj: readonly [number, string] = [1, "hello"];
// 타입은 readonly [number, string]
// 각 위치의 타입만 고정 (number, string)

// 2. as const
const constObj = [1, "hello"] as const;
// 타입은 readonly [1, "hello"] 
// 각 위치의 값까지 고정 (정확히 1과 "hello"만 가능)
```

타입스크립트에서는 문자열, 숫자, 불리언 값을 리터럴 타입으로 사용할 수 있습니다.

```typescript
// 함수 파라미터에서의 활용
function setAlignment(alignment: "left" | "center" | "right") {
    // .......
}

setAlignment("left"); // 가능
setAlignment("centre"); // 오류, 다른 값 허용 x

// 객체에서의 활용
interface Options {
    method: "GET" | "POST";
    path: string;
}

const request: Options = {
    method: "GET", // 가능
    method: "FETCH", // 오류
    path: "/api"
};
```

API의 정확한 응답 값을 타입으로 정의할 때
 함수가 받을 수 있는 정확한 값들을 제한할 때
 상태 관리에서 가능한 상태값들을 정의할 때 매우 유용합니다.

### 4. 튜플 타입(고정된 길이와 타입을 가진 배열)

```typescript
let tuple: [string, number] = ["hello", 42];
```

튜플은 고정된 길이와 각 위치마다 정해진 타입을 가지는 배열의 특별한 형태입니다.
- [string, number]는 첫 번째 요소는 반드시 문자열, 두 번째 요소는 반드시 숫자여야 함을 명시합니다.

**순서와 타입이 중요합니다.**
```typescript
// 올바른 사용
let correct: [string, number] = ["hello", 42];

// 잘못된 사용
let wrong: [string, number] = [42, "hello"]; // 오류 발생
```

**선택적 요소도 정의 가능합니다.**
```typescript
let tupleWithOptional: [string, number?] = ["hello"];
// 두 번째 요소는 선택사항
```

**나머지 요소도 사용 가능합니다.**
```typescript
let tupleWithRest: [string, ...number[]] = ["hello", 42, 43, 44];
// 첫 번째는 문자열, 그 이후로는 여러 숫자가 올 수 있음
```

사용 목적:
배열은 동일한 타입의 데이터를 여러 개 다룰 때 사용하고, 튜플은 서로 다른 타입의 데이터를 고정된 쌍으로 다룰 때 사용합니다. 
특히 함수의 반환값이나 좌표값과 같은 정해진 형식의 데이터를 다룰 때 유용합니다.

객체 배열과의 차이:
```typescript
interface Student {
    name: string;
    score: number;
}

// 객체 배열 사용
let students: Student[] = [
    { name: "Kim", score: 85 },
    { name: "Lee", score: 90 },
    { name: "Park", score: 92 }
];

// 튜플 배열
let studentTuples: [string, number][] = [
    ["Kim", 85],
    ["Lee", 90],
    ["Park", 92]
];

// 객체 배열
console.log(students[0].name); // 어떤 데이터인지 명확함

// 튜플 배열
console.log(studentTuples[0][0]); // 인덱스만으로는 의미를 알기 어려움

// 나중에 데이터 추가할 시 
interface Student {
    name: string;
    score: number;
    grade?: string;
    class?: string;
}

// 새로운 데이터 추가가 용이
```

튜플의 경우:
- 좌표값처럼 의미가 명확하고 고정된 쌍
- 함수의 반환값처럼 일시적으로 여러 값을 묶을 때
- React의 useState 같은 후크 반환값에 더 적합합니다.

### React 예시
```typescript
// useState의 반환 타입은 튜플입니다
function useState<T>(initialValue: T): [T, (newValue: T) => void] {
    // [T, (newValue: T) => void]: 반환 타입이 튜플이며
    // 첫 번째 요소는 T 타입의 상태값
    // 두 번째 요소는 T 타입의 새 값을 받아서 상태를 갱신하는 함수
}

function Counter() {
    const [count, setCount] = useState(0);
    // useState(0)을 호출하면 T는 number가 됩니다.
    // [number, (newValue: number) => void]
    // count의 타입은 number
    // setCount의 타입은 (newValue: number) => void
    return (
        <button onClick={() => setCount(count + 1)}>
            Count: {count}
        </button>
    );
}

function UserProfile() {
    const [name, setName] = useState("Kim");
    const [age, setAge] = useState(25);

    // 구조분해 할당으로 깔끔하게 사용 가능
    return (
        <div>
            <input 
                value={name} 
                onChange={e => setName(e.target.value)} 
            />
            <input 
                type="number"
                value={age} 
                onChange={e => setAge(Number(e.target.value))} 
            />
        </div>
    );
}
```