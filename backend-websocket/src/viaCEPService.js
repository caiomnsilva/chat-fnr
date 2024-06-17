import express from "express";
import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

const app = express();


app.get("/get-ruas/:state/:city/:street", async (req, res) => {
    const { state, city, street } = req.params;
    const address = `${state}/${city}/${street}`;
    try {
        const response = await axios.get(
            `https://viacep.com.br/ws/${address}/json/`
        );
        const data = response.data;

        return res.json({ type: "cepResponse", cep: data });
    } catch (error) {
        // Se ocorrer um erro ao buscar os dados do CEP, retornar um erro 500
        console.error("Error fetching Ruas from external service:", error);
        res.status(500).json({
            type: "cepResponse",
            error: "Failed to fetch Ruas",
        });
    }
});

app.get("/get-cep/:cep", async (req, res) => {
    const { cep } = req.params;
    try {
        const response = await axios.get(
            `https://viacep.com.br/ws/${cep}/json/`
        );
        const data = [response.data];

        return res.json({ type: "cepResponse", cep: data });
    } catch (error) {
        // Se ocorrer um erro ao buscar os dados do CEP, retornar um erro 500
        console.error("Error fetching CEP from external service:", error);
        res.status(500).json({
            type: "cepResponse",
            error: "Failed to fetch CEP",
        });
    }
});

app.listen(process.env.VIACEP_SERVICE_PORT, () => {
    console.log(`HTTP service is running on http://localhost:${process.env.VIACEP_SERVICE_PORT}`);
});
