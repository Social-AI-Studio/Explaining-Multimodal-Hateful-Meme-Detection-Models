const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
	origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./models");
const User = db.user;
const Role = db.role;

// force: true will drop the table if it already exists
const {init_users, init_roles} = require("./init.js")
db.sequelize.sync({ force: true }).then(() => {
	console.log('Drop and Resync Database with { force: true }');
	init_roles(Role);
	init_users(User);
});

// db.sequelize.sync();

// simple route
app.get("/", (req, res) => {
	res.json({ message: "Welcome to bezkoder application." });
});

// routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

// set port, listen for requests
const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 8000

app.listen(PORT, HOST, () => {
	console.log(`Server is running on port ${PORT}.`);
});