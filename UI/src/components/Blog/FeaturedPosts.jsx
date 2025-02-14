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
    <div className="mt-8 flex flex-col lg:flex-row gap-8">
      {/* First Post */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        {firstPost.img && (
          <Image
            src={firstPost.img}
            className="rounded-3xl object-cover"
            w="200"
            h="150"
            alt={firstPost.title}
          />
        )}
        <div className="flex items-center gap-4">
          <h1 className="font-semibold lg:text-lg">01.</h1>
          <Link 
            to={`/blog/posts?cat=${firstPost.category || ''}`} 
            className="text-blue-800 lg:text-lg"
          >
            {firstPost.category}
          </Link>
          <span className="text-gray-500">
            {firstPost.createdAt ? format(firstPost.createdAt) : ''}
          </span>
        </div>
        <Link
          to={`/blog/${firstPost.slug || ''}`}
          className="text-xl lg:text-3xl font-semibold lg:font-bold"
        >
          {firstPost.title}
        </Link>
      </div>

      {/* Other Posts */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        {otherPosts.map((post, index) => (
          <div key={post._id} className="lg:h-1/3 flex justify-between gap-4">
            {post.img && (
              <div className="w-1/3 aspect-video">
                <Image
                  src={post.img}
                  className="rounded-3xl object-cover w-full h-full"
                  w="298"
                  alt={post.title}
                />
              </div>
            )}
            <div className="w-2/3">
              <div className="flex items-center gap-4 text-sm lg:text-base mb-4">
                <h1 className="font-semibold">0{index + 2}.</h1>
                <Link to={`/blog/posts?cat=${post.category}`} className="text-blue-800">
                  {post.category}
                </Link>
                <span className="text-gray-500 text-sm">
                  {post.createdAt ? format(post.createdAt) : ''}
                </span>
              </div>
              <Link
                to={`/blog/${post.slug}`}
                className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium"
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
