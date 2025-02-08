# 5. 배열과 튜플

## 5-1. 배열 이해하기

JS에서 배열은 Array 클래스의 인스턴스

### [] 단축 구문

배열 선언을 초기 요소들을 나열하여 선언 가능

### JS에서 배열은 객체다

- Array.isArray() 메소드로 배열 구분 가능

### 배열의 타입

TS에서 배열은 타입[]을 사용하여 선언

```ts
let strArr: string[] = ["a", "b", "c"];
let numArr: number[] = [1, 2, 3];

type IPerson = {name: string, age?: number};
let personArr: IPerson[] = [{name: "잭"}, {name: "제인", age: 32}];
```

### 문자열 배열간 변환

타입스크립트는 문자열(string)을 문자(charactor)의 배열로 보지 않음

| 분해와 결합은 split와 join 메소드를 사용해서 구현한다.

### 인덱스 연산자

배열에 `[인덱스]`를 사용하여 요소를 구할수 있음

### 배열의 비구조화 할당

배열에도 비구조화 할당 가능

### for..in 문

인덱스를 아이템으로 반복문

```ts
let strArr: string[] = ["a", "b", "c"];
for (let idx in strArr) {
  const item = strArr[idx] ;
  console.log(`[${ idx }] ${ item }`);
}
```

### for..of 문

요소를 아이템으로 반복문

```ts
for (const item of ["a", "b", "c"])
  console.log(item);
```

### 제네릭 방식 타입

any와는 다르게 타입은 모르지만 사용하면 계속 같은 타입을 사용할 경우 제네릭을 사용할 수 있다.

```ts
const arrLen = <T>(arr: T[]): number => arr.length ;
const isEmpty = <T>(arr: T[]): boolean => arrLen<T>(arr) == 0 ;

const strArr: string[] = ["a", "b", "c"];
const numArr: number[] = [1, 2, 3];

console.log(
  arrLen(strArr),
  arrLen(numArr),
  arrLen([]),
  isEmpty([]),
  isEmpty([0]),
)
```

### 제네릭 함수의 타입추론

* 제네릭에도 추론이 되나 명시적으로 적어주는게 좋음

### 제네릭 함수의 함수 시그니처

```ts
const func = <T>(callback: (arg: T, i?: number) => number ): void => {};
```

### 전개 연산자

배열에 사용 가능

### range 함수 구현

```ts
const range = (form: number, to: number): number[] => from < to ? [from, ...range(from + 1, to)] : [] ;
```

<br/>

## 5-2. 선언형 프로그래밍과 배열

프로그래밍 관계도

- 함수형 프로그래밍
  - 선언형 프로그래밍
- 명령형 프로그래밍

### 명령형 프로그래밍이란?

데이터를 입력 받고 가공하여 출력을 도출하는 형태

반면, 선언형 프로그래밍은 `시스템 자원의 효율적인 운용`보다 일괄된 문제 해결에 집중

### 문제 풀이로 비교

- 구조적 프로그래밍의 예

```ts
let sum = 0;
for(let val = 0; val <= 100; val++) 
  sum += val;
```

- 선언형 프로그래밍의 예

```ts
const range = (form: number, to: number): number[] => from < to ? [from, ...range(from + 1, to)] : [] ;
let numArr: number[] = range(1, 100+1);
// 아래에 계속 ..
```

#### * fold: 배열 데이터 접기

함수형 프로그래밍에 자주 사용되는 함수

```ts
// ... 위에서 이어짐
const fold = <T>(arr: T[], callback: (result: T, value: T) => T, initValue: T) => {
  let result: T = initValue;
  for(let idx=0; idx<arr.length; ++idx) {
    const val = arr[idx];
    result = callback(result, val);
  }
  return result;
}

let result = fold(numArr, (result, value)=>result+value, 0);
```

선언형 프로그래밍은 위처럼 문제 해결을 위해 시스템의 효율성보다 문제를 해결하는데 반해, 문제 해결을 위해 함수를 재사용 하는 등의 방식을 사용

### 1부터 100 사이 홀수합 구하기 문제

- 명령형 방식의 예

```ts
let oddSum = 0;
for(let val = 1; val <= 100; val += 2)
  oddSum += val;
```

선언형 방식 구현시 filter라는 함수 활용

#### * filter: 조건에 맞는 아이템만 추려내기

```ts
const filter = <T>(arr: T[], cb: (val: T, idx?: number) => boolean): T[] => {
  let result: T[] = [];
  for(let idx: number = 0; idx < arr.length; ++idx) {
    const val = arr[idx];
    if( cb(val, idx) ) result = [...result, value];
  }
  return result;
}
```

- 선언형 방식의 예

```ts
// import range, fold, filter ;
let numArr: number[] = range(1, 100 + 1);
const isOdd = (n: number): boolean => n % 2 != 0
let result = fold(
  filter(numArr, isOdd),
  (result, value) => result + value,
  0
);
console.log(result);
```

### 1부터 100사이 짝수합 구하기

- 생략 : 함수처리 로직을 재사용한다는게 요점..

### 1^2 + 2^2 + 3^2 + ... + 100^2 구하는 문제

- 명령형 방식의 예

```ts
let sum = 0;
for(const val = 0; val <= 100; val++)
  sum += val * val;
console.log(sum);
```

#### * map: 배열 데이터 가공하기

```ts
const map = <T, Q>(arr: T[], cb: (val: T, idx?: number) => Q): Q[] => {
  let result: Q[] = [];
  for(let idx = 0; idx < arr.length; ++idx) {
    const val = arr[idx];
    result = [...result, cb(val, idx)];
  }
  return result;
}
```

- 선언형 방식의 예

```ts
// import range, fold, filter;
let numArr: number[] = range(1, 100 + 1);
let result = fold(
  map(numArr, v => v * v ),
  (r, v) => r + v,
  0
)
console.log(result);
```

<br/>

## 5-3. 배열의 map, reduce, filter 메서드

위에서 구현해본 메소드는 사실 JS의 배열에 이미 구현되어 있으며 메서드 체인으로 사용 가능하다.

### filter 메소드

```ts
배열.filter(callback: (value: T, index?: number): boolean): T[]
```

- 사용 예

```ts
// import 5-1의 range
const arr: number[] = range(1, 10 + 1);
// 홀짝 구하기
const odd: number[] = arr.filter( v => v % 2 != 0 );
const even: number[] = arr.filter( v => v % 2 == 0 );
console.log(odd, event);
// 인덱스 반 이상 구하기
const half = arr.length / 2;
const overHalf: number[] = arr.filter( (v,i) => i >= half );
console.log(overHalf);
```

### map 메소드

```ts
배열.map(callback: (value: T, index?: number): Q): Q[]
```

### reduce 메소드

앞에서 구현한 fold 함수

```ts
배열.reduce(callback: (result: T, value: T), initValue: T): T
```

<br/>

## 5-4. 순수 함수와 배열

### 순수 함수란?

side-effect가 없는 수학적 의미의 함수. <=> 불순 함수

- 함수 안에서 입출력 관련 코드가 없을 것
- 함수 안에서 매개변수를 변경시키지 않을것
- 함수는 결과를 즉시 반환할 것?
- 함수 안에서 전역변수나 정적 변수를 사용하지 않을것
- 예외를 발생시키지 않을 것
- 콜백함수로 구현되거나, 안에서 콜백을 사용하는 코드가 없을것
- Promise와 같은 비동기 작업이 없을 것

### 타입 수정자 readonly

매개변수의 값을 변경하지 못하도록 지정하는 키워드 (순수 함수를 만들기 쉬워짐)

### 불변과 가변

const나 readonly를 명시하면 초기값을 계속 유지 == 불변

변수가 계속 변경 되지 않는다. (객체의 프로퍼티는 별개 문제)

### 깊은 복사와 얕은 복사

배열의 요소나 객체의 프로퍼티를 모두 고유하게 복사 == 깊은 복사

얕은 복사는 ref를 복사하여 값을 변화하면 같이 변경됨

### 전개 연산자와 깊은 복사

EXNext에서 전개 연산자를 사용하면 아주 쉽게 깊은 복사를 할 수 있음

### 배열의 sort 메소드를 순수 함수로 구현하기... (왜해야되냐고...)

```ts
const pureSort = <T>(arr: readonly T[]): T[] => {
  let deepCopied = [...arr];
  return deepCopied.sort(); // 성의없네?
}
```

### 배열의 filter 메소드로 순수한 삭제 구현하기

```ts
const pureDelete = <T>(arr: readonly T[],
  cb: (val: T, idx?: number) => boolean): T[] => arr.filter( (val, idx) => cb(val, idx) == false)
);
```

### 가변 인수 함수와 순수 함수

가변 인수 : 매개변수의 갯수가 가변적인 것

```ts
const mergeArray = <T>(...arrays: readonly T[][]): T[] => {}
```

순수함수를 고려하면 JS 배열이 제공하는 많은 메소드 사용은 포기 해야겠지만 전개 연산자 등을 활용하면 돌려서 쓸수 있다...


<br/>

## 5-5. 튜플 이해하기

배열과 달리 다른 타입의 데이터 뭉치 (TS만 제공하는 타입)

```ts
const tuple: [boolean, number] = [true, 1];
const tuple2: [string, number] = ["문자열", 0];
```

### 튜플에 타입 별칭 사용하기

일반적으로 튜플 이름을 지정해서 사용함

```ts
type ResultType = [boolean, string] ;

const doSomething = (): ResultType => {
  try {
    throw new Error("어떤 에러..");
  } catch (e) {
    return [false, e.message];
  }
}
```

### 튜플과 비구조화 할당

사용 가능

```ts
// 위에서 계속
const [result, errMessage] = doSomething();
console.log("result:", result);
console.log("errMessage:", errMessage);
```