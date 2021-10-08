'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.User, {
        through: "UserStages",
        foreignKey: "StageId",
        otherKey: "UserId"
      });

      this.hasOne(models.Phase);
    }
  };
  Stage.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    totalCount: {
      type: DataTypes.INTEGER
    },
    PhaseId: { // Temporary
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Stage',
  });
  return Stage;
};