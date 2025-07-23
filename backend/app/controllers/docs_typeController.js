const db = require("../models");
const Docs_Type = db.docs_type;

exports.findAll = async (req, res, next) => {
  try {
    const docsTypes = await Docs_Type.findAll();
    res.json({ code: 200, message: "Docs Types retrieved successfully", data: docsTypes });
  } catch (err) {
    next(err);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const docsType = await Docs_Type.findByPk(req.params.id);
    if (!docsType) {
      return res.status(404).json({ code: 404, message: "Docs Type not found" });
    }
    res.json({ code: 200, message: "Docs Type retrieved successfully", data: docsType });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { nama } = req.body;
    if (!nama) {
      return res.status(400).json({ code: 400, message: "Missing required fields" });
    }
    const docsType = await Docs_Type.create({ nama });
    res.status(201).json({ code: 201, message: "Docs Type created successfully", data: docsType });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { nama } = req.body;
    const [num] = await Docs_Type.update({ nama }, { where: { id: req.params.id } });
    if (num === 1) {
      res.status(202).json({ code: 202, message: "Docs Type updated successfully", data: { nama } });
    } else {
      res.status(404).json({ code: 404, message: "Docs Type not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const num = await Docs_Type.destroy({ where: { id: req.params.id } });
    if (num === 1) {
      res.json({ code: 200, message: "Docs Type deleted successfully" });
    } else {
      res.status(404).json({ code: 404, message: "Docs Type not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.count = async (req, res, next) => {
  try {
    const count = await Docs_Type.count();
    res.json({ count });
  } catch (err) {
    next(err);
  }
}; 