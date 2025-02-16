import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Image from "./Image";
import { toast } from "react-toastify";
import { useUser } from "../Extension/AuthContext";
import { useAuth } from "../Extension/AuthContext";
import { format } from "timeago.js";

const FeaturedPosts = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_BACK_END_URL;

  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      try {
        const token = await getToken();
        const response = await fetch(
          `${API_BASE_URL}/posts?featured=true&limit=4&sort=newest`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        if (isMounted) {
          setPosts(data.posts || []);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message);
          setIsLoading(false);
          toast.error(error.message);
        }
      }
    };

    fetchPosts();
    return () => {
      isMounted = false;
    };
  }, [getToken]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!posts || posts.length === 0) return null;

  const firstPost = posts[0] || {};
  const otherPosts = posts.slice(1);

  return (
    <div className="mt-4 p-4 flex flex-col lg:flex-row gap-3">
      {/* First Post */}
      <div className="w-full lg:w-1/2 flex flex-col gap-2 p-2">
        {firstPost.img && (
          <Image
            src={firstPost.img}
            className="rounded-lg object-cover w-full h-[180px]"
            w="400"
            h="180"
            alt={firstPost.title}
          />
        )}
        <div className="flex items-center gap-2 mt-1">
          <h1 className="font-semibold text-sm lg:text-base">01.</h1>
          <Link 
            to={`/blog/posts?cat=${firstPost.category || ''}`} 
            className="text-blue-800 text-sm lg:text-base"
          >
            {firstPost.category}
          </Link>
          <span className="text-gray-500 text-xs">
            {firstPost.createdAt ? format(firstPost.createdAt) : ''}
          </span>
        </div>
        <Link
          to={`/blog/${firstPost.slug || ''}`}
          className="text-base lg:text-xl font-semibold"
        >
          {firstPost.title}
        </Link>
      </div>

      {/* Other Posts */}
      <div className="w-full lg:w-1/2 flex flex-col gap-2 p-2">
        {otherPosts.map((post, index) => (
          <div key={post._id} className="flex justify-between gap-2 p-1">
            {post.img && (
              <div className="w-1/3 h-[80px]">
                <Image
                  src={post.img}
                  className="rounded-lg object-cover w-full h-full"
                  w="120"
                  h="80"
                  alt={post.title}
                />
              </div>
            )}
            <div className="w-2/3 pl-2">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-semibold text-sm">0{index + 2}.</h1>
                <Link 
                  to={`/blog/posts?cat=${post.category}`} 
                  className="text-blue-800 text-sm"
                >
                  {post.category}
                </Link>
                <span className="text-gray-500 text-xs">
                  {post.createdAt ? format(post.createdAt) : ''}
                </span>
              </div>
              <Link
                to={`/blog/${post.slug}`}
                className="text-sm lg:text-base font-medium"
              >
                {post.title}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPosts;
