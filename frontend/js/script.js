// login elements
const login = document.querySelector(".login");
const loginForm = login.querySelector(".login__form");
const loginInput = login.querySelector(".login__input");

// chat elements
const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat__form");
const chatInput = chat.querySelector(".chat__input");
const chatMessages = chat.querySelector(".chat__messages");

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold",
];

const user = { id: "", name: "", color: "" };

let websocket;

const soundMap = {
    1: "./sound/1.WAV",
    2: "./sound/2.WAV",
    3: "./sound/3.WAV",
};

const createMessageSelfElement = (content) => {
    const div = document.createElement("div");

    div.classList.add("message--self");
    div.innerHTML = content;

    return div;
};

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div");
    const span = document.createElement("span");

    div.classList.add("message--other");

    span.classList.add("message--sender");
    span.style.color = senderColor;

    div.appendChild(span);

    span.innerHTML = sender;
    div.innerHTML += content;

    return div;
};

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
};

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
    });
};

const playSound = (soundName) => {
    const soundPath = soundMap[soundName];
    if (soundPath) {
        const audio = new Audio(soundPath);
        audio.play();
    } else {
        console.error("Som não encontrado:", soundName);
    }
};

const processMessage = ({ data }) => {
    const { userId, userName, userColor, content } = JSON.parse(data);

    if (content.startsWith("/som ")) {
        const soundName = content.split(" ")[1];
        playSound(soundName);

        const message =
            userId == user.id
                ? createMessageSelfElement(content)
                : createMessageOtherElement(content, userName, userColor);

        chatMessages.appendChild(message);
        scrollScreen();
    } else if (content.startsWith("/cat")) {
        const catURL = content.split(" ")[1];
        const img = document.createElement("img");

        console.log(catURL);

        img.src = catURL;
        img.alt = "Imagem de gato";
        img.style.maxWidth = "100%";

        const message =
            userId == user.id
                ? createMessageSelfElement(img.outerHTML)
                : createMessageOtherElement(img.outerHTML, userName, userColor);

        chatMessages.appendChild(message);
        scrollScreen();
    } else if (content.startsWith("/fox ")) {
        const foxURL = content.split(" ")[1];
        const img = document.createElement("img");
        img.src = foxURL;
        img.alt = "Imagem de raposa";
        img.style.maxWidth = "100%";

        const message =
            userId == user.id
                ? createMessageSelfElement(img.outerHTML)
                : createMessageOtherElement(img.outerHTML, userName, userColor);

        chatMessages.appendChild(message);
        scrollScreen();
    } else if (content.startsWith("/dog ")) {
        const dogURL = content.split(" ")[1];
        const img = document.createElement("img");
        img.src = dogURL;
        img.alt = "Imagem de cachorro";
        img.style.maxWidth = "100%";

        const message =
            userId == user.id
                ? createMessageSelfElement(img.outerHTML)
                : createMessageOtherElement(img.outerHTML, userName, userColor);

        chatMessages.appendChild(message);
        scrollScreen();
    } else {
        const message =
            userId == user.id
                ? createMessageSelfElement(content)
                : createMessageOtherElement(content, userName, userColor);

        chatMessages.appendChild(message);
        scrollScreen();
    }
};

const handleLogin = (event) => {
    event.preventDefault();

    user.id = crypto.randomUUID();
    user.name = loginInput.value;
    user.color = getRandomColor();

    login.style.display = "none";
    chat.style.display = "flex";

    websocket = new WebSocket("ws://localhost:8070");
    websocket.onmessage = processMessage;
};

const sendMessage = (event) => {
    event.preventDefault();

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value,
    };

    websocket.send(JSON.stringify(message));

    chatInput.value = "";
};

loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMessage);
