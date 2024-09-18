const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secretKey = 'medic_track';  // Nên lưu secret này trong file .env để bảo mật

// Register user
exports.register = async (req, res) => {
    const { mail, tenNguoiDung, matKhau, vaiTro } = req.body;

    try {
        // Kiểm tra email đã tồn tại chưa
        const existingUser = await req.db.query('SELECT * FROM "nguoiDung" WHERE "mail" = $1', [mail]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(matKhau, 10);

        // Tạo người dùng mới
        const newUser = await req.db.query(
            `INSERT INTO "nguoiDung" ("mail", "tenNguoiDung", "matKhau") 
             VALUES ($1, $2, $3) RETURNING *`,
            [mail, tenNguoiDung, hashedPassword]
        );

        res.status(201).json(newUser.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login user
exports.login = async (req, res) => {
    const { mail, matKhau } = req.body;

    try {
        // Tìm người dùng theo email
        const user = await req.db.query('SELECT * FROM "nguoiDung" WHERE "mail" = $1', [mail]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Sai email hoặc mật khẩu' });
        }

        const foundUser = user.rows[0];

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(matKhau, foundUser.matKhau);
        if (!isMatch) {
            return res.status(400).json({ message: 'Sai email hoặc mật khẩu' });
        }

        // Tạo token
        const token = jwt.sign({ id: foundUser.maNguoiDung, mail: foundUser.mail }, secretKey, { expiresIn: '1h' });

        res.json({ token, user: { mail: foundUser.mail, tenNguoiDung: foundUser.tenNguoiDung, vaiTro: foundUser.vaiTro } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};