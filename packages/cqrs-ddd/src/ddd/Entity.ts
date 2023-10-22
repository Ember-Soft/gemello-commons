import { AggregateRoot } from '@nestjs/cqrs';

export interface CreateEntityProps<T> {
  id: string;
  props: T;
  updatedAt?: Date;
  createdAt?: Date;
}

export abstract class Entity<EntityProps> extends AggregateRoot {
  protected readonly props: EntityProps;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;
  private readonly _id: string;

  constructor({ props, createdAt, updatedAt, id }: CreateEntityProps<EntityProps>) {
    super();
    const now = new Date();
    this.props = props;
    this._createdAt = createdAt ?? now;
    this._updatedAt = updatedAt ?? now;
    this._id = id;
    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  static isEntity(entity: unknown): entity is Entity<unknown> {
    return entity instanceof Entity;
  }

  public equals(object?: Entity<EntityProps>): boolean {
    if (object === null || object === undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!Entity.isEntity(object)) {
      return false;
    }

    return this.id ? this.id === object.id : false;
  }

  public abstract validate(): void;
}
