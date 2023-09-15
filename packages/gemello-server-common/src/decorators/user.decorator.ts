import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { GemelloUser } from "../types/user";

export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): GemelloUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
