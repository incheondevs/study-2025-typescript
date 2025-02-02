# F-바운드 다형성 (F-bounded Polymorphism)

## 1. 다형성의 두 가지 유형 비교

### 1.1 일반적인 다형성
- 부모-자식 단방향 관계
- 부모는 자식 타입을 모름
- 상속/구현을 통한 다형성 구현

```typescript
interface Animal {
    makeSound(): void;
}

class Dog implements Animal {
    makeSound() {
        console.log("Woof!");
    }
}

class Cat implements Animal {
    makeSound() {
        console.log("Meow!");
    }
}
```

### 1.2 F-바운드 다형성
- 자기 자신을 참조하는 타입
- 메서드 체이닝 가능
- this 타입을 활용한 구현

## 2. F-바운드 타입의 종류

### 2.1 일반 타입
```typescript
export interface IValueProvider<T> {
    value(): T;
}
```

### 2.2 F-바운드 타입
```typescript
export interface IAddable<T> {
    add(value: T): this;
}

export interface IMultiplayable<T> {
    multiply(value: T): this;
}
```

## 3. 구현 예시

### 3.1 Calculator 클래스

```typescript
export class Calculator implements IValueProvider<number>, 
    IAddable<number>, 
    IMultiplayable<number> {
    
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

### 3.2 StringComposer 클래스

```typescript
export class StringComposer implements IValueProvider<string>, 
    IAddable<string>, 
    IMultiplayable<number> {
    
    constructor(private _value: string = '') {}
    
    value(): string {
        return this._value;
    }
    
    add(value: string): this {
        this._value = this._value.concat(value);
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

## 4. 메서드 체이닝 예시

### 4.1 Calculator 사용 예시
```typescript
const value = (new Calculator(0))
    .add(2)      // 2
    .add(3)      // 5
    .multiply(4) // 20
    .value();    // 최종값 얻기

console.log(value); // 20
```

### 4.2 StringComposer 사용 예시
```typescript
const value = (new StringComposer('TypeScript'))
    .add(' is')
    .add(' awesome')
    .multiply(2)
    .value();

console.log(value); // TypeScript is awesomeTypeScript is awesome
```

## 5. Nullable 타입과 프로그램 안전성

### 5.1 Nullable 타입
```typescript
export type nullable = undefined | null;
```

### 5.2 Option 타입 구현

#### Some 클래스
```typescript
export class Some<T> implements IValueable<T>, IFunction<T> {
    constructor(private value: T) {}

    getOrElse(defaultValue: T): T {
        return this.value;
    }

    map<U>(fn: IFunction<T, U>): Some<U> {
        return new Some<U>(fn(this.value));
    }
}
```

#### None 클래스
```typescript
export class None implements IValueable<null>, IFunction<null> {
    getOrElse(defaultValue: null): null {
        return defaultValue;
    }

    map<U>(fn: IFunction<null, U>): None {
        return new None();
    }
}
```

### 5.3 Option 타입 활용 예시

#### 숫자 파싱
```typescript
export const parseNumber = (str: string): Option<number> => {
    const parsed = parseInt(str);
    return isNaN(parsed) ? new None() : new Some(parsed);
}
```

#### JSON 파싱
```typescript
export const parseJson = <T>(json: string): IValueable<T> & IFunction<T> => {
    try {
        const value = JSON.parse(json);
        return Option.Some<T>(value);
    } catch(e) {
        return Option.None;
    }
}
```

## 6. 장점과 주의사항

### 장점
- 타입 안전성 보장
- 메서드 체이닝을 통한 가독성 향상
- 코드 재사용성 증가
- 예외 처리의 우아한 구현

### 주의사항
- this 타입은 메서드 체이닝을 위해서만 사용
- 과도한 체이닝은 디버깅을 어렵게 만들 수 있음
- Option 타입 사용 시 성능 고려 필요
