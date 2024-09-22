import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaPencilAlt, FaSearch, FaArrowRight, FaTimes } from "react-icons/fa";
import medicService from "../../services/medicService";
import formatService from "../../services/formatService";
import purchaseOrderDetailService from "../../services/purchaseOrderDetailService";
import purchaseOrderService from "../../services/purchaseOrderService";
import ExportForm from "../../components/exportForm/exportForm";
import ExportList from "../../components/exportList/exportList";

const Export = () => {
  const [tab, setTab] = useState(1)
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Quản lý bán thuốc</h1>
      <div className="flex flex-row mb-6 border-b border-blue-200 w-max">
        <div className={`p-2 ${tab == 1 ? 'bg-blue-500 text-white' : ''}  cursor-pointer hover:bg-blue-400 hover:text-white rounded-t-md`}
          onClick={() => setTab(1)}
        >Bán thuốc</div>
        <div className={`p-2 ${tab == 2 ? 'bg-blue-500 text-white' : ''}  cursor-pointer hover:bg-blue-400 hover:text-white rounded-t-md`}
          onClick={() => setTab(2)}>Danh sách bán thuốc</div>
      </div>
      {tab == 1 && <ExportForm />}
      {tab == 2 && <ExportList />}
    </div>
  );
};

export default Export;
