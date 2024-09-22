// controllers/stockEntryDetailController.js

// Get all stock entry details
exports.getAllStockEntryDetails = async (req, res) => {
    try {
        const result = await req.db.query('SELECT * FROM "chiTietNhapHang" WHERE "xoa" = FALSE ORDER BY "maNhapHang"');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching stock entry details:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getStockEntryDetailByStockEntryId = async (req,res) => {
    const {stockEntryId} = req.params;
    try {
        const result = await req.db.query('SELECT * FROM "chiTietNhapHang" WHERE "xoa" = FALSE AND "maNhapHang"=$1', [stockEntryId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching stock entry details:', error);
        res.status(500).send('Internal Server Error');
    }
}



// Create a new stock entry detail
exports.createStockEntryDetail = async (req, res) => {
    const { maNhapHang, maThuoc, soLuong, giaNhap, maNhaCungCap } = req.body;
    try {
        const result = await req.db.query(
            'INSERT INTO "chiTietNhapHang" ("maNhapHang", "maThuoc", "soLuong", "giaNhap", "maNhaCungCap") VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [maNhapHang, maThuoc, soLuong, giaNhap, maNhaCungCap]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating stock entry detail:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Update a stock entry detail
exports.updateStockEntryDetail = async (req, res) => {
    const { stockEntryDetailId } = req.params;
    const { maNhapHang, maThuoc, soLuong, giaNhap, maNhaCungCap } = req.body;
    try {
        const result = await req.db.query(
            'UPDATE "chiTietNhapHang" SET "maNhapHang" = $1, "maThuoc" = $2, "soLuong" = $3, "giaNhap" = $4, "maNhaCungCap" = $5, "ngayChinhSua" = current_timestamp WHERE "maChiTietNhapHang" = $6 RETURNING *',
            [maNhapHang, maThuoc, soLuong, giaNhap, maNhaCungCap, stockEntryDetailId]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Record not found');
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating stock entry detail:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Delete a stock entry detail
exports.deleteStockEntryDetail = async (req, res) => {
    const { stockEntryDetailId } = req.params;
    try {
        const result = await req.db.query(
            'UPDATE "chiTietNhapHang" SET "xoa" = TRUE, "ngayChinhSua" = current_timestamp WHERE "maChiTietNhapHang" = $1 RETURNING *',
            [stockEntryDetailId]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Record not found');
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error deleting stock entry detail:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Get a stock entry detail by ID
exports.getStockEntryDetailById = async (req, res) => {
    const { stockEntryDetailId } = req.params;
    try {
        const result = await req.db.query('SELECT * FROM "chiTietNhapHang" WHERE "maChiTietNhapHang" = $1 AND "xoa" = FALSE', [stockEntryDetailId]);
        if (result.rows.length === 0) {
            return res.status(404).send('Record not found');
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching stock entry detail:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getTotalImportByMonth = async (req, res) => {
    const month = parseInt(req.query.month, 10); // Lấy tháng từ query string
    const year = parseInt(req.query.year, 10); // Lấy năm từ query string
  
    // Kiểm tra định dạng tháng và năm
    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
      return res.status(400).json({ message: "Invalid month or year format" });
    }
  
    try {
      const query = `
        SELECT 
            SUM(c."soLuong") AS total_imported
        FROM 
            "chiTietNhapHang" c
        WHERE 
            EXTRACT(MONTH FROM c."ngayTao") = $1
            AND EXTRACT(YEAR FROM c."ngayTao") = $2
            AND c.xoa = FALSE;
      `;
      
      const result = await req.db.query(query, [month, year]);
  
      // Nếu không có kết quả thì trả về 0
      const totalImported = result.rows[0].total_imported || 0;
  
      res.json({
        month,
        year,
        totalImported
      });
    } catch (error) {
      console.error('Error fetching import data:', error);
      res.status(500).json({ message: "Internal server error" });
    }
};
