import { describe, it, expect } from 'vitest';
import { ALLOWED_FACILITY_ICON_KEYS } from './FacilityIconKey';
import fs from 'fs';
import path from 'path';

describe('FacilityIconKey Consistency', () => {
  const expectedKeys = [
    'parking',
    'wheelchair_access',
    'food_court',
    'restrooms',
    'gaming_zone',
    'wifi',
    'air_conditioning',
    'security',
    'lounge',
    'valet',
    'atm',
    'baby_care',
  ];

  it('backend ALLOWED_FACILITY_ICON_KEYS must match the canonical 12 allowed keys', () => {
    expect([...ALLOWED_FACILITY_ICON_KEYS].sort()).toEqual([...expectedKeys].sort());
  });

  it('frontend and backend allowed icon key lists must not drift apart', () => {
    // Read the frontend facilityIcons.tsx file to ensure sync
    const frontendPath = path.resolve(
      __dirname,
      '../../../../../../frontend/src/features/theatres/icons/facilityIcons.tsx',
    );

    expect(fs.existsSync(frontendPath)).toBe(true);
    const content = fs.readFileSync(frontendPath, 'utf-8');

    for (const key of ALLOWED_FACILITY_ICON_KEYS) {
      expect(content).toContain(`'${key}'`);
    }
  });
});
