export interface StravaActivityInsert {
  id: number; // Strava activity ID (primary key)
  athlete_id: number;
  name: string | null;
  distance: number | null;
  moving_time: number | null;
  elapsed_time: number | null;
  total_elevation_gain: number | null;
  type: string | null;
  sport_type: string | null;
  start_date: string | null;
  start_date_local: string | null;
  timezone: string | null;
  location_city: string | null;
  location_state: string | null;
  location_country: string | null;
  achievement_count: number | null;
  kudos_count: number | null;
  comment_count: number | null;
  athlete_count: number | null;
  photo_count: number | null;
  map_id: string | null;
  summary_polyline: string | null;
  trainer: boolean | null;
  commute: boolean | null;
  manual: boolean | null;
  private: boolean | null;
  visibility: string | null;
  flagged: boolean | null;
  gear_id: string | null;
  start_latlng: number[] | null; // [lat, lng]
  end_latlng: number[] | null; // [lat, lng]
  average_speed: number | null;
  max_speed: number | null;
  average_cadence: number | null;
  average_watts: number | null;
  max_watts: number | null;
  weighted_average_watts: number | null;
  device_watts: boolean | null;
  kilojoules: number | null;
  has_heartrate: boolean | null;
  average_heartrate: number | null;
  max_heartrate: number | null;
  heartrate_opt_out: boolean | null;
  display_hide_heartrate_option: boolean | null;
  elev_high: number | null;
  elev_low: number | null;
  upload_id: number | null;
  upload_id_str: string | null;
  external_id: string | null;
  from_accepted_tag: boolean | null;
  pr_count: number | null;
  total_photo_count: number | null;
  has_kudoed: boolean | null;
  created_at?: string;
}
