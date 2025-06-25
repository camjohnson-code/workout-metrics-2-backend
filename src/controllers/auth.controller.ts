// controllers/auth.controller.ts
import { Request, Response } from 'express';
import { StravaService } from '../services/StravaService';

const stravaService = new StravaService();

export const authController = {
  async login(req: Request, res: Response) {
// STEPS:
// 1. Check if session exists in Redis cache
    // If so, do the following:
        // 1. Update access token in strava_tokens table in Supabase using the refresh token
        // 2. Update the session token in Redis cache
        // 3. Navigate to dashboard and send user data to frontend
    // 2. If not, redirect to Strava OAuth login
// 3. Check if they gave all permissions
    // If not, display error message
// 4. If they gave all permissions, navigate to the loading page
// 5. Get their access token, refresh token, strava id, etc and store it in strava_tokens table in Supabase
// 6. Store their user data in users table in Supabase
// 7. Fetch their activities from Strava and store them in activities table in Supabase
// 8. Navigate to dashboard and send user data to frontend

    
    // try {
    //   const { code } = req.body;
    //   const result = await StravaService.authenticate(code);
    //   res.json(result);
    // } catch (error) {
    //   const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    //   res.status(400).json({ error: errorMessage });
    // }
  },

  async handleCallback(req: Request, res: Response) {
    try {
      const { code } = req.query;
      const result = await stravaService.authenticate(code as string);
      res.json(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(400).json({ error: errorMessage });
    }
  },

  async refreshToken(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      const token = await stravaService.refreshToken(userId);
      res.json(token);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(400).json({ error: errorMessage });
    }
  }
};