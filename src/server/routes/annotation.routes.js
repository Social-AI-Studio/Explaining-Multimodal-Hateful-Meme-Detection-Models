const { authJwt } = require("../middleware");
const controller = require("../controllers/annotation.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/memes/annotations",
    [authJwt.verifyToken],
    controller.getAnnotations
  );

  app.post(
    "/api/memes/annotation",
    [authJwt.verifyToken],
    controller.saveAnnotation
  );
};
