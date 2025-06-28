export interface StravaTokenInsert {
  access_token: string;
  refresh_token: string;
  expires_at: string; // ISO string (timestamptz)
  strava_user_id: number;
  created_at: string;
  updated_at: string;
}

export interface StravaAthleteInsert {
  strava_user_id: number;
  initial_sync_completed: boolean;
  created_at: string;
  updated_at: string;
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
