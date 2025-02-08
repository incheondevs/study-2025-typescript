# 7. Promise와 async/await 구문

## 7-1. 비동기 콜백 함수

### 동기와 비동기 API

시스템 함수 중 파일 처리 관련 fs 패키지 (node.js)에서 readFile과 readFileSync를 제공

readFileSync 함수가 동기 버전인데, 이는 파일을 읽는 동안에는 프로그램의 실행이 잠시 멈춘다.

반면 비동기 함수 readFile은 프로그램의 실행을 멈추지 않고 파일을 읽는 처리를 진행한다.

### 단일 스레드와 비동기 API

자바스크립트 실행 엔진은 단일 스레드 이므로 동기 함수는 피하는 것이 좋음.

| MEMO: 스레드 - CPU에서 프로그램이 실행되는 최소 단위

동기 함수는 코드의 동작방식을 알기쉽게 해주지만 프로그램의 반응성을 떨어뜨림

### 콜백 지옥

콜백안에서 다른 비동기 함수를 사용하여 여러번 콜백이 중첩되다 보면 코드가 복잡한 형태로 얽힌 상태

<br/>

## 7-2. Promise 이해하기

비동기 처리를 쉽게 하기 위한 ES6에서 정식 채택된 클래스

```js
const promise = new Promise(콜백함수)
// 콜백함수 형태: (resolve, reject) => {}
```

타입 스크립트에서는 제네릭 타입을 사용하여

```ts
new Promise<T>((
    resolve: (sucessValue: T) => void,
    rejcet: (any) => void 
) => {
    // 코드 내용
})
```

### (콜백함수의 파라미터) resolve와 reject 함수

resolve 함수는 성공시 반환한 값을 담아 호출하면 되고, 

reject는 실패시에 에러를 담아 호출하면 된다.

Promise 객체는 비동기 적으로 수행되며 then, catch, finally 메소드를 이용해 성공/실패 처리를 한다.

### Promise.resolve 메소드

일반 값을 Promise 객체로 래핑할 수 있는 메소드

```ts
Promise.resolve(1) // promiese instance
    .then( (value: number) => console.log(value) ); // 1

Promise.resolve("문자열").then( (v: string) => console.log(v) );
Promise.resolve([1,2,3]).then( (v: number[]) => console.log(v) ); 
```

### Promise.rejcet 메소드

에러를 프로미스로 래핑하는 메소드

```ts
Promise.reject( new Error("새 오류") ).catch( (err: Error) => console.log(err.message) );
```

### then-체인

Promise 인스턴스의 then 메소드의 파라미터인 콜백함수는 값을 반환할 수 있음.

이 반환값이 다시 Promise라면 체이닝이 가능함

```ts
Promise.resolve(1).then( (value: number) => {
    console.log(value);
    return Promise.resolve("문자열");
}).then( (v: string) => {
    console.log(v);
    return Promise.reject( new Error("오류") );
}).then( (v: any) => {
    console.log(v);
}).catch( (err: Error) => {
    console.log(err.message);
});
```

### Promise.all 메소드

promise의 인스턴스 배열을 파라미터로 받아서 동시에 병렬적으로 수행하고

그 결과를 배열로 만들어 반한화는 메소드

단, 중간에 하나라도 오류가 발생하면 모든 프로미스 수행을 중지하고 reject가 호출됨

```ts
const getAllResolveResult = <T>(promises: Promise<T>[]) => Promise.all(promises);

getAllResolveResult([
    Promise.resolve(1),
    Promise.resolve(true),
]).then( value => console.log(value) );

getAllResolveResult([
    Promise.resolve(1),
    Promise.rejcet(new Error("오류")),
]).then( value => {
    console.log(value)
}).catch( (err: Error) => {
    console.log(err.message); 
});
```

### Promise.race 메소드

Promise.all 메소드 처럼 promise의 인스턴스 배열을 파라미터로 받아서 동시에 병렬적으로 수행하지만

가장 먼저 끝나는 promise 하나의 값만 반환되면 수행을 멈춘다.

오류가 발행하면 all 처럼 모두 멈추고 reject가 반환된다.

<br/>

## 7-3. async와 await 구문

ESNext와 TS에서는 Promise를 쉬운 코드 형태로 만들주는 문법을 제공

### await 키워드

Promise의 인스턴스 앞에 붙이면 resolve로 보내는 값을 반환

```ts
const value = await 프로미스
```

### async 함수 수정자

await 키워드는 혼자 사용될수 없고, async 키워드를 사용한 함수에서만 사용 가능함

```ts
async function asyncFunc() {
    const value = await Promise.resolve(1);
    console.log(value);
}
// 화살표 함수
const asyncArrowFunc = async () => {
    const value = await Promise.resolve(1);
    console.log(value);    
}
```

### async 함수의 두가지 성질

- 일반 함수처럼 사용 가능하다.
- Promise 객체로 사용이 가능하다.

```ts
/* 위에서 계속 */
// 일반 함수 처럼 사용
asyncFunc();
asyncArrowFunc();
// 프로미스 처럼 사용
asyncFunc().then( () => asyncArrowFunc() );
```

### async 함수가 반환하는 값의 의미

프로미스로 반환되기 때문에 값을 얻기 위해서는 then 메소드를 사용

### async 함수의 예외처리

오류 또한 reject 호출 처럼 동장하기 때문에 catch 메소드를 사용

```ts
const asyncErrFunc = async () => {
    throw new Error("오류");
}
asyncErrFunc.catch( (err: Error) => {
    console.log(err.message);
});
```

### async 함수와 Promise.all

(생략)... 딱히 둘의 특별한 상관 관계가 있는 예제 같지 않음