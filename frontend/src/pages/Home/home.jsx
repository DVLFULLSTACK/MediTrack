import React, { useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { FaDollarSign, FaPills, FaSearch, FaFilter } from "react-icons/fa";
import medicService from "../../services/medicService";
import { useEffect } from "react";
import purchaseOrderDetailService from "../../services/purchaseOrderDetailService";
import formatService from "../../services/formatService";
import stockEntryDetailService from "../../services/stockEntryDetailService";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const Home = () => {
  const [revenueFilter, setRevenueFilter] = useState("monthly");
  const [drugSearchTerm, setDrugSearchTerm] = useState("");
  const [colors,setColors] = useState([])
  const [medic,setMedic] = useState([])
  const [medicName,setMedicName] = useState([])
  const [mediQuant,setMediQuant] = useState([])
  const [medicTop,setMedicTop] = useState([])
  const [dataYear, setDataYear] = useState([])
  const [total,setTotal] = useState(0)
  const [totalImport,setTotalImport] = useState(0)
  const [filteredDrugs,setFilteredDrugs] = useState([])
  const fetchMedic = async () => {
    const res = await medicService.getAllMedicines()
    res.map((item) => item.isImport = false)
    setMedicName(res.map((item) => item.tenThuoc))
    setMediQuant(res.map((item) => item.soLuongTon))
    setMedic(res)
    setColors(generateRandomColors(res.length))
  }
  const fetchTotalImport = async () => {
    const res = await stockEntryDetailService.getTotalImportByMonth(9,2024);
    setTotalImport(res.totalImported)
  }
  const generateRandomColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
      colors.push(randomColor);
    }
    return colors;
  };
  const fetchTopSellMedic = async () => {
    const res = await purchaseOrderDetailService.getTopSelling();
    setMedicTop(res);
  }
  const fetchByYear = async () => {
    const res = await purchaseOrderDetailService.getByYear(2024)
    setDataYear(res.monthlyRevenue)
    var sum = 0;
    res.monthlyRevenue.forEach((item) => sum+=item);
    setTotal(sum)
  }
  useEffect(() => {
    fetchMedic()
    fetchTopSellMedic()
    fetchByYear()
    fetchTotalImport()
    
  }, [])
  // Dummy data for revenue statistics
  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul","Aug","Sep", "Oct","Nov","Dec"],
    datasets: [
      {
        label: "Revenue",
        data: dataYear,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  // Dummy data for drug statistics
  const drugData = {
    labels: medicName,
    datasets: [
      {
        data: mediQuant,
        backgroundColor: colors,
      },
    ],
  };

  // Dummy data for top-selling drugs
  const topSellingDrugs = [
    { name: "Drug A", sales: 5000 },
    { name: "Drug B", sales: 4500 },
    { name: "Drug C", sales: 4000 },
    { name: "Drug D", sales: 3500 },
    { name: "Drug E", sales: 3000 },
  ];

//   const filteredDrugs = topSellingDrugs.filter((drug) =>
//     drug.name.toLowerCase().includes(drugSearchTerm.toLowerCase())
//   );

  return (
    <div className="container mx-auto px-4 py-8">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Revenue Statistics */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FaDollarSign className="mr-2" /> Thống kê doanh thu
          </h2>
          <div className="mb-4">
            <label htmlFor="revenueFilter" className="mr-2">Filter by:</label>
            <select
              id="revenueFilter"
              value={revenueFilter}
              onChange={(e) => setRevenueFilter(e.target.value)}
              className="border rounded p-2"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <Line data={revenueData} />
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="font-semibold">Tổng doanh thu năm</h3>
              <p className="text-2xl">{formatService.formatPrice(total)} VND</p>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="font-semibold">Doanh thu trung bình tháng</h3>
              <p className="text-2xl">{formatService.formatPrice(total/12)} VND</p>
            </div>
          </div>
        </div>

        {/* Drug Statistics */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FaPills className="mr-2" /> Thống kê số lượng tồn kho
          </h2>
          <div className="mb-4">
            <Pie data={drugData} />
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Top lượt bán</h3>
           
           
            <ul className="divide-y">
              {medicTop.map((drug, index) => (
                <li key={index} className="py-2 flex justify-between">
                  <span>{drug.tenThuoc}</span>
                  <span className="font-semibold">{drug.total_sold} lượt bán</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Thông tin khác</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold">Tổng số thuốc</h3>
            <p className="text-2xl">{medic.length}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold">Số lượng nhập tháng này</h3>
            <p className="text-2xl">{totalImport}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold">Khách hàng đánh giá</h3>
            <p className="text-2xl">4.8/5</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
