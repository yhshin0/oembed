import { Body, Controller, Post } from '@nestjs/common';

import { UrlDto } from './dto/url.dto';
import { OembedService } from './oembed.service';

@Controller('oembed')
export class OembedController {
  constructor(private oembedService: OembedService) {}

  @Post()
  async getOembedData(@Body() urlDto: UrlDto): Promise<any> {
    return await this.oembedService.getOembedData(urlDto);
  }
}
