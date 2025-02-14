import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Upload from "../../components/Blog/Upload";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import { HiOutlineCollection, HiOutlineTag, HiOutlinePhotograph, HiOutlineDocumentText } from 'react-icons/hi';

const Write = () => {
  const [value, setValue] = useState("");
  const [cover, setCover] = useState("");
  const [img, setImg] = useState("");
  const [video, setVideo] = useState("");
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    img && setValue((prev) => prev + `<p><image src="${img.url}"/></p>`);
  }, [img]);

  useEffect(() => {
    video &&
      setValue(
        (prev) => prev + `<p><iframe class="ql-video" src="${video.url}"/></p>`
      );
  }, [video]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.target);

    const data = {
      img: cover.filePath || "",
      title: formData.get("title"),
      category: formData.get("category"),
      desc: formData.get("desc"),
      content: value,
    };

    try {
      const token = "A";
      const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/posts`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Post has been created");
      navigate(`/blog/${response.data.slug}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Create a New Post
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Share your thoughts and experiences with the community
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <div className="flex items-center">
                  <HiOutlineCollection className="h-5 w-5 text-gray-400 mr-2" />
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                </div>
                <div className="mt-1">
                  <input
                    type="text"
                    name="title"
                    className="input-field"
                    placeholder="My Awesome Story"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <div className="flex items-center">
                  <HiOutlineTag className="h-5 w-5 text-gray-400 mr-2" />
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                </div>
                <div className="mt-1">
                  <select
                    name="category"
                    className="select-field"
                  >
                    <option value="general">General</option>
                    <option value="web-design">Web Design</option>
                    <option value="development">Development</option>
                    <option value="databases">Databases</option>
                    <option value="seo">Search Engines</option>
                    <option value="marketing">Marketing</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-6">
                <div className="flex items-center">
                  <HiOutlineDocumentText className="h-5 w-5 text-gray-400 mr-2" />
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                </div>
                <div className="mt-1">
                  <textarea
                    name="desc"
                    className="input-field"
                    placeholder="A Short Description"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <div className="flex items-center">
                  <HiOutlinePhotograph className="h-5 w-5 text-gray-400 mr-2" />
                  <label className="block text-sm font-medium text-gray-700">
                    Cover Image
                  </label>
                </div>
                <div className="mt-1">
                  <Upload type="image" setProgress={setProgress} setData={setCover}>
                    <button type="button" className="btn-secondary">
                      Add a cover image
                    </button>
                  </Upload>
                </div>
              </div>

              <div className="sm:col-span-6">
                <div className="flex items-center">
                  <HiOutlineDocumentText className="h-5 w-5 text-gray-400 mr-2" />
                  <label className="block text-sm font-medium text-gray-700">
                    Content
                  </label>
                </div>
                <div className="mt-1">
                  <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={setValue}
                    readOnly={0 < progress && progress < 100}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <div className="flex items-center">
                  <HiOutlinePhotograph className="h-5 w-5 text-gray-400 mr-2" />
                  <label className="block text-sm font-medium text-gray-700">
                    Media
                  </label>
                </div>
                <div className="mt-1 flex space-x-4">
                  <Upload type="image" setProgress={setProgress} setData={setImg}>
                    <button type="button" className="btn-secondary">
                      Add Image
                    </button>
                  </Upload>
                  <Upload type="video" setProgress={setProgress} setData={setVideo}>
                    <button type="button" className="btn-secondary">
                      Add Video
                    </button>
                  </Upload>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || (0 < progress && progress < 100)}
                className="btn-primary"
              >
                {isLoading ? "Loading..." : "Create Post"}
              </button>
            </div>
            {error && <span className="text-red-500">{error}</span>}
            {progress > 0 && <div className="text-sm text-gray-500">Upload Progress: {progress}%</div>}
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Write;
