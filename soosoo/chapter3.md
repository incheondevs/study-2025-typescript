# 3장 객체와 타입

## 자바스크립트와 타입스크립트의 기본 타입

| 유형        | 자바스크립트 타입 | 타입스크립트 타입 |
| ----------- | ----------------- | ----------------- |
| 수 타입     | Number            | number            |
| 불리언 타입 | Boolean           | boolean           |
| 문자열 타입 | String            | string            |
| 객체 타입   | Object            | object            |

## var, let, const

변수를 사용하려면 반드시 선언이 필요하고, 변수를 선언할 때는 var, let, const 키워드를 사용합니다. 여기서 var 키워드는 다른 프로그래밍 언어와는 다르게 동작하기 때문에 let, const가 등장하게 됩니다.

|           | var | let | const |
| --------- | --- | --- | ----- |
| 중복 선언 | O   | X   | X     |
| 재할당    | O   | O   | X     |

> ESNext는 var 키워드를 사용하지 말라고 권고합니다.

<details>
  <summary>🤷‍♀️ var 키워드는 다른 프로그래밍 언어와 어떻게? 다르게 동작하며 왜? 사용하지 말라고 권고하는 걸까?</summary>

ES6에서 `let`, `const` 키워드를 도입한 이유는 `var`의 단점을 보완하기 위해서입니다. `var`의 가장 대표적인 단점은 블록 레벨 스코프를 지원하지 않고, 함수 레벨 스코프를 지원한다는 것입니다. 이로 인해 의도치 않게 전역 변수가 선언되어 의도했던 바와 다른 결과를 불러올 수 있습니다.

함수 레벨 스코프는 오로지 함수의 코드 블록만을 지역 스코프로 인정합니다. 즉, 함수 안에서 선언된 var 변수는 오로지 함수 안에서만 접근할 수 있는 지역 변수가 되고, 함수 밖에서 선언된 `var` 변수는 전역 변수가 됩니다. 아래 코드에서 `var`로 선언된 x 변수는 이미 전역 변수로, if문 안에서 다시 `var x = 10` 으로 선언되었습니다. 이 경우 `var`는 함수 레벨 스코프이므로, if 문 안에서 선언된 x는 전역 x 변수를 덮어쓰게 되어서 if문 밖에서 출력해도 10이 출력되어서 의도치 않게 값이 변경된 일이 발생합니다.

```jsx
var x = 1;
if (true) {
  var x = 10;
}
console.log(x); // 10
```

블록 레벨 스코프는 모든 코드 블록(함수, if 문, for 문, while 문, try/catch 문 등)을 지역 스코프로 인정합니다. 즉, 변수 범위를 함수 단위가 아닌 블록( {} )으로 구분합니다.

```jsx
let i = 10;

function foo() {
  let i = 100;

  for (let i = 1; i < 3; i++) {
    console.log(i); // 1 2
  }
  console.log(i); // 100
}

foo();

console.log(i); // 10
```

</details>

## 타입 주석

> 타입스크립트는 타입을 명시할 수 있습니다. 이를 타입 주석이라고 합니다.

위에서 말한 바와 같이 let은 재할당이 가능합니다. 다만 타입스크립트에서는 명시한 타입에 맞춰서 할당해줘야 합니다.

```jsx
let n: number = 1;
let b: boolean = true; // 혹은 false
let s: string = "hello";
let o: objct = {};

n = "a"(X); // 타입 불일치
b = 1(X); // 타입 불일치
s = false(X); // 타입 불일치
o = { name: "몽글", age: 7 };
```

## 타입 추론

막상 타입스크립트 코드를 보면 일일이 모든 변수에 타입을 명시하지 않는 걸 보실 수 있습니다. 타입을 명시하지 않아도 컴파일러가 초깃값에 따라 타입을 추론하기 때문에 각 변수는 초깃값에 해당하는 타입으로 지정됩니다. 이를 타입 추론이라고 합니다.

```jsx
let n = 1; // n의 타입을 number로 판단
let b = true; // b의 타입을 boolean으로 판단
```

### any 타입

모든 타입을 허용하는 타입입니다.

```tsx
let a: any = 0;
a = "hello"; // string 타입 할당 가능
a = true; // boolean 타입 할당 가능
a = {}; // object 타입 할당 가능
```

<details>
  <summary>🤷‍♀️ any 타입을 지양하는 이유는?</summary>

any 타입을 지양하는 이유 중 하나는 타입스크립트의 핵심 목적이 타입을 명시함으로써 잘못된 타입이 사용될 때 오류를 사전에 발견하는 것입니다. 그러나 any 타입을 무분별하게 사용하게 되면 버그 추적이 어려워지는 문제가 발생합니다.

</details>

### undefined 타입

자바스크립트에서의 undefined는 값으로, 타입스크립트에서는 타입이자 값으로 사용됩니다.

```jsx
let u: undefined = undefined;
u = 1; // Type '1' is not assignable to type 'undefined' 오류 발생
```

undefined 타입으로 선언된 변수는 오직 undefined 값만 가질 수 있습니다.

### 템플릿 문자열

> 타입스크립트에는 변수에 담긴 값을 조합해 문자열을 만들 수 있게 하는 템플릿 문자열을 제공합니다.

템플릿 문자열은 역따옴표(`)로 문자열을 감싸고, 변수를 ${}로 감싸서 표현합니다.

```jsx
let count = 10;
let essage = "Your count";
let result = `${message} is ${count}`;

console.log(result); // Your count is 10
console.log(typeof result); // string
```

result 변숫값의 타입을 찍어보면 string으로 문자열로 치환된 것을 확인할 수 있다.

## 객체와 인터페이스

> 타입스크립트는 객체의 타입을 정의할 수 있게하는 interface라는 키워드를 제공합니다.

인터페이스는 객체의 타입을 정의하는 것이 목적이므로 다음과 같이 객체를 의미하는 중괄호 {}로 속성 이름과 속성 타입을 나열하는 형태입니다.

```jsx
interface IPerson {
  name: string;
  age: number;
}
```

IPerson 인터페이스는 name과 age라는 속성이 둘 다 있는 객체만 유효하도록 객체의 타입 범위를 좁히는 데 있습니다. 아래와 같이 속성이 하나만 있거나 새로운 속성이 추가가 된다면 오류가 발생합니다.

```jsx
let bad1: Person = { name: "Jack" }; // age 속성이 없어서 오류
let bad2: Person = { age: 32 }; // name 속성이 없어서 오류
let bad3: Person = {}; // name과 age 속성이 없어서 오류
let bad4: Person = { name: "Jack", age: 32, etc: true }; // etc 속성이 있어서 오류
```

만약 etc라는 속성을 추가하기 위해 IPerson 인터페이스에서 etc 속성만 추가된 새로운 인터페이스인 IPerson2라는 인터페이스를 만들게 되면 IPerson과 IPerson2가 거의 동일한 구조를 가지게 되어 코드 중복이 발생합니다. 이럴 때, 선택 속성을 사용하면 됩니다.

```jsx
interface IPerson {
  name: string;
  age: number;
  etc?: boolean; // 속성 이름 뒤에 물음표
}

let good1: IPerson = { name: "Jack", age: 32 };
let good2: IPerson = { name: "Jack", age: 32, etc: true };
```

인터페이스를 설계할 때, 어떤 속성은 반드시 있어야 하지만 어떤 속성은 있어도 되고 없어도 되는 형태로 만들고 싶을 때, 선택 속성을 활용하면 유용합니다.

## 객체와 클래스

> 타입스크립트는 C++나 자바와 같은 객체지향 언어에서 흔히 볼 수 있는 class, private, public, protected, implements, extend와 같은 키워드를 제공합니다.

아래와 같이 name과 age라는 속성을 가진 클래스를 선언하고, new 연산자를 사용해서 Person1 클래스의 인스턴스를 생성합니다.

```jsx
class Person1 {
	name: string;
	age?: number;
}

// Person1 클래스에 new 연산자를 적용해서 jack1이라는 이름의 Person1 타입 변수 생성
let jack1: Person1 = new Person1();
```

> 타입스크립트 클래스는 constructor라는 이름의 특별한 메서드를 포함하는데, 이를 생성자라고 합니다.

생성자란? 쉽게 말하면, 생성자는 클래스로부터 객체를 생성할 때 즉시 호출되는 초기화를 담당하는 메서드라고 볼 수 있습니다. 생성자의 매개변수에 public과 같은 접근 제한자(public, private, protect)를 붙이면 해당 매개변수의 이름을 가진 속성이 클래스에 선언된 것처럼 동작합니다. Person3 클래스를 함축한 것이 Person2 클래스 입니다.

```jsx
class Person2 {
	constructor(public name: string, public age?: number){}
}

class Person3 {
	name: string;
	age?: number;
	constructor(name: string, age?: number){
  // 생성자를 통해서 클래스로부터 객체를 생성할 때,
  // 생성자 메서드가 호출되면서 매개변수로 받은 name, age 값이 this 키워드를 통해서 내부에 할당됩니다.
		this.name = name;
		this.age = age;
	}
}

```

### 인터페이스 구현

implements 키워드를 사용해서 Person4 클래스가 IPerson4 인터페이스를 구현할 수 있습니다. 다만 인터페이스는 해당 속성들이 있어야 한다는 규약에 불과하다는 점에서 클래스 내부에 인터페이스가 정의하고 있는 속성들을 멤버 속성으로 포함해야 합니다.

```jsx
interface IPerson4 {
  name: string;
  age?: number;
}

class Person4 implements IPerson4 {
  name: string;
  age: number;
}
```

### 추상 클래스

> 추상 클래스는 자신의 속성이나 메서드 앞에 abstract를 붙여 나를 상속하는 다른 클래스에서 이 속성이나 메서드를 구현하게 합니다.

AbstractPerson5는 name 속성 앞에 abstract가 붙었으므로 new 연산자를 적용해 객체를 만들 수 없습니다. 즉, 추상클래스는 인스턴스를 생성할 수 없는 클래스를 의미합니다.

```jsx
abstract class AbstractPerson5 {
	abstract name: string;
	constructor(public age?: number){}
}
```

### 클래스의 상속

다음과 같이 extends 키워드를 통해 클래스를 상속받을 수 있습니다.

> Person5 클래스는 AbstractPerson5 추상 클래스를 상속해 AbstractPerson5가 구현한 age를 얻고, AbstractPerson5를 상속받는 클래스가 구현해야 할 name 속성을 구현합니다.

추상클래스는 상속을 통해 자식 클래스에서 구현하여 완성시켜야 하는 클래스임을 알 수 있습니다.

```jsx
class Person5 extends AbstractPerson5 {
	constructor(public name: string, age?: number){
	super(age);
	}
}

let jack5: Person5 = new Person5('Jack', 32);
console.log(jack5);
```

### static 속성

> 다른 객체지향 언어처럼 타입스크립트 클래스는 정적인 속성을 가질 수 있습니다.

클래스 A는 initValue라는 정적 속성을 가집니다. `클래스 이름.정적 속성 이름` 점 표기법을 사용해 값을 얻거나 설정할 수 있습니다.

```jsx
class A {
  static initValue = 1;
}

let initVal = A.initValue; // 1
```

### 객체의 비구조화 할당문

> 인터페이스나 클래스를 사용해 관련된 정보를 묶어 새로운 타입으로 표현합니다. 이를 구조화(structuring)라고 합니다.

> 구조화된 데이터를 분해하는 것을 비구조화(destructuring)라고 합니다.

### 비구조화 할당

> name, age라는 변수가 생성이 되고, name 변수에는 jack.name, age 변수에는 jack.age가 각각 초깃값으로 할당되고 있습니다. 이를 비구조화 할당이라고 합니다.

```jsx
let { name, age } = jack;
```

잘못된 예시 ❌

타입을 객체 구조 내에서 바로 지정하려고 하면 잘못된 문법이 됩니다.

```jsx
let { name: string, age: number } = jack;
X;
```

올바른 예시 ⭕️

비구조화 할당 후에 객체 전체에 대해 타입을 지정하거나 미리 정의한 인터페이스를 사용하여 타입을 지정합니다.

```jsx
let { name, age }: { name: string, age: number } = jack;
O;
```

```jsx
interface Person {
  name: string;
  age: number;
}

let { name, age }: Person = jack;
O;
```

### 잔여 연산자, 전개 연산자

address의 5가지 속성 중에 country, city를 제외한 나머지 3개의 속성을 하나의 변수에 저장하고 싶다면, 잔여 연산자 …을 사용하면 됩니다.

```jsx
let address: any {
	country: 'Korea',
	city: 'Seoul',
	address1: 'Gangnam-gu',
	address2: 'Sinsa-dong',
	address3: 'Yongsan-gu'
}

const {country, city, ...detail} = address;
console.log(detail);
```

```tsx
// 실행 결과
{ address1: 'Gangnam-gu',
	address2: 'Sinsa-dong',
	address3: 'Yongsan-gu' }
```

> 점 3개 연산자가 비구조화 할당문이 아닌 곳에서 사용될 때 이를 전개 연산자라고 합니다. 말 그대로 객체의 속성을 모두 ‘전개’해 새로운 객체를 만들어 줍니다.

```jsx
let coord = { ...{ x: 0 }, ...{ y: 0 } };
console.log(coord); // {x: 0, y: 0}
```

### 타입 변환

> 타입이 있는 언어들은 특정 타입의 변숫값을 다른 타입의 값으로 변환할 수 있는 기능을 제공합니다. 이를 타입 변환이라고 합니다.

name 속성이 없는 object 타입인 person 변수를 name 속성이 있는 타입으로 변환해 [person.name](http://person.name) 속성값을 얻게 합니다.

```jsx
let person: object = {name: 'Jack', age: 32};
(<name: string>person).name;
```

### 타입 단언

타입스크립트가 추론하지 못하는 타입을 개발자가 직접 명시해주는 방식을 타입 단언이라고 합니다.

```tsx
interface User {
  name: string;
}

let obj: object = { name: "Jack" };

let name1 = (<User>obj).name;
let name2 = (obj as User).name;

console.log(name1, name2); // Jack Jack
```
