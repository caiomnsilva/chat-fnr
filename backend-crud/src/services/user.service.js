import User from "../models/User.js";

const createService = (body) => User.create(body);

const findAllService = () => User.find();

const findByIdService = (id) => User.findById(id);

const updateService = (
    id,
    name,
    cpf,
    email,
    gender
) =>
    User.findOneAndUpdate(
        { _id: id },
        { name, cpf, email, gender }
    );

const deleteService = (id) => User.findByIdAndDelete(id);

export default {
    createService,
    findAllService,
    findByIdService,
    updateService,
    deleteService
};
