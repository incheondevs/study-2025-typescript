### 타입 단언(type assertion)
* 타입 단언은 타입스크립트에서 개발자가 컴파일러에게 특정 값의 타입을 명시적으로 지정하는 방법입니다.
* 타입스크립트의 타입 추론 기능을 개발자가 직접 재정의하는 것과 같습니다.
* `as`키워드를 사용합니다.
* **타입 단언은 컴파일 시에만 작동하며, 런타임에는 영향을 미치지 않습니다.**
* 타입 강제 변환과는 다르며, 실제 데이터 변환은 일어나지 않습니다.
* 복잡한 타입 관계에서 컴파일러가 정확한 타입을 추론하지 못할 때 사용합니다.
* 타입스크립트로 점진적 마이그레이션 시 유용합니다.

```ts
let strLength: number = (someValue as string).length;
```

```ts
interface Person {
	name: string;
	age: number;
}

var joo = {};
joo.name = '형주'; //TS2339: Property name does not exist on type {}
joo.age = 31; //TS2339: Property name does not exist on type {}
```
* 타입스크립트 컴파일러가 해당 객체에 어떤 속성이 들어갈지 알 수 없기 때문에, `joo`객체 초기화 이후 추가되는 속성들은 추가할 수 없습니다.
```ts
var joo = {} as Person;
joo.name = '형주';
joo.age = 31;
```
* 이전 코드와 마찬가지로 빈 객체를 선언했지만, `as`로 타입 단언을 함으로써 객체의 들어갈 속성을 컴파일러에게 말해주는 효과를 줍니다.
---
#### 타입 단언의 대상
* 타입 단언은 숫자, 문자열, 객체 등 원시 값뿐만 아니라 변수나 함수의 호출 결과에도 사용할 수 있습니다.
```ts
test('typeassertions', () => {  
    function getld(id) {  
        return id;  
    }  
    var myld = getld('josh') as number;  
    expect(myld).toBe('josh');  
});
```
* 타입 단언을 `number`로 했으나 실제로 테스트를 돌려보면 테스트가 통과됩니다.
* 이 예제를 통해서 타입 단언이 컴파일 타임에만 영향을 미치고 런타임에는 아무런 영향을 주지 않는다는 것을 알 수 있습니다.
* 또한, 실제 데이터의 타입을 변경하지 않는다는 점도 알 수 있습니다.
#### 타입 단언 중첩
```ts
var num = (10 as any) as number;
```
#### 호환되지 않는 데이터 타입으로는 단언할 수 없다.
* 타입 단언을 이용하면 어떤 값이든 내가 원하는 타입으로 단언할 수 있을 것 같지만 실제로는 그렇지 않습니다.
```ts
var num = 10 as string; // TS2352: Conversion of type number to type string may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to unknown first.
```
---
#### null 아님 보장 연산자 : !
* null 아님 보장 연산자(!)는 TypeScript에서 사용되는 특별한 연산자로, 컴파일러에게 특정 값이 null이나 undefined가 아님을 단언하는 역할을 합니다.
```ts
let someValue: string | null = "Hello, TypeScript";
let strLength: number = someValue!.length;
```
* 타입 체커의 엄격한 null 검사를 우회할 수 있습니다.
* 값이 null/undefined가 아님을 확신할 때 사용해야합니다.
---
#### 타입 단언 남용하지 않기
* 타입 단언은 코드를 실행하는 시점에서 아무런 역할을 하지 않습니다. 단지 타입 에러를 쉽게 해결하기 위해서 타입 단언을 남발하면, 런타임 에러로 고생할 가능성이 높아집니다.
* 개발자한테 가장 좋은 에러는 컴파일 에러입니다.