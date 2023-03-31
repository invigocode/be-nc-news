exports.invalidRequest = (request, response, next) => {
  response.status(404).send({ msg: "Path not found" });
};

exports.customError = (err, request, response, next) => {
  console.log(err);
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.BadRequest = (err, request, response, next) => {
  if (err.code === "22P02" || "23502") {
    response.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
};

exports.serverError = (err, request, response, next) => {
  response.status(500).send({ msg: "Server Error" });
};
