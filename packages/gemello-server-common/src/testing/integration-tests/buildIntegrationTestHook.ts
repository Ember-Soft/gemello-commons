import {
  INestApplication,
  ModuleMetadata,
  Provider,
  ValueProvider,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";

export interface BuildIntegrationTestHookProps<T extends PrismaClient> {
  PrismaService: { new (): T };
  clearDb: (prisma: T) => Promise<void>;
  fillDb: (prisma: T) => Promise<void>;
  callback: (moduleRef: TestingModule, app: INestApplication) => Promise<void>;
  moduleMetadata: ModuleMetadata;
  overrideProviders: OverrideProvider[];
}

const emptyFn = async () => {};
export type Class<T> = { new (): T };

interface OverrideProvider {
  provider: symbol | string | Class<any>;
  value: any;
}

export class IntegrationTestHookBuilder<T extends PrismaClient> {
  private buildProps: BuildIntegrationTestHookProps<T> = {
    PrismaService: PrismaClient,
    callback: emptyFn,
    fillDb: emptyFn,
    clearDb: emptyFn,
    moduleMetadata: {},
    overrideProviders: [],
  };

  public setPrismaClient(Prisma: { new (): T }) {
    this.buildProps.PrismaService = Prisma;
    return this;
  }

  public setClearDb(cb: (prisma: T) => Promise<void>) {
    this.buildProps.clearDb = cb;
    return this;
  }

  public setFillDb(cb: (prisma: T) => Promise<void>) {
    this.buildProps.fillDb = cb;
    return this;
  }

  public extend(builder: IntegrationTestHookBuilder<T>) {
    this.buildProps = { ...this.buildProps, ...builder.buildProps };
    return this;
  }

  public setCallback(
    cb: (moduleRef: TestingModule, app: INestApplication) => Promise<void>
  ) {
    this.buildProps.callback = cb;
    return this;
  }

  public setModuleMetadata(metadata: ModuleMetadata) {
    this.buildProps.moduleMetadata = metadata;
    return this;
  }

  public overrideProvider(overrideProvider: OverrideProvider) {
    this.buildProps.overrideProviders.push(overrideProvider);
    return this;
  }

  public build() {
    return () => {
      let prisma: PrismaClient;
      let app: INestApplication;

      beforeAll(async () => {
        let testModuleBuilder = Test.createTestingModule(
          this.buildProps.moduleMetadata
        );

        this.buildProps.overrideProviders.forEach(({ provider, value }) => {
          testModuleBuilder = testModuleBuilder
            .overrideProvider(provider)
            .useValue(value);
        });

        const moduleRef = await testModuleBuilder.compile();

        prisma = moduleRef.get<T>(this.buildProps.PrismaService);
        app = moduleRef.createNestApplication();

        await this.buildProps.callback(moduleRef, app);
        await app.init();
      });

      beforeEach(async () => {
        await this.buildProps.clearDb(prisma);
        await this.buildProps.fillDb(prisma);
      });

      afterAll(async () => {
        await this.buildProps.clearDb(prisma);
        await app.close();
      });
    };
  }
}
