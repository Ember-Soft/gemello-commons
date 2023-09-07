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

@Module({
  providers: [{ provide: APP_PIPE, useValue: new ValidationPipe() }],
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
  ],
})
export class CoreModule {
  public static forRoot({
    providers,
    exports,
    imports,
  }: ModuleMetadata): DynamicModule {
    return {
      providers: [
        { provide: APP_PIPE, useValue: new ValidationPipe() },
        ...providers,
      ],
      imports: [
        ConfigModule.forRoot({
          envFilePath: ".env",
          isGlobal: true,
        }),
        JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET,
        }),
        ...imports,
      ],
      exports,
      module: CoreModule,
    };
  }
}
