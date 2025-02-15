import { useAuth } from "../Extension/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../utils/axios";

const PostMenuActions = ({ post }) => {
  const { user, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const isAdmin = user?.roles?.includes('admin') || false;

  useEffect(() => {
    console.log('Auth State:', { user, isSignedIn });
  }, [user, isSignedIn]);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await api.delete(`/posts/${post._id}`);
      toast.success("Post deleted successfully!");
      navigate("/blog");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeature = async () => {
    try {
      setIsLoading(true);
      await api.patch('/posts/feature', { postId: post._id });
      toast.success("Post feature status updated!");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      return navigate("/blog/login");
    }

    try {
      setIsLoading(true);
      await api.patch('/users/save', { postId: post._id });
      setIsSaved(prev => !prev);
      toast.success(isSaved ? "Post unsaved!" : "Post saved!");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <h1 className="mt-8 mb-4 text-sm font-medium">Actions</h1>
      <div className="flex flex-col gap-2">
        {/* Save Button */}
        <div
          className="flex items-center gap-2 py-2 text-sm cursor-pointer"
          onClick={handleSave}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="20px"
            height="20px"
          >
            <path
              d="M12 4C10.3 4 9 5.3 9 7v34l15-9 15 9V7c0-1.7-1.3-3-3-3H12z"
              stroke="black"
              strokeWidth="2"
              fill={isSaved ? "black" : "none"}
            />
          </svg>
          <span>Save this Post</span>
          {isLoading && <span className="text-xs">(in progress)</span>}
        </div>

        {/* Feature Button - Admin Only */}
        {isAdmin && (
          <div
            className="flex items-center gap-2 py-2 text-sm cursor-pointer"
            onClick={handleFeature}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="20px"
              height="20px"
            >
              <path
                d="M24 2L29.39 16.26L44 18.18L33 29.24L35.82 44L24 37L12.18 44L15 29.24L4 18.18L18.61 16.26L24 2Z"
                stroke="black"
                strokeWidth="2"
                fill={post.isFeatured ? "black" : "none"}
              />
            </svg>
            <span>Feature</span>
            {isLoading && <span className="text-xs">(in progress)</span>}
          </div>
        )}

        {/* Delete Button - Owner or Admin */}
        {user && (post?.user?.username === user?.username || isAdmin) && (
          <div
            className="flex items-center gap-2 py-2 text-sm cursor-pointer"
            onClick={handleDelete}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 50 50"
              fill="red"
              width="20px"
              height="20px"
            >
              <path d="M 21 2 C 19.354545 2 18 3.3545455 18 5 L 18 7 L 10.154297 7 A 1.0001 1.0001 0 0 0 9.984375 6.9863281 A 1.0001 1.0001 0 0 0 9.8398438 7 L 8 7 A 1.0001 1.0001 0 1 0 8 9 L 9 9 L 9 45 C 9 46.645455 10.354545 48 12 48 L 38 48 C 39.645455 48 41 46.645455 41 45 L 41 9 L 42 9 A 1.0001 1.0001 0 1 0 42 7 L 40.167969 7 A 1.0001 1.0001 0 0 0 39.841797 7 L 32 7 L 32 5 C 32 3.3545455 30.645455 2 29 2 L 21 2 z" />
            </svg>
            <span>Delete this Post</span>
            {/* <p>{JSON.stringify(post, null, 2)}</p> */}
            {isLoading && <span className="text-xs">(in progress)</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostMenuActions;