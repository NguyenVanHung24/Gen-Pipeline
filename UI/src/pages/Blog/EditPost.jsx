import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/axios";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import { useAuth } from "../../components/Extension/AuthContext";

const EditPost = () => {
  const { slug } = useParams(); // Use slug instead of id
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = await getToken();
        const response = await api.get(`${process.env.REACT_APP_BACK_END_URL}/posts/${slug}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPost(response.data);
        setValue(response.data.content);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPost();
  }, [slug, getToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const data = {
      title: post.title,
      category: post.category,
      desc: post.desc,
      content: value,
    };

    try {
      const token = await getToken();
      await api.put(`/posts/${slug}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Post has been updated");
      navigate(`/blog/${slug}`); // Redirect to the post page using slug
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold">Edit Post</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label>Title</label>
            <input
              type="text"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label>Category</label>
            <select
              value={post.category}
              onChange={(e) => setPost({ ...post, category: e.target.value })}
              className="select-field"
            >
              <option value="general">General</option>
              <option value="CI/CD">CI/CD</option>
              <option value="Cloud">Cloud</option>
              <option value="Devsecops">Devsecops</option>
              <option value="Security">Security</option>
              <option value="Tools">Tools</option>
            </select>
          </div>
          <div>
            <label>Description</label>
            <textarea
              value={post.desc}
              onChange={(e) => setPost({ ...post, desc: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label>Content</label>
            <ReactQuill
              theme="snow"
              value={value}
              onChange={setValue}
              className="input-field"
            />
          </div>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Post"}
          </button>
          {error && <span className="text-red-500">{error}</span>}
        </form>
      </div>
    </Layout>
  );
};

export default EditPost;