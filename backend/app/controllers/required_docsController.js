const db = require("../models");
const Required_Docs = db.required_docs;

// get all
exports.findAll = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;
  try {
    const required_docss = await Required_Docs.findAll({ offset, limit });
    if (!required_docss || required_docss.length === 0) {
      return res
        .status(404)
        .json({ code: 404, message: "No Required Docs found" });
    }
    res.json({
      code: 200,
      message: "Required Docs retrieved successfully",
      data: required_docss,
    });
  } catch (err) {
    next(err);
  }
};

// get by id
exports.findOne = async (req, res, next) => {
  try {
    const required_docs = await Required_Docs.findByPk(req.params.id);
    if (!required_docs) {
      return res
        .status(404)
        .json({ code: 404, message: "Required Docs not found" });
    }
    res.json({
      code: 200,
      message: "Required Docs retrieved successfully",
      data: required_docs,
    });
  } catch (err) {
    next(err);
  }
};

// create
exports.create = async (req, res, next) => {
  const { id_barang, tipe_dokumen } = req.body;
  try {
    if (!id_barang || !tipe_dokumen) {
      return res
        .status(400)
        .json({ code: 400, message: "Missing required fields" });
    }
    const required_docs = await Required_Docs.create({
      id_barang,
      tipe_dokumen,
    });
    res.status(201).json({
      code: 201,
      message: "Required Docs created successfully",
      data: required_docs,
    });
  } catch (err) {
    next(err);
  }
};

// update by id
exports.update = async (req, res, next) => {
  const { id } = req.params;
  const { id_barang, tipe_dokumen } = req.body;
  try {
    const [num] = await Required_Docs.update(
      { id_barang, tipe_dokumen },
      { where: { id } }
    );
    if (num === 1) {
      res.status(202).json({
        code: 202,
        message: "Required Docs updated successfully",
        data: { id_barang, tipe_dokumen },
      });
    } else {
      res.status(404).json({ code: 404, message: "Required Docs not found" });
    }
  } catch (err) {
    next(err);
  }
};

// delete by id
exports.delete = async (req, res, next) => {
  const { id } = req.params;
  try {
    const num = await Required_Docs.destroy({ where: { id } });
    if (num === 1) {
      res.json({ code: 200, message: "Required Docs deleted successfully" });
    } else {
      res.status(404).json({ code: 404, message: "Required Docs not found" });
    }
  } catch (err) {
    next(err);
  }
};
