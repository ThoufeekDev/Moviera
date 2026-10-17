
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AreaSeed {
  cityName: string;
  district: string;
  areas: string[];
}

// Curated development data for Kerala.
// These are sample locality mappings, not an official complete directory.
const areaSeeds: AreaSeed[] = [
{
  cityName: 'Kollam',
  district: 'Kollam',
  areas: [
    'Chinnakada',
    'Kavanad',
    'Kadappakada',
    'Asramam',
    'Sakthikulangara',
    'Thevally',
    'Thattamala',
    'Kottiyam',
    'Kilikollur',
    'Anchalummoodu',
    'Eravipuram',
    'Kureepuzha',
    'Tangasseri',
    'Beach Road',
    'Polayathode',
    'Uliyakovil',
    'Pallimukku',
    'Mangad',
    'Mayyanad',
    'Mevaram',
    'Ayathil',
    'Ramankulangara',
    'Thamarakulam',
    'Koottikada',
    'Pattathanam',
  ],
},
];

function generateSlug(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function seedAreas(): Promise<void> {
  let created = 0;
  let skipped = 0;

  for (const seed of areaSeeds) {
    // Find the parent city using its name, district, state and country.
    const city = await prisma.city.findFirst({
      where: {
        name: {
          equals: seed.cityName,
          mode: 'insensitive',
        },
        district: {
          equals: seed.district,
          mode: 'insensitive',
        },
        state: {
          equals: 'Kerala',
          mode: 'insensitive',
        },
        country: {
          equals: 'India',
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!city) {
      console.warn(
        `Skipping ${seed.cityName}: matching city record not found.`,
      );
      skipped += seed.areas.length;
      continue;
    }

    const uniqueNames = [
      ...new Set(seed.areas.map((name) => name.trim()).filter(Boolean)),
    ];

    const result = await prisma.area.createMany({
      data: uniqueNames.map((name) => ({
        cityId: city.id,
        name,
        slug: generateSlug(name),
      })),
      skipDuplicates: true,
    });

    created += result.count;
    skipped += uniqueNames.length - result.count;

    console.log(
      `${city.name}: created ${result.count}/${uniqueNames.length} areas`,
    );
  }

  console.log('\nArea seeding completed.');
  console.log(`Created: ${created}`);
  console.log(`Skipped: ${skipped}`);
}

async function main(): Promise<void> {
  await seedAreas();
}

main()
  .catch((error: unknown) => {
    console.error('Area seeding failed:', error);

  })
  .finally(async () => {
    await prisma.$disconnect();
  });
