import { Link } from "react-router-dom";
import Search from "./Search";

const MainCategories = () => {
  return (
    <div className="hidden md:flex bg-white rounded-3xl xl:rounded-full p-4 shadow-lg items-center justify-center gap-8">
      {/* links */}
      <div className="flex-1 flex items-center justify-between flex-wrap">
        <Link
          to="/blog/posts"
          className="bg-blue-800 text-white rounded-full px-4 py-2"
        >
          All Posts
        </Link>
        <Link
          to="/blog/posts?cat=CI/CD"
          className="hover:bg-blue-50 rounded-full px-4 py-2"
        >
          CI/CD
        </Link>
        <Link
          to="/blog/posts?cat=Cloud"
          className="hover:bg-blue-50 rounded-full px-4 py-2"
        >
          Cloud
        </Link>
        <Link
          to="/blog/posts?cat=Devsecops"
          className="hover:bg-blue-50 rounded-full px-4 py-2"
        >
          Devsecops
        </Link>
        <Link
          to="/blog/posts?cat=Security"
          className="hover:bg-blue-50 rounded-full px-4 py-2"
        >
          Security
        </Link>
        <Link
          to="/blog/posts?cat=Tools"
          className="hover:bg-blue-50 rounded-full px-4 py-2"
        >
          Tools
        </Link>
      </div>
      <span className="text-xl font-medium">|</span>
      {/* search */}
      <Search/>
    </div>
  );
};

export default MainCategories;
