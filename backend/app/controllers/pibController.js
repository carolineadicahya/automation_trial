const db = require("../models");
const PIB = db.pib;

// get all
exports.findAll = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;
  try {
    // Add includes if associations are defined in the model
    const pibs = await PIB.findAll({ offset, limit });
    if (!pibs || pibs.length === 0) {
      return res.status(404).json({ code: 404, message: "No PIB found" });
    }
    res.json({
      code: 200,
      message: "PIB retrieved successfully",
      data: pibs,
    });
  } catch (err) {
    next(err);
  }
};

// get by id
exports.findOne = async (req, res, next) => {
  try {
    // Add includes if associations are defined in the model
    const pib = await PIB.findByPk(req.params.id);
    if (!pib) {
      return res.status(404).json({ code: 404, message: "PIB not found" });
    }
    res.json({
      code: 200,
      message: "PIB retrieved successfully",
      data: pib,
    });
  } catch (err) {
    next(err);
  }
};

// create
exports.create = async (req, res, next) => {
  const {
    id_penjual,
    id_importir,
    id_sarana_pengangkutan,
    tipe_pengangkutan,
    pelabuhan_muat,
    pelabuhan_tujuan,
    tanggal_berangkat,
    ndpbm,
  } = req.body;
  try {
    if (
      !id_penjual ||
      !id_importir ||
      !id_sarana_pengangkutan ||
      !tipe_pengangkutan ||
      !pelabuhan_muat ||
      !pelabuhan_tujuan ||
      !tanggal_berangkat ||
      !ndpbm
    ) {
      return res
        .status(400)
        .json({ code: 400, message: "Missing required fields" });
    }
    const pib = await PIB.create({
      id_penjual,
      id_importir,
      id_sarana_pengangkutan,
      tipe_pengangkutan,
      pelabuhan_muat,
      pelabuhan_tujuan,
      tanggal_berangkat,
      ndpbm,
    });
    res.status(201).json({
      code: 201,
      message: "PIB created successfully",
      data: pib,
    });
  } catch (err) {
    next(err);
  }
};

// update by id
exports.update = async (req, res, next) => {
  const { id } = req.params;
  const {
    id_penjual,
    id_importir,
    id_sarana_pengangkutan,
    tipe_pengangkutan,
    pelabuhan_muat,
    pelabuhan_tujuan,
    tanggal_berangkat,
    ndpbm,
  } = req.body;
  try {
    const [num] = await PIB.update(
      {
        id_penjual,
        id_importir,
        id_sarana_pengangkutan,
        tipe_pengangkutan,
        pelabuhan_muat,
        pelabuhan_tujuan,
        tanggal_berangkat,
        ndpbm,
      },
      { where: { id } }
    );
    if (num === 1) {
      res.status(202).json({
        code: 202,
        message: "PIB updated successfully",
        data: {
          id_penjual,
          id_importir,
          id_sarana_pengangkutan,
          tipe_pengangkutan,
          pelabuhan_muat,
          pelabuhan_tujuan,
          tanggal_berangkat,
          ndpbm,
        },
      });
    } else {
      res.status(404).json({ code: 404, message: "PIB not found" });
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
      res.json({ code: 200, message: "PIB deleted successfully" });
    } else {
      res.status(404).json({ code: 404, message: "PIB not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.count = async (req, res, next) => {
  try {
    const count = await PIB.count();
    res.json({ count });
  } catch (err) {
    next(err);
  }
};
