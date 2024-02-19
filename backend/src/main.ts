import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.STAGE !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('backend')
      .setDescription('The API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('openapi', app, document);
  }

  await app.listen(3000);
}
bootstrap();

console.log('foo');
