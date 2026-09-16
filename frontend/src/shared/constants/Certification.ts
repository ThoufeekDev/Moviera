export const Certification = {
  U: "U",
  UA: "UA",
  A: "A",
  S: "S",
} as const;

export type Certification =
  (typeof Certification)[keyof typeof Certification];