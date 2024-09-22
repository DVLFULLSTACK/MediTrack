// controllers/purchaseOrderDetailController.js


// Get list of purchase order details
exports.getPurchaseOrderDetails = async (req, res) => {
    try {
        const result = await req.db.query('SELECT * FROM chiTietNhapHang WHERE xoa = FALSE');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add new purchase order detail
exports.createPurchaseOrderDetail = async (req, res) => {
    const { maBanHang, maThuoc, soLuongBan, giaBan } = req.body;
    try {
        const result = await req.db.query(
            'INSERT INTO "chiTietBanHang" ("maBanHang", "maThuoc", "soLuong", "giaBan") VALUES ($1, $2, $3, $4) RETURNING *',
            [maBanHang, maThuoc, soLuongBan, giaBan]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTopSelling = async (req,res) => {
    try {
        const result = await req.db.query(`
        SELECT t."tenThuoc", SUM(c."soLuong") AS total_sold
FROM "chiTietBanHang" c
JOIN "thuoc" t ON t."maThuoc" = c."maThuoc"
WHERE c.xoa = FALSE
GROUP BY t."tenThuoc"
ORDER BY total_sold DESC
`);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.statisticByYear = async (req,res) => {
    const year = parseInt(req.params.year, 10);

  if (isNaN(year)) {
    return res.status(400).json({ message: "Invalid year format" });
  }

  try {
    const query = `
      SELECT 
          EXTRACT(MONTH FROM c."ngayTao") AS month,
          SUM(c."soLuong" * c."giaBan") AS total_revenue
      FROM 
          "chiTietBanHang" c
      WHERE 
          EXTRACT(YEAR FROM c."ngayTao") = $1
          AND c.xoa = FALSE
      GROUP BY 
          month
      ORDER BY 
          month;
    `;
    
    const result = await req.db.query(query, [year]);

    // Tạo một mảng chứa dữ liệu theo từng tháng (từ 1 đến 12), giá trị mặc định là 0
    const monthlyRevenue = Array(12).fill(0);

    // Gán tổng doanh thu cho từng tháng dựa trên kết quả từ database
    result.rows.forEach(row => {
      // Chuyển giá trị tháng từ 1-based thành index 0-based
      monthlyRevenue[row.month - 1] = parseFloat(row.total_revenue);
    });

    res.json({
      year,
      monthlyRevenue
    });
  } catch (error) {
    console.error('Error fetching revenue:', error);
    res.status(500).json({ message: "Internal server error" });
  }
}