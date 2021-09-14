module.exports = (sequelize, Sequelize) => {
    const Subcategory = sequelize.define("subcategory", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            unique: true
        }
    });

    return Subcategory;
};
