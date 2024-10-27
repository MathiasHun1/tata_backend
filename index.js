require("dotenv").config();
const app = require("./app");
const morgan = require("morgan");

morgan.token("content", function getContent(req) {
  return JSON.stringify(req.body);
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});
