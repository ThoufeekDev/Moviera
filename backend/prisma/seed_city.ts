
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const STATE = 'Kerala';
const COUNTRY = 'India';
const STATE_SUFFIX = 'kl';

type UrbanLocalBody = {
  name: string;
  district: string;
  type: 'Municipal Corporation' | 'Municipality';
};

// Kerala's 6 corporations and 87 municipalities.
// District mappings are based on the Kerala LSGD published list.
const keralaUrbanLocalBodies: UrbanLocalBody[] = [
  // Municipal corporations
  { name: 'Thiruvananthapuram', district: 'Thiruvananthapuram', type: 'Municipal Corporation' },
  { name: 'Kollam', district: 'Kollam', type: 'Municipal Corporation' },
  { name: 'Kochi', district: 'Ernakulam', type: 'Municipal Corporation' },
  { name: 'Thrissur', district: 'Thrissur', type: 'Municipal Corporation' },
  { name: 'Kozhikode', district: 'Kozhikode', type: 'Municipal Corporation' },
  { name: 'Kannur', district: 'Kannur', type: 'Municipal Corporation' },

  // Alappuzha district
  { name: 'Alappuzha', district: 'Alappuzha', type: 'Municipality' },
  { name: 'Chengannur', district: 'Alappuzha', type: 'Municipality' },
  { name: 'Cherthala', district: 'Alappuzha', type: 'Municipality' },
  { name: 'Haripad', district: 'Alappuzha', type: 'Municipality' },
  { name: 'Kayamkulam', district: 'Alappuzha', type: 'Municipality' },
  { name: 'Mavelikkara', district: 'Alappuzha', type: 'Municipality' },

  // Ernakulam district
  { name: 'Aluva', district: 'Ernakulam', type: 'Municipality' },
  { name: 'Angamaly', district: 'Ernakulam', type: 'Municipality' },
  { name: 'Eloor', district: 'Ernakulam', type: 'Municipality' },
  { name: 'Kalamassery', district: 'Ernakulam', type: 'Municipality' },
  { name: 'Koothattukulam', district: 'Ernakulam', type: 'Municipality' },
  { name: 'Kothamangalam', district: 'Ernakulam', type: 'Municipality' },
  { name: 'Maradu', district: 'Ernakulam', type: 'Municipality' },
  { name: 'Muvattupuzha', district: 'Ernakulam', type: 'Municipality' },
  { name: 'Paravur', district: 'Ernakulam', type: 'Municipality' },
  { name: 'Perumbavoor', district: 'Ernakulam', type: 'Municipality' },
  { name: 'Piravom', district: 'Ernakulam', type: 'Municipality' },
  { name: 'Thrikkakara', district: 'Ernakulam', type: 'Municipality' },
  { name: 'Thrippunithura', district: 'Ernakulam', type: 'Municipality' },

  // Idukki district
  { name: 'Thodupuzha', district: 'Idukki', type: 'Municipality' },
  { name: 'Kattappana', district: 'Idukki', type: 'Municipality' },

  // Kannur district
  { name: 'Anthoor', district: 'Kannur', type: 'Municipality' },
  { name: 'Iritty', district: 'Kannur', type: 'Municipality' },
  { name: 'Koothuparamba', district: 'Kannur', type: 'Municipality' },
  { name: 'Mattannur', district: 'Kannur', type: 'Municipality' },
  { name: 'Panoor', district: 'Kannur', type: 'Municipality' },
  { name: 'Payyannur', district: 'Kannur', type: 'Municipality' },
  { name: 'Sreekandapuram', district: 'Kannur', type: 'Municipality' },
  { name: 'Taliparamba', district: 'Kannur', type: 'Municipality' },
  { name: 'Thalassery', district: 'Kannur', type: 'Municipality' },

  // Kasaragod district
  { name: 'Kanhangad', district: 'Kasaragod', type: 'Municipality' },
  { name: 'Kasaragod', district: 'Kasaragod', type: 'Municipality' },
  { name: 'Nileshwar', district: 'Kasaragod', type: 'Municipality' },

  // Kollam district
  { name: 'Karunagappally', district: 'Kollam', type: 'Municipality' },
  { name: 'Kottarakara', district: 'Kollam', type: 'Municipality' },
  { name: 'Paravoor', district: 'Kollam', type: 'Municipality' },
  { name: 'Punalur', district: 'Kollam', type: 'Municipality' },

  // Kottayam district
  { name: 'Changanassery', district: 'Kottayam', type: 'Municipality' },
  { name: 'Erattupetta', district: 'Kottayam', type: 'Municipality' },
  { name: 'Ettumanoor', district: 'Kottayam', type: 'Municipality' },
  { name: 'Kottayam', district: 'Kottayam', type: 'Municipality' },
  { name: 'Palai', district: 'Kottayam', type: 'Municipality' },
  { name: 'Vaikom', district: 'Kottayam', type: 'Municipality' },

  // Kozhikode district
  { name: 'Feroke', district: 'Kozhikode', type: 'Municipality' },
  { name: 'Koduvally', district: 'Kozhikode', type: 'Municipality' },
  { name: 'Koyilandy', district: 'Kozhikode', type: 'Municipality' },
  { name: 'Mukkam', district: 'Kozhikode', type: 'Municipality' },
  { name: 'Payyoli', district: 'Kozhikode', type: 'Municipality' },
  { name: 'Ramanattukara', district: 'Kozhikode', type: 'Municipality' },
  { name: 'Vatakara', district: 'Kozhikode', type: 'Municipality' },

  // Malappuram district
  { name: 'Kondotty', district: 'Malappuram', type: 'Municipality' },
  { name: 'Kottakkal', district: 'Malappuram', type: 'Municipality' },
  { name: 'Malappuram', district: 'Malappuram', type: 'Municipality' },
  { name: 'Manjeri', district: 'Malappuram', type: 'Municipality' },
  { name: 'Nilambur', district: 'Malappuram', type: 'Municipality' },
  { name: 'Parappanangadi', district: 'Malappuram', type: 'Municipality' },
  { name: 'Perinthalmanna', district: 'Malappuram', type: 'Municipality' },
  { name: 'Ponnani', district: 'Malappuram', type: 'Municipality' },
  { name: 'Tanur', district: 'Malappuram', type: 'Municipality' },
  { name: 'Tirur', district: 'Malappuram', type: 'Municipality' },
  { name: 'Tirurangadi', district: 'Malappuram', type: 'Municipality' },
  { name: 'Valanchery', district: 'Malappuram', type: 'Municipality' },

  // Palakkad district
  { name: 'Cherpulassery', district: 'Palakkad', type: 'Municipality' },
  { name: 'Chittur-Thathamangalam', district: 'Palakkad', type: 'Municipality' },
  { name: 'Mannarkad', district: 'Palakkad', type: 'Municipality' },
  { name: 'Ottappalam', district: 'Palakkad', type: 'Municipality' },
  { name: 'Palakkad', district: 'Palakkad', type: 'Municipality' },
  { name: 'Pattambi', district: 'Palakkad', type: 'Municipality' },
  { name: 'Shoranur', district: 'Palakkad', type: 'Municipality' },

  // Pathanamthitta district
  { name: 'Adoor', district: 'Pathanamthitta', type: 'Municipality' },
  { name: 'Pandalam', district: 'Pathanamthitta', type: 'Municipality' },
  { name: 'Pathanamthitta', district: 'Pathanamthitta', type: 'Municipality' },
  { name: 'Thiruvalla', district: 'Pathanamthitta', type: 'Municipality' },

  // Thiruvananthapuram district
  { name: 'Attingal', district: 'Thiruvananthapuram', type: 'Municipality' },
  { name: 'Nedumangad', district: 'Thiruvananthapuram', type: 'Municipality' },
  { name: 'Neyyattinkara', district: 'Thiruvananthapuram', type: 'Municipality' },
  { name: 'Varkala', district: 'Thiruvananthapuram', type: 'Municipality' },

  // Thrissur district
  { name: 'Chalakudy', district: 'Thrissur', type: 'Municipality' },
  { name: 'Chavakkad', district: 'Thrissur', type: 'Municipality' },
  { name: 'Guruvayoor', district: 'Thrissur', type: 'Municipality' },
  { name: 'Irinjalakuda', district: 'Thrissur', type: 'Municipality' },
  { name: 'Kodungallur', district: 'Thrissur', type: 'Municipality' },
  { name: 'Kunnamkulam', district: 'Thrissur', type: 'Municipality' },
  { name: 'Wadakanchery', district: 'Thrissur', type: 'Municipality' },

  // Wayanad district
  { name: 'Kalpetta', district: 'Wayanad', type: 'Municipality' },
  { name: 'Mananthavady', district: 'Wayanad', type: 'Municipality' },
  { name: 'Sulthan Bathery', district: 'Wayanad', type: 'Municipality' },
];

function generateSlug(name: string): string {
  return name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function seedKeralaCities(): Promise<void> {
  const expectedCount = 93;

  if (keralaUrbanLocalBodies.length !== expectedCount) {
    throw new Error(
      `Expected ${expectedCount} Kerala urban local bodies, found ${keralaUrbanLocalBodies.length}.`,
    );
  }

  const seen = new Set<string>();

  for (const body of keralaUrbanLocalBodies) {
    const key = body.name.toLowerCase();

    if (seen.has(key)) {
      throw new Error(`Duplicate city name in seed: ${body.name}`);
    }

    seen.add(key);
  }

  let created = 0;
  let updated = 0;

  for (const body of keralaUrbanLocalBodies) {
    const slug = `${generateSlug(body.name)}-${STATE_SUFFIX}`;

    const existing = await prisma.city.findUnique({
      where: {
        name_state_country: {
          name: body.name,
          state: STATE,
          country: COUNTRY,
        },
      },
      select: { id: true },
    });

    await prisma.city.upsert({
      where: {
        name_state_country: {
          name: body.name,
          state: STATE,
          country: COUNTRY,
        },
      },
      create: {
        name: body.name,
        district: body.district,
        state: STATE,
        country: COUNTRY,
        slug,
      },
      update: {
        district: body.district,
        slug,
      },
    });

    if (existing) {
      updated++;
    } else {
      created++;
    }

    console.log(
      `${existing ? 'Updated' : 'Created'}: ${body.name} — ${body.district}`,
    );
  }

  console.log('\nKerala city seed completed.');
  console.log(`Urban local bodies processed: ${keralaUrbanLocalBodies.length}`);
  console.log(`Created: ${created}`);
  console.log(`Updated: ${updated}`);
}

async function main(): Promise<void> {
  await seedKeralaCities();
}

main()
  .catch((error: unknown) => {
    console.error('Kerala city seeding failed:', error);
   
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
