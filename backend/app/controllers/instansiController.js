const db = require("../models");
const Instansi = db.instansi;

// get all
exports.findAll = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;
  try {
    const instansis = await Instansi.findAll({ offset, limit });
    if (!instansis || instansis.length === 0) {
      return res.status(404).json({ code: 404, message: "No instansi found" });
    }
    res.json({
      code: 200,
      message: "Instansi retrieved successfully",
      data: instansis,
    });
  } catch (err) {
    next(err);
  }
};

// get by id
exports.findOne = async (req, res, next) => {
  try {
    const instansi = await Instansi.findByPk(req.params.id);
    if (!instansi) {
      return res.status(404).json({ code: 404, message: "Instansi not found" });
    }
    res.json({
      code: 200,
      message: "Instansi retrieved successfully",
      data: instansi,
    });
  } catch (err) {
    next(err);
  }
};

// create
exports.create = async (req, res, next) => {
  const { nama_instansi } = req.body;
  try {
    if (!nama_instansi) {
      return res
        .status(400)
        .json({ code: 400, message: "Missing required fields" });
    }
    const instansi = await Instansi.create({
      nama_instansi,
    });
    res.status(201).json({
      code: 201,
      message: "Instansi created successfully",
      data: instansi,
    });
  } catch (err) {
    next(err);
  }
};

// update by id
exports.update = async (req, res, next) => {
  const { id } = req.params;
  const { nama_instansi } = req.body;
  try {
    const [num] = await Instansi.update({ nama_instansi }, { where: { id } });
    if (num === 1) {
      res.status(202).json({
        code: 202,
        message: "Instansi updated successfully",
        data: { nama_instansi },
      });
    } else {
      res.status(404).json({ code: 404, message: "Instansi not found" });
    }
  } catch (err) {
    next(err);
  }
};

// delete by id
exports.delete = async (req, res, next) => {
  const { id } = req.params;
  try {
    const num = await Instansi.destroy({ where: { id } });
    if (num === 1) {
      res.json({ code: 200, message: "Instansi deleted successfully" });
    } else {
      res.status(404).json({ code: 404, message: "Instansi not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.count = async (req, res, next) => {
  try {
    const count = await Instansi.count();
    res.json({ count });
  } catch (err) {
    next(err);
  }
};
