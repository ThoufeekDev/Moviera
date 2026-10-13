import type { IUseCase } from '../../../../shared/application/interfaces/IUseCase';
import {
  EligibleAdminUser,
  ITheatreAdminUserReader,
} from '../ports/ITheatreAdminUserReader';

export interface ListEligibleTheatreAdminsRequest {
  query?: {
    search?: string;
  };
}

export class ListEligibleTheatreAdminsUseCase implements IUseCase<
  ListEligibleTheatreAdminsRequest,
  EligibleAdminUser[]
> {
  constructor(private readonly userReader: ITheatreAdminUserReader) {}

  async execute(request: ListEligibleTheatreAdminsRequest): Promise<EligibleAdminUser[]> {
    return this.userReader.findEligibleAdmins(request.query?.search);
  }
}
