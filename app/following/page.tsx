'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { getFollowingList, searchUsersToFollow, followAndRefresh, unfollowAndRefresh } from '@/services/followService';
import { getUserInitials } from '@/services/userService';
import Navigation from '@/components/Navigation';

export default function FollowingPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [following, setFollowing] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showSearch, setShowSearch] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const fetchFollowing = async () => {
            if (user?.id) {
                try {
                    const followingList = await getFollowingList(user.id);
                    setFollowing(followingList);
                } catch (error) {
                    console.error('Error fetching following:', error);
                }
            }
        };
        fetchFollowing();
    }, [user?.id]);

    const handleSearch = async () => {
        if (!searchQuery.trim() || !user?.id) return;
        setLoading(true);
        try {
            const filtered = await searchUsersToFollow(searchQuery, user.id, following);
            setSearchResults(filtered);
        } catch (error) {
            console.error('Error searching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async (userId: number) => {
        if (!user?.id) return;

        try {
            const result = await followAndRefresh(user.id, userId, searchResults);
            setFollowing(result.following);
            setSearchResults(result.searchResults);
        } catch {
            alert('Failed to follow user');
        }
    };

    const handleUnfollow = async (userId: number) => {
        if (!user?.id) return;

        try {
            const updatedList = await unfollowAndRefresh(user.id, userId);
            setFollowing(updatedList);
        } catch {
            alert('Failed to unfollow user');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <Navigation currentPage="Following" />
            
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header met Follow button */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white">Following</h1>
                    <button 
                        onClick={() => setShowSearch(!showSearch)}
                        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white"
                    >
                        {showSearch ? 'Cancel' : 'Follow Someone'}
                    </button>
                </div>

                {/* Search Section */}
                {showSearch && (
                    <div className="bg-gray-800 rounded-xl p-6 mb-6">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={searchQuery}
                                data-testid="search-users"
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Search users by username..."
                                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg"
                            />
                            <button 
                                onClick={handleSearch}
                                disabled={loading}
                                className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg text-white disabled:bg-purple-800"
                            >
                                {loading ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                        
                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {searchResults.map(user => (
                                    <div key={user.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                                {getUserInitials(user.username)}
                                            </div>
                                            <span className="text-white">{user.username}</span>
                                        </div>
                                        <button
                                            onClick={() => handleFollow(user.id)}
                                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white"
                                        >
                                            Follow
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {searchQuery && searchResults.length === 0 && !loading && (
                            <p className="text-gray-400 text-center mt-4">No users found</p>
                        )}
                    </div>
                )}

                {/* Following List */}
                <div className="bg-gray-800 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">
                        People you follow ({following.length})
                    </h2>
                    
                    {following.length === 0 ? (
                        <p className="text-gray-400">You are not following anyone yet. Start following people to see their reviews!</p>
                    ) : (
                        <div className="space-y-3">
                            {following.map(user => (
                                <div key={user.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                            {getUserInitials(user.username)}
                                        </div>
                                        <span className="text-white">{user.username}</span>
                                    </div>
                                    <button
                                        onClick={() => handleUnfollow(user.id)}
                                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white"
                                    >
                                        Unfollow
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
