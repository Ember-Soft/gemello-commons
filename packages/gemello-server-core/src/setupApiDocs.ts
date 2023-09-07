import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export interface SetupApiDocsOptions {
  title: string;
  description: string;
  version?: string;
}

export function setupApiDocs(
  app: INestApplication,
  { title, description, version = "1.0" }: SetupApiDocsOptions
) {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);
}
