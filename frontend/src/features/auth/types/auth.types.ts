// reusable TypeScript types/interfaces that represent
//  your domain models or API response shapes.

import type { Role } from "../../../shared/constants/Role";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
}
