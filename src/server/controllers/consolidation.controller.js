const db = require("../models");
const Annotation = db.Annotation;
const Meme = db.Meme;
const Op = db.Sequelize.Op;

exports.getConsolidations = (req, res) => {
    var results = []
    Annotation.findAll({
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
    }).then(annotations => {
        var promises = []
        for (let index = 0; index < annotations.length; index++) {
            const element = annotations[index]
            const label = element.dataValues.labels
            const meme = element.dataValues.Meme.dataValues

            element.dataValues.Meme.dataValues.entities = meme.entities.split(',')

            if (label == null) {
                element.dataValues.labels = []
            } else {
                element.dataValues.labels = label.split(',')
            }

            // Get the (initial) annotations labels
            promises.push(Annotation.findAll({
                where: {
                    MemeId: meme.id,
                    UserId: {
                        [Op.in]: [2,3,4,5]
                    },
                    StageId: {
                        [Op.ne]: element.dataValues.StageId
                    }
                }
            }))
        }

        results = annotations
        
        return Promise.all(promises)
    }).then(annotations => {
        for (let index = 0; index < annotations.length; index++) {
            var elements = annotations[index];
            elements = elements.sort(() => Math.random() - 0.5);

            var prelabels = []
            for (let index = 0; index < elements.length; index++) {
                const el = elements[index];
                const label = el.dataValues.labels
                
                prelabels.push(label.split(','))
            }

            results[index].dataValues.prelabels = prelabels
        }

        res.status(200).send(results);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};