import { DomainError } from "../../../../shared/domain/errors/DomainError";

export class CrewMember {
    private constructor(public readonly personId: string, public readonly job: string) { };

    static create(input:{personId: string, job: string}): CrewMember{
const personId = input.personId.trim();
const job = input.job.trim();

        if (!personId) throw new DomainError("Crew member requires a person");
        if (!job) throw new DomainError("Crew job is requried")
        return new CrewMember(personId, job);
    }

    equals(other:CrewMember) {
        return (
            this.personId === other.personId &&
            this.job === other.job
        )
        
        
    }
}