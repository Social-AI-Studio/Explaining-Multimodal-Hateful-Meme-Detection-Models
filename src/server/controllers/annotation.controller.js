const db = require("../models");
const Annotation = db.annotation;
const Meme = db.meme;
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.getAnnotations = (req, res) => {
    var results = {}
    Annotation.findAll({
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
        results.forEach(element => {
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
            results[index].dataValues.labels = results[index].dataValues.labels.split(",");
            results[index].dataValues.computer_labels = annotations[index].labels.split(",");
        }

        console.log(results[0])

        res.status(200).send(results);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

exports.saveAnnotation = (req, res) => {
    Annotation.update({ labels: req.body.labels}, {
        where: {
            id: req.body.memeId,
            userId: req.userId
        }
    }).then(result => {
        if (result == 1)
            res.status(200).send({ message: `Annotation ${req.body.memeId} updated`});
        else
            res.status(500).send({ message: `Annotation ${req.body.memeId} not found` });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};