import { PrismaService } from '../prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';

const mockPrisma = {
  user: { findMany: jest.fn(), findFirst: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), updateMany: jest.fn(), delete: jest.fn(), deleteMany: jest.fn() },
  course: { findMany: jest.fn(), findFirst: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), updateMany: jest.fn(), deleteMany: jest.fn() },
  lesson: { findMany: jest.fn(), findFirst: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), updateMany: jest.fn(), delete: jest.fn(), deleteMany: jest.fn() },
  enrollment: { findMany: jest.fn(), findFirst: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), updateMany: jest.fn() },
  assessment: { findMany: jest.fn(), findFirst: jest.fn(), findUnique: jest.fn(), create: jest.fn() },
  question: { findMany: jest.fn(), create: jest.fn() },
  submission: { create: jest.fn() },
  tenant: { findMany: jest.fn(), findFirst: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
  userActivity: { findMany: jest.fn(), create: jest.fn() },
  userBadge: { findMany: jest.fn(), create: jest.fn() },
  badge: { findMany: jest.fn() },
  certificate: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn() },
  refreshToken: { create: jest.fn(), findFirst: jest.fn(), update: jest.fn() },
};


describe('CoursesService', () => {
  let service: CoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoursesService, { provide: "PrismaService", useValue: mockPrisma }, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
