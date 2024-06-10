import userService from "../services/user.service.js";


const create = async (req, res) => {
    try {
        const { name, cpf, email, gender } = req.body;

        const user = await userService.createService(req.body);

        if (!user) {
            return res.status(400).send({ message: "Error creating user!" });
        }

        res.status(201).send({
            message: "User created successfully!",
            user: {
                id: user._id,
                name,
                cpf,
                email,
                gender,
            },
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const findAll = async (req, res) => {
    try {
        const users = await userService.findAllService();

        if (users.length === 0) {
            return res
                .status(400)
                .send({ message: "There are no registred users" });
        }

        res.send(users);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const findById = async (req, res) => {
    try {
        const user = await userService.findByIdService(
            req.params.id,
            req.userId
        );
        return res.send(user);
    } catch (e) {
        return res.status(400).send(e.message);
    }
};

const update = async (req, res) => {
    const { name, cpf, email, gender } = req.body;

    const { id, user } = req;

    await userService.updateService(id, name, cpf, email, gender);

    res.send({ message: "User successfully updated!" });
};

const deleteById = async (req, res) => {
    try {
        const user = await userService.deleteService(req.params.id, req.userId);
        return res.send(user);
    } catch (e) {
        return res.status(400).send(e.message);
    }
};

export default {
    create,
    findAll,
    findById,
    update,
    deleteById,
};
