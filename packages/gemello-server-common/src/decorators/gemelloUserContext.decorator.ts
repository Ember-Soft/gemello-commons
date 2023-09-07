import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export interface GemelloUserContext {
  token: string | undefined;
}

export const GemelloUserContext = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): GemelloUserContext => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.headers.authorization;
    return { token };
  },
);
