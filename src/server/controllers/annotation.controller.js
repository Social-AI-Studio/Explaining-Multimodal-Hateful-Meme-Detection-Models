const db = require("../models");
const Annotation = db.Annotation;
const Meme = db.Meme;
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.getAnnotations = (req, res) => {
    var results = {}
    Annotation.findAndCountAll({
        where: {
            userId: req.userId,
        },
        include: [
            {
                model: Meme
            }
        ],
        offset: req.query.offset, limit: req.query.limit,
        order: [
            ['id', 'ASC']
        ]
    }).then(annotations => {
        results = annotations

        var memeIds = []
        results.rows.forEach(element => {
            memeIds.push(element.memeId)
        });

        return Annotation.findAll({
            where: {
                userId: 1,
                memeId: memeIds
            }
        })
    }).then(annotations => {
        for (let index = 0; index < annotations.length; index++) {
            results.rows[index].dataValues.labels = results.rows[index].dataValues.labels.split(",");
            results.rows[index].dataValues.computer_labels = annotations[index].labels.split(",");
        }

        res.status(200).send(results);
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