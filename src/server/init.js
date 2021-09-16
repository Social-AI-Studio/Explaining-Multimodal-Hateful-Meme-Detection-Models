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
		username: "mshee",
		password: bcrypt.hashSync("temppassword", 8)
	}).then(user => {
		// user role = 1
		user.setRoles([3]).then(() => {
			console.log("User 1 created")
		});
	})

	User.create({
		username: "urop_jaslyn",
		password: bcrypt.hashSync("temppassword", 8)
	}).then(user => {
		// user role = 1
		user.setRoles([1]).then(() => {
			console.log("User 1 created")
		});
	})

	User.create({
		username: "urop_gargi",
		password: bcrypt.hashSync("temppassword", 8)
	}).then(user => {
		// user role = 1
		user.setRoles([1]).then(() => {
			console.log("User 2 created")
		});
	})
}

function init_memes(user, Meme, Annotation) {
	const data = require('./dataset/hateful_seen.json')

	var temp = 0;
	for (const [key, value] of Object.entries(data)) {
		Meme.create({
			id: key,
			image: value['img'],
			text: value['text'],
			gold_hate: value['gold_hate'],
			gold_pc: value['gold_pc'].join(),
			gold_attack: value['gold_attack'].join(),
			best_guess_labels: value['best_guess_labels'],
			entities: value['entities'].join(),
			gender: value['gender'].join(),
			race: value['race'].join(),
		});

		Annotation.create({
			userId: user.id,
			memeId: key,
			labels: value['manual_label'].join()
		})

		temp += 1
		if (temp == 10)
			break
	}
}

function init_annotations(user, Annotation) {
	const data = require('./dataset/hateful_seen.json')

	var temp = 0;
	for (const [key, value] of Object.entries(data)) {
		Annotation.create({
			userId: user.id,
			memeId: key,
			labels: value['manual_label'].join()
		});

		temp += 1
		if (temp == 10)
			break
	}
}

async function init_category(Category, Subcategory) {
	var categories = {
		"Gender": ["Male", "Female", "LGBT"],
		"Race": ["Black", "White", "Middle East", "Hispanic/Latino", "American Indian", "Asia"],
		"Religion": ["Muslim", "Jew", "Catholic Christian", "Christian"],
		"Nationality": ["Mexican"],
		"Disability": ["Down Syndrome", "Intellectual Disability"]
	}

	for (const [key, valueList] of Object.entries(categories)) {
		Category.create({
			name: key
		}).then(category => {
			valueList.forEach(element => {
				Subcategory.create({
					categoryId: category.id,
					name: element
				})
			});
		})
	}

}

const { user } = require("./models");
// database
const db = require("./models");
const User = db.user;
const Role = db.role;
const Meme = db.meme;
const Annotation = db.annotation;

const Category = db.category;
const Subcategory = db.subcategory;

// force: true will drop the table if it already exists
// const {init_users, init_roles} = require("./init.js")
db.sequelize.sync({ force: true }).then(() => {
	console.log('Drop and Resync Database with { force: true }');
	init_roles(Role);
	init_users(User);

	User.findOne({ where: { username: 'mshee' } }).then(user => {
		init_memes(user, Meme, Annotation);
	})

	User.findOne({ where: { username: 'urop_jaslyn' } }).then(user => {
		init_annotations(user, Annotation);
	})

	User.findOne({ where: { username: 'urop_gargi' } }).then(user => {
		init_annotations(user, Annotation);
	})

	init_category(Category, Subcategory)
});


// module.exports = {init_users, init_roles, init_memes}