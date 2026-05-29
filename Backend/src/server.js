const app = require("./app");
const env = require("./config/enviroment");
require("./config/db"); // Initialize DB connection

const PORT = env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
