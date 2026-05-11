import { Test, TestingModule } from '@nestjs/testing';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';

const mockLessonsService = {
  findByCourse: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue({}),
  create: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({}),
  remove: jest.fn().mockResolvedValue({}),
  saveContent: jest.fn().mockResolvedValue({}),
  getContent: jest.fn().mockResolvedValue({}),
  markComplete: jest.fn().mockResolvedValue({}),
  getCompletedLessons: jest.fn().mockResolvedValue([]),
};

describe('LessonsController', () => {
  let controller: LessonsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonsController],
      providers: [{ provide: LessonsService, useValue: mockLessonsService }],
    }).compile();
    controller = module.get<LessonsController>(LessonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
