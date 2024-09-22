import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaPencilAlt, FaSearch, FaArrowRight, FaTimes } from "react-icons/fa";
import medicService from "../../services/medicService";
import supplierService from "../../services/supplierService";
import stockEntryService from "../../services/stockEntryService";
import stockEntryDetailService from "../../services/stockEntryDetailService";
import { toast } from 'react-toastify'


export default function ImportForm  ()  {
    const [medicines, setMedicines] = useState([
   
    ]);
  
    const [selectedMedicines, setSelectedMedicines] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [medicinesImport, setMedicinesImport] = useState([]);
    const [filteredMedicines,setFilteredMedicines] = useState([])
    const [suppliers,setSuppliers] = useState([])
    const [errorSup,setErrorSup] = useState(false)
    const [importFormData, setImportFormData] = useState({
      date: "",
      notes: "",
    });
    const fetchSupplier = async () => {
      const res = await supplierService.getAllSuppliers();
      setSuppliers(res);
    }
    const fetchMedic = async () => {
      const res = await medicService.getAllMedicines()
      res.map((item) => item.isImport = false)
      setMedicines(res)
      setFilteredMedicines(
          res.filter((medicine) =>
          medicine.tenThuoc.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    }
    useEffect(() => {
      fetchMedic()
      fetchSupplier()
    }, [])
    const handleSearch = (e) => {
      setSearchTerm(e.target.value);
    };
  
    
  
    const handleQuantityChange = (maThuoc, value, index) => {
      console.log(medicines);
      const updatedMedicines = selectedMedicines.map((medicine) =>
        medicine.maThuoc === maThuoc
          ? {
              ...medicine,
              importData: medicine.importData.map((data, i) =>
                i === index ? { ...data, soLuong: parseInt(value) || 0 } : data
              )
            }
          : medicine
      );
      setSelectedMedicines(updatedMedicines);
    };
  
    const handlePriceChange = (maThuoc, value, index) => {
      console.log(medicines);
      const updatedMedicines = selectedMedicines.map((medicine) =>
        medicine.maThuoc === maThuoc
          ? {
              ...medicine,
              importData: medicine.importData.map((data, i) =>
                i === index ? { ...data, giaNhap: parseInt(value) || 0 } : data
              )
            }
          : medicine
      );
      setSelectedMedicines(updatedMedicines);
    };
    const handleSupplierChange = (maThuoc, value, index) => {
      const updatedMedicines = selectedMedicines.map((medicine) =>
        medicine.maThuoc === maThuoc
          ? {
              ...medicine,
              importData: medicine.importData.map((data, i) =>
                i === index ? { ...data, maNhaCungCap: value } : data
              )
            }
          : medicine
      );
      setSelectedMedicines(updatedMedicines);
      setErrorSup(false)
    };
  
    const handleImportFormChange = (e) => {
      const { name, value } = e.target;
      setImportFormData({ ...importFormData, [name]: value });
    };
    const checkValid =  () => {
      for (let i=0;i<selectedMedicines.length;i++) {
        if (selectedMedicines[i].importData.some((m) => m.maNhaCungCap=='')) {
          console.log('Testttt');
          setErrorSup(true)
          return false;
        } 
      }
      
      if (!importFormData.date) return false;
      else return true;
    }
    const handleImportSubmit = async (e) => {
      if (!checkValid()) {
        toast.warning('Vui lòng điền đủ!');
        return;
      }
    
      try {
        const res = await stockEntryService.createStockEntry({ ngayNhap: importFormData.date });
    
        // Sử dụng Promise.all để chờ tất cả các promise hoàn thành
        const promises = selectedMedicines.flatMap((medicine) =>
          medicine.importData.map((item) =>
            stockEntryDetailService.createStockEntryDetail({
              ...item,
              maThuoc: medicine.maThuoc,
              maNhapHang: res.maNhapHang
            })
          )
        );
    
        await Promise.all(promises);
    
        console.log('Import Data:', { ...importFormData, medicines: selectedMedicines });
      } catch (error) {
        console.error('Error importing data:', error);
      } finally {
        // fetchMedic() và setSelectedMedicines sẽ chạy sau khi tất cả promise được hoàn thành
        fetchMedic();
        setSelectedMedicines([]);
      }
    };
    
  
    const handleImportMedicine = (medicine) => {
      const updatedMedicine = { ...medicine, importData: [{
          soLuong: 1, maNhaCungCap: '', giaNhap: 1000
      }] };
      setSelectedMedicines((prev) =>
        prev.some((m) => m.maThuoc === medicine.maThuoc)
          ? prev.map((m) => (m.maThuoc === medicine.maThuoc ? updatedMedicine : m))
          : [...prev, updatedMedicine]
      );
      setMedicines((prev) =>
      prev.map((m) => (m.maThuoc === medicine.maThuoc ? {...m,isImport:true} : m))
       
      )
      setFilteredMedicines((prev) =>
       prev.map((m) => (m.maThuoc === medicine.maThuoc ? {...m,isImport:true} : m))
      )
      
    };
  
    const handleRemoveMedicine = (maThuoc) => {
      setSelectedMedicines((prev) => prev.filter((m) => m.maThuoc !== maThuoc));
      setMedicines((prev) =>
        prev.map((m) => (m.maThuoc === maThuoc ? { ...m, isImport:false } : m))
      );
      setFilteredMedicines((prev) =>
        prev.map((m) => (m.maThuoc === maThuoc ? { ...m, isImport:false } : m))
      );
    };
    
    
  
    const handleDeleteRow = (medicineId, rowIndex) => {
      const updatedMedicines = selectedMedicines.map((medicine) => {
        if (medicine.maThuoc === medicineId) {
          const updatedImportData = medicine.importData.filter((_, index) => index !== rowIndex);
          if (updatedImportData.length>0)
          return  { ...medicine, importData: updatedImportData }
          else {
              setMedicines((prev) =>
              prev.map((m) => (m.maThuoc === medicineId ? { ...m, isImport:false } : m))
            );
            setFilteredMedicines((prev) =>
              prev.map((m) => (m.maThuoc === medicineId ? { ...m, isImport:false } : m))
            );
            return;
          };
        }
        return medicine;
      });
      console.log('Test:L ',updatedMedicines);
      
      setSelectedMedicines(updatedMedicines.filter((item) => item!=null));
    };
  
    const handleAddNewRow = (medicineId) => {
      const updatedMedicines = selectedMedicines.map((medicine) => {
        if (medicine.maThuoc === medicineId) {
          const newImportData = [...medicine.importData, { soLuong: 1, maNhaCungCap: '', giaNhap: 1000 }];
          return { ...medicine, importData: newImportData };
        }
        return medicine;
      });
      setSelectedMedicines(updatedMedicines);
    };
  
    return (
        <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <div className="mb-4 flex items-center">
            <input
              type="text"
              placeholder="Search medicines..."
              className="border rounded-l px-4 py-2 w-full"
              value={searchTerm}
              onChange={handleSearch}
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-r">
              <FaSearch />
            </button>
          </div>
          <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Tên thuốc</th>
                  <th scope="col" className="px-6 py-3">Số lượng tồn</th>
                  <th scope="col" className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filteredMedicines.map((medicine) => (
                  <tr key={medicine.maThuoc} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{medicine.tenThuoc}</td>
        
                    <td className="px-6 py-4">{medicine.soLuongTon}</td>
                    <td className="px-6 py-4">
                      {!medicine.isImport && <button
                        onClick={() => handleImportMedicine(medicine)}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                      >
                        Nhập
                      </button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <form  className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-2xl font-bold mb-4">Chi tiết nhập</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                Date
              </label>
              <input
                type="date"
                maThuoc="date"
                name="date"
                value={importFormData.date}
                onChange={handleImportFormChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
                Notes
              </label>
              <textarea
                maThuoc="notes"
                name="notes"
                value={importFormData.notes}
                onChange={handleImportFormChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="3"
              ></textarea>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-2">Danh sách nhập</h3>
              <ul className="space-y-4">
                {selectedMedicines.map((medicine) => (
                  <li key={medicine.maThuoc} className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold">{medicine.tenThuoc}</h4>
                      <div className="flex gap-2">
                      <button
                        onClick={() => handleRemoveMedicine(medicine.maThuoc)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                      <button
                        onClick={() => handleAddNewRow(medicine.maThuoc)}
                        className="text-green-500 hover:text-green-700"
                      >
                        <FaPlus />
                      </button>
                      </div>
                    </div>
                    {medicine.importData.map((row, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-4 mb-2">
                        <div className="flex flex-col  space-y-2">
                          <label className="text-sm font-medium">Số lượng nhập:</label>
                          <input
                            type="number"
                            value={row.soLuong}
                            onChange={(e) => handleQuantityChange(medicine.maThuoc, e.target.value, index)}
                            className="border rounded px-2 py-1 w-20 text-sm"
                            min="1"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-sm font-medium">Giá nhập/{medicine.donViTinh}</label>
                          <input
                            type="number"

                            value={row.giaNhap}
                            onChange={(e) => handlePriceChange(medicine.maThuoc, e.target.value, index)}
                            className="border rounded px-2 py-1 w-20 text-sm"
                            step="1000"
                            min="1000"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-sm font-medium">Nhà cung cấp:</label>
                      
                          <select
                          value={row.maNhaCungCap}
                          onChange={(e) => handleSupplierChange(medicine.maThuoc, e.target.value, index)}
                          placeholder='Chọn nhà cung cấp'
                          className={`border rounded px-2 py-1 w-40 text-sm ${errorSup && row.maNhaCungCap=='' ? 'border-red-500':''}`}
                          >
                                <option value="" disabled selected hidden>Chọn nhà cung cấp</option>

                                {
                                    suppliers.map((supplier) => (
                                      
                                        <option value={supplier.maNhaCungCap}>
                                            {supplier.tenNhaCungCap}
                                        </option>
                                    ))
                                }
                          </select>
                        </div>
                        <button
                          onClick={() => handleDeleteRow(medicine.maThuoc, index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => handleImportSubmit(e)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                disabled={selectedMedicines.length === 0}
              >
                Nhập <FaArrowRight className="ml-2" />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
}