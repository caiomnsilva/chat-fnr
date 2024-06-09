import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const wss = new WebSocketServer({ port: process.env.PORT || 8080 });

const forwardMessage = async (url, message) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error forwarding message:', error);
        return { content: 'Erro ao processar a solicitação' };
    }
};

wss.on('connection', (ws) => {
    ws.on('error', console.error);

    ws.on('message', async (data) => {
        const message = JSON.parse(data);
        const { content } = message;

        let serviceUrl;

        if (content.startsWith('/som')) {
            serviceUrl = `http://localhost:${process.env.SOUND_SERVICE_PORT}`;
        } else if (content.startsWith('/cat')) {
            serviceUrl = `http://localhost:${process.env.CAT_SERVICE_PORT}`;
        } else if (content.startsWith('/fox')) {
            serviceUrl = `http://localhost:${process.env.FOX_SERVICE_PORT}`;
        } else if (content.startsWith('/dog')) {
            serviceUrl = `http://localhost:${process.env.DOG_SERVICE_PORT}`;
        }

        if (serviceUrl) {
            const serviceResponse = await forwardMessage(serviceUrl, message);
            wss.clients.forEach((client) => client.send(JSON.stringify(serviceResponse)));
        } else {
            wss.clients.forEach((client) => client.send(data.toString()));
        }
    });

    console.log('client connected');
});
