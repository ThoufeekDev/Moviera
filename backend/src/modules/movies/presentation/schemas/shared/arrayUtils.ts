import { z } from 'zod';

/**
 * Safely parse JSON values coming from multipart/form-data.
 *
 * If the value is valid JSON, it is parsed.
 * If parsing fails, the original value is returned so Zod
 * can report it as invalid input instead of throwing a
 * raw JSON.parse SyntaxError.
 */
export const jsonArray = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((value) => {
    if (typeof value !== 'string') {
      return value;
    }

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }, schema);

/**
 * Validates that an array does not contain duplicate string IDs.
 */
export const uniqueIds = (message: string) =>
  z.array(z.string().min(1)).refine(
    (ids) => new Set(ids).size === ids.length,
    message,
  );
