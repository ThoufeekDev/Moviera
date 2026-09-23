export interface CreatePersonDTO {
  name: string;
  imageFile?: {
    buffer:Buffer
  };
}
