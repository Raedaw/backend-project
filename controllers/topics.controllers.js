//const db = require("../db/data");
const { selectTopics } = require("../models/topics.models");

exports.getTopics = (req, res) => {
  console.log("CONTROLLER");
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
