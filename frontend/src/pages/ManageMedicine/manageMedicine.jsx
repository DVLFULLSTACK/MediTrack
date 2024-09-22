import React, { useState } from "react";
import { useEffect } from "react";
import { FaPlus, FaTrash, FaPencilAlt, FaSearch } from "react-icons/fa";
import { LiaFileImportSolid, LiaFileExportSolid } from "react-icons/lia";
import medicService from "../../services/medicService";
import diacritics from 'diacritics'; //Loại bỏ dấu

const ManageMedicine = () => {

    
    const [medicines, setMedicines] = useState([
        { id: 1, name: "Aspirin", dosage: "500mg", frequency: "Twice daily", stock: 100 },
        { id: 2, name: "Ibuprofen", dosage: "400mg", frequency: "As needed", stock: 50 },
        { id: 3, name: "Paracetamol", dosage: "650mg", frequency: "Every 6 hours", stock: 75 },
    ]);
    const fetchMedic = async () => {
        const res = await medicService.getAllMedicines();
        setMedicines(res);
        setFilteredMedicines(searchTerm ?  medicines.filter((medicine) =>
            (diacritics.remove(medicine.tenThuoc).toLowerCase().includes(diacritics.remove(searchTerm).toLowerCase()) || diacritics.remove(medicine.congDung).toLowerCase().includes(diacritics.remove(searchTerm).toLowerCase()))
        ) : res) 
    }
   
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [filteredMedicines,setFilteredMedicines] = useState()
    const [formData, setFormData] = useState({
        name: "",
        dosage: "",
        frequency: "",
        stock: 0,
    });

    const handleRowClick = (medicine) => {
        setSelectedMedicine((prevSelected) =>
          prevSelected && prevSelected.maThuoc === medicine.maThuoc ? null : medicine
        );
      };
    

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    useEffect(() => {
        
        setFilteredMedicines(searchTerm ?  medicines.filter((medicine) =>
            (diacritics.remove(medicine.tenThuoc).toLowerCase().includes(diacritics.remove(searchTerm).toLowerCase()) || diacritics.remove(medicine.congDung).toLowerCase().includes(diacritics.remove(searchTerm).toLowerCase()))
        ) : medicines) 
    }, [searchTerm])
    

    // const filteredMedicines = medicines.filter((medicine) =>
    //     medicine.tenThuoc.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    const openModal = (mode) => {
        setModalMode(mode);
        if (mode === "create") {
        setFormData({ name: "", dosage: "", frequency: "", stock: 0 });
        } else if (mode === "update" && selectedMedicine) {
        setFormData({ ...selectedMedicine });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (modalMode === "create") {
        const res = await medicService.createMedicine({...formData})
        // const newMedicine = { ...formData, id: Date.now() };
        // setMedicines([...medicines, res]);
        fetchMedic()
        } else if (modalMode === "update") {
        const res = await medicService.updateMedicine(formData.maThuoc,formData);
        setSelectedMedicine(null)
        fetchMedic()
        }
        closeModal();
    };

    const handleDelete = async () => {
        if (selectedMedicine) {
            const res = await medicService.softDeleteMedicine(selectedMedicine.maThuoc)
            fetchMedic()
        }
    };
    useEffect(() => {
        fetchMedic()

    }, [])
    useEffect(() => {
        const handleOutsideClick = (event) => {
          if (!event.target.closest('table') && !event.target.closest('.modal')) {
            setSelectedMedicine(null);
          }
        };
    
        document.addEventListener('click', handleOutsideClick);
    
        return () => {
          document.removeEventListener('click', handleOutsideClick);
        };
      }, []);
    if (!filteredMedicines) return;
    return (
        <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Quản lý thuốc</h1>
        <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center">
            <input
                type="text"
                placeholder="Search medicines..."
                className="border rounded-l px-4 py-2 w-64"
                value={searchTerm}
                onChange={handleSearch}
            />
            <button className="bg-blue-500 text-white rounded-r" style={{padding:'0.8em'}}>
                <FaSearch />
            </button>
            </div>
            <div className="flex space-x-2">
            <button onClick={() => openModal("create")} className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200" title="Add Medicine"><FaPlus /></button>
            <button onClick={() => openModal("update")} disabled={!selectedMedicine} className={`p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors duration-200 ${!selectedMedicine && "opacity-50 cursor-not-allowed"}` } title="Update"><FaPencilAlt /></button>
            <button onClick={handleDelete} disabled={!selectedMedicine} className={`p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200 ${!selectedMedicine && "opacity-50 cursor-not-allowed"}` } title="Delete"><FaTrash /></button>
            <button  disabled={!selectedMedicine} className={`p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 ${!selectedMedicine && "opacity-50 cursor-not-allowed"}` } title="Import"><LiaFileImportSolid /></button>
            <button  disabled={!selectedMedicine} className={`p-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors duration-200 ${!selectedMedicine && "opacity-50 cursor-not-allowed"}` } title="Export"><LiaFileExportSolid /></button>

            </div>
        </div>
        <table className="w-full bg-white shadow-md rounded">
            <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Tên thuốc</th>
                <th className="py-3 px-6 text-left">Mã thuốc</th>
                <th className="py-3 px-6 text-left">Công dụng</th>
                <th className="py-3 px-6 text-left">Số lượng tồn</th>

            </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
            {filteredMedicines.map((medicine) => (
                <tr
                key={medicine.maThuoc}
                onClick={() => handleRowClick(medicine)}
                className={`${medicine.soLuongTon==null ? 'text-gray-300' : ''} cursor-pointer border-b border-gray-200 hover:bg-gray-100 ${selectedMedicine && selectedMedicine.maThuoc === medicine.maThuoc ? "bg-blue-100" : ""}`}
                >
                <td className="py-3 px-6 text-left whitespace-nowrap">{medicine.tenThuoc}</td>
                <td className="py-3 px-6 text-left">{medicine.maThuoc}</td>
                <td className="py-3 px-6 text-left">{medicine.congDung}</td>
                <td className="py-3 px-6 text-left">{medicine.soLuongTon==null ? 'Chưa được nhập' : medicine.soLuongTon}</td>
                </tr>
            ))}
            </tbody>
        </table>

        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-2xl font-bold mb-4">
                {modalMode === "create" ? "Thêm loại thuốc mới" : "Chỉnh sửa thuốc"}
                </h2>
                <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tenThuoc">
                    Tên thuốc
                    </label>
                    <input
                    type="text"
                    id="tenThuoc"
                    name="tenThuoc"
                    value={formData.tenThuoc}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    />
                </div>
                {modalMode=='update' && 
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maThuoc">
                    Mã số thuốc
                    </label>
                    <input
                    type="text"
                    id="maThuoc"
                    name="maThuoc"
                    value={formData.maThuoc}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    />
                </div>}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="congDung">
                    Công dụng
                    </label>
                    <input
                    type="text"
                    id="congDung"
                    name="congDung"
                    value={formData.congDung}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    />
                </div>
                {modalMode=='update' && 
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="soLuongTon">
                    Số lượng tồn
                    </label>
                    <input
                    type="number"
                    id="soLuongTon"
                    name="soLuongTon"
                    value={formData.soLuongTon}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    disabled
                    />
                </div>}
                <div className="flex justify-end">
                    <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                    >
                    Hủy
                    </button>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    {modalMode === "create" ? "Thêm" : "Lưu"}
                    </button>
                </div>
                </form>
            </div>
            </div>
        )}
        </div>
    );
};

export default ManageMedicine;
