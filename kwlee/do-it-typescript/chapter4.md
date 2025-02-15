## 4장 함수와 메서드

#### 함수 선언문
* 가장 기본적인 방법으로, `function` 키워드를 사용하여 선언한다.
```typescript
function sum (a:number, b:number):number {  
    return a + b  
}
```

* 선택적 매개변수 사용
```typescript
function square (a?:number):number {  
    return a ? a * a : 0  
}
```
##### 함수 시그니처
* 변수의 타입처럼 함수의 타입을 함수 시그니처라고 한다.
* 함수의 타입을 미리 정의하고 이를 함수의 선언에 사용할 수 있다.
```typescript
type NumberToNumberFunc = (x: number, y: number) => number  
const add: NumberToNumberFunc = (x, y) => x + y
```

* 인터페이스를 이용한 함수 타입 정의
```typescript
interface NumberToNumberFunc {
  (x: number, y: number): number;
}

const add: NumberToNumberFunc = (x, y) => x + y;
```
#### 함수 표현식
* 변수에 함수를 할당하는 방식
```typescript
const add = function(x: number, y: number): number {
  return x + y;
};
```

* 화살표 기호 사용
```typescript
const add = (x: number, y: number): number => {
  return x + y;
};

const add = (x: number, y: number): number => x + y;
```
##### *함수 표현식과 함수 선언문의 차이*
* *함수 선언문*
    * **프로그램 실행 전에 모든 함수가 메모리에 로드된다.**
    * **호이스팅으로 인해 선언 위치와 관계없이 사용이 가능하다.**
    * **함수선언문은 반드시 이름을 가져야 한다.**
* *함수 표현식*
    * **호이스팅이 되지 않는다.**
    * **실행 흐름이 해당 표현식에 도달했을 때 생성된다.**
    * **함수표현식은 이름을 가질 수도 있고 없을 수도 있다.**
---
##### 함수는 객체다
*  `"함수는 객체다"` 라는 문장은 함수가 일등 객체(first-class object) 또는 일등 함수(first-class function)로 취급된다는 의미를 가진다.
* **함수의 객체적 특성**
    * **변수에 할당 가능**
    * **함수를 다른 함수의 매개변수로 전달**
    * **함수가 다른 함수를 반환**
#### 조급한 계산법과 느긋한 계산법
* 조급한 계산법
    * 함수 선언문과, 함수 표현식 모두 기본적으로 조급한 계산법을 따른다.
    * 함수가 호출될 때 인자들이 즉시 평가되어 함수 본문이 **즉시** 실행된다.
```typescript
function add(a: number, b: number): number {
    return a + b;
}

let result = add(5, 3); // 즉시 8로 계산
console.log(result); // result의 값 : 8
```
* 느긋한 계산법
    * 계산이 실행을 필요한 시점까지 지연시킨다.
```typescript
// 클로저를 활용한 계산 지연
function lazyAdd(a: number, b: number): () => number {
  return () => a + b;
}

const addLater = lazyAdd(3, 4);
console.log(addLater()); // 계산 시작 : 7
```
#### 익명 함수
* 함수 표현식은 대부분의 언어에서 언급되는 익명 함수의 다른 표현이다.
#### const 키워드와 함수 표현식
* 함수 표현식을 담는 변수는 **재할당이 가능한 `let`보다 `const`를 사용하는 것을 권장한다**.
---
#### 실행문과 표현식문
* 실행문
    * 일반적으로 값을 반환하지 않는다
    * 프로그램의 상태를 변경하거나 제어 흐름을 조정한다.
* 표현식문
    * 값을 생성하거나 반환한다.
    * 다른 표현식의 일부가 될 수 있다.
    * 변수에 할당하거나 함수의 인자로 사용할 수 있다.
#### 표현식문 스타일의 화살표 함수 구현
```typescript
const add = (x: number, y: number): number => {
  return x + y;
};

const add = (x: number, y: number): number => x + y;
```
* 화살표 함수는 함수 본문이 **단일 표현식일** 경우 중괄호와 return 키워드를 생략할 수 있다.
---
> *테스트 프레임워크는 jest를 사용했습니다.*   
> *`.toBe()`는 엄격한 동등성(`===`)을 검사하여, 참조의 동일성을 확인할 때 사용합니다.*   
> *`.toEqual()`은 깊은 동등성을 검사합니다. 객체의 모든 속성을 재귀적으로 비교하며, undefined 값을 무시합니다.*
#### 콜백 함수(callback function)
* 일등 함수 (first-class function)
    * 일등 함수는 함수를 일반적인 값처럼 다룰 수 있는 개념
    * 변수에 담을 수 있음
    * 함수 표현식, 함수 선언문도 둘 다 일등 함수로 취급가능하다.
* 콜백 함수
    * 변수에 담긴 함수를 인자로 넘겨 동작하는 함수
```typescript
test('callback function 1', () => {  

    const add = (x: number, y: number): number => {  
        return x + y;  
    }  
  
    function addTemplateFunction(callback: (x: number, y: number) => number): number {  
        return callback(10, 20);  
    }  
  
    expect(addTemplateFunction(add)).toBe(30);  
});  
  
test('callback function 2', () => {  
  
    function add (x: number, y: number): number {  
        return x + y;  
    }  
  
    function addTemplateFunction(callback: (x: number, y: number) => number): number {  
        return callback(10, 20);  
    }  
  
    expect(addTemplateFunction(add)).toBe(30);  
});
```
#### 중첩 함수(nested function)
* 다른 함수 내부에 정의된 함수를 말한다.
```typescript
test('nested function', () => {  

    function add(x: number): (y: number) => number {  
        return function (y: number): number {  
            return x + y;  
        }  
    }  
  
    expect(add(10)(20)).toBe(30);  
});
```
#### 고차 함수(high-order function)
* 함수를 인자로 받거나, 함수를 반환값으로 사용하는 함수
* 코드의 재사용성과 추상화 수준을 높일 수 있으며, 중요한 데이터의 정보를 은닉과 캡슐화를 할 수 있다.
```typescript
test('higher order function', () => {  

    const add = (a: number): (number) => number => (b: number): number => a + b; 
    
    expect(add(10)(20)).toBe(30);  
});

test('higher order function 2', () => {  
  
    function add(a: number): (number) => number {  
        return function (b: number): number {  
            return a + b;  
        }  
    }  
  
    expect(add(10)(20)).toBe(30);  
});
```
#### 클로저(closure)
* 함수와 그 함수가 선언된 렉시컬 환경의 조합
* 렉시컬 스코핑
    * 렉시컬 : 코드가 어디서 작성되었는지에 따라 변수의 스코프와 식별자의 의미가 결정되는 특성
    * 함수는 자신이 정의된 환경의 변수에 접근할 수 있다.
* 상태 유지
    * 외부 함수의 실행이 끝난 후에도 내부 함수가 외부 함수의 변수에 접근할 수 있다.
    * 내부 함수가 외부 함수의 스코프에 있는 변수들에 대한 참조를 유지한다.
* 데이터 은닉
    * 클로저를 통해 `private` 변수와 유사한 개념을 구현할 수 있음
```typescript
test('closure', () => {  

    function outerFunction(x: number) {  
    
        const y = 10;
  
        function innerFunction() {  
            return (x + y);
        }  
  
        return innerFunction;  
    }  
  
    const closure = outerFunction(5); // 내부 함수 반환  
    expect(closure()).toBe(15); // 출력: 15, 여전히 y에 접근 가능  
})
```
---
#### 매개변수 기본값 지정하기
```typescript
test('default parameter', () => {  

    function add(a: number, b: number = 20): number {  
        return a + b;  
    }  
  
    expect(add(10)).toBe(30);  
    expect(add(10, 5)).toBe(15);  
});
```
#### 단축구문
* 타입스크립트는 매개변수의 이름과 똑같은 이름의 속성을 가진 객체를 만들 수 있다.
```typescript
test('shorthand', () => {  

    const makePerson = (name: string, age: number) => ({name, age});  
  
    const testPerson = makePerson('Mark', 39);  
    expect(testPerson.name).toBe('Mark');  
});
```
#### 객체를 반환하는 화살표 함수
```typescript
test('return object in arrow function', () => {  

    const makeObject = (price: number) => ({key: 'apple', price});  
  
    const obj = makeObject(2000);  
  
    expect(obj.key).toBe('apple');  
    expect(obj.price).toBe(2000);  
});
```
#### 비구조화 매개변수 함수
```typescript
test('destructuring parameters', () => {  

    type Person = {name: string, age: number};  
  
    const printPerson = ({name, age}: Person): string => {  
        return `name: ${name}, age: ${age}`;  
    };  
      
    const person = {name: 'Mark', age: 39};  
    expect(printPerson(person)).toBe('name: Mark, age: 39');  
});
```
#### 색인 키와 값으로 객체 생성
```typescript
test('indexable function 1', () => {  

    const makeObject = (key, value) => ({[key]: value});  
  
    const obj = makeObject('name', 'Mark');  
    expect(obj).toEqual({name: "Mark"});  // toEqual은 깊은 동등성 비교에 사용
});  
  
  
test('indexable function 2', () => {  
  
    type StringArray = { [index: number]: string };  
  
    const arr: StringArray = ['a', 'b', 'c'];  
    expect(arr[0]).toBe('a');  
    expect(arr[1]).toBe('b');  
    expect(arr[2]).toBe('c');  
});
```
---
#### function 함수와 this 키워드
* `function` 키워드를 사용해서 만든 함수는 `Function`이란 클래스의 인스턴스이다.
* 즉, 함수는 객체이다.
```typescript
test('this in function', () => {  
    const test = {  
        value: 123,  
          
        method(): number {  
            return  this.value;  
        }  
    };  
  
    expect(test.method()).toBe(123);  
});
```
#### 정적메서드
* `static` 키워드를 사용해 정적 메서드를 만들 수 있다.
```typescript
test('static method', () => {  
  
    class clazz {  
        static add(a: number, b: number): number {  
            return a + b;  
        }  
    }  
  
    expect(clazz.add(10, 20)).toBe(30);  
});
```
#### 메서드 체인
* 메서드 체인은 여러 메서드를 연속적으로 호출하는 프로그래밍 패턴이다.
* 각 메서드는 객체 자신(`this`)을 반환한다.
* 이를 통해서 메서드를 연속해서 호출할 수 있다.
```typescript
test('method chaining', () => {  
  
    class Calculator {  
        constructor(public value: number = 0) {  
        }  
        add(value: number): this {  
            this.value += value;  
            return this;  
        }  
  
        multiply(value: number): this {  
            this.value *= value;  
            return this;  
        }  
    }  
  
    const calc = new Calculator();  
    expect(calc.add(10).multiply(10).value).toBe(100);  
});
```