import { format } from "timeago.js";
import Image from "./Image";
import { toast } from "react-toastify";
import { useAuth } from "../Extension/AuthContext";
import { useState } from "react";
import { HiOutlineUser, HiOutlineClock, HiOutlineTrash } from "react-icons/hi";
import api from "../../utils/axios"; // Import the api utility

const Comment = ({ comment, postId, onDelete }) => {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const deleteComment = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await api.delete(`/comments/${comment._id}`);
      
      if (!response.data) {
        throw new Error('Failed to delete comment');
      }
      
      toast.success("Comment deleted successfully");
      onDelete?.(comment._id);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const canDeleteComment = user && (
    (comment?.user?._id === user?._id) || 
    user?.roles?.includes('admin')
  );

  return (
    <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            {comment?.user?.img ? (
              <Image
                src={comment?.user?.img}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <HiOutlineUser className="h-6 w-6 text-primary-600" />
              </div>
            )}
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {comment?.user?.username}
              </span>
              <div className="flex items-center text-sm text-gray-500">
                <HiOutlineClock className="h-4 w-4 mr-1" />
                {format(comment?.createdAt)}
              </div>
            </div>
          </div>
        </div>

        {canDeleteComment && (
          <button
            onClick={deleteComment}
            disabled={isDeleting}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            <HiOutlineTrash className="h-4 w-4 mr-1" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-700 border-t border-gray-100 pt-4">
        {comment?.desc}
      </div>
    </div>
  );
};

export default Comment;
