import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';

import { OEMBED_ERROR_MSG } from './constants';
import { OembedSpecList } from './interfaces';

@Injectable()
export class OembedService {
  oembedSpecList: OembedSpecList[];
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

  async setOembedSpecList(): Promise<void> {
    if (this.oembedSpecList) {
      return;
    }
    this.oembedSpecList = await this.getOembedSpecList();
  }
}
