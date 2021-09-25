const db = require("../models");
const Annotation = db.Annotation;
const Meme = db.Meme;
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.getAnnotations = (req, res) => {
    Annotation.findAndCountAll({
        where: {
            UserId: req.userId,
            StageId: req.query.stage
        },
        include: [
            {
                model: Meme
            }
        ],
        offset: req.query.offset, 
        limit: req.query.limit,
        order: [
            ['id', 'ASC']
        ]
    }).then(annotations => {
        for (let index = 0; index < annotations.rows.length; index++) {
            const label = annotations.rows[index].dataValues.labels
            if (label == null){
                annotations.rows[index].dataValues.labels = []
            } else {
                annotations.rows[index].dataValues.labels = label.split(',')
            }

            console.log(annotations.rows[index].dataValues.Meme.dataValues.entities)
            annotations.rows[index].dataValues.Meme.dataValues.entities = annotations.rows[index].dataValues.Meme.dataValues.entities.split(',')
            annotations.rows[index].dataValues.Meme.dataValues.automated_labels = annotations.rows[index].dataValues.Meme.dataValues.automated_labels.split(',')
        }

        res.status(200).send(annotations);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

exports.saveAnnotation = (req, res) => {
    Annotation.update({
        labels: req.body.labels,
        components: req.body.components
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