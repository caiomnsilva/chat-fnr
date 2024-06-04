import userService from "../services/user.service.js";

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               avatar:
 *                 type: string
 *               background:
 *                 type: string
 *             required:
 *               - name
 *               - username
 *               - email
 *               - password
 *               - avatar
 *               - background
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully!
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                     background:
 *                       type: string
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
const create = async (req, res) => {
    try {
        const { name, username, email, password, avatar, background } =
            req.body;

        if (
            !name ||
            !username ||
            !email ||
            !password ||
            !avatar ||
            !background
        ) {
            res.status(400).json({
                message: "Submit all fields for registration",
            });
        }

        const user = await userService.createService(req.body);

        if (!user) {
            return res.status(400).send({ message: "Error creating user!" });
        }

        res.status(201).send({
            message: "User created successfully!",
            user: {
                id: user._id,
                name,
                username,
                email,
                avatar,
                background,
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
    try {
        const { name, username, email, password, avatar, background } =
            req.body;

        if (
            !name &&
            !username &&
            !email &&
            !password &&
            !avatar &&
            !background
        ) {
            res.status(400).json({
                message: "Submit at last one field for update!",
            });
        }

        const { id, user } = req;

        await userService.updateService(
            id,
            name,
            username,
            email,
            password,
            avatar,
            background
        );

        res.send({ message: "User successfully updated!" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export default {
    create,
    findAll,
    findById,
    update,
};
