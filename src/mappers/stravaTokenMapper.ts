import { StravaTokenInsert, StravaAthleteInsert } from '../models/StravaToken';

interface Athlete {
  id: number;
  badge_type_id: number;
  bio: string;
  city: string;
  country: string;
  firstname: string;
  follower: any;
  friend: any;
  lastname: string;
  premium: boolean;
  profile: string;
  profile_medium: string;
  resource_state: number;
  sex: string;
  state: string;
  summit: boolean;
  username: string | null;
  weight: number;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  athlete: Athlete;
}

export function mapToStravaAthleteInsert(athlete: Athlete, now: string): StravaAthleteInsert {
  return {
    strava_user_id: athlete.id,
    initial_sync_completed: false,
    created_at: now,
    updated_at: now,
    badge_type_id: athlete.badge_type_id,
    bio: athlete.bio,
    city: athlete.city,
    country: athlete.country,
    firstname: athlete.firstname,
    follower: athlete.follower,
    friend: athlete.friend,
    lastname: athlete.lastname,
    premium: athlete.premium,
    profile: athlete.profile,
    profile_medium: athlete.profile_medium,
    resource_state: athlete.resource_state,
    sex: athlete.sex,
    state: athlete.state,
    summit: athlete.summit,
    username: athlete.username,
    weight: athlete.weight,
  };
}

export function mapToStravaTokenInsert(tokens: Tokens, now: string): StravaTokenInsert {
  return {
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
    expires_at: tokens.expiresAt,
    strava_user_id: tokens.athlete.id,
    created_at: now,
    updated_at: now,
  };
}
