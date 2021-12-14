import { IsString, IsUrl } from 'class-validator';

export class UrlDto {
  @IsString({ message: 'url을 반드시 입력해야 합니다' })
  @IsUrl(
    { require_protocol: true },
    { message: '올바른 url 형태가 아닙니다(ex: http://youtube.com)' },
  )
  url: string;
}
