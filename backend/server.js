const express = require("express");
const port = 3001;
const cors = require("cors");
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cron = require('node-cron');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const medicRoute = require('./routes/medicRoute');
const supplierRoute = require('./routes/supplierRoute')
const userRoute = require('./routes/userRoute')
const authRoute = require('./routes/authRoute')


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'medictrack',
    password: '    ',
    port: 5433,
});


// Middleware để gắn pool vào req
app.use((req, res, next) => {
    req.db = pool;
    next();
});

// Cron job chạy 5 phút

// Định nghĩa các route

app.use('/api/medics/',medicRoute);
app.use('/api/suppliers/',supplierRoute);
app.use('/api/users/',userRoute);
app.use('/api/auth/',authRoute);


// Khởi động server
app.listen(port, () => {
    console.log(`Server chạy trên cổng ${port}`);
});
