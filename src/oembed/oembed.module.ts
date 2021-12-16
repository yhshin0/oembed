import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { OembedController } from './oembed.controller';
import { OembedService } from './oembed.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    ConfigModule,
  ],
  controllers: [OembedController],
  providers: [OembedService],
})
export class OembedModule {}
