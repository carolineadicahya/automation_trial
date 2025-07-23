const db = require("../models");
const Detail_PIB = db.detail_pib;

// get all
exports.findAll = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;
  try {
    const detail_pibs = await Detail_PIB.findAll({ offset, limit, include: [db.barang, db.pib] });
    if (!detail_pibs || detail_pibs.length === 0) {
      return res.status(404).json({ code: 404, message: "No Detail PIB found" });
    }
    res.json({
      code: 200,
      message: "Detail PIB retrieved successfully",
      data: detail_pibs,
    });
  } catch (err) {
    next(err);
  }
};

// get by id
exports.findOne = async (req, res, next) => {
  try {
    const detail_pib = await Detail_PIB.findByPk(req.params.id, { include: [db.barang, db.pib] });
    if (!detail_pib) {
      return res.status(404).json({ code: 404, message: "Detail PIB not found" });
    }
    res.json({
      code: 200,
      message: "Detail PIB retrieved successfully",
      data: detail_pib,
    });
  } catch (err) {
    next(err);
  }
};

// create
exports.create = async (req, res, next) => {
  const { id_pib, jumlah, dimensi, mata_uang, no_invoice, no_bl } = req.body;
  try {
    if (!id_pib || !jumlah || !dimensi || !mata_uang || !no_invoice || !no_bl) {
      return res
        .status(400)
        .json({ code: 400, message: "Missing required fields" });
    }
    const detail_pib = await Detail_PIB.create({
      id_pib,
      jumlah,
      dimensi,
      mata_uang,
      no_invoice,
      no_bl,
    });
    res.status(201).json({
      code: 201,
      message: "Detail PIB created successfully",
      data: detail_pib,
    });
  } catch (err) {
    next(err);
  }
};

// update by id
exports.update = async (req, res, next) => {
  const { id } = req.params;
  const { id_pib, jumlah, dimensi, mata_uang, no_invoice, no_bl } = req.body;
  try {
    const [num] = await Detail_PIB.update(
      { id_pib, jumlah, dimensi, mata_uang, no_invoice, no_bl },
      { where: { id } }
    );
    if (num === 1) {
      res.status(202).json({
        code: 202,
        message: "Detail PIB updated successfully",
        data: { id_pib, jumlah, dimensi, mata_uang, no_invoice, no_bl },
      });
    } else {
      res.status(404).json({ code: 404, message: "Detail PIB not found" });
    }
  } catch (err) {
    next(err);
  }
};

// delete by id
exports.delete = async (req, res, next) => {
  const { id } = req.params;
  try {
    const num = await Detail_PIB.destroy({ where: { id } });
    if (num === 1) {
      res.json({ code: 200, message: "Detail PIB deleted successfully" });
    } else {
      res.status(404).json({ code: 404, message: "Detail PIB not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.count = async (req, res, next) => {
  try {
    const count = await Detail_PIB.count();
    res.json({ count });
  } catch (err) {
    next(err);
  }
};
