const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const userSchema= new mongoose.Schema({
    firstName: {type: String, required:true},
    lastName: {type: String, required:true},
    email: {type: String, required:true},
    age: {type: Number, required:true},
    contactNumber: {type: String, required:true},
    password: {type:String, required:true},
    reviews: {type:[String], default: []} // Array of strings for reviews
});
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id, firstName: this.firstName, lastName: this.lastName, email: this.email, 
            age: this.age, contactNumber: this.contactNumber },
        process.env.JWTPRIVATEKEY,
        // { expiresIn: "7d" }
    );
	return token;
};
const User= mongoose.model("user", userSchema);

const validate=(data)=> {
    const schema= Joi.object({
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        email: Joi.string()
        .required()
        .label("Email")
        .pattern(/^[a-zA-Z0-9._%+-]+@(iiit\.ac\.in|students\.iiit\.ac\.in|research\.iiit\.ac\.in)$/, { name: "IIIT email" })
        .messages({ "string.pattern.name": "Only IIIT emails are allowed" }),        
        age: Joi.number().integer().min(0).required().label("Age"), // Changed to `Joi.number()` and ensured it's an integer
        contactNumber: Joi.string().length(10).pattern(/^[0-9]+$/).required().label("Contact Number"), // Added pattern for numeric validation
        password: passwordComplexity().required().label("Password"),
    });
    return schema.validate (data)
};
const validateProfileUpdate = (data) => {
    const schema = Joi.object({
        userId: Joi.string().required().label("User ID"),
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        email: Joi.string()
            .required()
            .label("Email")
            .pattern(/^[a-zA-Z0-9._%+-]+@(iiit\.ac\.in|students\.iiit\.ac\.in|research\.iiit\.ac\.in)$/, { name: "IIIT email" })
            .messages({ "string.pattern.name": "Only IIIT emails are allowed" }),
        age: Joi.number().integer().min(0).required().label("Age"),
        contactNumber: Joi.string().length(10).pattern(/^[0-9]+$/).required().label("Contact Number"),
    });
    return schema.validate(data);
};
module.exports = { User, validate, validateProfileUpdate };