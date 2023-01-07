import app from "./app";
import connectToDB from "./configs/dbConn";
import Logger from "./utils/logger";

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  await connectToDB();
  Logger.info(`App is running at http://localhost:${PORT}`);
});
