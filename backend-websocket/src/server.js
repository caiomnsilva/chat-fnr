import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const wss = new WebSocketServer({ port: process.env.WS_SERVICE_PORT || 8080 });

const forwardMessage = async (url, message) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(message),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error forwarding message:", error);
        return { content: "Erro ao processar a solicitação" };
    }
};

const fetchRuasFromService = async (address) => {
    try {
        const url = `http://localhost:3003/get-ruas/${address}`;
        console.log(`Fetching Ruas from URL: ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching CEP from service:", error);
        return { error: "Failed to fetch CEP from service" };
    }
};

const fetchCepFromService = async (address) => {
    try {
        const url = `http://localhost:3003/get-cep/${address}`;
        console.log(`Fetching CEP from URL: ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching CEP from service:", error);
        return { error: "Failed to fetch CEP from service" };
    }
};

function constructAddressUrl(ruaString) {
    ruaString = ruaString.replace("/rua ", "");
    let parts = ruaString.split("/");
    if (parts.length === 3) {
        let state = parts[0];
        let city = parts[1];
        let street = parts[2];
        return `${state}/${encodeURIComponent(city)}/${encodeURIComponent(
            street
        )}`;
    } else {
        return null;
    }
}

function constructCep(cepString) {
    cepString = cepString.replace("/cep ", "");
    return cepString;
}

wss.on("connection", (ws) => {
    ws.on("error", console.error);

    ws.on("message", async (data) => {
        const message = JSON.parse(data);
        const { content } = message;

        const type = message.type || null;

        let serviceUrl;

        if (type === "chatgptText") {
            serviceUrl = `http://localhost:${process.env.CHATGPT_SERVICE_PORT}/text`;
        } else if (type === "chatgptImage") {
            serviceUrl = `http://localhost:${process.env.CHATGPT_SERVICE_PORT}/image`;
        } else if (content.startsWith("/som")) {
            serviceUrl = `http://localhost:${process.env.SOUND_SERVICE_PORT}`;
        } else if (content.startsWith("/cat")) {
            serviceUrl = `http://localhost:${process.env.CAT_SERVICE_PORT}`;
        } else if (content.startsWith("/fox")) {
            serviceUrl = `http://localhost:${process.env.FOX_SERVICE_PORT}`;
        } else if (content.startsWith("/dog")) {
            serviceUrl = `http://localhost:${process.env.DOG_SERVICE_PORT}`;
        } else if (content.startsWith("/rua")) {
            const addressUrl = constructAddressUrl(content);
            const ruaResponse = await fetchRuasFromService(addressUrl);
            ws.send(
                JSON.stringify({
                    ...message,
                    type: "cepResponse",
                    cep: ruaResponse.cep,
                })
            );
            return;
        } else if (content.startsWith("/cep")) {
            const cepUrl = constructCep(content);
            const cepResponse = await fetchCepFromService(cepUrl);
            ws.send(
                JSON.stringify({
                    ...message,
                    type: "cepResponse",
                    cep: cepResponse.cep,
                })
            );
            return;
        }

        if (serviceUrl) {
            const serviceResponse = await forwardMessage(serviceUrl, message);
            // Enviar a resposta APENAS para o remetente da mensagem
            ws.send(JSON.stringify(serviceResponse)); 
        } else {
            wss.clients.forEach((client) => client.send(data.toString()));
        }
    });

    console.log("client connected");
});
