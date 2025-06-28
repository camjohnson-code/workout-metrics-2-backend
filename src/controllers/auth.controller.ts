// controllers/auth.controller.ts
import { Request, Response } from 'express';
import { StravaService } from '../services/StravaService';
import supabase from '../supabaseClient';
import { mapToStravaTokenInsert, mapToStravaAthleteInsert } from '../mappers/stravaTokenMapper';
import { mapToStravaActivityInsert } from '../mappers/stravaActivityMapper';

const stravaService = new StravaService();

export const authController = {
  async handleCallback(req: Request, res: Response) {
    const { code } = req.query;

    try {
      // Validate that we have the required parameters
      if (!code) {
        console.error('Missing required parameters:', { code });
        return res.status(400).json({ error: 'Missing authorization code' });
      }

      // Exchange the authorization code for access tokens
      const tokens = await stravaService.authenticate(code as string);

      try {
        const now = new Date().toISOString();
        const tokenInsert = mapToStravaTokenInsert(tokens, now);
        const { error } = await supabase.from('strava_tokens').insert(tokenInsert);

        if (error && error.code === '23505') {
          // Convert timestamps to comparable date objects
          const tokenExpiryDate = new Date(tokenInsert.expires_at);
          const currentDate = new Date();

          // If token is expired, refresh it
          if (tokenExpiryDate <= currentDate)
            await stravaService.refreshToken(`${tokens.athlete.id}`);

          // Navigate to /dashboard
          const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
          const dashboardUrl = `${frontendUrl}/dashboard`;
          res.redirect(dashboardUrl);
          return;
        }

        if (error) {
          console.error('Error inserting into strava_tokens:', error);
          // Handle the error, e.g., return a 500 or redirect with error
          return res.status(500).json({ error: 'Failed to store Strava tokens' });
        }
      } catch (err) {
        console.error('Unexpected error inserting into strava_tokens:', err);
        return res.status(500).json({ error: 'Unexpected error storing Strava tokens' });
      }

      try {
        const now = new Date().toISOString();
        const athleteInsert = mapToStravaAthleteInsert(tokens.athlete, now);
        const { error } = await supabase.from('users').insert(athleteInsert);

        if (error) {
          console.error('Error inserting into users:', error);
          return res.status(500).json({ error: 'Failed to store Strava user' });
        }
      } catch (err) {
        console.error('Unexpected error inserting into users:', err);
        return res.status(500).json({ error: 'Unexpected error storing Strava user' });
      }

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const redirectUrl = `${frontendUrl}/downloading-activities?auth=success&id=${tokens.athlete.id}`;

      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Error in auth callback:', error);

      // Redirect to frontend with error
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const redirectUrl = `${frontendUrl}/login?error=auth_failed`;

      res.redirect(redirectUrl);
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
  },

  async handleDownloadingActivities(req: Request, res: Response) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: 'User ID required' });
      }

      const accessToken = await stravaService.getAccessToken(userId as string);
      const activities = await stravaService.getActivities(accessToken);

      const now = new Date().toISOString();

      const { error } = await supabase
        .from('activities')
        .insert(
          activities.map((activity: any) =>
            mapToStravaActivityInsert(activity, Number(userId), now)
          )
        );

      if (error) {
        console.error('Error inserting activities:', error);
        return res.status(500).json({ error: 'Failed to store activities' });
      }

      res.json({
        status: 'success',
        activities,
        message: 'Activities downloaded successfully',
      });
    } catch (error) {
      console.error('Error in downloading activities:', error);
      res.status(500).json({ error: 'Failed to download activities' });
    }
  },
};
