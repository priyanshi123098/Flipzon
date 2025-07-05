const router = require("express").Router();
const { Item, validateItem } = require("../models/items");
const jwt = require("jsonwebtoken");

router.post("/add", async (req, res) => {
    try {
        console.log("Request received:", req.body);
        const token = req.header('Authorization').replace('Bearer ', '');
        console.log("Token:", token);
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        console.log("Decoded token:", decoded);

        const { error } = validateItem(req.body);
        if (error) {
            console.error("Validation Error:", error.details[0].message);
            return res.status(400).send({ message: error.details[0].message });
        }

        const item = new Item({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            category: req.body.category,
            sellerID: decoded._id, // Set sellerID from decoded token
        });

        await item.save();
        res.status(201).send({ message: "Item added successfully" });
    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.get("/", async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).send(items);
    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).send({ message: "Item not found" });
        }
        res.status(200).send(item);
    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
module.exports = router;