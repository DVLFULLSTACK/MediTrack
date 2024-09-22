import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaPencilAlt, FaSearch, FaArrowRight, FaTimes } from "react-icons/fa";
import medicService from "../../services/medicService";
import formatService from "../../services/formatService";
import purchaseOrderDetailService from "../../services/purchaseOrderDetailService";
import purchaseOrderService from "../../services/purchaseOrderService";

const ExportForm = () => {
  const [medicines, setMedicines] = useState();

  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMedicines, setFilteredMedicines] = useState([])

  const [importFormData, setImportFormData] = useState({
    supplier: "",
    date: "",
    notes: "",
  });
  const fetchMedic = async () => {
    const res = await medicService.getAllMedicines()
    res.map((item) => {
      item.isImport = false;
      item.giaBan = 1000;
      item.soLuongBan = 0;
    })

    setMedicines(res)

    setFilteredMedicines(
      res.filter((medicine) =>
        medicine.tenThuoc.toLowerCase().includes(searchTerm.toLowerCase())
      ))
  }
  useEffect(() => {
    fetchMedic()
  }, [])
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };



  const handleQuantityChange = (maThuoc, value) => {
    console.log(maThuoc, value);
    const updatedMedicines = medicines.map((medicine) =>
      medicine.maThuoc === maThuoc ? { ...medicine, soLuongBan: parseInt(value) } : medicine
    );
    console.log('Test: ', updatedMedicines)
    setMedicines(updatedMedicines);

    const selectedMedicine = updatedMedicines.find((m) => m.maThuoc === maThuoc);
    if (selectedMedicine.soLuongBan > 0) {
     
      setSelectedMedicines((prev) =>
        prev.some((m) => m.maThuoc === maThuoc)
          ? prev.map((m) => (m.maThuoc === maThuoc ? selectedMedicine : m))
          : [...prev, selectedMedicine]
      );
    } else {
      setSelectedMedicines((prev) => prev.filter((m) => m.maThuoc !== maThuoc));
    }
  };

  const handlePriceChange = (maThuoc, value) => {
    const updatedMedicines = medicines.map((medicine) =>
      medicine.maThuoc === maThuoc ? { ...medicine, giaBan: parseInt(value) || 0 } : medicine
    );
    setMedicines(updatedMedicines);

    const selectedMedicine = updatedMedicines.find((m) => m.maThuoc === maThuoc);
    if (selectedMedicine.soLuongBan > 0) {
      setSelectedMedicines((prev) =>
        prev.map((m) => (m.maThuoc === maThuoc ? selectedMedicine : m))
      );
    }
  };

  const handleImportFormChange = (e) => {
    const { name, value } = e.target;
    setImportFormData({ ...importFormData, [name]: value });
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    const res = await purchaseOrderService.createPurchaseOrder({ngayBan: importFormData.date  ,tongTien: 10000 })
    selectedMedicines.forEach(async (medicine) => {
        const purchaseOrderDetail = await purchaseOrderDetailService.createPurchaseOrderDetail({...medicine,maBanHang: res.maBanHang})
    })

    console.log("Import Data:", { ...importFormData, medicines: selectedMedicines });
    fetchMedic()
    // Reset form and selections after submission
    // setImportFormData({ supplier: "", date: "", notes: "" });
    setSelectedMedicines([]);
    // setMedicines(medicines.map((m) => ({ ...m, quantity: 0, price: 0 })));
  };

  const handleRemoveMedicine = (maThuoc) => {
    setSelectedMedicines((prev) => prev.filter((m) => m.maThuoc !== maThuoc));
    setMedicines((prev) =>
      prev.map((m) => (m.maThuoc === maThuoc ? { ...m, soLuongBan: 0, giaBan: 0 } : m))
    );
  };
  if (!medicines) return;
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
              <th scope="col" className="px-6 py-3">Số lượng</th>

              <th scope="col" className="px-6 py-3">Số lượng bán</th>
              <th scope="col" className="px-6 py-3">Giá</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine) => (
              <tr key={medicine.id} className={`border-b hover:bg-gray-50 ${medicine.soLuongBan > 0 ? 'bg-green-100' : 'bg-white'}`}>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{medicine.tenThuoc}</td>
                <td className="px-6 py-4">{medicine.soLuongTon}</td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    min="1"
                    max={medicine.soLuongTon}
                    value={medicine.soLuongBan}
                    onChange={(e) => handleQuantityChange(medicine.maThuoc, e.target.value)}
                    className="w-20 px-2 py-1 border rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    min="500"
                    step="1000"
                    value={medicine.giaBan || 1000}
                    onChange={(e) => handlePriceChange(medicine.maThuoc, e.target.value)}
                    className="w-20 px-2 py-1 border rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <div className="w-full md:w-1/2">
      <form onSubmit={handleImportSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-4">Chi tiết xuất kho</h2>
        
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
            Date
          </label>
          <input
            type="date"
            id="date"
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
            id="notes"
            name="notes"
            value={importFormData.notes}
            onChange={handleImportFormChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="3"
          ></textarea>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Danh sách bán</h3>
          <ul className="list-disc pl-5">
            {selectedMedicines.map((medicine) => (
              <li key={medicine.id} className="flex items-center justify-between mb-2 p-4 bg-gray-100 rounded-md">
                <div className="flex flex-col w-full">
                  <h4 className="font-semibold">{medicine.tenThuoc}</h4>
                  <div className="grid grid-cols-3 gap-2 w-full">
                    <div>Số lượng: {medicine.soLuongBan}</div>
                    <div>Đơn giá: {formatService.formatPrice(medicine.giaBan)}</div>
                    <div>Tạm tính: {formatService.formatPrice(medicine.giaBan*medicine.soLuongBan)}</div>
                    </div>
                  </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMedicine(medicine.maThuoc)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTimes />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-row justify-between"><h3 className="text-lg font-bold mb-2">Tổng tiền</h3><span>10000</span></div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
            disabled={selectedMedicines.length === 0}
          >
            Xuất kho <FaArrowRight className="ml-2" />
          </button>
        </div>
      </form>
    </div>
  </div>
  );
};

export default ExportForm;
