# 제네릭 프로그래밍

### 제네릭 타입 이해하기

제네릭 타입은 인터페이스나 클래스, 함수, 타입 별칭 등에 사용할 수 있는 기능으로 해당 심벌의 타입을 미리 지정하지 않고 다양한 타입에 대으앟려고 할 때 사용한다.

다음은 각 심벌에 제네릭 타입을 지정한 예이다.

어떤 인터페이스가 value 라는 이름의 속성을 가질 때 속성의 타입을 다음처럼 string, number 등으로 특정하지 않고 T 로 지정해 제네릭 타입으로 만들 수 있다.

이때 인터페이스 이름 뒤에 <T> 처럼 표기한다.

```typescript
interface Value<T> {
    value: T;
}
```

다음은 클래스와 함수 타입 별칭에 각각 제네릭 타입을 사용하는 예를 보여준다.

```typescript
function identity<T>(arg: T): T { return arg; }

type IValueable<T> = {
  value: T;
}

class Valueable<T> {
  constructor(public value: T) {}
}
```

##### 제네릭 사용하기

이제 실습을 위해 다음과 같은 제네릭 인터페이스를 정의한다.

```typescript
export interface IValueable<T> {
  value: T;
}
```

제네릭 인터페이스 IValuable<T> 를 구현하는 제네릭 클래스는 자신이 가진 타입 변수 T 를 다음 3행에서 보는 방식으로 인터페이스 쪽 제네릭 타입 변수로 넘길 수 있다.

```typescript
import { IValueable } from './IValueable';

export class Valuable<T> implements IValueable<T> {
  constructor(public value: T) {}
}

export { IValueable };
```

이제 앞에서 정의한 IValuable<T>, Valuable<T> 클래스를 사용하는 코드를 작성한다.

```typescript
import { IValueable, Valuable } from './Valuable';

export const printValue = <T>(o: IValueable<T>): void => console.log(o.value);

export { IValueable, Valueable };
```

정의한 함수를 사용해보자.

```typescript
import { IValueable, Valuable, printValue } from './Valuable';

printValue(new Valuable<number>(1));
printValue(new Valuable<string>('TypeScript'));
printValue(new Valuable<boolean>(true));
printValue(new Valuable<number[]>([1, 2, 3]));
```

### 제네릭 타입 제약

프로그래밍 언어에서 제네릭 타입 제약(generic type constraint)는 타입 변수에 적용할 수 있는 타입의 범위를 한정하는 기능을 한다.

타입스크립트에서 제네릭 함수의 타입을 제한하고 싶을 때는 다음 구문을 사용한다.

```text
<최종타입1 extends 타입1, 최종타입2 extends 타입2>(a: 최종타입1, b: 최종타입2) {}
```

그런데 다음 printValueT 함수는 10-1절의 printValue 와는 구현 방식이 조금 다르게 제네릭 타입 제약 구문을 사용해 구현하고 있다.

```typescript
import { IValueable } from './IValueable';

export const printValueT = <Q, T extends IValueable<Q>>(o: T): void => console.log(o.value);

export { IValueable };
```

printValue 와 사용법은 같지만 매개변수 타입을 어떤 방식으로 제약하느냐만 다를 뿐이다.

```typescript
import { IValueable, Valuable, printValueT } from './Valuable';

printValueT(new Valuable<number>(1));
printValueT(new Valuable<string>('TypeScript'));
```

##### new 타입 제약

프로그래밍 분야에서 팩토리 함수는 new 연산자를 사용해 객체를 생성하는 기능을 하는 함수를 의미한다. 

보통 팩토리 함수는 객체를 생성하는 방법이 지나치게 복잡할 때 이를 단순화하려는 목적으로 구현한다.

다음 코드에서 create 함수의 매개변수 type 은 실제로는 타입이다. 따라서 type 변수의 타입 주석으로 명시한 T 는 타입의 타입에 해당한다.

```typescript
export const create = <T>(type: { new(): T }): T => new type();
```

그런데 타입스크립트 컴파일러는 타입의 타입을 허용하지 않으므로 다음과 같은 오류 메세지가 발생한다.

```text
This expression is not constructable. Type 'T' has no construct signatures.
```

타입스크립트 언어의 창시자인 아네르스 하일스베르는 C# 언어의 창시자이기도 하며, 다음 코드에서 { new(): T } 구문은 C# 에서 볼 수 있는 구문과 매우 유사하다.

하일스베르는 타입의 타입에 해당하는 구문을 만들어 내기보다 C# 언어에서의 구문을 빌려서 다음과 같은 타입스크립트 구문으로 만들었다.

```typescript
export const create = <T extends { new(): T }>(type: T): T => new type();
```

create 함수의 타입 제약 구문은 중괄호 {} 로 new() 부분을 감싸서 new() 부분을 메서드 형태로 표현했다. 이 구문은 다음처럼 중괄호를 없앤 좀 더 간결한 문법으로 표현할 수 있다.

결론적으로, { new (): T } 와 new() => T 는 같은 의미다. new 연산자를 type 에 적용하면서 type 의 생성자 쪽으로 매개변수를 전달해야 할 때 다음처럼 new(...args) 구문을 사용한다.

```typescript
const create = <T>(type: { new(...args): T }, ...args): T => new type(...args);
```

다음 코드는 타입스크립트(혹은 자바스크립트)가 기본으로 제공하는 클래스인 Date 와 이어서 나오는 create-test.ts 소스의 03행에 있는 Point 의 인스턴스를 { new(...args): T } 타입 제약을 설정한 create 함수로 생성하는 예이다.

```typescript
export const create = <T>(type: { new(...args): T }, ...args): T => new type(...args);
```

create 함수에 대한 테스트 코드를 실행해보면 앞 서 구현한 create 함수가 클래스의 인스턴스를 정상으로 생성하는 것을 확인할 수 있다.

```typescript
import { create } from './create';

class Point {
 constructor(public x: number, public y: number) {}
}
const exmaple = [create(Date), create(Point, 0, 0)];

example.forEach(i => console.log(i));
```

### 인덱스 타입 제약

가끔 객체의 일정 속성들만 추려서 좀 더 단순한 객체를 만들어야 할 때가 있습니다. 다음 코드에서 pick 함수는 네 개의 속성을 가진 obj 객체에서 name 과 age 두 속성만 추출해 간단한 형태로 만드려고 한다.

```typescript
const obj = { name : 'Jane', age: 22, city: 'Seoul', country: 'Korea' };
pick(obj, ['name', 'age']);
```

앞 코드에서 pick 함수는 다음처럼 구현할 수 있다.

```typescript
export const pick = (obj, keys) => keys.map(key => ({ [key]: obj[key] }))
  .reduce((result, value) => ({ ...result, ...value }), {});
```

pick 함수에 대한 다음 테스트 코드는 pick 함수가 obj 의 속성 중에서 name 과 age 속성과 값을 추출해 주는 것을 확인할 수 있다.

```typescript
import { pick } from './pick';

const obj = { name: 'Jane', age: 22, city: 'Seoul', country: 'Korea' };
console.log(
  pick(obj, ['name', 'age']), // { name: 'Jane', age: 22 }
  pick(obj, ['name', 'age', 'unknown']) // { name: 'Jane', age: 22, unknown: undefined }
);
```

만약 6행에서 ['nam', 'agge'] 처럼 오타가 발생하면 엉뚱한 결과가 나온다. 타입스크립트는 이러한 상황을 방지할 목적으로 다음처럼 keyof T 형태로 타입 제약을 서렂ㅇ할 수 있게 지원한다.

이것을 인덱스 타입 제약이라고 한다.

```text
<T, K extends keyof T>
```

다음 코드에서 pick 함수는 앞에서와 달리 obj 와 keys 매개변수에 각각 T 와 K 라는 타입 변수를 적용했다. 하지만 이 코드는 K 타입에 타입 제약을 설정하지 않았으므로 다음과 같은 오류가 발생한다.

```text
K 형식을 인덱스 형식 T 에 사용할 수 없다는 오류
```

이 오류 메세지를 해결하려면 타입 K 가 T 의 속성 이름(키)라는 것을 알려주어야 한다. 이때 타입스크립트의 인덱스 타입 제약(index type constraint)를 이용한다. keyof T 구문으로 타입 K 가 타입 T 의 속성 이름이라고

타입 제약을 설정한다.

다음 코드는 K 에 keyof T 타입 제약을 지정하는 방법이다.

```typescript
export const pick = <T, K extends keyof T>(obj: T, keys: k[]) =>
  keys
    .map(key => ({ [key]: obj[key] }))
    .reduce((result, value) => ({ ...result, ...value }), {});
```

이렇게 하면 컴파일을 해보지 않고도 앞에서 예로 든 nam, agg 와 같은 입력 오류를 코드 작성 시점에 탐지할 수 있다.

### 대수 데이터 타입

객체 지향 프로그래밍 언어에서 ADT 라는 용어는 추상 데이터 타입을 의미하지만, 함수형 언어에서는 대수 데이터 타입을 의미한다.

타입스크립트에서 대수 데이터 타입은 합집합 타입과 교집합 타입 두 가지 종류가 있다.

객체지향 언어들은 상속에 기반을 두고 타입을 분류하는 경향이 있지만, 상속에만 의존하면 true 와 false 라는 단 두 가지 값을 가지는 boolean 과 같은 타입을 만들기가 어렵다.

이 때문에 함수형 언어들은 상속에 의존하는 타입보다는 대수 데이터 타입을 선호한다.

##### 합집합 타입

합집합 타입은 또는(Or)의 의미인 '|' 기호로 다양한 타입을 연결해서 만든 타입을 의미한다. 다음 코드에서 변수 ns 의 타입인 NumberOrString 은 number 나 string 타입이므로, 1과 같은 수와 'hello' 와 같은 문자열을 모두 담을 수 있다.

```typescript
type NumberOrString = number | string;

let ns: NumberOrString = 1;

ns = 'hello';
```

##### 교집합 타입

교집합 타입은 이고(and) 의 의미인 '&' 기호로 다양한 타입을 연결해서 만든 타입을 의미한다. 교집합 타입의 대표적인 예는 두 개의 객체를 통합해서 새로운 객체를 만드는 것입니다.

다음 코드에서 01행 mergeObjects 함수는 이름이 말해주듯 타입 T 와 U 객체를 결합해 새로운 객체를 만드는 예이다. 타입 T 와 U 객체를 결합한 객체는 당연히 타입이 T & U 일 것이다.

이 때문에 mergeObjects<T, U> 의 반환 타입은 T & U 인 교집합 타입이다.

```typescript
export const mergeObjects = <T, U>(a: T, b: U): T & U => ({ ...a, ...b });
```

다음 테스트 코드는 INameable 타입 객체와 IAgeable 타입 객체를 mergeObjects 로 결합해 INameable & IAgeable 타입 변수 nameAndAge 에 저장한다.

```typescript
import { mergeObjects } from './mergeObjects';

type INameable = { name: string };
type IAgeable = { age: number };

const nameAndAge = mergeObjects({ name: 'Jane' }, { age: 22 });
console.log(nameAndAge); // { name: 'Jane', age: 22 }
```

##### 합집합 타입 구분하기

다음과 같은 인터페이스가 세 개 있다고 가정해 봅시다.

```typescript
interface ISquare { size: number }
interface IRectangle { width: number, height: number }
interface ICircle { radius: number }
```

이 인터페이스 타입으로 맏는 각각의 객체는 다음과 같다.

```typescript
const square: ISquare = { size: 100 };
const rectangle: IRectangle = { width: 100, height: 200 };
const circle: ICircle = { radius: 50 };
```

이 객체 모두를 받아서 면적(area)를 계산해주는 calcArea 라는 함수를 생각해볼 수 있다.

```typescript
console.log(calcArea(square), calcArea(rectangle), calcArea(circle)); // 10000
```

calcArea 함수가 앞 코드처럼 동작하려면 일단 매개변수의 타입은 ISquare 과 IRectangle, ICircle 의 합집합 타입인 IShape 이어야 한다.

```typescript
type IShape = ISquare | IRectangle | ICircle;

export const calcArea = (shape: IShape): number => {
    return 0;
}
```

그런데 문제는 shape 가 구체적으로 어떤 타입의 객체인지 구분할 수 없어서 계산하는 코드를 작성할 수 없다.

타입스크립트는 이런 문제를 해결할 수 있도록 합집합 타입의 각각을 구분할 수 있게 하는 식별 합집합(discriminated unions)이라는 구문을 제공한다.

##### 식별 합집합 구문

식별 합집합 구문을 사용하려면 합집합 타입을 구성하는 인터페이스들이 모두 똑같은 이름의 속성을 가지고 있어야 한다.

다음 코드에서 ISquare, IRectangle, ICircle 은 모두 tag 라는 이름의 공통 속성이 있다.

```typescript
export interface ISquare { tag: 'square', size: number }
export interface IRectangle { tag: 'rectangle', width: number, height: number }
export interface ICircle { tag: 'circle', radius: number }

export type IShape = ISquare | IRectangle | ICircle;
```

이와 같을 때 다음 area 함수의 switch 문을 보면 왜 식별 합집합이라는 구문이 있는지 알 수 있습니다.

IShape 는 ISquare, IRectangle, ICircle 중 하나이므로, 만약 tag 처럼 공통 속성이 없으면 각각의 타입을 구분할 방법이 없다.

```typescript
import { IShape } from './IShape';

export const calcArea = (shape: IShape): number => {
  switch(shape.tag) {
    case 'square': return shape.size * shape.size
    case 'rectangle': return shape.width * shape.height
    case 'circle': return Math.PI * shape.radius * shape.radius
  }
  
  return 0
}
```

다음 calcArea 테스트 코드는 calcArea 의 입력 매개변수들을 잘 식별해 각각을 적절하게 계산해준다.

```typescript
import { calcArea } from './calcArea';
import { IRectangle, ICircle, ISquare } from './IShape';

const square: ISquare = { tag: 'square', size: 10 }
const rectangle: IRectangle = { tag: 'rectangle', width: 4, height: 5 }
const circle: ICircle = { tag: 'circle', radius: 10 }

console.log(calcArea(square), calcArea(rectangle), calcArea(circle)); // 100, 20, 314.1592653...
```

### 타입 가드

다음과 같은 두 개의 타입이 있다고 가정해보자.

```typescript
export class Bird {
  fly() {
    console.log(`I'm flying`);
  }
}

export class Fish {
  swim() {
    console.log(`I'm swimming.`);
  }
}
```

다음처럼 flyOrSwim 과 같은 함수를 구현할 때 매개변수 o 는 Bird 이거나 Fish 이므로 04행에서 코드 작성이 모호해질 수 있다.

즉 합집합 타입(Bird | Fish) 의 객체가 구체적으로 Bird 인지 Fish 인지 알아야 한다.

```typescript
import { Bird, Fish } from './animals';

export const flyOrSwim = (o: Bird | Fish): void {
  // o.fly() ???
}
```

##### instanceof 연산자

자바스크립트는 instanceof 라는 이름의 연산자를 제공하는데, 이 연산자는 다음처럼 두 개의 피연산자가 필요하다.

```text
객체 instanceof 타입 // boolean 타입의 값 반환
```

instanceof 연산자를 사용하면 앞 flyOrSwim 함수는 다음처럼 구현할 수 있다.

```typescript
import { Bird, Fish } from './animals';

export const flyOrSwim = (o: Bird | Fish): void => {
  if (o instanceof Bird) {
    (o as Bird).fly();
  } else {
    (<Fish>o).swim();
  }
}
```

##### 타입 가드

그런데 타입스크립트에서 instanceof 연산자는 자바스크립트와는 다르게 타입 가드 기능이 있다. 여기서 타입 가드는 타입을 변환하지 않는 코드 때문에 프로그램이 비정상적으로 종료되는 상황을 보호해 준다는 의미이다.

다음 flyOrSwim 함수는 instacneof 연산자의 타입 가드 기능을 사용해 변수 o 의 타입을 전환 하지 않고 사용한다.

그런데도 타입스크립트는 04행이 true 로 확인되면 변수 o 를 자동으로 Bird 타입 객체로 전환한다.

물론 6행이 True 로 확인되면 변수 o 는 Fish 타입 객체로 전환된다.

```typescript
import { Bird, Fish } from './BirdAndFish';

export const flyOrSwim = (o: Bird | Fish): void => {
  if (o instanceof Bird) {
    o.fly();
  } else if(o instanceof Fish) {
    o.swim();
  }
}
```

이제 flyOrSwim 함수를 사용하는 코드를 작성해보자.

```typescript
import { Bird, Fish } from './BirdAndFish';
import { flyOrSwim } from './flyOrSwim';

[ new Bird(), new Fish() ].forEach(o => flyOrSwim(o));
```

##### is 연산자를 활용한 사용자 정의 타입 가드 함수 제작

개발자 코드에서 마치 instanceof 처럼 동작하는 함수를 구현할 수 있다. 즉 타입 가드 기능을 하는 함수를 구현할 수 있다.

타입 가드 기능을 하는 함수는 다음처럼 함수의 반환 타입 부분에 is 라는 이름의 연산자를 사용해야 한다. is 연산자를 사용하는 구문은 다음처럼 작성한다.

```text
변수 is 타입
```

다음 isFlyable 함수는 반환 타입이 o is Bird 이므로 사용자 정의 타입 가드 함수이다.

```typescript
import { Bird, Fish } from './BirdAndFish';

export const isFlyable = (o: Bird | Fish): o is Bird => {
  return o instanceof Bird;
}
```

물론, 다음 isSwimmable 함수도 사용자 정의 타입 가드 함수이다.

```typescript
import { Bird, Fish } from './BirdAndFish';

export const isSwimmable = (o: Bird | Fish): o is Fish => {
  return o instanceof Fish;
}
```

그런데 사용자 정의 타입 가드 함수는 if 문에서 사용해야 한다.

다음 swimOrFly 함수는 두 개의 if 문에서 앞서 제작한 사용자 정의 타입 가드 함수를 사용한다.

```typescript
import { Bird, Fish } from './BirdAndFish';
import { isFlyable, isSwimmable } from './isFlyableAndSwimmable';
import { isSwimmable} from './isSwimmable';

export const swimOrFly = (o: Fish | Bird) => {
  if(isSwimmable(o)) {
    o.swim();
  } else if(isFlyable(o)) {
    o.fly();
  }
}
```

swimOrFly 함수에 대한 테스트 코드를 작성해 실행해보면 앞서 flyOrSwim-test.ts 의 결과와 똑같다는 것을 알 수 있다.

```typescript
import { Bird, Fish } from './BirdAndFish';
import { swimOrFly } from './swimOrFly';

[ new Bird(), new Fish() ].forEach(o => swimOrFly(o));
```

### F-바운드 다형성

##### 실습 프로젝트 구성

##### this 타입과 F-바운드 다형성

타입스크립트에서 this 키워드는 타입으로도 사용된다. this 가 타입으로 사용되면 객체지향 언어에서 의미하는 다형성 효과가 나는데, 일반적인 다형성과 구분하기 위해

this 타입으로 인한 다형성을 F-바운드 다형성(F-bounded polymorphism)이라고 한다.

(1) F-바운드 타입

F-바운드 타입이란, 자신을 구현하거나 상속하는 서브 타입을 포함하는 타입을 말한다. 다음 IValueProvider<T> 타입은 특별히 자신을 상속하는 타입이 포함되어 있지 않은 일반 타입이다.

```typescript
export interface IValueProvider<T> {
  value(): T;
}
```

반면에 다음 IAddable<T> 는 add 메서드가 내가 아닌 나를 상속하는 타입을 반환하는 F-바운드 타입이다.

```typescript
export interface IAddable<T> {
  add(value: T): this;
}
```

다음 IMultiplayable<T> 또한 메서드의 반환 타입이 this 이므로 F-바운드 타입이다.

```typescript
export interface IMultiplayable<T> {
  multiply(value: T): this;
}
```

이제 앞으로 코드를 편하게 작성하고자 다음 index.ts 파일을 src/interfaces 디렉터리에 만든다.

```typescript
import { IValueProvider } from './IValueProvider';
import { IAddable } from './IAddable';
import { IMultiplayable } from './IMultiplayable';

export { IValueProvider, IAddable, IMultiplayable };
```

이제 이 세 개의 인터페이스를 구현하는 Calculator 와 StringComposer 클래스를 구현해가면서 this 타입이 필요한 이유를 알아보자.

(2) IValueProvider<T> 인터페이스의 구현

다음 Calculator 클래스는 IValueProvider<T> 인터페이스를 구현하고 있다. 이 클래스는 _value 속성을 private 으로 만들어 Calculator 를 사용하는 코드에서 _value 속성이 아닌

value() 메서드로 접근할 수 있게 설계되었다.

```typescript
import { IValueProvider } from './IValueProvider';

export class Calculator implements IValueProvider<number> {
  constructor(public _value: number = 0) {}

  value(): number {
    return this._value;
  }
}
```

같은 방식으로 다음 StringComposer 클래스는 IValueProvider<T> 인터페이스를 구현하고 있다.

```typescript
import {IValueProvider} from './IValueProvider';

export class StringComposer implements IvalueProvider<string> {
  constructor(private _value: string = '') {}
  
  value(): string {
    return this._value;
  }
}
```

(3) IAddable<T> 와 IMultiplayable<T> 인터페이스의 구현

다음 Calculator 클래스는 IValueProvider<T> 이외에도 IAddable<T> 를 구현한다. Calculator 의 add 메서드는 클래스의 this 값을 반환하는데 이는 메서드 체인 기능을 구현하기 위해서이다.

```typescript
import { IValueProvider } from './IValueProvider';

export class Calculator implements IValueProvider<number> {
  constructor(public _value: number = 0) {}

  value(): number {
    return this._value;
  }

  add(value: number): this {
    this._value += value;
    return this;
  }
}
```

이제 IMultiplayable<T> 를 구현하는 Calculator 클래스를 작성한다.

```typescript
import { IValueProvider } from './IValueProvider';
import { IAddable } from './IAddable';
import { IMultiplayable } from './IMultiplayable';

export class Calculator implements IValueProvider<number>, IAddable<number>, IMultiplayable<number> {
  constructor(public _value: number = 0) {}

  value(): number {
    return this._value;
  }

  add(value: number): this {
    this._value += value;
    return this;
  }

  multiply(value: number): this {
    this._value *= value;
    return this;
  }
}
```

이제 src/test 디렉터리에 Calculator 클래스를 테스트하는 코드를 작성하겠다.

Calculator 의 add 와 multiply 메서드는 this 를 반환하므로 04 ~ 06행과 같은 메서드 체인 코드를 작성할 수 있다.

물론 IValueProvider<T> 의 value 메서드는 메서드 체인을 위한 것이 아니라 private 으로 지정된 속성 _value 의 값을 가져오는 것이 목적이다.

따라서 07행에서 보듯 메서드 체인에서 가장 마지막에 호출해야 한다.

```typescript
import { Calculator } from '../classes/Calculator';

const value = (new Calculator(0))
  .add(2)
  .add(3)
  .multiply(4)
  .value();

console.log(value); // 24
```

StringComposer 도 Calculator 와 같은 방식으로 구현할 수 있다.

```typescript

export class StringComposer implements IValueProvider<string>, IAddable<string>, IMultiplyable<number> {
    constructor(private _value: string = '') {}
    
    value(): string {
        return this._value;
    }
    
    add(value: string): this {
        this._value.concat(value);
        return this;
    }
    
    multiply(repeat: number): this {
        const value = this.value();
        for (let i = 0; i < repeat; i++) {
          this.add(value);
        }
        return this;
    }
}
```

StringComposer 클래스를 테스트하는 코드를 작성한다.

```typescript
import { StringComposer } from '../classes/StringComposer';

const value = (new StringComposer('TypeScript'))
  .add(' is')
  .add(' awesome')
  .multiply(2)
  .value();
  
console.log(value); // TypeScript is awesomeTypeScript is awesome
```

IAddable<T> 의 add 메서드나 IMultiplayable<T> 의 multiply 메서드는 자신을 구현한 클래스에 따라 반환 타입은 Calculator 가 되기도 하고 StringComposer 가 되기도 한다.

즉 반환 타입 this 는 어떤 때는 Calculator 가 되기도 하고 어떤 때는 StringComposer 가 되기도 한다.

이런 방식으로 동작하는 것을 F-바운드 다형성이라고 한다.

### nullable 타입과 프로그램 안전성

##### 실습 프로젝트 구성

##### nullable 타입

자바스크립트와 타입스크립트는 변수가 초기화 되지 않으면 undefined 라는 값을 기본으로 지정한다. 그런데 자바스크립트와 타입스크립트는 undefined 와 같은 사실상 같은 의미인 null 이 있다.

타입스크립트에서 undefined 값의 타입은 undefined 이고, null 값의 타입은 null 이다. 이 둘은 사실상 같은 것이므로 서로 호환된다.

따라서 다음 화면에서 보는 것처럼 undefined 타입 변수 u 에는 null 값을 지정할 수 있고, null 타입 변수 n 에는 undefined 값을 지정할 수 있다.

하지만 undefined 와 null 타입 변수에는 두 값 이외에 1과 같은 값을 설정할 수 없다.

undefined 와 null 타입 변수에는 두 값 이외에 1과 같은 값을 설정할 수 없다.

undefined 와 null 타입을 nullable 타입이라고 하며 코드로는 다음처럼 표현할 수 있다.

```typescript
export type nullable = undefined | null;
export const nullable: nullable = undefined;
```

그런데 이 nullable 타입들은 프로그램이 동작할 때 프로그램을 비정상적으로 종료시키는 주요 원인이 된다. 즉 프로그램의 안전성을 해친다.

함수형 언어들은 이를 방지하기 위해 연산자나 클래스를 제공하기도 한다.

이제 이 두 가지 경우에 대해 알아보겠다.

##### 옵션 체이닝 연산자

변수가 선언만 되었을 뿐, 어떤 값으로 초기화되지 않으면 다음 화면처럼 코드를 작성할 때는 문제가 없지만 실제로 실행하면(즉 런타임) 다음과 같은 오류가 발생하면서 프로그램이 비정상적으로 종료한다.

이런 오류는 프로그램의 안전성을 해치므로 프로그래밍 언어 설계자들은 옵션 체이닝 연산자나 조금 뒤 설명할 널 병합 연산자를 제공하기도 한다.

자바스크립트는 최근에 물음표 기호와 점 기호를 연이어 쓰는 ?. 연산자를 표준으로 채택했으며 타입스크립트는 3.7.2 버전부터 이 연산자를 지원하기 시작했다.

다음 코드에서 06행은 앞서 본 런타임 오류를 발생시키지만 07행은 옵션 체이닝 연산자를 사용해 06행과 가은 오류가 발생하지 않는다.

```typescript
export interface IPerson {
    name: string;
    age?: number;
}
    
const person: IPerson = { name: 'Jane' };
    
console.log(person.age.toFixed(2)); // 런타임 오류
console.log(person.age?.toFixed(2)); // 런타임 오류가 발생하지 않음
```

옵션 체이닝 연산자는 세이프 네비게이션 연산자라고 하는데 이 두 이름의 의미는 다음 코드의 6행에서 찾을 수 있다.

6행은 8-10행처럼 수다스럽게 구현해야 하는 코드를 간결하게 구현한 예이다.

```typescript
export type ICoordinates = { longitude: number };
export type ILocation = { coordinates: ICoordinates };
export type ITravel = { location: ILocation };

let person: IPerson = { name: 'Jack' };
let longitude: person?.location?.coords?.longitude;
console.log(longitude); // undefined
if (person && person.location && person.location.coords) {
    longitude = person.location.coords.longitude;
}
```

##### 널 병합 연산자


##### nullable 타입의 함수형 방식 구현

(1) Some 클래스 구현

다음 코드는 Some 클래스의 구현 내용이다. getOrElse 와 map 메서드가 정상으로 구현되어 있다.

클래스의 value 속성은 private 으로 선언되어 있으므로 Some 클래스의 사용자는 항상 getOrElse 메서드를 통해 Some 클래스에 담긴 값을 얻어야 한다.

Some 클래스의 사용자는 또한 value 값을 변경하려면 항상 map 메서드를 사용해야만 한다.

```typescript
import {IValueable} from './IValueable';
import {IFunction} from './IFunction';
import ImportValue = WebAssembly.ImportValue;

export class Some<T> implements ImportValue<T>, IFunction<T> {
  constructor(private value: T) {}

  getOrElse(defaultValue: T): T {
    return this.value;
  }

  map<U>(fn: IFunction<T, U>): Some<U> {
    return new Some<U>(fn(this.value));
  }
}
```

> map 메서드의 반환 타입이 this 가 아닌 이유
> 
> Some.ts 소스의 10행은 다음 장에서 설명하는 카테고리 이론에 근거한 구현 방식이다.
> map 메서드의 반환 타입이 this 가 아닌 이유는 map 메서드가 반환하는 타입이 Some<T> 가 아니라 Some<U> 이기 때문이다.
> 
> 그리고 조금 뒤에 보겠지만 None 의 경우 map 메서드는 None 을 반환한다.
> 
> 결론적으로 map 메서드의 반환 타입은 Some<U> | None 이어야겠지만, 타입스크립트 컴파일러는 반환 타입을 명시하지 않으면 타입을 추론해서 반환 타입을 찾아낸다.

(2) None 클래스 구현

다음은 None 클래스의 구현 내용이다. Some 과 다르게 None 의 map 메서드는 콜백 함수를 전혀 사용하지 않는다. None 클래스는 nullable 타입의 값을 의미하므로, nullable 값들이 map 의 콜백 함수에 동작하면

프로그램이 비정상적으로 종료될 수 있다.

```typescript
import { IValueable } from './IValueable';
import { IFunction } from './IFunction';

export class None implements IValueable<null>, IFunction<null> {
  getOrElse(defaultValue: null): null {
    return defaultValue;
  }

  map<U>(fn: IFunction<null, U>): None {
    return new None();
  }
}
```

(3) Some 과 None 클래스 사용

이제 앞에서 구현한 Option 클래스의 기능을 테스트 해보자. 다음 코드를 작성하고 실행해보면 Some 타입에 설정된 값 1은 4행에서 map 메서드를 통해 2로 바뀌고 getOrElse 메서드에 의해 value 변수에는 2가 저장된다.

```typescript
import { Some } from '../option/Some';

let m = Option.Some(1)
let value = m.map(value => value + 1).getOrElse(1);
console.log(value); // 2

let n = Option.None;
value = n.map(value => value + 1).getOrElse(0);
console.log(value); // 0
```

반면에 None 타입 변수 n 은 map 메서드를 사용할 수 있지만, 이 map 메서드의 구현 내용은 콜백 함수를 전혀 실행하지 않고 단순히 None 타입객체만 반환한다.

None 타입은 getOrElse 메서드가 있으므로 코드는 정상으로 동작하지만, 8행에서는 value 변수에는 getOrElse(0)이 호출되어 전달받은 0이 저장된다.

##### Option 타입과 예외 처리

Option 타입은 부수 효과가 있는 불순(impure)함수를 순수 함수로 만드는데 효과적이다. 자바스크립트의 parseInt 함수는 문자열을 수로 만들어주는데 문제는 문자열이 '1' 이 아니라 'hello' 와 같으면

NaN(Not a Number)이라는 값을 만든다는 사실이다. 어떤 값이 NaN 인지 여부는 자바스크립트가 제공하는 isNaN 함수를 사용하면 알 수 있다.

다음 parseNumber 함수는 parseInt 의 반환값이 NaN 인지에 따라 Option.None 이나 Option.Some 타입의 값을 반환한다.

```typescript
import { Option, Some, None } from './Option';

export const parseNumber = (str: string): Option<number> => {
  const parsed = parseInt(str);
  return isNaN(parsed) ? new None() : new Some(parsed);
}
```

다음 코드는 값이 정상적으로 변환되면 4-5행의 map 메서드가 동작해 4가 출력되지만 값이 비정상적이면 getOrElse(0)가 제공하는 0을 출력한다.

```typescript
import { parseNumber } from '../option/parseNumber';

let value = parseNumber('1')
  .map(value => value + 1)
  .map(value => value * 2)
  .getOrElse(0);

console.log(value); // 4 

value = parseNumber('hello')
  .map(value => value + 1)
  .map(value => value * 2)
  .getOrElse(0);

console.log(value); // 0
```

자바스크립트의 Json.parse 함수는 매개변수가 정상적인 JSON 포맷 문자열이 아니면 예외(exception)을 발생시킨다.

예외를 발생시키는 함수는 부수 효과가 있는 불순 함수이지만, 다음 parseJson 함수는 try/catch 구문과 Option 을 활용해 순수 함수가 되었다.

```typescript
import { Option, Some, None } from './Option';

export const parseJson = <T>(json: string): IValueable<T> & IFunction<T> => {
  try {
    const value = JSON.parse(json);
    return Option.Some<T>(value);
  } catch(e) {
    return Option.None;
  }
}
```

이제 다음 테스트 코드를 실행해 보면 07행에서 비정상적으로 종료하지 않고 정상적으로 동작하는 것을 확인할 수 있다.

```typescript
import { parseJson } from '../option/parseJson';

const json = JSON.stringify({ name: 'Jack', age: 32 });
let value = parseJson(json).getOrElse({});
console.log(value);

value = parseJson('hello world').getOrElse({});

console.log(value);
```











### Optional. 타입 작성하는데에 내가 필요한 레퍼런스가 무엇일까?