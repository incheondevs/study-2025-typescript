# 반복기와 생성기

### 실습 프로젝트 설정

```text
npm init -y
npm i -D typescript ts-node @types/node
mkdir src
```

추가로 `tsconfig.json` 파일을 생성하기 위해 아래의 명령어를 작성한다.

```text
npx tsc --init
```

# 반복기와 반복기 제공자

for..of 와 for..in 구문을 알아보자.

```typescript
const numArray: number[] = [1, 2, 3, 4, 5];
for (let value of numArray) {
  console.log(value);
}

const strArray: string[] = ['hello', 'world', '!'];
for (let value of strArray) {
  console.log(value);
}
```

for..of 구문은 다른 프로그래밍 언어에서도 반복기라는 주제로 흔히 찾아볼 수 있다. 반복기는 다음과 같은 특징이 있다.

1. next 라는 이름의 메서드를 제공한다.
2. next 메서드는 value 와 done 이라는 두 개의 속성을 가진 객체를 반환한다.

다음 코드에서 CreateRangeIterable 함수는 next 메서드가 있는 객체를 반환하므로 이 함수는 반복기를 제공하는 역할을 한다.

```typescript
export const createRangeIterable = (from: number, to: number) => {
  let currentValue = from;
  return {
    next() {
      const value = currentValue < to ? currentValue++ : undefined;
      const done = value == undefined;
      return { value, done };
    }
  }
}
```

이 코드를 사용해보자.

```typescript
import { createRangeIterable } from './rangeIterable';
const iterable = createRangeIterable(1, 3, + 1);
while(true) {
  const { value, done } = iterable.next();
  if (done) break;
  console.log(value);
}
```

2행에서 createRangeIterable 함수를 import 하고 3행에서 반복기를 생성한다. 4행부터 8행까지 반복기를 사용하는 코드이다.

while 문에서 done 값을 true 로 반환할때까지 iterator 변수의 next 메서드를 반복 호출하면서 반복기 제공자가 제공하는 value 값을 얻는다.

### 반복기는 왜 필요한가?

앞 코드의 실행 결과는 1부터 3까지 정수를 출력한다. 즉 iterator.next 메서드가 반복 호출될 때마다 다른 값이 출력된다. 반복기 제공자가 생성한 값 1,2,3 을 배열에 담아서 출력하지 않고,

마치 for 문을 돌면서 값을 콘솔 출력문으로 찍어낸 듯한 모습이다. 반복기 제공자는 이처럼 **어떤 범위의 값을 한꺼번에 생성해서 배열에 담지 않고 값이 필요할 때만 생성한다.**

```typescript
export const range = (from, to) => from < to ? [from, ...range(from + 1, to)] : [];
```

이 코드는 값이 필요한 시점에 생성하지만, range 함수는 값이 필요한 시점보다 이전에 미리 생성한다는 것의 차이가 있다. 

따라서 시스템 메모리의 효율성이라는 관점에서 보면 `createRangeIterable` 함수가 더 효율적이다.

### for..of 구문과 [Symbol.iterator] 메서드

5장에서 살펴본 range 함수는 for..of 구문의 of 뒤에 올 수 있다.

```typescript
import { range } from './range';

for (let value of range(1, 4)) {
  console.log(value); // 1, 2, 3
}
```

그러나 다음 코드처럼 앞에서 작성한 createRangeIterable 함수를 for..of 구문에 적용하면 `TypeError: iterable is not iterable` 오류가 발생한다.

```typescript
import { createRangeIterable } from './rangeIterable';
const iterable = createRangeIterable(1, 3+1);
for (let value of iterable) {
  console.log(value);
}
```

이 오류는 createRangeIterable 함수가 반복기 제공자이지 반복기가 아니기 때문에 발생한다. 따라서 createRangeIterable 함수를 반복기로 사용하려면 [Symbol.iterator] 메서드를 구현해야 한다.

```typescript
export const createRangeIterable = (from: number, to: number) => ({
  [Symbol.iterator]() {
    let currentValue = from;
    return {
      next() {
        const value = currentValue < to ? currentValue++ : undefined;
        const done = value == undefined;
        return { value, done };
      }
    }
  }
});
```

이제 createRangeIterable 함수는 반복기가 되었다. 따라서 for..of 구문에 사용할 수 있다.

RangeIterable 클래스로 만들어서 구현해볼 수도 있다.

```typescript
export class RangeIterable {
  
  constructor(public from: number, public to: number) {}
  
  [Symbol.iterator]() {
    const that = this;
    let currentValue = that.from;
    return {
      next() {
        const value = currentValue < that.to ? currentValue++ : undefined;
        const done = value == undefined;
        return { value, done };
      }
    }
  }
}
```

> 클래스의 메서드도 function 키워드로 만들어지는 함수다
> 
> 클래스의 메서드는 자바스크립트의 function 키워드가 생략되었을 뿐 사실상 Function 키워드로 만들어지는 함수다. 그런데 function 키워드로 만들어지는 함수는 내부에서 this 를 사용할 수 있다.
> RangeIterable.ts 코드에서 4행이 this 값을 that 변수에 담고 있는데, 이것은 8행의 that.to 부분을 위한 것이다. 이것은 next 함수 또한 function 키워드가 생략된 메서드이므로,
> 컴파일러가 next 의 this 로 해석하지 않게 하는 자바스크립트의 유명한 코드 트릭이다.

createRangeIterable 함수와 달리 RangeIterable 클래스는 다음 코드에서 보듯 range 함수처럼 for..of 구문의 of 뒤에 올 수 있다.

```typescript
import { RangeIterable } from './RangeIterable';

const iterator = new RangeIterable(1, 4);

for (let value of iterator) {
  console.log(value); // 1, 2, 3
}
```

### Iterable<T> 와 Iterator<T> 인터페이스

타입스크립트는 반복기 제공자에 Iterable<T> 와 Iterator<T> 제네릭 인터페이스를 사용할 수 있다. Iterable<T> 는 다음처럼 자신을 구현하는 클래스가 [Symbol.iterator] 메서드를 제공한다는 것을

명확히 알려주는 역할을 한다.

```typescript
class Example implements Iterable<any> {}
```

또한, Iterator<T> 는 반복기가 생성할 값의 타입을 명확하게 해준다.

```typescript
class Example implements Iterator<number> {
  [Symbol.iterator](): Iterator<number> {
    return this;
  }
}
```

다음 코드는 반복기 제공자를 타입스크립트가 제공하는 Iterable<T> 와 Iterator<T> 를 사용하여 구현한 예이다.

```typescript
export class StringIterator implements Iterable<string> {
    constructor(private strings: string[] = [], private currentIndex: number = 0) {}
    
    [Symbol.iterator](): Iterator<string> {
        const that = this;
        let currentIndex = that.currentIndex;
        let length = that.strings.length;
    
        const iterator: Iterator<string> = {
            next(): { value: string, done: boolean } {
                const value = currentIndex < length ? that.strings[currentIndex++] : undefined;
                const done = value == undefined;
                return { value, done };
            }
        };
        
        return iterator;
    }
}
```

위 코드를 사용해보자:

```typescript
import { StringIterator } from './StringIterator';

const iterator = new StringIterator(['hello', 'world', '!', 'bye']);

for (let value of iterator) {
    console.log(value); // hello, world, !, bye
}
```

# 생성기 이해하기

ESNext 자바스크립트와 타입스크립트는 yield 키워드를 제공한다. yield 키워드는 함수를 중간에 멈추고 값을 반환할 수 있게 한다.

yield 는 반드시 function* 키워드를 사용한 함수에서만 호출할 수 있다. 이렇게 function* 키워드로 만든 함수를 생성기(generator)라고 한다.

다음 src/generator.ts 파일의 1행은 function* 키워드로 만든 generator 함수가 있다.

generator 함수의 몸통은 5행에서 yield 문을 3회 반복해서 호출하도록 구현되어있다.

```typescript
export function* generator() {
  console.log('generator started...');
  let value = 1;
  while (value < 4) {
    yield value++;
    console.log('generator finished...');  
  }
}
```

제네레이터 함수를 사용해보자.

```typescript
import { generator } from './generator';

for (let value of generator()) {
  console.log(value); // generator started.. 1, 2, 3, generator finished...
}
```

### setInterval 함수와 생성기의 유사성

생성기가 동작하는 방식을 세미 코루틴이라고 한다. 세미 코루틴은 타입스크립트처럼 단일 스레드로 동작하는 프로그래밍 언어가 마치 다중스레드로 동작하는 것처럼 보이게 하는 기능이다.

이제 자바스크립트가 기본으로 제공하는 setInterval 함수를 사용해 세미 코루틴의 동작 방식을 알아보자.

setInterval 함수는 지정한 주기로 콜백 함수를 계속 호출한다.

```typescript
const intervalId = setInterval(callback, timeout);
```

위 코드를 멈추려면 clearInterval 함수를 사용한다.

```typescript
clearInterval(intervalId);
```

다음 코드는 setInterval 함수를 사용해 1초 간격으로 1,2,3 을 출력하는 예이다.

```typescript
const period = 1000;
let count = 0;
console.log('interval started...');
const id = setInterval(() => {
  console.log('program started...');
  if (count >= 3 ) {
    clearInterval(id);
    console.log('interval finished...');
  }
  else {
    console.log(++count);
  }
}, period);
```

프로그램 출력 내용만 보면 앞에서 살펴본 생성기 방식과 구분할 수 없을정도로 유사하다. 그런데 setInterval 함수가 동작하는 구조는 C++ 언어의 thread 가 동작하는 방식과 흡사한 면이 있다.

즉 Program started 를 출력하고 setInterval 함수가 호출되면서 콜백 함수가 실행되는 것은 마치 다중 스레드가 동작하는 것처럼 보인다.

즉, program started.. 를 출력하고 setInterval 의 콜백 함수는 작업 스레드를 떠올리게 한다.

생성기는 이처럼 일반적인 타입스크립트 코드와는 좀 다른 방식으로 동작한다는 것을 기억하면서 생성기 구문을 이해하기 바란다.

> 세미 코루틴과 코루틴의 차이
> 
> 메모리나 CPU 를 제작할 때 사용하는 소자를 반도체라고 한다. 여기서 반도체란 전기를 절반만 통과시키는 도체라는 것을 의미한다. 즉 '반'은 '반대'의 의미가 아니라 절반(Semi)의 의미다.
> 
> 학문적으로 생성기를 세미 코루틴이라고 한다. 즉 생성기는 절반만 코루틴인 것이다. 코루틴은 1958년부터 많은 학자가 꾸준히 연구해 온 학문적인 주제이다. 클로저(Clojure)는 코루틴을 최초로 구현한 언어 중 하나이다.
> 구글에서 만든 Go 언어는 고루틴이라는 용어를 사용하지만 고루틴 또한 코루틴이다.
> 코루틴은 애플리케이션 레벨의 스레드이다. 스레드는 원래 운영체제가 제공하는 개수가 제한된 서비스이다. 스레드 개수가 2000개 정도로 제한되었으므로 특정 애플리케이션에서 운영체제의 스레드를 과다하게 소비하면 운영체제에 무리를 주게 된다.
> 이것이 코루틴을 연구하기 시작한 이유이다. 운영체제에 부담을 주지 않으면서 애플리케이션에서 스레드를 마음껏 쓸 수 있게 하는 것이 코루틴의 목적이다.
> 그런데 코루틴은 스레드이므로 일정 주기에 따라 자동으로 반복해서 실행된다. 반면에 생성기는 절반만 코루틴이다. 즉 반복해서 실행할 수 있지만 자동으로 실행되지 못하는 코루틴이다.
> 앞으로 배우면서 알게 되겠지만 생성기는 사용하는 쪽 코드에서 생성기가 만들어 준 반복자의 next 메서드가 호출될 때만 한번 실행된다. 만약 next 메서드가 while 문에서 반복해서 실행된다면 생성기는 next 호출 때 한번 실행되고 곧바로 멈춘다.
> 이처럼 생성기는 자동으로 반복 실행되지 않으므로 세미 코루틴이라고 한다.

### function* 키워드

앞에서 본 Generator 함수와는 지금까지 본 함수와 비교했을 때 두 가지 차이가 있다.

1. function* 키워드로 시작한다.
2. yield 키워드를 사용한다.

즉, function* 키워드로 선언된 함수가 생성기인데, 생성기는 오직 function* 키워드로 선언해야 하므로 화살표 함수로는 생성기를 만들 수 없다.

생성기는 반복기를 제공하는 반복기 제공자로서 동작하게 된다.

> function* 은 키워드다.
> 
> 생성기는 function* 키워드를 사용해 만드는 조금 다른 형태의 함수이다. 여기서 주의할 점은 function 키워드에 * 를 붙인 것이 아니라 function* 이 키워드이다.
> 
> 따라서 function 키워드를 사용하지 않는 화살표 함수 형태로는 생성기를 만들 수 없다. 참고로 function 과 별표(*) 사이에 공백은 없어도 되고 여러 개 있어도 상관 없다.

### yield 키워드

생성기 함수 안에서는 yield 를 사용할 수 있다. yield 는 연산자(operator) 형태로 동작하며 다음처럼 두 가지 기능을 한다.

1. 반복기를 자동으로 만들어준다.
2. 반복기 제공자 역할도 수행한다.

이제 function* 키워드를 이용해 생성기 형태로 rangeGenerator 라는 이름의 함수를 만들어보자.

```typescript
export function* rangeGenerator(from: number, to: number) {
  while (from < to) {
    yield from++;
  }
}
```

만든 함수를 테스트해보자

```typescript
import { rangeGenerator } from './rangeGenerator';

let iterator = rangeGenerator(1, 4);
while (true) {
  const { value, done } = iterator.next();
  if (done) break;
  console.log(value);
}

// for..of 구문을 사용해도 된다.
for (let value of rangeGenerator(1, 4)) {
  console.log(value);
}
```

### 반복기 제공자의 메서드로 동작하는 생성기 구현

이전에 StringIterable 클래스로 반복기 제공자를 구현했다. 그런데 생성기는 반복기를 제공하는 반복기 제공자로서 동작하므로 생성기를 사용하면 StringIterable 클래스를 다음처럼 간결하게 구현할 수 있다.

```typescript
export class IterableUsingGenerator<T> implements Iterable<T> {
  
  constructor(private values: T[] = [], private currentIndex: number = 0) {}

  [Symbol.iterator] = function* () {
    while (this.currentIndex < this.values.length) {
      yield this.values[this.currentIndex++];
    }
  }
}
```

코드에서 3행을 function* [Symbol.iterator]() 형식으로 구현할 수는 없다.

생성기를 클래스 메서드의 몸통이 되게 하려면 반드시 [Symbol.iterator] = function* () {} 형식으로 구현해야 한다.

다음 코드는 이전에 제공한 StringIterable 클래스를 IterableUsingGenerator 클래스로 대체한 예이다.

```typescript
import { IterableUsingGenerator } from './IterableUsingGenerator';

for(let item of new IterableUsingGenerator([1, 2, 3])) {
  console.log(item);
}

for (let item of new IterableUsingGenerator(['hello', 'world', '!'])) {
  console.log(item);
}
```

### yield* 키워드

타입스크립트는 yield* 키워드를 제공한다. yield 키워드는 단순히 값을 대상으로 동작하지만 yield* 는 다른 생성기나 배열을 대상으로 동작한다.

다음 코드는 yield* 키워드를 사용해 다른 생성기를 대상으로 동작하는 예이다.

```typescript
function* gen12() {
  yield 1;
  yield 2;
}

function* gen12345() {
  yield* gen12();
  yield 3;
  yield 4;
  yield 5;
}
```

다음 코드에서 6행의 gen12345 함수는 1, 2, 3, 4, 5 등 다섯 개의 값을 생성하는 생성기이다.

그런데 이 생성기는 또 다른 생성기인 gen12 함수를 yield* 키워드로 호출해 값 1과 2를 생성하고 3과 4는 배열에 든 값을, 마지막 5는 단순히 yield 키워드로 생성한다.

02, 03, 09행에서 yield 의 피연산자(1,2,5)와 07, 08행에서 yield* 의 피연산자를 비교하면 둘의 차이가 확연히 느껴진다.

다음 코드는 1부터 5까지 수를 출력하는데, 이로부터 yield* 의 동작 방식을 이해할 수 있다.

```typescript
import { gen12345 } from './yield-star';

for (let value of gen12345()) {
  console.log(value); // 1 2 3 4 5
}
```

위 코드는 3행에서 gen12345 함수를 호출하므로 yield-star.ts 의 7행이 호출되고, yield* 구문에 의해 다시 01행의 함수 gen12 가 호출되어 2행의 yield 문이 값 1을 생성한다.

그리고 이 상태로 코드는 정지한다.

그리고 다시 for 문에 의해 yield-star.ts 의 7행이 호출되고, 2행에서 정지가 풀리면서 3행에 의해 값 2를 생성하고 다시 코드 진행을 멈춘다. 이후 다시 7행이 실행되지만 gen12 함수에는 더 이상 yield 문이 없으므로 8행이 실행되고 

배열에 담긴 값 3을 생성하고 다시 멈춘다. 그리고 for 문에 의해 8행이 다시 실행되면 이번엔 값 4를 생성하고 멈춘다.

그리고 최종으로 값 5가 생성되면 for 문이 종료되어 프로그램이 끝난다.

### yield 반환값

yield 키워드는 값을 반환할 수 있다. 다음 코드는 yield 연산자의 반환값을 select 라는 변수에 저장한다.

```typescript
export function* gen() {
  let count = 5;
  let select = 0;
  while (count--) {
    select = yield count;
  }
  return select;
}
export const random = (max, min=0) => Math.round(Math.random() * (max - min) + min);
```

yield 연산자의 반환값은 반복기의 next 메서드 호출때 매개변수에 전달하는 값이다. 다음 테스트 코드에서 4행은 next 메서드 호출 때 난수를 생성해 전달한다.

```typescript
import { gen, random } from './yield-return';

const iter = gen();
for (let value of iter) {
  console.log(value);
  if (value === 2) {
    console.log(iter.next(random(10, 1)).value);
  }
}
```

코드를 실행하면 첫 줄 외에 다른 줄은 모두 난수가 출력된다. 첫 줄은 항상 'you select 0' 이 출력되는데 이는 3행에서 select 변수를 0으로 설정했기 때문이다.

실행 결과는 이전에 next 메서드가 전달한 값이 다시 gen 함수의 내부 로직에 의해 현재의 value 값이 되어 출력된다.

> 예홍썜의 한마디
> 
> 이번 장에서 설명한 내용은 함수형 프로그래밍보다도 동시성 프로그래밍의 영역에 더 가깝다.
> 스칼라와 같은 언어는 스트림이라는 타입을 이용해 5장에서 설명한 선언형 프로그래밍 스타일로 생성기를 동작시킬 수 있다.
> 하지만 타입스크립트는 스트림이라는 기능을 제공하지 않으므로 생성기를 명령형 방식의 코드로만 작성할 수 있다.
> 즉 타입스크립트 언어만의 관점에서 생성기는 함수형 프로그래밍의 영역은 아니다.
> 하지만 12장에서 보듯 생성기를 구현할 때 함수형 프로그래밍이 사용될 수 있다.