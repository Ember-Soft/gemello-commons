import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Token = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.token;
  },
);
