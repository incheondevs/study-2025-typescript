# 클래스

> 이 챕터를 보시기 전에 [타입스크립트 클래스 · 객체 지향 문법 💯 총정리](https://inpa.tistory.com/entry/TS-%F0%9F%93%98-%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%ED%81%B4%EB%9E%98%EC%8A%A4-%C2%B7-%EA%B0%9D%EC%B2%B4-%EC%A7%80%ED%96%A5-%EB%AC%B8%EB%B2%95-%F0%9F%92%AF-%EC%B4%9D%EC%A0%95%EB%A6%AC) 를 참고하시는 편이 조금 더 학습에 도움이 됩니다.

# SECTION 1: 클래스란?

- ES6+ 문법임

자바스크립트에서의 객체는:

```typescript
const capts = {
  name: "캡틴",
  skill: "방패 던지기"
}

const lee = {
  name: "길벗",
  skill: "좋은 책 만들기"
}
```

이렇게 모양이 유사하면 생성자 함수를 사용하는 것이 좋음.

```typescript
function Person(name, skill) {
  this.name = name;
  this.skill = skill;
}


var capt = new Person('캡틴', '방패던지기');
var lee = new Person('길벗', '좋은책만들기');
```

ES6 문법에서는 아래와 같이 생성할 수 있음.

```typescript
class Person {
  constructor(name, skill) {
    this.name = name;
    this.skill = skill;
  }
}
```


# SECTION 2: 클래스 기본 문법

일반적인 생성자 함수의 예시:

```typescript
function Person(name, skill) {
  this.name = name;
  this.skill = skill;
}

Person.prototype.sayHi = function() {
  console.log('안녕하세요. 저는 ' + this.name + '입니다.');
}
```

위 코드를 생성자 함수를 이용해서 객체를 생성해보자.

```typescript
var capt = new Person('캡틴', '방패던지기');
capt.sayHi(); // 안녕하세요. 저는 캡틴입니다.
```

이 코드를 클래스로 옮기면:

```typescript
class Person {
  constructor(name, skill) {
    this.name = name;
    this.skill = skill;
  }

  sayHi() {
    console.log('안녕하세요. 저는 ' + this.name + '입니다.');
  }
}
```

# SECTION 3: 클래스의 상속

```typescript
class Person {
  constructor(name, skill) {
    this.name = name;
    this.skill = skill;
  }

  sayHi() {
    console.log('안녕하세요. 저는 ' + this.name + '입니다.');
  }
}
```

위 코드를 상속하는 클래스를 만들어보자.

```typescript
class Developer extends Person {
  constructor(name, skill) {
    super(name, skill);
  }
  
  coding() {
    console.log('fun doing ' + this.skill + ' by ' + this.name);
  }
}
```

이것을 사용해보자.

```typescript
var dev = new Developer('캡틴', '방패던지기');
dev.sayHi(); // 안녕하세요. 저는 캡틴입니다.
dev.coding(); // fun doing 방패던지기 by 캡틴
```

dev 변수로 부모 클래스의 메소드와 자식 클래스의 메소드를 모두 사용할 수 있음.

```typescript
var dev = new Developer('캡틴', '방패던지기');
dev.sayHi(); // 안녕하세요. 저는 캡틴입니다.
```

# SECTION 4: 타입스크립트의 클래스

이 코드는 단순하다. 클래스에도 타입을 정의할 수 있다.

```typescript
class ChatGpt {
  constructor(name) {
    this.name = name;
  }
  
  sum(a, b) {
    return a + b;
  }
}

const chatGpt = new ChatGpt('챗지피티');
console.log(chatGpt.sum(1, 2)); // 3
```

이 코드를 타입스크립트로 바꾸면:

```typescript
class ChatGpt {
  name: string;  // 이 부분이 중요함. this.name 을 가리키지 않는 이유가 뭐지?
  
  constructor(name: string) {
    this.name = name;
  }
  
  sum(a: number, b: number): number {
    return a + b;
  }
}

const chatGpt = new ChatGpt('챗지피티');
console.log(chatGpt.sum(1, 2)); // 3
```

1. 클래스 필드 선언과 초기화는 별개의 과정임.
2. 컴파일 후 자바스크립트로 변환되면 타입 선언은 사라지고 실제 할당만 남음.

```javascript
class ChatGpt {
  constructor(name) {
    this.name = name;  // 타입 선언은 사라지고 실제 할당만 남습니다
  }
}
```

3. TypeScript의 타입 시스템 작동 방식:
- name: string 은 컴파일 타임에만 존재하는 타입 정보입니다
- this.name = name 은 런타임에 실제로 실행되는 값 할당입니다



# SECTION 5: 클래스 접근 제어자

클래스의 타입을 정의할 때 알아두면 좋은 접근 제어자를 알아보자.

필요성

```typescript
class Person {
  name: string;
  skill: string;
  
  constructor(name: string, skill: string) {
      this.name = name;
      this.skill = skill;
  }
}

const capt = new Person('캡틴', '방패던지기');
console.log(capt.name); // 캡틴
```

위처럼 선언하면, 불변성을 해치게 된다.

```typescript
let capt = new Person('캡틴', '방패던지기');
console.log(capt.name); // 캡틴
capt.name = '헐크'; // 가능
console.log(capt.name); // 헐크
```

다른 예시:

```typescript
class WaterPurifier {
  waterAmount: number;
  
  constructor(waterAmount: number) {
    this.waterAmount = waterAmount;
  }
  
  wash()  {
    if (this.waterAmount > 0) {
      console.log('정수기 동작 성공');
    }
  }
}

let purifier = new WaterPurifier(100); // 정수기 동작 성공
```

근데 만약 객체에 접근해서 물의 양을 0으로 바꾼다면:

```typescript
let purifier = new WaterPurifier(100);
purifier.waterAmount = 0;
purifier.wash(); // 정수기 동작 성공이라는 메세지가 출력되지 않음.
```

이럴때 사용할 수 있는것이 클래스 접근 제어자이다.

타입스크립트의 클래스 접근 제어자는 3가지가 있다.

1. public
2. private
3. protected

```typescript
class WaterPurifier {
  public waterAmount: number;
  
  constructor(waterAmount: number) {
    this.waterAmount = waterAmount;
  }
  
  wash()  {
    if (this.waterAmount > 0) {
      console.log('정수기 동작 성공');
    }
  }
}
```

private 을 사용하면:

```typescript
class WaterPurifier {
  private waterAmount: number;
  
  constructor(waterAmount: number) {
    this.waterAmount = waterAmount;
  }
  
  wash()  {
    if (this.waterAmount > 0) {
      console.log('정수기 동작 성공');
    }
  }
}

let purifier = new WaterPurifier(100);
purifier.waterAmount = 0; // Error
```

protected 는 상속받은 클래스에서만 접근 가능하다.

```typescript
class WaterPurifier {
  protected waterAmount: number;
  
  constructor(waterAmount: number) {
    this.waterAmount = waterAmount;
  }
  
  wash()  {
    if (this.waterAmount > 0) {
      console.log('정수기 동작 성공');
    }
  }
}

class NewWaterPurifier extends WaterPurifier {
  checkWaterAmount() {
    console.log(this.waterAmount);
  }
}

let purifier = new WaterPurifier(100);
purifier.waterAmount = 0; // Error

let newPurifier = new NewWaterPurifier(100);
newPurifier.checkWaterAmount(); // 100
```

주의 해야할 점은 접근 범위에 따라 실행까지 막아주지 않는다는 것이다.

```typescript
class WaterPurifier {
  private waterAmount: number;
  
  constructor(waterAmount: number) {
    this.waterAmount = waterAmount;
  }
  
  wash()  {
    if (this.waterAmount > 0) {
      console.log('정수기 동작 성공');
    }
  }
}

let purifier = new WaterPurifier(100);
purifier.wash(); // 정수기 동작 성공
purifier.waterAmount = 0; // Error
purifier.wash(); // 정수기 동작 성공
```

이처럼 타입스크립트는 '실행 시점' 에서는 에러를 보장해주지 못한다. 이점이 타입스크립트는 컴파일 타임에만 타입 보장을 해준다는 말이 된다.

이것을 해결하려면 # 을 사용하면 된다.

```typescript
class WaterPurifier {
  #waterAmount: number;
  
  constructor(waterAmount: number) {
    this.#waterAmount = waterAmount;
  }
  
  wash()  {
    if (this.#waterAmount > 0) {
      console.log('정수기 동작 성공');
    }
  }
}

let purifier = new WaterPurifier(100);
purifier.wash(); // 정수기 동작 성공
purifier.waterAmount = 0; // Error
purifier.wash(); // 정수기 동작 성공
```

만약 # 을 넣고 싶으면 target 속성을 2015 이상으로 변경해주어야함.