import { ConflictError } from "../../../../shared/exceptions/ConflictError";
import { generateOtp } from "../../../../shared/utils/generateOtp";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { redis } from "../../../../shared/redis_config/redis";
import { ResendOTP } from "../dtos/requests/Resent-otpDTO";
import { UserResponserRegisterDTO } from "../dtos/response/UserResponseRegisterDTO";
import { otpQueue } from "../../../../shared/queues/otp.queue";

export class recendOTPUseCase {
   

    constructor(private userRepository: IUserRepository) { }
    

    async execute(user: ResendOTP) {



        try {

               console.log('this is the user i found', user);

               const existingUser = await this.userRepository.findByEmail(user.email);

               if (!existingUser) {
                 throw new ConflictError('User not found');
               }

               if (existingUser.isVerified) {
                 throw new ConflictError('User is already verified');
               }

               const otp = generateOtp();
               const OTP_EXPIRY_SECONDS = 50;

               await redis.set(`otp:${user.email}`, otp, 'EX', OTP_EXPIRY_SECONDS);
               const otpExpireAt = Date.now() + OTP_EXPIRY_SECONDS * 1000;
               await otpQueue.add(
                 'send-otp-email',
                 {
                   email: user.email,
                   otp,
                 },
                 {
                   attempts: 3,
                   backoff: {
                     type: 'exponential',
                     delay: 3000,
                   },
                   removeOnComplete: 1000,
                   removeOnFail: 1000,
                 },
               );

               return {
                 email: user.email,
                 otpExpireAt,
               };

            
        } catch (error) {
            
            console.log('this is the error ',error)
        }
     
    
    }

}