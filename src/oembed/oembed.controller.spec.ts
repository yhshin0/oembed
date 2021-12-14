import { Test, TestingModule } from '@nestjs/testing';
import { OembedController } from './oembed.controller';

describe('OembedController', () => {
  let controller: OembedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OembedController],
    }).compile();

    controller = module.get<OembedController>(OembedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
