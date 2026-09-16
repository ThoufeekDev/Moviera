// export interface Genre {
//   id: string;
//   name: string;
//   slug: string;
//   isActive: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// }

export class Genre {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}