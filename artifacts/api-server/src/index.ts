import app from "./app.js";
import { logger } from "./lib/logger.js";
import { supabase } from "@workspace/db";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function init() {
  try {
    const { error } = await supabase!.from("site_settings").select("id").limit(1).maybeSingle();
    if (error) {
      logger.warn({ error: error.message }, "site_settings table not accessible");
    } else {
      logger.info("Database connected");
    }
  } catch (err) {
    logger.warn({ err }, "Database check failed");
  }
}

init().then(() => {
  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }
    logger.info({ port }, "Server listening");
  });
});