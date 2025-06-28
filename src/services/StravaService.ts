// Add interfaces for Strava API responses
interface StravaTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete: {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    bio: string;
    city: string;
    state: string;
    country: string;
    sex: string;
    premium: boolean;
    summit: boolean;
    created_at: string;
    updated_at: string;
    badge_type_id: number;
    weight: number;
    profile_medium: string;
    profile: string;
    resource_state: number;
    friend: null;
    follower: null;
  };
}

import { mapToStravaTokenInsert } from '../mappers/stravaTokenMapper';
import { StravaTokenInsert } from '../models/StravaToken';
import supabase from '../supabaseClient';

export class StravaService {
  private clientId = process.env.STRAVA_CLIENT_ID;
  private clientSecret = process.env.STRAVA_CLIENT_SECRET;
  async authenticate(code: string) {
    try {
      console.log('Authenticating with code:', code);

      if (!this.clientId || !this.clientSecret) {
        throw new Error('Missing Strava client credentials');
      }

      // Exchange authorization code for access token
      const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: code,
          grant_type: 'authorization_code',
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('Strava token exchange failed:', errorText);
        throw new Error(`Token exchange failed: ${tokenResponse.status}`);
      }

      const tokenData = (await tokenResponse.json()) as StravaTokenResponse;
      console.log('Token exchange successful:', tokenData);

      return {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: new Date(tokenData.expires_at * 1000).toISOString(),
        athlete: tokenData.athlete,
      };
    } catch (error) {
      console.error('Authentication error:', error);
      throw new Error('Authentication failed');
    }
  }

  async refreshToken(userId: string) {
    if (!this.clientId || !this.clientSecret) {
      throw new Error('Missing Strava client credentials');
    }
    // Fetch the refresh token for the user
    const { data, error } = await supabase
      .from('strava_tokens')
      .select('refresh_token')
      .eq('strava_user_id', userId)
      .single();

    if (error || !data) {
      throw new Error('Could not find refresh token for user');
    }

    const refreshToken = data.refresh_token;

    // Call Strava API to refresh the access token
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strava token refresh failed:', errorText);
      throw new Error('Failed to refresh Strava token');
    }

    const tokenData = (await response.json()) as StravaTokenResponse;
    // Update tokens in the database
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from('strava_tokens')
      .update({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: new Date(tokenData.expires_at * 1000).toISOString(),
        updated_at: now,
      })
      .eq('strava_user_id', userId);

    if (updateError) {
      throw new Error('Failed to update tokens in database');
    }

    return {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: new Date(tokenData.expires_at * 1000).toISOString(),
      athlete: tokenData.athlete,
    };
  }

  async getActivities(accessToken: string) {
    try {
      const allActivities = [];
      let page = 1;
      const perPage = 200; // Maximum allowed by Strava API
      let hasMoreActivities = true;

      while (hasMoreActivities) {
        const response = await fetch(
          `https://www.strava.com/api/v3/athlete/activities?page=${page}&per_page=${perPage}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Strava activities fetch failed:', errorText);
          throw new Error(`Failed to fetch activities: ${response.status}`);
        }

        const activities = (await response.json()) as any[];

        // If we get fewer activities than requested, we've reached the end
        if (activities.length < perPage) {
          hasMoreActivities = false;
        }

        allActivities.push(...activities);
        page++;

        // Add a small delay to respect rate limits
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      console.log(`Fetched ${allActivities.length} total activities`);
      return allActivities;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw new Error('Failed to fetch activities');
    }
  }

  async getAccessToken(userId: string) {
    try {
      const { data, error } = await supabase
        .from('strava_tokens')
        .select('access_token')
        .eq('strava_user_id', userId)
        .single();

      if (error) {
        console.log("Failed to get user's access token:", error);
        throw new Error('Failed to fetch access token');
      }

      return data.access_token;
    } catch (error) {
      console.log("Failed to get user's access token:", error);
      throw new Error('Failed to fetch access token');
    }
  }

  async authenticateAndMapTokenInsert(code: string): Promise<StravaTokenInsert> {
    const tokens = await this.authenticate(code);
    const now = new Date().toISOString();
    return mapToStravaTokenInsert(tokens, now);
  }
}

export default StravaService;
