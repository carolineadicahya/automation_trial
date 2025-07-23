const db = require("../models");
const Importir = db.importir;

// Get all importir (with pagination)
exports.findAll = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;
  try {
    const importirs = await Importir.findAll({ offset, limit });
    if (!importirs || importirs.length === 0) {
      return res.status(404).json({ code: 404, message: "No importir found" });
    }
    res.json({ code: 200, message: "Importir retrieved successfully", data: importirs });
  } catch (err) {
    next(err);
  }
};

// Get one importir by id
exports.findOne = async (req, res, next) => {
  try {
    const importir = await Importir.findByPk(req.params.id);
    if (!importir) {
      return res.status(404).json({ code: 404, message: "Importir not found" });
    }
    res.json({ code: 200, message: "Importir retrieved successfully", data: importir });
  } catch (err) {
    next(err);
  }
};

// Create importir
exports.create = async (req, res, next) => {
  const { nitku, nib, alamat } = req.body;
  try {
    if (!nitku || !nib || !alamat) {
      return res.status(400).json({ code: 400, message: "Missing required fields" });
    }
    const importir = await Importir.create({ nitku, nib, alamat });
    res.status(201).json({ code: 201, message: "Importir created successfully", data: importir });
  } catch (err) {
    next(err);
  }
};

// Update importir by id
exports.update = async (req, res, next) => {
  const { id } = req.params;
  const { nitku, nib, alamat } = req.body;
  try {
    const [num] = await Importir.update(
      { nitku, nib, alamat },
      { where: { id } }
    );
    if (num === 1) {
      res.status(202).json({ code: 202, message: "Importir updated successfully", data: { id, nitku, nib, alamat } });
    } else {
      res.status(404).json({ code: 404, message: "Importir not found" });
    }
  } catch (err) {
    next(err);
  }
};

// Delete importir by id
exports.delete = async (req, res, next) => {
  const { id } = req.params;
  try {
    const num = await Importir.destroy({ where: { id } });
    if (num === 1) {
      res.json({ code: 200, message: "Importir deleted successfully" });
    } else {
      res.status(404).json({ code: 404, message: "Importir not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.count = async (req, res, next) => {
  try {
    const count = await Importir.count();
    res.json({ count });
  } catch (err) {
    next(err);
  }
};
