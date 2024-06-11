import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.post('/', (req, res) => {
    const { userId, userName, userColor, content } = req.body;
    const soundName = content.split(' ')[1];
    if (soundName) {
        res.json({
            userId,
            userName,
            userColor,
            content: `/som ${soundName}`,
        });
    } else {
        res.json({
            userId,
            userName,
            userColor,
            content: 'Nome do som não fornecido',
        });
    }
});

app.listen(process.env.SOUND_SERVICE_PORT, () => {
    console.log(`Sound service listening on port ${process.env.SOUND_SERVICE_PORT}`);
});
