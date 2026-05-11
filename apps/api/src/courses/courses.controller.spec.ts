import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

const mockCoursesService = {
  findAll: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue({}),
  create: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({}),
  remove: jest.fn().mockResolvedValue({}),
  updateStatus: jest.fn().mockResolvedValue({}),
};

describe('CoursesController', () => {
  let controller: CoursesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [{ provide: CoursesService, useValue: mockCoursesService }],
    }).compile();
    controller = module.get<CoursesController>(CoursesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
