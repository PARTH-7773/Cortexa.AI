import config from "./src/config/ENV.config.js";
import app from "./src/index.js";

app.listen(config.PORT, () => {
  console.log(`Server is runnig on http://loalhost:${config.PORT} `);
});
