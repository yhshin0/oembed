import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';

import { OembedSpecList } from './interfaces';

@Injectable()
export class OembedService {
  oembedSpecList: Promise<OembedSpecList[]>;
  constructor(private httpService: HttpService) {
    this.oembedSpecList = this.getOembedSpec();
  }

  async getOembedSpec(): Promise<OembedSpecList[]> {
    const oembedSpecUrl = 'https://oembed.com/providers.json';
    const observer = this.httpService
      .get(oembedSpecUrl)
      .pipe(map((axiosResponse) => axiosResponse.data));
    return await lastValueFrom(observer);
  }
}
