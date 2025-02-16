export interface IValueProvider<T> {
  value(): T;
}

export interface IAddable<T> {
  add(value: T): this;
}

export interface IMultiplayable<T> {
  multiply(value: T): this;
}