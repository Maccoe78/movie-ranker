'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/auth';
import { apiClient } from '@/lib/api';
import Navigation from '@/components/Navigation';

export default function ProfilePage() {
    const { user, isAuthenticated, logout, updateUser } = useAuth();
    
    function parseDate(dateArray: number[] | string | null): string {
    if (!dateArray) return 'No Date';

    if (typeof dateArray === 'string') {
        return new Date(dateArray).toLocaleDateString('nl-NL', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    
    return 'Invalid Date';
    }

    // Form state for editing account info
    const [accountForm, setAccountForm] = useState({
        username: user?.username || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState('');
    const [reviewsCount, setReviewsCount] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [favoriteMovies, setFavoriteMovies] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [recentReviews, setRecentReviews] =  useState<any[]>([]);
    const [followingCount, setFollowingCount] = useState(0);

    useEffect(() => {
        const fetchUserStats = async () => {
            if (user?.id) {
                try {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const ratings: any[] = await apiClient.getUserRatings(user.id) as any[];
                    const reviewsWithComments = ratings.filter(
                        r => r.comment && r.comment.trim() !== ''
                    );
                    const recent = reviewsWithComments
                        .sort((a, b) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const getTime = (arr: any): number => {
                                if (!arr || !Array.isArray(arr)) return 0;
                                const [y, m, d, h = 0, min = 0, s= 0] = arr;
                                return new Date(y, m -1, d, h, min, s).getTime();
                            };
                            return getTime(b.createdAt) - getTime(a.createdAt);
                        })
                        .slice(0, 3);
                    const followingData = await apiClient.getFollowing(user.id);
                    setFollowingCount(followingData.following.length);
                    setRecentReviews(recent);
                    setReviewsCount(reviewsWithComments.length);

                if (ratings.length > 0) {
                    const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
                    const avg = totalRating / ratings.length;
                    setAverageRating(Math.round(avg * 10) / 10);
                } else {
                    setAverageRating(0);
                }

                const highestRated = ratings
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 3);
                setFavoriteMovies(highestRated);

                } catch (error) {
                    console.error('Error fetching user stats:', error);
                }
            }
        };
        fetchUserStats();
    }, [user?.id]);

    const getUserInitials = (username: string) => {
        return username.slice(0, 2).toUpperCase();
    }

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaveLoading(true);
        setSaveError('');
        setSaveSuccess('');

        // Validation
        if (accountForm.newPassword && accountForm.newPassword !== accountForm.confirmPassword) {
            setSaveError('New passwords do not match');
            setSaveLoading(false);
            return;
        }

        if (accountForm.newPassword && accountForm.newPassword.length < 6) {
            setSaveError('Password must be at least 6 characters long');
            setSaveLoading(false);
            return;
        }

        try {
            // Build update data object
            const updateData: { username?: string; password?: string } = {};
            
            // Only include username if it changed
            if (accountForm.username !== user?.username) {
                updateData.username = accountForm.username;
            }
            
            // Only include password if a new one was provided
            if (accountForm.newPassword) {
                updateData.password = accountForm.newPassword;
            }

            // Check if there are any changes to save
            if (Object.keys(updateData).length === 0) {
                setSaveError('No changes to save');
                setSaveLoading(false);
                return;
            }

            console.log('Updating user with:', updateData);
            console.log('Current user object:', user);
            console.log('User ID:', user!.id);

            // Call the API
            const response = await apiClient.updateUser(user!.id, updateData);

            console.log('Update response:', response);

            // Update the user in the AuthContext if username changed
            if (updateData.username) {
                const updatedUser = { ...user!, username: updateData.username };
                updateUser(updatedUser);
            }

            setSaveSuccess(response.message || 'Account updated successfully!');
            setAccountForm({
                username: response.username || accountForm.username,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setIsEditing(false);

        } catch (error: unknown) {
            console.error('Update failed:', error);
            setSaveError(error instanceof Error ? error.message : 'Failed to update account. Please try again.');
        } finally {
            setSaveLoading(false);
        }
    };

    const resetForm = () => {
        setAccountForm({
            username: user?.username || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setIsEditing(false);
        setSaveError('');
        setSaveSuccess('');
    };

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-gray-900">
                <Navigation currentPage="My Profile" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
                        <p className="text-gray-400">Please log in to view your profile.</p>
                    </div>
                </div>
            </div>
        );
    }

    const handleLogout = () => {
        logout();
        window.location.href = '/'; 
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Navigation */}
            <Navigation currentPage="My Profile" />

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Header */}
                <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 mb-8">
                    <div className="flex items-center space-x-6">
                        {/* Profile Picture (Initials) */}
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 flex items-center justify-center shadow-lg">
                            <span className="text-2xl font-bold text-white">
                                {getUserInitials(user.username)}
                            </span>
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-white mb-2">{user.username}</h1>
                            
                            {/* Stats */}
                            <div className="flex space-x-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-400">{averageRating.toFixed(1)}⭐</div>
                                    <div className="text-sm text-gray-400">Average Movie Ratings</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-400">{reviewsCount}</div>
                                    <div className="text-sm text-gray-400">Reviews</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-400">{followingCount}</div>
                                    <div className="text-sm text-gray-400">Following</div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col space-y-3">
                            <button 
                                onClick={() => setIsEditing(!isEditing)}
                                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                            >
                                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                            </button>
                            <button 
                                onClick={handleLogout}
                                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                {/* Profile Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Activity */}
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Recent Comments
                        </h2>
                        
                        {recentReviews.length === 0 ? (
                            <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 16h14l-2-16" />
                                </svg>
                            </div>
                            <p className="text-gray-400">No recent activity</p>
                            <p className="text-sm text-gray-500 mt-1">Start rating movies to see your activity here</p>
                            </div>
                        ) : (
                            <>
                            <div className="space-y-3">
                                {recentReviews.map((review) => (
                                <div key={review.id} className="flex items-start space-x-3 bg-gray-700 rounded-lg p-3">
                                    <div className="flex-shrink-0 w-12 h-16 bg-gray-600 rounded overflow-hidden">
                                    {review.movie.posterUrl ? (
                                        <Image 
                                        src={review.movie.posterUrl} 
                                        alt={review.movie.name}
                                        width={48}
                                        height={64}
                                        className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                        </svg>
                                        </div>
                                    )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium text-sm truncate">{review.movie.name}</p>
                                    <p className="text-gray-300 text-xs mt-1 line-clamp-2">{review.comment}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {parseDate(review.createdAt)}
                                    </p>
                                    </div>
                                </div>
                                ))}
                            </div>
                            </>
                        )}
                        </div>

                    {/* Favorite Movies */}
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Favorite Movies
                        </h2>
                        {favoriteMovies.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full gb-gray-700 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                    </svg>
                                </div>
                                <p className="text-gray-400">No favorite movies yet</p>
                                <p className="text-sm text-gray-500 mt-1">Rate movies to add them to favorites</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {favoriteMovies.map((rating) => (
                                    <div key={rating.id} className="flex items-center space-x-3 bg-gray-700 rounded-lg p-3">
                                        <div className="flex-shrink-0 w-12 h-16 bg-gray-600 rounded overflow-hidden">
                                            {rating.movie.posterUrl && (
                                                <Image
                                                    src={rating.movie.posterUrl}
                                                    alt={rating.movie.name}
                                                    width={48}
                                                    height={64}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium truncate">{rating.movie.name}</p>
                                            <p className="text-sm text-gray-400">{rating.movie.releaseYear}</p>
                                        </div>
                                        <div className="text-yellow-400">
                                            {'⭐'.repeat(rating.rating)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Account Settings */}
                <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Account Settings
                    </h2>

                    {/* Success/Error Messages */}
                    {saveError && (
                        <div className="mb-4 bg-red-800 border border-red-600 text-red-100 px-4 py-3 rounded-lg">
                            {saveError}
                        </div>
                    )}

                    {saveSuccess && (
                        <div className="mb-4 bg-green-800 border border-green-600 text-green-100 px-4 py-3 rounded-lg">
                            {saveSuccess}
                        </div>
                    )}

                    <form onSubmit={handleSaveChanges} className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                                <input
                                    type="text"
                                    value={accountForm.username}
                                    onChange={(e) => setAccountForm({...accountForm, username: e.target.value})}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                        !isEditing ? 'cursor-not-allowed text-gray-400' : ''
                                    }`}
                                    required
                                />
                                {!isEditing && <p className="text-xs text-gray-500 mt-1">Click &quot;Edit Profile&quot; to change</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={accountForm.newPassword}
                                    onChange={(e) => setAccountForm({...accountForm, newPassword: e.target.value})}
                                    disabled={!isEditing}
                                    placeholder={isEditing ? "Leave empty to keep current password" : "••••••••"}
                                    className={`w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                        !isEditing ? 'cursor-not-allowed text-gray-400' : ''
                                    }`}
                                    minLength={6}
                                />
                                {!isEditing && <p className="text-xs text-gray-500 mt-1">Click &quot;Edit Profile&quot; to change</p>}
                            </div>
                        </div>

                        {/* Password Confirmation (only show when editing and new password is entered) */}
                        {isEditing && accountForm.newPassword && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div></div> {/* Empty div for spacing */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={accountForm.confirmPassword}
                                        onChange={(e) => setAccountForm({...accountForm, confirmPassword: e.target.value})}
                                        placeholder="Confirm your new password"
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        disabled={saveLoading}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Buttons */}
                        {isEditing && (
                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    disabled={saveLoading}
                                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white rounded-lg transition-colors"
                                >
                                    {saveLoading ? 'Saving Changes...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}