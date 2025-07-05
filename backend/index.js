require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/items"); 
const cartRoutes = require("./routes/cart");
const chatRoute = require('./routes/chat');

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes); 
app.use("/api/cart", cartRoutes); 
app.use('/api/chat', chatRoute);


const port = process.env.PORT || 8081;
app.listen(port, console.log(`Listening on port ${port}...`));
