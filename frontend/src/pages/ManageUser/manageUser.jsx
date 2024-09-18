import React, { useState } from "react";
import { useEffect } from "react";
import { FaPlus, FaTrash, FaPencilAlt, FaSearch,FaUserLock } from "react-icons/fa";
import { LiaFileImportSolid, LiaFileExportSolid } from "react-icons/lia";
import { PiPasswordBold } from "react-icons/pi";

import userService from "../../services/userService";
import diacritics from 'diacritics'; //Loại bỏ dấu
import { toast } from "react-toastify";

const ManageUser = () => {

    
    const [users, setUsers] = useState([
        { id: 1, name: "Aspirin", dosage: "500mg", frequency: "Twice daily", stock: 100 },
        { id: 2, name: "Ibuprofen", dosage: "400mg", frequency: "As needed", stock: 50 },
        { id: 3, name: "Paracetamol", dosage: "650mg", frequency: "Every 6 hours", stock: 75 },
    ]);
    const fetchUser = async () => {
        const res = await userService.getAllUsers();
        setUsers(res);
        setFilteredUsers(searchTerm ?  users.filter((user) =>
            (diacritics.remove(user.tenNguoiDung).toLowerCase().includes(diacritics.remove(searchTerm).toLowerCase()))
        ) : res) 
    }
   
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [filteredUsers,setFilteredUsers] = useState()
    const [formData, setFormData] = useState({
        name: "",
        dosage: "",
        frequency: "",
        stock: 0,
    });

    const handleRowClick = (user) => {
        setSelectedUser((prevSelected) =>
          prevSelected && prevSelected.maNguoiDung === user.maNguoiDung ? null : user
        );
      };
    

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    useEffect(() => {
        
        setFilteredUsers(searchTerm ?  users.filter((user) =>
        (diacritics.remove(user.tenNguoiDung).toLowerCase().includes(diacritics.remove(searchTerm).toLowerCase()))
    ) : users) 
    }, [searchTerm])
    

    // const filteredUsers = users.filter((user) =>
    //     user.tenThuoc.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    const openModal = (mode) => {
        setModalMode(mode);
        if (mode === "create") {
        setFormData({ tenNguoiDung: "", matKhau: "", mail: ""});
        } else if (mode === "update" && selectedUser) {
        setFormData({ ...selectedUser });
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
        const res = await userService.createUser({...formData})
        // const newUser = { ...formData, id: Date.now() };
        // setUsers([...users, res]);
        toast.success('Thêm người dùng thành công!')
        fetchUser()
        } else if (modalMode === "update") {
        const res = await userService.updateUser(formData.maNguoiDung,formData);
        setSelectedUser(null)
        toast.success('Cập nhật người dùng thành công!')

        fetchUser()
        }
        closeModal();
    };

    const handleDelete = async () => {
        if (selectedUser) {
            const res = await userService.softDeleteUser(selectedUser.maNguoiDung)
            fetchUser()
            toast.success('Xóa người dùng thành công!')

        }
    };
    useEffect(() => {
        fetchUser()

    }, [])
    useEffect(() => {
        const handleOutsideClick = (event) => {
          if (!event.target.closest('table') && !event.target.closest('.modal')) {
            setSelectedUser(null);
          }
        };
    
        document.addEventListener('click', handleOutsideClick);
    
        return () => {
          document.removeEventListener('click', handleOutsideClick);
        };
      }, []);
    if (!filteredUsers) return;
    return (
        <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Quản lý nhân viên</h1>
        <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center">
            <input
                type="text"
                placeholder="Search users..."
                className="border rounded-l px-4 py-2 w-64"
                value={searchTerm}
                onChange={handleSearch}
            />
            <button className="bg-blue-500 text-white rounded-r" style={{padding:'0.8em'}}>
                <FaSearch />
            </button>
            </div>
            <div className="flex space-x-2">
            <button onClick={() => openModal("create")} className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200" title="Add User"><FaPlus /></button>
            <button onClick={() => openModal("update")} disabled={!selectedUser} className={`p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors duration-200 ${!selectedUser && "opacity-50 cursor-not-allowed"}` } title="Update"><FaPencilAlt /></button>
            <button onClick={handleDelete} disabled={!selectedUser} className={`p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200 ${!selectedUser && "opacity-50 cursor-not-allowed"}` } title="Delete"><FaTrash /></button>
            <button  disabled={!selectedUser} className={`p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 ${!selectedUser && "opacity-50 cursor-not-allowed"}` } title="ChangePassword"><PiPasswordBold /></button>
            <button  disabled={!selectedUser} className={`p-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors duration-200 ${!selectedUser && "opacity-50 cursor-not-allowed"}` } title="Export"><FaUserLock /></button>

            </div>
        </div>
        <table className="w-full bg-white shadow-md rounded">
            <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Tên nhân viên</th>
                <th className="py-3 px-6 text-left">Mã nhân viên</th>
                <th className="py-3 px-6 text-left">Mail</th>
              

            </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
            {filteredUsers.map((user) => (
                <tr
                key={user.maNguoiDung}
                onClick={() => handleRowClick(user)}
                className={` cursor-pointer border-b border-gray-200 hover:bg-gray-100 ${selectedUser && selectedUser.maNguoiDung === user.maNguoiDung ? "bg-blue-100" : ""}`}
                >
                <td className="py-3 px-6 text-left whitespace-nowrap">{user.tenNguoiDung}</td>
                <td className="py-3 px-6 text-left">{user.maNguoiDung}</td>
                <td className="py-3 px-6 text-left">{user.mail}</td>
               
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
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tenNguoiDung">
                    Tên người dùng
                    </label>
                    <input
                    type="text"
                    id="tenNguoiDung"
                    name="tenNguoiDung"
                    value={formData.tenNguoiDung}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    />
                </div>
                
                {modalMode=='update' && 
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maNguoiDung">
                    Mã người dùng
                    </label>
                    <input
                    type="text"
                    id="maNguoiDung"
                    name="maNguoiDung"
                    value={formData.maNguoiDung}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    disabled
                    />
                </div>}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="congDung">
                    Mail
                    </label>
                    <input
                    type="email"
                    id="mail"
                    name="mail"
                    value={formData.mail}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="matKhau">
                    Mật khẩu
                    </label>
                    <input
                    type="password"
                    id="matKhau"
                    name="matKhau"
                    value={formData.matKhau}
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

export default ManageUser;
