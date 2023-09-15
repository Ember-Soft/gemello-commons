import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

type MemberRole = "ASSISTANT" | "BENEFICIARY" | "MANAGER";

interface OrganizationTokenPayload {
  orgId: number;
  roles: MemberRole[];
}

interface TokenPayload {
  sub: string;
  name: string;
  belongsTo: OrganizationTokenPayload[];
  iat: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequestHeader(request);

    if (token === undefined) {
      throw new UnauthorizedException();
    }

    try {
      const payload: TokenPayload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get("JWT_SECRET"),
      });

      request["user"] = {
        userId: payload.sub,
        userName: payload.name,
        belongsTo: payload.belongsTo,
      };
      request["token"] = token;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromRequestHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
