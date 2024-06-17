import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.CHATGPT_SERVICE_PORT || 3004;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

app.use(bodyParser.json());

app.post("/text", async (req, res) => {
  try {
    const { content } = req.body;

    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: content }],
      model: "gpt-3.5-turbo",
    });

    res.json({
      userName : "ChatGPT",
      content: response.choices[0].message.content.trim(),
  });
  } catch (error) {
    console.error("Erro ao gerar texto:", error);
    res.status(500).json({ error: "Erro ao processar a solicitação" });
  }
});

// Endpoint para gerar imagem (mantém o mesmo formato)
app.post("/image", async (req, res) => {
  try {
    const { userId, userName, userColor, content } = req.body;

    const response = await openai.images.generate({
      prompt: content,
      n: 1,
      size: "1024x1024",
    });

    if (response.data && response.data.length > 0) {
      const imageUrl = response.data[0].url;
      res.json({
        userId, 
        userName,
        userColor,
        content: `${imageUrl}`,  // Retorna a imagem no mesmo formato que o serviço de cachorro
      });
    } else {
      console.error("Erro ao gerar imagem: Formato de resposta inesperado ou erro da API");
      res.status(500).json({
        userId, 
        userName,
        userColor,
        content: "Erro ao gerar imagem", 
      });
    }
  } catch (error) {
    console.error("Erro ao gerar imagem:", error);
    res.status(500).json({
      userId, 
      userName,
      userColor,
      content: "Erro ao processar a solicitação", 
    });
  }
});

app.listen(port, () => {
  console.log(`Serviço ChatGPT rodando em http://localhost:${port}`);
});
