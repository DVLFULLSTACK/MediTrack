import React, { useState } from "react";
import { FiChevronRight, FiSearch, FiPlus, FiChevronDown, FiChevronUp } from "react-icons/fi";
import stockEntryService from "../../services/stockEntryService";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import formatService from "../../services/formatService";

const ImportList = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);
  const [dummyStockEntries,setDummyStockEntries] = useState([
    {
      id: 1,
      date: "2023-06-01",
      type: "Received",
      medicines: [
        { name: "Paracetamol", quantity: 1000, expiryDate: "2024-06-01" },
        { name: "Ibuprofen", quantity: 500, expiryDate: "2024-12-31" }
      ]
    },
    {
      id: 2,
      date: "2023-06-02",
      type: "Dispatched",
      medicines: [
        { name: "Amoxicillin", quantity: 300, expiryDate: "2024-09-30" },
        { name: "Aspirin", quantity: 200, expiryDate: "2025-03-15" }
      ]
    },
    {
      id: 3,
      date: "2023-06-03",
      type: "Received",
      medicines: [
        { name: "Omeprazole", quantity: 750, expiryDate: "2025-06-30" },
        { name: "Metformin", quantity: 400, expiryDate: "2024-11-30" }
      ]
    },
    {
      id: 4,
      date: "2023-06-04",
      type: "Expired",
      medicines: [
        { name: "Lisinopril", quantity: 100, expiryDate: "2023-05-31" },
        { name: "Amlodipine", quantity: 150, expiryDate: "2023-05-31" }
      ]
    }
  ])

  const tabs = ["All Entries", "Received", "Dispatched", "Expired"];

  const fetchStockEntries = async () => {
    const res = await stockEntryService.getAllStockEntries();
    const data = res.filter((item) => item.chiTietNhapHang)
    data.map((item) => {
        var sum= 0;
        item.chiTietNhapHang.map((med) => {
            med.tongTien = med.soLuong*med.giaNhap;
            sum+=med.tongTien;
        }) 
        item.tongTien = sum;
    })
    console.log('res: ',res);
    setDummyStockEntries(data)
    
  }
  useEffect(() => {
    fetchStockEntries()
  },[])
  

//   const filteredEntries = dummyStockEntries.filter(entry =>
//     (activeTab === 0 || entry.type === tabs[activeTab]) &&
//     entry.medicines.some(med => med.name.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const toggleRowExpansion = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };
  if (!dummyStockEntries) return;
  return (
    <div className="w-full max-w-6xl mx-auto p-6  min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Danh sách nhập</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search medicines..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600 transition duration-300" onClick={() => {window.location.href = '/import'}}>
          <FiPlus className="mr-2" />
          Nhập hàng
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã số nhập</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày nhập</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dummyStockEntries.map((entry) => (
                <React.Fragment key={entry.maNhapHang}>
                  <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleRowExpansion(entry.maNhapHang)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.maNhapHang}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatService.formatDateDDMMYYYY(entry.ngayNhap)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatService.formatPrice(entry.tongTien)}</td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {expandedRow === entry.maNhapHang ? <FiChevronUp /> : <FiChevronDown />}
                    </td>
                  </tr>
                  {expandedRow === entry.maNhapHang && (
                    <tr>
                      <td colSpan="4" className="px-6 py-4">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên thuốc</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng nhập</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá nhập/Đơn vị</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhà cung cấp</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                            </tr>
                          </thead>
                          <tbody>
                            {entry.chiTietNhapHang.map((medicine, index) => (
                              <tr key={index} className="hover:bg-gray-100">
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{medicine.tenThuoc}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{medicine.soLuong}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{medicine.giaNhap}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{medicine.tenNhaCungCap}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatService.formatPrice(medicine.tongTien)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ImportList;
