import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaStethoscope, FaHospital, FaPills } from "react-icons/fa";

const TabComponent = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, label: "General Checkup", icon: <FaStethoscope />, content: "Our general checkup service provides comprehensive health assessments to ensure your overall well-being." },
    { id: 1, label: "Specialized Care", icon: <FaHospital />, content: "Our specialized care services cater to specific medical needs with expert physicians and state-of-the-art equipment." },
    { id: 2, label: "Pharmacy", icon: <FaPills />, content: "Our in-house pharmacy offers a wide range of medications and expert advice from our licensed pharmacists." },
  ];

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <div className="flex flex-wrap justify-center mb-4">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(index)}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-t-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 ease-in-out ${
              activeTab === index
                ? "bg-green-500 text-white"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            role="tab"
            aria-selected={activeTab === index}
            aria-controls={`tabpanel-${index}`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-b-lg shadow-inner"
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{tabs[activeTab].label}</h2>
        <p className="text-gray-600">{tabs[activeTab].content}</p>
      </motion.div>
    </div>
  );
};

export default TabComponent;