import { EventPublisher } from '@nestjs/cqrs';

import { Entity } from './Entity';

export abstract class Aggregate<AggregateProps> extends Entity<AggregateProps> {
  public async emitEvents(eventPublisher: EventPublisher): Promise<void> {
    eventPublisher.mergeObjectContext(this);
    this.commit();
  }
}
