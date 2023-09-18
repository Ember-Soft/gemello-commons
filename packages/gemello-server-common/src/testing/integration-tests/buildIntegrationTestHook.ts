import { Test, TestingModule } from "@nestjs/testing";
import { Prisma, PrismaClient } from "@prisma/client";
import { ModuleMetadata } from "@nestjs/common";

export interface BuildIntegrationTestHookProps<T extends PrismaClient> {
  PrismaService: { new (): T };
  clearDb: (prisma: T) => Promise<void>;
  fillDb: (prisma: T) => Promise<void>;
  callback: (moduleRef: TestingModule) => Promise<void>;
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

  public setCallback(cb: (moduleRef: TestingModule) => Promise<void>) {
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

      beforeEach(async () => {
        const moduleRef = await Test.createTestingModule(this.buildProps.moduleMetadata).compile();

        prisma = moduleRef.get<T>(this.buildProps.PrismaService);

        await this.buildProps.clearDb(prisma);
        await this.buildProps.callback(moduleRef);
      });

      beforeEach(() => prisma.$transaction((tx) => this.buildProps.fillDb(tx)));

      afterAll(() => this.buildProps.clearDb(prisma));
    };
  }
}
