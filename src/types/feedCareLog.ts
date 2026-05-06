type FeedCareLog = {
  id: number;
  plant_id: number;
  user_id: string;
  action_type: string;
  action_date: string;
  notes: string | null;
  photo_url: string | null;
  is_private: boolean;
  created_at: string;
  plants: {
    id: number;
    name: string;
    user_id: string;
    is_private: boolean;
  };
  profiles: {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  care_log_likes: {
    id: number;
    user_id: string;
  }[];
  care_log_comments: {
    id: number;
    body: string;
    created_at: string;
    profiles: {
      username: string | null;
      full_name: string | null;
      avatar_url: string | null;
    } | null;
  }[];
};
