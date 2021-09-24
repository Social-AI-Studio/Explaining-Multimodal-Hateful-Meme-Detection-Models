const db = require("../models");
const Stage = db.Stage;
const Annotation = db.Annotation;

const Op = db.Sequelize.Op;

exports.getStages = (req, res) => {
    var results = {}
    Stage.findAll().then(stages => {
        results = stages

        var promises = []
        // console.log(results)
        results.forEach(element => {
            promises.push(Annotation.count({
                where: {
                    UserId: req.userId,
                    StageId: element.id,
                    labels: {
                        [Op.not]: null
                    }
                }
            }))
        });

        return Promise.all(promises)
    }).then(counts => {
        for (let index = 0; index < counts.length; index++) {
            results[index].dataValues.currentCount = counts[index];
        }

        res.status(200).send(results);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};