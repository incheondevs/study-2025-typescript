# Chapter 06. Iterator & Generator

## 1. Iterator
타입스크립트에서 Iterator와 Generator를 사용하기 위해서는 `tsconfig.json`의 `downlevelIteration` 설정을 true로 해야 한다.
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "esModuleInterop": true,
    "target": "ES2015",
    "moduleResolution": "node",
    "outDir": "dist",
    "baseUrl": ".",
    "sourceMap": true,
    "downlevelIteration": true,
    "strict": true,
    "noImplicitThis": false,
    "paths": { "*": ["node_modules/*"] }
  },
  "include": ["src/**/*"]
}
```

### 2. Iterator (반복기)와 Iterable (반복기 제공자)

#### 2.1. for...of 기본 사용
가장 기본적인 for...of 사용 예시

```typescript
const numArray: number[] = [1, 2, 3]
for (let value of numArray) {
    console.log(value)  //  1 2 3
}

const strArray: string[] = ['a', 'b', 'c']
for (let value of strArray) {
    console.log(value)  // a b c
}
```

#### 2.2. Iterator의 구현
Iterator는 다음 특징을 가진 객체이다.
1. next() 메서드 제공
2. next() 메서드는 value와 done 두 속성을 가진 객체를 반환

#### 반복기 제공자 (Iterable)
아래 createRangeIterable 함수는 'next()' 메서드를 제공하여 Iterable(반복기 제공자) 역할을 한다.

```typescript
const createRangeIterable = (from: number, to: number) => {
  let currentValue = from
  return {
    next() {
      const value = currentValue < to ? currentValue++ : undefined
      const done = value == undefined
      return {value, done}
    }
  }
}

// 사용 예시
const iterator = createRangeIterable(1, 4)
while(true) {
  const {value, done} = iterator.next()
  if (done) break
  console.log(value)  // 1 2 3 출력
}
```

#### 2.3. Iterator의 장점
Iterator는 일반 반복문보다 메모리를 효율적으로 사용한다.
예를 들어, 아래의 range 함수는 모든 값을 미리 생성한다.

```typescript
const range = (from: number, to: number): number[] => 
  from < to ? [from, ...range(from+1, to)] : []
```

반면 Iterator는 필요한 값만 그때그때 생성하므로 메모리 효율성이 더 높다.


#### 2.4. `for...of` 구문과 `[Symbol.iterator]` 메서드

- 반복기 제공자는 `[Symbol.iterator]` 메서드를 구현해야 한다.
- for...of를 사용하기 위해서는 [Symbol.iterator] 메서드를 구현해야 한다.

```typescript
import { createRangeIterable } from "./createRangeIterable";

const iterator = createRangeIterable(1, 3 + 1);

for (let value of iterator) {
    console.log(value);  // 오류 발생
}
```
**오류**: `[Symbol.iterator]` 메서드가 없어서 `for...of`에서 사용할 수 없음.

아래처럼 `[Symbol.iterator]` 메서드를 구현한 `RangeIterable` 클래스를 사용해야 한다.

```typescript
export class RangeIterable {
    constructor(public from: number, public to: number) { }
    [Symbol.iterator]() {
        const that = this
        let currentValue = that.from
        return {
            next() {
                const value = currentValue < that.to ? currentValue++ : undefined
                const done = value == undefined
                return {value, done}
            }
        }
    }
}
```

사용 예시:
```typescript
import { RangeIterable } from "./RangeIterable";

const iterator = new RangeIterable(1, 3 + 1);

for (let value of iterator) {
    console.log(value);  // 1 2 3
}
```



#### 2-5. `Iterable<T>` 인터페이스와 `Iterator<T>` 인터페이스
타입스크립트는 두 가지 주요 인터페이스를 제공한다.

##### **`Iterable<T>` 인터페이스**
- `[Symbol.iterator]` 메서드를 제공

##### **`Iterator<T>` 인터페이스**
- 반복기가 생성할 값의 타입을 명확히 정의

```typescript
// `Iterable<T>` 와 `Iterator<T>` 인터페이스
export class StringIterable implements Iterable<string> {
    constructor(private strings: string[], private currentIndex: number = 0) { }
    [Symbol.iterator](): Iterator<string> {
        const that = this
        let currentIndex = that.currentIndex
        let length = that.strings.length

        const iterator: Iterator<string> = {
            next(): {value: any, done: boolean} {
                const value = currentIndex < length ? that.strings[currentIndex++] : undefined
                const done = value == undefined
                return {value, done}
            }
        }
        return iterator
    }
}
```

사용 예시:
```typescript
import { StringIterable } from "./StringIterable";

for (let value of new StringIterable(['hello', 'world', '!'])) {
    console.log(value);  // hello world !
}
```

## 3. Generator (생성기)

### 3.1. 기본 개념

**생성기 (Generator)**
- `function*` 키워드로 선언된 함수
- `yield` 키워드를 사용하여 값을 반환
- `for...of` 구문과 함께 사용할 수 있음

```typescript
export function* generator() {
    console.log('generator start..')
    let value: number = 1
    while(value < 4) {
        yield value++
    }
    console.log('generator end..')
}

for (let value of generator()) {
    console.log(value)
}

// 결과:
// genertor start..
// 1
// 2
// 3
// genertor end..
```

## 3.2. Generator와 setInterval 비교
- Generator는 세미코루틴(semi-coroutine) 방식으로 동작한다.
- setInterval과 비교 예시

```typescript
const period: number = 1000
let count: number = 0

console.log('start..')

const id = setInterval(() => {
    if (count >= 3) {
        clearInterval(id)
        console.log('end..')
    } else {
        console.log(++count)
    }
}, period)
```

출력
```
start..
1
2
3
end..
```

### 3.3. `yield` 키워드

```typescript
// `yield` 키워드
function* rangeGenerator(from: number, to: number) {
  let value: number = from;
  while (value < to) {
    yield value++;
  }
}
```

사용 예시
```typescript
let iterator = rangeGenerator(1, 3 + 1);

// while 패턴으로 동작하는 생성기
while (true) {
  const { value, done } = iterator.next();
  if (done) {
    break;
  }
  console.log(value);  // 1 2 3
}

// for... of 패턴으로 동작하는 생성기
for(let value of rangeGenerator(4, 6 + 1))
  console.log(value) // 4 5 6
```

## 3.4. Generator를 사용한 Iterable 구현
Generator를 사용하면 Iterable을 더 간단히 구현할 수 있다.

```typescript
class IterableUsingGenerator<T> implements Iterable<T> {
    constructor(private values: T[] = [], private currentIndex: number = 0) { }
    [Symbol.iterator] = function* () {
        while (this.currentIndex < this.values.length) {
            yield this.values[this.currentIndex++]
        }
    }
}

// 사용 예시
for (let item of new IterableUsingGenerator([1, 2, 3])) {
    console.log(item)   //  1 2 3
}

for (let item of new IterableUsingGenerator(['hello', 'world', '!'])) {
    console.log(item)   // hello world !
}
```

## 3.5. yield* 키워드
yield*는 다른 Generator나 배열의 값을 위임할 때 사용된다.

```typescript
function* gen12() {
    yield 1
    yield 2
}

function* gen12345() {
    yield* gen12()    // gen12()의 값들을 위임
    yield* [3,4]      // 배열의 값들을 위임
    yield 5
}

for (let value of gen12345()) {
    console.log(value)  // 1 2 3 4 5
}
```

동작 순서:
1. gen12345() 호출 시 gen12() 실행
2. gen12()에서 1 생성하고 정지
3. for문에 의해 다시 실행되어 2 생성하고 정지
4. yield* [3,4]에 의해 3 생성하고 정지
5. 다시 실행되어 4 생성하고 정지
6. 마지막으로 5 생성 후 종료

## 3.6. yield의 반환값 활용
yield는 값을 반환할 수 있다.

```typescript
function* gen() {
    let count: number = 5
    let select: number = 0
    while (count--) {
        select = yield `you select ${select}`
    }
}

const random = (max: number, min: number = 0) => 
    Math.round(Math.random() * (max-min)) + min

const iter = gen()
while (true) {
    const {value, done} = iter.next(random(10, 1))
    if (done) break
    console.log(value)
}

/*
you select 0
you select 4
you select 8
you select 10
you select 7
*/
```

이처럼 Generator는 복잡한 반복 로직을 단순화하고, 메모리를 효율적으로 사용하며, 비동기 코드를 동기 코드처럼 작성할 수 있게 해주는 강력한 기능을 제공한다.