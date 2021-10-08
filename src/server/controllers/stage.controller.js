const db = require("../models");
const Stage = db.Stage;
const Annotation = db.Annotation;
const User = db.User;

const Op = db.Sequelize.Op;

exports.getStages = async (req, res) => {
    var results = {}
    
    User.findOne({
        where: { id: req.userId }
    }).then(user => {
        return user.getStages()
    }).then(stages => {
        results = stages

        var promises = []
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

exports.getStage = (req, res) => {
    var results = {}
    Stage.findOne({
        where: {
            id: req.query.stage,
        }
    }).then(stage => {
        results = stage

        return Annotation.count({
            where: {
                UserId: req.userId,
                StageId: stage.id,
                labels: {
                    [Op.not]: null
                }
            }
        })
    }).then(count => {
        results.dataValues.currentCount = count;

        res.status(200).send(results);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};