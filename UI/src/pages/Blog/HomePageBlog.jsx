import { Link } from "react-router-dom";
import MainCategories from "../../components/Blog/MainCategories";
import FeaturedPosts from "../../components/Blog/FeaturedPosts";
import PostList from "../../components/Blog/PostList";
import Image from "../../components/Blog/Image";
import Comment from "../../components/Blog/Comment";

const HomePageBlog = () => {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-gray-700">Home</Link>
            <span>•</span>
            <span className="text-blue-800">Blogs and Articles</span>
          </div>
          
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Pipeline Generator Blog
          </h2>
          <p className="mt-2 text-sm text-gray-500">
          This website is a blog platform for sharing ideas and stories about DevSecOps.
          You will find a lot of useful information here.
          </p>
        </div>

        {/* Write Button */}
        <Link 
          to="write" 
          className="hidden md:block relative w-[200px] h-[200px]"
        >
          <svg
            viewBox="0 0 200 200"
            width="200"
            height="200"
            className="text-lg tracking-widest"
          >
            <path
              id="circlePath"
              fill="none"
              d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
            />
            <text className="text-gray-600">
              <textPath href="#circlePath" startOffset="0%">
                Write your story •
              </textPath>
              <textPath href="#circlePath" startOffset="50%">
                Share your idea •
              </textPath>
            </text>
          </svg>
          <button className="absolute top-0 left-0 right-0 bottom-0 m-auto w-20 h-20 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="50"
              height="50"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <line x1="6" y1="18" x2="18" y2="6" />
              <polyline points="9 6 18 6 18 15" />
            </svg>
          </button>
        </Link>
      </div>

      {/* Categories Section */}
      <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 mb-8">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Categories
        </h3>
        <MainCategories />
      </div>

      {/* Featured Posts Section */}
      <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 mb-8 w h-[400px] ">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Featured Posts
        </h3>
        <FeaturedPosts />
      </div>

      {/* Recent Posts Section */}
      <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Recent Posts
        </h3>
        <PostList />
      </div>
    </div>
  );
};

export default HomePageBlog;
