import { User, CreateUserData } from '../entities/User';

export interface IUserRepository {
  create(user: CreateUserData): Promise<User>;

  findByEmail(email: string): Promise<User | null>;

  findByGoogleId(googleId:string):Promise<User | null>

  verifyUser(userId: string): Promise<void>;

  findById(id: string): Promise<User | null>;

  linkGoogleAccount(userId:string,googleId:string):Promise<User>
}
