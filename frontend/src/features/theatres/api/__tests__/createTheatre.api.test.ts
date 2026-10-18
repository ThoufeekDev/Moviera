import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTheatreApi, type CreateTheatrePayload } from '../createTheatre.api';
import api from '@/shared/lib/axios';

vi.mock('@/shared/lib/axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('createTheatreApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const basePayload: CreateTheatrePayload = {
    name: 'PVR Forum',
    address: '21 Hosur Road',
    cityId: 'city-1',
  };

  it('appends repeated facilityIds entries to FormData when multiple are selected', async () => {
    let capturedFormData: FormData | null = null;

    vi.mocked(api.post).mockImplementation(async (_url, data) => {
      capturedFormData = data as FormData;
      return {
        data: {
          success: true,
          message: 'Created',
          data: { id: 'theatre-1', name: 'PVR Forum' },
        },
      };
    });

    await createTheatreApi({
      ...basePayload,
      facilityIds: ['facility-101', 'facility-202', 'facility-303'],
    });

    expect(api.post).toHaveBeenCalledTimes(1);
    expect(capturedFormData).not.toBeNull();

    const facilityEntries = capturedFormData!.getAll('facilityIds');
    expect(facilityEntries).toEqual(['facility-101', 'facility-202', 'facility-303']);
  });

  it('does not append facilityIds to FormData when empty array is passed', async () => {
    let capturedFormData: FormData | null = null;

    vi.mocked(api.post).mockImplementation(async (_url, data) => {
      capturedFormData = data as FormData;
      return {
        data: {
          success: true,
          message: 'Created',
          data: { id: 'theatre-1', name: 'PVR Forum' },
        },
      };
    });

    await createTheatreApi({
      ...basePayload,
      facilityIds: [],
    });

    expect(api.post).toHaveBeenCalledTimes(1);
    expect(capturedFormData).not.toBeNull();

    const facilityEntries = capturedFormData!.getAll('facilityIds');
    expect(facilityEntries).toEqual([]);
  });

  it('does not append facilityIds to FormData when facilityIds is omitted', async () => {
    let capturedFormData: FormData | null = null;

    vi.mocked(api.post).mockImplementation(async (_url, data) => {
      capturedFormData = data as FormData;
      return {
        data: {
          success: true,
          message: 'Created',
          data: { id: 'theatre-1', name: 'PVR Forum' },
        },
      };
    });

    await createTheatreApi(basePayload);

    expect(api.post).toHaveBeenCalledTimes(1);
    expect(capturedFormData).not.toBeNull();

    const facilityEntries = capturedFormData!.getAll('facilityIds');
    expect(facilityEntries).toEqual([]);
  });
});
