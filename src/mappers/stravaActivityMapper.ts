import { StravaActivityInsert } from '../models/StravaActivity';

interface StravaActivity {
  id: number;
  athlete: { id: number; resource_state: number };
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
  map?: {
    id: string;
    summary_polyline: string;
    resource_state: number;
  };
  trainer: boolean;
  commute: boolean;
  manual: boolean;
  private: boolean;
  visibility: string;
  flagged: boolean;
  gear_id: string | null;
  start_latlng: number[] | null;
  end_latlng: number[] | null;
  average_speed: number;
  max_speed: number;
  average_cadence: number | null;
  average_watts: number | null;
  max_watts: number | null;
  weighted_average_watts: number | null;
  device_watts?: boolean;
  kilojoules: number | null;
  has_heartrate: boolean;
  average_heartrate: number | null;
  max_heartrate: number | null;
  heartrate_opt_out: boolean;
  display_hide_heartrate_option: boolean;
  elev_high: number | null;
  elev_low: number | null;
  upload_id: number;
  upload_id_str: string;
  external_id: string;
  from_accepted_tag: boolean;
  pr_count: number;
  total_photo_count: number;
  has_kudoed: boolean;
}

export function mapToStravaActivityInsert(
  activity: StravaActivity,
  userId: number,
  now?: string
): StravaActivityInsert {
  const timestamp = now ?? new Date().toISOString();
  return {
    id: activity.id,
    athlete_id: userId,
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
    location_city: activity.location_city,
    location_state: activity.location_state,
    location_country: activity.location_country,
    achievement_count: activity.achievement_count,
    kudos_count: activity.kudos_count,
    comment_count: activity.comment_count,
    athlete_count: activity.athlete_count,
    photo_count: activity.photo_count,
    map_id: activity.map?.id || null,
    summary_polyline: activity.map?.summary_polyline || null,
    trainer: activity.trainer,
    commute: activity.commute,
    manual: activity.manual,
    private: activity.private,
    visibility: activity.visibility,
    flagged: activity.flagged,
    gear_id: activity.gear_id,
    start_latlng: activity.start_latlng,
    end_latlng: activity.end_latlng,
    average_speed: activity.average_speed,
    max_speed: activity.max_speed,
    average_cadence: activity.average_cadence,
    average_watts: activity.average_watts,
    max_watts: activity.max_watts,
    weighted_average_watts: activity.weighted_average_watts,
    device_watts: activity.device_watts ?? false,
    kilojoules: activity.kilojoules,
    has_heartrate: activity.has_heartrate,
    average_heartrate: activity.average_heartrate,
    max_heartrate: activity.max_heartrate,
    heartrate_opt_out: activity.heartrate_opt_out,
    display_hide_heartrate_option: activity.display_hide_heartrate_option,
    elev_high: activity.elev_high,
    elev_low: activity.elev_low,
    upload_id: activity.upload_id,
    upload_id_str: activity.upload_id_str,
    external_id: activity.external_id,
    from_accepted_tag: activity.from_accepted_tag,
    pr_count: activity.pr_count,
    total_photo_count: activity.total_photo_count,
    has_kudoed: activity.has_kudoed,
    created_at: now,
  };
}
