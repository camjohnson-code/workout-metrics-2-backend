import { StravaActivityInsert } from '../models/StravaActivity';

interface StravaActivity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  sport_type: string;
  start_date: string;
  start_date_local: string;
  timezone: string;
  utc_offset: number;
  location_city: string | null;
  location_state: string | null;
  location_country: string | null;
  achievement_count: number;
  kudos_count: number;
  comment_count: number;
  athlete_count: number;
  photo_count: number;
  trainer: boolean;
  commute: boolean;
  manual: boolean;
  private: boolean;
  flagged: boolean;
  gear_id: string | null;
  average_speed: number;
  max_speed: number;
  average_cadence: number | null;
  average_watts: number | null;
  weighted_average_watts: number | null;
  kilojoules: number | null;
  device_watts?: boolean;
  has_heartrate: boolean;
  average_heartrate: number | null;
  max_heartrate: number | null;
  max_watts: number | null;
  pr_count: number;
  total_photo_count: number;
  has_kudoed: boolean;
  suffer_score: number | null;
  description: string | null;
  calories: number | null;
}

export function mapToStravaActivityInsert(
  activity: StravaActivity,
  userId: number,
  now: string
): StravaActivityInsert {
  return {
    strava_activity_id: activity.id,
    strava_user_id: userId,
    name: activity.name,
    distance: activity.distance,
    moving_time: activity.moving_time,
    elapsed_time: activity.elapsed_time,
    total_elevation_gain: activity.total_elevation_gain,
    type: activity.type,
    sport_type: activity.sport_type,
    start_date: activity.start_date,
    start_date_local: activity.start_date_local,
    timezone: activity.timezone,
    utc_offset: activity.utc_offset,
    location_city: activity.location_city,
    location_state: activity.location_state,
    location_country: activity.location_country,
    achievement_count: activity.achievement_count,
    kudos_count: activity.kudos_count,
    comment_count: activity.comment_count,
    athlete_count: activity.athlete_count,
    photo_count: activity.photo_count,
    trainer: activity.trainer,
    commute: activity.commute,
    manual: activity.manual,
    private: activity.private,
    flagged: activity.flagged,
    gear_id: activity.gear_id,
    average_speed: activity.average_speed,
    max_speed: activity.max_speed,
    average_cadence: activity.average_cadence,
    average_watts: activity.average_watts,
    weighted_average_watts: activity.weighted_average_watts,
    kilojoules: activity.kilojoules,
    device_watts: activity.device_watts ?? false,
    has_heartrate: activity.has_heartrate,
    average_heartrate: activity.average_heartrate,
    max_heartrate: activity.max_heartrate,
    max_watts: activity.max_watts,
    pr_count: activity.pr_count,
    total_photo_count: activity.total_photo_count,
    has_kudoed: activity.has_kudoed,
    suffer_score: activity.suffer_score,
    description: activity.description,
    calories: activity.calories,
    created_at: now,
    updated_at: now,
  };
}
