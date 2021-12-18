import { IsString, IsUrl } from 'class-validator';
import { OEMBED_ERROR_MSG } from '../constants';

export class UrlDto {
  @IsString({ message: OEMBED_ERROR_MSG.EMPTY_URL })
  @IsUrl(
    { protocols: ['http', 'https'] },
    { message: OEMBED_ERROR_MSG.INVALID_URL },
  )
  url: string;
}
