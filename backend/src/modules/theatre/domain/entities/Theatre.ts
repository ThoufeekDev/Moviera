import type { TheatreProps } from "../types/TheatreProps";

export class Theatre {
    private constructor(private readonly props: TheatreProps) { };

    static create(props: TheatreProps): Theatre {
        return new Theatre({
            ...props,
            description: props.description ?? null,
            logoUrl: props.logoUrl ?? null,
            logoPublicId: props.logoPublicId ?? null,
            email: props.email ?? null,
            phone: props.phone ?? null,
            latitude: props.latitude ?? null,
            longitude: props.longitude ?? null,
            pincode: props.pincode ?? null,
            landmark: props.landmark ?? null,
            licenseNumber: props.licenseNumber ?? null,
            createdById: props.createdById ?? null,
            deletedAt: props.deletedAt ?? null,
        });
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


get areaId(): string | null {
  return this.props.areaId;
}

get googlePlaceId(): string | null {
  return this.props.googlePlaceId;
}


  get licenseNumber(): string | null {
    return this.props.licenseNumber ?? null;
  }

  get description(): string | null {
    return this.props.description ?? null;
  }

  get logoUrl(): string | null {
    return this.props.logoUrl ?? null;
  }

  get logoPublicId(): string | null {
    return this.props.logoPublicId ?? null;
  }

  get email(): string | null {
    return this.props.email ?? null;
  }

  get phone(): string | null {
    return this.props.phone ?? null;
  }

  get latitude(): number | null {
    return this.props.latitude ?? null;
  }

  get longitude(): number | null {
    return this.props.longitude ?? null;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get pincode(): string | null {
    return this.props.pincode ?? null;
  }

  get landmark(): string | null {
    return this.props.landmark ?? null;
  }

  get createdById(): string | null {
    return this.props.createdById ?? null;
  }

  get deletedAt(): Date | null {
    return this.props.deletedAt ?? null;
  }

  get createdAt(): Date {
    return this.props.createdAt ?? new Date();
  }

  get updatedAt(): Date {
    return this.props.updatedAt ?? new Date();
  }
}