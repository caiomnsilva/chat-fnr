// backend/src/server.js
import { WebSocketServer } from "ws";
import dotenv from "dotenv";

dotenv.config();

const wss = new WebSocketServer({ port: process.env.PORT || 8080 });

wss.on("connection", (ws) => {
    ws.on("error", console.error);

    ws.on("message", async (data) => {
        const message = JSON.parse(data);
        const { userId, userName, userColor, content } = message;

        if (content.startsWith("/som")) {
            const soundName = content.split(" ")[1];
            if (soundName) {
                const soundMessage = {
                    userId,
                    userName,
                    userColor,
                    content: `/som ${soundName}`,
                };
                wss.clients.forEach((client) =>
                    client.send(JSON.stringify(soundMessage))
                );
            } else {
                ws.send(
                    JSON.stringify({
                        userId,
                        userName,
                        userColor,
                        content: "Nome do som não fornecido",
                    })
                );
            }
        } else if (content.startsWith("/cat")) {
            try {
                const catResponse = await fetch("https://cataas.com/cat");
                const catURL = catResponse.url;
                const catMessage = {
                    userId,
                    userName,
                    userColor,
                    content: `/cat ${catURL}`,
                };
                wss.clients.forEach((client) =>
                    client.send(JSON.stringify(catMessage))
                );
            } catch (error) {
                ws.send(
                    JSON.stringify({
                        userId,
                        userName,
                        userColor,
                        content: "Erro ao buscar a imagem de gato",
                    })
                );
            }
        } else if (content.startsWith("/fox")) {
            const randomNum = Math.floor(Math.random() * 119) + 1;
            const foxURL = `https://randomfox.ca/images/${randomNum}.jpg`;
            const foxMessage = {
                userId,
                userName,
                userColor,
                content: `/fox ${foxURL}`,
            };
            wss.clients.forEach((client) =>
                client.send(JSON.stringify(foxMessage))
            );
        } else if (content.startsWith("/dog")) {
            try {
                const dogResponse = await fetch("https://random.dog/woof.json");
                const dogData = await dogResponse.json();
                const dogURL = dogData.url;
                const dogMessage = {
                    userId,
                    userName,
                    userColor,
                    content: `/dog ${dogURL}`,
                };
                wss.clients.forEach((client) =>
                    client.send(JSON.stringify(dogMessage))
                );
            } catch (error) {
                ws.send(
                    JSON.stringify({
                        userId,
                        userName,
                        userColor,
                        content: "Erro ao buscar a imagem de cachorro",
                    })
                );
            }
        } else {
            wss.clients.forEach((client) => client.send(data.toString()));
        }
    });

    console.log("client connected");
});
