import { Person } from './Person';

export class MovieCast {
  constructor(
    public readonly id: string,
    public readonly person: Person,
    public readonly character: string | null,
  ) {}
}
