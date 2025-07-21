const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

// Load Sequelize and models
const db = require("./models"); // Make sure ./models/index.js exports sequelize and models

// Sync database
db.sequelize.sync({ force: true }); // or { force: true } for dropping and recreating

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => console.log(`Berjalan pada http://localhost:${port}`));
