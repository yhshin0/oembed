import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OembedModule } from './oembed/oembed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OembedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
