const mongoose = require("mongoose");
const Joi = require("joi");

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    sellerID: { type: String, required: true },
});

const Item = mongoose.model("Item", itemSchema);

const validateItem = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().label("Name"),
        price: Joi.number().required().label("Price"),
        description: Joi.string().required().label("Description"),
        category: Joi.string().required().label("Category"),
        sellerID: Joi.string().required().label("Seller ID"),
    });
    return schema.validate(data);
};

module.exports = { Item, validateItem };