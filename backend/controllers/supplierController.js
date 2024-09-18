// controllers/nhaCungCapController.js
exports.getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await req.db.query('SELECT * FROM "nhaCungCap" WHERE "xoa" = FALSE');
        res.json(suppliers.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createSupplier = async (req, res) => {
    const { tenNhaCungCap, diaChi, soDienThoai } = req.body;
    try {
        const result = await req.db.query(
            `INSERT INTO "nhaCungCap" ("tenNhaCungCap", "diaChi", "soDienThoai", "ngayTao", "ngayChinhSua", "xoa") 
            VALUES ($1, $2, $3, current_timestamp, current_timestamp, FALSE) RETURNING *`,
            [tenNhaCungCap, diaChi, soDienThoai]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get Supplier by ID
exports.getSupplierById = async (req, res) => {
    const { id } = req.params;
    try {
        const supplier = await req.db.query('SELECT * FROM "nhaCungCap" WHERE "maNhaCungCap" = $1 AND "xoa" = FALSE', [id]);
        if (supplier.rows.length === 0) return res.status(404).json({ message: 'Supplier not found' });
        res.json(supplier.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Supplier
exports.updateSupplier = async (req, res) => {
    const { id } = req.params;
    const { tenNhaCungCap, diaChi, soDienThoai } = req.body;
    try {
        const result = await req.db.query(
            `UPDATE "nhaCungCap" SET "tenNhaCungCap" = $1, "diaChi" = $2, "soDienThoai" = $3, "ngayChinhSua" = current_timestamp 
             WHERE "maNhaCungCap" = $4 AND "xoa" = FALSE RETURNING *`,
            [tenNhaCungCap, diaChi, soDienThoai, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Supplier not found' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Soft Delete Supplier
exports.softDeleteSupplier = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await req.db.query(
            `UPDATE "nhaCungCap" SET "xoa" = TRUE, "ngayChinhSua" = current_timestamp WHERE "maNhaCungCap" = $1 RETURNING *`,
            [id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Supplier not found' });
        res.json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
