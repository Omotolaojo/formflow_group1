import "dotenv/config";
import app from "./app";

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Expense Claim API running on port ${PORT}`
  );
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
});