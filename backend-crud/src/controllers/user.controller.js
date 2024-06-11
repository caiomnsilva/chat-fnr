import userService from "../services/user.service.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - cpf
 *         - email
 *         - gender
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The user's name
 *         cpf:
 *           type: string
 *           description: The user's CPF
 *         email:
 *           type: string
 *           description: The user's email
 *         gender:
 *           type: string
 *           description: The user's gender
 *       example:
 *         name: John Doe
 *         cpf: 12345678900
 *         email: john.doe@example.com
 *         gender: male
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 */

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing fields or error in user creation
 *       500:
 *         description: Some server error
 */

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

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: No registered users found
 *       500:
 *         description: Some server error
 */

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

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: User not found
 *       500:
 *         description: Some server error
 */

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

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update the user by the id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: User not found or error in update
 *       500:
 *         description: Some server error
 */

const update = async (req, res) => {
    const { name, cpf, email, gender } = req.body;

    const { id, user } = req;

    await userService.updateService(id, name, cpf, email, gender);

    res.send({ message: "User successfully updated!" });
};

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Remove the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user was deleted
 *       400:
 *         description: User not found or error in deletion
 *       500:
 *         description: Some server error
 */

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
