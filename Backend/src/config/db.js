const mysql = require("mysql2");
const env = require("./enviroment");

const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
});

const promisePool = pool.promise();

promisePool
  .getConnection()
  .then((conn) => {
    console.log("Đã kết nối MySQL thành công");
    conn.release();
  })
  .catch((err) => {
    console.error("Kết nối MySQL thất bại:", err.message);
  });

module.exports = promisePool;
