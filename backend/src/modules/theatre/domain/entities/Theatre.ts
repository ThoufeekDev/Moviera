import type { TheatreProps } from "../types/TheatreProps";

export class Theatre {
    private constructor(private readonly props: TheatreProps) { };

    static create(props: TheatreProps): Theatre {
        return new Theatre(props);
    }


  get id(): string {
    return this.props.id;
  }

  get cityId(): string {
    return this.props.cityId;
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug;
  }

  get address(): string {
    return this.props.address;
  }

  get licenseNumber(): string | null {
    return this.props.licenseNumber;
  }

  get description(): string | null {
    return this.props.description;
  }

  get logoUrl(): string | null {
    return this.props.logoUrl;
  }

  get logoPublicId(): string | null {
    return this.props.logoPublicId;
  }

  get email(): string | null {
    return this.props.email;
  }

  get phone(): string | null {
    return this.props.phone;
  }

  get latitude(): number | null {
    return this.props.latitude;
  }

  get longitude(): number | null {
    return this.props.longitude;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}