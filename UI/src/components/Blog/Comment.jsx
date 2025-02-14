import { format } from "timeago.js";
import Image from "./Image";
import { toast } from "react-toastify";
import { useUser } from "../Extension/AuthContext";
import { useAuth } from "../Extension/AuthContext";
import { useState, useEffect } from "react";
import { HiOutlineUser, HiOutlineClock, HiOutlineTrash } from "react-icons/hi";

const Comment = ({ comment, postId, onDelete }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const role = user?.publicMetadata?.role;
  
  useEffect(() => {
    console.log("User data in Comment component:", user);
  }, [user]);
  
  const API_BASE_URL = process.env.REACT_APP_BACK_END_URL;
  
  const deleteComment = async () => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${API_BASE_URL}/comments/${comment._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      toast.success("Comment deleted successfully");
      onDelete?.(comment._id);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const canDeleteComment = user && (
    (comment?.user?.username === user?.username) || 
    role === "admin"
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
            {user?.username && (
              <p className="mt-1 text-sm text-gray-500">
                Replying as: @{user?.username}
              </p>
            )}
          </div>
        </div>

        {canDeleteComment && (
          <button
            onClick={deleteComment}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <HiOutlineTrash className="h-4 w-4 mr-1" />
            Delete
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
