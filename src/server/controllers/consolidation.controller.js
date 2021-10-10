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
        for (let aidx = 0; aidx < annotations.length; aidx++) {
            var elements = annotations[aidx];
            elements = elements.sort(() => Math.random() - 0.5);

            var prelabels = []
            for (let eidx = 0; eidx < elements.length; eidx++) {
                const el = elements[eidx];
                const label = el.dataValues.labels
                
                if (el.dataValues.UserId == req.userId) {
                    if (results[aidx].dataValues.labels.length == 0) {
                        results[aidx].dataValues.labels = label.split(',')
                    }
                } else {
                    prelabels.push(label.split(','))
                }
            }

            results[aidx].dataValues.prelabels = prelabels
        }

        res.status(200).send(results);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

exports.saveConsolidation = (req, res) => {
    Annotation.update({
        labels: req.body.labels,
        remarks: req.body.remarks
    }, {
        where: {
            id: req.body.memeId,
            userId: req.userId
        }
    }).then(result => {
        if (result == 1)
            res.status(200).send({ message: `Annotation ${req.body.memeId} updated` });
        else
            res.status(500).send({ message: `Annotation ${req.body.memeId} not found` });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};