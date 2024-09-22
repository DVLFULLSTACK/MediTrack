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
        const user = await req.db.query('SELECT * FROM "nguoiDung" WHERE "mail" = $1', [mail]);
        
        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Sai email hoặc mật khẩu' }); // Thêm return ở đây
        }

        const foundUser = user.rows[0];

        if (!foundUser.isActive) {
            return res.status(400).json({ message: 'Tài khoản đã bị khóa' }); // Thêm return ở đây
        }

        const isMatch = await bcrypt.compare(matKhau, foundUser.matKhau);
        if (!isMatch) {
            return res.status(400).json({ message: 'Sai email hoặc mật khẩu' }); // Thêm return ở đây
        }

        const token = jwt.sign({ id: foundUser.maNguoiDung, mail: foundUser.mail }, secretKey, { expiresIn: '1h' });
        return res.json({ token, user: { mail: foundUser.mail, tenNguoiDung: foundUser.tenNguoiDung, vaiTro: foundUser.vaiTro } }); // Thêm return ở đây
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi, vui lòng thử lại sau!' }); // Thêm return ở đây
    }
};

exports.changePassword = async (req,res) => {
    const {id} = req.params;
    const {  matKhau } = req.body;
    
    try {
        // Tìm người dùng theo email
        console.log(matKhau,id);
        const hashedPassword = await bcrypt.hash(matKhau, 10);

        const result =  await req.db.query(`UPDATE "nguoiDung" SET "matKhau" = $1 WHERE "maNguoiDung"=$2 RETURNING *`,[hashedPassword,id])

        // So sánh mật khẩu
       
        // Tạo token
        if (result.rows.length>0)
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

