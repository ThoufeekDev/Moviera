
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const API_URL = 'https://lgd-json-api.vercel.app/api/cities';
const PAGE_SIZE = 100;
const UPSERT_BATCH_SIZE = 20;

interface ApiCity {
  code: string;
  name: string;
  districtCode: string | null;
  districtName: string | null;
  stateCode: string;
  stateName: string;
}

interface ApiResponse {
  data: ApiCity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface CitySeed {
  name: string;
  district: string;
  state: string;
  country: string;
  slug: string;
}

function generateSlug(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function fetchCities(): Promise<ApiCity[]> {
  const allCities: ApiCity[] = [];
  let totalPages = 1;

  for (let page = 1; page <= totalPages; page++) {
    const url = new URL(API_URL);

    url.searchParams.set('page', String(page));
    url.searchParams.set('limit', String(PAGE_SIZE));

    console.log(`Fetching city data: page ${page}/${totalPages}`);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `City API failed with HTTP ${response.status} on page ${page}`,
      );
    }

    const result = (await response.json()) as ApiResponse;

    if (!Array.isArray(result.data) || !result.pagination) {
      throw new Error(`Unexpected API response on page ${page}`);
    }

    allCities.push(...result.data);
    totalPages = result.pagination.pages;
  }

  return allCities;
}

function prepareCities(apiCities: ApiCity[]): CitySeed[] {
  const uniqueCities = new Map<string, CitySeed>();

  let missingDistrict = 0;

  for (const city of apiCities) {
    const name = city.name?.trim();
    const district = city.districtName?.trim();
    const state = city.stateName?.trim();
    const stateCode = city.stateCode?.trim();
    const districtCode = city.districtCode?.trim();

    // Only seed records with a known district.
    if (!name || !district || !state || !stateCode) {
      missingDistrict++;
      continue;
    }

    const key = `${name.toLowerCase()}|${state.toLowerCase()}|india`;

    if (uniqueCities.has(key)) {
      continue;
    }

    const slugSuffix = districtCode || stateCode;

    uniqueCities.set(key, {
      name,
      district,
      state,
      country: 'India',
      slug: `${generateSlug(name)}-${slugSuffix}`,
    });
  }

  console.log(`API entries received: ${apiCities.length}`);
  console.log(`Cities with district data: ${uniqueCities.size}`);
  console.log(`Entries skipped due to missing fields: ${missingDistrict}`);

  return Array.from(uniqueCities.values());
}

async function seedCities(): Promise<void> {
  const apiCities = await fetchCities();
  const cities = prepareCities(apiCities);

  if (cities.length === 0) {
    throw new Error('No valid city records found. Database was not changed.');
  }

  let processed = 0;
  let created = 0;
  let updated = 0;

  for (
    let start = 0;
    start < cities.length;
    start += UPSERT_BATCH_SIZE
  ) {
    const batch = cities.slice(start, start + UPSERT_BATCH_SIZE);

    const results = await Promise.all(
      batch.map(async (city) => {
        const existing = await prisma.city.findUnique({
          where: {
            name_state_country: {
              name: city.name,
              state: city.state,
              country: city.country,
            },
          },
          select: { id: true },
        });

        await prisma.city.upsert({
          where: {
            name_state_country: {
              name: city.name,
              state: city.state,
              country: city.country,
            },
          },
          create: {
            ...city,
          },
          update: {
            district: city.district,
            slug: city.slug,
          },
        });

        return existing ? 'updated' : 'created';
      }),
    );

    created += results.filter((result) => result === 'created').length;
    updated += results.filter((result) => result === 'updated').length;
    processed += batch.length;

    console.log(
      `Processed ${processed}/${cities.length} | Created: ${created} | Updated: ${updated}`,
    );
  }

  console.log('\nCity seeding completed.');
  console.log(`New cities created: ${created}`);
  console.log(`Existing cities updated: ${updated}`);
}

async function main(): Promise<void> {
  await seedCities();
}

main()
  .catch((error: unknown) => {
    console.error('City seeding failed:', error);
   
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
