import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { UrlDto } from './dto/url.dto';
import { OembedService } from './oembed.service';

@Controller('oembed')
export class OembedController {
  constructor(private oembedService: OembedService) {}

  @Post()
  @HttpCode(200)
  async getOembedData(@Body() urlDto: UrlDto): Promise<any> {
    return await this.oembedService.getOembedData(urlDto);
  }
}
