// controllers/purchaseOrderController.js

// Get list of purchase orders
exports.getPurchaseOrders = async (req, res) => {
    try {
        const result = await req.db.query(`
        SELECT
        "banHang".*,
        (
          SELECT json_agg(detail)
          FROM (
            SELECT 
              "chiTietBanHang"."maChiTietBanHang", 
              "chiTietBanHang"."maThuoc", 
              "chiTietBanHang"."soLuong", 
              "chiTietBanHang"."giaBan",
              "thuoc"."tenThuoc",            -- Thông tin thuốc từ bảng thuoc
              "thuoc"."congDung",            -- Thông tin công dụng của thuốc
              "thuoc"."donViTinh"          -- Thông tin đơn vị tính của thuốc
                      
            FROM "chiTietBanHang"
            JOIN "thuoc" ON "chiTietBanHang"."maThuoc" = "thuoc"."maThuoc"
            WHERE "chiTietBanHang"."maBanHang" = "banHang"."maBanHang"
              AND "chiTietBanHang"."xoa" = FALSE
          ) AS detail
        ) AS "chiTietBanHang"
      FROM "banHang"
      WHERE "banHang"."xoa" = FALSE
      ORDER BY "banHang"."maBanHang" DESC;
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add new purchase order
exports.createPurchaseOrder = async (req, res) => {
    const { ngayBan, tongTien } = req.body;
    try {
        const result = await req.db.query(
            'INSERT INTO "banHang" ("ngayBan","tongTien") VALUES ($1,$2) RETURNING *',
            [ngayBan,tongTien]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
