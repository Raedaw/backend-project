exports.handleInvalidPaths = (req, res) => {
  res.status(404).send({ msg: "Route not found" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  //console.log(err + "<<<<<<<<<");
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleInvalidInput = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  }
};

exports.handle500 = (err, req, res, next) => {
  res.sendStatus(500).send({ msg: "Internal Server Error" });
};
