interface Broadcaster {
  broadcaster_id: string;
  broadcaster_login: string;
  broadcaster_name: string;
  followed_at: string;
}

interface PaginationCursor {
  cursor: string;
}

export interface FollowedChannelsType {
  total: number;
  data: Broadcaster[];
  pagination: PaginationCursor;
}
