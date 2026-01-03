export interface Follow {
  id: number;
  userId: number;
  followedUserId: number;
  createdAt: string;
}

export interface FollowedUser {
  id: number;
  username: string;
}

export interface FollowingResponse {
  following: FollowedUser[];
}