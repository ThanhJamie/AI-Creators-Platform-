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

const FollowingPage = ({ params }) => {
  const { username } = React.use(params);
  const { user: currentUser } = useUser();

  // Get user profile
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useConvexQuery(api.users.getByUsername, { username });

  // Get following list (only if it's the current user)
  const {
    data: following,
    isLoading: followingLoading,
    error: followingError,
  } = useConvexQuery(
    api.follows.getMyFollowing,
    currentUser &&
      user &&
      currentUser.publicMetadata?.username === user.username
      ? {}
      : "skip"
  );

  if (userLoading || followingLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading following...</p>
        </div>
      </div>
    );
  }

  if (userError || !user) {
    notFound();
  }

  const isOwnProfile =
    currentUser && currentUser.publicMetadata?.username === user.username;

  // If it's not the user's own profile, redirect to followers page
  if (!isOwnProfile) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <Users className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Following list is private
            </h3>
            <p className="text-slate-400 mb-6">
              You can only view your own following list.
            </p>
            <Link
              href={`/${username}`}
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (followingError) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-red-400">Error loading following list</p>
            <p className="text-slate-400 mt-2">{followingError.message}</p>
          </div>
        </div>
      </div>
    );
  }

  // Follow mutation
  const toggleFollow = useConvexMutation(api.follows.toggleFollow);

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
              Following
            </h1>
            <p className="text-slate-400">
              {following?.length || 0}{" "}
              {following?.length === 1 ? "person" : "people"}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {!following || following.length === 0 ? (
          <Card className="card-glass">
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Not following anyone yet
              </h3>
              <p className="text-slate-400">
                When you follow people, they'll appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {following.map((followedUser) => (
              <Card key={followedUser._id} className="card-glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <Link href={`/${followedUser.username}`}>
                        <div className="relative w-12 h-12">
                          {followedUser.imageUrl ? (
                            <Image
                              src={followedUser.imageUrl}
                              alt={followedUser.name}
                              fill
                              className="rounded-full object-cover border border-slate-700 hover:border-purple-500 transition-colors"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-lg font-bold hover:from-purple-500 hover:to-blue-500 transition-colors">
                              {followedUser.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/${followedUser.username}`}
                            className="font-semibold text-white hover:text-purple-400 transition-colors"
                          >
                            {followedUser.name}
                          </Link>
                        </div>
                        <Link
                          href={`/${followedUser.username}`}
                          className="text-slate-400 hover:text-slate-300 transition-colors"
                        >
                          @{followedUser.username}
                        </Link>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                          <span>{followedUser.followerCount} followers</span>
                          <span>{followedUser.postCount} posts</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Followed{" "}
                            {new Date(
                              followedUser.followedAt
                            ).toLocaleDateString()}
                          </div>
                        </div>
                        {followedUser.lastPostAt && (
                          <p className="text-xs text-slate-500 mt-1">
                            Last post:{" "}
                            {new Date(
                              followedUser.lastPostAt
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Unfollow Button */}
                    <Button
                      onClick={() => handleFollowToggle(followedUser._id)}
                      disabled={toggleFollow.isLoading}
                      variant="outline"
                      size="sm"
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Following
                    </Button>
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

export default FollowingPage;
