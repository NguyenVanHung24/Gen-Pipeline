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
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="flex justify-center items-center py-8">
        <div className="loading-spinner">Loading...</div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="text-center py-8">
        <div className="error-message text-red-500">Error: {error}</div>
      </div>
    </div>
  );

  if (!post) return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="text-center py-8">Post not found!</div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {post.title}
          </h2>
          <div className="mt-1 text-sm text-gray-500 flex items-center gap-2">
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
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 mb-8">
        <div className="flex flex-col gap-8">
          {/* Post Details */}
          <div className="flex gap-8">
            <div className="lg:w-3/5">
              <p className="text-gray-500 font-medium">{post.desc}</p>
            </div>
            {post.img && (
              <div className="hidden lg:block w-2/5">
                <Image src={post.img} w="400" className="rounded-2xl" />
              </div>
            )}
          </div>

          {/* Post Content */}
          <div className="flex flex-col md:flex-row gap-12 justify-between">
            <div className="lg:text-lg flex flex-col gap-6">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {/* Sidebar */}
            <div className="px-4 h-max sticky top-8 w-full md:w-64">
              {/* Author Section */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <h1 className="text-lg font-medium text-gray-900 mb-4">Author</h1>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    {post.user?.img && (
                      <Image
                        src={post.user?.img}
                        className="w-12 h-12 rounded-full object-cover"
                        w="48"
                        h="48"
                      />
                    )}
                    <Link to={`/blog/posts?author=${post?.user?.username}`} className="text-blue-800">
                      {post.user?.username}
                    </Link>
                  </div>
                  {post.user?.bio && (
                    <p className="text-sm text-gray-500">{post.user?.bio}</p>
                  )}
                </div>
              </div>

              <PostMenuActions post={post}/>

              {/* Categories Section */}
              <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
                <h1 className="text-lg font-medium text-gray-900 mb-4">Categories</h1>
                <div className="flex flex-col gap-2">
                  <Link to="/blog/posts" className="text-blue-800 hover:underline">All</Link>
                  <Link to="/blog/posts?cat=CI/CD" className="text-blue-800 hover:underline">CI/CD</Link>
                  <Link to="/blog/posts?cat=Cloud" className="text-blue-800 hover:underline">Cloud</Link>
                  <Link to="/blog/posts?cat=Devsecops" className="text-blue-800 hover:underline">Devsecops</Link>
                  <Link to="/blog/posts?cat=Security" className="text-blue-800 hover:underline">Security</Link>
                  <Link to="/blog/posts?cat=Tools" className="text-blue-800 hover:underline">Tools</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
        <Comments postId={post?._id}/>
      </div>
    </div>
  );
};

export default SinglePostPage;
