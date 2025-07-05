const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    buyerID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sellerID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            itemID: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            description: { type: String, required: true },
            category: { type: String, required: true }
        }
    ],
    otp: { type: String, required: true },
    status: { type: String, default: 'Pending' }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order };