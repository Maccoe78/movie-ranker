export interface User {
  id: number;
  username: string;
}

export interface UserProfile extends User {
  followingCount?: number;
  followersCount?: number;
  ratingsCount?: number;
  averageRating?: number;
}

export interface LoginRegisterRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface UpdateUserRequest {
  username?: string;
  password?: string;
}

export interface LoginResponse {
  message: string;
  username: string;
  token?: string;
}

export interface UserDetails {
  id: number;
  username: string;
  password: string;
}

export interface UpdateUserResponse {
  message: string;
  username: string;
}