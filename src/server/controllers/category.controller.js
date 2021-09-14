const db = require("../models");
const Category = db.category;
const Subcategory = db.subcategory;

exports.getCategories = (req, res) => {
    Category.findAll({ include: [Subcategory] }).then(results => {
        var categories = []
        results.forEach(element => {
            categories.push(`[${element.name}] ${element.subcategory.name}`)
        });

        // Filter categories
        var categories = categories.filter(opt => opt.toLowerCase().indexOf(req.query.search) > -1);

        res.status(200).send(categories);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

exports.createCategory = (req, res) => {
    Category.create({
        name: req.body.category
    }).then(category => {
        return Subcategory.create({
            categoryId: category.id,
            name: req.body.subcategory
        })
    }).then(category => {
        res.status(200).send({"message": "Category saved"})
    }).catch(err => {
        res.status(500).send({ message: err.message });
    })
};