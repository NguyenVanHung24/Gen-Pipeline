import { format } from "timeago.js";
import Image from "./Image";
import { toast } from "react-toastify";
import { useUser } from "../Extension/AuthContext";
import { useAuth } from "../Extension/AuthContext";
import { useEffect } from "react";
const Comment = ({ comment, postId, onDelete }) => { // Add onDelete prop
  const { user } = useUser();
  const { getToken } = useAuth(); // Get token via custom hook
  const role = user?.publicMetadata?.role;
  // Log user data to check if it exists
  useEffect(() => {
    console.log("User data in Comment component:", user);
  }, [user]); // This will log whenever 'user' changes
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
      onDelete?.(comment._id); // Call onDelete callback
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Improve conditional rendering
  const canDeleteComment = user && (
    (comment?.user?.username === user?.username) || 
    role === "admin"
  );

  return (
    <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 mb-8">
      <div className="flex items-center gap-4">
        
        {comment?.user?.img && (
          <Image
            src={comment?.user?.img}
            className="h-10 w-10 rounded-full object-cover"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{comment?.user?.username}</p>
          <p className="text-sm text-gray-500">{format(comment?.createdAt)}</p>
          <p className="text-sm text-gray-500">{user?.username}</p>
        </div>
        {canDeleteComment && (
          <button
            className="btn-danger text-xs"
            onClick={deleteComment}
          >
            delete
          </button>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-700">{comment?.desc}</p>
      </div>
    </div>
  );
};

export default Comment;
