import { IMovieRepository } from "../../domain/repositories/IMovieRepository";
import { generateSlug } from "../../../../shared/utils/generateSlug";

export class MovieSlugService {
  constructor(private readonly movieRepository: IMovieRepository) {}

  async generateUniqueSlug(
    title: string,
    releaseDate: Date,
    currentMovieId?: string,
  ): Promise<string> {
    const baseSlug = `${generateSlug(title)}-${releaseDate.getUTCFullYear()}`;

    let slug = baseSlug;
    let suffix = 2;

    while (true) {
      const exists = await this.movieRepository.existsBySlug(slug, currentMovieId);

      if (!exists) {
        return slug;
      }

      slug = `${baseSlug}-${suffix}`;
      suffix++;
    }
  }
}