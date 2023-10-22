import { IEvent } from '@nestjs/cqrs';

export abstract class DomainEvent implements IEvent {
  private readonly timestamp = Date.now();
}
