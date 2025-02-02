# Promise와 async/await 구문

## 7-1 비동기 콜백 함수 

### 동기와 비동기 

- **`동기(Synchronous)`** 
  - 한 번에 하나의 작업만 처리함.
  - 작업이 순차적으로 진행됨.
  - 이전 작업이 완료되기 전까지 다음 작업을 실행할 수 없음.

- **`비동기(Asynchronous)`** 
  - 작업을 동시에 처리할 수 있음.
  - 대기할 필요 없이 다른 작업을 실행함.

### 단일스레드와 비동기 API

자바스크립트는 단일 스레드로 동작한다.

`단일 스레드(Single-threaded)`는 하나의 실행 흐름만을 가진 프로세스를 의미한다. * 스레드는 cpu가 프로그램을 동작시키는 최소 단위다.
- 장점
  - 단순한 설계: 복잡한 동기화 문제를 피할 수 있음.
  - 자원 소모가 적음: 멀티스레드에 비해 메모리와 CPU 자원을 덜 사용함.
- 단점
  - 동시 작업 처리 불가 => 여러 작업을 동시에 처리해야 할 때 속도나 효율성에서 문제가 발생할 수 있음.

- 해결방법
  - 비동기 처리: 자바스크립트는 비동기 작업을 통해 백그라운드에서 작업을 처리

### readFileSync 와 readFile API

동기적 파일 읽기 `readFileSync`
```typescript
import { readFileSync } from "fs";
readFileSync(path:string): Buffer
```

비동기적 파일 읽기 `readFile`
```typescript
import { readFile } from "fs";
readFile('파일경로', 콜백함수: (error:Error,buffer: Buffer) => void)
```
  비동기 API의 콜백함수를 비동기 콜백 함수라고 한다. 비동기 콜백함수는 일반함수와 달리 api의 물리적인 동작결과 를 수신하는 목적으로만 사용한다.
  
사용예시
```typescript
import { readFile, readFileSync } from "fs";

// 동기 방식의 예
console.log("read package.json using synchronous api...");
const buffer: Buffer = readFileSync("./package.json");
console.log(buffer.toString());

// 비동기 방식의 예
readFile("./package.json", (error, buffer) => {
  if (error) {
    console.error("Failed to read package.json:", error);
    return;
  }
  console.log("read package.json using asynchronous api...");
  console.log(buffer.toString());
});
```


### 콜백 지옥
```typescript
readFile("file1.txt", (err, data1) => {
  if (err) throw err;
  readFile("file2.txt", (err, data2) => {
    if (err) throw err;
    readFile("file3.txt", (err, data3) => {
      if (err) throw err;
      console.log("모든 파일 읽기 완료!");
    });
  });
});
```
이처럼 복잡한 형태로 얽힌 콜백구조를 `콜백지옥`이라 표현한다. 

이러한 콜백 지옥에 빠진 코드를 좀더 다루기 쉬운 형태의 코드로 만들기 위해 고안된 것이 `Promise` 다.


## Promise 이해하기
`Promise`는 비동기 작업이 완료될 때까지 기다리고, 그 작업이 성공하거나 실패할 때 처리할 수 있는 결과를 반환하는 클래스 로 사용하기 위해선 new 연산자를 적용해 프로미스 객체를 만들어야한다.

```ts
const promise = new Promise(콜백함수)
```
타입스크립트에서 `Promise` 는 제네릭 클래스 형태로 사용한다.
```ts
const numPromise: Promise<number> = new Promise<number>(콜백함수)
const numPromise: Promise<string> = new Promise<string>(콜백함수)
const numPromise: Promise<[]> = new Promise<[]>(콜백함수)
```
### resolve와 reject 함수
resolve 함수를 호출한 값은 .then 메서드의 콜백함수에 전달되고 reject 함수를 호출한 값은 catch 메서드의 콜백함수 쪽에 전달 된다. 
```ts
const promise: Promise<string> = new Promise<string>((resolve, reject) => {
  const success = true;
  if (success) {
    resolve("작업 성공");
  } else {
    reject("작업 실패");
  }
});

promise
  .then((result: string) => console.log(result))  // result는 string 타입 - 작업 성공
  .catch((error: string) => console.log(error));  // error는 string 타입 - 작업 실패
  .finally(()=> console.log('프로그램 종료')) // 가장 마지막에 호출된다.
```
### Promise.resolve 와 Promise.reject 메서드
이 두 메서드는 Promise 객체의 각각 resolve,reject 함수를 클래스 메서드로 구현한 것이다.

`Promise.resolve()`는 이행된 상태의 Promise 객체를 반환
```ts
const promise: Promise<string> = Promise.resolve('작업성공');
promise.then(value => console.log(value)); // 작업 성공
```
`Promise.reject()`는 거부된 상태의 Promise 객체를 반환
```ts
const promise: Promise<string> = Promise.reject('작업실패');
promise.catch(error => console.log(error)); // 작업 실패
```
### then-체인
`then()` 메서드를 사용하여 비동기 작업을 순차적으로 처리할 수 있다.
```ts
const promise: Promise<number> = new Promise((resolve, reject) => {
  resolve(10);
});

promise
  .then((value:number) => {
    console.log(value);  // 10
    return value + 5;  // 숫자 타입이 반환됨
  })
  .then(value => {
    console.log(value);  // 15
  })
  .catch(error => {
    console.error(error);
  });
```

### Promise.all() 메서드
Promise.all() 메서드는 모두 이행되었을때 그 결과를 반환한다. 
하나라도 거절 객체가 발생하면 거절값을 담은 Promise.reject 값을 반환한다. 

```ts
const promise1: Promise<string> = Promise.resolve("첫 번째");
const promise2: Promise<number> = Promise.resolve(2);

Promise.all([promise1, promise2])
  .then(([result1, result2]) => {
    console.log(result1);  // "첫 번째"
    console.log(result2);  // 2
  })
  .catch(error => console.error(error));
```

### Promise.race() 메서드

Promise.race() 프로미스 객체중 하나라도 해소되면 이 값을 담은 Promise.resolve 객체를 반환한다.
```ts
const promise1: Promise<string> = new Promise(resolve => setTimeout(resolve, 500, "첫 번째"));
const promise2: Promise<string> = new Promise(resolve => setTimeout(resolve, 100, "두 번째"));

Promise.race([promise1, promise2])
  .then(result => {
    console.log(result);  // "두 번째" (100ms 후에 완료됨)
  })
  .catch(error => console.log(error));
```

## async와 await 구문