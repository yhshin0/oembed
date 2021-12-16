import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';

import { OEMBED_ERROR_MSG } from './constants';
import { UrlDto } from './dto/url.dto';
import { OembedSpecEndpointUrlAndSchemes, OembedSpecList } from './interfaces';

@Injectable()
export class OembedService {
  oembedSpecEndpointUrlAndSchemesList: OembedSpecEndpointUrlAndSchemes[];
  constructor(private httpService: HttpService) {}

  async getOembedSpecList(): Promise<OembedSpecList[]> {
    const oembedSpecUrl = 'https://oembed.com/providers.json';
    const observer = this.httpService
      .get(oembedSpecUrl)
      .pipe(map((axiosResponse) => axiosResponse.data));
    return await lastValueFrom(observer).catch(() => {
      throw new InternalServerErrorException(
        OEMBED_ERROR_MSG.FAIL_TO_FETCH_OEMBED_SPEC,
      );
    });
  }

  async setOembedSpecEndpointUrlAndSchemesList(): Promise<void> {
    if (this.oembedSpecEndpointUrlAndSchemesList) {
      return;
    }

    const specList = await this.getOembedSpecList();
    this.oembedSpecEndpointUrlAndSchemesList = [];

    for (const spec of specList) {
      for (const endpoint of spec.endpoints) {
        const schemesList = [];

        endpoint.schemes?.map((scheme) => {
          const newScheme = scheme.replace(/\./g, '\\.').replace(/\*/g, '\\w');
          schemesList.push(new RegExp(newScheme));
        });

        this.oembedSpecEndpointUrlAndSchemesList.push({
          schemes: schemesList,
          url: endpoint.url.replace('{format}', 'json'),
        });
      }
    }
  }

  async getOembedData(urlDto: UrlDto): Promise<string> {
    await this.setOembedSpecEndpointUrlAndSchemesList();

    const url = urlDto.url;
    const matchedOembedSpec = this.getMatchedOembedSpec(url);
    if (!matchedOembedSpec) {
      throw new BadRequestException(OEMBED_ERROR_MSG.NOT_MATCH_PROVIDER);
    }

    const newUrl = matchedOembedSpec.url + `?url=${url}`;
    const observer = this.httpService
      .get(newUrl)
      .pipe(map((axiosResponse) => axiosResponse.data));
    return await lastValueFrom(observer).catch(() => {
      throw new InternalServerErrorException(
        OEMBED_ERROR_MSG.FAIL_TO_FETCH_OEMBED_DATA,
      );
    });
  }

  getMatchedOembedSpec(url: string): OembedSpecEndpointUrlAndSchemes {
    for (const oembedSpec of this.oembedSpecEndpointUrlAndSchemesList) {
      for (const scheme of oembedSpec.schemes) {
        if (url.search(scheme) !== -1) {
          return oembedSpec;
        }
      }
    }
    return null;
  }
}
