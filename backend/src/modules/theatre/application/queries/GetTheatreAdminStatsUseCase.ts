import type { IUseCase } from '../../../../shared/application/interfaces/IUseCase';
import {
  ITheatreAdminAssignmentRepository,
  TheatreAdminStats,
} from '../../domain/repositories/ITheatreAdminAssignmentRepository';

export class GetTheatreAdminStatsUseCase implements IUseCase<void, TheatreAdminStats> {
  constructor(
    private readonly assignmentRepository: ITheatreAdminAssignmentRepository,
  ) {}

  async execute(): Promise<TheatreAdminStats> {
    return this.assignmentRepository.getStatistics();
  }
}
