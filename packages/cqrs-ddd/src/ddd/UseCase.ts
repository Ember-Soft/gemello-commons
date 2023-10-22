import { ICommandHandler } from '@nestjs/cqrs';

import { Command } from '../cqrs/Command';

export abstract class UseCase<
  TPayload,
  TResult,
  TCommand extends Command<TPayload> = Command<TPayload>,
> implements ICommandHandler<TCommand, TResult>
{
  protected abstract call(payload: TPayload): Promise<TResult>;

  execute(command: TCommand): Promise<TResult> {
    return this.call(command.payload);
  }
}
