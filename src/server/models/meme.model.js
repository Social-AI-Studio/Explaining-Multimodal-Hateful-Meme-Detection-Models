'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Meme extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Meme.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    image: DataTypes.STRING,
    text: DataTypes.STRING,
    gold_pc: DataTypes.STRING,
    best_guess_labels: DataTypes.STRING,
    entities: DataTypes.STRING,
    gender: DataTypes.STRING,
    race: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Meme',
  });
  return Meme;
};