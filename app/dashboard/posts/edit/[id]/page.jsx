"use client";

import PostEditor from "@/components/post-editor";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/user-convex-query";
import { useParams } from "next/navigation";
import React from "react";
import { BarLoader } from "react-spinners";

const EditPostPage = () => {
  const params = useParams();
  const postId = params.id;

  const {
    data: post,
    isLoading,
    error,
  } = useConvexQuery(api.posts.getById, { id: postId });

  if (isLoading) {
    return <BarLoader color="#d8b4fe" width={"100%"} />;
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center ">
          <h1 className="text-2xl font-bold text-white mb-2">Post Not Found</h1>
          <p className="text-slate-400">
            The post you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return <PostEditor initialData={post} mode="edit" />;
};

export default EditPostPage;
