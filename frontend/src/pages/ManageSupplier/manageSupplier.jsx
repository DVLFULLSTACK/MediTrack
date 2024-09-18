import React, { useState } from "react";
import { useEffect } from "react";
import { FaPlus, FaTrash, FaPencilAlt, FaSearch } from "react-icons/fa";
import { LiaFileImportSolid, LiaFileExportSolid } from "react-icons/lia";
import { PiPasswordBold } from "react-icons/pi";

import supplierService from "../../services/supplierService";
import diacritics from 'diacritics'; //Loại bỏ dấu
import { toast } from "react-toastify";

const ManageSupplier = () => {

    
    const [suppliers, setSuppliers] = useState([
        { id: 1, name: "Aspirin", dosage: "500mg", frequency: "Twice daily", stock: 100 },
        { id: 2, name: "Ibuprofen", dosage: "400mg", frequency: "As needed", stock: 50 },
        { id: 3, name: "Paracetamol", dosage: "650mg", frequency: "Every 6 hours", stock: 75 },
    ]);
    const fetchSupplier = async () => {
        const res = await supplierService.getAllSuppliers();
        setSuppliers(res);
        setFilteredSuppliers(searchTerm ?  suppliers.filter((supplier) =>
            (diacritics.remove(supplier.tenNhaCungCap).toLowerCase().includes(diacritics.remove(searchTerm).toLowerCase()))
        ) : res) 
    }
   
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [filteredSuppliers,setFilteredSuppliers] = useState()
    const [formData, setFormData] = useState({
        name: "",
        dosage: "",
        frequency: "",
        stock: 0,
    });

    const handleRowClick = (supplier) => {
        setSelectedSupplier((prevSelected) =>
          prevSelected && prevSelected.maNhaCungCap === supplier.maNhaCungCap ? null : supplier
        );
      };
    

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    useEffect(() => {
        
        setFilteredSuppliers(searchTerm ?  suppliers.filter((supplier) =>
        (diacritics.remove(supplier.tenNhaCungCap).toLowerCase().includes(diacritics.remove(searchTerm).toLowerCase()))
    ) : suppliers) 
    }, [searchTerm])
    

    // const filteredSuppliers = suppliers.filter((supplier) =>
    //     supplier.tenThuoc.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    const openModal = (mode) => {
        setModalMode(mode);
        if (mode === "create") {
        setFormData({ tenNhaCungCap: "", matKhau: "", mail: ""});
        } else if (mode === "update" && selectedSupplier) {
        setFormData({ ...selectedSupplier });
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
        const res = await supplierService.createSupplier({...formData})
        // const newSupplier = { ...formData, id: Date.now() };
        // setSuppliers([...suppliers, res]);
        toast.success('Thêm người dùng thành công!')
        fetchSupplier()
        } else if (modalMode === "update") {
        const res = await supplierService.updateSupplier(formData.maNhaCungCap,formData);
        setSelectedSupplier(null)
        toast.success('Cập nhật người dùng thành công!')

        fetchSupplier()
        }
        closeModal();
    };

    const handleDelete = async () => {
        if (selectedSupplier) {
            const res = await supplierService.softDeleteSupplier(selectedSupplier.maNhaCungCap)
            fetchSupplier()
            toast.success('Xóa người dùng thành công!')

        }
    };
    useEffect(() => {
        fetchSupplier()

    }, [])
    useEffect(() => {
        const handleOutsideClick = (event) => {
          if (!event.target.closest('table') && !event.target.closest('.modal')) {
            setSelectedSupplier(null);
          }
        };
    
        document.addEventListener('click', handleOutsideClick);
    
        return () => {
          document.removeEventListener('click', handleOutsideClick);
        };
      }, []);
    if (!filteredSuppliers) return;
    return (
        <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Quản lý nhà cung cấp</h1>
        <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center">
            <input
                type="text"
                placeholder="Search suppliers..."
                className="border rounded-l px-4 py-2 w-64"
                value={searchTerm}
                onChange={handleSearch}
            />
            <button className="bg-blue-500 text-white rounded-r" style={{padding:'0.8em'}}>
                <FaSearch />
            </button>
            </div>
            <div className="flex space-x-2">
            <button onClick={() => openModal("create")} className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200" title="Add Supplier"><FaPlus /></button>
            <button onClick={() => openModal("update")} disabled={!selectedSupplier} className={`p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors duration-200 ${!selectedSupplier && "opacity-50 cursor-not-allowed"}` } title="Update"><FaPencilAlt /></button>
            <button onClick={handleDelete} disabled={!selectedSupplier} className={`p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200 ${!selectedSupplier && "opacity-50 cursor-not-allowed"}` } title="Delete"><FaTrash /></button>

            </div>
        </div>
        <table className="w-full bg-white shadow-md rounded">
            <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Tên nhà cung cấp</th>
                <th className="py-3 px-6 text-left">Mã nhà cung cấp</th>
                <th className="py-3 px-6 text-left">Số điện thoại</th>
                <th className="py-3 px-6 text-left">Địa chỉ</th>
              

            </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
            {filteredSuppliers.map((supplier) => (
                <tr
                key={supplier.maNhaCungCap}
                onClick={() => handleRowClick(supplier)}
                className={` cursor-pointer border-b border-gray-200 hover:bg-gray-100 ${selectedSupplier && selectedSupplier.maNhaCungCap === supplier.maNhaCungCap ? "bg-blue-100" : ""}`}
                >
                <td className="py-3 px-6 text-left whitespace-nowrap">{supplier.tenNhaCungCap}</td>
                <td className="py-3 px-6 text-left">{supplier.maNhaCungCap}</td>
                <td className="py-3 px-6 text-left">{supplier.soDienThoai}</td>
                <td className="py-3 px-6 text-left">{supplier.diaChi}</td>

               
                </tr>
            ))}
            </tbody>
        </table>

        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-2xl font-bold mb-4">
                {modalMode === "create" ? "Thêm người dùng mới" : "Chỉnh sửa thông tin người dùng"}
                </h2>
                <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tenNhaCungCap">
                    Tên nhà cung cấp
                    </label>
                    <input
                    type="text"
                    id="tenNhaCungCap"
                    name="tenNhaCungCap"
                    value={formData.tenNhaCungCap}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    />
                </div>
                
                {modalMode=='update' && 
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maNhaCungCap">
                    Mã nhà cung cấp
                    </label>
                    <input
                    type="text"
                    id="maNhaCungCap"
                    name="maNhaCungCap"
                    value={formData.maNhaCungCap}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    disabled
                    />
                </div>}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="soDienThoai">
                    Số điện thoại
                    </label>
                    <input
                    type="phone"
                    id="soDienThoai"
                    name="soDienThoai"
                    value={formData.soDienThoai}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="diaChi">
                    Địa chỉ
                    </label>
                    <input
                    type="text"
                    id="diaChi"
                    name="diaChi"
                    value={formData.diaChi}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    />
                </div>
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

export default ManageSupplier;
