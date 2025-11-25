import { logger } from "./application/logging";
import { web } from "./application/web";

web.listen(3000, () => {
  logger.info("application start on port 3000");
});
