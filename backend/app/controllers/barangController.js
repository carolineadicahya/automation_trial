const db = require("../models");
const Barang = db.barang;

// get all
exports.findAll = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;
  try {
    const barangs = await Barang.findAll({ offset, limit });
    if (!barangs || barangs.length === 0) {
      return res.status(404).json({ code: 404, message: "No barang found" });
    }
    res.json({
      code: 200,
      message: "Barang retrieved successfully",
      data: barangs,
    });
  } catch (err) {
    next(err);
  }
};

// get by id
exports.findOne = async (req, res, next) => {
  try {
    const barang = await Barang.findByPk(req.params.id);
    if (!barang) {
      return res.status(404).json({ code: 404, message: "Barang not found" });
    }
    res.json({
      code: 200,
      message: "Barang retrieved successfully",
      data: barang,
    });
  } catch (err) {
    next(err);
  }
};

// create
exports.create = async (req, res, next) => {
  const { part_number, hs_code, deskripsi, pos_tarif, status_lartas, satuan } =
    req.body;
  try {
    if (
      !part_number ||
      !hs_code ||
      !deskripsi ||
      !pos_tarif ||
      !status_lartas ||
      !satuan
    ) {
      return res
        .status(400)
        .json({ code: 400, message: "Missing required fields" });
    }
    const barang = await Barang.create({
      part_number,
      hs_code,
      deskripsi,
      pos_tarif,
      status_lartas,
      satuan,
    });
    res.status(201).json({
      code: 201,
      message: "Barang created successfully",
      data: barang,
    });
  } catch (err) {
    next(err);
  }
};

// update by id
exports.update = async (req, res, next) => {
  const { id } = req.params;
  const { hs_code, deskripsi, pos_tarif, status_lartas, satuan } = req.body;
  try {
    const [num] = await Barang.update(
      { hs_code, deskripsi, pos_tarif, status_lartas, satuan },
      { where: { part_number: id } }
    );
    if (num === 1) {
      res.status(202).json({
        code: 202,
        message: "Barang updated successfully",
        data: { hs_code, deskripsi, pos_tarif, status_lartas, satuan },
      });
    } else {
      res.status(404).json({ code: 404, message: "Barang not found" });
    }
  } catch (err) {
    next(err);
  }
};

// delete by id
exports.delete = async (req, res, next) => {
  const { part_number } = req.params;
  try {
    const num = await Barang.destroy({ where: { part_number } });
    if (num === 1) {
      res.json({ code: 200, message: "Barang deleted successfully" });
    } else {
      res.status(404).json({ code: 404, message: "Barang not found" });
    }
  } catch (err) {
    next(err);
  }
};
