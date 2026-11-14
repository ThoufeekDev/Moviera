import { describe, expect, it } from 'vitest';
import { DomainError } from '../../../../shared/domain/errors/DomainError';
import { Show } from './Show';
import { ShowStatus } from '../enums/ShowStatus';

describe('Show Domain Entity', () => {
  const createDraftShow = (status: ShowStatus = ShowStatus.DRAFT) =>
    Show.reconstitute({
      id: 'show-1',
      movieId: 'movie-1',
      screenId: 'screen-1',
      cinemaFormatId: 'format-1',
      startTime: new Date('2026-12-01T10:00:00.000Z'),
      endTime: new Date('2026-12-01T12:30:00.000Z'),
      basePrice: 25000,
      status,
    });

  describe('publish', () => {
    it('transitions DRAFT show to PUBLISHED and keeps isActive true', () => {
      const show = createDraftShow(ShowStatus.DRAFT);

      show.publish();

      expect(show.status).toBe(ShowStatus.PUBLISHED);
      expect(show.isActive).toBe(true);
    });

    it('rejects publishing an already PUBLISHED show', () => {
      const show = createDraftShow(ShowStatus.PUBLISHED);

      expect(() => show.publish()).toThrow(DomainError);
      expect(() => show.publish()).toThrow('Only draft shows can be published');
    });

    it('rejects publishing a CANCELLED show', () => {
      const show = createDraftShow(ShowStatus.CANCELLED);

      expect(() => show.publish()).toThrow(DomainError);
      expect(() => show.publish()).toThrow('Only draft shows can be published');
    });
  });

  describe('cancel', () => {
    it('transitions DRAFT show to CANCELLED and sets isActive false', () => {
      const show = createDraftShow(ShowStatus.DRAFT);

      show.cancel();

      expect(show.status).toBe(ShowStatus.CANCELLED);
      expect(show.isActive).toBe(false);
    });

    it('transitions PUBLISHED show to CANCELLED and sets isActive false', () => {
      const show = createDraftShow(ShowStatus.PUBLISHED);

      show.cancel();

      expect(show.status).toBe(ShowStatus.CANCELLED);
      expect(show.isActive).toBe(false);
    });

    it('rejects cancelling an already CANCELLED show', () => {
      const show = createDraftShow(ShowStatus.CANCELLED);

      expect(() => show.cancel()).toThrow(DomainError);
      expect(() => show.cancel()).toThrow('Show is already cancelled');
    });
  });

  describe('updateDetails', () => {
    it('updates schedule, movie, format, and basePrice on a DRAFT show', () => {
      const show = createDraftShow(ShowStatus.DRAFT);
      const nextStart = new Date('2026-12-01T14:00:00.000Z');
      const nextEnd = new Date('2026-12-01T16:30:00.000Z');

      show.updateDetails({
        movieId: 'movie-2',
        cinemaFormatId: 'format-2',
        startTime: nextStart,
        endTime: nextEnd,
        basePrice: 30000,
      });

      expect(show.movieId).toBe('movie-2');
      expect(show.cinemaFormatId).toBe('format-2');
      expect(show.startTime).toEqual(nextStart);
      expect(show.endTime).toEqual(nextEnd);
      expect(show.basePrice).toBe(30000);
    });

    it('rejects updating a CANCELLED show', () => {
      const show = createDraftShow(ShowStatus.CANCELLED);

      expect(() =>
        show.updateDetails({
          movieId: 'movie-1',
          cinemaFormatId: 'format-1',
          startTime: new Date('2026-12-01T14:00:00.000Z'),
          endTime: new Date('2026-12-01T16:30:00.000Z'),
          basePrice: 25000,
        }),
      ).toThrow('Cannot update a cancelled show');
    });

    it('rejects update when endTime is not after startTime', () => {
      const show = createDraftShow(ShowStatus.DRAFT);
      const start = new Date('2026-12-01T14:00:00.000Z');

      expect(() =>
        show.updateDetails({
          movieId: 'movie-1',
          cinemaFormatId: 'format-1',
          startTime: start,
          endTime: start,
          basePrice: 25000,
        }),
      ).toThrow('Show end time must be after start time');
    });

    it('rejects update when basePrice is less than 100 paise', () => {
      const show = createDraftShow(ShowStatus.DRAFT);

      expect(() =>
        show.updateDetails({
          movieId: 'movie-1',
          cinemaFormatId: 'format-1',
          startTime: new Date('2026-12-01T14:00:00.000Z'),
          endTime: new Date('2026-12-01T16:30:00.000Z'),
          basePrice: 99,
        }),
      ).toThrow('Show base price must be an integer of at least 100 paise (₹1)');
    });
  });
});

