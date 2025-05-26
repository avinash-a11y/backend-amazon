const express = require("express")
const mariadb = require("mariadb")
const cors = require("cors")

// ✅ Updated connection string for hosted DB
const pool = mariadb.createPool({
    host: "sql12.freesqldatabase.com",
    user: "sql12781209",
    password: "2XzVK9626K",
    database: "sql12781209",
    port: 3306,
    connectionLimit: 5
})

const app = express()
app.use(express.json())
app.use(cors())

// ✅ Test DB connection on startup
pool.getConnection()
    .then(conn => {
        console.log("✅ Connected to Freesqldatabase.com");
        conn.release();
    })
    .catch(err => {
        console.error("❌ Database connection failed:", err);
    });

app.get('/products', async (req, res) => {
    const conn = await pool.getConnection();
    const data = await conn.query("SELECT * FROM products");
    conn.release();
    res.send({ "data": data });
});

app.post('/signup', async (req, res) => {
    const { name, gmail, password } = req.body;
    const conn = await pool.getConnection();
    const query = `INSERT INTO users(NAME, gmail, password) VALUES (?, ?, ?)`;
    await conn.query(query, [name, gmail, password]);
    conn.release();
    res.send({ "issigned": "true" });
});

app.post('/signin', async (req, res) => {
    const { gmail, password } = req.body;
    const conn = await pool.getConnection();
    const query = `SELECT * FROM users WHERE gmail = ? AND password = ?`;
    const data = await conn.query(query, [gmail, password]);
    conn.release();
    if (data.length !== 0) {
        res.send({ "issigned": "true", "id": data[0].id });
    } else {
        res.send({ "issigned": "false" });
    }
});

app.post('/getcart', async (req, res) => {
    const { id } = req.body;
    const conn = await pool.getConnection();
    const data = await conn.query("SELECT * FROM cart_item WHERE user_id = ?", [id]);
    conn.release();
    res.send({ "cart_items": data.length ? data : [] });
});

app.post('/cart', async (req, res) => {
    const { user, product } = req.body;
    const conn = await pool.getConnection();
    const query = "INSERT INTO cart_item(user_id, product_id) VALUES (?, ?)";
    await conn.query(query, [user, product]);
    conn.release();
    res.send({ "cart_items": "true" });
});

app.post('/getoneproduct', async (req, res) => {
    const { id } = req.body;
    const conn = await pool.getConnection();
    const data = await conn.query("SELECT * FROM products WHERE id = ?", [id]);
    conn.release();
    res.send({ "product": data });
});

app.post('/removefromcart', async (req, res) => {
    const { user, product } = req.body;
    const conn = await pool.getConnection();
    await conn.query("DELETE FROM cart_item WHERE product_id = ? AND user_id = ?", [product, user]);
    conn.release();
    res.send({ "cart_items": "true" });
});

app.listen(3007, () => {
    console.log("🚀 Server running on port 3007");
});
