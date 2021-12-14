import { Test, TestingModule } from '@nestjs/testing';
import { OembedService } from './oembed.service';

describe('OembedService', () => {
  let service: OembedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OembedService],
    }).compile();

    service = module.get<OembedService>(OembedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
