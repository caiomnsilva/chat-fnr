import News from "../models/News.js";

const createService = (body) => News.create(body);

const findAllService = () => News.find();

const deleteByIdService = (id) => News.findByIdAndDelete(id);

export { createService, findAllService, deleteByIdService };
