import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(express.json());

app.post('/', async (req, res) => {
    const { userId, userName, userColor, content } = req.body;
    try {
        const catResponse = await fetch('https://cataas.com/cat');
        const catURL = catResponse.url;
        res.json({
            userId,
            userName,
            userColor,
            content: `/cat ${catURL}`,
        });
    } catch (error) {
        res.json({
            userId,
            userName,
            userColor,
            content: 'Erro ao buscar a imagem de gato',
        });
    }
});

app.listen(process.env.CAT_SERVICE_PORT, () => {
    console.log(`Cat service listening on port ${process.env.CAT_SERVICE_PORT}`);
});
