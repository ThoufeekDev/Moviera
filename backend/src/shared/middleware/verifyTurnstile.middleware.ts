import axios from 'axios';
import { env } from '../../config/env';

import { Request, Response, NextFunction } from 'express';

export const verifyTurnStile = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.body.turnstileToken;

  console.log('token in ', token);

  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Turnstile token missing',
    });
  }

  try {
    const response = await axios.post(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',

      new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY!,
        response: token,
      }),
    );

    if (!response.data.success) {
      return res.status(400).json({
        success: false,

        message: 'Bot verification failed',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: 'Turnstile verification failed',
    });
  }
};
