const button = document.querySelector(".showmodal");
const modal = document.querySelector("dialog");

const inputName = document.querySelector("#name");
const inputCpf = document.querySelector("#cpf");
const inputEmail = document.querySelector("#email");
const inputGender = document.querySelector("#gender");

const formButton = document.querySelector("#open-form");
const dataTable = document.querySelector("table");
const addForm = document.querySelector(".add-form");

const addUser = document.querySelector(".send-form");

button.onclick = function () {
    modal.showModal();
};

const fetchUsers = async () => {
    try {
        const response = await fetch("http://localhost:3000/user");
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const users = await response.json();
        return users;
    } catch (error) {
        console.error("Failed to fetch users:", error);
        alert("Failed to fetch users.");
    }
};

const createUser = async (event) => {
    event.preventDefault();

    const user = {
        name: inputName.value,
        cpf: inputCpf.value,
        email: inputEmail.value,
        gender: inputGender.value,
    };

    if (!validateInputs(user)) {
        alert("Todos os campos devem ser preenchidos.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/user", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json")!== -1) {
                const errorData = await response.json();
                const errorMessage = errorData.message || `Error: ${response.status}`;
                throw new Error(errorMessage);
            } else {
                const errorMessage = `Error: ${response.status} ${await response.text()}`;
                throw new Error(errorMessage);
            }
        }

        monteTabela();
        inputName.value = "";
        inputCpf.value = "";
        inputEmail.value = "";
        inputGender.value = "";
    } catch (error) {
        console.error("Failed to create user:", error);
        alert(error.message);
    }
};

const deleteUser = async (id) => {
    try {
        const response = await fetch(`http://localhost:3000/user/${id}`, {
            method: "delete",
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        monteTabela();
    } catch (error) {
        console.error("Failed to delete user:", error);
        alert("Failed to delete user.");
    }
};

const updateUser = async ({ id, name, cpf, email, gender }) => {
    if (!validateInputs({ name, cpf, email, gender })) {
        alert("Todos os campos devem ser preenchidos.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/user/${id}`, {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, cpf, email, gender }),
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json")!== -1) {
                const errorData = await response.json();
                const errorMessage = errorData.message || `Error: ${response.status}`;
                throw new Error(errorMessage);
            } else {
                const errorMessage = `Error: ${response.status} ${await response.text()}`;
                throw new Error(errorMessage);
            }
        }

        handleTable();
        monteTabela();
    } catch (error) {
        console.error("Failed to update user:", error);
        alert(error.message);
    }
};

const validateInputs = ({ name, cpf, email, gender }) => {
    return (
        name.trim() !== "" &&
        cpf.trim() !== "" &&
        email.trim() !== "" &&
        gender.trim() !== ""
    );
};

const createElement = (tag, innerText = "", innerHTML = "") => {
    const element = document.createElement(tag);
    if (innerText) {
        element.innerText = innerText;
    }
    if (innerHTML) {
        element.innerHTML = innerHTML;
    }
    return element;
};

const createRow = (user) => {
    const { _id, name, cpf, email, gender } = user;

    const tr = createElement("tr");
    const tdName = createElement("td", name);
    const tdCpf = createElement("td", cpf);
    const tdEmail = createElement("td", email);
    const tdGender = createElement("td", gender);
    const tdActions = createElement("td");

    const editButton = createElement(
        "button",
        "",
        '<span class="material-symbols-outlined">edit</span>'
    );
    const deleteButton = createElement(
        "button",
        "",
        '<span class="material-symbols-outlined">delete</span>'
    );

    editButton.classList.add("btn-action");
    deleteButton.classList.add("btn-action");

    deleteButton.addEventListener("click", () => deleteUser(_id));

    editButton.addEventListener("click", () => {
        tdName.innerHTML = "";
        tdCpf.innerHTML = "";
        tdEmail.innerHTML = "";
        tdGender.innerHTML = "";

        const editForm = createElement("form");
        const editInputName = createElement("input");
        const editInputCpf = createElement("input");
        const editInputEmail = createElement("input");
        const editInputGender = createElement("input");

        editInputName.value = name;
        editInputCpf.value = cpf;
        editInputEmail.value = email;
        editInputGender.value = gender;

        editForm.appendChild(editInputName);
        editForm.appendChild(editInputCpf);
        editForm.appendChild(editInputEmail);
        editForm.appendChild(editInputGender);

        const saveButton = createElement(
            "button",
            "",
            `<span class="material-symbols-outlined">publish</span>`
        );

        saveButton.classList.add("btn-action");

        saveButton.type = "submit";
        saveButton.addEventListener("click", async (event) => {
            event.preventDefault();
            await updateUser({
                id: _id,
                name: editInputName.value,
                cpf: editInputCpf.value,
                email: editInputEmail.value,
                gender: editInputGender.value,
            });
            monteTabela();
        });

        editForm.appendChild(saveButton);

        tdName.appendChild(editInputName);
        tdCpf.appendChild(editInputCpf);
        tdEmail.appendChild(editInputEmail);
        tdGender.appendChild(editInputGender);
        tdActions.appendChild(saveButton);
    });

    tdActions.appendChild(editButton);
    tdActions.appendChild(deleteButton);

    tr.appendChild(tdName);
    tr.appendChild(tdCpf);
    tr.appendChild(tdEmail);
    tr.appendChild(tdGender);
    tr.appendChild(tdActions);

    return tr;
};

const monteTabela = async () => {
    const users = await fetchUsers();
    if (!users) return;
    const tbody = document.querySelector("#tabel");
    tbody.innerHTML = "";

    users.forEach((user) => {
        const tr = createRow(user);
        tbody.appendChild(tr);
    });
};

addForm.addEventListener("submit", createUser);

const handleForm = () => {
    formButton.style.visibility = "collapse";
    dataTable.style.visibility = "collapse";
    addForm.style.visibility = "visible";
};
const handleTable = () => {
    formButton.style.visibility = "visible";
    dataTable.style.visibility = "visible";
    addForm.style.visibility = "collapse";
};

monteTabela();


document.addEventListener('DOMContentLoaded', function() {
    var cpfInput = document.getElementById('cpf');

    cpfInput.addEventListener('input', cpfMask);
    cpfInput.addEventListener('keyup', cpfMask);

    function cpfMask(event) {
        var value = event.target.value;
        var maskedValue = '';

        value = value.replace(/\D/g, '');

        if (value.length <= 3) {
            maskedValue += value;
        } else if (value.length === 4) {
            maskedValue += value.slice(0, 1) + '.' + value.slice(1);
        } else if (value.length >= 5 && value.length <= 7) {
            maskedValue += value.slice(0, 3) + '.' + value.slice(3);
        } else if (value.length >= 8 && value.length <= 10) {
            maskedValue += value.slice(0, 3) + '.' + value.slice(3, 6) + '.' + value.slice(6);
        } else if (value.length === 11) {
            maskedValue += value.slice(0, 3) + '.' + value.slice(3, 6) + '.' + value.slice(6, 9) + '-' + value.slice(9);
        }

        event.target.value = maskedValue;
    }
});