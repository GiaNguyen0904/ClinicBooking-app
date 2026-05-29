const { verifyToken } = require("../utils/jwt.utils");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Chưa xác thực. Vui lòng đăng nhập." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token không hợp lệ hoặc đã hết hạn." });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.VaiTro)) {
      return res.status(403).json({ error: "Bạn không có quyền thực hiện thao tác này." });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
