"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/user-convex-query";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { BarLoader } from "react-spinners";

const PostsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const router = useRouter();
  const { data: posts, isLoading } = useConvexQuery(api.posts.getUserPosts);
  const deletePost = useConvexMutation(api.posts.deletePost);

  console.log(posts);

  const filteredPosts = useMemo(() => {
    if (!posts) return [];

    let filtered = posts.filter((post) => {
      const matchesSearch = post.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || post.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.createAt - a.createAt;
        case "oldest":
          return a.createAt - b.createAt;
        case "mostViews":
          return b.viewCount - a.viewCount;
        case "mostLikes":
          return b.likeCount - a.likeCount;
        case "alphabetical":
          return a.title.localeCompare(b.title);
        default:
          return b.createAt - a.createAt;
      }
    });
    return filtered;
  }, [posts, searchQuery, statusFilter, sortBy]);

  if (isLoading) return <BarLoader width={"100%"} color="#d8b4fe" />;

  return (
    <div className="space-y-6 p-4 lg:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text-primary">My Posts</h1>
          <p className="text-slate-400 mt-2">
            Manage and track your content performance
          </p>
        </div>
        <Link href={"/dashboard/create"}>
          <Button variant={"primary"}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Posts
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PostsPage;
