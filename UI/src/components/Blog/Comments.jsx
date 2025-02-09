import axios from "axios";
import Comment from "./Comment";
import { toast } from "react-toastify";
import { useUser } from "../Authen/AuthContext";
import { useAuth } from "../Authen/AuthContext";

const API_BASE_URL = process.env.REACT_APP_BACK_END_URL;
const fetchComments = async (postId) => {
  const res = await axios.get(
    `${API_BASE_URL}/comments/${postId}`
  );
  return res.data;
};

const Comments = ({ postId }) => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [pendingComment, setPendingComment] = useState(null);
  const queryClient = useQueryClient();

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      setIsPending(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/comments/${postId}`);
        setData(res.data);
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

    setIsPosting(true);
    setPendingComment({
      desc: `${commentData.desc} (Sending...)`,
      createdAt: new Date(),
      user: {
        img: user?.imageUrl,
        username: user?.username,
      },
    });

    try {
      const token = await getToken();
      await axios.post(
        `${import.meta.env.VITE_API_URL}/comments/${postId}`,
        commentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh comments after successful post
      const res = await axios.get(`${API_BASE_URL}/comments/${postId}`);
      setData(res.data);
      e.target.reset();
    } catch (error) {
      toast.error(error.response?.data || "Failed to post comment");
    } finally {
      setIsPosting(false);
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
        <button className="bg-blue-800 px-4 py-3 text-white font-medium rounded-xl">
          Send
        </button>
      </form>
      {isPending ? (
        "Loading..."
      ) : error ? (
        "Error loading comments!"
      ) : (
        <>
          {mutation.isPending && (
            <Comment
              comment={{
                desc: `${mutation.variables.desc} (Sending...)`,
                createdAt: new Date(),
                user: {
                  img: user.imageUrl,
                  username: user.username,
                },
              }}
            />
          )}

          {data.map((comment) => (
            <Comment key={comment._id} comment={comment} postId={postId} />
          ))}
        </>
      )}
    </div>
  );
};

export default Comments;
