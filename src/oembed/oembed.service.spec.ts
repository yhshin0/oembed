import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';

import { OEMBED_ERROR_MSG } from './constants';
import { UrlDto } from './dto/url.dto';
import { OembedService } from './oembed.service';

const mockHttpService = () => ({
  get: jest.fn(),
});

const mockConfigService = () => ({
  get: jest.fn(),
});

describe('OembedService', () => {
  let oembedService: OembedService;
  let httpService: HttpService;
  let configService: ConfigService;

  const mockOembedSpecList = [
    {
      provider_name: '23HQ',
      provider_url: 'http://www.23hq.com',
      endpoints: [
        {
          schemes: ['http://www.23hq.com/*/photo/*'],
          url: 'http://www.23hq.com/23/oembed',
        },
      ],
    },
    {
      provider_name: 'Instagram',
      provider_url: 'https://instagram.com',
      endpoints: [
        {
          schemes: [
            'http://instagram.com/*/p/*',
            'http://www.instagram.com/*/p/*',
          ],
          url: 'https://graph.facebook.com/v10.0/instagram_oembed',
          formats: ['json'],
        },
      ],
    },
  ];

  const mockOembedSpecEndpointUrlAndSchemesList = [
    {
      schemes: [/http:\/\/www\.23hq\.com\/.+\/photo\/.+/],
      url: 'http://www.23hq.com/23/oembed',
    },
    {
      schemes: [
        /http:\/\/instagram\.com\/.+\/p\/.+/,
        /http:\/\/www\.instagram\.com\/.+\/p\/.+/,
      ],
      url: 'https://graph.facebook.com/v10.0/instagram_oembed',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OembedService,
        { provide: HttpService, useValue: mockHttpService() },
        { provide: ConfigService, useValue: mockConfigService() },
      ],
    }).compile();

    oembedService = module.get<OembedService>(OembedService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect.assertions(3);
    expect(oembedService).toBeDefined();
    expect(httpService).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe('getOembedSpecList', () => {
    it('oEmbed spec 리스트를 가져오는 데 성공한다', async () => {
      const mockAxiosResponse = {
        headers: {},
        config: { url: 'http://localhost:3000/mockUrl' },
        status: 200,
        statusText: 'OK',
        data: mockOembedSpecList,
      };
      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of(mockAxiosResponse));
      const result = await oembedService.getOembedSpecList();
      expect(result).toEqual(mockAxiosResponse.data);
    });

    it('oEmbed spec 리스트를 가져오는 데 실패한다', async () => {
      expect.assertions(2);
      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => throwError(() => new Error()));
      try {
        const result = await oembedService.getOembedSpecList();
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual(
          OEMBED_ERROR_MSG.FAIL_TO_FETCH_OEMBED_SPEC,
        );
      }
    });
  });

  describe('setOembedSpecEndpointUrlAndSchemesList', () => {
    it('oEmbed spec에서 endpoint url과 scheme들을 추출하여 저장하는 데 성공한다', async () => {
      jest
        .spyOn(oembedService, 'getOembedSpecList')
        .mockResolvedValue(mockOembedSpecList);
      await oembedService.setOembedSpecEndpointUrlAndSchemesList();
      expect(oembedService.oembedSpecEndpointUrlAndSchemesList).toEqual(
        mockOembedSpecEndpointUrlAndSchemesList,
      );
    });

    it('이미 oembedSpecEndpointUrlAndSchemesList를 저장하여 리턴한다', async () => {
      (oembedService.oembedSpecEndpointUrlAndSchemesList as any) =
        mockOembedSpecEndpointUrlAndSchemesList;
      await oembedService.setOembedSpecEndpointUrlAndSchemesList();
      expect(jest.spyOn(oembedService, 'getOembedSpecList')).toBeCalledTimes(0);
    });
  });

  describe('getOembedData', () => {
    it('oEmbed data를 가져오는 데 성공한다', async () => {
      jest
        .spyOn(oembedService, 'getOembedSpecList')
        .mockResolvedValue(mockOembedSpecList);
      const url = 'http://www.23hq.com/asdf/photo/asdf';
      const urlDto = new UrlDto();
      urlDto.url = url;

      const mockData = {
        video_id: 20097015,
        uri: '/videos/20097015',
      };

      const mockAxiosResponse = {
        headers: {},
        config: { url },
        status: 200,
        statusText: 'OK',
        data: mockData,
      };

      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of(mockAxiosResponse));
      const result = await oembedService.getOembedData(urlDto);
      expect(result).toEqual(mockData);
    });

    it('instagram의 oEmbed data를 가져오는 데 성공한다', async () => {
      jest
        .spyOn(oembedService, 'getOembedSpecList')
        .mockResolvedValue(mockOembedSpecList);
      const url = 'http://www.instagram.com/gggg/p/dsij';
      const urlDto = new UrlDto();
      urlDto.url = url;

      const mockData = {
        video_id: 20097015,
        uri: '/videos/20097015',
      };

      const mockAxiosResponse = {
        headers: {},
        config: { url },
        status: 200,
        statusText: 'OK',
        data: mockData,
      };

      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of(mockAxiosResponse));
      const result = await oembedService.getOembedData(urlDto);
      expect(result).toEqual(mockData);
    });

    it('일치하는 oEmbed spec이 없어서 실패한다', async () => {
      expect.assertions(2);
      jest
        .spyOn(oembedService, 'getOembedSpecList')
        .mockResolvedValue(mockOembedSpecList);
      const url = 'http://www.wrongurl.com/gggg';
      const urlDto = new UrlDto();
      urlDto.url = url;

      try {
        const result = await oembedService.getOembedData(urlDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual(OEMBED_ERROR_MSG.NOT_MATCH_PROVIDER);
      }
    });

    it('oEmbed data를 가져오는 데 실패한다', async () => {
      expect.assertions(2);
      jest
        .spyOn(oembedService, 'getOembedSpecList')
        .mockResolvedValue(mockOembedSpecList);
      const url = 'http://www.23hq.com/asdf/photo/wrong';
      const urlDto = new UrlDto();
      urlDto.url = url;

      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => throwError(() => new Error()));
      try {
        const result = await oembedService.getOembedData(urlDto);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual(
          OEMBED_ERROR_MSG.FAIL_TO_FETCH_OEMBED_DATA,
        );
      }
    });
  });
});
