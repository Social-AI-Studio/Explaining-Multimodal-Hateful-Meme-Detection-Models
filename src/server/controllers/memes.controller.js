exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
};


exports.getMemes = (req, res) => {
    res.status(200).send();
};

import memes from '../dataset/hateful_seen.json'
var memes

function getMemes(cb) {
    // setTimeout(() => {
    //     cb(null, [memes[1268], memes[1487], memes[1579], memes[2158], memes[98235], memes[98547]])
    // }, 100)

    setTimeout(() => {
        cb(null, [1395, 1487, 1497, 1579, 2158, 2351, 2435, 2457, 2653, 2719])
    }, 100)
}

function getMeme(id, cb) {
    setTimeout(() => {
        if (memes[id]) {
            cb(null, memes[id])
        } else {
            cb(new Error('Post not found.'))
        }
    }, 100)
}

function getTags(cb) {
    // tags = {
    //     "Gender": ['Male', 'Female', 'LGBT'],
    //     "Race": ['Black', 'White']
    // }

    cb(['Male', 'Female', 'LGBT'])
}

export { getMeme, getMemes, getTags }