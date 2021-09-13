

function init_roles(Role) {
	Role.create({
		id: 1,
		name: "user"
	});

	Role.create({
		id: 2,
		name: "moderator"
	});

	Role.create({
		id: 3,
		name: "admin"
	});
}

function init_users(User) {
	var bcrypt = require("bcryptjs");

	User.create({
		username: "urop_jaslyn",
		email: "tempholder",
		password: bcrypt.hashSync("temppassword", 8)
	}).then(user => {
		// user role = 1
		user.setRoles([1]).then(() => {
			console.log("User 1 created")
		});
	})
	User.create({
		username: "urop_gargi",
		email: "tempholder",
		password: bcrypt.hashSync("temppassword", 8)
	}).then(user => {
		// user role = 1
		user.setRoles([1]).then(() => {
			console.log("User 2 created")
		});
	})
}

