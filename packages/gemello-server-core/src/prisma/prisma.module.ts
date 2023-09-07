import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

export class PrismaModule {
  public static forRoot(providers: Provider[] = []): DynamicModule {
    return {
      global: true,
      providers: [PrismaService, ...providers],
      exports: [PrismaService, ...providers],
      module: PrismaModule,
    };
  }
}
