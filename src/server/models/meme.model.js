module.exports = (sequelize, Sequelize) => {
  const Meme = sequelize.define("memes", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    image: {
      type: Sequelize.STRING
    },
    text: {
      type: Sequelize.STRING
    },
    gold_pc: {
      type: Sequelize.STRING
    },
    best_guess_labels: {
      type: Sequelize.STRING
    },
    entities: {
      type: Sequelize.STRING
    },
    gender: {
      type: Sequelize.STRING
    },
    race: {
      type: Sequelize.STRING
    }
  });

  return Meme;
};
