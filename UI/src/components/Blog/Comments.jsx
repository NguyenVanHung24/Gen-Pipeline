import axios from "axios";
import Comment from "./Comment";
import { toast } from "react-toastify";
import { useUser } from "../Extension/AuthContext";
import { useAuth } from "../Extension/AuthContext";
import { useState, useEffect } from "react";

const API_BASE_URL = process.env.REACT_APP_BACK_END_URL;

const Comments = ({ postId }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [pendingComment, setPendingComment] = useState(null);

  const handleDeleteComment = (commentId) => {
    setComments(prev => prev.filter(comment => comment._id !== commentId));
  };

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      setIsPending(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/comments/${postId}`);
        setComments(res.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        toast.error("Error loading comments!");
      } finally {
        setIsPending(false);
      }
    };

    fetchComments();
  }, [postId]);

  // Handle comment submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const commentData = {
      desc: formData.get("desc"),
    };

    // Show pending comment
    setPendingComment({
      desc: commentData.desc,
      createdAt: new Date(),
      user: {
        img: user?.imageUrl,
        username: user?.username,
      },
    });

    try {
      const token = await getToken();
      const response = await axios.post(
        `${API_BASE_URL}/comments/${postId}`,
        commentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add new comment to the list
      setComments(prev => [...prev, response.data]);
      e.target.reset();
      setPendingComment(null);
      toast.success("Comment posted successfully!");
      
    } catch (error) {
      toast.error(error.response?.data || "Failed to post comment");
      setPendingComment(null);
    }
  };

  return (
    <div className="flex flex-col gap-8 lg:w-3/5 mb-12">
      <h1 className="text-xl text-gray-500 underline">Comments</h1>
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between gap-8 w-full"
      >
        <textarea
          name="desc"
          placeholder="Write a comment..."
          className="w-full p-4 rounded-xl"
        />
        <button 
          className="bg-blue-800 px-4 py-3 text-white font-medium rounded-xl"
          disabled={isPending}
        >
          Send
        </button>
      </form>
      {isPending ? (
        "Loading..."
      ) : error ? (
        "Error loading comments!"
      ) : (
        <>
          {pendingComment && (
            <Comment
              comment={pendingComment}
            />
          )}

          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} postId={postId} onDelete={handleDeleteComment} />
          ))}
        </>
      )}
    </div>
  );
};

export default Comments;
