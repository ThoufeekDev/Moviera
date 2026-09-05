import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

import { authenticateUser } from '../../../../shared/middleware/authenticateUser';
import { otpRateLimit } from '../../../../shared/middleware/rateLimit.middleware';
import { verifyTurnStile } from '../../../../shared/middleware/verifyTurnstile.middleware';
const router = Router();

const authController = new AuthController();

/**
 * !register need otpRatelimit - temp removed
 */

// Register & Logout routes
router.post('/register', verifyTurnStile, otpRateLimit, authController.register);
router.post('/resend-otp', authController.resendOTP);
router.post('/verify-otp', authController.verifyOtp);


// Logout Route
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/google', authController.googleLogin);

// refreshing Token
router.post('/refresh-token', authController.refreshToken);

// Get Me
router.get('/profile', authenticateUser, authController.profile);

export default router;
