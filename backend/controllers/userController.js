// controllers/userController.js

// Get All Users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await req.db.query('SELECT * FROM "nguoiDung" WHERE "xoa" = FALSE');
        res.json(users.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get User by ID
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await req.db.query('SELECT * FROM "nguoiDung" WHERE "maNguoiDung" = $1 AND "xoa" = FALSE', [id]);
        if (user.rows.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(user.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create User
exports.createUser = async (req, res) => {
    const { mail, tenNguoiDung, matKhau, vaiTro } = req.body;
    try {
        const result = await req.db.query(
            `INSERT INTO "nguoiDung" ("mail", "tenNguoiDung", "matKhau", "vaiTro", "ngayTao", "ngayChinhSua", "xoa")
             VALUES ($1, $2, $3, $4, current_timestamp, current_timestamp, FALSE) RETURNING *`,
            [mail, tenNguoiDung, matKhau, vaiTro]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update User
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { mail, tenNguoiDung, matKhau, vaiTro } = req.body;
    try {
        const result = await req.db.query(
            `UPDATE "nguoiDung" SET "mail" = $1, "tenNguoiDung" = $2, "matKhau" = $3, "vaiTro" = $4, "ngayChinhSua" = current_timestamp 
             WHERE "maNguoiDung" = $5 AND "xoa" = FALSE RETURNING *`,
            [mail, tenNguoiDung, matKhau, vaiTro, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Soft Delete User
exports.softDeleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await req.db.query(
            `UPDATE "nguoiDung" SET "xoa" = TRUE, "ngayChinhSua" = current_timestamp WHERE "maNguoiDung" = $1 RETURNING *`,
            [id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.changeActiveUser = async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;
    try {
        const result = await req.db.query(
            `UPDATE "nguoiDung" SET "isActive" = $1
             WHERE "maNguoiDung" = $2 AND "xoa" = FALSE RETURNING *`,
            [isActive, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};