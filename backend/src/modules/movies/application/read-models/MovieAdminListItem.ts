import { Certification } from "../../domain/enums/Certification";


export interface MovieAdminListItem {
    id: string;
    title: string;
    slug: string;
    posterUrl: string | null;
    releaseDate: Date;
    certification: Certification;
    languages: {
        id: string;
        name: string;
        code: string;
    }[];
    primaryGenre: {
        id: string;
        name: string;
        slug: string;

    };
    cinemaFormats: {
        id: string;
        name: string;
        slug: string;
    }[];

    isActive: boolean;
    
}