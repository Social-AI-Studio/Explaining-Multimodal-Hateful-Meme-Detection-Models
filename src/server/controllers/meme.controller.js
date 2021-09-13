const db = require("../models");
const Annotation = db.annotation;
const Meme = db.meme;
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.getMemes = (req, res) => {
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
        var test = []
        for (let index = 0; index < annotations.length; index++) {
            results[index].dataValues.computer_labels = annotations[index].label;
            test.push(annotations[index].label)
        }

        res.status(200).send(results);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};