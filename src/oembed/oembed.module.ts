import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { OembedController } from './oembed.controller';
import { OembedService } from './oembed.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [OembedController],
  providers: [OembedService],
})
export class OembedModule {}
