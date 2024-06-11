import express from "express";
import connectDatabase from "./src/database/db.js";
import dotenv from "dotenv";
import setupSwagger from "./swagger.js";
import cors from "cors";

import userRoute from "./src/routes/user.route.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

setupSwagger(app);

connectDatabase();


app.use(cors());

app.use(express.json());
app.use("/user", userRoute);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
