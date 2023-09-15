import { ConfigService } from "@nestjs/config";
import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { BaseUrl, HttpFacade } from "./httpFacade";

interface HttpFacadesConfig {
  serviceUrlsConfig: string[];
}

async function getHttpFacade(
  injectSymbol: string,
  configService: ConfigService
) {
  const baseUrlConfigKey = `${injectSymbol}_URL`;
  const baseUrl = configService.get(baseUrlConfigKey);

  if (!baseUrl) {
    throw new Error(`Cannot find ${baseUrlConfigKey} in environemt variables`);
  }

  return new HttpFacade(baseUrl);
}

export class HttpFacadeModule {
  static forRoot(facadesConfig: HttpFacadesConfig): DynamicModule {
    const providers: Provider[] = facadesConfig.serviceUrlsConfig.map(
      (injectSymbol) => ({
        provide: injectSymbol,
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) =>
          getHttpFacade(injectSymbol, configService),
      })
    );

    return {
      module: HttpFacadeModule,
      providers,
      global: true,
      exports: providers,
    };
  }
}
