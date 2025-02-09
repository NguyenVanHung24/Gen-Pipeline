import { useState } from "react";
import Image from "./Image";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white shadow-md rounded-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* LOGO */}
            <Link to="/blog" className="flex items-center gap-4 text-2xl font-bold">
              <Image src="logo.png" alt="Lama Logo" w={32} h={32} />
              <span>lamalog</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-gray-900">Home Page</Link>
            <Link to="/blog" className="text-gray-700 hover:text-gray-900">Home Blog</Link>
            <Link to="/blog/posts?sort=trending" className="text-gray-700 hover:text-gray-900">Trending</Link>
            <Link to="/blog/posts?sort=popular" className="text-gray-700 hover:text-gray-900">Most Popular</Link>
            {/* <Link to="/blog/" className="text-gray-700 hover:text-gray-900">About</Link> */}
          </div>
          <div className="md:hidden flex items-center">
            <button
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
              onClick={() => setOpen(!open)}
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {open && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block text-gray-700 hover:text-gray-900">Home Page</Link>
            <Link to="/blog" className="block text-gray-700 hover:text-gray-900">Home Blog</Link>
            <Link to="/blog/posts?sort=trending" className="block text-gray-700 hover:text-gray-900">Trending</Link>
            <Link to="/blog/posts?sort=popular" className="block text-gray-700 hover:text-gray-900">Most Popular</Link>
            {/* <Link to="/blog/" className="block text-gray-700 hover:text-gray-900">About</Link> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
