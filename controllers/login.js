const jwt = require("jsonwebtoken");
const loginRouter = require("express").Router();
require("dotenv").config();

loginRouter.post("/", (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return res.status(401).json({ error: "password missing" });
  }
  if (password !== process.env.LOGINPASS) {
    return res.status(401).json({ error: "wrong password" });
  }

  const token = jwt.sign({ name: process.env.SECRET }, process.env.SECRET);
  res.status(200).send({ token });
});

module.exports = loginRouter;
