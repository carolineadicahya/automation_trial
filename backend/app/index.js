const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

// Load Sequelize and models
const db = require("./models"); // Make sure ./models/index.js exports sequelize and models

// Sync database
db.sequelize.sync({ alter: true }); // or { force: true } for dropping and recreating

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const barangRoutes = require('./routes/barang');
const detailPibRoutes = require('./routes/detail_pib');
const instansiRoutes = require('./routes/instansi');
const pibRoutes = require('./routes/pib');
const requiredDocsRoutes = require('./routes/required_docs');

app.use('/api/barang', barangRoutes);
app.use('/api/detail_pib', detailPibRoutes);
app.use('/api/instansi', instansiRoutes);
app.use('/api/pib', pibRoutes);
app.use('/api/required_docs', requiredDocsRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => console.log(`Berjalan pada http://localhost:${port}`));
