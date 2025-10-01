"use client";

import React from "react";
import PublicHeader from "../_components/public-header";
import { useUser } from "@clerk/nextjs";

const PostsPage = ({ params }) => {
  const { username, postId } = React.use(params);
  const { user: currentUser } = useUser();
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <PublicHeader link={`/${username}`} title={"Back to Profile"} />
    </div>
  );
};

export default PostsPage;
