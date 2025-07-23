const db = require("../models");
const Sarana_Pengangkutan = db.sarana_pengangkutan;

// get all
exports.findAll = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;
  try {
    const sarana_pengangkutans = await Sarana_Pengangkutan.findAll({
      offset,
      limit,
    });
    if (!sarana_pengangkutans || sarana_pengangkutans.length === 0) {
      return res
        .status(404)
        .json({ code: 404, message: "No Sarana Pengangkutan Docs found" });
    }
    res.json({
      code: 200,
      message: "Sarana Pengangkutan retrieved successfully",
      data: sarana_pengangkutans,
    });
  } catch (err) {
    next(err);
  }
};

// get by id
exports.findOne = async (req, res, next) => {
  try {
    const sarana_pengangkutan = await Sarana_Pengangkutan.findByPk(
      req.params.id
    );
    if (!sarana_pengangkutan) {
      return res
        .status(404)
        .json({ code: 404, message: "Sarana Pengangkutan not found" });
    }
    res.json({
      code: 200,
      message: "Sarana Pengangkutan retrieved successfully",
      data: sarana_pengangkutan,
    });
  } catch (err) {
    next(err);
  }
};

// create
exports.create = async (req, res, next) => {
  const { nama, nomor_identitas, bendera } = req.body;
  try {
    if (!nama || !nomor_identitas || !bendera) {
      return res
        .status(400)
        .json({ code: 400, message: "Missing required fields" });
    }
    const sarana_pengangkutan = await Sarana_Pengangkutan.create({
      nama,
      nomor_identitas,
      bendera,
    });
    res.status(201).json({
      code: 201,
      message: "Sarana Pengangkutan created successfully",
      data: sarana_pengangkutan,
    });
  } catch (err) {
    next(err);
  }
};

// update by id
exports.update = async (req, res, next) => {
  const { id } = req.params;
  const { nama, nomor_identitas, bendera } = req.body;
  try {
    const [num] = await Sarana_Pengangkutan.update(
      { nama, nomor_identitas, bendera },
      { where: { id } }
    );
    if (num === 1) {
      res.status(202).json({
        code: 202,
        message: "Sarana Pengangkutan updated successfully",
        data: { nama, nomor_identitas, bendera },
      });
    } else {
      res
        .status(404)
        .json({ code: 404, message: "Sarana Pengangkutan not found" });
    }
  } catch (err) {
    next(err);
  }
};

// delete by id
exports.delete = async (req, res, next) => {
  const { id } = req.params;
  try {
    const num = await Sarana_Pengangkutan.destroy({ where: { id } });
    if (num === 1) {
      res.json({
        code: 200,
        message: "Sarana Pengangkutan deleted successfully",
      });
    } else {
      res
        .status(404)
        .json({ code: 404, message: "Sarana Pengangkutan not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.count = async (req, res, next) => {
  try {
    const count = await Sarana_Pengangkutan.count();
    res.json({ count });
  } catch (err) {
    next(err);
  }
};
