'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Annotation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User);
      this.belongsTo(models.Meme);
    }
  };
  Annotation.init({
    labels: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    components: {
      type: DataTypes.STRING,
      defaultValue: null,
    }
  }, {
    sequelize,
    modelName: 'Annotation',
  });
  return Annotation;
};