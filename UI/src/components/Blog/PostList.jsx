import { useState } from 'react';
import PostListItem from "./PostListItem";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";
import { usePosts } from "../Extension/UsePosts";
import ErrorBoundary from '../Extension/ErrorBoundary';

const PostList = () => {
  const [searchParams] = useSearchParams();
  const {
    allPosts = [], // Provide default empty array
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError
  } = usePosts(searchParams);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <div className="error-message text-red-500">Error: {isError.message}</div>
      </div>
    );
  }

  // Ensure allPosts is an array
  const posts = Array.isArray(allPosts) ? allPosts : [];

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <InfiniteScroll
        dataLength={posts.length || 0}
        next={fetchNextPage}
        hasMore={Boolean(hasNextPage)}
        loader={
          <div className="flex justify-center items-center py-4">
            <div className="loading-spinner">Loading more posts...</div>
          </div>
        }
        endMessage={
          <p className="text-center text-gray-500 mt-4">
            No more posts to load
          </p>
        }
        scrollThreshold="90%"
      >
        <div className="space-y-8">
          {posts.map((post) => (
            <PostListItem 
              key={post?._id || Math.random()} 
              post={post} 
            />
          ))}
        </div>
      </InfiniteScroll>
    </ErrorBoundary>
  );
};

export default PostList;
