import React, { useState, useEffect } from "react";
import { FaHome, FaBars } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { GiMedicines } from "react-icons/gi";
import { IoIosPeople } from "react-icons/io";
import { FaBuildingCircleArrowRight } from "react-icons/fa6";
import { LiaFileImportSolid, LiaFileExportSolid } from "react-icons/lia";
import { HiLogout } from "react-icons/hi";

const Sidebar = () => {
  const [isLoading, setIsLoading] = useState(true); // Thêm cờ loading
  const user = JSON.parse(localStorage.getItem('user'))

  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("/");

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const handleLogOut = () => {
    localStorage.removeItem('token')
    navigate('/login');
  }
  useEffect(() => {
    // Simulate async operation for getting token
    const checkToken = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Giả lập quá trình lấy token
      if (!token) {
        navigate('/login');
      }
      setIsLoading(false);  // Kết thúc trạng thái loading
    };
    checkToken();
  }, [token, navigate]);

  if (isLoading || path == '/login') {
    // Hiển thị loading hoặc không render component cho đến khi token được xác nhận
    return null;
  }

  return (
    <div className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ${isOpen ? "w-64" : "w-16"} bg-blue-600 text-white`}>
      <div className="flex items-center justify-between p-4">
        <img
          src="https://images.unsplash.com/photo-1563213126-a4273aed2016?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
          alt="MedicTrack Logo"
          className={`w-8 h-8 object-contain ${isOpen ? "mr-2" : "mx-auto"}`}
        />
        {isOpen && <span className="text-xl font-bold">MedicTrack</span>}
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none md:hidden"
        >
          <FaBars size={24} />
        </button>
      </div>
      <nav className="mt-8">
        <ul>
          {[
            { icon: FaHome, text: "Home", href: "/" },
            { icon: GiMedicines, text: "Medicine", href: "/medicine" },
            { icon: FaBuildingCircleArrowRight, text: "Supplier", href: "/supplier" },
            { icon: LiaFileImportSolid, text: "Import", href: "/import" },
            { icon: LiaFileExportSolid, text: "Export", href: "/export" },
            { icon: IoIosPeople, text: "User", href: "/user" },
          ].map((item, index) => (((item.text=="User" && user.vaiTro==1) || (item.text!="User") ) &&
            <li key={index}>
              <div
                onClick={() => {
                  setActiveItem(item.href);
                  navigate(item.href);
                }}
                className={`cursor-pointer flex items-center p-4 hover:bg-blue-700 transition-colors ${isOpen ? "" : "justify-center"} ${activeItem === item.href ? "bg-blue-700" : ""}`}
              >
                <item.icon size={20} className={`${isOpen ? "mr-4" : ""} ${activeItem === item.href ? "text-white" : "text-blue-200"}`} />
                {isOpen && <span className={activeItem === item.href ? "font-semibold" : ""}>{item.text}</span>}
              </div>
            </li>
          ))}
        </ul>
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div
          onClick={() => handleLogOut()}
          className={`flex items-center justify-center bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors ${isOpen ? "" : "mx-auto w-10 h-10"}`}
        >
          <HiLogout size={20} className={isOpen ? "mr-2" : ""} />
          {isOpen}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
