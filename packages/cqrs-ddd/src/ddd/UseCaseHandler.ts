import { CommandHandler } from '@nestjs/cqrs';

import { Command } from '../cqrs/Command';
import { ClassOf } from '../types/ClassOf';

export const UseCaseHandler = <T extends Command<any>>(command: ClassOf<T>): ClassDecorator =>
  CommandHandler(command);
