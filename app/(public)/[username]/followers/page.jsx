"use client";

import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/user-convex-query";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft, Calendar, UserCheck, UserPlus, Users } from "lucide-react";
import { notFound } from "next/navigation";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const FollowersPage = ({ params }) => {
  const { username } = React.use(params);
  const { user: currentUser } = useUser();

  // Get user profile
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useConvexQuery(api.users.getByUsername, { username });

  // Get followers list
  const {
    data: followers,
    isLoading: followersLoading,
    error: followersError,
  } = useConvexQuery(
    api.follows.getFollowersByUsername,
    user ? { username } : "skip"
  );

  // Get follower count
  const { data: followerCount } = useConvexQuery(
    api.follows.getFollowerCount,
    user ? { userId: user._id } : "skip"
  );

  // Follow mutation
  const toggleFollow = useConvexMutation(api.follows.toggleFollow);

  if (userLoading || followersLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading followers...</p>
        </div>
      </div>
    );
  }

  if (userError || !user) {
    notFound();
  }

  if (followersError) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-red-400">Error loading followers</p>
            <p className="text-slate-400 mt-2">{followersError.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const handleFollowToggle = async (followingId) => {
    if (!currentUser) {
      toast.error("You must be logged in to follow users.");
      return;
    }

    try {
      await toggleFollow.mutate({ followingId });
    } catch (error) {
      toast.error(error.message || "An error occurred. Please try again.");
    }
  };

  const isOwnProfile =
    currentUser && currentUser.publicMetadata?.username === user.username;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/${username}`}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Profile
            </Link>
          </div>
          <div className="mt-4">
            <h1 className="text-2xl font-bold gradient-text-primary">
              {user.name}'s Followers
            </h1>
            <p className="text-slate-400">
              {followerCount || 0}{" "}
              {followerCount === 1 ? "follower" : "followers"}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {!followers || followers.length === 0 ? (
          <Card className="card-glass">
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No followers yet
              </h3>
              <p className="text-slate-400">
                {isOwnProfile
                  ? "When people start following you, they'll appear here."
                  : `${user.name} doesn't have any followers yet.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {followers.map((follower) => (
              <Card key={follower._id} className="card-glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <Link href={`/${follower.username}`}>
                        <div className="relative w-12 h-12">
                          {follower.imageUrl ? (
                            <Image
                              src={follower.imageUrl}
                              alt={follower.name}
                              fill
                              className="rounded-full object-cover border border-slate-700 hover:border-purple-500 transition-colors"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-lg font-bold hover:from-purple-500 hover:to-blue-500 transition-colors">
                              {follower.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/${follower.username}`}
                            className="font-semibold text-white hover:text-purple-400 transition-colors"
                          >
                            {follower.name}
                          </Link>
                          {follower.followsBack && (
                            <span className="px-2 py-1 text-xs bg-purple-600/20 text-purple-300 rounded-full">
                              Follows back
                            </span>
                          )}
                        </div>
                        <Link
                          href={`/${follower.username}`}
                          className="text-slate-400 hover:text-slate-300 transition-colors"
                        >
                          @{follower.username}
                        </Link>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                          <span>{follower.followerCount} followers</span>
                          <span>{follower.postCount} posts</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Followed{" "}
                            {new Date(follower.followedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Follow Button */}
                    {currentUser &&
                      currentUser.publicMetadata?.username !==
                        follower.username && (
                        <Button
                          onClick={() => handleFollowToggle(follower._id)}
                          disabled={toggleFollow.isLoading}
                          variant={
                            follower.currentUserFollows ? "outline" : "primary"
                          }
                          size="sm"
                        >
                          {follower.currentUserFollows ? (
                            <>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Following
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Follow
                            </>
                          )}
                        </Button>
                      )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowersPage;
