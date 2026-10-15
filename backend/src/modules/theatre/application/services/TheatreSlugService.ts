import { ITheatreRepository } from '../../domain/repositories/ITheatreRepository';
import { generateSlug } from '../../../../shared/utils/generateSlug';

export class TheatreSlugService {
  constructor(private readonly theatreRepository: ITheatreRepository) {}

  async generateUniqueSlug(name: string, cityId: string): Promise<string> {
    const baseSlug = generateSlug(name) || 'theatre';

    let slug = baseSlug;
    let suffix = 2;

    while (true) {
      const exists = await this.theatreRepository.existsByCityAndSlug(cityId, slug);

      if (!exists) {
        return slug;
      }

      slug = `${baseSlug}-${suffix}`;
      suffix++;
    }
  }
}
