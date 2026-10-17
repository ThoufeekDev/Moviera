import type { FacilityProps } from '../types/FacilityProps';
import type { FacilityIconKey } from '../constants/FacilityIconKey';

export class Facility {
  private constructor(private readonly props: FacilityProps) {}

  static create(props: FacilityProps): Facility {
    return new Facility({
      ...props,
      description: props.description ?? null,
      icon: props.icon ?? null,
      iconKey: props.iconKey ?? null,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug;
  }

  get description(): string | null {
    return this.props.description ?? null;
  }

  get icon(): string | null {
    return this.props.icon ?? null;
  }

  get iconKey(): FacilityIconKey | string | null {
    return this.props.iconKey ?? null;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt ?? new Date();
  }

  get updatedAt(): Date {
    return this.props.updatedAt ?? new Date();
  }

  updateDetails(params: {
    name: string;
    description?: string | null;
    iconKey?: FacilityIconKey | string | null;
  }): void {
    this.props.name = params.name;
    this.props.description = params.description ?? null;
    this.props.iconKey = params.iconKey ?? null;
    this.props.updatedAt = new Date();
  }

  updateStatus(isActive: boolean): void {
    this.props.isActive = isActive;
    this.props.updatedAt = new Date();
  }
}
