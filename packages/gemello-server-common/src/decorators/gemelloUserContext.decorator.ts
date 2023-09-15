import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { GemelloUser } from "../types/user";

export interface GemelloUserContext {
  token: string | undefined;
  user: GemelloUser;
}

export const GemelloUserContext = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): GemelloUserContext => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.token;
    const user = request.user;
    return { token, user };
  }
);
