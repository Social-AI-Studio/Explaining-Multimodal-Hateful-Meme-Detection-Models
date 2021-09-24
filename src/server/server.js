const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
	origin: [
		"http://localhost:8000",
		"http://174.138.21.176:8000"
	]
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

db.sequelize.sync();

// simple route
app.get("/", (req, res) => {
	res.json({ message: "Welcome to bezkoder application." });
});

// routes
require('./routes/auth.routes')(app);
require('./routes/annotation.routes')(app);
require('./routes/category.routes')(app);
require('./routes/stage.routes')(app);

app.use('/img', express.static(__dirname + '/dataset/img'))

// set port, listen for requests
const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 8001

app.listen(PORT, HOST, () => {
	console.log(`Server is running on port ${PORT}.`);
});