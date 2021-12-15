const db = require("../models");
const Explanation = db.Explanation;
const Meme = db.Meme;

exports.getExplanations = (req, res) => {
    Explanation.findAll({
        where: {
            UserId: req.userId,
            StageId: req.query.stage
        },
        include: [
            { model: Meme }
        ],
        offset: req.query.offset,
        limit: req.query.limit,
        order: [
            ['id', 'ASC']
        ]
    }).then(explanations => {
        for (let index = 0; index < explanations.length; index++) {
            const meme = explanations[index].dataValues.Meme.dataValues
            explanations[index].dataValues.Meme.dataValues.entities = meme.entities.split(',')
            explanations[index].dataValues.Meme.dataValues.final_labels = meme.final_labels.split(',')
        }

        res.status(200).send(explanations);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

exports.saveExplanation = (req, res) => {
    Explanation.update({
        reasoning: req.body.reasoning
    }, {
        where: {
            id: req.body.memeId,
            userId: req.userId
        }
    }).then(result => {
        if (result == 1)
            res.status(200).send({ message: `Explanation ${req.body.memeId} updated` });
        else
            res.status(500).send({ message: `Explanation ${req.body.memeId} not found` });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};