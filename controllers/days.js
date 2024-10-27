const daysRouter = require("express").Router();
const Day = require("../models/day");
const path = require("path");
const tokenDecoder = require("../utils/tokenDecoder");
require("dotenv").config();

// Getting all opening days
daysRouter.get("/", (request, response, next) => {
  Day.find({}).then((result) => {
    response.json(result);
  });
});

// Get a specific day by day-name
daysRouter.get("/:openingDay", (request, response, next) => {
  const openingDay = request.params.openingDay;

  Day.findOne({ day: openingDay })
    .then((existingDay) => {
      if (existingDay) {
        response.json(existingDay);
      } else {
        response.status(404).json({ message: "Not a valid day" });
      }
    })
    .catch((error) => response.status(500).json({ error: error }));
});

// Adding a new opening day, if not exists
daysRouter.post("/", (request, response, next) => {
  const { day, open, close } = request.body;
  if (!day || !open || !close) {
    return response.status(400).json({ message: "Content missing" });
  }

  Day.findOne({ day: day })
    .then((existingDay) => {
      if (existingDay) {
        return response.status(400).json({ error: `${day} already exists` });
      }

      const newDay = new Day({ day, open, close });
      return newDay.save();
    })
    .then((result) => {
      response.status(201).end();
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        response.status(400).json({ error: error.message });
      }
    });
});

//  Update a specific days opening time
daysRouter.put("/:openingDay", async (request, response, next) => {
  const verifiedWithToken = tokenDecoder(request);
  if (!verifiedWithToken) {
    return response
      .status(401)
      .json({ error: "failed to authenticate with token" });
  }

  const openingDay = request.params.openingDay;
  const { open, close } = request.body;

  if (open !== null && !open) {
    return response
      .status(400)
      .json({ error: "Invalid or missing properties" });
  }

  if (close !== null && !close) {
    return response
      .status(400)
      .json({ error: "Invalid or missing properties" });
  }

  try {
    const updatedDay = await Day.findOneAndUpdate(
      { day: openingDay },
      { open: open, close: close },
      { new: true, runValidators: true, context: "query" },
    );

    response.status(200).json(updatedDay);
  } catch (error) {
    response.status(400).json({ error });
  }
});

daysRouter.get("*", (request, response) => {
  response.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

module.exports = daysRouter;
