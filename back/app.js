const cors = require("cors");
require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const userRoutes = require("./routes/users_routes");
const entreprisesRoutes = require("./routes/entreprises_routes");
const enrichmentsRoutes = require('./routes/enrichments_routes');
const quotasRoutes = require("./routes/quotas_routes");
const path = require('path');

app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin: `http://localhost:3000`,
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
}));


app.use("/api/welcome", (req, res, next) => {
    res.status(200).json({ msg: "Les cors marchent ! " });
});

app.use("/api/auth", userRoutes);
app.use('/api/entreprises', entreprisesRoutes);
app.use('/api/enrichments', enrichmentsRoutes);
app.use('/api/quotas', quotasRoutes);
app.use("/api/images/avatars", express.static(path.join(__dirname, "uploads/pictures/avatars")));


module.exports = app;