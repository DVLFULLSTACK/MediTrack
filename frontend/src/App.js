import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Link, Routes, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import LoginSignupPage from './pages/LoginSignUp/loginSignUp';
import Sidebar from './components/sidebar/sidebar';
import ManageMedicine from './pages/ManageMedicine/manageMedicine';
import ManageUser from './pages/ManageUser/manageUser';
import ManageSupplier from './pages/ManageSupplier/manageSupplier';
import Import from './pages/Import/import';
import Export from './pages/Export/export';
import Home from './pages/Home/home';

function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <Routes>

        <Route path="/login" element={<LoginSignupPage />} />
        <Route path="/medicine" element={<ManageMedicine />} />
        <Route path='/user' element={<ManageUser />} />
        <Route path='/supplier' element={<ManageSupplier />} />
        <Route path='/import' element={<Import />} />
        <Route path='/export' element={<Export />} />
        <Route path='/home' element={<Home />} />
        <Route path='*'  element={<Navigate to="/home" replace />} />


      </Routes>
      <ToastContainer />

      

    </BrowserRouter>
  );
}

export default App;
