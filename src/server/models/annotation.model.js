module.exports = (sequelize, Sequelize) => {
  const Annotation = sequelize.define("annotations", {
    labels: {
      type: Sequelize.STRING
    }
  });

  return Annotation;
};
