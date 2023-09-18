import { Test, TestingModule } from "@nestjs/testing";
import { Prisma, PrismaClient } from "@prisma/client";
import { INestApplication, ModuleMetadata } from "@nestjs/common";

export interface BuildIntegrationTestHookProps<T extends PrismaClient> {
  PrismaService: { new (): T };
  clearDb: (prisma: T) => Promise<void>;
  fillDb: (prisma: T) => Promise<void>;
  callback: (moduleRef: TestingModule, app: INestApplication) => Promise<void>;
  moduleMetadata: ModuleMetadata;
}

const emptyFn = async () => {};

export class IntegrationTestHookBuilder<T extends PrismaClient> {
  private buildProps: BuildIntegrationTestHookProps<T> = {
    PrismaService: PrismaClient,
    callback: emptyFn,
    fillDb: emptyFn,
    clearDb: emptyFn,
    moduleMetadata: {},
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

  public setCallback(cb: (moduleRef: TestingModule, app: INestApplication) => Promise<void>) {
    this.buildProps.callback = cb;
    return this;
  }

  public setModuleMetadata(metadata: ModuleMetadata) {
    this.buildProps.moduleMetadata = metadata;
    return this;
  }

  public build() {
    return () => {
      let prisma: PrismaClient;
      let app: INestApplication;

      beforeAll(async () => {
        const moduleRef = await Test.createTestingModule(this.buildProps.moduleMetadata).compile();
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
