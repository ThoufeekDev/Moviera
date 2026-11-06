import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BulkCreateSeatsController } from './BulkCreateSeatsController';
import { GetScreenSeatLayoutController } from './GetScreenSeatLayoutController';
import { UpdateSeatLayoutController } from './UpdateSeatLayoutController';
import { UpdateSeatController } from './UpdateSeatController';
import { CreateSeatController } from './CreateSeatController';
import { Seat } from '../../domain/entities/Seat';
import { SeatType } from '../../domain/enums/SeatType';
import { Role } from '../../../../shared/enums/Role';
import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import type { HttpRequest } from '../../../../shared/http/HttpTypes';

const makeSeat = (id: string, label = 'A1'): Seat =>
  Seat.create({
    id,
    screenId: 'screen-1',
    rowLabel: 'A',
    seatNumber: 1,
    label,
    x: 0.1,
    y: 0.1,
    rotation: 0,
    type: SeatType.REGULAR,
    isActive: true,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
  });

describe('BulkCreateSeatsController', () => {
  let useCase: { execute: ReturnType<typeof vi.fn> };
  let controller: BulkCreateSeatsController;

  beforeEach(() => {
    useCase = { execute: vi.fn() };
    controller = new BulkCreateSeatsController(useCase as any);
  });

  it('throws UnauthorizedError if user is not authenticated', async () => {
    const req = {
      user: undefined,
      params: { screenId: 'screen-1' },
      body: { rows: [] },
    } as unknown as HttpRequest<any, any>;

    await expect(controller.handle(req)).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('returns 201 with created seats list', async () => {
    const seats = [makeSeat('seat-1')];
    useCase.execute.mockResolvedValue(seats);

    const req = {
      user: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
      params: { screenId: 'screen-1' },
      body: { rows: [{ rowLabel: 'A', seatCount: 1, type: SeatType.REGULAR }] },
    } as unknown as HttpRequest<any, any>;

    const res = await controller.handle(req);

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.message).toBe('Seats created successfully');
  });
});

describe('GetScreenSeatLayoutController', () => {
  let useCase: { execute: ReturnType<typeof vi.fn> };
  let controller: GetScreenSeatLayoutController;

  beforeEach(() => {
    useCase = { execute: vi.fn() };
    controller = new GetScreenSeatLayoutController(useCase as any);
  });

  it('throws UnauthorizedError if user is not authenticated', async () => {
    const req = {
      user: undefined,
      params: { screenId: 'screen-1' },
    } as unknown as HttpRequest<any>;

    await expect(controller.handle(req)).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('returns 200 with layout response', async () => {
    const seats = [makeSeat('seat-1')];
    useCase.execute.mockResolvedValue(seats);

    const req = {
      user: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
      params: { screenId: 'screen-1' },
    } as unknown as HttpRequest<any>;

    const res = await controller.handle(req);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.message).toBe('Seat layout retrieved successfully');
  });
});

describe('UpdateSeatLayoutController', () => {
  let useCase: { execute: ReturnType<typeof vi.fn> };
  let controller: UpdateSeatLayoutController;

  beforeEach(() => {
    useCase = { execute: vi.fn() };
    controller = new UpdateSeatLayoutController(useCase as any);
  });

  it('throws UnauthorizedError if user is not authenticated', async () => {
    const req = {
      user: undefined,
      params: { screenId: 'screen-1' },
      body: { seats: [] },
    } as unknown as HttpRequest<any, any>;

    await expect(controller.handle(req)).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('returns 200 with updated seat layout list', async () => {
    const seats = [makeSeat('seat-1')];
    useCase.execute.mockResolvedValue(seats);

    const req = {
      user: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
      params: { screenId: 'screen-1' },
      body: { seats: [{ seatId: 'seat-1', x: 0.2, y: 0.3, rotation: 0 }] },
    } as unknown as HttpRequest<any, any>;

    const res = await controller.handle(req);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.message).toBe('Seat layout updated successfully');
  });
});

describe('UpdateSeatController', () => {
  let useCase: { execute: ReturnType<typeof vi.fn> };
  let controller: UpdateSeatController;

  beforeEach(() => {
    useCase = { execute: vi.fn() };
    controller = new UpdateSeatController(useCase as any);
  });

  it('throws UnauthorizedError if user is not authenticated', async () => {
    const req = {
      user: undefined,
      params: { seatId: 'seat-1' },
      body: { type: SeatType.PREMIUM },
    } as unknown as HttpRequest<any, any>;

    await expect(controller.handle(req)).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('returns 200 with updated seat response', async () => {
    const seat = makeSeat('seat-1');
    useCase.execute.mockResolvedValue(seat);

    const req = {
      user: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
      params: { seatId: 'seat-1' },
      body: { type: SeatType.PREMIUM },
    } as unknown as HttpRequest<any, any>;

    const res = await controller.handle(req);

    expect(res.status).toBe(200);
    expect(res.body.data?.id).toBe('seat-1');
    expect(res.body.message).toBe('Seat updated successfully');
  });
});

describe('CreateSeatController', () => {
  let useCase: { execute: ReturnType<typeof vi.fn> };
  let controller: CreateSeatController;

  beforeEach(() => {
    useCase = { execute: vi.fn() };
    controller = new CreateSeatController(useCase as any);
  });

  it('throws UnauthorizedError if user is not authenticated', async () => {
    const req = {
      user: undefined,
      params: { screenId: 'screen-1' },
      body: { rowLabel: 'A', seatNumber: 1, x: 0.1, y: 0.1, type: SeatType.REGULAR },
    } as unknown as HttpRequest<any, any>;

    await expect(controller.handle(req)).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('returns 201 with created seat', async () => {
    const seat = makeSeat('seat-1');
    useCase.execute.mockResolvedValue(seat);

    const req = {
      user: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
      params: { screenId: 'screen-1' },
      body: { rowLabel: 'A', seatNumber: 1, x: 0.1, y: 0.1, type: SeatType.REGULAR },
    } as unknown as HttpRequest<any, any>;

    const res = await controller.handle(req);

    expect(res.status).toBe(201);
    expect(res.body.data?.id).toBe('seat-1');
    expect(res.body.message).toBe('Seat created successfully');
  });
});
