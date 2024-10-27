const promoRouter = require("express").Router();
const Promotion = require("../models/promotion");
const tokenDecoder = require("../utils/tokenDecoder");
require("dotenv").config();

//get data
promoRouter.get("/", async (req, res) => {
  try {
    const result = await Promotion.findOne({});
    res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

//add new obj
promoRouter.post("/", async (req, res) => {
  const verifiedWithToken = tokenDecoder(req);
  if (!verifiedWithToken) {
    return res.status(401).json({ error: "failed to authenticate with token" });
  }

  const { onPromotion, text } = req.body;

  if (onPromotion === undefined || text === undefined) {
    return res.status(400).json({ error: "missing credentials" });
  }

  try {
    await Promotion.deleteMany({});
    const createdPromoObj = new Promotion({ onPromotion, text });

    const result = await createdPromoObj.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

module.exports = promoRouter;
