// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3010); 
// }
// bootstrap();


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with custom configuration
  app.enableCors({
    origin: 'http://localhost:3000', // Allow only React frontend
    methods: ['GET', 'POST'], // Allow only GET and POST methods
    allowedHeaders: ['Content-Type'], // Specify allowed headers
  });

  // Start the NestJS app on port 3010
  await app.listen(3010);
}

bootstrap();
 