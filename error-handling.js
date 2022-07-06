exports.handleInvalidPaths = (req, res) => {
  res.status(404).send({ msg: "Route not found" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: `article ID does not exist` });
  } else {
    next(err);
  }
};

exports.handleInvalidInput = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Invalid input" });
  }
};

exports.handle500 = (err, req, res, next) => {
  res.sendStatus(500).send({ msg: "Internal Server Error" });
};
