import { FollowedUser, FollowingResponse } from '@/types/follow';
import { 
  followUser, 
  unfollowUser, 
  getFollowing, 
  searchUsers 
} from '@/repositories/followRepository';

export async function followUserById(userId: number, followedUserId: number): Promise<void> {
  // BUSINESS LOGICA: Validatie
  if (userId === followedUserId) {
    throw new Error('You cannot follow yourself');
  }

  try {
    console.log(`FollowService: User ${userId} following user ${followedUserId}`);
    await followUser(userId, followedUserId);
    console.log('FollowService: Successfully followed user');
  } catch (error) {
    console.error('FollowService: Error following user:', error);
    throw error;
  }
}

export async function unfollowUserById(userId: number, followedUserId: number): Promise<void> {
  try {
    console.log(`FollowService: User ${userId} unfollowing user ${followedUserId}`);
    await unfollowUser(userId, followedUserId);
    console.log('FollowService: Successfully unfollowed user');
  } catch (error) {
    console.error('FollowService: Error unfollowing user:', error);
    throw error;
  }
}

export async function getFollowingList(userId: number): Promise<FollowedUser[]> {
  try {
    console.log('FollowService: Fetching following list for user:', userId);
    const response = await getFollowing(userId);
    return response.following;
  } catch (error) {
    console.error('FollowService: Error fetching following list:', error);
    throw error;
  }
}

export async function getFollowingCount(userId: number): Promise<number> {
  try {
    const response = await getFollowing(userId);
    return response.following.length;
  } catch (error) {
    console.error('FollowService: Error fetching following count:', error);
    return 0;
  }
}

export async function searchUsersToFollow(
  searchQuery: string, 
  currentUserId: number, 
  alreadyFollowing: FollowedUser[]
): Promise<FollowedUser[]> {
  // BUSINESS LOGICA: Validatie
  if (!searchQuery || searchQuery.trim().length === 0) {
    return [];
  }

  try {
    console.log('FollowService: Searching users:', searchQuery);
    const results = await searchUsers(searchQuery);
    
    // BUSINESS LOGICA: Filter out current user and already followed users
    const filtered = results.filter(user => 
      user.id !== currentUserId && 
      !alreadyFollowing.some(followedUser => followedUser.id === user.id)
    );
    
    return filtered;
  } catch (error) {
    console.error('FollowService: Error searching users:', error);
    throw error;
  }
}

export async function isFollowing(userId: number, targetUserId: number): Promise<boolean> {
  try {
    const response = await getFollowing(userId);
    return response.following.some(user => user.id === targetUserId);
  } catch (error) {
    console.error('FollowService: Error checking if following:', error);
    return false;
  }
}

export async function toggleFollow(userId: number, targetUserId: number): Promise<boolean> {
  try {
    const isCurrentlyFollowing = await isFollowing(userId, targetUserId);
    
    if (isCurrentlyFollowing) {
      await unfollowUserById(userId, targetUserId);
      return false; // Now not following
    } else {
      await followUserById(userId, targetUserId);
      return true; // Now following
    }
  } catch (error) {
    console.error('FollowService: Error toggling follow:', error);
    throw error;
  }
}

export function sortUsersByUsername(users: FollowedUser[]): FollowedUser[] {
  return [...users].sort((a, b) => 
    a.username.toLowerCase().localeCompare(b.username.toLowerCase())
  );
}

export function filterUsersByUsername(users: FollowedUser[], query: string): FollowedUser[] {
  if (!query || query.trim().length === 0) return users;
  
  const lowerQuery = query.toLowerCase();
  return users.filter(user => 
    user.username.toLowerCase().includes(lowerQuery)
  );
}

export async function followAndRefresh(userId: number, targetUserId: number, currentSearchResults: FollowedUser[]): Promise<{ following: FollowedUser[], searchResults: FollowedUser[] }> {
  await followUserById(userId, targetUserId);
  const updatedFollowing = await getFollowingList(userId);
  const updatedSearchResults = currentSearchResults.filter(u => u.id !== targetUserId);
  
  return {
    following: updatedFollowing,
    searchResults: updatedSearchResults
  };
}

export async function unfollowAndRefresh(userId: number, targetUserId: number): Promise<FollowedUser[]> {
  await unfollowUserById(userId, targetUserId);
  return await getFollowingList(userId);
}