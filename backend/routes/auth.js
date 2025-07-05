const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const Joi = require("joi");

router.post("/", async (req, res) => {
    const { email, password, recaptchaToken } = req.body;

    // Verify reCAPTCHA
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
        console.error("reCAPTCHA secret key is not defined");
        return res.status(500).send({ message: "reCAPTCHA secret key is not defined" });
    }

	const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify';
	try {
		const recaptchaResponse = await axios.post(verificationUrl, null, {
			params: {
				secret: secretKey,
				response: recaptchaToken
			}
		});
		
		console.log('Full verification response:', recaptchaResponse.data);
		if (recaptchaResponse.data['error-codes']?.includes('timeout-or-duplicate')) {
			return res.status(400).send({ message: "reCAPTCHA token expired" });
		}

        // Validate the email and password fields
        const { error } = validate({ email, password });
        if (error) {
            console.error("Validation Error:", error.details[0].message);
            return res.status(400).send({ message: error.details[0].message });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.error("Invalid Email or Password");
            return res.status(401).send({ message: "Invalid Email or Password" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            console.error("Invalid Email or Password");
            return res.status(401).send({ message: "Invalid Email or Password" });
        }

        const token = user.generateAuthToken();
        res.status(200).send({ data: token, message: "Logged in successfully" });
    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
};

module.exports = router;