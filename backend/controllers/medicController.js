exports.getAllMedicines = async (req, res) => {
    try {
        const medicines = await req.db.query('SELECT t.*, n."tenNhaCungCap" FROM "thuoc" t LEFT JOIN "nhaCungCap" n ON t."maNhaCungCap" = n."maNhaCungCap"  WHERE t."xoa" = FALSE ORDER BY t."maThuoc"');
        res.json(medicines.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createMedicine = async (req, res) => {
    const { tenThuoc, congDung } = req.body;
    try {
        const result = await req.db.query(
            `INSERT INTO "thuoc" ("tenThuoc", "congDung") 
            VALUES ($1, $2) RETURNING *`,
            [tenThuoc, congDung]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// controllers/thuocController.js

// Get Medicine by ID
exports.getMedicineById = async (req, res) => {
    const { id } = req.params;
    try {
        const medicine = await req.db.query('SELECT * FROM "thuoc" WHERE "maThuoc" = $1 AND "xoa" = FALSE', [id]);
        if (medicine.rows.length === 0) return res.status(404).json({ message: 'Medicine not found' });
        res.json(medicine.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Medicine
exports.updateMedicine = async (req, res) => {
    const { id } = req.params;
    const { tenThuoc, congDung, soLuongTon } = req.body;
    try {
        const result = await req.db.query(
            `UPDATE "thuoc" SET "tenThuoc" = $1, "congDung" = $2, "soLuongTon" = $3, "ngayChinhSua" = current_timestamp 
             WHERE "maThuoc" = $4 AND "xoa" = FALSE RETURNING *`,
            [tenThuoc, congDung, soLuongTon, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Medicine not found' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Soft Delete Medicine
exports.softDeleteMedicine = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await req.db.query(
            `UPDATE "thuoc" SET "xoa" = TRUE, "ngayChinhSua" = current_timestamp WHERE "maThuoc" = $1 RETURNING *`,
            [id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Medicine not found' });
        res.json({ message: 'Medicine deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
