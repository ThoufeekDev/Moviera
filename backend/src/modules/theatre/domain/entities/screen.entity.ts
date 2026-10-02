import type { ScreenProps } from "../types/ScreenProps";
import type { CreateScreenProps } from "../types/CreateScreenProps";



// ! get is an accession
export class Screen {
  private constructor(private readonly props: ScreenProps) {}

  static restore(props: ScreenProps): Screen {
    return new Screen(props);
  }

  get id(): string {
    return this.props.id;
  }

  get theatreId(): string {
    return this.props.theatreId;
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug;
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