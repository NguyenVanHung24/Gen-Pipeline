import { useState } from "react";
import PostList from "../../components/Blog/PostList";
import SideMenu from "../../components/Blog/SideMenu";

const PostListPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Development Blog
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Explore our latest articles and insights
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 md:hidden"
          >
            {open ? "Close Filters" : "Filter or Search"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col-reverse gap-8 md:flex-row justify-between">
        {/* Posts List Section */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
            <PostList />
          </div>
        </div>

        {/* Sidebar */}
        <div className={`${open ? "block" : "hidden"} md:block w-full md:w-80`}>
          <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 sticky top-8">
            <SideMenu />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostListPage;
