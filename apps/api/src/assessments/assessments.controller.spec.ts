import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentsController } from './assessments.controller';
import { AssessmentsService } from './assessments.service';

const mockAssessmentsService = {
  createAssessment: jest.fn().mockResolvedValue({}),
  createQuestion: jest.fn().mockResolvedValue({}),
  getAssessmentByLesson: jest.fn().mockResolvedValue({}),
  getAssessmentWithQuestions: jest.fn().mockResolvedValue({}),
  submitAnswers: jest.fn().mockResolvedValue({}),
};

describe('AssessmentsController', () => {
  let controller: AssessmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssessmentsController],
      providers: [{ provide: AssessmentsService, useValue: mockAssessmentsService }],
    }).compile();
    controller = module.get<AssessmentsController>(AssessmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
