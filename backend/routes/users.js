const router = require("express").Router();
const { User, validate, validateProfileUpdate } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Ensure jwt is imported

router.get("/reviews/:userID", async (req, res) => {
    try {
        const user = await User.findById(req.params.userID);
        if (!user) return res.status(404).send({ message: "User not found" });

        res.status(200).send(user.reviews);
    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.put("/update-profile", async (req, res) => {
    try {
        console.log("Request body:", req.body);
        const { error } = validateProfileUpdate(req.body);
        if (error) {
            console.error("Validation Error:", error.details[0].message);
            return res.status(400).send({ message: error.details[0].message });
        }

        console.log("Validation passed");
        const user = await User.findById(req.body.userId);
        if (!user) {
            console.error("User not found");
            return res.status(404).send({ message: "User not found" });
        }

        console.log("User found:", user);
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.email = req.body.email;
        user.age = req.body.age;
        user.contactNumber = req.body.contactNumber;

        await user.save();
        console.log("User updated:", user);

        const token = jwt.sign(
            { _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, age: user.age, contactNumber: user.contactNumber },
            process.env.JWTPRIVATEKEY
        );
        res.status(200).send({ data: token, message: "Profile updated successfully" });
    } catch (error) {
        console.error("Internal Server Error:", error);
		res.status(500).send({ message: "Internal Server Error" });
    }
});
router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error) {
			console.error("Validation Error:", error.details[0].message);
			return res.status(400).send({ message: error.details[0].message });
		}

		const user = await User.findOne({ email: req.body.email });
		if (user) {
			console.error("User Exists Error: User with given email already exists!");
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });
		}

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		await new User({ ...req.body, password: hashPassword }).save();
		res.status(201).send({ message: "User created successfully" });
	} catch (error) {
		console.error("Internal Server Error:", error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});
router.post("/add-review", async (req, res) => {
    try {
        const { sellerID, review } = req.body;
		console.log ("review: ", review);
        const user = await User.findById(sellerID);
        if (!user) return res.status(404).send({ message: "User not found" });

        user.reviews.push(review);
        await user.save();

        res.status(200).send({ message: "Review added successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.get("/reviews/:userID", async (req, res) => {
    try {
        const user = await User.findById(req.params.userID);
        if (!user) return res.status(404).send({ message: "User not found" });

        res.status(200).send(user.reviews);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});
module.exports = router;
