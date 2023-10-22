import { ICommand } from '@nestjs/cqrs';

export abstract class Command<Payload> implements ICommand {
  public abstract payload: Payload;
}
