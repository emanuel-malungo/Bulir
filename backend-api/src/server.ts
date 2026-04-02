import app from "./app.js";
import ENV from "./config/env.config.js";

const PORT = ENV.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port http://localhost:${PORT}`);
});