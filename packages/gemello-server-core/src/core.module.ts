import {
  DynamicModule,
  ForwardReference,
  Module,
  Provider,
  Type,
  ValidationPipe,
  ModuleMetadata,
} from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

interface CoreModuleMetadata extends ModuleMetadata {
  jwtSecret: string;
}

export class CoreModule {
  public static forRoot(
    {
      providers = [],
      exports = [],
      imports = [],
      jwtSecret,
    }: CoreModuleMetadata = { jwtSecret: "" }
  ): DynamicModule {
    return {
      providers: [
        { provide: APP_PIPE, useValue: new ValidationPipe() },
        ...providers,
      ],
      imports: [
        PrismaModule.forRoot(),
        ConfigModule.forRoot({
          envFilePath: ".env",
          isGlobal: true,
        }),
        JwtModule.register({
          global: true,
          secret: jwtSecret,
        }),
        ...imports,
      ],
      exports,
      module: CoreModule,
    };
  }
}
