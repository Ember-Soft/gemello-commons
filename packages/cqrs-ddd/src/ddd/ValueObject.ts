type ValueObjectProps<T> = T;

export abstract class ValueObject<T> {
  protected readonly props: ValueObjectProps<T>;

  constructor(props: ValueObjectProps<T>) {
    this.validate();
    this.props = props;
  }

  static isValueObject(obj: unknown): obj is ValueObject<unknown> {
    return obj instanceof ValueObject;
  }

  public getProps(): T {
    return Object.freeze(this.props);
  }

  public abstract validate(): void;
}
