import { Outlet } from "react-router-dom";
import Navbar from "../../components/Blog/Navbar";


const MainLayout = () => {
  return (
    <div>
      <div className="">
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <Navbar />
          </div>
          <div className="px-4 py-5 sm:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
