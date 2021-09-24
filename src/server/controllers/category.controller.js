const db = require("../models");
const Category = db.Category;
const Subcategory = db.Subcategory;

exports.getCategories = (req, res) => {
    var searchOpts = {
        include: [Category]
    }

    if (req.query.category != 'All') {
        searchOpts['where'] = {
            '$Category.name$': req.query.category
        }
    }

    Subcategory.findAll(searchOpts).then(results => {
        var categories = []
        results.forEach(element => {
            categories.push(`[${element.Category.name}] ${element.name}`)
        });

        // Filter categories
        var categories = categories.filter(opt => opt.toLowerCase().indexOf(req.query.search) > -1);

        res.status(200).send(categories);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

exports.createCategory = (req, res) => {
    Category.findOne({
        where: {
            name: req.body.category
        }
    }).then(category => {
        return Subcategory.create({
            CategoryId: category.id,
            name: req.body.subcategory
        })
    }).then(_ => {
        res.status(200).send({ "message": "Category saved" })
    }).catch(err => {
        res.status(500).send({ message: err.message });
    })
};