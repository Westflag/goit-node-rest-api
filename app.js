import express from "express";
import morgan from "morgan";
import cors from "cors";
import { sequelize } from "./db/db.js";
import dotenv from "dotenv";

import contactsRouter from "./routes/contactsRouter.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

dotenv.config();
const { PORT = 3000 } = process.env;

await sequelize
    .authenticate()
    .then(async () => {
        console.log("✅ Database connection successful");

        // 🔄 Синхронізація моделей з базою даних
        await sequelize.sync({ alter: true });
        console.log("📦 All models synchronized with the database");

        // ▶️ Запуск сервера
        app.listen(PORT, () => {
            console.log(`🚀 Server is running. Use our API on port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(`❌ Database connection failed: ${error.message}`);
        process.exit(1);
    });

