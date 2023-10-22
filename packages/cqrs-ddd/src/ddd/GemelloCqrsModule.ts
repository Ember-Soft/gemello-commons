import { Module, ModuleMetadata } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

interface CqrsModuleOptions extends ModuleMetadata {
  queryHandlers?: ModuleMetadata['providers'];
  useCases?: ModuleMetadata['providers'];
  eventHandlers?: ModuleMetadata['providers'];
  mappers?: ModuleMetadata['providers'];
  commandHandlers?: ModuleMetadata['providers'];
}

export const GemelloCqrsModule = ({
  controllers,
  commandHandlers = [],
  eventHandlers = [],
  exports = [],
  imports = [],
  mappers = [],
  providers = [],
  queryHandlers = [],
  useCases = [],
}: CqrsModuleOptions): ClassDecorator =>
  Module({
    controllers,
    exports,
    imports: [...imports, CqrsModule],
    providers: [
      ...providers,
      ...commandHandlers,
      ...eventHandlers,
      ...mappers,
      ...queryHandlers,
      ...useCases,
    ],
  });
