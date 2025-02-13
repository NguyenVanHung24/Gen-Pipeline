import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Image from "../../components/Blog/Image";
import PostMenuActions from "../../components/Blog/PostMenuActions";
import Comments from "../../components/Blog/Comments";
import { useAuth } from "../../components/Extension/AuthContext";
import { format } from "timeago.js";
import { toast } from "react-toastify";

const SinglePostPage = () => {
  const { slug } = useParams();
  const { getToken } = useAuth();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_BACK_END_URL;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${API_BASE_URL}/posts/${slug}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setPost(data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
        toast.error(error.message);
      }
    };

    fetchPost();
  }, [slug, getToken]);

  if (isLoading) return (
    <div className="flex justify-center items-center py-8">
      <div className="loading-spinner">Loading...</div>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-8">
      <div className="error-message text-red-500">Error: {error}</div>
    </div>
  );

  if (!post) return (
    <div className="text-center py-8">Post not found!</div>
  );

  return (
    <div className="flex flex-col gap-8">
      {/* detail */}
      <div className="flex gap-8">
        <div className="lg:w-3/5 flex flex-col gap-8">
          <h1 className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Written by</span>
            <Link to={`/blog/posts?author=${post.user?.username}`} className="text-blue-800">
              {post.user?.username}
            </Link>
            <span>on</span>
            <Link to={`/blog/posts?cat=${post.category}`} className="text-blue-800">
              {post.category}
            </Link>
            <span>{format(post.createdAt)}</span>
          </div>
          <p className="text-gray-500 font-medium">{post.desc}</p>
        </div>
        {post.img && (
          <div className="hidden lg:block w-2/5">
            <Image src={post.img} w="600" className="rounded-2xl" />
          </div>
        )}
      </div>

      {/* content */}
      <div className="flex flex-col md:flex-row gap-12 justify-between">
        {/* text content */}
        <div className="lg:text-lg flex flex-col gap-6 text-justify">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* sidebar menu */}
        <div className="px-4 h-max sticky top-8">
          <h1 className="mb-4 text-sm font-medium">Author</h1>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-8">
              {post.user?.img && (
                <Image
                  src={post.user.img}
                  className="w-12 h-12 rounded-full object-cover"
                  w="48"
                  h="48"
                />
              )}
              <Link to={`/blog/posts?author=${post.user?.username}`} className="text-blue-800">
                {post.user?.username}
              </Link>
            </div>
            {post.user?.bio && (
              <p className="text-sm text-gray-500">{post.user.bio}</p>
            )}
          </div>

          <PostMenuActions post={post}/>

          {/* Categories */}
          <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/blog/posts" className="underline">All</Link>
            <Link to="/blog/posts?cat=design" className="underline">Web Design</Link>
            <Link to="/blog/posts?cat=development" className="underline">Development</Link>
            <Link to="/blog/posts?cat=database" className="underline">Databases</Link>
            <Link to="/blog/posts?cat=seo" className="underline">Search Engines</Link>
            <Link to="/blog/posts?cat=marketing" className="underline">Marketing</Link>
          </div>
        </div>
      </div>

      {/* Comments */}
      <Comments postId={post._id}/>
    </div>
  );
};

export default SinglePostPage;
