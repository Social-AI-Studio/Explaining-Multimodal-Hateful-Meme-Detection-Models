const config = require("../config/db.config.js");

const Sequelize = require("sequelize");

// // Configuration for other dialects (e.g. MySQL and etc)
// const sequelize = new Sequelize(
//   config.DB,
//   config.USER,
//   config.PASSWORD,
//   {
//     host: config.HOST,
//     dialect: config.dialect,
//     operatorsAliases: false,

//     pool: {
//       max: config.pool.max,
//       min: config.pool.min,
//       acquire: config.pool.acquire,
//       idle: config.pool.idle
//     }
//   }
// );

// Configuration for SQLite
const sequelize = new Sequelize(
  {
    host: config.HOST,
    dialect: config.dialect,
    storage: config.storage
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Load assocation models
db.annotation = require("./annotation.model.js")(sequelize, Sequelize);

// Load table models
db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.meme = require("./meme.model.js")(sequelize, Sequelize);
db.category = require("./category.model.js")(sequelize, Sequelize);
db.subcategory = require("./subcategory.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

db.annotation.belongsTo(db.meme);
db.annotation.belongsTo(db.user);

db.subcategory.belongsTo(db.category)

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
