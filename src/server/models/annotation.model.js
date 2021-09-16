module.exports = (sequelize, Sequelize) => {
  const Annotation = sequelize.define("annotations", {
    labels: {
      type: Sequelize.STRING
    },
    components: {
      type: Sequelize.STRING,
      defaultValue: null
    }
  });

  return Annotation;
};
