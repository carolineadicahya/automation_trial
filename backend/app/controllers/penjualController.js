const db = require("../models");
const Penjual = db.penjual;

// get all
exports.findAll = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;
  try {
    const penjuals = await Penjual.findAll({ offset, limit });
    if (!penjuals || penjuals.length === 0) {
      return res.status(404).json({ code: 404, message: "No penjual found" });
    }
    res.json({
      code: 200,
      message: "Penjual retrieved successfully",
      data: penjuals,
    });
  } catch (err) {
    next(err);
  }
};

// get by id
exports.findOne = async (req, res, next) => {
  try {
    const penjual = await Penjual.findByPk(req.params.id);
    if (!penjual) {
      return res.status(404).json({ code: 404, message: "Penjual not found" });
    }
    res.json({
      code: 200,
      message: "Penjual retrieved successfully",
      data: penjual,
    });
  } catch (err) {
    next(err);
  }
};

// create
exports.create = async (req, res, next) => {
  const { nama, alamat } = req.body;
  try {
    if (!nama || !alamat) {
      return res
        .status(400)
        .json({ code: 400, message: "Missing required fields" });
    }
    const penjual = await Penjual.create({
      nama,
      alamat,
    });
    res.status(201).json({
      code: 201,
      message: "Penjual created successfully",
      data: penjual,
    });
  } catch (err) {
    next(err);
  }
};

// update by id
exports.update = async (req, res, next) => {
  const { id } = req.params;
  const { nama, alamat } = req.body;
  try {
    const [num] = await Penjual.update({ nama, alamat }, { where: { id } });
    if (num === 1) {
      res.status(202).json({
        code: 202,
        message: "Penjual updated successfully",
        data: { nama, alamat },
      });
    } else {
      res.status(404).json({ code: 404, message: "Penjual not found" });
    }
  } catch (err) {
    next(err);
  }
};

// delete by id
exports.delete = async (req, res, next) => {
  const { id } = req.params;
  try {
    const num = await Penjual.destroy({ where: { id } });
    if (num === 1) {
      res.json({ code: 200, message: "Penjual deleted successfully" });
    } else {
      res.status(404).json({ code: 404, message: "Penjual not found" });
    }
  } catch (err) {
    next(err);
  }
};
