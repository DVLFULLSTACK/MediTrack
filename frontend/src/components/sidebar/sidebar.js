import React, { useState } from "react";
import { FaHome, FaInfoCircle, FaClipboardList, FaEnvelope, FaPills, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("/");

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

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
            { icon: FaInfoCircle, text: "About Us", href: "/about" },
            { icon: FaClipboardList, text: "Services", href: "/services" },
            { icon: FaEnvelope, text: "Contact", href: "/contact" },
          ].map((item, index) => (
            <li key={index}>
              <div
                
                onClick={() => {
                    setActiveItem(item.href)
                    navigate(item.href)
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
        <a
          href="/track-medication"
          className={`flex items-center justify-center bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors ${isOpen ? "" : "mx-auto w-10 h-10"}`}
        >
          <FaPills size={20} className={isOpen ? "mr-2" : ""} />
          {isOpen && <span>Track Your Medication</span>}
        </a>
      </div>
    </div>
  );
};

export default Sidebar;