import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Global()
@Module({ providers: [PrismaService], exports: [PrismaService] })
export class PrismaModule {
  public static forRoot(providers: Provider[]): DynamicModule {
    return {
      global: true,
      providers,
      exports: providers,
      module: PrismaModule,
    };
  }
}
