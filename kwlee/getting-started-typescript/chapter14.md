### 타입 가드(type guard)
* 타입 가드는 타입스크립트에서 변수의 타입을 좁히는 데 사용되는 메커니즘입니다.
* 컴파일러가 특정 범위 내에서 변수의 타입을 더 구체적으로 추론할 수 있게 됩니다.
* 코드의 특정 영역에서 변수의 타입을 제한합니다.
* 타입 가드는 `typeof`, `instanceof`, `in` 연산자를 사용합니다.
---
##### typeof
* 기본 타입을 체크할 때 사용합니다.
```ts
typeof 10; // ' number'
typeof 'hello'; // ' string'
typeof function() {} // 'function'

function isString(value: any): value is string {
  return typeof value === "string";
}
```
##### instanceof
```ts
if (obj instanceof Date) {
  console.log(obj.toISOString());
}
```
##### in
```ts
if ("length" in value) {
  console.log(value.length);
}
```
---
#### 타입 가드 함수
* 타입 가드 함수는 TypeScript에서 특정 타입을 확인하고 타입을 좁히는 데 사용되는 사용자 정의 함수입니다.
* 이 함수들은 `parameterName is Type` 형태의 타입 술어(type predicate)를 반환하여 컴파일러에게 타입 정보를 제공합니다.
```ts
interface Person {
	name: string;
	age: number;
}

interface Developer {
	name: string;
	skill: string;
}

function isPerson(someone: Person | Developer): someone is Person {
	return (someone as Person).age !== undefined;
}
```
---
#### 구별된 유니언 타입(discriminated unions)
* 구별된 유니언 타입이란 특정 속성 값으로 구분하는 타입 가드 문법을 의미합니다.
```ts
interface Person {
	name: string;
	age: number;
	industry: 'common';
}

interface Developer {
	name: string;
	age: string;
	industry: 'tech';
}

function greet(someone: Person - Developer) {
	if (someone.industry === 'common') {
		// someone의 타입은 Person 타입으로 추론된다，
	}
}
```

* switch 문 연산자 사용
```ts
function greet(someone: Person | Developer) {
	switch (someone.industry) {
		case 'common':
			console.log(someone.age.toFixed(2));
			break;
		case 'tech' :
			console.log(someone.age.split(''));
			break;
	}
}
```
---
* 논리/비교 연산자
```ts
function sayHi(message: string | null) {
	if (message && message.length >= 3) {
		console.log(message);
	}
}
```