import { Person } from './Person';

export class MovieCrew {
  constructor(
    public readonly id: string,
    public readonly person: Person,
    public readonly job: string,
  ) {}
}
