export class Person {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly imageUrl: string | null = null,
    public readonly imagePublicId: string | null = null,
  ) {}
}
