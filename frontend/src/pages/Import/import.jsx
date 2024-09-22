import React, { useState, useEffect } from "react";
import ImportList from "../../components/importList/importList";
import ImportForm from "../../components/importForm/importForm";

const Import = () => {

  const [tab,setTab] = useState(1)
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Quản lý nhập thuốc</h1>
      <div className="flex flex-row mb-6 border-b border-blue-200 w-max">
        <div className={`p-2 ${tab==1 ? 'bg-blue-500 text-white' : ''}  cursor-pointer hover:bg-blue-400 hover:text-white rounded-t-md`}
        onClick={() => setTab(1)}
        >Nhập thuốc</div>
        <div className={`p-2 ${tab==2 ? 'bg-blue-500 text-white' : ''}  cursor-pointer hover:bg-blue-400 hover:text-white rounded-t-md`}
        onClick={() => setTab(2)}>Danh sách nhập thuốc</div>
      </div>
     {tab==1 && <ImportForm />}
     {tab==2 && <ImportList />}
    </div>
  );
};

export default Import;
