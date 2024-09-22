// controllers/stockEntryController.js

// Get all stock entries
exports.getAllStockEntries = async (req, res) => {
    try {
        const result = await req.db.query(`
        SELECT
  "nhapHang".*,
  (
    SELECT json_agg(detail)
    FROM (
      SELECT 
        "chiTietNhapHang"."maChiTietNhapHang", 
        "chiTietNhapHang"."maThuoc", 
        "chiTietNhapHang"."soLuong", 
        "chiTietNhapHang"."giaNhap",
        "thuoc"."tenThuoc",            -- Thông tin thuốc từ bảng thuoc
        "thuoc"."congDung",            -- Thông tin công dụng của thuốc
        "thuoc"."donViTinh",          -- Thông tin đơn vị tính của thuốc
				"nhaCungCap"."tenNhaCungCap"
      FROM "chiTietNhapHang"
      JOIN "thuoc" ON "chiTietNhapHang"."maThuoc" = "thuoc"."maThuoc"
			JOIN "nhaCungCap" ON "chiTietNhapHang"."maNhaCungCap" = "nhaCungCap"."maNhaCungCap"
      WHERE "chiTietNhapHang"."maNhapHang" = "nhapHang"."maNhapHang"
        AND "chiTietNhapHang"."xoa" = FALSE
    ) AS detail
  ) AS "chiTietNhapHang"
FROM "nhapHang"
WHERE "nhapHang"."xoa" = FALSE
ORDER BY "nhapHang"."maNhapHang" DESC;

        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching stock entries:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Create a new stock entry
exports.createStockEntry = async (req, res) => {
    const { ngayNhap } = req.body;
    try {
        const result = await req.db.query(
            'INSERT INTO "nhapHang" ("ngayNhap") VALUES ($1) RETURNING *',
            [ngayNhap]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating stock entry:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Update a stock entry
exports.updateStockEntry = async (req, res) => {
    const { stockEntryId } = req.params;
    const { ngayNhap } = req.body;
    try {
        const result = await req.db.query(
            'UPDATE "nhapHang" SET "ngayNhap" = $1, "ngayChinhSua" = current_timestamp WHERE "maNhapHang" = $2 RETURNING *',
            [ngayNhap, stockEntryId]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Record not found');
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating stock entry:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Delete a stock entry
exports.deleteStockEntry = async (req, res) => {
    const { stockEntryId } = req.params;
    try {
        const result = await req.db.query(
            'UPDATE "nhapHang" SET "xoa" = TRUE, "ngayChinhSua" = current_timestamp WHERE "maNhapHang" = $1 RETURNING *',
            [stockEntryId]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Record not found');
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error deleting stock entry:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Get a stock entry by ID
exports.getStockEntryById = async (req, res) => {
    const { stockEntryId } = req.params;
    try {
        const result = await req.db.query('SELECT * FROM "nhapHang" WHERE "maNhapHang" = $1 AND "xoa" = FALSE', [stockEntryId]);
        if (result.rows.length === 0) {
            return res.status(404).send('Record not found');
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching stock entry:', error);
        res.status(500).send('Internal Server Error');
    }
};
