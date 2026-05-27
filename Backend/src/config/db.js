const mysql = require('mysql2');

const con = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '123456',
  insecureAuth: true,
  database: 'PhongKham'
});

con.connect(err => {
  if (err) {
    console.error('Kết nối MySQL thất bại:', err.stack);
    return;
  }

  console.log('Đã kết nối MySQL với id ' + con.threadId);
});

module.exports = con; 