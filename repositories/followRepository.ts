import { Follow, FollowedUser, FollowingResponse } from '@/types/follow';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `API Error: ${response.status}`);
  }

  const text = await response.text();
  
  if (!text) {
    return {} as T;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    return { message: text } as T;
  }
}

  export async function followUser(userId: number, followedUserId: number): Promise<{message: string}> {
    return request(`/api/follows/${userId}/follow/${followedUserId}`, {
      method: 'POST',
    });
  }

  export async function unfollowUser(userId: number, followedUserId: number): Promise<{message: string}> {
    return request(`/api/follows/${userId}/follow/${followedUserId}`, {
      method: 'DELETE',
    });
  }

  export async function getFollowing(userId: number): Promise<FollowingResponse> {
    return request(`/api/follows/${userId}/following`);
  }

  export async function searchUsers(username: string): Promise<FollowedUser[]> {
    return request(`/api/follows/search?username=${encodeURIComponent(username)}`);
  }