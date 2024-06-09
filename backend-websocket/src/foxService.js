import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.post('/', (req, res) => {
    const { userId, userName, userColor } = req.body;
    const randomNum = Math.floor(Math.random() * 119) + 1;
    const foxURL = `https://randomfox.ca/images/${randomNum}.jpg`;
    res.json({
        userId,
        userName,
        userColor,
        content: `/fox ${foxURL}`,
    });
});

app.listen(process.env.FOX_SERVICE_PORT, () => {
    console.log(`Fox service listening on port ${process.env.FOX_SERVICE_PORT}`);
});
