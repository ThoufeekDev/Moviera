// import { Role } from "@prisma/client"

import { Role } from '../../../../../shared/enums/Role';
// export class UserResponseDTO {
//      constructor(
//         public readonly id:string,
//         public readonly name:string,
//         public readonly email:string,
//         public readonly role:Role,
//         public readonly isVerified:boolean,
//      ){}
// }

export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
}
