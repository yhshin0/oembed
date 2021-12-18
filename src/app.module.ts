import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { OembedModule } from './oembed/oembed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OembedModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
