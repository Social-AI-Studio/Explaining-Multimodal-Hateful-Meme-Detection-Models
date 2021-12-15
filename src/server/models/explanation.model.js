'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Explanation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User);
      this.belongsTo(models.Meme);
      this.belongsTo(models.Stage);
    }
  };
  Explanation.init({
    reasoning: {
      type: DataTypes.STRING,
      defaultValue: null,
    }
  }, {
    sequelize,
    modelName: 'Explanation',
  });
  return Explanation;
};