// reusable TypeScript types/interfaces that represent
//  your domain models or API response shapes.

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}
