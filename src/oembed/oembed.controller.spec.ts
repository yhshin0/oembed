import { Test, TestingModule } from '@nestjs/testing';

import { UrlDto } from './dto/url.dto';
import { OembedController } from './oembed.controller';
import { OembedService } from './oembed.service';

jest.mock('./oembed.service');

describe('OembedController', () => {
  let oembedController: OembedController;
  let oembedService: OembedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OembedController],
      providers: [OembedService],
    }).compile();

    oembedController = module.get<OembedController>(OembedController);
    oembedService = module.get<OembedService>(OembedService);
  });

  it('should be defined', () => {
    expect.assertions(2);
    expect(oembedController).toBeDefined();
    expect(oembedService).toBeDefined();
  });

  describe('getOembedData', () => {
    const url = 'https://www.youtube.com/watch?v=dBD54EZIrZo';
    const urlDto = new UrlDto();

    const APIresult = {
      title:
        '언제 어디서나! 핑크퐁 BEST 모음 80분 | 차에서 듣는 동요 | 아기상어, 상어가족 외 70곡 | + 모음집 | 핑크퐁! 인기동요',
      author_name: '핑크퐁 (인기 동요・동화)',
      author_url: 'https://www.youtube.com/c/pinkfongko',
      type: 'video',
      height: 113,
      width: 200,
      version: '1.0',
      provider_name: 'YouTube',
      provider_url: 'https://www.youtube.com/',
      thumbnail_height: 360,
      thumbnail_width: 480,
      thumbnail_url: 'https://i.ytimg.com/vi/dBD54EZIrZo/hqdefault.jpg',
      html: '<iframe width="200" height="113" src="https://www.youtube.com/embed/dBD54EZIrZo?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
    };

    beforeEach(() => {
      urlDto.url = url;
    });

    it('oEmbed data를 가져오는 데 성공한다', async () => {
      jest.spyOn(oembedService, 'getOembedData').mockResolvedValue(APIresult);
      const result = await oembedController.getOembedData(urlDto);
      expect(result).toEqual(APIresult);
    });
  });
});
