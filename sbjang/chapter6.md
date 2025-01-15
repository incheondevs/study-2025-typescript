# 6. 반복기와 생성기

## 6-1. Iterator(반복기) 이해하기

### Iterator(반복기)와 Iterable(반복기 제공자)

반복기의 특징: next라는 이름의 메소드를 재공하며, 이 메소드는 value / done 두가지 속성을 가진 객체를 반환

```ts
// Iterator의 원리 예제
const createRangeIterable = (from: number, to: number) => {
  let curValue = from;
  return {
    next() {
      const value = curValue < to ? curValue++ : undefined ;
      const done = value == undefined ;
      return { value, done };
    }
  }
}

const iterator = createRangeIterable(1, 3+1);
while(true) {
  const { value, done } = iterator.next();
  if (done) break;
  console.log(value);
}
```

iterator의 next를 반복 호출하여 반복을 수행함.

### Iterator(반복기)는 왜 필요한가?

Iterator(반복기)를 사용한 반복이 시스템 메모리를 효율적으로 사용할 확률이 높다.

### for..of 구문과 [Symbol.iterator] 메소드

Iterator(반복기)를 사용하려면 사용하려는 대상 객체에 `[Symbol.iterator]` 메소드가 구현되어 있어야 한다.

### Iterable<T>와 Iterator<T> 인터페이스

타입스크립트의 terable 객체에는 위 두가지 인터페이스를 사용 가능

```ts
class 반복기제공객체 implements Iterable<타입T> {
  // ...
  [Symbol.iterator](): Iterator<타입T> {
    // ...    
  }
}
```

### 문자열 반복기 예제

```ts
class StrIerable implements Iterable<string> {
  construtor(private strArr: string[] = [], private curIdx: number = 0) {}

  [Symbol.iterator](): Iterator<string> {
    const that = this;
    let curIdx = that.curIdx, length = that.strArr.length;

    const iterator: Iterator<string> = {
      next(): {value: string, done: boolen} {
        const value = curIdx < length ? that.strArr[curIdx++] : undefined ;
        const done = value == undefined ;
        return { value, done };
      }
    }
    return iterator;
  }
}
```

<br/>

## 6-2. Generator(생성기) 이해하기

ESNext와 TS에서는 yield 키워드를 제공.

function* 키워드를 사용한 만든 함수에서만 yield 키워드를 사용하고, 이렇게 만들어진 함수를 generator 라고 함.

```ts 
function* generator() {
  console.log("시작..");
  let val = 1;
  while (val < 4)
    yield val++;
  console.log("끝..");
}

for(let val of generator()) 
  console.log(val);
```

### setInterval 함수와 생성기의 유사성

세미 코루틴 : 단일 스레드로 동작하는 언어가 멀티 스레드로 동작하는것 처럼 보이는 기능

// TODO : 보완하기

| (MEMO) 세미 코루틴과 코루틴의 차이

### function* 키워드

function과 다른 generator를 생성하는 다른 키워드다. (C처럼 포인터를 의미하지는 않는다)

화살표 함수로는 선언 불가능

띄워쓰기 상관 없지만.. (암묵적으로 바로뒤에 *을 붙이는 방법으로 통일해 사용)

### yield 키워드

반복기를 자동으로 만들어주며, 반복자 제공자 역할을 수행

연산자로 취급된다.

### 반복기 제공자의 메소드로 동작하는 생성기 구현

앞의 문자열 반복기 예제를 generator를 사용하면 간결하게 구현 가능하다.

```ts
class IterableUsingGenerator<T> implements Iterable<T> {
  constructor(private values: T[] = [], private curIdx: number = 0) {}

  [Symbol.iterator] = function* () { // 생성기로 할때는 이런 형식으로만 사용 가능
    while(this.curIdx < this.values.length)
      yield this.values[this.curIdx++] ;
  }
}

for(let item of IterableUsingGenerator([1, 2, 3]))
  console.log(item);

for(let item of IterableUsingGenerator(["a", "b", "c"]))
  console.log(item);
```

### yield* 키워드

TS에서는 사용 가능한 키워드. yield는 단순값에만 사용 가능하지만, yield*는 배열이나 다른 생성기에 대해서도 동작합니다.

```ts
function* innerGen() {
  yield 3;
  yield 4;
} 
function* gen123() {
  yield* [1,2];
  yield* innerGen();
  yield 5;
}

for(let item of gen123()) 
  console.log(item)
```

### yield 반환값

yield의 반환값은 generator의 next메소드 호출시 매개 변수에 전달하는 값 (키워드 뒤의 값이 아님)

```ts
function* gen() {
  let count = 5, select = 0;
  while(count--)
    select = yield `select값: ${ select }`;
}
const rand = (max, min=0) => Math.round(Math.random() * (max-mmn)) + mmn ;

const iter = gen();
while(true) {
  const {value, done} = iter.next(rand(10, 1));
  if(done) break;
  console.log(value);
}
```