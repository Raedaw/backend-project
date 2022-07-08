exports.handleInvalidPaths = (req, res) => {
  res.status(404).send({ msg: "Route not found" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  //console.log(err);
  // if (err.msg === `article_id does not exist` && err.code === "22P02") {
  //   res.status(400).send({ msg: "Invalid article ID" });
  // }
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleArticle404 = (err, req, res, next) => {
  //console.log(err);
  if (err.code === "23503") {
    //foreign key restraint
    //console.log("23503");
    res.status(404).send({ msg: `article ID does not exist` }); // need to also handle situation where username does not exist
  } else {
    next(err);
  }
};

exports.handleInvalidInput = (err, req, res, next) => {
  // console.log(err);
  if (err.code === "22P02" || err.code === "23502") {
    //
    res.status(400).send({ msg: "Invalid input" });
  } else {
    next(err);
  }
};

exports.handle500 = (err, req, res, next) => {
  console.log(err);
  res.sendStatus(500).send({ msg: "Internal Server Error" });
};
