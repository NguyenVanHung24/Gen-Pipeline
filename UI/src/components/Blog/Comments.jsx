import Comment from "./Comment";
import { toast } from "react-toastify";
import { useAuth } from "../Extension/AuthContext";
import { useState, useEffect } from "react";
import api from '../../utils/axios';

const Comments = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/comments/${postId}`);
      setComments(res.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error("Error loading comments!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to comment");
      return;
    }

    const formData = new FormData(e.target);
    const desc = formData.get("desc");

    if (!desc.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post(
        `/comments/${postId}`,
        { desc }
      );

      setComments(prev => [response.data, ...prev]);
      e.target.reset();
      toast.success("Comment posted successfully!");
    } catch (error) {
      toast.error(error.response?.data || "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = (commentId) => {
    setComments(prev => prev.filter(comment => comment._id !== commentId));
  };

  if (isLoading) return <div className="text-center py-4">Loading comments...</div>;
  if (error) return <div className="text-center text-red-500 py-4">Error loading comments!</div>;

  return (
    <div className="flex flex-col gap-8  mb-12">
      <h1 className="text-xl text-gray-500 underline">Comments</h1>
      
      {user ? (
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-between gap-8 w-full"
        >
          <textarea
            name="desc"
            placeholder="Write a comment..."
            className="w-full p-4 rounded-xl"
            disabled={isSubmitting}
          />
          <button 
            className="bg-blue-800 px-4 py-3 text-white font-medium rounded-xl disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send'}
          </button>
        </form>
      ) : (
        <div className="text-center py-4 text-gray-500">
          Please login to comment
        </div>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <Comment 
            key={comment._id} 
            comment={comment} 
            postId={postId} 
            onDelete={handleDeleteComment} 
          />
        ))}
      </div>
    </div>
  );
};

export default Comments;
