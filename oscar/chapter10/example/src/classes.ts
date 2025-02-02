import {IValueProvider} from "./interfaces/interfaces";

export class Calculator implements IValueProvider<number> {
  constructor(public _value: number = 0) {}

  value(): number {
    return this._value;
  }
}

export class StringComposer implements IValueProvider<string> {
  constructor(private _value: string = '') {}

  value(): string {
    return this._value;
  }
}