import { DomainError } from "../../../../shared/domain/errors/DomainError";

export class CastMember {
    private constructor(
        public readonly personId: string,
        public readonly character: string | null,
    ) {}

    static create(input: { personId: string; character?: string | null }): CastMember {
        const personId = input.personId?.trim();
        if (!personId) throw new DomainError("Cast member requires a person");

        const character = input.character?.trim() || null;
        
        return new CastMember(personId, character);
    }

    equals(other: CastMember): boolean {
        return (
            this.personId === other.personId &&
            this.character === other.character
        );
    }
}