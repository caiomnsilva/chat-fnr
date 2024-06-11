import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(express.json());

app.post('/', async (req, res) => {
    const { userId, userName, userColor } = req.body;
    try {
        const dogResponse = await fetch('https://random.dog/woof.json');
        const dogData = await dogResponse.json();
        const dogURL = dogData.url;
        res.json({
            userId,
            userName,
            userColor,
            content: `/dog ${dogURL}`,
        });
    } catch (error) {
        res.json({
            userId,
            userName,
            userColor,
            content: 'Erro ao buscar a imagem de cachorro',
        });
    }
});

app.listen(process.env.DOG_SERVICE_PORT, () => {
    console.log(`Dog service listening on port ${process.env.DOG_SERVICE_PORT}`);
});
