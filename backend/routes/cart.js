const router = require("express").Router();
const { Cart } = require("../models/cart");
const { Item } = require("../models/items");
const { Order } = require("../models/order");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

router.post("/add-to-cart", async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);

        const { itemID } = req.body;

        let cart = await Cart.findOne({ userID: decoded._id });
        if (!cart) {
            cart = new Cart({ userID: decoded._id, items: [] });
        }

        if (!cart.items.includes(itemID)) {
            cart.items.push(itemID);
        }

        await cart.save();
        res.status(200).send({ message: "Item added to cart successfully" });
    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.post("/remove-from-cart", async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);

        const { itemID } = req.body;

        let cart = await Cart.findOne({ userID: decoded._id });
        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(id => id.toString() !== itemID);

        await cart.save();
        res.status(200).send({ message: "Item removed from cart successfully" });
    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.post("/final-order", async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
let cart = await Cart.findOne({ userID: decoded._id }).populate('items');
if (!cart) {
    return res.status(404).send({ message: "Cart not found" });
}

// Generate a random OTP
const otp = crypto.randomBytes(3).toString('hex');
const hashedOtp = await bcrypt.hash(otp, 10);

// Create orders for each seller
const orders = cart.items.map(item => ({
    buyerID: decoded._id,
    sellerID: item.sellerID,
    items: [{
        itemID: item._id,
        name: item.name,
        price: item.price,
        description: item.description,
        category: item.category
    }],
    otp: hashedOtp
}));

await Order.insertMany(orders);

// Clear the cart
cart.items = [];
await cart.save();

res.status(200).send({ message: "Order placed successfully", otp });
} catch (error) {
console.error("Internal Server Error:", error);
res.status(500).send({ message: "Internal Server Error" });
}
});

router.get("/usercart", async (req, res) => {
    try {
        console.log("Request received");
        const token = req.header('Authorization').replace('Bearer ', '');
        console.log("Token:", token);
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        console.log("Decoded token:", decoded);

        const cart = await Cart.findOne({ userID: decoded._id }).populate({
            path: 'items',
            select: 'name price description category sellerID'
        });
        if (!cart) {
            console.log("Cart not found for user:", decoded._id);
            return res.status(404).send({ message: "Cart not found" });
        }

        console.log("Populated cart items:", cart.items);
        res.status(200).send(cart.items);
    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
// router.get("/buyer-orders", async (req, res) => {
//     try {
//         const token = req.header('Authorization').replace('Bearer ', '');
//         const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);

//         const orders = await Order.find({ buyerID: decoded._id }).populate('items.itemID');
//         res.status(200).send(orders);
//     } catch (error) {
//         console.error("Internal Server Error:", error);
//         res.status(500).send({ message: "Internal Server Error" });
//     }
// });
router.get("/buyer-orders", async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);

        // Fetch buyer orders
        const buyerOrders = await Order.find({ buyerID: decoded._id }).populate('items.itemID');

        // Fetch completed seller orders
        const sellerOrders = await Order.find({ sellerID: decoded._id, status: "Completed" }).populate('items.itemID');

        // Combine both orders
        const allOrders = [...buyerOrders, ...sellerOrders];

        res.status(200).send(allOrders);
    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.get("/seller-orders", async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);

        const orders = await Order.find({ sellerID: decoded._id }).populate('items.itemID');
        res.status(200).send(orders);
    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
router.post("/verify-otp", async (req, res) => {
    try {
        const { orderID, otp } = req.body;

        const order = await Order.findById(orderID);
        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }

        const isMatch = await bcrypt.compare(otp, order.otp);
        if (!isMatch) {
            return res.status(400).send({ message: "Invalid OTP" });
        }

        order.status = "Completed";
        await order.save();

        res.status(200).send({ message: "Transaction successful" });
    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;