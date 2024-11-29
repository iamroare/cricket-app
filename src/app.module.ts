import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
const Joi = require('joi');

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MatchModule } from './match/match.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production').required(),
        LOCAL_URI: Joi.string().required(),
      }),
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const dbUri = configService.get('LOCAL_URI');
        console.log('Using Local MongoDB for development or production');
        return {
          uri: dbUri,
        };
      },
      inject: [ConfigService],
    }),

    MatchModule, // Ensure MatchModule is correctly imported
  ],
  controllers: [AppController],
  providers: [AppService], // Removed MatchService from here
})
export class AppModule {}