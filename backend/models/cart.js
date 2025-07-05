const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true
        }
    ]
});

const Cart = mongoose.model("cart", cartSchema);

module.exports = { Cart };
