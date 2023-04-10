exports.invalidRequest = (request, response, next) => {
  response.status(404).send({ msg: "Path not found" });
};

exports.customError = (err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.badRequest = (err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23503") {
    response.status(404).send({ msg: "404 not found" });
  } else next(err);
};

exports.serverError = (err, request, response, next) => {
  response.status(500).send({ msg: "Server Error" });
};
