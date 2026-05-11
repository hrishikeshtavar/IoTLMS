import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';

const mockEnrollmentsService = {
  enroll: jest.fn().mockResolvedValue({}),
  getEnrollments: jest.fn().mockResolvedValue([]),
  getAllByTenant: jest.fn().mockResolvedValue([]),
  updateProgress: jest.fn().mockResolvedValue({}),
};

describe('EnrollmentsController', () => {
  let controller: EnrollmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentsController],
      providers: [{ provide: EnrollmentsService, useValue: mockEnrollmentsService }],
    }).compile();
    controller = module.get<EnrollmentsController>(EnrollmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
