import { describe, it, expect } from 'vitest';
import { CastMember } from './CastMember';
import { CrewMember } from './CrewMember';
import { DomainError } from '../../../../shared/domain/errors/DomainError';

describe('CastMember and CrewMember Value Objects', () => {
  it('should trim personId and character, and accept optional character', () => {
    const member1 = CastMember.create({
      personId: '  person-123  ',
      character: '  Hero  ',
    });

    expect(member1.personId).toBe('person-123');
    expect(member1.character).toBe('Hero');

    const member2 = CastMember.create({
      personId: ' person-456 ',
    });

    expect(member2.personId).toBe('person-456');
    expect(member2.character).toBeNull();
  });

  it('should throw DomainError with correct typo-free message on CrewMember', () => {
    expect(() =>
      CrewMember.create({
        personId: 'person-123',
        job: '   ',
      }),
    ).toThrowError(new DomainError('Crew job is required'));
  });
});
