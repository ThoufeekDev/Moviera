import { DomainError } from "../../../../shared/domain/errors/DomainError";

export class ImageRef {
    private constructor(public readonly url: string, public readonly publicId: string) { };

    static create(input: { url: string, publicId: string }): ImageRef{
        const url = input.url.trim();
        const publicId = input.publicId.trim();

        if (!url) throw new DomainError("Image URL is Requried");
        if (!publicId) throw new DomainError("Image public Id is Requried");

        return new ImageRef(url, publicId);
    }
}