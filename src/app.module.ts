import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OembedModule } from './oembed/oembed.module';

@Module({
  imports: [OembedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
