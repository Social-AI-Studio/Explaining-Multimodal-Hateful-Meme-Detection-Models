const { authJwt } = require("../middleware");
const controller = require("../controllers/explanation.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/memes/explanations",
    [authJwt.verifyToken],
    controller.getExplanations
  );

  app.post(
    "/api/memes/explanation",
    [authJwt.verifyToken],
    controller.saveExplanation
  );
};
